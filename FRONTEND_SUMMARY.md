# JobTrackr Frontend Summary

## Project Structure

```
client/
  src/
    context/AuthContext.jsx     — JWT state, login/logout/register
    services/api.js             — Axios instance, token interceptor
    hooks/useAuth.js            — Auth context hook
    utils/helpers.js            — formatDate, getErrorMessage, etc.
    components/
      Sidebar.jsx               — Navigation sidebar with logout
      Navbar.jsx                — Top bar with hamburger
      StatCard.jsx              — Dashboard stat card
      ApplicationTable.jsx      — Applications table
      ApplicationForm.jsx       — Add/Edit modal
      StatusBadge.jsx           — Colored status pill
      EmptyState.jsx            — Empty list placeholder
      ProtectedRoute.jsx        — Auth guard
      LoadingSpinner.jsx        — Loading indicator
    pages/
      LoginPage.jsx             — Login form
      RegisterPage.jsx          — Register form
      DashboardPage.jsx         — Stats + recent applications
      ApplicationsPage.jsx      — Full CRUD + search/filter
      ProfilePage.jsx           — User profile
    layouts/
      AuthLayout.jsx            — Centered auth card
      AppLayout.jsx             — Sidebar + navbar shell
    App.jsx                     — Router + providers
    index.css                   — Global dark SaaS theme
```

## Authentication Flow

1. User registers or logs in via POST /api/auth/register or /api/auth/login.
2. Backend returns a JWT token and user object.
3. Token is stored in `localStorage` under key `jobtrackr_token`.
4. On app load, if a token exists, GET /api/auth/me is called to restore the user session.
5. Every protected API request automatically attaches `Authorization: Bearer <token>` via the Axios interceptor.
6. On a 401 response, the token is removed and the user is redirected to `/login`.
7. Logout clears the token from localStorage and resets the auth state.

## Frontend ↔ Backend Communication

- All API calls go through `src/services/api.js` (Axios instance with baseURL from `REACT_APP_API_URL`).
- Protected routes check `AuthContext.user` before rendering; unauthenticated users are redirected to `/login`.
- `react-hot-toast` shows success/error notifications for every API action.

## Running the Full Project

### Backend
```bash
cd /Users/amiteshkumardubey/Desktop/jobTracker/server
npm run dev        # nodemon (development)
# or
npm start          # node (production)
```
Backend runs on http://localhost:5001

### Frontend
```bash
cd /Users/amiteshkumardubey/Desktop/jobTracker/client
npm start          # development server on http://localhost:3000
# or
npm run build      # production build
```

### Open the app
Navigate to http://localhost:3000 — you will be redirected to the login page.
