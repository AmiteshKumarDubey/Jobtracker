import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import StatCard from '../components/StatCard';
import StatusBadge from '../components/StatusBadge';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import ApplicationForm from '../components/ApplicationForm';
import { formatDate, getGreeting, getFollowUpStatus, formatRelativeDate } from '../utils/helpers';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';

const STAT_CONFIG = [
  { key: 'total',     label: 'Total',     icon: '◈', color: '#8b5cf6' },
  { key: 'Applied',   label: 'Applied',   icon: '◫', color: '#3b82f6' },
  { key: 'Interview', label: 'Interview', icon: '◎', color: '#f59e0b' },
  { key: 'Offer',     label: 'Offers',    icon: '◉', color: '#10b981' },
  { key: 'Rejected',  label: 'Rejected',  icon: '✕', color: '#ef4444' },
];

function RecentAppItem({ app }) {
  const navigate = useNavigate();
  return (
    <div
      className="attention-item"
      style={{ cursor: 'pointer' }}
      onClick={() => navigate(`/applications/${app._id}`)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && navigate(`/applications/${app._id}`)}
    >
      <div style={{
        width: 36, height: 36, borderRadius: 8, background: 'var(--bg-card2)',
        border: '1px solid var(--border)', display: 'flex', alignItems: 'center',
        justifyContent: 'center', fontSize: '1rem', flexShrink: 0,
      }}>
        🏢
      </div>
      <div className="attention-item-body">
        <div className="attention-item-company">{app.company}</div>
        <div className="attention-item-role">{app.role}</div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.25rem' }}>
        <StatusBadge status={app.status} />
        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
          {formatRelativeDate(app.createdAt)}
        </span>
      </div>
    </div>
  );
}

function FollowUpItem({ app }) {
  const navigate = useNavigate();
  const fup = getFollowUpStatus(app.followUpDate);
  const badgeMap = { overdue: 'badge-overdue', today: 'badge-today', upcoming: 'badge-upcoming' };
  const labelMap = { overdue: 'Overdue', today: 'Today', upcoming: formatDate(app.followUpDate) };

  return (
    <div
      className="attention-item"
      style={{ cursor: 'pointer' }}
      onClick={() => navigate(`/applications/${app._id}`)}
    >
      <span className={`badge ${badgeMap[fup]}`} style={{ flexShrink: 0 }}>
        {labelMap[fup]}
      </span>
      <div className="attention-item-body">
        <div className="attention-item-company">{app.company}</div>
        <div className="attention-item-role">{app.role}</div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats]       = useState(null);
  const [recent, setRecent]     = useState([]);
  const [followUps, setFollowUps] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [showForm, setShowForm] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const [statsRes, appsRes] = await Promise.all([
        api.get('/api/applications/stats'),
        api.get('/api/applications'),
      ]);
      setStats(statsRes.data.data);
      const all = appsRes.data.data || [];
      setRecent(all.slice(0, 5));

      // Follow-ups: any with followUpDate set, sorted
      const fups = all
        .filter((a) => a.followUpDate)
        .sort((a, b) => new Date(a.followUpDate) - new Date(b.followUpDate))
        .slice(0, 4);
      setFollowUps(fups);
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleAppSaved = (saved) => {
    setRecent((prev) => [saved, ...prev].slice(0, 5));
    fetchData(); // refresh stats
    toast.success('Application added to tracker');
  };

  if (loading) return <LoadingSpinner />;

  const today = new Date();
  const greeting = getGreeting(user?.name);

  return (
    <div>
      {/* Welcome */}
      <div className="dashboard-welcome">
        <h2>{greeting} 👋</h2>
        <p>
          {today.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          {stats?.total > 0 && ` · ${stats.total} application${stats.total !== 1 ? 's' : ''} tracked`}
        </p>
      </div>

      {/* Quick actions */}
      <div className="quick-actions">
        <button className="quick-action-btn primary" onClick={() => setShowForm(true)}>
          <span>+</span> Track New Application
        </button>
        <button className="quick-action-btn" onClick={() => navigate('/applications')}>
          <span>◫</span> All Applications
        </button>
        <button className="quick-action-btn" onClick={() => navigate('/analytics')}>
          <span>◈</span> View Analytics
        </button>
      </div>

      {/* Stat cards */}
      <div className="stats-grid">
        {STAT_CONFIG.map((s) => (
          <StatCard
            key={s.key}
            label={s.label}
            value={stats?.[s.key] ?? 0}
            icon={s.icon}
            color={s.color}
            subtitle={
              s.key !== 'total' && stats?.total
                ? `${Math.round(((stats?.[s.key] || 0) / stats.total) * 100)}%`
                : undefined
            }
          />
        ))}
      </div>

      {/* Attention row */}
      <div className="dashboard-grid">
        {/* Recent Applications */}
        <div className="card" style={{ padding: '1.25rem' }}>
          <div className="section-header">
            <span className="section-title">Recent Applications</span>
            <Link to="/applications" className="section-link">View all →</Link>
          </div>
          {recent.length === 0 ? (
            <EmptyState
              icon="📭"
              title="No applications yet"
              message="Start tracking your job search"
              action={
                <button className="btn btn-primary btn-sm" onClick={() => setShowForm(true)}>
                  + Add First Application
                </button>
              }
            />
          ) : (
            <div className="attention-panel">
              {recent.map((app) => <RecentAppItem key={app._id} app={app} />)}
            </div>
          )}
        </div>

        {/* Follow-ups */}
        <div className="card" style={{ padding: '1.25rem' }}>
          <div className="section-header">
            <span className="section-title">Follow-ups</span>
            {followUps.length > 0 && (
              <span className="badge badge-warning" style={{ fontSize: '0.7rem' }}>
                {followUps.length} pending
              </span>
            )}
          </div>
          {followUps.length === 0 ? (
            <EmptyState
              icon="📅"
              title="No follow-ups scheduled"
              message="Set follow-up dates on applications to stay on top of your search."
            />
          ) : (
            <div className="attention-panel">
              {followUps.map((app) => <FollowUpItem key={app._id} app={app} />)}
            </div>
          )}
        </div>
      </div>

      {/* Application Form Modal */}
      {showForm && (
        <ApplicationForm
          application={null}
          onClose={() => setShowForm(false)}
          onSaved={handleAppSaved}
        />
      )}
    </div>
  );
}
