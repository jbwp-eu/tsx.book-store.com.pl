# Deploy OVH — tsx.book-store.com.pl

Install the app on a new Ubuntu VPS (same layout as gql / nest).

Workflow: [`.github/workflows/deploy-ovh.yml`](../.github/workflows/deploy-ovh.yml)

```
/var/www/tsx-book-store/
├── current -> releases/<sha>/
├── releases/<sha>/
└── shared/
    ├── .env.production
    └── gcs-sa.json          # optional GCS service account
```

Caddy terminates HTTPS and proxies to Node on `127.0.0.1:3003`. DNS for `tsx.book-store.com.pl` must point at this VPS before the first Caddy reload (Let's Encrypt).

**Language:** [Polski](README.pl.md) | English

---

## 1. Server setup (SSH as `ubuntu`, port **49152**)

### 1.1 Packages + Node 22 + Caddy

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

### 1.2 MySQL (local on VPS)

```bash
sudo mysql -e "CREATE DATABASE IF NOT EXISTS bookstore CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
sudo mysql -e "CREATE USER IF NOT EXISTS 'bookstore'@'localhost' IDENTIFIED BY 'CHANGE_ME';"
sudo mysql -e "GRANT ALL ON bookstore.* TO 'bookstore'@'localhost'; FLUSH PRIVILEGES;"
```

Keep MySQL bound to `127.0.0.1` only.

### 1.3 App directories

```bash
sudo mkdir -p /var/www/tsx-book-store/{releases,shared}
sudo chown -R ubuntu:ubuntu /var/www/tsx-book-store
```

### 1.4 Production environment

```bash
nano /var/www/tsx-book-store/shared/.env.production
```

Use [shared.env.production.example](shared.env.production.example). Required:

- `DEPLOY_TARGET=ovh` and Stripe pair `STRIPE_*_TEST_MODE_OVH`
- `FRONTEND_ORIGIN=https://tsx.book-store.com.pl`
- `DB_*` for local MySQL
- `GCS_*` + `GOOGLE_APPLICATION_CREDENTIALS` (Cloud Storage; same bucket as Google Cloud deploy)
- **Do not set** `ORDER_CONFIRMATION_TOPIC` — order emails go via SMTP in Node

```bash
chmod 600 /var/www/tsx-book-store/shared/.env.production
# if using a GCS key file:
chmod 600 /var/www/tsx-book-store/shared/gcs-sa.json
```

### 1.5 Caddyfile

```bash
sudo nano /etc/caddy/Caddyfile
```

Use [Caddyfile.example](Caddyfile.example).

```bash
sudo systemctl enable caddy
sudo systemctl reload caddy
```

### 1.6 systemd + activate script

```bash
scp -P 49152 deploy-ovh/tsx-book-store.service.example ubuntu@<OVH_HOST>:/tmp/
ssh -p 49152 ubuntu@<OVH_HOST> \
  'sudo cp /tmp/tsx-book-store.service.example /etc/systemd/system/tsx-book-store.service && sudo systemctl daemon-reload && sudo systemctl enable tsx-book-store'

echo 'ubuntu ALL=(root) NOPASSWD: /bin/systemctl restart tsx-book-store, /bin/systemctl status tsx-book-store' | sudo tee /etc/sudoers.d/tsx-ubuntu
sudo chmod 440 /etc/sudoers.d/tsx-ubuntu

scp -P 49152 deploy-ovh/activate-release.sh ubuntu@<OVH_HOST>:/tmp/
ssh -p 49152 ubuntu@<OVH_HOST> \
  'sudo install -m 755 /tmp/activate-release.sh /usr/local/bin/activate-release-ovh.sh'
```

---

## 2. GitHub — secrets and variables

**Secrets:** `OVH_HOST`, `OVH_SSH_KEY`, `VITE_STRIPE_PUBLISHABLE_KEY_TEST_MODE_OVH`

**Variables:** `DEPLOY_BASE_URL_OVH=https://tsx.book-store.com.pl`, optional `OVH_USER` (default `ubuntu`)

SSH port is **49152**. Deploy public key in `~/.ssh/authorized_keys`.

---

## 3. Deploy

**Actions** → **Deploy to OVH** → **Run workflow** (branch `main`).

Stripe webhook: `https://tsx.book-store.com.pl/api/webhooks/stripe`

---

## 4. Verify

```bash
curl -sS https://tsx.book-store.com.pl/
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

(`npm run seed` / `npm run seed:destroy` use `tsx` locally; on the VPS prefer `node backend/dist/seeder.js` because production `npm ci --omit=dev` omits `tsx`.)

Seeded admin: email `admin@test.pl`, password = `ADMIN_PASSWORD` from env.

### Mail after purchase (SMTP, no Cloud Function)

On OVH leave `ORDER_CONFIRMATION_TOPIC` empty. The webhook calls Nodemailer directly (`SMTP_*`, `DOMAIN`, `TO_3`).
