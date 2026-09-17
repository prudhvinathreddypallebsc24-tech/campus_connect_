/**
 * Dashboard.jsx
 * Campus Connect — CS3301 Experiment 4
 *
 * STATE FLOW:
 *   After successful login → isAuthenticated = true
 *     → App.jsx renders Dashboard instead of AuthLayout
 *
 *   User clicks Logout
 *     → onLogout() fires
 *       → isAuthenticated = false (App.jsx state)
 *         → React re-renders
 *           → AuthLayout + LoginForm rendered again
 *           → No full page reload
 */

const Dashboard = ({ user, onLogout }) => {
  const firstName = user?.name?.split(' ')[0] ?? 'Student';

  const quickLinks = [
    { icon: '👤', label: 'Profile', desc: 'View and edit your profile' },
    { icon: '📅', label: 'Campus Events', desc: 'Upcoming events & activities' },
    { icon: '🤝', label: 'Clubs', desc: 'Join campus clubs & societies' },
    { icon: '📢', label: 'Announcements', desc: 'Latest notices & updates' },
  ];

  return (
    <div className="dashboard">
      {/* ── Header ─────────────────────────────────────────── */}
      <header className="dashboard-header">
        <div className="dashboard-brand">
          <span className="dashboard-brand-icon" aria-hidden="true">🎓</span>
          <span className="dashboard-brand-name">Campus Connect</span>
        </div>
        <button
          type="button"
          className="btn btn--outline btn--sm"
          onClick={onLogout}
        >
          Logout
        </button>
      </header>

      {/* ── Welcome Banner ──────────────────────────────────── */}
      <main className="dashboard-main">
        <div className="welcome-banner">
          <div className="welcome-text">
            <h1 className="welcome-heading">
              Welcome, {firstName} 👋
            </h1>
            <p className="welcome-sub">
              You&apos;re successfully signed in to Campus Connect.
            </p>
          </div>
          <div className="welcome-avatar" aria-hidden="true">
            {firstName.charAt(0).toUpperCase()}
          </div>
        </div>

        {/* ── Quick Access Grid ────────────────────────────── */}
        <section aria-labelledby="quick-access-heading">
          <h2 id="quick-access-heading" className="section-title">
            Quick Access
          </h2>
          <div className="quick-grid">
            {quickLinks.map(({ icon, label, desc }) => (
              <button
                key={label}
                type="button"
                className="quick-card"
                aria-label={`${label}: ${desc}`}
              >
                <span className="quick-icon" aria-hidden="true">{icon}</span>
                <span className="quick-label">{label}</span>
                <span className="quick-desc">{desc}</span>
              </button>
            ))}
          </div>
        </section>

        {/* ── Account Info ────────────────────────────────── */}
        <section className="account-info" aria-labelledby="account-info-heading">
          <h2 id="account-info-heading" className="section-title">
            Account
          </h2>
          <div className="info-card">
            <div className="info-row">
              <span className="info-label">Full Name</span>
              <span className="info-value">{user?.name}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Email</span>
              <span className="info-value">{user?.email}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Status</span>
              <span className="info-value status-active">
                <span className="status-dot" aria-hidden="true" /> Active
              </span>
            </div>
          </div>
        </section>

        {/* ── Prototype Notice ────────────────────────────── */}
        <div className="prototype-notice" role="note">
          <span aria-hidden="true">🔬</span>
          <span>
            <strong>Lab Prototype</strong> — This is a CS3301 Experiment 4 demonstration
            of application state and version control. Not a production application.
          </span>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
