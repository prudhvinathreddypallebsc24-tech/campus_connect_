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
Listen carefully these are the four files this analyse and understand what actually happened is that my lecturers like that to do a mini project so I did completely with anti gravity now what I have to do if that to create report according to what the four PDFs  is saying to you ask me questions what you actually want I will upload to you whether they are screenshots are links I will give to you we have to give me create a report according to the PDF format what are the details my usn  and my name everything ask what you want i want to get 20/20 marks annd  still first give me clarity what to upload in assignemt
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

---

## Experiment 6

**Developing and Consuming Backend Services Using RESTful API Principles (Node.js and Express)**

**Aim:** To develop and consume backend services that follow RESTful API principles, supporting basic CRUD operations with middleware handling using Node.js and Express.

### Technology
- **Node.js** — JavaScript runtime
- **Express.js** — Web framework
- **CORS** — Cross-origin support
- **Nodemon** — Dev auto-restart

### API Architecture

```
Postman / Frontend → HTTP Request → Express Server
  → cors() → express.json() → logger()
  → Routes → Controller → In-Memory Data
  → JSON Response
```

### REST Resource: `/api/students`

| Operation | HTTP Method | Endpoint | Status Code |
|-----------|-------------|----------|-------------|
| Create | `POST` | `/api/students` | 201 |
| Read All | `GET` | `/api/students` | 200 |
| Read One | `GET` | `/api/students/:id` | 200 |
| Update | `PUT` | `/api/students/:id` | 200 |
| Delete | `DELETE` | `/api/students/:id` | 200 |

### Student Schema

```json
{
  "id": "STU001",
  "name": "Abhishek Patil",
  "email": "abhishek@campusconnect.edu",
  "department": "Computer Science",
  "year": 2,
  "skills": ["JavaScript", "React", "Node.js"]
}
```

### Middleware Stack

| Middleware | File | Purpose |
|-----------|------|---------|
| `cors()` | built-in | Allow cross-origin requests |
| `express.json()` | built-in | Parse JSON request bodies |
| `logger` | `middleware/logger.js` | Log all requests with timestamp |
| `notFound` | `middleware/notFound.js` | 404 for unmatched routes |
| `errorHandler` | `middleware/errorHandler.js` | Central JSON error responses |

### HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200 | OK — GET / PUT / DELETE success |
| 201 | Created — POST success |
| 400 | Bad Request — validation error |
| 404 | Not Found — student or route missing |
| 500 | Internal Server Error |

### Running the Backend

```bash
cd server
npm install
npm run dev
# API running at http://localhost:5000
```

### Postman Testing

Import: `docs/Campus-Connect-Experiment-6.postman_collection.json`

Base URL: `http://localhost:5000`

### Server File Structure

```
server/
├── server.js
├── routes/studentRoutes.js
├── controllers/studentController.js
├── middleware/
│   ├── logger.js
│   ├── errorHandler.js
│   └── notFound.js
└── data/students.js
```

### Documentation

- Full API docs: [`docs/EXPERIMENT_6.md`](docs/EXPERIMENT_6.md)
- Postman collection: [`docs/Campus-Connect-Experiment-6.postman_collection.json`](docs/Campus-Connect-Experiment-6.postman_collection.json)

---

## GitHub Repository

🔗 **https://github.com/PatilAbhishek7/campus-connect-portal**
