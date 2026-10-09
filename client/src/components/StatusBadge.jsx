import React from 'react';

const config = {
  Applied:   { cls: 'badge-applied',   dot: '#3b82f6' },
  Interview: { cls: 'badge-interview', dot: '#f59e0b' },
  Offer:     { cls: 'badge-offer',     dot: '#10b981' },
  Rejected:  { cls: 'badge-rejected',  dot: '#ef4444' },
};

export default function StatusBadge({ status }) {
  const c = config[status] || { cls: 'badge-neutral', dot: '#64748b' };
  return (
    <span className={`badge ${c.cls}`}>
      <span className="badge-dot" style={{ background: c.dot }} />
      {status}
    </span>
  );
}
