# Implementation Plan — JobTracker SaaS Transformation

> **Execution note:** This plan has been decomposed into 4 FEAT files under
> `.agents/tasks/task-jobtracker-saas-transformation/features/`. The workflow
> tail has been replaced with one coder step per FEAT. This document remains
> the canonical ordered reference.

---

## Codebase snapshot (read before implementing)

- **Frontend:** CRA (react-scripts 5.0.1), React 19, react-router-dom v6, axios, date-fns, react-hot-toast
- **Backend:** Express + Mongoose, port 5002, JWT auth
- **API base URL:** `http://localhost:5002` via `REACT_APP_API_URL` in `client/.env` — **do not change**
- **CSS strategy:** single global `src/index.css` using CSS custom properties; components use className strings — no CSS modules, no Tailwind
- **New packages needed:** `recharts@2.12.7`, `@dnd-kit/core@6.1.0`, `@dnd-kit/sortable@8.0.0`, `@dnd-kit/utilities@3.2.2`
- **Build command:** `cd /Users/amiteshkumardubey/Desktop/jobTracker/client && npm run build`

---

## FEAT-001 — Foundation (CSS design system + backend model + package install)

- [ ] 1. **Install npm packages** in `client/`
      Run `npm install --save recharts@2.12.7 @dnd-kit/core@6.1.0 @dnd-kit/sortable@8.0.0 @dnd-kit/utilities@3.2.2` (pinned versions to avoid peer-dep conflicts with react-scripts 5 + React 19).
      Files: `client/package.json`, `client/package-lock.json`
      Verify: `cd client && npm run build` exits 0

- [ ] 2. **Extend Application model** with 6 optional fields (all non-breaking, have defaults)
      Add to `server/models/Application.js` after `notes`: `priority` (String, enum High/Medium/Low, default 'Medium'), `followUpDate` (Date, optional), `interviewDate` (Date, optional), `interviewNotes` (String, trim, maxlength 2000), `interviewOutcome` (String, enum Pending/Passed/Failed, default 'Pending'), `preparationChecklist` (Array of `{text: String, done: Boolean}`, default `[]`).
      Files: `server/models/Application.js`
      Verify: restart backend (`node server.js` or `npm start` in `server/`) — no crash on startup

- [ ] 3. **Rewrite `src/index.css`** with refined dark SaaS design system
      Keep ALL existing class names. Update `:root` to exact new variables: `--bg: #0a0f1e`, `--bg-secondary: #111827`, `--bg-card: #1a2236`, `--bg-hover: #1e2d47`, `--border: #1f2d45`, `--border-light: #2a3d5a`, `--primary: #6366f1`, `--primary-dark: #4f46e5`, `--primary-light: #818cf8`, `--primary-glow: rgba(99,102,241,0.15)`, `--success: #10b981`, `--warning: #f59e0b`, `--danger: #ef4444`, `--info: #3b82f6`, `--purple: #8b5cf6`, `--text: #f1f5f9`, `--text-secondary: #94a3b8`, `--text-muted: #64748b`, `--radius-sm: 6px`, `--radius: 10px`, `--radius-lg: 16px`.
      Add `@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap')` at the very top.
      Add new classes: `.badge-high` (amber 0.15 bg / #fbbf24 text), `.badge-medium` (blue 0.15 bg / #60a5fa text), `.badge-low` (slate 0.15 bg / #94a3b8 text), `.kanban-board` (flex row, gap 1rem, overflow-x auto, align-items flex-start), `.kanban-col` (flex column, min-width 260px, max-width 300px, bg-card border radius-lg padding 1rem), `.kanban-col-header` (flex space-between, font-weight 600, margin-bottom 0.75rem), `.kanban-card` (bg var(--bg-secondary), border var(--border-light), border-radius var(--radius), padding 0.9rem, margin-bottom 0.5rem, cursor default), `.detail-grid` (grid, 2 cols 1fr 1fr, gap 1.5rem, @media max-width 768px → 1col), `.timeline` (border-left 2px solid var(--border), padding-left 1.25rem, display flex flex-direction column gap 0.75rem), `.timeline-item` (position relative, font-size 0.85rem — `::before` is a circle dot at left: -1.4rem), `.analytics-grid` (grid, template `1fr 1fr`, gap 1.25rem, @media max-width 768px → 1fr).
      Files: `client/src/index.css`
      Verify: `cd client && npm run build` exits 0

---

## FEAT-002 — Visual Redesign + Dashboard + Applications + Kanban (Phases 1–3)

- [ ] 4. **Redesign `Sidebar.jsx`** — add Analytics link, polish active state
      Add `{ to: '/analytics', icon: '📈', label: 'Analytics' }` nav item between Applications and Profile. Active item gets `borderLeft: '3px solid var(--primary)'` inline style; inactive items get `borderLeft: '3px solid transparent'`.
      Files: `client/src/components/Sidebar.jsx`
      Verify: build passes

- [ ] 5. **Redesign `AppLayout.jsx`** — add new route titles
      Add `'/analytics': 'Analytics'` and `'/applications/:id': 'Application Detail'` to `PAGE_TITLES`. Use `location.pathname.startsWith('/applications/')` for the detail route title match (since `:id` is dynamic).
      Files: `client/src/layouts/AppLayout.jsx`
      Verify: build passes

- [ ] 6. **Redesign `Navbar.jsx`** — add user avatar
      Import `useAuth`. Add a right-side 32×32px circular avatar showing the first letter of `user.name` in uppercase, using `background: var(--primary)` and `color: #fff`. Add to the right side of the header alongside any future items.
      Files: `client/src/components/Navbar.jsx`
      Verify: build passes

- [ ] 7. **Redesign `StatCard.jsx`** — fix inline style hack, add trend indicator
      Remove the `<style>` tag inside the component. Replace with `style={{ borderTop: \`3px solid ${color}\` }}` directly on the card div. Add optional `trend` prop (string like '+12%' or null). If provided, render a `<span style={{ color: 'var(--success)', fontSize: '0.75rem' }}>{trend}</span>` below the value.
      Files: `client/src/components/StatCard.jsx`
      Verify: build passes

- [ ] 8. **Create `PriorityBadge.jsx`** — new component
      Accepts `{ priority }` prop. Maps: `'High'` → `'badge badge-high'`, `'Medium'` → `'badge badge-medium'`, `'Low'` → `'badge badge-low'`. Returns `<span className={cls}>{priority}</span>`.
      Files: `client/src/components/PriorityBadge.jsx` (new)
      Verify: build passes

- [ ] 9. **Upgrade `ApplicationTable.jsx`** — add Priority column and detail link
      Import `PriorityBadge` and `{ Link }` from `react-router-dom`. Add `<th>Priority</th>` column after Status. Add `<th></th>` column before Actions for the detail link. In each `<tr>`, add `<td><PriorityBadge priority={app.priority || 'Medium'} /></td>` and `<td><Link to={\`/applications/${app._id}\`} style={{color:'var(--primary-light)',fontSize:'0.82rem'}}>→ View</Link></td>`. Keep all existing columns and logic.
      Files: `client/src/components/ApplicationTable.jsx`
      Verify: build passes

- [ ] 10. **Upgrade `ApplicationForm.jsx`** — add priority and followUpDate fields
      Add `priority: 'Medium'` and `followUpDate: ''` to `DEFAULT_FORM`. In the `useEffect` populating from `application` prop, add those two fields. Add a Priority `<select>` (options: High/Medium/Low) in the 2-column grid row alongside Status. Add a Follow-up Date `<input type="date">` below Location field. In `handleSubmit`, include `priority` in payload; include `followUpDate` only if non-empty (delete it otherwise). Keep all existing validation.
      Files: `client/src/components/ApplicationForm.jsx`
      Verify: build passes

- [ ] 11. **Create `KanbanBoard.jsx`** — static Kanban with Move dropdown (no @dnd-kit to avoid build issues)
      Decision: implement as static Kanban (not drag-and-drop) to guarantee build safety with React 19 + react-scripts 5. Props: `{ applications, onEdit, onDelete, onStatusChange }`. 4 columns: `['Applied','Interview','Offer','Rejected']`. Each column renders cards for `applications.filter(a => a.status === col)`. Card shows: company (bold), role (text-secondary), `<PriorityBadge>`, formatted appliedDate, a Move `<select>` that calls `onStatusChange(app._id, e.target.value)` on change, Edit and Delete icon buttons. Use `.kanban-board`, `.kanban-col`, `.kanban-col-header`, `.kanban-card` CSS classes. Import `PriorityBadge`, `StatusBadge`, `{ formatDate }` from `../utils/helpers`.
      Files: `client/src/components/KanbanBoard.jsx` (new)
      Verify: build passes

- [ ] 12. **Redesign `DashboardPage.jsx`** — greeting, panels, quick CTA
      (A) Import `useAuth` to get `user.name`. Compute greeting by hour: 5–11 → 'Good morning', 12–17 → 'Good afternoon', else → 'Good evening'. (B) Keep the 5 stat cards, use updated StatCard. (C) After stats, add a two-column panel row (flex, gap 1.5rem, wrap): Left panel card `.card` titled 'Needs Attention' — fetch all applications, filter where `app.followUpDate && new Date(app.followUpDate) <= new Date()`, show as a list (company + role + formatted date + overdue badge if > 1 day overdue). Right panel card titled 'Upcoming Interviews' — filter `app.status === 'Interview'`, sort by interviewDate, show top 3. If empty, show a small `<p className="text-muted">` message. (D) Keep existing Recent Applications card. (E) If `stats.total === 0`, replace Recent Applications with a large EmptyState with action button 'Add Your First Application'. Load all applications with `api.get('/api/applications')` in addition to the stats call. Deduplication: the dashboard fetches stats AND all apps in parallel via `Promise.all`.
      Files: `client/src/pages/DashboardPage.jsx`
      Verify: build passes

- [ ] 13. **Upgrade `ApplicationsPage.jsx`** — add Kanban toggle
      Add `const [viewMode, setViewMode] = useState('list')`. In page-header, add a view toggle button group (two small buttons: '⊞ List' and '⊟ Kanban') that sets viewMode. The selected button uses `.btn .btn-primary`, the other uses `.btn .btn-ghost`. Hide `.filters-bar` in kanban mode (`viewMode !== 'list'`). When `viewMode === 'kanban'`, render `<KanbanBoard applications={applications} onEdit={handleEdit} onDelete={handleDelete} onStatusChange={handleStatusChange} />`. Add `handleStatusChange` async function: calls `api.put(\`/api/applications/${id}\`, { status: newStatus })`, updates local state with the returned data. Import `KanbanBoard`.
      Files: `client/src/pages/ApplicationsPage.jsx`
      Verify: `cd client && npm run build` exits 0

---

## FEAT-003 — Application Detail Page + Analytics Page (Phases 4–5)

- [ ] 14. **Add routes in `App.jsx`** for two new pages
      Import `ApplicationDetailPage` and `AnalyticsPage`. Add routes: `/applications/:id` (ProtectedRoute + AppLayout + ApplicationDetailPage) placed BEFORE the `/applications` route. Add `/analytics` (ProtectedRoute + AppLayout + AnalyticsPage).
      Files: `client/src/App.jsx`
      Verify: build passes

- [ ] 15. **Create `ApplicationDetailPage.jsx`**
      Route `/applications/:id`. Use `useParams()` for id, `useNavigate()` for delete redirect. Fetch `api.get(\`/api/applications/${id}\`)` on mount — show `<LoadingSpinner />` during load. On error: show card with error message and 'Back to Applications' link. Layout: page-header (back button, title = company + ' — ' + role, StatusBadge + PriorityBadge, Edit button opens ApplicationForm modal, Delete button with confirm). Below header: `.detail-grid` (2 columns). Left card: Company, Role, Location, Applied Date (formatDate), Job Link (external anchor or '—'), Notes (pre-wrap text block). Right column: 3 stacked cards. Card 1 (Follow-up): shows followUpDate or 'Not set'; shows '⚠ Overdue' warning span in --danger if date < today. Card 2 (Interview Prep, conditionally shown when `app.status === 'Interview'`): shows interviewDate (formatDate), interviewNotes (textarea-style pre), interviewOutcome badge, and preparationChecklist as `<ul>` of `<li><input type="checkbox" checked={item.done} onChange={...} /> {item.text}</li>`; checkbox onChange calls `api.put(\`/api/applications/${id}\`, { preparationChecklist: updatedList })` and updates local state. Card 3 (Timeline): `.timeline` with items for createdAt ('Applied on …'), interviewDate if exists ('Interview on …'), followUpDate if exists ('Follow-up on …'). Edit modal: use existing `ApplicationForm` component with `application={app}` and `onSaved={(saved) => setApp(saved)}`.
      Files: `client/src/pages/ApplicationDetailPage.jsx` (new)
      Verify: build passes

- [ ] 16. **Create `AnalyticsPage.jsx`** using recharts named imports
      Route `/analytics`. Fetch `Promise.all([api.get('/api/applications'), api.get('/api/applications/stats')])`. Use recharts named imports — NEVER default import from recharts: `import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area, CartesianGrid, Legend } from 'recharts'`. Sections: (A) Full-width Application Funnel BarChart — `data = [{name:'Applied',value:stats.Applied},{name:'Interview',value:stats.Interview},{name:'Offer',value:stats.Offer},{name:'Rejected',value:stats.Rejected}]`. Each Bar fill array `['#3b82f6','#f59e0b','#10b981','#ef4444']` — use a custom Bar shape or pass fill per Cell if needed. Simpler: use 4 separate `<Bar>` components each with a fixed fill color and dataKey. Actually simplest: `<Bar dataKey="value" fill="#6366f1" />` and let each bar be the same color, override with Cell: map data with `<Cell key={i} fill={colors[i]} />`. (B) Half-width Status Distribution PieChart — same data, Cell per status with matching colors. (C) Full-width Applications Over Time AreaChart — group applications by `format(parseISO(app.appliedDate), 'MMM d')` weekly buckets using date-fns, build `[{date:'Jan 1', count:N},...]`. (D) Half-width Conversion Rates — 3 plain stat cards (no recharts needed): Interview Rate, Offer Rate, Rejection Rate percentages. (E) Half-width Priority Breakdown — count from applications array: `{ High: apps.filter(a=>a.priority==='High').length, ... }` — render as a small horizontal list or mini bar. Wrap everything in `<div className="analytics-grid">` for 2-col layout.
      Files: `client/src/pages/AnalyticsPage.jsx` (new)
      Verify: `cd client && npm run build` exits 0

---

## FEAT-004 — Final polish + build verification (Phases polishing)

- [ ] 17. **Polish `LoginPage.jsx`** — visual upgrade
      Add radial-gradient overlay to the auth-layout in AuthLayout or pass a style prop. Simplest: in `AuthLayout.jsx`, add `style={{ background: 'radial-gradient(ellipse at top, rgba(99,102,241,0.08) 0%, var(--bg) 60%)' }}` to the outer div. This benefits both Login and Register automatically.
      Files: `client/src/layouts/AuthLayout.jsx`
      Verify: build passes

- [ ] 18. **Polish `RegisterPage.jsx`** — password strength indicator
      Below the password input, add a `<span>` that shows 'Strong ✓' (--success) if length >= 8, 'Good' (--warning) if >= 6, 'Too short' (--danger) if < 6. Update only when `form.password.length > 0`. Pure display — does not change validation logic.
      Files: `client/src/pages/RegisterPage.jsx`
      Verify: build passes

- [ ] 19. **Polish `ProfilePage.jsx`** — add application stats row
      After the profile card, add a stats fetch: `api.get('/api/applications/stats')` in a separate `useEffect`. Render a flex row of 4 small inline stat chips: 'Total Applications', 'Interviews', 'Offers', 'Rejection Rate (%)'. Use simple styled divs — no new component needed.
      Files: `client/src/pages/ProfilePage.jsx`
      Verify: build passes

- [ ] 20. **Upgrade `EmptyState.jsx`** — optional action button
      Add optional `action` prop `{ label: string, onClick: fn }`. If provided, render `<button className="btn btn-primary" onClick={action.onClick} style={{marginTop:'1rem'}}>{action.label}</button>` below the message. No change to existing behavior when `action` is omitted.
      Files: `client/src/components/EmptyState.jsx`
      Verify: build passes

- [ ] 21. **Update `App.jsx` Toaster theme** to match new design tokens
      Update `toastOptions.style` to `{ background: '#1a2236', color: '#f1f5f9', border: '1px solid #1f2d45' }`. Update icon themes accordingly.
      Files: `client/src/App.jsx`
      Verify: build passes

- [ ] 22. **Final build clean pass** — fix any remaining compile errors
      Run `cd client && npm run build`. Fix any `is defined but never used` errors (ESLint errors that CRA treats as build errors), any missing `key` props in `.map()`, any bad imports. Do NOT suppress with eslint-disable comments unless truly unavoidable.
      Files: any files with compile errors
      Verify: `cd /Users/amiteshkumardubey/Desktop/jobTracker/client && npm run build` exits 0 with no errors

---

## Package install reference

```bash
cd /Users/amiteshkumardubey/Desktop/jobTracker/client
npm install --save recharts@2.12.7 @dnd-kit/core@6.1.0 @dnd-kit/sortable@8.0.0 @dnd-kit/utilities@3.2.2
```

> `@dnd-kit` is installed but intentionally NOT used in KanbanBoard (static Move dropdown is used instead) to avoid React 19 peer-dep issues. The packages are present for future use.

## Backend fields added (Application.js)

| Field | Type | Default | Notes |
|---|---|---|---|
| `priority` | String enum | `'Medium'` | High / Medium / Low |
| `followUpDate` | Date | — | optional |
| `interviewDate` | Date | — | optional |
| `interviewNotes` | String | — | maxlength 2000 |
| `interviewOutcome` | String enum | `'Pending'` | Pending / Passed / Failed |
| `preparationChecklist` | Array `[{text,done}]` | `[]` | interview prep items |

All fields are optional. Existing documents are unaffected. No migration needed.

## New routes (App.jsx)

| Route | Component | Notes |
|---|---|---|
| `/applications/:id` | `ApplicationDetailPage` | Place BEFORE `/applications` route |
| `/analytics` | `AnalyticsPage` | — |

## Build pitfalls to watch for

1. **recharts named imports only** — `import { BarChart, Bar, ... } from 'recharts'`. No default export exists.
2. **@dnd-kit not used** — installed but KanbanBoard uses plain HTML select for status moves to avoid peer-dep issues.
3. **date-fns** — already in `package.json`. Use `{ format, parseISO, isValid, isBefore, isAfter }` from `'date-fns'`.
4. **Dynamic route title** — AppLayout must use `location.pathname.startsWith('/applications/')` for the detail page since `location.pathname` is `/applications/some-mongo-id`, not a static string.
5. **No `/* eslint-disable */` comments** — fix actual issues.
6. **preparationChecklist checkbox updates** — must send the entire updated array to `api.put`, not a partial patch.
7. **Stats endpoint returns `{ success, data: { total, Applied, Interview, Offer, Rejected } }`** — always access `res.data.data.Applied`, not `res.data.Applied`.
