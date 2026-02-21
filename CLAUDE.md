# CLAUDE.md

## Project Overview

Timesheet Generator is a React-based web application for managing employee timesheets. Built on top of the Horizon UI Tailwind React template, it provides role-based dashboards for **admin** and **staff** users.

## Tech Stack

- **React 19** with React Router v6
- **Tailwind CSS** for styling
- **Chakra UI** (hooks/modal/popover/tooltip) for UI components
- **Axios** for HTTP requests
- **react-hook-form** + **Controller** for form state management
- **react-select** and **react-datepicker** for inputs
- **react-toastify** for notifications
- **sweetalert2** for confirmation dialogs
- **apexcharts** / **react-apexcharts** for charts
- **jwt-decode** for parsing JWT tokens

## Development Commands

```bash
npm install          # Install dependencies
npm start            # Start dev server on port 3006
npm run build        # Production build
npm test             # Run tests
npm run pretty       # Format code with Prettier
```

> The dev server runs on **port 3006** (set via `set PORT=3006` in the start script).

## Environment Variables

The app uses a single env variable defined in `.env`:

```
REACT_APP_URL_API="https://backend-timesheet-gen-vercel.vercel.app"
```

All API calls reference `process.env.REACT_APP_URL_API`. Do not hard-code the base URL.

## Project Structure

```
src/
├── App.jsx                  # Root router with role-based route guards
├── ProtectedRules.js        # JWT-based role guard component
├── context/
│   └── AuthContext.jsx      # Auth context (role, token)
├── layouts/
│   ├── admin/               # Admin shell layout
│   ├── auth/                # Auth pages layout
│   └── user/                # Staff shell layout
├── views/
│   ├── auth/                # SignIn, Registration
│   ├── admin/               # Admin dashboard, tables, profile
│   └── user/                # Staff dashboard, timesheet CRUD
└── components/              # Shared UI components (cards, charts, fields, etc.)
```

## Authentication & Authorization

- JWT tokens are stored in **localStorage** under the key `token`.
- Two roles: `admin` and `staff`.
- `ProtectedRoute` (src/ProtectedRules.js) decodes the JWT and redirects to `/unauthorized` if the role is not in `allowedRoles`.
- Unauthenticated users are redirected to `/auth/sign-in`.
- Token payload is decoded with `jwt-decode`; vendor info is extracted from the token to pre-fill form fields.

## Key API Endpoints (relative to `REACT_APP_URL_API`)

| Method | Path | Purpose |
|--------|------|---------|
| POST | `/api/timesheet` | Submit a new timesheet |
| GET | `/api/vendor` | Fetch vendor list |
| GET | `/api/department` | Fetch department list |
| GET | `/api/divisi` | Fetch division list |
| GET | `/api/team` | Fetch team list |

All requests require `Authorization: Bearer <token>` header.

## Timesheet Form

The timesheet form (`src/views/user/tables/components/AddTimeSheetForm.jsx`) uses a two-tab flow:

1. **Timesheet Details** – divisi, department, team, vendor, month/year
2. **Activity** – per-day entries with type, date, clockIn, clockOut, project, projectCode, activities

Activity type options:

| Value | Label |
|-------|-------|
| `H` | Hadir (Present) |
| `C` | Cuti (Leave) |
| `S` | Sakit (Sick) |
| `I` | Izin (Permission) |
| `L` | Libur / Cuti Bersama (Holiday) |

- Clock In/Out and project fields are disabled for non-`H` types.
- The `activities` field is disabled for types other than `H` and `L`.
- The `type` field is stripped before submission.

## Code Style

- Prettier is configured via `prettier.config.js` with the `prettier-plugin-tailwindcss` plugin.
- Run `npm run pretty` before committing to auto-format all `.js`, `.jsx`, and `.json` files.
- Follow existing component patterns (functional components, hooks, Controller for form fields).

## Deployment

The app is configured for deployment on **Netlify** (`netlify.toml`, `public/_redirects`).
