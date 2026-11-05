# Campus Connect Portal 🎓

> **A Centralized University Digital Operations & Academic Management SaaS Platform**  
> Connecting Students, Instructional Faculty, and University Administrators through a unified, responsive interface.

---

## 📋 Table of Contents
1. [Project Overview](#-project-overview)
2. [Problem Statement](#-problem-statement)
3. [Project Objectives](#-project-objectives)
4. [User Roles & Key Capabilities](#-user-roles--key-capabilities)
5. [Feature Matrix](#-feature-matrix)
6. [Technology Stack](#-technology-stack)
7. [System Architecture](#-system-architecture)
8. [Folder Structure](#-folder-structure)
9. [Installation & Setup](#-installation--setup)
10. [Demonstration Credentials](#-demonstration-credentials)
11. [Data Persistence & Prototype Architecture](#-data-persistence--prototype-architecture)
12. [Current Limitations](#-current-limitations)
13. [Future Roadmap](#-future-roadmap)

---

## 🏛️ Project Overview

**Campus Connect Portal** is an enterprise-grade digital campus management web application designed for higher education institutions. The portal unifies academic life, campus announcements, event registries, coursework submissions, grading workflows, and administrative directory services into a seamless, role-governed experience.

Built with **React 18**, **Vite**, and **React Router DOM**, the platform features a responsive SaaS aesthetic adhering to modern institutional design systems—featuring deep navy blues, crisp slate neutrals, and emerald green accents.

---

## ⚠️ Problem Statement

Modern university campuses often struggle with fragmented communication channels:
- Announcements posted across disjointed bulletin boards, disparate email listservs, and social apps.
- Disconnected event registrations leading to attendance mismanagement and overbooking.
- Inconsistent assignment distribution and grading feedback loops between faculty and students.
- Lack of centralized directories for administrative oversight and auditability.

Students miss critical academic deadlines, faculty waste time managing ad-hoc emails, and university leadership lacks actionable visibility into institutional activity.

---

## 🎯 Project Objectives

1. **Unify Campus Communications**: Provide a centralized, categorized, and searchable announcement broadcast system.
2. **Streamline Coursework**: Enable faculty to distribute problem sets, receive digital student solutions, and return constructive feedback.
3. **Engage the Campus Community**: Facilitate discoverability, seat reservation, and roster tracking for university hackathons, guest lectures, and sports events.
4. **Role-Based Workspaces**: Tailor specialized views and tools for **Students**, **Faculty Members**, and **University Administrators** with strict route guard policies.
5. **Zero-Latency Prototyping**: Deliver an immediate, standalone demonstration using persistent browser `localStorage` and a clean service abstraction layer ready for backend integration.

---

## 👥 User Roles & Key Capabilities

### 🎓 1. Student Portal
* **Dashboard Overview**: Personalized greeting, GPA summary, enrolled course progress, pending assignment counters, and quick actions.
* **Academic Information**: Detailed course catalog view displaying assigned faculty, lecture hours, classroom locations, credit weights, and expandable multi-week syllabi.
* **Assignments & Submissions**: View assigned problem sets, deadlines, point totals, upload digital solution archives, and review faculty marks and notes.
* **Campus Events**: Discover upcoming hackathons, career fairs, and workshops; 1-click registration with real-time capacity checks and duplicate registration prevention.
* **Announcements**: Filter university bulletins by category (*Academic, Campus Life, Examination, Administration, Career*) and search by keyword.
* **Student Profile**: Manage contact info, semester standing, avatar presets, and institutional identification.

### 👨‍🏫 2. Faculty Portal
* **Faculty Dashboard**: Active teaching metrics, total student count across classes, submission counts, and quick actions.
* **Course Management**: Review assigned lectures, view class rosters, and inspect enrolled student profiles.
* **Assignment Management**: Author new assignments with course selection, detailed prompts, submission deadlines, and maximum points. View submitted student papers and track evaluation progress.
* **Announcement Publishing**: Create, edit, and delete course notices and departmental advisories.
* **Faculty Profile**: Update office location, weekly student office hours, and academic credentials.

### 🏛️ 3. Administrator Console
* **Institutional Dashboard**: Executive overview of total enrolled students, faculty roster size, course offerings, and campus events.
* **User Directory Management**: Complete searchable table of university users with role filtering (*Student, Faculty, Admin*). Add new demo users, edit details, or remove records.
* **Event Hub Administration**: Publish new campus events with capacity limits, edit logistics, cancel events, and inspect the real-time registered student attendee roster.
* **Campus-Wide Announcements**: Publish high-priority and pinned bulletins broadcast across all user portals.
* **System Diagnostics & Audit Trail**: Live chronological audit log recording every login, registration, course action, and announcement update. One-click demonstration state reset.

---

## ⚡ Feature Matrix

| Feature Module | Student | Faculty | Admin |
| :--- | :---: | :---: | :---: |
| **Role-Protected Dashboards** | ✅ | ✅ | ✅ |
| **Global Quick Search** | ✅ | ✅ | ✅ |
| **Notification Center** | ✅ | ✅ | ✅ |
| **Browse Announcements** | ✅ | ✅ | ✅ |
| **Publish/Delete Announcements** | ❌ | ✅ | ✅ |
| **Browse Campus Events** | ✅ | ✅ | ✅ |
| **Event Registration (1-Click)** | ✅ | ❌ | ❌ |
| **Manage Events & View Attendee Rosters** | ❌ | ✅ | ✅ |
| **View Enrolled Courses & Syllabi** | ✅ | ✅ | ✅ |
| **Submit Assignments** | ✅ | ❌ | ❌ |
| **Create & Grade Assignments** | ❌ | ✅ | ✅ |
| **User Directory Management (CRUD)** | ❌ | ❌ | ✅ |
| **System Audit Trail & Diagnostic Logs** | ❌ | ❌ | ✅ |
| **Demonstration State Reset** | ❌ | ❌ | ✅ |

---

## 🛠 Technology Stack

- **Core Framework**: React 18 (`react`, `react-dom`)
- **Build Tool**: Vite 6 (Lightning-fast HMR and optimized production bundling)
- **Routing**: React Router DOM v6 (`BrowserRouter`, nested layouts, `Navigate`, `ProtectedRoute`)
- **Iconography**: Lucide React
- **Styling**: Modern Vanilla CSS3 design system with custom CSS variables, responsive flexbox/grid architectures, and accessibility considerations.
- **Data Persistence**: HTML5 `localStorage` coordinated through a decoupled `storageService.js` abstraction layer.

---

## 🏗 System Architecture

The application is structured following clean architectural principles:

```
┌────────────────────────────────────────────────────────┐
│                       UI Layer                         │
│  (React Router DOM + Pages + Reusable Components)       │
└──────────────────────────┬─────────────────────────────┘
                           │
┌──────────────────────────▼─────────────────────────────┐
│                     Context Layer                      │
│      AuthContext.jsx          ToastContext.jsx         │
└──────────────────────────┬─────────────────────────────┘
                           │
┌──────────────────────────▼─────────────────────────────┐
│                     Service Layer                      │
│                   storageService.js                    │
│   (Encapsulates CRUD, activity logging & validation)   │
└──────────────┬──────────────────────────┬──────────────┘
               │                          │
┌──────────────▼───────────┐   ┌──────────▼──────────────┐
│    HTML5 LocalStorage    │   │  mockData.js (Fallback) │
└──────────────────────────┘   └─────────────────────────┘
```

> **Clean Backend Integration**: Because all state mutations pass through `storageService.js`, swapping `localStorage` for a RESTful API or GraphQL backend (e.g. Express, Django, FastAPI) simply requires changing the methods in `src/services/storageService.js` without rewriting any UI components.

---

## 📁 Folder Structure

```
campus-connect-portal/
├── public/
│   └── vite.svg
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── ConfirmDialog.jsx      # Reusable confirmation modal for deletes
│   │   ├── DashboardLayout.jsx    # Persistent layout with Sidebar and Navbar
│   │   ├── Modal.jsx              # Reusable accessible dialog overlay
│   │   ├── Navbar.jsx             # Top bar with global search, notifications, & demo switcher
│   │   ├── ProtectedRoute.jsx     # Role-based route authorization guard
│   │   ├── Sidebar.jsx            # Role-specific navigation drawer
│   │   ├── StatCard.jsx           # Metric visualization card
│   │   └── Toast.jsx              # Toast container & animated notifications
│   ├── context/
│   │   ├── AuthContext.jsx        # Session state, login/register, profile updates
│   │   └── ToastContext.jsx       # Global notification dispatcher
│   ├── data/
│   │   └── mockData.js            # Initial institutional seed dataset
│   ├── pages/
│   │   ├── AdminDashboard.jsx     # Administrator console
│   │   ├── AdminSystem.jsx        # System diagnostics and full audit trail
│   │   ├── Announcements.jsx      # University announcements feed & editor
│   │   ├── Assignments.jsx        # Coursework submission & grading portal
│   │   ├── Courses.jsx            # Course catalog, syllabi, & class rosters
│   │   ├── Events.jsx             # Campus event hub & registration manager
│   │   ├── FacultyDashboard.jsx   # Faculty workspace
│   │   ├── Login.jsx              # Institutional login with demo account autofill
│   │   ├── Profile.jsx            # User profile editor and digital ID card
│   │   ├── Register.jsx           # Account creation interface
│   │   ├── StudentDashboard.jsx   # Student overview
│   │   └── UserManagement.jsx     # Administrator user directory (CRUD)
│   ├── services/
│   │   └── storageService.js      # Persistent storage & business logic layer
│   ├── styles/
│   │   └── global.css             # Comprehensive design system
│   ├── App.jsx                    # Route hierarchy & role guards
│   └── main.jsx                   # Application entry point
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

---

## 🚀 Installation & Setup

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

### Steps

1. **Clone or Navigate to the Workspace**:
   ```bash
   cd campus-connect-portal
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Start the Development Server**:
   ```bash
   npm run dev
   ```
   Open your browser and navigate to `http://localhost:5173`.

4. **Build for Production**:
   ```bash
   npm run build
   ```

5. **Preview Production Build**:
   ```bash
   npm run preview
   ```

---

## 🔑 Demonstration Credentials

For testing and evaluation, pre-configured accounts are ready to use. You can also click the **Quick Demo Account** buttons on the Login page or in the top navigation bar to switch accounts in 1 click!

| Role | Email | Password | Details |
| :--- | :--- | :--- | :--- |
| **Student** | `student@campus.com` | `student123` | Alex Johnson (CS-2023-049, 5th Sem) |
| **Faculty** | `faculty@campus.com` | `faculty123` | Dr. Robert Vance (Associate Professor & Chair) |
| **Administrator** | `admin@campus.com` | `admin123` | Dean Eleanor Wright (Dean of Digital Infrastructure) |

*You can also register brand-new demonstration accounts via the `/register` page.*

---

## 💾 Data Persistence & Prototype Architecture

> [!IMPORTANT]
> **Prototype Demonstration Notice**:
> This application is an interactive prototype designed for evaluation. It utilizes **browser `localStorage`** for client-side persistence and demonstration authentication rather than a production-grade identity provider or remote database.
>
> - Any announcement you post, event you register for, user you create, or profile change you save will persist across browser refreshes and page reloads.
> - If you ever want to revert back to the pristine default mock state, log in as **Admin** and click **"Reset Demo State"** on the dashboard or in the System Activity tab.

---

## ⚠️ Current Limitations

- **Authentication Security**: Passwords are saved in plain text in client-side storage for demonstration purposes only. Production deployments require bcrypt password hashing, JWT/OAuth2 tokens, and secure HTTP-only cookies.
- **File Uploads**: Assignment submissions currently register simulated file metadata (`.pdf`, `.zip`) rather than streaming binary blobs to an Amazon S3 or Google Cloud Storage bucket.
- **Single-Client Isolation**: State is maintained per browser instance. Changes made in one browser window will not reflect in another user's separate browser unless shared via a synchronized backend.

---

## 🔮 Future Roadmap

1. **Full-Stack REST Backend**: Migrate `storageService.js` to an Express/PostgreSQL or NestJS backend with Prisma ORM.
2. **Real-Time WebSockets**: Instant push notifications for deadline alerts, grade publications, and chat messaging.
3. **Automated Autograding**: Sandbox execution container for student code submissions with automated unit tests.
4. **Attendance Tracking**: QR-code based event and classroom check-in system.
5. **Fee Payment & Bursar Module**: Integration with Stripe for tuition payments, library fines, and housing fee settlements.

---

*Developed for Academic Operations & Modern University Campus Management.*
