/**
 * AuthLayout.jsx
 * Campus Connect — CS3301 Experiment 4
 *
 * Two-column layout wrapper that frames the authentication card.
 * Left panel: branding & feature highlights
 * Right panel: auth card (Login or Register)
 */

const AuthLayout = ({ children }) => {
  return (
    <div className="auth-layout">
      {/* ── Left Branding Panel ─────────────────────────────── */}
      <div className="brand-panel" aria-label="Campus Connect branding">
        <div className="brand-content">
          <div className="brand-logo">
            <span className="brand-icon" aria-hidden="true">🎓</span>
          </div>

          <h1 className="brand-name">Campus Connect</h1>
          <p className="brand-tagline">Connect. Collaborate. Grow.</p>

          <p className="brand-description">
            Your all-in-one platform for campus life — discover events,
            join clubs, stay updated, and build your academic community.
          </p>

          <ul className="brand-features" aria-label="Platform features">
            <li>
              <span className="feature-icon" aria-hidden="true">📅</span>
              <span>Campus Events &amp; Activities</span>
            </li>
            <li>
              <span className="feature-icon" aria-hidden="true">🤝</span>
              <span>Clubs &amp; Communities</span>
            </li>
            <li>
              <span className="feature-icon" aria-hidden="true">📢</span>
              <span>Announcements &amp; Notices</span>
            </li>
            <li>
              <span className="feature-icon" aria-hidden="true">👤</span>
              <span>Student Profiles</span>
            </li>
          </ul>

          <div className="brand-badge">
            <span>CS3301 Full Stack Development · Experiment 4</span>
          </div>
        </div>
      </div>

      {/* ── Right Auth Card Panel ────────────────────────────── */}
      <div className="auth-panel">
        <div className="auth-card">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
