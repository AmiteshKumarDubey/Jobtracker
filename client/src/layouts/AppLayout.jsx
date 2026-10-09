import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

const PAGE_TITLES = {
  '/dashboard':    'Dashboard',
  '/applications': 'Applications',
  '/analytics':    'Analytics',
  '/profile':      'Profile',
};

function getTitle(pathname) {
  if (pathname.startsWith('/applications/')) return 'Application Details';
  return PAGE_TITLES[pathname] || 'JobTrackr';
}

export default function AppLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const title = getTitle(location.pathname);

  return (
    <div className="app-layout">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="app-main">
        <Navbar title={title} onMenuClick={() => setSidebarOpen(true)} />
        <main className="app-content">
          {children}
        </main>
      </div>
    </div>
  );
}
