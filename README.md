# Campus Connect

A prototype Campus Connect authentication application built for **CS3301 Full Stack Development — Experiment 4**.

> **Note:** This is a laboratory prototype demonstrating application state, UI interaction, and version control. It is not a production-grade authentication system.

---

## Experiment 4

**Building a Small Interactive Web Application with State Handling and Version Control**

**Aim:** To develop a small interactive web application that manages its own state, while practising version control using Git and GitHub.

---

## Features

| Feature | Description |
|---------|-------------|
| **Sign In** | Email + password login with validation |
| **Registration** | Full name, email, password, confirm password with inline validation |
| **Form Validation** | Required fields, email format, password length, password match |
| **Login/Register switching** | Instant UI change via application state — no page reload |
| **Prototype authentication** | Credential comparison driven entirely by React state |
| **localStorage persistence** | Registered user persists across browser refreshes |
| **Dashboard** | Personalised welcome, quick access grid, account info |
| **Logout** | Clears session state — returns to Sign In without reload |
| **Responsive UI** | Works on desktop, tablet, and mobile |
| **Accessible UI** | Proper labels, ARIA roles, focus management, keyboard support |

---

## State Management

This application clearly demonstrates how **state drives the user interface** — the core concept of Experiment 4.

### State Variables

| Variable | Type | Purpose |
|----------|------|---------|
| `authMode` | `'login' \| 'register'` | Controls which form is rendered |
| `registeredUser` | `{ name, email, password } \| null` | Stores the prototype account |
| `currentUser` | `{ name, email } \| null` | The authenticated user's info |
| `isAuthenticated` | `boolean` | Switches between Dashboard and Auth screen |
| `errorMessage` | `string` | Validation / auth errors shown in the UI |
| `successMessage` | `string` | Post-registration success message |

### State Flow

```
User Action (click / type / submit)
         ↓
  Event Handler fires
  (handleLogin / handleRegister / handleLogout / setAuthMode)
         ↓
  State Update
  (setState / setIsAuthenticated / setAuthMode / …)
         ↓
  React Re-render
  (component function re-executes with new state values)
         ↓
  Updated UI
  (new screen, form, or message appears — no page reload)
```

### Concrete State Flow Examples

**Switching from Login → Register:**
```
Click "Create Account"
  → handleSwitchToRegister()
    → setAuthMode('register')
      → React re-renders
        → RegisterForm renders instead of LoginForm
```

**Successful Registration:**
```
Submit valid registration form
  → handleRegister(name, email, password)
    → setRegisteredUser({ name, email, password })  ← stored in state + localStorage
    → setAuthMode('login')
    → setSuccessMessage("Registration successful!")
      → React re-renders
        → LoginForm renders with success message visible
```

**Successful Login:**
```
Submit valid credentials
  → handleLogin(email, password)
    → credentials match registeredUser in state
    → setCurrentUser({ name, email })
    → setIsAuthenticated(true)
      → React re-renders
        → Dashboard renders instead of AuthLayout
```

**Logout:**
```
Click "Logout"
  → handleLogout()
    → setIsAuthenticated(false)
    → setCurrentUser(null)
    → localStorage.removeItem(...)
      → React re-renders
        → AuthLayout + LoginForm renders
        → Dashboard unmounts
        (all without a full page reload)
```

---

## Technology Stack

| Technology | Purpose |
|------------|---------|
| **React 19** | Component-based UI, state management with `useState` |
| **Vite 8** | Development server, hot module replacement, build tool |
| **JavaScript (ES2022)** | Application logic |
| **CSS3** | Responsive design with custom properties, flexbox, grid |
| **localStorage** | Prototype persistence between page refreshes |
| **Git** | Version control throughout development |
| **GitHub** | Remote repository hosting |

---

## Project Structure

```
campus-connect-portal/
├── client/                        # React + Vite frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── AuthLayout.jsx     # Two-column auth page layout
│   │   │   ├── LoginForm.jsx      # Login form with state-driven validation
│   │   │   ├── RegisterForm.jsx   # Registration form with inline errors
│   │   │   ├── Dashboard.jsx      # Authenticated dashboard view
│   │   │   └── Message.jsx        # Reusable success/error message component
│   │   ├── App.jsx                # Root component — all top-level state
│   │   ├── App.css                # Component styles
│   │   ├── index.css              # Global design tokens and resets
│   │   └── main.jsx               # React entry point
│   ├── index.html
│   └── package.json
├── server/                        # Express + MongoDB backend (future use)
│   └── package.json               # Has bcryptjs, JWT, mongoose ready
├── docs/
│   └── EXPERIMENT_4.md            # Detailed experiment documentation
└── README.md
```

---

## Running the Project

### Prerequisites
- Node.js 18+ installed
- npm or yarn

### Start the Frontend

```bash
cd client
npm install
npm run dev
```

The application will be available at: **http://localhost:5173**

### Build for Production

```bash
cd client
npm run build
```

---

## Prototype Authentication Note

> ⚠️ **Important:** This application uses `localStorage`-based prototype authentication **for laboratory demonstration only**.

In this prototype:
- The registered user's data (including password) is stored in browser `localStorage`
- Credentials are compared directly in JavaScript state
- There is **no password hashing** or server-side validation

**In a real production application:**
- Passwords MUST be hashed using `bcrypt` on the server
- Authentication MUST use JWT tokens or server-side sessions
- All communication MUST use HTTPS
- NEVER store plain-text passwords on the client

The `server/` directory already has `bcryptjs`, `jsonwebtoken`, `express`, and `mongoose` installed — ready for proper backend authentication in future experiments (Experiment 6 & 7).

---

## Version Control

### Commit History

This project was developed with meaningful commits aligned to the lab manual requirements:

| # | Commit Message | Description |
|---|---------------|-------------|
| 1 | `Initial commit: Setup project folder structure for client and server` | Initial project scaffold |
| 2 | `feat: replace Vite starter with Campus Connect structure` | Removed Vite demo, added components |
| 3 | `feat: add login and registration state handling` | Core state management in App.jsx |
| 4 | `feat: add authentication validation and prototype persistence` | Validation + localStorage |
| 5 | `feat: add Campus Connect dashboard and logout flow` | Dashboard + logout state flow |
| 6 | `style: create responsive Campus Connect interface` | CSS design system + responsiveness |
| 7 | `docs: document Experiment 4 implementation and state flow` | README + EXPERIMENT_4.md |

---

## GitHub Repository

🔗 **https://github.com/PatilAbhishek7/campus-connect-portal**

---

## Lab Manual Reference

**Course:** CS3301 Full Stack Development  
**Experiment:** 4  
**Title:** Building a Small Interactive Web Application with State Handling and Version Control  
**Aim:** To develop a small interactive web application that manages its own state, while practising version control using Git and GitHub.
