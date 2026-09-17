/**
 * App.jsx
 * Campus Connect — CS3301 Full Stack Development
 * Experiment 4: Building a Small Interactive Web Application
 *               with State Handling and Version Control
 *
 * ══════════════════════════════════════════════════════════════
 * APPLICATION STATE — Core of this experiment
 * ══════════════════════════════════════════════════════════════
 *
 * This file manages the top-level application state.
 * All state changes drive UI updates via React re-rendering.
 *
 * State variables:
 *  ┌─────────────────┬────────────────────────────────────────┐
 *  │ State           │ Purpose                                │
 *  ├─────────────────┼────────────────────────────────────────┤
 *  │ authMode        │ 'login' or 'register' — controls which │
 *  │                 │ form is displayed on screen            │
 *  ├─────────────────┼────────────────────────────────────────┤
 *  │ registeredUser  │ Stores the prototype registered account│
 *  │                 │ Also persisted to localStorage         │
 *  ├─────────────────┼────────────────────────────────────────┤
 *  │ currentUser     │ The currently authenticated user object│
 *  ├─────────────────┼────────────────────────────────────────┤
 *  │ isAuthenticated │ true = show Dashboard                  │
 *  │                 │ false = show Auth screen               │
 *  ├─────────────────┼────────────────────────────────────────┤
 *  │ errorMessage    │ Validation / auth error to display     │
 *  ├─────────────────┼────────────────────────────────────────┤
 *  │ successMessage  │ Positive feedback (registration done)  │
 *  └─────────────────┴────────────────────────────────────────┘
 *
 * ══════════════════════════════════════════════════════════════
 * STATE FLOW (Experiment 4 core concept)
 * ══════════════════════════════════════════════════════════════
 *
 *   USER ACTION (click / type / submit)
 *         ↓
 *   EVENT HANDLER (handleLogin, handleRegister, handleLogout…)
 *         ↓
 *   STATE UPDATE  (setState calls)
 *         ↓
 *   REACT RE-RENDER (component re-renders automatically)
 *         ↓
 *   UPDATED UI  (new screen / message / form appears)
 *
 * ══════════════════════════════════════════════════════════════
 * PROTOTYPE AUTHENTICATION NOTE
 * ══════════════════════════════════════════════════════════════
 *
 * ⚠ This application uses localStorage-based prototype
 *   authentication for demonstration purposes ONLY.
 *
 * In a real production application:
 *   - Passwords MUST be hashed using bcrypt on the server
 *   - Authentication MUST use JWT tokens or server sessions
 *   - NEVER store plain-text passwords in localStorage or state
 *   - Use HTTPS and follow OWASP security guidelines
 *
 * The server/ directory already has bcryptjs and JWT configured
 * for future implementation in Experiments 6 & 7.
 * ══════════════════════════════════════════════════════════════
 */

import { useState, useEffect } from 'react';
import AuthLayout from './components/AuthLayout';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import Dashboard from './components/Dashboard';
import './App.css';

// ── localStorage key constants ───────────────────────────────
const STORAGE_KEY_USER = 'campusConnectUser';
const STORAGE_KEY_AUTH = 'campusConnectAuth';

// ── Utility: read prototype user from localStorage ───────────
const loadUserFromStorage = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY_USER);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};

// ── Utility: read auth session from localStorage ─────────────
const loadAuthFromStorage = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY_AUTH);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};

function App() {
  // ══════════════════════════════════════════════════════════
  // TOP-LEVEL STATE DECLARATIONS
  // Each useState call declares a state variable and its setter.
  // When a setter is called, React schedules a re-render.
  // ══════════════════════════════════════════════════════════

  /**
   * authMode: 'login' | 'register'
   * Controls which form is shown on the authentication screen.
   * STATE FLOW:
   *   Click "Create Account" → setAuthMode('register') → RegisterForm renders
   *   Click "Sign In"        → setAuthMode('login')    → LoginForm renders
   */
  const [authMode, setAuthMode] = useState('login');

  /**
   * registeredUser: { name, email, password } | null
   * Stores the prototype user account.
   * Loaded from localStorage on mount (persists across page refreshes).
   *
   * NOTE: Storing passwords in state/localStorage is ONLY acceptable
   * for this laboratory demonstration. Production apps must hash
   * passwords server-side with bcrypt.
   */
  const [registeredUser, setRegisteredUser] = useState(() => loadUserFromStorage());

  /**
   * currentUser: { name, email } | null
   * The currently authenticated user (shown in Dashboard).
   * Loaded from localStorage on mount (restores session on refresh).
   */
  const [currentUser, setCurrentUser] = useState(() => loadAuthFromStorage());

  /**
   * isAuthenticated: boolean
   * The most important state variable for UI routing.
   * true  → renders Dashboard
   * false → renders AuthLayout (Login or Register form)
   */
  const [isAuthenticated, setIsAuthenticated] = useState(() => loadAuthFromStorage() !== null);

  /**
   * errorMessage: string
   * Passed to the active form for display.
   * Set when login/register operations fail.
   */
  const [errorMessage, setErrorMessage] = useState('');

  /**
   * successMessage: string
   * Passed to the login form after successful registration.
   */
  const [successMessage, setSuccessMessage] = useState('');

  // ══════════════════════════════════════════════════════════
  // SIDE EFFECT: Persist registeredUser to localStorage
  // Runs whenever registeredUser state changes.
  // ══════════════════════════════════════════════════════════
  useEffect(() => {
    if (registeredUser) {
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(registeredUser));
    } else {
      localStorage.removeItem(STORAGE_KEY_USER);
    }
  }, [registeredUser]);

  // ══════════════════════════════════════════════════════════
  // EVENT HANDLERS — Each one causes state changes → UI updates
  // ══════════════════════════════════════════════════════════

  /**
   * handleSwitchToRegister
   * USER ACTION: click "Create Account" link
   * STATE CHANGE: authMode → 'register', clear messages
   * UI UPDATE: RegisterForm renders
   */
  const handleSwitchToRegister = () => {
    setAuthMode('register');
    setErrorMessage('');
    setSuccessMessage('');
  };

  /**
   * handleSwitchToLogin
   * USER ACTION: click "Sign In" link
   * STATE CHANGE: authMode → 'login', clear messages
   * UI UPDATE: LoginForm renders
   */
  const handleSwitchToLogin = () => {
    setAuthMode('login');
    setErrorMessage('');
    setSuccessMessage('');
  };

  /**
   * handleRegister
   * USER ACTION: submit registration form with valid data
   *
   * STATE FLOW:
   *   1. Check if account already exists
   *   2. If duplicate → setErrorMessage → error shown in UI
   *   3. If new:
   *      → setRegisteredUser({ name, email, password })
   *        → useEffect persists to localStorage
   *      → setAuthMode('login')  → LoginForm renders
   *      → setSuccessMessage     → success shown in LoginForm
   */
  const handleRegister = (name, email, password) => {
    // Prevent duplicate registration
    if (
      registeredUser &&
      registeredUser.email.toLowerCase() === email.toLowerCase()
    ) {
      setErrorMessage(
        'An account with this email already exists. Please sign in.'
      );
      return;
    }

    // ── STATE CHANGE: store new user ─────────────────────────
    const newUser = { name, email, password };
    setRegisteredUser(newUser);

    // ── STATE CHANGE: switch to login mode ───────────────────
    setAuthMode('login');
    setErrorMessage('');
    setSuccessMessage(
      `Registration successful! Welcome, ${name}. You can now sign in.`
    );
  };

  /**
   * handleLogin
   * USER ACTION: submit login form
   *
   * STATE FLOW:
   *   1. Check if any registered user exists
   *   2. Compare credentials
   *   3. If no match → setErrorMessage → error shown in LoginForm
   *   4. If match:
   *      → setCurrentUser({ name, email })
   *      → setIsAuthenticated(true)
   *        → React re-renders
   *          → Dashboard renders instead of AuthLayout
   */
  const handleLogin = (email, password) => {
    // No account registered yet
    if (!registeredUser) {
      setErrorMessage(
        'No account found. Please create an account first.'
      );
      return false;
    }

    // Compare email (case-insensitive) and password
    if (
      registeredUser.email.toLowerCase() !== email.toLowerCase() ||
      registeredUser.password !== password
    ) {
      setErrorMessage('Invalid email or password. Please try again.');
      return false;
    }

    // ── STATE CHANGE: authenticate user ─────────────────────
    const sessionUser = { name: registeredUser.name, email: registeredUser.email };
    setCurrentUser(sessionUser);
    setIsAuthenticated(true);
    setErrorMessage('');
    setSuccessMessage('');

    // Persist session to localStorage (survives page refresh)
    localStorage.setItem(STORAGE_KEY_AUTH, JSON.stringify(sessionUser));

    return true;
  };

  /**
   * handleLogout
   * USER ACTION: click "Logout" button in Dashboard
   *
   * STATE FLOW:
   *   → setIsAuthenticated(false)
   *   → setCurrentUser(null)
   *   → authMode resets to 'login'
   *   → localStorage session cleared
   *   → React re-renders
   *     → AuthLayout + LoginForm renders
   *     → Dashboard unmounts
   *   All without a full page reload!
   */
  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    setAuthMode('login');
    setErrorMessage('');
    setSuccessMessage('');
    localStorage.removeItem(STORAGE_KEY_AUTH);
  };

  // ══════════════════════════════════════════════════════════
  // RENDER — State drives what the UI shows
  // ══════════════════════════════════════════════════════════

  /**
   * MAIN STATE-DRIVEN RENDER DECISION:
   *
   * isAuthenticated === true  → Show Dashboard (logged-in experience)
   * isAuthenticated === false → Show Auth screen
   *   authMode === 'login'    → Show LoginForm
   *   authMode === 'register' → Show RegisterForm
   */
  if (isAuthenticated && currentUser) {
    return (
      <Dashboard
        user={currentUser}
        onLogout={handleLogout}
      />
    );
  }

  return (
    <AuthLayout>
      {/* Conditional rendering based on authMode state */}
      {authMode === 'login' ? (
        <LoginForm
          onLogin={handleLogin}
          onSwitchToRegister={handleSwitchToRegister}
          errorMessage={errorMessage}
          successMessage={successMessage}
        />
      ) : (
        <RegisterForm
          onRegister={handleRegister}
          onSwitchToLogin={handleSwitchToLogin}
          errorMessage={errorMessage}
        />
      )}
    </AuthLayout>
  );
}

export default App;
