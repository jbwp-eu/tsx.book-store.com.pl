# Deploy Google Cloud — tsx.book-store.website

Konfiguracja przede wszystkim z **konsoli GCP** (**bez skryptów** bootstrap zasobów chmury). Stack:

| Zasób                        | Rola                                                        |
| ---------------------------- | ----------------------------------------------------------- |
| **VPC**                      | Sieć dla VM                                                 |
| **Compute Engine**           | Jedna maszyna Ubuntu (bez Load Balancera, bez Autoscalingu) |
| **Cloud Storage**            | Obrazy produktów (zamiast AWS S3; używany też z OVH)        |
| **Pub/Sub + Cloud Function** | E-mail potwierdzenia zamówienia (tylko Google)              |
| **MySQL**                    | Zainstalowany **lokalnie na VM** (nie Cloud SQL)            |

Domena: **`tsx.book-store.website`**

Workflow: [`.github/workflows/deploy-gcloud.yml`](../.github/workflows/deploy-gcloud.yml)

```
/var/www/tsx-book-store/
├── current -> releases/<sha>/
├── releases/<sha>/
└── shared/
    ├── .env.production
    └── gcs-sa.json          # opcjonalnie; lepiej SA przypisane do VM
```

Caddy kończy HTTPS i proxy do Node na `127.0.0.1:3003`. DNS dla `tsx.book-store.website` musi wskazywać na VM **przed** pierwszym przeładowaniem Caddy (Let's Encrypt).

**Język:** Polski | [English](README.md)

---

## 1. Konsola — VPC

1. **VPC network** → **Create VPC network**
2. Nazwa np. `tsx-bookstore-vpc`
3. Subnet: custom, region np. `europe-central2` lub `us-central1`, CIDR np. `10.0.1.0/24`
4. Firewall (VPC → Firewall):

| Nazwa             | Kierunek | Cele          | Źródło                                                                    | Protokoły / porty |
| ----------------- | -------- | ------------- | ------------------------------------------------------------------------- | ----------------- |
| `tsx-allow-ssh`   | Ingress  | tag `tsx-web` | Twoje IP, albo `0.0.0.0/0` dla CI, albo `35.235.240.0/20` dla **IAP SSH** | tcp:22            |
| `tsx-allow-http`  | Ingress  | tag `tsx-web` | `0.0.0.0/0`                                                               | tcp:80            |
| `tsx-allow-https` | Ingress  | tag `tsx-web` | `0.0.0.0/0`                                                               | tcp:443           |

Źródło dla HTTP/HTTPS musi być **`0.0.0.0/0`** (nie `0.0.0.0/24`).

**Nie** otwieraj MySQL ani portu aplikacji `3003` na internet.

---

## 2. Konsola — Cloud Storage

1. **Cloud Storage** → **Create bucket**
2. Nazwa np. `tsx-bookstore-images` (unikalna globalnie)
3. Lokalizacja: w miarę możliwości ten sam region co VM
4. Access: Uniform; dla publicznych obrazów albo:
   - nadaj `allUsers` rolę **Object Viewer** i ustaw `GCS_PUBLIC_BASE_URL=https://storage.googleapis.com/<bucket>`, albo
   - zostaw prywatne i używaj V4 signed URLs (domyślnie w kodzie aplikacji)

Utwórz **service account** (przypisz do VM; opcjonalny JSON dla OVH/local):

1. **IAM** → **Service accounts** → Create `tsx-bookstore-gcs`
2. Role: **Storage Object Admin** na bucketcie (lub projekcie); później **Pub/Sub Publisher** na topicu zamówień
3. Keys → JSON → tylko jeśli potrzeba jako `shared/gcs-sa.json` (nigdy nie commituj)

Na Compute Engine preferuj **SA przypisane do VM** z tymi rolami IAM (bez pliku JSON). Access scopes na VM powinny pozwalać na Storage + Pub/Sub (albo Cloud Platform przy prostym setupie testowym).

---

## 3. Konsola — Compute Engine

1. **Compute Engine** → **VM instances** → **Create**
2. Nazwa: `tsx-bookstore`
3. Maszyna: `e2-small` (lub `e2-medium`)
4. Boot disk: Ubuntu 24.04 LTS, 30 GB
5. Sieć: VPC z kroku 1, network tag **`tsx-web`**, **External IPv4** (zarezerwuj statyczne IP, jeśli chcesz stabilny DNS)
6. Service account: `tsx-bookstore-gcs` (lub równoważny) z rolami Storage + Pub/Sub

SSH z konsoli (**IAP**), przeglądarkowe SSH albo `gcloud compute ssh tsx-bookstore --zone=ZONE`. Domyślny port SSH to **22** (w przeciwieństwie do OVH: 49152).

Dalej **§ 4** na VM (ten sam stack co OVH: Node, Caddy, MySQL, katalogi aplikacji).

---

## 4. Setup VM (SSH jako `ubuntu`, port **22**)

Ten sam układ i pakiety co [../deploy-ovh/README.pl.md](../deploy-ovh/README.pl.md) / [../deploy-ovh/README.md](../deploy-ovh/README.md); komendy poniżej są powtórzone, żeby deploy Google był kompletny.

### 4.1 Pakiety + Node 22 + Caddy

```bash
sudo apt-get update
sudo apt-get upgrade -y
sudo apt-get install -y curl git build-essential rsync mysql-server

curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt-get install -y nodejs

sudo apt-get install -y debian-keyring debian-archive-keyring apt-transport-https
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | sudo gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | sudo tee /etc/apt/sources.list.d/caddy-stable.list
sudo apt-get update
sudo apt-get install -y caddy
```

### 4.2 MySQL (lokalnie na VM)

```bash
sudo mysql -e "CREATE DATABASE IF NOT EXISTS bookstore CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
sudo mysql -e "CREATE USER IF NOT EXISTS 'bookstore'@'localhost' IDENTIFIED BY 'CHANGE_ME';"
sudo mysql -e "GRANT ALL ON bookstore.* TO 'bookstore'@'localhost'; FLUSH PRIVILEGES;"
```

MySQL tylko na `127.0.0.1` (nie otwieraj tcp:3306 w firewallu VPC).

### 4.3 Katalogi aplikacji

```bash
sudo mkdir -p /var/www/tsx-book-store/{releases,shared}
sudo chown -R ubuntu:ubuntu /var/www/tsx-book-store
```

### 4.4 Środowisko produkcyjne

```bash
nano /var/www/tsx-book-store/shared/.env.production
```

Wzór: [shared.env.production.example](shared.env.production.example). Wymagane:

- `DEPLOY_TARGET=google` oraz para Stripe `STRIPE_*_TEST_MODE_GOOGLE`
- `FRONTEND_ORIGIN=https://tsx.book-store.website`
- `DB_*` dla lokalnego MySQL
- `GCS_PROJECT_ID`, `GCS_BUCKET_NAME` (preferowane SA VM / ADC; opcjonalnie `GOOGLE_APPLICATION_CREDENTIALS`)
- **Ustaw** `ORDER_CONFIRMATION_TOPIC=tsx-order-confirmation` — maile zamówień idą Pub/Sub → Cloud Function (nie SMTP w procesie Node na VM)

```bash
chmod 600 /var/www/tsx-book-store/shared/.env.production
# jeśli używasz pliku klucza GCS:
chmod 600 /var/www/tsx-book-store/shared/gcs-sa.json
```

Przykładowy fragment:

```env
DEPLOY_TARGET=google
FRONTEND_ORIGIN=https://tsx.book-store.website
ORDER_CONFIRMATION_TOPIC=tsx-order-confirmation
# lub pełna ścieżka: projects/PROJECT_ID/topics/tsx-order-confirmation
GCS_PROJECT_ID=...
GCS_BUCKET_NAME=...
```

### 4.5 Caddyfile

```bash
sudo nano /etc/caddy/Caddyfile
```

Użyj [Caddyfile.example](Caddyfile.example) (`tsx.book-store.website` → `127.0.0.1:3003`).

```bash
sudo systemctl enable caddy
sudo systemctl reload caddy
```

Ustaw DNS (**§ 6**) na IP VM **przed** pierwszym udanym HTTPS (Let's Encrypt).

### 4.6 systemd + skrypt aktywacji

Użyj jednostki i skryptu z OVH (te same ścieżki na VM).

Z laptopa (katalog repozytorium; zamień `USER` i `VM_IP`; SSH na GCE zwykle port **22**):

```bash
scp deploy-ovh/tsx-book-store.service.example USER@VM_IP:/tmp/
scp deploy-ovh/activate-release.sh USER@VM_IP:/tmp/
```

Na VM:

```bash
sudo cp /tmp/tsx-book-store.service.example /etc/systemd/system/tsx-book-store.service
sudo systemctl daemon-reload
sudo systemctl enable tsx-book-store

echo 'ubuntu ALL=(root) NOPASSWD: /bin/systemctl restart tsx-book-store, /bin/systemctl status tsx-book-store' | sudo tee /etc/sudoers.d/tsx-ubuntu
sudo chmod 440 /etc/sudoers.d/tsx-ubuntu

sudo install -m 755 /tmp/activate-release.sh /usr/local/bin/activate-release-gcloud.sh
```

Plik jednostki: [../deploy-ovh/tsx-book-store.service.example](../deploy-ovh/tsx-book-store.service.example)  
Aktywacja: [../deploy-ovh/activate-release.sh](../deploy-ovh/activate-release.sh)

GitHub Actions wywołuje `activate-release-gcloud.sh <sha>`, albo fallback: `releases/<sha>/deploy-ovh/activate-release.sh`.

---

## 5. Konsola — Pub/Sub + Cloud Function (mail zamówienia)

### 5.1 Topic

1. **Pub/Sub** → **Topics** → **Create topic** `tsx-order-confirmation`
2. Subskrypcję twórz tylko do debugowania; Cloud Function zakłada własną subskrypcję triggera

### 5.2 Cloud Function

1. **Cloud Functions** → **Create function**
2. Środowisko: **2nd gen**, nazwa `tsx-order-confirmation-email`
3. Runtime: **Node.js 20** (lub 22), entry point: **`orderConfirmation`**
4. Pamięć **256 MB**, timeout **60 s**
5. Authentication: **Require authentication** → tylko **IAM** (nie publiczne, nie IAP)
6. Ingress: najpierw **Internal**; **All**, jeśli Eventarc nie może wywołać funkcji
7. Zmienne środowiskowe (Runtime / Variables & Secrets — **na Function**, nie tylko na VM):  
   `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD`, `DOMAIN`, `TO_3`, `STORE_NAME=BookStore`
8. Wgraj źródło z [`../cloud-functions/order-confirmation`](../cloud-functions/order-confirmation) (`index.js` + `package.json` — edytor inline, ZIP albo Cloud Storage). **Nie** zostawiaj przykładowego entry pointu `helloPubSub`.

#### Trigger Eventarc (2nd gen)

Cloud Functions 2nd gen łączy Pub/Sub przez **Eventarc**.

1. Jeśli konsola prosi o API: włącz **Eventarc API** (Pub/Sub API powinno być już Enabled).
2. **Trigger type:** Google sources
3. **Event provider:** Cloud Pub/Sub
4. **Event type:** `google.cloud.pubsub.topic.v1.messagePublished`
5. **Cloud Pub/Sub topic:** wybierz istniejący **`tsx-order-confirmation`**
   - **Nie** zaznaczaj „A new Pub/Sub topic will be created for you”
6. **Region:** ten sam co Function (np. `europe-west1`)
7. **Service URL path:** `/`
8. **Service account** (tożsamość triggera): domyślne Compute Engine na start wystarczy
9. **Enable retry on failure:** opcjonalnie, zalecane

**Ostrzeżenie IAM (nadaj rolę):**

> Cloud Pub/Sub potrzebuje `roles/iam.serviceAccountTokenCreator` na  
> `service-PROJECT_NUMBER@gcp-sa-pubsub.iam.gserviceaccount.com`

Użyj przycisku **Grant** w konsoli albo **IAM** → Grant access → ten principal → rola **Service Account Token Creator**.  
To systemowe SA Pub/Sub Google (nie `tsx-bookstore-gcs`).

Nadaj SA VM (`tsx-bookstore-gcs@…`) rolę **Pub/Sub Publisher** na topicu `tsx-order-confirmation` (topic → Permissions).

Dobre domyślne billing/scaling: **Request-based**, min. instancji **0**, max np. **5**. Wyłącz: VPC connector, HTTP/2, session affinity, własne klucze KMS, Service Mesh.

Ścieżka w backendzie: webhook Stripe → `sendPurchaseReceipt` → `tryEnqueueOrderConfirmation` → Pub/Sub → ta Function.

---

## 6. DNS

U hosta DNS dla `book-store.website`:

| Typ | Nazwa | Wartość                      |
| --- | ----- | ---------------------------- |
| A   | `tsx` | Zewnętrzne IP Compute Engine |

---

## 7. Stripe

Endpoint webhooka:

```
https://tsx.book-store.website/api/webhooks/stripe
```

Użyj pary sekretów Stripe **GOOGLE** (`STRIPE_*_TEST_MODE_GOOGLE`).

---

## 8. GitHub — sekrety i zmienne

**Secrets:** `GCLOUD_HOST`, `GCLOUD_SSH_KEY`, `VITE_STRIPE_PUBLISHABLE_KEY_TEST_MODE_GOOGLE`

**Variables:** `DEPLOY_BASE_URL_GCLOUD=https://tsx.book-store.website`, opcjonalnie `GCLOUD_USER` (domyślnie `ubuntu`), opcjonalnie `GCLOUD_SSH_PORT` (domyślnie `22`)

Klucz publiczny deployu w `~/.ssh/authorized_keys` użytkownika na VM. Firewall musi przepuszczać CI (lub Twoje IP) na tcp:22, albo zewnętrzne IP + auth kluczem.

---

## 9. Deploy kodu aplikacji

**Actions** → **Deploy to Google Cloud** → **Run workflow** (gałąź `main`).

Albo ręcznie: build lokalnie, `rsync` do `/var/www/tsx-book-store/releases/<sha>/`, uruchom `activate-release-gcloud.sh <sha>` (lub `deploy-ovh/activate-release.sh`).

Bez Load Balancera i bez Managed Instance Group / Autoscalera — jedna VM za Caddy.

---

## 10. Weryfikacja

```bash
curl -sS https://tsx.book-store.website/
sudo systemctl status tsx-book-store
journalctl -u tsx-book-store -e
```

### Seed bazy (produkty + admin)

Po pierwszym deployu Sequelize tworzy puste tabele. Seed uruchom raz z aktywnego release (wymaga `shared/.env.production` jako `.env`, w tym `ADMIN_PASSWORD` i `DB_*`):

```bash
cd /var/www/tsx-book-store/current
node backend/dist/seeder.js -i          # import produktów i userów
# node backend/dist/seeder.js -d        # UWAGA: kasuje products, users, orders, messages
```

(`npm run seed` / `npm run seed:destroy` używają `tsx` — lokalnie przy pełnym `npm ci`; na VM lepiej `node backend/dist/seeder.js`, bo produkcyjny `npm ci --omit=dev` nie instaluje `tsx`.)

Admin po seedzie: email `admin@test.pl`, hasło = `ADMIN_PASSWORD` z env. Kod: `backend/seeder.ts`, `backend/users.ts`, `backend/products.ts`.

### Mail po zakupie (Pub/Sub + Cloud Function)

Na Google ustaw `ORDER_CONFIRMATION_TOPIC`. VM publikuje; Function wysyła SMTP (`SMTP_*` na Function). W logach Function szukaj `[CloudFunction] orderConfirmation invoked`.
