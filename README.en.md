# tsx.book-store.com.pl

**Language:** [Polski](README.md) | English

Online bookstore: catalog, cart, checkout, Stripe payments, and an admin panel. Monorepo with a REST API (Express + TypeScript) and a React SPA.

**Live Demo:** https://tsx.book-store.com.pl/

## What the app does

- **Catalog** — product list, search, filtering, sorting, pagination, details, reviews, featured carousel
- **Account** — register / login (JWT), profile, my orders and reviews
- **Purchase** — cart → shipping address → payment method → place order
- **Payments** — Stripe (Payment Intent + webhook)
- **Admin** — overview (sales), products, users, orders, reviews
- **i18n** — PL / EN, light/dark theme, store locator map
- **Contact** — form with email delivery (SMTP)
- **Media** — product image uploads (AWS S3 + CloudFront)

## Stack

| Layer | Technologies |
|--------|-------------|
| **Backend** | Node.js, Express 5, TypeScript (`tsx`), Sequelize, MySQL, JWT, Stripe, Multer, Nodemailer, AWS S3 / CloudFront |
| **Frontend** | React 19, Vite, TypeScript, React Router, Redux Toolkit, Tailwind CSS 4, Radix UI, Formik + Yup, i18next, Stripe.js, Recharts |
| **Data** | MySQL (Sequelize), local uploads (`uploads/`) or S3 |
| **Tests** | Cypress (e2e) |

## Repo structure

```
backend/          # Express REST API + Sequelize
frontend/         # React SPA (Vite)
uploads/          # local images (dev / fallback)
```

**Backend** — REST API (`/api/...`), database, JWT auth, Stripe payments, webhook, uploads, email.  
**Frontend** — UI, routing, state (Redux), REST calls.

## Local setup

Requirements: Node.js 18+, a running MySQL database.

```bash
npm install
npm install --prefix frontend
```

Configure variables in the root `.env` (e.g. `PORT`, `DB_*`, `JWT_SECRET`, Stripe keys, SMTP, optionally AWS/CloudFront). In development the frontend talks to the API via `VITE_BACKEND_URL` (loaded from the root `.env`).

Optionally seed the database with demo data:

```bash
npm run seed
```

Run in development mode (backend + frontend together):

```bash
npm run dev
```

- Frontend: Vite (default `http://localhost:5173`, port from `VITE_PORT`)
- Backend: REST API on the port from `PORT`

Other scripts:

| Command | Description |
|---------|-------------|
| `npm run server` | backend with hot-reload (`tsx watch`) |
| `npm run client` | frontend only (Vite) |
| `npm run build:backend` | compile backend TypeScript |
| `npm run start` / `start:backend` | production API start (also serves `frontend/dist`) |
| `npm run seed` | import demo data |
| `npm run seed:destroy` | remove seed data |
| `npm test` | Cypress headless (`frontend`) |
