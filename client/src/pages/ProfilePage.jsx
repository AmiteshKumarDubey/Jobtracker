import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { formatDate, getInitials } from '../utils/helpers';
import LoadingSpinner from '../components/LoadingSpinner';

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [stats, setStats]     = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/api/auth/me'),
      api.get('/api/applications/stats'),
    ])
      .then(([profileRes, statsRes]) => {
        setProfile(profileRes.data.user);
        setStats(statsRes.data.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;
  if (!profile) return (
    <p style={{ color: 'var(--text-muted)', padding: '2rem' }}>
      Could not load profile.
    </p>
  );

  const successRate = stats?.total
    ? Math.round((stats.Offer / stats.total) * 100)
    : 0;

  return (
    <div style={{ maxWidth: 600 }}>
      <div className="page-header">
        <div>
          <h1 className="page-title">Profile</h1>
          <p className="page-subtitle">Your account and job search summary</p>
        </div>
      </div>

      {/* Profile card */}
      <div className="card" style={{ marginBottom: '1rem' }}>
        <div className="profile-header">
          <div className="profile-avatar">
            {getInitials(profile.name)}
          </div>
          <div>
            <div className="profile-name">{profile.name}</div>
            <div className="profile-email">{profile.email}</div>
          </div>
        </div>

        {/* Job search stats */}
        {stats && (
          <div className="profile-stat-row" style={{ marginBottom: '1.5rem' }}>
            <div className="profile-stat">
              <div className="profile-stat-value" style={{ color: 'var(--purple)' }}>
                {stats.total}
              </div>
              <div className="profile-stat-label">Total</div>
            </div>
            <div className="profile-stat">
              <div className="profile-stat-value" style={{ color: 'var(--warning)' }}>
                {stats.Interview}
              </div>
              <div className="profile-stat-label">Interviews</div>
            </div>
            <div className="profile-stat">
              <div className="profile-stat-value" style={{ color: 'var(--success)' }}>
                {successRate}%
              </div>
              <div className="profile-stat-label">Offer Rate</div>
            </div>
          </div>
        )}

        {/* Account info */}
        <div className="profile-info-list">
          <div className="profile-info-row">
            <span>👤</span>
            <span style={{ color: 'var(--text-muted)', minWidth: 80, fontSize: '0.8rem' }}>Name</span>
            <span>{profile.name}</span>
          </div>
          <div className="profile-info-row">
            <span>✉️</span>
            <span style={{ color: 'var(--text-muted)', minWidth: 80, fontSize: '0.8rem' }}>Email</span>
            <span>{profile.email}</span>
          </div>
          <div className="profile-info-row">
            <span>📅</span>
            <span style={{ color: 'var(--text-muted)', minWidth: 80, fontSize: '0.8rem' }}>Joined</span>
            <span>{formatDate(profile.createdAt)}</span>
          </div>
          {stats && (
            <div className="profile-info-row">
              <span>◫</span>
              <span style={{ color: 'var(--text-muted)', minWidth: 80, fontSize: '0.8rem' }}>Applications</span>
              <span>
                {stats.total} total · {stats.Applied} applied · {stats.Interview} interviews · {stats.Offer} offers
              </span>
            </div>
          )}
        </div>
      </div>

      <div
        className="card"
        style={{ background: 'var(--primary-glow)', border: '1px solid rgba(99,102,241,0.2)' }}
      >
        <p style={{ fontSize: '0.83rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
          <strong style={{ color: 'var(--primary-light)' }}>💡 Tip:</strong> Keep your applications
          up to date to get accurate analytics. Set follow-up dates so you never miss
          an opportunity to follow up with a recruiter.
        </p>
      </div>
    </div>
  );
}
