# JobTrackr — Job Search Command Center

A full-stack MERN stack application for managing your entire job search lifecycle. JobTrackr lets you track every application from the initial submission through interviews, offers, and follow-ups — all in one professional, dark-themed dashboard. Built as a full-stack MERN application with JWT authentication, real-time stats, Kanban and table views, analytics charts, and interview preparation tooling.

---

## Features

- **JWT Authentication** — Secure register, login, and logout with protected routes. Tokens are stored in `localStorage` and automatically attached to every API request via an Axios interceptor.
- **Dashboard** — Command center showing total/applied/interview/offer/rejected counts (from live API stats), a follow-up panel with overdue/today/upcoming indicators, a recent-applications list, and quick-action buttons.
- **Applications — Table View** — Full CRUD with search (company/role), status filter, priority filter, and sort. Rows are clickable and lead to the detail page.
- **Applications — Kanban View** — Four-column board (Applied → Interview → Offer → Rejected) with inline status-change dropdown on each card. Switching views preserves all active filters.
- **Application Detail Page** — Dedicated route (`/applications/:id`) with inline status change, full field display, follow-up date, job link, notes, and an activity timeline showing applied date, follow-up date, interview date, and tracker history.
- **Interview Preparation** — For applications in Interview status: a free-text notes editor with save, and a checkable preparation checklist (add/remove/toggle items, persisted to the database).
- **Priority System** — High / Medium / Low priority on every application, visible as coloured badges in the table, Kanban cards, and detail page.
- **Follow-up Tracking** — Follow-up date field with visual status badges (Overdue / Today / Upcoming) on the dashboard panel and the applications table.
- **Analytics Page** — Applications over time (area chart), status distribution (pie/donut chart), application funnel (horizontal bar), priority breakdown (bar chart), and three conversion-rate cards (interview rate, offer rate, rejection rate). All charts use real application data via Recharts.
- **Profile Page** — Displays user name, email, join date, and a job-search summary (total applications, interview count, offer rate).
- **Responsive Design** — Collapsible sidebar on tablet/mobile, responsive grid layouts for dashboard, stats, analytics, and forms.
- **Toast Notifications** — Success/error feedback on every create, update, delete, and login action via `react-hot-toast`.
- **Centralised API Service** — All HTTP calls go through a single Axios instance (`src/services/api.js`) that reads the backend URL from an environment variable and handles 401 auto-logout.

---

## Technologies Used

### Frontend
| Library / Tool | Purpose |
|---|---|
| React 19 (Create React App) | UI framework |
| React Router v6 | Client-side routing and protected routes |
| Axios | HTTP client with request/response interceptors |
| Recharts 3.x | Analytics charts (area, pie, bar) |
| react-hot-toast | Toast notifications |
| date-fns | Date formatting and relative-time helpers |
| Plain CSS (custom design system) | Dark SaaS theme with CSS variables; no UI library |

### Backend
| Library / Tool | Purpose |
|---|---|
| Node.js (≥18) + Express.js | REST API server |
| MongoDB + Mongoose | Database and ODM |
| jsonwebtoken | JWT creation and verification |
| bcryptjs | Password hashing |
| express-validator | Request body validation |
| dotenv | Environment variable loading |
| cors | Cross-origin request handling |

---

## Project Structure

```
Jobtracker/
├── client/                  # React frontend (Create React App)
│   ├── public/
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── context/         # AuthContext (JWT state management)
│   │   ├── hooks/           # useAuth hook
│   │   ├── layouts/         # AppLayout (sidebar + navbar), AuthLayout
│   │   ├── pages/           # Dashboard, Applications, Detail, Analytics, Profile, Login, Register
│   │   ├── services/        # api.js — centralised Axios instance
│   │   └── utils/           # helpers (date formatting, greeting, follow-up status, etc.)
│   ├── .env.example
│   └── vercel.json          # SPA rewrite rule for Vercel deployment
├── server/                  # Express backend
│   ├── config/              # db.js — Mongoose connection
│   ├── controllers/         # authController, applicationController
│   ├── middleware/           # auth.js (JWT protect), errorHandler.js
│   ├── models/              # User.js, Application.js
│   ├── routes/              # auth.js, applications.js
│   ├── server.js
│   └── .env.example
├── .gitignore
└── README.md
```

---

## Setup and Installation

### Prerequisites
- Node.js 18 or higher
- npm
- A MongoDB Atlas cluster (or local MongoDB installation)
- Git

### 1. Clone the repository
```bash
git clone https://github.com/AmiteshKumarDubey/Jobtracker.git
cd Jobtracker
```

### 2. Configure the backend
```bash
cd server
cp .env.example .env
```
Open `server/.env` and fill in your values:
```
MONGO_URI=<your MongoDB Atlas connection string>
JWT_SECRET=<a long random secret string>
PORT=<choose a free port, e.g. 5001 or 5002>
CLIENT_URL=http://localhost:3001
```

> **Port note:** `server.js` defaults to **5001** when `PORT` is not set. You can use any free port — just make sure `REACT_APP_API_URL` in the frontend `.env` points to the same port. For example, if `PORT=5002` here, set `REACT_APP_API_URL=http://localhost:5002` in the next step.

Install dependencies:
```bash
npm install
```

### 3. Configure the frontend
```bash
cd ../client
cp .env.example .env
```
Open `client/.env` and set `REACT_APP_API_URL` to the **same port** you chose for the backend:
```
REACT_APP_API_URL=http://localhost:<your backend PORT>
PORT=3001
```

**Example A — using the server default (5001):**
```
REACT_APP_API_URL=http://localhost:5001
PORT=3001
```

**Example B — if your backend is running on 5002:**
```
REACT_APP_API_URL=http://localhost:5002
PORT=3001
```

> **Key rule:** `PORT` in `server/.env` and `REACT_APP_API_URL` in `client/.env` must always point to the same port. A mismatch is the most common cause of API connection errors in local development.

Install dependencies:
```bash
npm install
```

---

## How to Run

Open two terminal windows from the project root.

### Terminal 1 — Backend
```bash
cd server
npm run dev
```
The Express server starts with nodemon (auto-restarts on file changes).
Listens on the port configured in `server/.env` (code default: **5001**).

> If your `server/.env` sets `PORT=5002`, the backend runs on **http://localhost:5002**.
> If `PORT` is not set at all, the backend runs on **http://localhost:5001**.

Health check: `GET http://localhost:<PORT>/api/health` → `{ "status": "ok" }`

### Terminal 2 — Frontend
```bash
cd client
npm start
```
The React dev server starts on the port set in `client/.env` (default **3001**).
Default URL: **http://localhost:3001**

Open **http://localhost:3001** in your browser. Register a new account or log in to get started.

### Production build (frontend only)
```bash
cd client
npm run build   # outputs static files to client/build/
```

---

## Environment Variables

### server/.env
| Variable | Description | Default |
|---|---|---|
| `MONGO_URI` | MongoDB connection string | *(required)* |
| `JWT_SECRET` | Secret key for signing JWT tokens | *(required)* |
| `PORT` | Port the Express server listens on | `5001` |
| `CLIENT_URL` | Frontend origin allowed by CORS for production | *(optional)* |

### client/.env
| Variable | Description | Default |
|---|---|---|
| `REACT_APP_API_URL` | Backend base URL (no trailing slash, no `/api`) | `http://localhost:5002`* |
| `PORT` | React dev server port | `3001` |

*The hardcoded fallback in `api.js` is `http://localhost:5002`, but `client/.env` takes precedence at runtime. Always set `REACT_APP_API_URL` explicitly to match whichever port your backend is running on — do not rely on the fallback.

---

## API Endpoints

| Method | Route | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | Public | Register a new user |
| POST | `/api/auth/login` | Public | Login and receive JWT |
| GET | `/api/auth/me` | Protected | Get current user info |
| GET | `/api/applications` | Protected | List applications (`?search=`, `?status=`) |
| POST | `/api/applications` | Protected | Create application |
| GET | `/api/applications/stats` | Protected | Get counts per status |
| GET | `/api/applications/:id` | Protected | Get single application |
| PUT | `/api/applications/:id` | Protected | Update application |
| DELETE | `/api/applications/:id` | Protected | Delete application |
| GET | `/api/health` | Public | Health check |

---

## AI Tool Used

This project was built using **[Kiro](https://app.kiro.de/)** — an agentic AI software engineering tool designed for real-world development workflows inside VS Code.

---

## AI Development Experience

Kiro was used throughout the development of JobTrackr as a collaborative engineering assistant. It helped scaffold the initial MERN stack architecture, implement complex frontend features such as the Kanban view, analytics charts, and application detail page, and configure the backend's JWT authentication and MongoDB integration. All AI-generated code was reviewed, tested, and adapted by the developer — including resolving integration issues such as port conflicts, React 19 peer-dependency constraints with Recharts, and CORS configuration for cross-origin API requests. The development process demonstrated how an AI tool can accelerate implementation while still requiring the developer to understand, debug, and make architectural decisions at every stage.

---

## AI-Assisted Tasks

1. **Full backend scaffolding** — Kiro generated the complete Express + MongoDB backend in a single session, including Mongoose models (`User`, `Application` with all fields and indexes), JWT authentication middleware, input validation with `express-validator`, a central error handler, and all RESTful API routes.

2. **React frontend architecture and authentication flow** — Kiro implemented the `AuthContext` (JWT storage, session restore via `GET /api/auth/me` on mount, auto-logout on 401), the centralised Axios service with request/response interceptors, protected routes with `ProtectedRoute`, and all auth pages (Login, Register) with validation and error handling.

3. **Dashboard, Kanban view, and application management UI** — Kiro built the Dashboard command centre (stat cards, follow-up panel, recent activity, quick actions), the Applications page with both table and Kanban views, the ApplicationForm modal with all fields (company, role, status, priority, follow-up date, interview date, notes), and the ConfirmDialog component replacing `window.confirm`.

4. **Application detail page and interview preparation feature** — Kiro created the `/applications/:id` detail route with inline status change, activity timeline, and the interview preparation section (interview notes editor with save, and a persistent checkable preparation checklist backed by `PUT /api/applications/:id`).

5. **Analytics page and custom CSS design system** — Kiro implemented the Analytics page using Recharts 3.x (area chart for applications over time, pie chart for status distribution, bar chart for priority breakdown, horizontal funnel bars, and conversion-rate cards), and authored the entire dark SaaS design system in plain CSS — including CSS variable palette, typography, badges, table, modal, sidebar, Kanban board, stat cards, and responsive breakpoints.

---

## Live Demo

- **Frontend:** Coming soon — deployment pending
- **Backend API:** Coming soon — deployment pending

*I will update these links with the real deployed URLs after deployment.*

---

## Repository

[github.com/AmiteshKumarDubey/Jobtracker](https://github.com/AmiteshKumarDubey/Jobtracker)
