// src/components/Layout.jsx
import React, { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Optional: Kung may theme ka (dark/light), i-uncomment mo 'to
// import { useTheme } from '../context/ThemeContext';

const Layout = () => {
  const { logout, currentUser } = useAuth();
  // const { theme } = useTheme(); // ← Uncomment if may theme toggle ka
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = [
    { path: '/', icon: 'fas fa-chart-line', label: 'Dashboard' },
    { path: '/agrowaste', icon: 'fas fa-leaf', label: 'Agrowaste' },
    { path: '/efo-analysis', icon: 'fas fa-flask', label: 'EFO Analysis' },
    { path: '/reports', icon: 'fas fa-file-alt', label: 'Reports' },
    { path: '/settings', icon: 'fas fa-cog', label: 'Settings' },
  ];

  // Real-time clock
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString('en-PH'));

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString('en-PH'));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <>
      {/* Overlay when sidebar is open on mobile */}
      {sidebarOpen && (
        <div
          className="position-fixed inset-0 bg-black bg-opacity-70 z-40 d-block d-lg-none"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="d-flex min-vh-100vh bg-dark text-white">
        {/* Sidebar */}
        <aside
          className={`position-fixed position-lg-sticky top-0 start-0 h-100 bg-dark border-end border-secondary shadow-lg z-50 transition-transform duration-300 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}
          style={{ width: '280px' }}
        >
          {/* Logo */}
          <div className="p-4 text-center border-bottom border-secondary">
            <img
              src="/logo.png"
              alt="EcoVolt"
              className="img-fluid"
              style={{ maxHeight: '60px' }}
              onError={(e) => (e.target.src = 'https://via.placeholder.com/150?text=EcoVolt')}
            />
            <h5 className="mt-2 text-success fw-bold">EcoVolt System</h5>
          </div>

          {/* Navigation */}
          <nav className="flex-grow-1 overflow-y-auto py-3">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `d-flex align-items-center px-4 py-3 text-white text-decoration-none transition-all ${
                    isActive
                      ? 'bg-success bg-opacity-20 border-start border-success border-5 fw-bold'
                      : 'hover-bg-secondary hover-bg-opacity-10'
                  }`
                }
                onClick={() => setSidebarOpen(false)}
              >
                <i className={`${item.icon} fa-fw me-3`}></i>
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>

          {/* Logout */}
          <div className="p-4 border-top border-secondary">
            <div className="text-center mb-3">
              <small className="text-muted">Logged in as</small>
              <p className="mb-1 fw-bold text-success">
                {currentUser?.displayName || currentUser?.email || 'Admin'}
              </p>
            </div>
            <button
              onClick={logout}
              className="btn btn-outline-danger w-100 d-flex align-items-center justify-content-center gap-2"
            >
              <i className="fas fa-sign-out-alt"></i>
              Log Out
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
       <div className="flex-grow-1 d-flex flex-column" style={{ marginLeft: '280px' }}> 
          {/* Top Navbar */}
          <header className="navbar navbar-dark bg-dark border-bottom border-secondary shadow-sm sticky-top">
            <div className="container-fluid">
              {/* Hamburger Button - Mobile Only */}
              <button
                className="btn btn-dark d-lg-none me-3"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                aria-label="Toggle menu"
              >
                <i className="fas fa-bars fa-lg"></i>
              </button>

              <h4 className="navbar-brand mb-0 fw-bold">
                <i className="fas fa-bolt text-success me-2"></i>
                EcoVolt Monitoring System
              </h4>

              <div className="d-flex align-items-center gap-3">
                <span className="badge bg-secondary px-3 py-2 fs-6">
                  <i className="fas fa-clock me-2"></i>
                  {currentTime}
                </span>
              </div>
            </div>
          </header>

          {/* Page Content */}
          <main className="flex-grow-1 overflow-auto">
            <div className="container-fluid py-4 px-3 px-md-4 px-lg-5">
              <Outlet /> {/* Dito lalabas ang Dashboard, Agrowaste, etc. */}
            </div>
          </main>

          {/* Footer (Optional) */}
          <footer className="text-center py-3 border-top border-secondary text-muted small">
            © 2025 EcoVolt System • v2.0 • All rights reserved
          </footer>
        </div>
      </div>

      {/* Custom CSS */}
      <style jsx>{`
        .hover-bg-secondary:hover {
          background-color: rgba(255, 255, 255, 0.05) !important;
        }
        .transition-transform {
          transition: transform 0.3s ease-in-out;
        }
        .-x-full {
          transform: translateX(-100%);
        }
        @media (min-width: 992px) {
          .d-lg-none {
            display: none !important;
          }
        }
      `}</style>
    </>
  );
};

export default Layout;
