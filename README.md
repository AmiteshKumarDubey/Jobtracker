# JobTrackr — Job Search Command Center

A full-stack MERN application for tracking job applications throughout your entire job search lifecycle — from initial application through interviews, offers, and follow-ups.

---

## Features

- **Authentication** — JWT-based register, login, and logout with protected routes
- **Dashboard** — Real-time stats (Total, Applied, Interview, Offer, Rejected), follow-up panel, recent activity, and quick actions
- **Applications** — Full CRUD with table view and Kanban board view, search, status/priority filtering, and sorting
- **Application Details** — Dedicated detail page with inline status change, interview preparation checklist, and activity timeline
- **Analytics** — Area chart (applications over time), pie chart (status distribution), funnel visualization, priority breakdown, and conversion rates
- **Priority System** — High / Medium / Low priority with visual badges on every view
- **Follow-up Tracking** — Follow-up date with overdue / today / upcoming indicators on dashboard and table
- **Interview Prep** — Notes editor and checkable preparation checklist for applications in Interview status
- **Profile** — Account info with job-search summary stats
- **Responsive Design** — Works on desktop, tablet, and mobile

---

## Technologies Used

### Frontend
- React 19 (Create React App)
- React Router v6
- Axios
- Recharts
- react-hot-toast
- date-fns
- Plain CSS (custom dark SaaS design system)

### Backend
- Node.js (>=18) + Express.js
- MongoDB + Mongoose
- JSON Web Tokens (jsonwebtoken)
- bcryptjs
- express-validator
- dotenv, cors

---

## Setup and Installation

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (or local MongoDB)
- Git

### Clone the repository
```bash
git clone https://github.com/AmiteshKumarDubey/Jobtracker.git
cd Jobtracker
```

### Backend setup
```bash
cd server
cp .env.example .env
# Edit .env and fill in MONGO_URI, JWT_SECRET, PORT, CLIENT_URL
npm install
```

### Frontend setup
```bash
cd client
cp .env.example .env
# Edit .env — set REACT_APP_API_URL to your backend URL
npm install
```

---

## How to Run

### Development

Open two terminals:

**Terminal 1 — Backend**
```bash
cd server
npm run dev       # nodemon, auto-restarts on changes
# Runs on http://localhost:5001
```

**Terminal 2 — Frontend**
```bash
cd client
npm start
# Runs on http://localhost:3001
```

Open **http://localhost:3001** in your browser.

### Production build (frontend)
```bash
cd client
npm run build     # outputs to client/build/
```

---

## Environment Variables

### server/.env
| Variable | Description |
|---|---|
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret key for signing JWT tokens |
| `PORT` | Port for Express server (default: 5001) |
| `CLIENT_URL` | Frontend origin allowed by CORS (e.g. Vercel URL) |

### client/.env
| Variable | Description |
|---|---|
| `REACT_APP_API_URL` | Full backend URL without trailing slash (e.g. `https://api.yourapp.com`) |
| `PORT` | Dev server port (default: 3000, set to 3001 to avoid conflicts) |

---

## AI Tool Used

This project was built using **[Kiro](https://app.kiro.de/)** — an agentic AI software engineering tool.

---

## AI Development Experience

<!-- TODO: Write 2–3 sentences describing your experience using Kiro during this project. -->

---

## AI-Assisted Tasks

<!-- TODO: List 3–5 specific tasks where Kiro helped, e.g.:
1. Scaffolded the full Express backend (models, controllers, routes, middleware) from a single prompt
2. Built the React frontend with JWT authentication flow, protected routes, and AuthContext
3. Designed and implemented the dark SaaS design system in pure CSS
4. Created the Analytics page with Recharts (area, pie, bar charts) from real API data
5. Debugged port conflicts and CORS configuration during integration testing
-->

---

## Live Demo

- Frontend: <!-- TODO: Add Vercel URL after deployment -->
- Backend API: <!-- TODO: Add Railway/Render URL after deployment -->

---

## Repository

[github.com/AmiteshKumarDubey/Jobtracker](https://github.com/AmiteshKumarDubey/Jobtracker)
