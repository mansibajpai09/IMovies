import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="mt-auto pt-5 pb-4 border-top" style={{ backgroundColor: '#070a12', borderColor: 'rgba(255, 255, 255, 0.08)' }}>
      {/* Trust Highlights Bar */}
      <div className="container mb-5">
        <div className="row g-3 py-3 px-4 glass-panel rounded-4 text-center text-md-start align-items-center">
          <div className="col-md-3 col-6 d-flex align-items-center gap-3 justify-content-center justify-content-md-start">
            <div className="rounded-circle bg-danger bg-opacity-10 p-2 text-danger">
              <i className="bi bi-shield-check fs-4"></i>
            </div>
            <div>
              <div className="fw-bold text-white small">100% Secure</div>
              <div className="text-muted" style={{ fontSize: '0.75rem' }}>Encrypted Checkout</div>
            </div>
          </div>

          <div className="col-md-3 col-6 d-flex align-items-center gap-3 justify-content-center justify-content-md-start">
            <div className="rounded-circle bg-info bg-opacity-10 p-2 text-info">
              <i className="bi bi-lightning-charge fs-4"></i>
            </div>
            <div>
              <div className="fw-bold text-white small">Instant QR Ticket</div>
              <div className="text-muted" style={{ fontSize: '0.75rem' }}>Direct Entry to Audi</div>
            </div>
          </div>

          <div className="col-md-3 col-6 d-flex align-items-center gap-3 justify-content-center justify-content-md-start">
            <div className="rounded-circle bg-warning bg-opacity-10 p-2 text-warning">
              <i className="bi bi-arrow-repeat fs-4"></i>
            </div>
            <div>
              <div className="fw-bold text-white small">Easy Cancellation</div>
              <div className="text-muted" style={{ fontSize: '0.75rem' }}>Full Seat Release</div>
            </div>
          </div>

          <div className="col-md-3 col-6 d-flex align-items-center gap-3 justify-content-center justify-content-md-start">
            <div className="rounded-circle bg-success bg-opacity-10 p-2 text-success">
              <i className="bi bi-headset fs-4"></i>
            </div>
            <div>
              <div className="fw-bold text-white small">24/7 Concierge</div>
              <div className="text-muted" style={{ fontSize: '0.75rem' }}>Cinema Support</div>
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="row gy-4">
          <div className="col-lg-4 col-md-6">
            <div className="d-flex align-items-center gap-2 mb-3">
              <div
                className="d-flex align-items-center justify-content-center rounded-3"
                style={{
                  width: '36px',
                  height: '36px',
                  background: 'linear-gradient(135deg, #e11d48 0%, #be123c 100%)',
                }}
              >
                <i className="bi bi-film text-white"></i>
              </div>
              <span className="brand-font fw-extrabold fs-4 text-white">
                I<span className="text-gradient-primary">MOVIES</span>
              </span>
            </div>
            <p className="text-muted small leading-relaxed pe-lg-4">
              Next-generation cinema ticketing ecosystem. Explore trending blockbusters, reserve best-view seats in real-time with IMAX 3D, 4DX, and Dolby Atmos audio projection.
            </p>
            <div className="d-flex gap-2 text-secondary fs-5 mt-4">
              {['facebook', 'twitter-x', 'instagram', 'youtube', 'tiktok'].map((platform) => (
                <a
                  key={platform}
                  href={`#${platform}`}
                  className="btn btn-cinema-outline rounded-circle d-flex align-items-center justify-content-center p-0 text-muted"
                  style={{ width: '36px', height: '36px' }}
                >
                  <i className={`bi bi-${platform}`}></i>
                </a>
              ))}
            </div>
          </div>

          <div className="col-lg-2 col-md-6 col-6">
            <h6 className="text-white text-uppercase fw-bold mb-3 small tracking-wider">Cinemas</h6>
            <ul className="list-unstyled text-muted small d-flex flex-column gap-2 mb-0">
              <li><Link to="/" className="text-muted text-decoration-none hover-text-danger">Now Showing</Link></li>
              <li><Link to="/" className="text-muted text-decoration-none hover-text-danger">IMAX Screenings</Link></li>
              <li><Link to="/" className="text-muted text-decoration-none hover-text-danger">4DX & 3D Experience</Link></li>
              <li><Link to="/my-bookings" className="text-muted text-decoration-none hover-text-danger">My Tickets</Link></li>
            </ul>
          </div>

          <div className="col-lg-2 col-md-6 col-6">
            <h6 className="text-white text-uppercase fw-bold mb-3 small tracking-wider">Formats</h6>
            <ul className="list-unstyled text-muted small d-flex flex-column gap-2 mb-0">
              <li><span className="text-secondary">Dolby Atmos 7.1</span></li>
              <li><span className="text-secondary">Laser Projection 4K</span></li>
              <li><span className="text-secondary">VIP Recliner Lounges</span></li>
              <li><span className="text-secondary">Gourmet Food Ordering</span></li>
            </ul>
          </div>

          <div className="col-lg-4 col-md-6">
            <h6 className="text-white text-uppercase fw-bold mb-3 small tracking-wider">Premiere Club Newsletter</h6>
            <p className="text-muted small">Subscribe for early-bird access to premiere tickets and festival passes.</p>
            {subscribed ? (
              <div className="alert alert-success py-2 small rounded-3">
                <i className="bi bi-check-circle me-1"></i> Thank you! You're subscribed to IMovies Club.
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="d-flex gap-2">
                <input
                  type="email"
                  className="form-control form-control-cinema small"
                  placeholder="name@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <button className="btn btn-cinema-primary px-3 text-nowrap rounded-3" type="submit">
                  Join
                </button>
              </form>
            )}
            <div className="text-muted mt-2" style={{ fontSize: '0.72rem' }}>
              We respect your privacy. Unsubscribe anytime.
            </div>
          </div>
        </div>

        <div className="mt-5 pt-4 border-top border-secondary border-opacity-25 text-muted small d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">
          <span>&copy; {new Date().getFullYear()} IMovies Cinema Systems. Full-Stack MERN Architecture.</span>
          <div className="d-flex gap-4">
            <a href="#privacy" className="text-muted text-decoration-none small">Privacy Policy</a>
            <a href="#terms" className="text-muted text-decoration-none small">Terms of Service</a>
            <a href="#support" className="text-muted text-decoration-none small">Support Desk</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
