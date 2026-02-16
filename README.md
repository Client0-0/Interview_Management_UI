# Interview Management System — Frontend

A modern, full-featured **React** frontend for managing recruitment interviews end-to-end. Built with **TypeScript**, **Vite**, and a custom glassmorphism design system.

---

## ✨ Key Features

### Role-Based Dashboards
| Role | Dashboard | Capabilities |
|------|-----------|-------------|
| **Admin** | Admin Dashboard | Full system overview, user/candidate/drive management |
| **HR** | HR Dashboard | Candidate shortlisting, bulk uploads, drive coordination |
| **Panel** | Panel Dashboard | Interview scheduling, candidate evaluation, feedback |
| **Mentor** | Mentor Dashboard | Candidate mentoring, drive assignments, progress tracking |
| **Candidate** | Candidate Dashboard | Interview status, feedback review |

### Admin Management Screens
- **Users** — Add, edit, deactivate system users (HR, Panel, Mentor)
- **Candidates** — Manage candidate profiles, bulk upload via CSV
- **Panels** — Assign and manage interview panel members
- **Mentors** — Manage mentors/coordinators
- **HR** — Manage HR team members
- **Drives** — Create and manage recruitment drives with multi-step wizard

### Core Functionality
- **Authentication** — Login, Signup, OTP verification, Forgot/Change password
- **Protected Routes** — Role-based access control with JWT
- **Dashboard Cards** — Stats overview with themed cards
- **Search & Filter** — Real-time search across all management screens
- **CRUD Operations** — Full create/read/update/deactivate for all entities
- **Drive Management** — Multi-step drive creation with panel/mentor assignment
- **Interview Feedback** — Structured feedback forms and review
- **Panel Reassignment** — Reassign panel members across drives

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | React 19 + TypeScript |
| **Build Tool** | Vite (via Rolldown) |
| **Routing** | React Router DOM v7 |
| **HTTP Client** | Axios |
| **Auth** | JWT (jwt-decode) |
| **Icons** | Font Awesome 7 |
| **Notifications** | React Hot Toast / React Toastify |
| **Styling** | Custom CSS with Glassmorphism Design System |
| **Linting** | ESLint 9 + TypeScript-ESLint |

---

## 📁 Project Structure

```
Dev_Frontend/
├── index.html                  # App entry point
├── main.tsx                    # React root + router setup
├── App.tsx                     # Root component
├── package.json
├── vite.config.ts
├── tsconfig.json
│
└── src/
    ├── Components/
    │   ├── Admin/              # Admin section
    │   │   ├── Layout/         # AdminLayout (sidebar + content)
    │   │   ├── DashBoardComponents/  # Dashboard, Users, Candidates,
    │   │   │                         # Panels, Mentor, Hr, Drive,
    │   │   │                         # Assignments, BulkUpload
    │   │   ├── AddDashBoardComponents/  # Create modals (User, HR,
    │   │   │                            # Panel, Mentor, Drive)
    │   │   ├── Edit/           # Edit forms for entities
    │   │   ├── View/           # Detail views (User, Drive, etc.)
    │   │   ├── shared/         # Shared admin components
    │   │   └── styles/         # Global admin CSS
    │   │
    │   ├── Login/              # Login page
    │   ├── Signup.tsx           # Registration page
    │   ├── Otp/                # OTP verification
    │   ├── ForgetPassword/     # Password recovery
    │   ├── ChangePassword/     # Password change
    │   ├── Header/             # App header/navbar
    │   │
    │   ├── HRDashboard/        # HR role dashboard
    │   ├── PanelDashboard/     # Panel role dashboard
    │   ├── MentorDashboard/    # Mentor role dashboard
    │   ├── CandidateDashboard/ # Candidate role dashboard
    │   │
    │   ├── common/             # Reusable components
    │   │   ├── DashboardCard.tsx
    │   │   ├── Input.tsx
    │   │   ├── Select.tsx
    │   │   └── Styles/
    │   │
    │   └── Styles/             # Global component styles
    │
    ├── Services/               # API service layer
    │   ├── Api.ts              # Axios instance config
    │   ├── Auth.Service.ts     # Login, signup, OTP
    │   ├── User.Service.ts     # User/role CRUD operations
    │   ├── Admin.Service.ts    # Dashboard stats
    │   ├── CandidateService.ts # Candidate management
    │   ├── InterviewFeedbackService.ts
    │   ├── ReassignService.ts
    │   ├── PanelReassignService.ts
    │   └── LocalStorage.Service.ts  # Token/session storage
    │
    ├── Models/                 # TypeScript interfaces
    │   ├── user.ts             # User, DashboardStats, etc.
    │   ├── Drive.ts            # Drive-related types
    │   ├── Candidate.ts        # Candidate types
    │   ├── Feedback.ts         # Feedback types
    │   ├── Interview.ts        # Interview types
    │   └── ...                 # 21 type definition files
    │
    ├── Router/
    │   ├── AppRouter.tsx       # All app routes + lazy loading
    │   ├── ProtectedRoute.tsx  # JWT role guard
    │   └── PageLoader.tsx      # Loading spinner
    │
    ├── Utils/
    │   └── toastHelper.ts      # Toast notification utilities
    │
    └── assets/                 # Static assets
```

---

## Getting Started

### Prerequisites
- **Node.js** ≥ 18
- **npm** ≥ 9

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd Dev_Frontend

# Install dependencies
npm install
```

### Development

```bash
# Start the dev server (default: http://localhost:5173)
npm run dev
```

### Build

```bash
# Type-check + production build
npm run build

# Preview production build
npm run preview
```

### Lint

```bash
npm run lint
```

---

## Design System

The application uses a custom **Glassmorphism Design System** with:

- **Glass panels** — Semi-transparent backgrounds with `backdrop-filter: blur()`
- **Themed stat cards** — Color-coded dashboard cards (blue, green, purple, orange, cyan, red, gray)
- **Consistent modals** — Shared glassmorphism modal styles across all CRUD operations
- **Data tables** — Clean, bordered tables with hover effects and action menus
- **Responsive layout** — Sidebar navigation with collapsible menu
- **Micro-animations** — Hover effects, shimmer overlays, smooth transitions

### CSS Architecture
| File | Purpose |
|------|---------|
| `global.css` | Shared glassmorphism table, page, and utility styles |
| `Model.css` | Glassmorphism modal backdrop, body, and action styles |
| `DashboardCard.css` | Themed stat card styles |
| `Login.css` | Login/auth page styles |
| `dashboard.css` | Admin dashboard layout |

---

## Authentication Flow

1. **Login** → Credentials → JWT token stored in `localStorage`
2. **Token decode** → Role extracted via `jwt-decode`
3. **Route guard** → `ProtectedRoute` checks role + token validity
4. **Role routing** → Admin → `/admin`, HR → `/hr-dashboard`, etc.
5. **Session** → Token managed via `LocalStorage.Service`

---

## API Integration

All API calls go through a centralized Axios instance (`Services/Api.ts`) with:
- Base URL configuration
- JWT token auto-injection via interceptors
- Standardized error handling

> **Note:** The app includes mock data fallbacks for all screens, allowing the frontend to run independently without a backend.

---

## License

This project is private and proprietary.
