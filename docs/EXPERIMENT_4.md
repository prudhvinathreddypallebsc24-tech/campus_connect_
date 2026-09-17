# Experiment 4
## Building a Small Interactive Web Application with State Handling and Version Control

**Course:** CS3301 Full Stack Development  
**Experiment Number:** 4  
**Date:** September 2026

---

## Aim

To develop a small interactive web application that manages its own state, while practising version control using Git and GitHub.

---

## Problem Statement

**Campus Connect Authentication Prototype** is chosen as the interactive application for this experiment.

Campus Connect is a single-page web application that demonstrates:
- Application state management using React `useState`
- How user actions modify state
- How state changes drive immediate UI updates without page reloads
- Client-side form validation with state-driven feedback
- Prototype authentication flow (login, register, logout)
- localStorage for persistence between page refreshes
- Git version control throughout development

This application serves as a practical, real-world inspired demonstration of the concepts required by Experiment 4. It is clearly marked as a laboratory prototype and does not claim to be a production-grade authentication system.

---

## Learning Outcomes Achieved

| # | Learning Outcome | How Demonstrated |
|---|-----------------|-----------------|
| 1 | Combine HTML, CSS, and JavaScript into a working application | React JSX + CSS + JS in `src/` — fully functional application |
| 2 | Understand application state and how it drives the interface | Six state variables in `App.jsx` documented with comments |
| 3 | Update the interface when the underlying state changes | Every user action triggers a state change → immediate UI update |
| 4 | Initialise a Git repository and record changes as commits | Repository initialized, 7 meaningful commits created |
| 5 | Push the project to a remote repository on GitHub | Pushed to `github.com/PatilAbhishek7/campus-connect-portal` |

---

## State Variables

The following state variables were declared in [`App.jsx`](../client/src/App.jsx) using React's `useState` hook:

| State Variable | Type | Initial Value | Purpose |
|---------------|------|---------------|---------|
| `authMode` | `string` | `'login'` | Controls which form is rendered: `'login'` → LoginForm, `'register'` → RegisterForm |
| `registeredUser` | `object \| null` | Loaded from localStorage | Stores the prototype registered account `{ name, email, password }` |
| `currentUser` | `object \| null` | Loaded from localStorage session | The currently authenticated user `{ name, email }` shown in Dashboard |
| `isAuthenticated` | `boolean` | `false` (or `true` if session exists) | Master switch: `true` → Dashboard, `false` → Auth screen |
| `errorMessage` | `string` | `''` | Validation or authentication error displayed in the active form |
| `successMessage` | `string` | `''` | Post-registration success message shown in LoginForm |

---

## State Flow

The application demonstrates the complete state flow required by the lab manual:

```
USER ACTION
     ↓
EVENT HANDLER
     ↓
STATE UPDATE (setState)
     ↓
REACT RE-RENDER (automatic)
     ↓
UPDATED INTERFACE
```

### Flow Examples

#### 1. Login ↔ Register Mode Switch

```
User clicks "Create Account"
     ↓
handleSwitchToRegister() fires
     ↓
setAuthMode('register')
     ↓
React re-renders App
     ↓
authMode === 'register' → RegisterForm renders
(LoginForm unmounts — no page reload)
```

#### 2. Registration Flow

```
User fills all fields correctly, clicks "Create Account"
     ↓
RegisterForm.handleSubmit() fires
validate() checks all fields
All valid → onRegister(name, email, password) called
     ↓
App.handleRegister() fires:
  setRegisteredUser({ name, email, password })   ← state update 1
  setAuthMode('login')                           ← state update 2
  setSuccessMessage("Registration successful!") ← state update 3
     ↓
React re-renders:
  - authMode = 'login' → LoginForm renders
  - successMessage shows in LoginForm
(RegisterForm unmounts — no page reload)
```

#### 3. Login Flow

```
User enters email + password, clicks "Sign In"
     ↓
LoginForm.handleSubmit() fires
  validate fields
  onLogin(email, password) called
     ↓
App.handleLogin() fires:
  Compares email + password against registeredUser state
  Match found:
    setCurrentUser({ name, email })    ← state update 1
    setIsAuthenticated(true)           ← state update 2
    localStorage session saved
     ↓
React re-renders:
  isAuthenticated === true → Dashboard renders
  AuthLayout + LoginForm unmount
(No page reload)
```

#### 4. Logout Flow

```
User clicks "Logout"
     ↓
Dashboard.onLogout() called
     ↓
App.handleLogout() fires:
  setIsAuthenticated(false)   ← state update 1
  setCurrentUser(null)        ← state update 2
  setAuthMode('login')        ← state update 3
  localStorage session cleared
     ↓
React re-renders:
  isAuthenticated === false → AuthLayout renders
  Dashboard unmounts
(No page reload — instant UI transition)
```

#### 5. Validation Error Flow

```
User submits empty Registration form
     ↓
RegisterForm.handleSubmit() fires
validate() detects empty fields
setErrors({ name: 'Full name is required.', ... })
     ↓
React re-renders RegisterForm
  Each field with an error shows a red error message below it
  form-input--error CSS class applied to affected inputs
```

---

## Application State Diagram

```
                     ┌──────────────────────────┐
                     │        App State          │
                     │ authMode = 'login'        │
                     │ isAuthenticated = false   │
                     │ registeredUser = null     │
                     └──────────┬───────────────┘
                                │
                    ┌───────────▼───────────────┐
                    │     AuthLayout (UI)        │
                    │   ┌──────────────────┐     │
                    │   │   LoginForm      │     │
                    │   └──────────────────┘     │
                    └───────────┬───────────────┘
                                │
          ┌─────────────────────┼──────────────────────┐
          │                     │                      │
   Click "Create            Submit Login          Submit Login
   Account"                (wrong creds)         (correct creds)
          │                     │                      │
          ▼                     ▼                      ▼
   authMode='register'   errorMessage set      isAuthenticated=true
   RegisterForm renders  Error shown in UI     currentUser set
                                               Dashboard renders

          │
    Fill form & submit
          │
          ▼
   registeredUser set
   authMode='login'
   successMessage set
   LoginForm renders with
   success message shown

                                                       │
                                               Click "Logout"
                                                       │
                                                       ▼
                                            isAuthenticated=false
                                            currentUser=null
                                            LoginForm renders again
```

---

## Features Implemented

| # | Feature | Status |
|---|---------|--------|
| 1 | Campus Connect branding (left panel) | ✅ Implemented |
| 2 | Login form with email + password | ✅ Implemented |
| 3 | Registration form with 4 fields | ✅ Implemented |
| 4 | Login ↔ Register mode switching (state-based) | ✅ Implemented |
| 5 | Required field validation | ✅ Implemented |
| 6 | Email format validation | ✅ Implemented |
| 7 | Password minimum length (6 chars) | ✅ Implemented |
| 8 | Confirm password match validation | ✅ Implemented |
| 9 | Duplicate account prevention | ✅ Implemented |
| 10 | Registration success message | ✅ Implemented |
| 11 | Login credential comparison | ✅ Implemented |
| 12 | Login error message | ✅ Implemented |
| 13 | Dashboard with welcome and user info | ✅ Implemented |
| 14 | Logout functionality | ✅ Implemented |
| 15 | localStorage prototype persistence | ✅ Implemented |
| 16 | Responsive layout (desktop/tablet/mobile) | ✅ Implemented |
| 17 | Accessible form labels and ARIA | ✅ Implemented |
| 18 | Loading states on form submission | ✅ Implemented |
| 19 | Prototype authentication note | ✅ Implemented |

---

## Component Architecture

```
App.jsx  (top-level state + event handlers)
├── AuthLayout.jsx  (two-column layout wrapper)
│   ├── [brand panel — left]
│   └── [auth card — right]
│       ├── LoginForm.jsx    (when authMode === 'login')
│       │   └── Message.jsx  (success / error display)
│       └── RegisterForm.jsx (when authMode === 'register')
│           └── Message.jsx  (error display)
└── Dashboard.jsx            (when isAuthenticated === true)
```

---

## Testing Results

| Test | Action | Expected | Result |
|------|--------|----------|--------|
| 1 | Open application | Campus Connect Sign In screen | ✅ Pass |
| 2 | Click "Create Account" | Registration form appears — no page reload | ✅ Pass |
| 3 | Submit empty registration | Validation errors appear for all fields | ✅ Pass |
| 4 | Enter invalid email | Email format error appears | ✅ Pass |
| 5 | Passwords don't match | "Passwords do not match" error appears | ✅ Pass |
| 6 | Register with valid data | Success message + login form shown | ✅ Pass |
| 7 | Login with wrong password | "Invalid email or password" error | ✅ Pass |
| 8 | Login with correct credentials | Dashboard renders with user name | ✅ Pass |
| 9 | Refresh after registration | Registered user still available (localStorage) | ✅ Pass |
| 10 | Click Logout | Login screen appears — no page reload | ✅ Pass |
| 11 | Switch Login ↔ Register repeatedly | UI changes correctly each time | ✅ Pass |
| 12 | Resize browser to mobile width | Layout stacks vertically, forms usable | ✅ Pass |
| 13 | `npm run build` | Build succeeds with no errors | ✅ Pass |

---

## Version Control Activity

### Commit History

| Hash | Message | What Changed |
|------|---------|-------------|
| `749edf7` | `Initial commit: Setup project folder structure for client and server` | Initial scaffold |
| _(see git log)_ | `feat: replace Vite starter with Campus Connect structure` | Removed Vite demo code, added component files |
| _(see git log)_ | `feat: add login and registration state handling` | App.jsx state + LoginForm + RegisterForm |
| _(see git log)_ | `feat: add authentication validation and prototype persistence` | Validation logic + localStorage persistence |
| _(see git log)_ | `feat: add Campus Connect dashboard and logout flow` | Dashboard.jsx + logout state flow |
| _(see git log)_ | `style: create responsive Campus Connect interface` | App.css + index.css design system |
| _(see git log)_ | `docs: document Experiment 4 implementation and state flow` | README.md + EXPERIMENT_4.md |

### Commands Used

```bash
# Check current state
git status
git log --oneline

# Stage and commit
git add .
git commit -m "feat: replace Vite starter with Campus Connect structure"

# Push to GitHub
git push origin main
```

### Remote Repository

- **URL:** https://github.com/PatilAbhishek7/campus-connect-portal
- **Branch:** main
- **Remote:** origin

---

## How to Run

```bash
# Navigate to the client directory
cd client

# Install dependencies
npm install

# Start development server
npm run dev
# → Opens at http://localhost:5173

# Build for production
npm run build
```

---

## Conclusion

Experiment 4 has been successfully implemented using the Campus Connect Authentication Prototype. The application clearly demonstrates:

1. **Application State:** Six state variables in `App.jsx` drive every UI decision
2. **User Actions → State Changes:** Every button click and form submission modifies state
3. **State → UI:** React re-renders automatically whenever state changes
4. **No Unnecessary Page Reloads:** All transitions (login/register switch, dashboard, logout) use application state
5. **Version Control:** Meaningful commits at each working stage, pushed to GitHub

The state management pattern demonstrated here — **User Action → Event Handler → State Update → React Re-render → Updated UI** — is the foundation of modern React application development and directly satisfies the learning outcomes of CS3301 Experiment 4.
