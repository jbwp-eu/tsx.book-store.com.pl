# tsx.book-store.com.pl

Sklep internetowy z książkami: katalog, koszyk, checkout, płatności Stripe oraz panel admina. Monorepo z REST API (Express + TypeScript) i SPA React.

**Live Demo:** https://tsx.book-store.com.pl/

## Co robi aplikacja

- **Katalog** — lista produktów, wyszukiwanie, filtrowanie, sortowanie, paginacja, szczegóły, recenzje, karuzela wyróżnionych
- **Konto** — rejestracja / logowanie (JWT), profil, moje zamówienia i recenzje
- **Zakup** — koszyk → adres wysyłki → metoda płatności → złożenie zamówienia
- **Płatności** — Stripe (Payment Intent + webhook)
- **Admin** — overview (sprzedaż), produkty, użytkownicy, zamówienia, recenzje
- **i18n** — PL / EN, motyw jasny/ciemny, mapa lokalizacji sklepu
- **Kontakt** — formularz z wysyłką e-mail (SMTP)
- **Media** — upload obrazów produktów (AWS S3 + CloudFront)

## Stack

| Warstwa | Technologie |
|--------|-------------|
| **Backend** | Node.js, Express 5, TypeScript (`tsx`), Sequelize, MySQL, JWT, Stripe, Multer, Nodemailer, AWS S3 / CloudFront |
| **Frontend** | React 19, Vite, TypeScript, React Router, Redux Toolkit, Tailwind CSS 4, Radix UI, Formik + Yup, i18next, Stripe.js, Recharts |
| **Dane** | MySQL (Sequelize), uploady lokalne (`uploads/`) lub S3 |
| **Testy** | Cypress (e2e) |

## Struktura repo

```
backend/          # Express REST API + Sequelize
frontend/         # React SPA (Vite)
uploads/          # lokalne obrazy (dev / fallback)
```

**Backend** — API REST (`/api/...`), baza, auth JWT, płatności Stripe, webhook, upload, maile.  
**Frontend** — UI, routing, stan (Redux), wywołania REST.

## Uruchomienie lokalne

Wymagania: Node.js 18+, działająca baza MySQL.

```bash
npm install
npm install --prefix frontend
```

Skonfiguruj zmienne w `.env` w katalogu głównym (m.in. `PORT`, `DB_*`, `JWT_SECRET`, klucze Stripe, SMTP, opcjonalnie AWS/CloudFront). Frontend w dev łączy się z API przez `VITE_BACKEND_URL` (ładowane z rootowego `.env`).

Opcjonalnie zasil bazę danymi demo:

```bash
npm run seed
```

Uruchomienie w trybie deweloperskim (backend + frontend naraz):

```bash
npm run dev
```

- Frontend: Vite (domyślnie `http://localhost:5173`, port z `VITE_PORT`)
- Backend: REST API na porcie z `PORT`

Inne skrypty:

| Komenda | Opis |
|---------|------|
| `npm run server` | backend z hot-reload (`tsx watch`) |
| `npm run client` | sam frontend (Vite) |
| `npm run build:backend` | kompilacja TypeScript backendu |
| `npm run start` / `start:backend` | produkcyjny start API (serwuje też `frontend/dist`) |
| `npm run seed` | import danych demo |
| `npm run seed:destroy` | usunięcie danych seed |
| `npm test` | Cypress headless (`frontend`) |
