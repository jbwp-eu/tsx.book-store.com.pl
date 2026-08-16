# Deploy Google Cloud — tsx.book-store.website

Console-first setup (**no helper scripts** for GCP resources). Stack:

| Resource                     | Role                                                 |
| ---------------------------- | ---------------------------------------------------- |
| **VPC**                      | Network for the VM                                   |
| **Compute Engine**           | Single Ubuntu VM (no Load Balancer, no Autoscaling)  |
| **Cloud Storage**            | Product images (replaces AWS S3; also used from OVH) |
| **Pub/Sub + Cloud Function** | Order confirmation email (Google only)               |
| **MySQL**                    | Installed **locally on the VM** (not Cloud SQL)      |

Domain: **`tsx.book-store.website`**

Workflow: [`.github/workflows/deploy-gcloud.yml`](../.github/workflows/deploy-gcloud.yml)

```
/var/www/tsx-book-store/
├── current -> releases/<sha>/
├── releases/<sha>/
└── shared/
    ├── .env.production
    └── gcs-sa.json          # optional; prefer VM service account
```

Caddy terminates HTTPS and proxies to Node on `127.0.0.1:3003`. DNS for `tsx.book-store.website` must point at the VM before the first Caddy reload (Let's Encrypt).

**Language:** [Polski](README.pl.md) | English

---

## 1. Console — VPC

1. **VPC network** → **Create VPC network**
2. Name e.g. `tsx-bookstore-vpc`
3. Subnet: custom, region e.g. `europe-central2` or `us-central1`, CIDR e.g. `10.0.1.0/24`
4. Firewall (VPC → Firewall):

| Name              | Direction | Targets          | Source                                                               | Protocols / ports |
| ----------------- | --------- | ---------------- | -------------------------------------------------------------------- | ----------------- |
| `tsx-allow-ssh`   | Ingress   | tagged `tsx-web` | your IP, or `0.0.0.0/0` for CI, or `35.235.240.0/20` for **IAP SSH** | tcp:22            |
| `tsx-allow-http`  | Ingress   | tagged `tsx-web` | `0.0.0.0/0`                                                          | tcp:80            |
| `tsx-allow-https` | Ingress   | tagged `tsx-web` | `0.0.0.0/0`                                                          | tcp:443           |

Source for HTTP/HTTPS must be **`0.0.0.0/0`**

Do **not** open MySQL or app port `3003` to the internet.

---

## 2. Console — Cloud Storage

1. **Cloud Storage** → **Create bucket**
2. Name e.g. `tsx-bookstore-images` (globally unique)
3. Location: same region as the VM when possible
4. Access: Uniform; for public images either:
   - grant `allUsers` **Object Viewer** and set `GCS_PUBLIC_BASE_URL=https://storage.googleapis.com/<bucket>`, or
   - keep private and use V4 signed URLs (default in app code)

Create a **service account** (attach to the VM; optional JSON for OVH/local):

1. **IAM** → **Service accounts** → Create `tsx-bookstore-gcs`
2. Roles: **Storage Object Admin** on the bucket (or project); later **Pub/Sub Publisher** on the order topic
3. Keys → JSON → only if needed as `shared/gcs-sa.json` (never commit)

On Compute Engine prefer the **VM service account** with those IAM roles (no JSON file). Access scopes on the VM should allow Storage + Pub/Sub (or Cloud Platform for a simple test setup).

---

## 3. Console — Compute Engine

1. **Compute Engine** → **VM instances** → **Create**
2. Name: `tsx-bookstore`
3. Machine: `e2-small` (or `e2-medium`)
4. Boot disk: Ubuntu 24.04 LTS, 30 GB
5. Network: VPC from step 1, network tag **`tsx-web`**, **External IPv4** (reserve a static IP if you want stable DNS)
6. Service account: `tsx-bookstore-gcs` (or equivalent) with Storage + Pub/Sub roles

SSH from Console (**IAP**), browser SSH, or `gcloud compute ssh tsx-bookstore --zone=ZONE`. Default SSH port is **22** (unlike OVH’s 49152).

Then continue with **§ 4** on the VM (same stack as OVH: Node, Caddy, MySQL, app dirs).

---

## 4. VM setup (SSH as `ubuntu`, port **22**)

Same layout and packages as [../deploy-ovh/README.md](../deploy-ovh/README.md); commands below are repeated so Google deploy is self-contained.

### 4.1 Packages + Node 22 + Caddy

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

### 4.2 MySQL (local on VM)

```bash
sudo mysql -e "CREATE DATABASE IF NOT EXISTS bookstore CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
sudo mysql -e "CREATE USER IF NOT EXISTS 'bookstore'@'localhost' IDENTIFIED BY 'CHANGE_ME';"
sudo mysql -e "GRANT ALL ON bookstore.* TO 'bookstore'@'localhost'; FLUSH PRIVILEGES;"
```

Keep MySQL bound to `127.0.0.1` only (do not expose tcp:3306 in VPC firewall).

### 4.3 App directories

```bash
sudo mkdir -p /var/www/tsx-book-store/{releases,shared}
sudo chown -R ubuntu:ubuntu /var/www/tsx-book-store
```

### 4.4 Production environment

```bash
nano /var/www/tsx-book-store/shared/.env.production
```

Use [shared.env.production.example](shared.env.production.example). Required:

- `DEPLOY_TARGET=google` and Stripe pair `STRIPE_*_TEST_MODE_GOOGLE`
- `FRONTEND_ORIGIN=https://tsx.book-store.website`
- `DB_*` for local MySQL
- `GCS_PROJECT_ID`, `GCS_BUCKET_NAME` (VM SA / ADC preferred; optional `GOOGLE_APPLICATION_CREDENTIALS`)
- **Set** `ORDER_CONFIRMATION_TOPIC=tsx-order-confirmation` — order emails go via Pub/Sub → Cloud Function (not in-process SMTP on the VM)

```bash
chmod 600 /var/www/tsx-book-store/shared/.env.production
# if using a GCS key file:
chmod 600 /var/www/tsx-book-store/shared/gcs-sa.json
```

Example fragment:

```env
DEPLOY_TARGET=google
FRONTEND_ORIGIN=https://tsx.book-store.website
ORDER_CONFIRMATION_TOPIC=tsx-order-confirmation
# or full: projects/PROJECT_ID/topics/tsx-order-confirmation
GCS_PROJECT_ID=...
GCS_BUCKET_NAME=...
```

### 4.5 Caddyfile

```bash
sudo nano /etc/caddy/Caddyfile
```

Use [Caddyfile.example](Caddyfile.example) (`tsx.book-store.website` → `127.0.0.1:3003`).

```bash
sudo systemctl enable caddy
sudo systemctl reload caddy
```

Point DNS (**§ 6**) at the VM **before** the first successful HTTPS reload (Let's Encrypt).

### 4.6 systemd + activate script

Reuse the OVH unit and activate script (same paths on the VM).

From your laptop (repo root; replace `USER` and `VM_IP`; GCE SSH is usually port **22**):

```bash
scp deploy-ovh/tsx-book-store.service.example USER@VM_IP:/tmp/
scp deploy-ovh/activate-release.sh USER@VM_IP:/tmp/
```

On the VM:

```bash
sudo cp /tmp/tsx-book-store.service.example /etc/systemd/system/tsx-book-store.service
sudo systemctl daemon-reload
sudo systemctl enable tsx-book-store

echo 'ubuntu ALL=(root) NOPASSWD: /bin/systemctl restart tsx-book-store, /bin/systemctl status tsx-book-store' | sudo tee /etc/sudoers.d/tsx-ubuntu
sudo chmod 440 /etc/sudoers.d/tsx-ubuntu

sudo install -m 755 /tmp/activate-release.sh /usr/local/bin/activate-release-gcloud.sh
```

Unit file: [../deploy-ovh/tsx-book-store.service.example](../deploy-ovh/tsx-book-store.service.example)  
Activate: [../deploy-ovh/activate-release.sh](../deploy-ovh/activate-release.sh)

GitHub Actions calls `activate-release-gcloud.sh <sha>`, or falls back to the copy under `releases/<sha>/deploy-ovh/activate-release.sh`.

---

## 5. Console — Pub/Sub + Cloud Function (order email)

### 5.1 Topic

1. **Pub/Sub** → **Topics** → **Create topic** `tsx-order-confirmation`
2. Create a subscription only if you need debugging; Cloud Function creates its own trigger subscription

### 5.2 Cloud Function

1. **Cloud Functions** → **Create function**
2. Environment: **2nd gen**, name `tsx-order-confirmation-email`
3. Runtime: **Node.js 20** (or 22), entry point: **`orderConfirmation`**
4. Memory **256 MB**, timeout **60 s**
5. Authentication: **Require authentication** → **IAM** only (not public, not IAP)
6. Ingress: **Internal** first; use **All** if Eventarc cannot invoke
7. Environment variables (Runtime / Variables & Secrets — **on the Function**, not only on the VM):  
   `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD`, `DOMAIN`, `TO_3`, `STORE_NAME=BookStore`
8. Upload source from repo folder [`../cloud-functions/order-confirmation`](../cloud-functions/order-confirmation) (`index.js` + `package.json` via inline editor, ZIP, or Cloud Storage). Do **not** leave the sample entry point `helloPubSub`.

#### Eventarc trigger (2nd gen)

Cloud Functions 2nd gen wires Pub/Sub through **Eventarc**.

1. If prompted **Enable APIs**: enable **Eventarc API** (Pub/Sub API should already be Enabled).
2. **Trigger type:** Google sources
3. **Event provider:** Cloud Pub/Sub
4. **Event type:** `google.cloud.pubsub.topic.v1.messagePublished`
5. **Cloud Pub/Sub topic:** select existing **`tsx-order-confirmation`**
   - Do **not** check “A new Pub/Sub topic will be created for you”
6. **Region:** same as the function (e.g. `europe-west1`)
7. **Service URL path:** `/`
8. **Service account** (trigger identity): Compute Engine default is fine for a first setup
9. **Enable retry on failure:** optional but recommended

**IAM warning (grant it):**

> Cloud Pub/Sub needs `roles/iam.serviceAccountTokenCreator` on  
> `service-PROJECT_NUMBER@gcp-sa-pubsub.iam.gserviceaccount.com`

Use the console **Grant** button, or **IAM** → Grant access → that principal → role **Service Account Token Creator**.  
This is Google’s Pub/Sub system SA (not `tsx-bookstore-gcs`).

Grant the **VM service account** (`tsx-bookstore-gcs@…`) role **Pub/Sub Publisher** on topic `tsx-order-confirmation` (topic → Permissions).

Billing / scaling defaults that work: **Request-based**, min instances **0**, max e.g. **5**. Leave VPC connector, HTTP/2, session affinity, KMS customer keys, Service Mesh off.

Backend path: Stripe webhook → `sendPurchaseReceipt` → `tryEnqueueOrderConfirmation` → Pub/Sub → this Function.

---

## 6. DNS

At your DNS host for `book-store.website`:

| Type | Name  | Value                      |
| ---- | ----- | -------------------------- |
| A    | `tsx` | Compute Engine external IP |

---

## 7. Stripe

Webhook endpoint:

```
https://tsx.book-store.website/api/webhooks/stripe
```

Use the **GOOGLE** Stripe secret / webhook secret pair (`STRIPE_*_TEST_MODE_GOOGLE`).

---

## 8. GitHub — secrets and variables

**Secrets:** `GCLOUD_HOST`, `GCLOUD_SSH_KEY`, `VITE_STRIPE_PUBLISHABLE_KEY_TEST_MODE_GOOGLE`, `VITE_GOOGLE_MAPS_API_KEY`

**Variables:** `DEPLOY_BASE_URL_GCLOUD=https://tsx.book-store.website`, optional `GCLOUD_USER` (default `ubuntu`), optional `GCLOUD_SSH_PORT` (default `22`), optional `VITE_GOOGLE_MAPS_MAP_ID`, optional `VITE_STORE_NAME` / `VITE_STORE_LATITUDE` / `VITE_STORE_LONGITUDE`

Deploy public key in the VM user’s `~/.ssh/authorized_keys`. Firewall must allow CI (or your IP) on tcp:22, or use a reachable external IP + key auth.

---

## 9. Deploy app code

**Actions** → **Deploy to Google Cloud** → **Run workflow** (branch `main`).

Or manually: build locally, `rsync` to `/var/www/tsx-book-store/releases/<sha>/`, run `activate-release-gcloud.sh <sha>` (or `deploy-ovh/activate-release.sh`).

No Load Balancer and no Managed Instance Group / Autoscaler — one VM behind Caddy.

---

## 10. Verify

```bash
curl -sS https://tsx.book-store.website/
sudo systemctl status tsx-book-store
journalctl -u tsx-book-store -e
```

### Database seed (products + admin user)

After the first deploy, Sequelize creates empty tables. Seed once from the active release (needs `shared/.env.production` linked as `.env`, including `ADMIN_PASSWORD` and `DB_*`):

```bash
cd /var/www/tsx-book-store/current
node backend/dist/seeder.js -i          # import products + users
# node backend/dist/seeder.js -d        # WARNING: deletes products, users, orders, messages
```

(`npm run seed` / `npm run seed:destroy` use `tsx` and work locally with full `npm ci`; on the VM prefer `node backend/dist/seeder.js` because production install uses `--omit=dev`.)

Seeded admin: email `admin@test.pl`, password = `ADMIN_PASSWORD` from env. Source: `backend/seeder.ts`, `backend/users.ts`, `backend/products.ts`.

### Mail after purchase (Pub/Sub + Cloud Function)

On Google set `ORDER_CONFIRMATION_TOPIC`. The VM publishes; the Function sends SMTP (`SMTP_*` on the Function). Check Function logs for `[CloudFunction] orderConfirmation invoked`.
