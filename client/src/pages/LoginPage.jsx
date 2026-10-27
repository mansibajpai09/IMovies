import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please provide both email and password.');
      return;
    }

    const res = await login(email, password);
    if (res.success) {
      navigate(from, { replace: true });
    } else {
      setError(res.message);
    }
  };

  const handleQuickLogin = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-7 col-lg-5 col-xl-4">
          <div className="glass-panel p-4 p-md-5 shadow-2xl position-relative">
            {/* Top decorative emblem */}
            <div className="text-center mb-4">
              <div
                className="d-inline-flex align-items-center justify-content-center rounded-4 mb-3 shadow"
                style={{
                  width: '56px',
                  height: '56px',
                  background: 'linear-gradient(135deg, #e11d48 0%, #be123c 100%)',
                  boxShadow: '0 8px 25px rgba(225, 29, 72, 0.45)',
                }}
              >
                <i className="bi bi-film text-white fs-3"></i>
              </div>
              <h3 className="fw-extrabold text-white mb-1">Welcome Back</h3>
              <p className="text-muted small">Sign in to your IMovies account to book tickets & manage reservations</p>
            </div>

            {error && (
              <div className="alert alert-danger py-2.5 small rounded-3" role="alert">
                <i className="bi bi-exclamation-circle-fill me-1.5"></i> {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label text-light small fw-bold text-uppercase tracking-wider">Email Address</label>
                <div className="input-group">
                  <span className="input-group-text bg-dark border-secondary text-secondary">
                    <i className="bi bi-envelope"></i>
                  </span>
                  <input
                    type="email"
                    className="form-control form-control-cinema"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="mb-4">
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <label className="form-label text-light small fw-bold text-uppercase tracking-wider mb-0">Password</label>
                </div>
                <div className="input-group">
                  <span className="input-group-text bg-dark border-secondary text-secondary">
                    <i className="bi bi-lock"></i>
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="form-control form-control-cinema"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="input-group-text bg-dark border-secondary text-secondary"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-cinema-primary w-100 py-3 rounded-pill fw-bold mb-3"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Authenticating...
                  </>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

            {/* Quick Demo Credentials */}
            <div className="border-top border-secondary border-opacity-25 pt-3 mt-3 text-center">
              <div className="text-muted small mb-2 fw-semibold">⚡ Quick Fill Demo Accounts:</div>
              <div className="d-flex justify-content-center gap-2">
                <button
                  type="button"
                  className="btn btn-sm btn-cinema-outline rounded-pill text-light py-1 px-3"
                  onClick={() => handleQuickLogin('user@imovies.com', 'password123')}
                >
                  <i className="bi bi-person me-1"></i> Demo User
                </button>
                <button
                  type="button"
                  className="btn btn-sm btn-outline-warning rounded-pill py-1 px-3"
                  onClick={() => handleQuickLogin('admin@imovies.com', 'password123')}
                >
                  <i className="bi bi-shield-lock me-1"></i> Admin User
                </button>
              </div>
            </div>

            <div className="text-center mt-4 text-muted small">
              New to IMovies?{' '}
              <Link to="/register" className="text-danger fw-bold text-decoration-none">
                Create an account
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
