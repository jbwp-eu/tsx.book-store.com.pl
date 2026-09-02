# [tsx.book-store.com.pl](http://tsx.book-store.com.pl)

**Language:** [Polski](README.md) | English

A full-stack online bookstore monorepo: **React 19** + **Vite** SPA with **Tailwind CSS v4**, **shadcn/ui**, **Redux Toolkit**, and **React Router v7**; **Express** REST API with **Sequelize**, **MySQL**, and **JWT**. Payments via **Stripe**; product images on **Google Cloud Storage**. End-to-end tests with **Cypress**.

**Live (OVH):** [https://tsx.book-store.com.pl/](https://tsx.book-store.com.pl/)

or

**Live (Google Cloud):** [https://tsx.book-store.website/](https://tsx.book-store.website/)

## What the app does

- **Catalog** — product list, search, filtering, sorting, pagination, details, reviews, featured carousel
- **Account** — register / login (JWT), profile, my orders and reviews
- **Purchase** — cart → shipping address → payment method → place order
- **Payments** — Stripe (Payment Intent + webhook)
- **Admin** — overview (sales), products, users, orders, reviews
- **i18n** — PL / EN, light/dark theme, store locator map
- **Contact** — form with email delivery (SMTP)
- **Media** — product image uploads to **Cloud Storage** (GCS)

## Stack

| Layer        | Technologies                                                                                                                                   |
| ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| **Backend**  | Node.js, Express 5, TypeScript (`tsx`), Sequelize, MySQL, JWT, Stripe, Multer, Nodemailer, **@google-cloud/storage**, **@google-cloud/pubsub** |
| **Frontend** | React 19, Vite, TypeScript, React Router, Redux Toolkit, Tailwind CSS 4, shadcn/ui, Formik + Yup, i18next, Stripe.js, Recharts                 |
| **Data**     | MySQL (local on VPS / Compute Engine), images on **GCS**                                                                                       |
| **Deploy**   | OVH VPS + Caddy; Google Cloud (VPC, Compute Engine, GCS, Cloud Function) — no LB / Autoscaling                                                 |
| **Tests**    | Cypress (e2e)                                                                                                                                  |

## Repo structure

```
backend/                 # Express REST API + Sequelize
frontend/                # React SPA (Vite)
deploy-ovh/              # OVH bootstrap + Caddy / systemd
deploy-gcloud/           # GCP Console guide
cloud-functions/         # order-confirmation Cloud Function (Google only)
.github/workflows/       # deploy-ovh.yml, deploy-gcloud.yml
```

## Local setup

Requirements: Node.js 18+, MySQL.

```bash
npm install
npm install --prefix frontend
cp .env.example .env
cp frontend/.env.example frontend/.env.local
```

Fill in `.env` (`DEPLOY_TARGET`, Stripe `*_OVH` / `*_GOOGLE`, SMTP, optional GCS) and `frontend/.env.local`.

```bash
npm run seed   # optional
npm run dev
```

| Command          | Description                                                 |
| ---------------- | ----------------------------------------------------------- |
| `npm run server` | backend (`tsx watch`)                                       |
| `npm run client` | frontend (Vite)                                             |
| `npm run build`  | backend + frontend (production)                             |
| `npm run start`  | `node backend/dist/server.js` (also serves `frontend/dist`) |
| `npm test`       | Cypress                                                     |

## Deploy

| Environment      | Domain                   | Docs                                               |
| ---------------- | ------------------------ | -------------------------------------------------- |
| **OVH**          | `tsx.book-store.com.pl`  | [deploy-ovh/README.md](deploy-ovh/README.md)       |
| **Google Cloud** | `tsx.book-store.website` | [deploy-gcloud/README.md](deploy-gcloud/README.md) |

- **Images:** shared **Cloud Storage** bucket (OVH and GCP).
- **Order email:** OVH — SMTP inside Node; Google — **Pub/Sub → Cloud Function**.
- **Stripe:** `DEPLOY_TARGET` / `VITE_DEPLOY_TARGET` = `ovh` `google` and `*_TEST_MODE_OVH` / `*_TEST_MODE_GOOGLE` pairs.

Stripe webhooks:

- OVH: `https://tsx.book-store.com.pl/api/webhooks/stripe`
- Google: `https://tsx.book-store.website/api/webhooks/stripe`
