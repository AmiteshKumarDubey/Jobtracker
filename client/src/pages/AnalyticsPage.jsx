import React, { useEffect, useState } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar, CartesianGrid, Legend,
} from 'recharts';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import { groupByMonth, getErrorMessage } from '../utils/helpers';
import toast from 'react-hot-toast';

const STATUS_COLORS = {
  Applied:   '#3b82f6',
  Interview: '#f59e0b',
  Offer:     '#10b981',
  Rejected:  '#ef4444',
};
const PRIORITY_COLORS = { High: '#ef4444', Medium: '#f59e0b', Low: '#10b981' };

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) return null;
  return (
    <div style={{
      background: 'var(--bg-card)',
      border: '1px solid var(--border-light)',
      borderRadius: 8,
      padding: '0.65rem 0.9rem',
      fontSize: '0.82rem',
    }}>
      <p style={{ color: 'var(--text-muted)', marginBottom: '0.3rem' }}>{label}</p>
      {payload.map((p) => (
        <p key={p.name} style={{ color: p.color || 'var(--text)' }}>
          {p.name}: <strong>{p.value}</strong>
        </p>
      ))}
    </div>
  );
};

export default function AnalyticsPage() {
  const [stats, setStats]   = useState(null);
  const [apps, setApps]     = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/api/applications/stats'),
      api.get('/api/applications'),
    ])
      .then(([statsRes, appsRes]) => {
        setStats(statsRes.data.data);
        setApps(appsRes.data.data || []);
      })
      .catch((err) => toast.error(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;

  if (!stats || stats.total === 0) {
    return (
      <div>
        <div className="page-header">
          <h1 className="page-title">Analytics</h1>
        </div>
        <EmptyState
          icon="📊"
          title="No data yet"
          message="Add some job applications to start seeing analytics."
        />
      </div>
    );
  }

  // Derived metrics
  const interviewRate = stats.total
    ? Math.round(((stats.Interview + stats.Offer) / stats.total) * 100)
    : 0;
  const offerRate = stats.total
    ? Math.round((stats.Offer / stats.total) * 100)
    : 0;
  const rejectionRate = stats.total
    ? Math.round((stats.Rejected / stats.total) * 100)
    : 0;

  // Pie data
  const pieData = ['Applied', 'Interview', 'Offer', 'Rejected']
    .filter((s) => stats[s] > 0)
    .map((s) => ({ name: s, value: stats[s] }));

  // Applications over time
  const timelineData = groupByMonth(apps);

  // Priority breakdown
  const prioCount = { High: 0, Medium: 0, Low: 0 };
  apps.forEach((a) => { if (prioCount[a.priority] !== undefined) prioCount[a.priority]++; });
  const prioData = Object.entries(prioCount).map(([p, count]) => ({ name: p, count }));

  // Funnel
  const funnelData = [
    { label: 'Applied',   count: stats.Applied,   color: STATUS_COLORS.Applied },
    { label: 'Interview', count: stats.Interview,  color: STATUS_COLORS.Interview },
    { label: 'Offer',     count: stats.Offer,      color: STATUS_COLORS.Offer },
  ];
  const maxFunnel = stats.Applied || 1;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Analytics</h1>
          <p className="page-subtitle">Insights from {stats.total} applications</p>
        </div>
      </div>

      {/* Conversion rates */}
      <div className="conversion-grid" style={{ marginBottom: '1.25rem' }}>
        <div className="conversion-card">
          <div className="conversion-value" style={{ color: 'var(--warning)' }}>
            {interviewRate}%
          </div>
          <div className="conversion-label">Interview Rate</div>
        </div>
        <div className="conversion-card">
          <div className="conversion-value" style={{ color: 'var(--success)' }}>
            {offerRate}%
          </div>
          <div className="conversion-label">Offer Rate</div>
        </div>
        <div className="conversion-card">
          <div className="conversion-value" style={{ color: 'var(--danger)' }}>
            {rejectionRate}%
          </div>
          <div className="conversion-label">Rejection Rate</div>
        </div>
      </div>

      <div className="analytics-grid">
        {/* Applications over time */}
        <div className="card" style={{ gridColumn: '1 / -1' }}>
          <div className="section-header" style={{ marginBottom: '1.25rem' }}>
            <span className="section-title">Applications Over Time</span>
          </div>
          {timelineData.length < 2 ? (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.83rem', textAlign: 'center', padding: '2rem 0' }}>
              Not enough data yet. Add more applications across different months to see this chart.
            </p>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={timelineData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="month" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="count"
                  name="Applications"
                  stroke="#6366f1"
                  strokeWidth={2}
                  fill="url(#areaGrad)"
                  dot={{ fill: '#6366f1', r: 3 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Status distribution pie */}
        <div className="card">
          <div className="section-header" style={{ marginBottom: '1.25rem' }}>
            <span className="section-title">Status Distribution</span>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={80}
                paddingAngle={3}
                dataKey="value"
              >
                {pieData.map((entry) => (
                  <Cell key={entry.name} fill={STATUS_COLORS[entry.name]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend
                iconType="circle"
                iconSize={8}
                formatter={(val) => <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{val}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Application funnel */}
        <div className="card">
          <div className="section-header" style={{ marginBottom: '1.25rem' }}>
            <span className="section-title">Application Funnel</span>
          </div>
          <div style={{ paddingTop: '0.5rem' }}>
            {funnelData.map((f) => (
              <div key={f.label} className="funnel-bar">
                <span className="funnel-bar-label">{f.label}</span>
                <div className="funnel-bar-track">
                  <div
                    className="funnel-bar-fill"
                    style={{
                      width: `${Math.round((f.count / maxFunnel) * 100)}%`,
                      background: f.color,
                    }}
                  />
                </div>
                <span className="funnel-bar-count">{f.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Priority breakdown */}
        <div className="card" style={{ gridColumn: '1 / -1' }}>
          <div className="section-header" style={{ marginBottom: '1.25rem' }}>
            <span className="section-title">Applications by Priority</span>
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={prioData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="name" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" name="Applications" radius={[4, 4, 0, 0]}>
                {prioData.map((entry) => (
                  <Cell key={entry.name} fill={PRIORITY_COLORS[entry.name] || '#6366f1'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
