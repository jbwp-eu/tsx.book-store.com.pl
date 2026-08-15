# [tsx.book-store.com.pl](https://tsx.book-store.com.pl)

**Język:** Polski | [English](README.en.md)

Full-stackowy sklep z książkami (monorepo): SPA **React 19** + **Vite** z **Tailwind CSS v4**, **shadcn/ui**, **Redux Toolkit** i **React Router v7**; REST API **Express** z **Sequelize**, **MySQL** i **JWT**. Płatności: **Stripe**; zdjęcia: **Google Cloud Storage**. Testy e2e: **Cypress**.

**Live (OVH):** [https://tsx.book-store.com.pl/](https://tsx.book-store.com.pl/)  
**Live (Google Cloud):** [https://tsx.book-store.website/](https://tsx.book-store.website/)

## Co robi aplikacja

- **Katalog** — lista produktów, wyszukiwanie, filtrowanie, sortowanie, paginacja, szczegóły, recenzje, karuzela wyróżnionych
- **Konto** — rejestracja / logowanie (JWT), profil, moje zamówienia i recenzje
- **Zakup** — koszyk → adres wysyłki → metoda płatności → złożenie zamówienia
- **Płatności** — Stripe (Payment Intent + webhook)
- **Admin** — overview (sprzedaż), produkty, użytkownicy, zamówienia, recenzje
- **i18n** — PL / EN, motyw jasny/ciemny, mapa lokalizacji sklepu
- **Kontakt** — formularz z wysyłką e-mail (SMTP)
- **Media** — upload obrazów do **Cloud Storage** (GCS)

## Stack

| Warstwa | Technologie |
| -------- | ------------- |
| **Backend** | Node.js, Express 5, TypeScript (`tsx`), Sequelize, MySQL, JWT, Stripe, Multer, Nodemailer, **@google-cloud/storage**, **@google-cloud/pubsub** |
| **Frontend** | React 19, Vite, TypeScript, React Router, Redux Toolkit, Tailwind CSS 4, shadcn/ui, Formik + Yup, i18next, Stripe.js, Recharts |
| **Dane** | MySQL (lokalnie na VPS / Compute Engine), obrazy w **GCS** |
| **Deploy** | OVH VPS + Caddy; Google Cloud (VPC, Compute Engine, GCS, Cloud Function) — bez LB / Auto Scaling |
| **Testy** | Cypress (e2e) |

## Struktura repo

```
backend/                 # Express REST API + Sequelize
frontend/                # React SPA (Vite)
deploy-ovh/              # bootstrap OVH + Caddy / systemd
deploy-gcloud/           # instrukcja Console GCP
cloud-functions/         # Cloud Function — mail po zakupie (tylko Google)
.github/workflows/       # deploy-ovh.yml, deploy-gcloud.yml
```

## Uruchomienie lokalne

Wymagania: Node.js 18+, MySQL.

```bash
npm install
npm install --prefix frontend
cp .env.example .env
cp frontend/.env.example frontend/.env.local
```

Uzupełnij `.env` (`DEPLOY_TARGET`, Stripe `*_OVH` / `*_GOOGLE`, SMTP, opcjonalnie GCS) oraz `frontend/.env.local`.

```bash
npm run seed   # opcjonalnie
npm run dev
```

| Komenda | Opis |
| ------- | ---- |
| `npm run server` | backend (`tsx watch`) |
| `npm run client` | frontend (Vite) |
| `npm run build` | backend + frontend (produkcja) |
| `npm run start` | `node backend/dist/server.js` (serwuuje też `frontend/dist`) |
| `npm test` | Cypress |

## Deploy

| Środowisko | Domena | Dokumentacja |
| ---------- | ------ | ------------ |
| **OVH** | `tsx.book-store.com.pl` | [deploy-ovh/README.pl.md](deploy-ovh/README.pl.md) · [EN](deploy-ovh/README.md) |
| **Google Cloud** | `tsx.book-store.website` | [deploy-gcloud/README.pl.md](deploy-gcloud/README.pl.md) · [EN](deploy-gcloud/README.md) |

- **Obrazy:** wspólny bucket **Cloud Storage** (OVH i GCP).
- **Mail po płatności:** OVH — SMTP w procesie Node; Google — **Pub/Sub → Cloud Function**.
- **Stripe:** `DEPLOY_TARGET` / `VITE_DEPLOY_TARGET` = `ovh` \| `google` oraz pary `*_TEST_MODE_OVH` / `*_TEST_MODE_GOOGLE`.

Webhooki Stripe:

- OVH: `https://tsx.book-store.com.pl/api/webhooks/stripe`
- Google: `https://tsx.book-store.website/api/webhooks/stripe`
