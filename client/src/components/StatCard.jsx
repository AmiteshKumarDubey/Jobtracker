import React from 'react';

export default function StatCard({ label, value, icon, color, bg, subtitle }) {
  return (
    <div className="stat-card">
      <div className="stat-card-top">
        <div
          className="stat-card-icon"
          style={{ background: bg || `${color}15`, color: color }}
        >
          {icon}
        </div>
        {subtitle && (
          <span className="stat-card-change" style={{ color: 'var(--text-muted)' }}>
            {subtitle}
          </span>
        )}
      </div>
      <div className="stat-card-value" style={{ color: color }}>
        {value ?? 0}
      </div>
      <div className="stat-card-label">{label}</div>
      <div
        style={{
          position: 'absolute',
          top: 0, left: 0, right: 0,
          height: 2,
          background: color,
          opacity: 0.7,
          borderRadius: 'var(--radius) var(--radius) 0 0',
        }}
      />
    </div>
  );
}
