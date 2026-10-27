import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const MyBookingsPage = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);
  const [alertMsg, setAlertMsg] = useState({ type: '', text: '' });
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/bookings/my-bookings');
      if (response.data.success) {
        setBookings(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking? Reserved seats will be released.')) {
      return;
    }

    setCancellingId(bookingId);
    setAlertMsg({ type: '', text: '' });

    try {
      const response = await axios.put(`/api/bookings/${bookingId}/cancel`);
      if (response.data.success) {
        setAlertMsg({ type: 'success', text: 'Booking cancelled successfully. Reserved seats released.' });
        fetchBookings();
      }
    } catch (error) {
      setAlertMsg({
        type: 'danger',
        text: error.response?.data?.message || 'Failed to cancel booking. Please try again.',
      });
    } finally {
      setCancellingId(null);
    }
  };

  if (!user) {
    return (
      <div className="container py-5 text-center">
        <div className="glass-panel p-5 mx-auto" style={{ maxWidth: '500px' }}>
          <div className="rounded-circle bg-danger bg-opacity-10 d-inline-flex p-4 text-danger mb-3">
            <i className="bi bi-person-lock fs-1"></i>
          </div>
          <h3 className="text-white">Authentication Required</h3>
          <p className="text-muted">Please sign in to your IMovies account to access your digital tickets and reservations.</p>
          <Link to="/login" className="btn btn-cinema-primary rounded-pill px-4 mt-2">Sign In Now</Link>
        </div>
      </div>
    );
  }

  const filteredBookings = bookings.filter((b) => {
    if (activeTab === 'active') return b.paymentStatus !== 'cancelled';
    if (activeTab === 'cancelled') return b.paymentStatus === 'cancelled';
    return true;
  });

  return (
    <div className="container py-5">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
        <div>
          <div className="d-flex align-items-center gap-2 text-danger fw-bold small text-uppercase tracking-wider mb-1">
            <i className="bi bi-ticket-perforated-fill"></i> Digital Wallet
          </div>
          <h2 className="fw-extrabold text-white mb-0">My Movie Bookings</h2>
          <p className="text-muted small mb-0">Manage your active reservations, digital tickets, and cinema receipts.</p>
        </div>

        <Link to="/" className="btn btn-cinema-primary btn-sm rounded-pill px-4 py-2">
          <i className="bi bi-plus-circle me-1.5"></i> Book New Movie
        </Link>
      </div>

      {alertMsg.text && (
        <div className={`alert alert-${alertMsg.type} alert-dismissible fade show rounded-3`} role="alert">
          <i className="bi bi-info-circle-fill me-2"></i>
          {alertMsg.text}
          <button type="button" className="btn-close" onClick={() => setAlertMsg({ type: '', text: '' })}></button>
        </div>
      )}

      {/* Tabs */}
      <div className="d-flex gap-2 mb-4">
        {[
          { key: 'all', label: `All Tickets (${bookings.length})` },
          { key: 'active', label: `Active (${bookings.filter(b => b.paymentStatus !== 'cancelled').length})` },
          { key: 'cancelled', label: `Cancelled (${bookings.filter(b => b.paymentStatus === 'cancelled').length})` },
        ].map((tab) => (
          <button
            key={tab.key}
            type="button"
            className={`btn btn-sm rounded-pill px-3 py-1.5 transition ${
              activeTab === tab.key
                ? 'btn-danger fw-bold'
                : 'btn-cinema-outline text-muted small'
            }`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-danger" style={{ width: '3rem', height: '3rem' }} role="status"></div>
          <p className="text-muted mt-3">Fetching your digital cinema tickets...</p>
        </div>
      ) : filteredBookings.length > 0 ? (
        <div className="d-flex flex-column gap-3">
          {filteredBookings.map((b) => (
            <div key={b._id} className="glass-panel p-4 glass-card-interactive">
              <div className="row align-items-center gy-3">
                {/* Poster Thumbnail */}
                <div className="col-sm-2 text-center text-sm-start">
                  <img
                    src={b.movie?.posterUrl}
                    alt={b.movie?.title}
                    className="rounded-3 shadow"
                    style={{ width: '85px', height: '115px', objectFit: 'cover' }}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=600&q=80';
                    }}
                  />
                </div>

                {/* Details */}
                <div className="col-sm-6">
                  <div className="d-flex align-items-center gap-2 mb-1.5">
                    <h5 className="fw-bold text-white mb-0">{b.movie?.title}</h5>
                    <span
                      className={`badge rounded-pill small ${
                        b.paymentStatus === 'completed'
                          ? 'bg-success bg-opacity-20 text-success border border-success border-opacity-40'
                          : 'bg-secondary bg-opacity-20 text-danger border border-danger border-opacity-40'
                      }`}
                    >
                      {b.paymentStatus.toUpperCase()}
                    </span>
                  </div>

                  <div className="text-muted small mb-2">
                    <strong className="text-light">{b.showtime?.theaterName}</strong> • {b.movie?.language}
                  </div>

                  <div className="d-flex flex-wrap gap-3 small text-secondary">
                    <span>
                      <i className="bi bi-calendar3 me-1.5 text-danger"></i> {b.showtime?.date}
                    </span>
                    <span>
                      <i className="bi bi-clock me-1.5 text-danger"></i> {b.showtime?.time}
                    </span>
                    <span>
                      <i className="bi bi-qr-code me-1.5 text-danger"></i> Ref: <strong className="text-light font-monospace">{b.bookingReference}</strong>
                    </span>
                  </div>
                </div>

                {/* Seats & Price */}
                <div className="col-sm-2 text-sm-center">
                  <div className="small text-muted text-uppercase fw-semibold" style={{ fontSize: '0.7rem' }}>SEATS</div>
                  <div className="fw-extrabold text-warning fs-5">
                    {b.seats?.map((s) => s.seatNumber).join(', ')}
                  </div>
                  <div className="text-muted small mt-1">Paid: <strong className="text-light">₹{b.totalAmount}</strong></div>
                </div>

                {/* Action buttons */}
                <div className="col-sm-2 d-flex flex-column gap-2 text-end">
                  <Link
                    to={`/confirmation/${b._id}`}
                    state={{ booking: b }}
                    className="btn btn-cinema-outline btn-sm rounded-pill py-2"
                  >
                    <i className="bi bi-qr-code-scan me-1"></i> Digital Pass
                  </Link>

                  {b.paymentStatus !== 'cancelled' && (
                    <button
                      type="button"
                      className="btn btn-outline-danger btn-sm rounded-pill"
                      disabled={cancellingId === b._id}
                      onClick={() => handleCancelBooking(b._id)}
                    >
                      {cancellingId === b._id ? (
                        <span className="spinner-border spinner-border-sm"></span>
                      ) : (
                        'Cancel Seats'
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-5 glass-panel p-5 my-4">
          <div className="rounded-circle bg-danger bg-opacity-10 d-inline-flex p-4 text-danger mb-3">
            <i className="bi bi-ticket-detailed fs-1"></i>
          </div>
          <h4 className="text-white">No Tickets Found</h4>
          <p className="text-muted">You have no reservations matching this filter.</p>
          <Link to="/" className="btn btn-cinema-primary rounded-pill px-4 mt-2">
            Explore Now Showing Movies
          </Link>
        </div>
      )}
    </div>
  );
};

export default MyBookingsPage;
