# Deploy OVH — tsx.book-store.com.pl

Instalacja na nowym VPS Ubuntu (ten sam model co gql / nest).

Workflow: [`.github/workflows/deploy-ovh.yml`](../.github/workflows/deploy-ovh.yml)

**Język:** Polski | [English](README.md)

Szczegóły kroków (pakiety, MySQL, Caddy, systemd, sekrety GitHub) — w [README.md](README.md) (EN). Poniżej skrót po polsku.

## DNS

W strefie `book-store.com.pl`: rekord **A** `tsx` → publiczne IP VPS.

## Firewall

| Port | Usługa |
|------|--------|
| 49152/tcp | SSH |
| 80 / 443 | Caddy (HTTP/HTTPS) |

MySQL i Node (`3003`) tylko na `127.0.0.1`.

## Bootstrap

1. Node 22, git, rsync, Caddy, **MySQL lokalnie**
2. Katalogi `/var/www/tsx-book-store/{releases,shared}`
3. `shared/.env.production` — wzór [shared.env.production.example](shared.env.production.example)
   - `DEPLOY_TARGET=ovh`, Stripe `*_TEST_MODE_OVH`
   - GCS (`GCS_*`, plik SA)
   - **bez** `ORDER_CONFIRMATION_TOPIC` (mail SMTP w Node)
4. systemd + `activate-release-tsx.sh`
5. Webhook Stripe: `https://tsx.book-store.com.pl/api/webhooks/stripe`

## Deploy

**Actions** → **Deploy to OVH** → branch `main`.

## Seed bazy

Po pierwszym deployu (puste tabele):

```bash
cd /var/www/tsx-book-store/current
node backend/dist/seeder.js -i
```

Admin: `admin@test.pl` / `ADMIN_PASSWORD` z `shared/.env.production`. Szczegóły: [README.md § 4](README.md#database-seed-products--admin-user).
