import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar navbar-expand-lg navbar-dark sticky-top navbar-imovies py-3">
      <div className="container">
        {/* Brand */}
        <Link className="navbar-brand d-flex align-items-center gap-2 text-decoration-none" to="/">
          <div
            className="d-flex align-items-center justify-content-center rounded-3 shadow"
            style={{
              width: '40px',
              height: '40px',
              background: 'linear-gradient(135deg, #e11d48 0%, #be123c 100%)',
              boxShadow: '0 4px 15px rgba(225, 29, 72, 0.45)',
            }}
          >
            <i className="bi bi-film text-white fs-5"></i>
          </div>
          <div className="d-flex flex-column leading-none">
            <span className="brand-font fw-extrabold fs-4 tracking-tight text-white lh-1">
              I<span className="text-gradient-primary">MOVIES</span>
            </span>
            <span className="text-uppercase fw-semibold text-muted" style={{ fontSize: '0.62rem', letterSpacing: '0.15em' }}>
              Cinema Experience
            </span>
          </div>
        </Link>

        {/* Mobile Toggle */}
        <button
          className="navbar-toggler border-0 shadow-none px-2"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#imoviesNavbar"
          aria-controls="imoviesNavbar"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Collapsible Content */}
        <div className="collapse navbar-collapse" id="imoviesNavbar">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 ms-lg-4 gap-1">
            <li className="nav-item">
              <Link className={`nav-link nav-link-custom ${isActive('/') ? 'active' : ''}`} to="/">
                <i className="bi bi-compass me-1"></i> Explore Movies
              </Link>
            </li>
            {user && (
              <li className="nav-item">
                <Link className={`nav-link nav-link-custom ${isActive('/my-bookings') ? 'active' : ''}`} to="/my-bookings">
                  <i className="bi bi-ticket-perforated me-1"></i> My Bookings
                </Link>
              </li>
            )}
            {user && user.role === 'admin' && (
              <li className="nav-item">
                <Link className={`nav-link nav-link-custom text-warning ${isActive('/admin') ? 'active' : ''}`} to="/admin">
                  <i className="bi bi-shield-lock-fill me-1 text-warning"></i> Admin Console
                </Link>
              </li>
            )}
          </ul>

          {/* Right Action Section */}
          <div className="d-flex align-items-center gap-3">
            {user ? (
              <div className="dropdown">
                <button
                  className="btn btn-cinema-outline dropdown-toggle d-flex align-items-center gap-2 py-1.5 px-3 rounded-pill"
                  type="button"
                  id="userMenuButton"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <div
                    className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold"
                    style={{
                      width: '28px',
                      height: '28px',
                      background: 'linear-gradient(135deg, #e11d48 0%, #38bdf8 100%)',
                      fontSize: '0.8rem',
                    }}
                  >
                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span className="fw-semibold text-light small">{user.name}</span>
                  {user.role === 'admin' && (
                    <span className="badge bg-warning text-dark py-0.5 px-2 rounded-pill fw-bold" style={{ fontSize: '0.62rem' }}>
                      ADMIN
                    </span>
                  )}
                </button>
                <ul
                  className="dropdown-menu dropdown-menu-dark dropdown-menu-end shadow-lg border-secondary rounded-3 p-2 mt-2"
                  aria-labelledby="userMenuButton"
                  style={{ minWidth: '220px', background: '#0e1526' }}
                >
                  <li className="px-3 py-2 border-bottom border-secondary mb-1">
                    <div className="fw-bold text-white small">{user.name}</div>
                    <div className="text-muted text-truncate" style={{ fontSize: '0.75rem' }}>{user.email}</div>
                  </li>
                  <li>
                    <Link className="dropdown-item rounded-2 py-2" to="/my-bookings">
                      <i className="bi bi-ticket-perforated me-2 text-danger"></i> My Tickets
                    </Link>
                  </li>
                  {user.role === 'admin' && (
                    <li>
                      <Link className="dropdown-item rounded-2 py-2" to="/admin">
                        <i className="bi bi-gear-wide-connected me-2 text-warning"></i> Manage Cinema
                      </Link>
                    </li>
                  )}
                  <li><hr className="dropdown-divider border-secondary my-1" /></li>
                  <li>
                    <button className="dropdown-item rounded-2 py-2 text-danger" onClick={handleLogout}>
                      <i className="bi bi-box-arrow-right me-2"></i> Log Out
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <div className="d-flex align-items-center gap-2">
                <Link to="/login" className="btn btn-cinema-outline rounded-pill px-4 py-2 small">
                  Sign In
                </Link>
                <Link to="/register" className="btn btn-cinema-primary rounded-pill px-4 py-2 small">
                  Join IMovies
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
