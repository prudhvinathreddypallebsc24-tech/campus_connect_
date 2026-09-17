/**
 * LoginForm.jsx
 * Campus Connect — CS3301 Experiment 4
 *
 * STATE FLOW demonstrated here:
 *   User types in email/password field
 *     → onChange handler fires
 *       → form state updates (controlled inputs)
 *         → React re-renders with latest input values
 *
 *   User clicks "Sign In"
 *     → handleSubmit fires
 *       → validation runs on current state
 *         → if invalid: errorMessage state set → error shown
 *         → if valid: onLogin(email, password) called
 *           → parent App.jsx compares credentials
 *             → isAuthenticated flips to true
 *               → Dashboard renders instead of auth screen
 */

import { useState } from 'react';
import Message from './Message';

const LoginForm = ({ onLogin, onSwitchToRegister, errorMessage, successMessage }) => {
  // ── Local form state ──────────────────────────────────────
  // These state variables hold the current values of the form inputs.
  // React re-renders the component every time they change.
  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  const [localError, setLocalError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // ── Event handler: input change ──────────────────────────
  // USER ACTION: types in a field
  // → STATE CHANGE: form state updated
  // → REACT RE-RENDER: input value reflects new state
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Clear local error when user starts correcting input
    if (localError) setLocalError('');
  };

  // ── Event handler: form submission ───────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');

    // ── Validation (state-driven) ──────────────────────────
    if (!form.email.trim()) {
      setLocalError('Email is required.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email.trim())) {
      setLocalError('Please enter a valid email address.');
      return;
    }

    if (!form.password) {
      setLocalError('Password is required.');
      return;
    }

    setIsLoading(true);

    // Simulate brief async operation for realistic UX
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Delegate actual credential check to App.jsx (parent state)
    const result = onLogin(form.email.trim(), form.password);
    if (!result) {
      setLocalError('');
    }

    setIsLoading(false);
  };

  // Combine local validation error with parent-level auth error
  const displayError = localError || errorMessage;

  return (
    <div className="form-container">
      <div className="form-header">
        <h2 className="form-title">Sign In</h2>
        <p className="form-subtitle">Welcome back to Campus Connect</p>
      </div>

      {/* Message component renders based on state */}
      <Message type="success" text={successMessage} />
      <Message type="error" text={displayError} />

      <form onSubmit={handleSubmit} noValidate aria-label="Sign in form">
        {/* Email field */}
        <div className="form-group">
          <label htmlFor="login-email" className="form-label">
            Email Address
          </label>
          <input
            id="login-email"
            type="email"
            name="email"
            className="form-input"
            placeholder="you@example.com"
            value={form.email}
            onChange={handleChange}
            autoComplete="email"
            aria-required="true"
            aria-describedby={displayError ? 'login-error' : undefined}
            disabled={isLoading}
          />
        </div>

        {/* Password field */}
        <div className="form-group">
          <label htmlFor="login-password" className="form-label">
            Password
          </label>
          <input
            id="login-password"
            type="password"
            name="password"
            className="form-input"
            placeholder="Enter your password"
            value={form.password}
            onChange={handleChange}
            autoComplete="current-password"
            aria-required="true"
            disabled={isLoading}
          />
        </div>

        {/* Submit button — state-driven: disabled while loading */}
        <button
          type="submit"
          className="btn btn--primary btn--full"
          disabled={isLoading}
          aria-busy={isLoading}
        >
          {isLoading ? (
            <>
              <span className="btn-spinner" aria-hidden="true" /> Signing in…
            </>
          ) : (
            'Sign In'
          )}
        </button>
      </form>

      {/* Switch mode — changes authMode state in App.jsx */}
      <div className="form-switch">
        <p>
          Don&apos;t have an account?{' '}
          <button
            type="button"
            className="link-btn"
            onClick={onSwitchToRegister}
          >
            Create Account
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
