# JobTrackr — Job Search Command Center

A full-stack MERN application for managing the complete job-search lifecycle. JobTrackr helps users track applications from submission through interviews, offers, rejections, and follow-ups in one professional dark-themed dashboard.

Built with React, Node.js, Express.js, MongoDB, JWT authentication, Kanban and table views, analytics, follow-up tracking, application details, and interview-preparation tools.

---

## Features

- **JWT Authentication** — Register, login, logout, protected routes, password hashing, JWT-based sessions, and automatic 401 handling.
- **Dashboard** — Live application statistics, recent applications, follow-up overview, and quick actions.
- **Application Management** — Create, view, update, and delete job applications.
- **Table View** — Search by company/role, filter by status and priority, and sort applications.
- **Kanban View** — Organize applications across Applied, Interview, Offer, and Rejected columns with inline status updates.
- **Application Details** — View complete application information, job link, dates, notes, follow-up information, and activity history.
- **Interview Preparation** — Store interview notes and maintain a persistent preparation checklist for interview-stage applications.
- **Priority Management** — High, Medium, and Low priority levels with visual badges.
- **Follow-up Tracking** — Track overdue, today, and upcoming follow-ups.
- **Analytics** — Application funnel, status distribution, priority breakdown, applications-over-time chart, and interview/offer/rejection rates.
- **Profile** — View account information and job-search statistics.
- **Responsive UI** — Responsive dashboard, forms, tables, Kanban board, and sidebar for different screen sizes.
- **Toast Notifications** — User feedback for successful and failed actions.
- **Centralized API Service** — Axios-based API layer with authentication interceptors and environment-based backend configuration.

---

## Technologies Used

### Frontend

| Technology | Purpose |
|---|---|
| React 19 | UI development |
| React Router v6 | Client-side routing and protected routes |
| Axios | HTTP requests and interceptors |
| Recharts 3.x | Analytics charts |
| react-hot-toast | Toast notifications |
| date-fns | Date formatting and relative time |
| Custom CSS | Responsive dark SaaS design system |

### Backend

| Technology | Purpose |
|---|---|
| Node.js | Backend runtime |
| Express.js | REST API framework |
| MongoDB | Database |
| Mongoose | MongoDB ODM |
| JSON Web Token | Authentication |
| bcryptjs | Password hashing |
| express-validator | Request validation |
| dotenv | Environment configuration |
| CORS | Cross-origin API access |

---

## Project Structure

```text
Jobtracker/
├── client/                         # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/             # Reusable UI components
│   │   ├── context/                # Authentication context
│   │   ├── hooks/                  # Custom hooks
│   │   ├── layouts/                # Application/auth layouts
│   │   ├── pages/                  # Dashboard, applications, analytics, profile, auth
│   │   ├── services/               # Centralized Axios API service
│   │   └── utils/                  # Utility functions
│   ├── .env.example
│   └── vercel.json
│
├── server/                         # Express backend
│   ├── config/                     # Database configuration
│   ├── controllers/                # Auth/application controllers
│   ├── middleware/                 # JWT protection and error handling
│   ├── models/                     # User and Application models
│   ├── routes/                     # Auth and application routes
│   ├── server.js
│   └── .env.example
│
├── .gitignore
└── README.md
```

---

## Setup and Installation

### Prerequisites

- Node.js 18+
- npm
- MongoDB Atlas account or local MongoDB
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
npm install
```

Update `server/.env`:

```env
MONGO_URI=<your MongoDB connection string>
JWT_SECRET=<your long random secret>
PORT=5001
CLIENT_URL=http://localhost:3001
```

> Never commit `.env` files or real credentials to GitHub.

The backend defaults to port `5001` when `PORT` is not specified.

### 3. Configure the frontend

Open another terminal:

```bash
cd client
cp .env.example .env
npm install
```

Set:

```env
REACT_APP_API_URL=http://localhost:5001
PORT=3001
```

> `REACT_APP_API_URL` should contain the backend base URL only. Do not append `/api`, because the frontend API service adds the API route path itself.

---

## How to Run

### Terminal 1 — Backend

```bash
cd server
npm run dev
```

Backend: `http://localhost:5001`

Health check: `http://localhost:5001/api/health`

### Terminal 2 — Frontend

```bash
cd client
npm start
```

Frontend: `http://localhost:3001`

Register a new account or log in to start tracking applications.

### Production build (frontend only)

```bash
cd client
npm run build
```

---

## Environment Variables

### Backend — `server/.env`

| Variable | Description | Example |
|---|---|---|
| `MONGO_URI` | MongoDB connection string | `<MongoDB URI>` |
| `JWT_SECRET` | Secret used to sign JWT tokens | `<random secret>` |
| `PORT` | Express server port | `5001` |
| `CLIENT_URL` | Allowed frontend origin for CORS | `http://localhost:3001` |

### Frontend — `client/.env`

| Variable | Description | Example |
|---|---|---|
| `REACT_APP_API_URL` | Backend base URL without `/api` | `http://localhost:5001` |
| `PORT` | React development server port | `3001` |

---

## API Endpoints

| Method | Endpoint | Authentication | Description |
|---|---|---|---|
| POST | `/api/auth/register` | Public | Register a user |
| POST | `/api/auth/login` | Public | Login and receive JWT |
| GET | `/api/auth/me` | Protected | Get current user |
| GET | `/api/applications` | Protected | List applications |
| POST | `/api/applications` | Protected | Create an application |
| GET | `/api/applications/stats` | Protected | Get application statistics |
| GET | `/api/applications/:id` | Protected | Get an application |
| PUT | `/api/applications/:id` | Protected | Update an application |
| DELETE | `/api/applications/:id` | Protected | Delete an application |
| GET | `/api/health` | Public | API health check |

---

## Production Deployment

### Frontend

The React frontend is deployed on Vercel:

**Live Application:**
https://jobtracker-lemon-two.vercel.app

### Backend

The Express API is deployed on Render:

**API:**
https://jobtracker-g0lu.onrender.com

**Health Check:**
https://jobtracker-g0lu.onrender.com/api/health

Production frontend configuration:

```env
REACT_APP_API_URL=https://jobtracker-g0lu.onrender.com
```

Production backend configuration should include:

```env
CLIENT_URL=https://jobtracker-lemon-two.vercel.app
```

> Production secrets are stored as environment variables on the deployment platforms and are not included in this repository.

---

## AI Tool Used

This project was developed with **[Kiro](https://app.kiro.de/)** — an agentic AI software engineering tool.

---

## AI Development Experience

Kiro was used as a development assistant throughout the project for planning, implementation, debugging, and refinement. It helped accelerate the development of both the React frontend and Express/MongoDB backend.

AI-generated suggestions were reviewed and adapted rather than accepted blindly. The application was manually tested during development and deployment, including authentication, CRUD operations, Kanban status changes, analytics updates, API integration, CORS configuration, and deployment configuration.

The development process also involved debugging issues such as local port conflicts, API base URL configuration, CORS settings, and production frontend/backend integration. This helped demonstrate that AI assistance can speed up implementation while the developer still needs to understand the architecture, verify generated code, and troubleshoot integration issues.

---

## AI-Assisted Tasks

1. **Backend Architecture and REST APIs**
   Used Kiro to assist with Express.js backend scaffolding, Mongoose models, authentication middleware, validation, controllers, and REST API routes for job applications.

2. **Authentication and API Integration**
   Used Kiro to implement JWT authentication, protected routes, session restoration, Axios interceptors, and frontend/backend authentication flow.

3. **Application Management and Kanban UI**
   Used Kiro to assist with React components for application CRUD operations, table view, Kanban board, filters, sorting, status updates, and reusable dialogs/forms.

4. **Analytics and Application Details**
   Used Kiro to build the application detail page, activity timeline, interview preparation functionality, analytics charts, funnel visualization, and conversion-rate cards.

5. **Debugging and Deployment**
   Used Kiro to troubleshoot API URL configuration, CORS, environment variables, port-related issues, and Vercel/Render integration. The final deployment was manually tested to verify end-to-end functionality.

---

## Verification

The deployed application was manually tested for:

- User registration/login
- Protected routes
- Adding applications
- Editing applications
- Deleting applications
- Table and Kanban views
- Application status transitions
- Analytics updates after status changes
- Application detail pages
- Profile statistics
- Backend health endpoint
- Frontend-to-backend production communication

---

## Live Demo

**Frontend:**
https://jobtracker-lemon-two.vercel.app

**Backend Health Check:**
https://jobtracker-g0lu.onrender.com/api/health

---

## Repository

https://github.com/AmiteshKumarDubey/Jobtracker
