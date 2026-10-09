import React from 'react';

export default function LoadingSpinner({ fullPage = false, size = 'default' }) {
  const cls = size === 'sm' ? 'spinner spinner-sm' : size === 'xs' ? 'spinner spinner-xs' : 'spinner';

  if (fullPage) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        flexDirection: 'column',
        gap: '1rem',
      }}>
        <div className="spinner" />
        <span style={{ fontSize: '0.83rem', color: 'var(--text-muted)' }}>Loading…</span>
      </div>
    );
  }

  return (
    <div className="spinner-container">
      <div className={cls} />
    </div>
  );
}
