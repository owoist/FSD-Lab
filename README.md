# 🌱 Ecometrics: Personal Carbon Footprint Calculator

Ecometrics is a web app that helps people **estimate their monthly carbon footprint**, understand **where their emissions come from**, **compare themselves to transparent benchmarks**, and get a **practical plan to reduce them**.

Results are reported in **kg CO₂e** (carbon dioxide equivalent), because lifestyle activities release greenhouse gases other than CO₂.

> A monorepo with a Node/Express **backend** and a Next.js **frontend**.



## Why Ecometrics?

Many people don't know how everyday choices (electricity, transport, food, waste) add up to greenhouse gas emissions, and most climate information is hard to turn into personal action. Ecometrics closes that gap with an accessible calculator and evidence-based suggestions.

**Who it's for**
- Students and young adults interested in sustainability
- Households wanting to understand their environmental impact
- Individuals who want to track improvement over time
- Educators and awareness campaigns

**UN Sustainable Development Goals**
- **SDG 13: Climate Action** (primary): makes personal emissions visible
- **SDG 12: Responsible Consumption and Production**: informs food, energy and waste choices
- **SDG 7: Affordable and Clean Energy**: shows the emissions impact of electricity use



## Features

| Feature | What it does |
| - | - |
| **Personal calculator** | Monthly inputs for electricity, transport (car, motorbike, bus, rail, flights), diet, LPG and waste |
| **Impact dashboard** | Category breakdown, saved month-by-month history, CSV export |
| **Fair comparisons** | Per-capita benchmarks (India, World, USA) with source, year and units |
| **Emissions inequality** | Illustrative high-emission scenarios and investment-associated emissions, kept separate from personal lifestyle footprints |
| **Reduction planner** | Top actions ranked by estimated kg CO₂e saved per month |
| **Accounts** | Email/password login (Better Auth); saved footprints are private to each user |
| **API docs** | Interactive OpenAPI docs via Scalar |



## Tech Stack

| Layer | Tech |
| - | - |
| Frontend | Next.js (App Router), React, Tailwind CSS, shadcn/ui |
| Auth | Better Auth (email/password) on SQLite |
| Backend | Node.js + Express |
| Database | MongoDB (Mongoose) for saved footprints |
| API docs | OpenAPI 3 + Scalar |



## How It Works

```
Browser ──► Next.js (localhost:3000) ──► Better Auth (SQLite): sign up / log in
   │
   └──► Express API (localhost:4000) ──► MongoDB: saved footprints
              │
              └── For protected routes, forwards the session cookie to
                  Next.js /api/auth/get-session to find out who the user is
```

- The **backend never stores passwords or sessions**. It asks the frontend's Better Auth endpoint who owns the cookie.
- `POST /api/calculate` is stateless and does the maths; saving a month stores the inputs and result in MongoDB (one entry per user per month, re-saving overwrites).



## Methodology

Emissions = activity × emission factor. Factors live in `backend/src/calc.js` and are **approximate**, so review and cite them if you use this for reporting.

| Category | Factor used |
| - | - |
| Electricity | 0.71 kg CO₂e / kWh (India grid, default; overridable via `gridFactor`) |
| Car / Motorbike | 0.17 / 0.10 kg CO₂e per km |
| Bus / Rail | 0.09 / 0.04 kg CO₂e per km |
| Flights | 0.15 kg CO₂e per km |
| Diet (per month) | vegan 125 · vegetarian 140 · pescatarian 160 · mixed 210 · meat-heavy 275 kg |
| LPG | 3.0 kg CO₂e per kg |
| Waste | 0.5 kg CO₂e per kg |

### Benchmarks and honest caveats
- Per-capita figures (India ≈ 2.0 t, World ≈ 4.7 t, USA ≈ 14.9 t per year, 2023) come from Our World in Data / Global Carbon Project and are **fossil CO₂ only**, not full CO₂e, so comparisons are indicative.
- **Billionaire comparison:** private-jet figures are *illustrative scenarios*, not averages for all billionaires. Investment-associated emissions (Oxfam, 2022) measure emissions linked to owned businesses, a different concept from personal lifestyle emissions, and are shown separately on purpose.



## API

Base URL: `http://localhost:4000` · Interactive docs: **`http://localhost:4000/docs`** · Spec: `/openapi.json`

| Method | Endpoint | Auth | Description |
| - | - | - | - |
| GET | `/api/benchmarks` | No | Benchmarks with source, year and units |
| POST | `/api/calculate` | No | Calculate a footprint and recommendations |
| GET | `/api/footprints` | Yes | List the user's saved months |
| POST | `/api/footprints` | Yes | Calculate and save/overwrite a month |
| DELETE | `/api/footprints/:id` | Yes | Delete a saved month |

Example request body for `/api/calculate`:

```json
{
  "kwh": 200,
  "diet": "mixed",
  "km": { "car": 300, "flight": 200 },
  "lpgKg": 5,
  "wasteKg": 20
}
```



## Setup

**Requirements:** Node.js 20.6+ and a running MongoDB (local or Atlas).

### 1. Install dependencies

From the repo root:

```bash
npm install                      # root (concurrently)
npm --prefix backend install
npm --prefix frontend install
# or simply: npm run install:all
```

### 2. Configure environment variables

**`backend/.env`**
```env
PORT=4000
MONGODB_URI=mongodb://localhost:27017/ecometrics
FRONTEND_URL=http://localhost:3000
```

**`frontend/.env.local`**
```env
NEXT_PUBLIC_API_URL=http://localhost:4000
# plus any Better Auth variables your auth.ts uses, e.g.
# BETTER_AUTH_SECRET=...
# BETTER_AUTH_URL=http://localhost:3000
```

### 3. Create the auth tables (first time only)

```bash
cd frontend && npx @better-auth/cli migrate
```

### 4. Run everything

```bash
npm run dev
```

- App: http://localhost:3000
- API docs: http://localhost:4000/docs



## Scripts

Root `package.json`:

```json
{
  "name": "project-root",
  "private": true,
  "scripts": {
    "dev": "concurrently -n backend,frontend -c blue,green \"npm:dev:backend\" \"npm:dev:frontend\"",
    "dev:backend": "npm --prefix backend run dev",
    "dev:frontend": "npm --prefix frontend run dev",
    "install:all": "npm install && npm --prefix backend install && npm --prefix frontend install",
    "build": "npm --prefix frontend run build",
    "start": "concurrently -n backend,frontend -c blue,green \"npm:start:backend\" \"npm:start:frontend\"",
    "start:backend": "npm --prefix backend start",
    "start:frontend": "npm --prefix frontend start",
    "fix": "oxlint --fix . && oxfmt ."
  }
}
```

| Command | What it does |
| - | - |
| `npm run dev` | Start **both** apps (dev, hot reload) |
| `npm run dev:backend` | Start only the backend |
| `npm run dev:frontend` | Start only the frontend |
| `npm run install:all` | Install root + backend + frontend deps |
| `npm run build` | Build the frontend for production |
| `npm start` | Run built frontend + backend together |
| `npm run fix` | Runs both `oxfmt` and `oxlint` to fix any lint/formatting issues |



## Project Structure

```
.
├── backend                          # Express API server
│   ├── package.json                 # Backend deps and scripts
│   ├── package-lock.json
│   └── src
│       ├── calc.js                  # Emission factors, calculate(), recommendations, benchmarks
│       ├── index.js                 # Express app, MongoDB model, auth middleware, routes, Scalar docs
│       └── openapi.js               # OpenAPI 3 spec rendered at /docs
├── frontend                         # Next.js app (App Router)
│   ├── app
│   │   ├── api
│   │   │   └── auth
│   │   │       └── [...all]
│   │   │           └── route.ts     # Better Auth handler (login, signup, session)
│   │   ├── dashboard
│   │   │   ├── calculator
│   │   │   │   └── page.tsx         # Calculator: inputs, results, benchmarks, save month
│   │   │   └── page.tsx             # Saved history, trend bars, CSV export
│   │   ├── globals.css              # Tailwind + shadcn theme tokens
│   │   ├── icon.svg                 # Favicon
│   │   ├── layout.tsx               # Root layout (dark mode by default)
│   │   ├── login
│   │   │   └── page.tsx             # Combined login / sign-up form
│   │   └── page.tsx                 # Public landing page
│   ├── auth.ts                      # Better Auth server config (SQLite, email/password)
│   ├── components
│   │   ├── bars.tsx                 # Reusable horizontal bar chart
│   │   ├── gate.tsx                 # Redirects to /login when logged out; wraps protected pages
│   │   ├── nav.tsx                  # Top navigation and sign-out
│   │   └── ui
│   │       └── button.tsx           # shadcn/ui button
│   ├── components.json              # shadcn/ui config
│   ├── lib
│   │   ├── api.ts                   # fetch wrapper for the backend (sends cookies)
│   │   ├── auth-client.ts           # Better Auth React client
│   │   └── utils.ts                 # shadcn `cn()` helper
│   ├── next.config.ts               # Next.js config
│   ├── package.json                 # Frontend deps and scripts
│   ├── package-lock.json
│   ├── sqlite.db                    # Better Auth user/session database (local; keep out of git)
│   └── tsconfig.json                # TypeScript config
├── package.json                     # Root orchestrator (runs both apps)
├── package-lock.json
└── README.md                        # You are here
```



## Troubleshooting

- **Saving or loading history returns "Log in to do this":** the session cookie isn't reaching the API. Use `localhost` for **both** servers (not `127.0.0.1`), and make sure `FRONTEND_URL` in `backend/.env` matches the address you open in the browser.
- **CORS errors:** `FRONTEND_URL` must exactly match the frontend origin, including the port.
- **Backend won't start:** check that MongoDB is running and `MONGODB_URI` is correct; the backend needs Node 20.6+ for `--env-file`.
- **Login tables missing:** run `npx @better-auth/cli migrate` inside `frontend/`.



## Future Work

- Only monthly inputs are supported (daily/weekly entry would be a natural extension).
- Possible next steps: more regional grid factors, shopping/consumption category, trend charts, goal setting, and unit tests with predefined test cases.



## Sources

- Our World in Data / Global Carbon Project: per-capita CO₂ emissions
- Oxfam: *Carbon Billionaires* (investment-associated emissions)
- Emission factors: approximate values from common public datasets (e.g. national grid and transport averages); verify before formal use