import React from 'react';

const config = {
  High:   { cls: 'badge-high',   icon: '↑' },
  Medium: { cls: 'badge-medium', icon: '→' },
  Low:    { cls: 'badge-low',    icon: '↓' },
};

export default function PriorityBadge({ priority }) {
  if (!priority) return null;
  const c = config[priority] || { cls: 'badge-neutral', icon: '·' };
  return (
    <span className={`badge ${c.cls}`}>
      <span style={{ fontSize: '0.75rem' }}>{c.icon}</span>
      {priority}
    </span>
  );
}
