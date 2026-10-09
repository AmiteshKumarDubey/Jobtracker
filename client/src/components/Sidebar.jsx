import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { getInitials } from '../utils/helpers';
import toast from 'react-hot-toast';

const navItems = [
  { to: '/dashboard',    icon: '⊞', label: 'Dashboard' },
  { to: '/applications', icon: '◫', label: 'Applications' },
  { to: '/analytics',    icon: '◈', label: 'Analytics' },
  { to: '/profile',      icon: '◉', label: 'Profile' },
];

export default function Sidebar({ open, onClose }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Logged out');
    navigate('/login');
  };

  return (
    <>
      <div
        className={`sidebar-overlay ${open ? 'open' : ''}`}
        onClick={onClose}
        aria-hidden="true"
      />
      <aside className={`app-sidebar ${open ? 'open' : ''}`}>
        {/* Logo */}
        <div className="sidebar-logo">
          <span className="sidebar-logo-icon">💼</span>
          <span>JobTrackr</span>
          <span className="sidebar-logo-badge">Beta</span>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav" role="navigation">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `sidebar-nav-item${isActive ? ' active' : ''}`
              }
              onClick={onClose}
            >
              <span className="sidebar-nav-icon">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="sidebar-footer">
          {user && (
            <div className="sidebar-user-row">
              <div className="sidebar-avatar">
                {getInitials(user.name)}
              </div>
              <div className="sidebar-user-info">
                <div className="sidebar-user-name">{user.name}</div>
                <div className="sidebar-user-email">{user.email}</div>
              </div>
            </div>
          )}
          <button
            className="btn btn-ghost btn-sm btn-block"
            onClick={handleLogout}
            style={{ gap: '0.5rem', justifyContent: 'center' }}
          >
            <span>↩</span> Sign Out
          </button>
        </div>
      </aside>
    </>
  );
}
