import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name || !email || !password) {
      setError('Please fill in all required fields.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    const res = await register(name, email, password);
    if (res.success) {
      navigate('/');
    } else {
      setError(res.message);
    }
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
                <i className="bi bi-person-plus-fill text-white fs-3"></i>
              </div>
              <h3 className="fw-extrabold text-white mb-1">Join IMovies</h3>
              <p className="text-muted small">Create your cinema profile for seamless ticketing & exclusive screenings</p>
            </div>

            {error && (
              <div className="alert alert-danger py-2.5 small rounded-3" role="alert">
                <i className="bi bi-exclamation-circle-fill me-1.5"></i> {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label text-light small fw-bold text-uppercase tracking-wider">Full Name</label>
                <div className="input-group">
                  <span className="input-group-text bg-dark border-secondary text-secondary">
                    <i className="bi bi-person"></i>
                  </span>
                  <input
                    type="text"
                    className="form-control form-control-cinema"
                    placeholder="e.g. Alex Morgan"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
              </div>

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

              <div className="mb-3">
                <label className="form-label text-light small fw-bold text-uppercase tracking-wider">Password</label>
                <div className="input-group">
                  <span className="input-group-text bg-dark border-secondary text-secondary">
                    <i className="bi bi-lock"></i>
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="form-control form-control-cinema"
                    placeholder="At least 6 characters"
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

              <div className="mb-4">
                <label className="form-label text-light small fw-bold text-uppercase tracking-wider">Confirm Password</label>
                <div className="input-group">
                  <span className="input-group-text bg-dark border-secondary text-secondary">
                    <i className="bi bi-shield-check"></i>
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="form-control form-control-cinema"
                    placeholder="Repeat password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
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
                    Creating Account...
                  </>
                ) : (
                  'Create Free Account'
                )}
              </button>
            </form>

            <div className="text-center mt-3 text-muted small">
              Already have an account?{' '}
              <Link to="/login" className="text-danger fw-bold text-decoration-none">
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
