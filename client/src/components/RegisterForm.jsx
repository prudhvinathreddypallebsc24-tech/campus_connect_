/**
 * RegisterForm.jsx
 * Campus Connect — CS3301 Experiment 4
 *
 * STATE FLOW demonstrated here:
 *   User fills in registration fields
 *     → onChange handlers fire → form state updates
 *
 *   User submits
 *     → validate each field against current state
 *       → if invalid: errorMessage state set → errors shown in UI
 *       → if valid:
 *           → onRegister(name, email, password) called
 *             → App.jsx stores registeredUser in state & localStorage
 *               → authMode switches to 'login'
 *                 → LoginForm renders instead of RegisterForm
 */

import { useState } from 'react';
import Message from './Message';

const RegisterForm = ({ onRegister, onSwitchToLogin, errorMessage }) => {
  // ── Local form state ──────────────────────────────────────
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // ── Event handler: input change ──────────────────────────
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Clear field-level error as user corrects it
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  // ── Client-side validation ───────────────────────────────
  const validate = () => {
    const newErrors = {};

    if (!form.name.trim()) {
      newErrors.name = 'Full name is required.';
    } else if (form.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters.';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!form.email.trim()) {
      newErrors.email = 'Email is required.';
    } else if (!emailRegex.test(form.email.trim())) {
      newErrors.email = 'Please enter a valid email address.';
    }

    if (!form.password) {
      newErrors.password = 'Password is required.';
    } else if (form.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters.';
    }

    if (!form.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password.';
    } else if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.';
    }

    return newErrors;
  };

  // ── Event handler: form submission ───────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();

    // STATE CHANGE: run validation → update errors state → UI shows inline errors
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 600));

    // Delegate to App.jsx — parent state will store the user
    onRegister(form.name.trim(), form.email.trim(), form.password);
    setIsLoading(false);
  };

  return (
    <div className="form-container">
      <div className="form-header">
        <h2 className="form-title">Create Account</h2>
        <p className="form-subtitle">Join the Campus Connect community</p>
      </div>

      {/* Parent-level error (e.g. duplicate account) */}
      <Message type="error" text={errorMessage} />

      <form onSubmit={handleSubmit} noValidate aria-label="Registration form">
        {/* Full Name */}
        <div className="form-group">
          <label htmlFor="reg-name" className="form-label">
            Full Name
          </label>
          <input
            id="reg-name"
            type="text"
            name="name"
            className={`form-input${errors.name ? ' form-input--error' : ''}`}
            placeholder="Abhishek Patil"
            value={form.name}
            onChange={handleChange}
            autoComplete="name"
            aria-required="true"
            aria-describedby={errors.name ? 'reg-name-error' : undefined}
            disabled={isLoading}
          />
          {errors.name && (
            <span id="reg-name-error" className="field-error" role="alert">
              {errors.name}
            </span>
          )}
        </div>

        {/* Email */}
        <div className="form-group">
          <label htmlFor="reg-email" className="form-label">
            Email Address
          </label>
          <input
            id="reg-email"
            type="email"
            name="email"
            className={`form-input${errors.email ? ' form-input--error' : ''}`}
            placeholder="you@example.com"
            value={form.email}
            onChange={handleChange}
            autoComplete="email"
            aria-required="true"
            aria-describedby={errors.email ? 'reg-email-error' : undefined}
            disabled={isLoading}
          />
          {errors.email && (
            <span id="reg-email-error" className="field-error" role="alert">
              {errors.email}
            </span>
          )}
        </div>

        {/* Password */}
        <div className="form-group">
          <label htmlFor="reg-password" className="form-label">
            Password
            <span className="field-hint"> (min. 6 characters)</span>
          </label>
          <input
            id="reg-password"
            type="password"
            name="password"
            className={`form-input${errors.password ? ' form-input--error' : ''}`}
            placeholder="Choose a password"
            value={form.password}
            onChange={handleChange}
            autoComplete="new-password"
            aria-required="true"
            aria-describedby={errors.password ? 'reg-password-error' : undefined}
            disabled={isLoading}
          />
          {errors.password && (
            <span id="reg-password-error" className="field-error" role="alert">
              {errors.password}
            </span>
          )}
        </div>

        {/* Confirm Password */}
        <div className="form-group">
          <label htmlFor="reg-confirm" className="form-label">
            Confirm Password
          </label>
          <input
            id="reg-confirm"
            type="password"
            name="confirmPassword"
            className={`form-input${errors.confirmPassword ? ' form-input--error' : ''}`}
            placeholder="Re-enter your password"
            value={form.confirmPassword}
            onChange={handleChange}
            autoComplete="new-password"
            aria-required="true"
            aria-describedby={errors.confirmPassword ? 'reg-confirm-error' : undefined}
            disabled={isLoading}
          />
          {errors.confirmPassword && (
            <span id="reg-confirm-error" className="field-error" role="alert">
              {errors.confirmPassword}
            </span>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="btn btn--primary btn--full"
          disabled={isLoading}
          aria-busy={isLoading}
        >
          {isLoading ? (
            <>
              <span className="btn-spinner" aria-hidden="true" /> Creating Account…
            </>
          ) : (
            'Create Account'
          )}
        </button>
      </form>

      {/* Switch to login — changes authMode state */}
      <div className="form-switch">
        <p>
          Already have an account?{' '}
          <button
            type="button"
            className="link-btn"
            onClick={onSwitchToLogin}
          >
            Sign In
          </button>
        </p>
      </div>
    </div>
  );
};

export default RegisterForm;
