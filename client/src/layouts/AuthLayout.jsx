import React from 'react';

export default function AuthLayout({ children }) {
  return (
    <div className="auth-layout">
      {/* Brand panel — hidden on mobile via CSS */}
      <div className="auth-brand">
        <div className="auth-brand-logo">
          <span className="auth-brand-logo-icon">💼</span>
          <span className="auth-brand-logo-text">JobTrackr</span>
        </div>
        <p className="auth-brand-tagline">
          Your job search,<br />
          <span>organized.</span>
        </p>
        <p className="auth-brand-sub">
          Track every application, follow-up, and interview — all in one professional command center.
        </p>
        <div className="auth-features">
          <div className="auth-feature">
            <span className="auth-feature-icon">📊</span>
            <div className="auth-feature-text">
              <h4>Analytics Dashboard</h4>
              <p>Track your pipeline with real-time stats and conversion rates.</p>
            </div>
          </div>
          <div className="auth-feature">
            <span className="auth-feature-icon">📋</span>
            <div className="auth-feature-text">
              <h4>Kanban & Table Views</h4>
              <p>Visualize your job search in the way that works for you.</p>
            </div>
          </div>
          <div className="auth-feature">
            <span className="auth-feature-icon">🎯</span>
            <div className="auth-feature-text">
              <h4>Follow-up Tracking</h4>
              <p>Never miss a follow-up with smart deadline reminders.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Form panel */}
      <div className="auth-panel">
        <div className="auth-form-wrap">
          {children}
        </div>
      </div>
    </div>
  );
}
