import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import SeatGrid from '../components/SeatGrid';

const SeatSelectionPage = () => {
  const { showtimeId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [showtime, setShowtime] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('UPI (Google Pay / PhonePe / Paytm)');

  useEffect(() => {
    fetchShowtime();
  }, [showtimeId]);

  const fetchShowtime = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/showtimes/${showtimeId}`);
      if (response.data.success) {
        setShowtime(response.data.data);
      }
    } catch (err) {
      console.error('Error fetching showtime:', err);
      setError('Failed to load auditorium seating data.');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleSeat = (seat) => {
    setError('');
    const isAlreadySelected = selectedSeats.some((s) => s.seatNumber === seat.seatNumber);

    if (isAlreadySelected) {
      setSelectedSeats(selectedSeats.filter((s) => s.seatNumber !== seat.seatNumber));
    } else {
      if (selectedSeats.length >= 6) {
        setError('You can select a maximum of 6 seats per booking.');
        return;
      }
      setSelectedSeats([...selectedSeats, seat]);
    }
  };

  const calculateSubtotal = () => {
    return selectedSeats.reduce((acc, seat) => acc + seat.price, 0);
  };

  const convenienceFeePerTicket = 25;
  const totalConvenienceFee = selectedSeats.length * convenienceFeePerTicket;
  const grandTotal = calculateSubtotal() + totalConvenienceFee;

  const handleProceedToPayment = () => {
    if (!user) {
      navigate('/login', { state: { from: `/booking/${showtimeId}` } });
      return;
    }
    if (selectedSeats.length === 0) {
      setError('Please select at least one seat to proceed.');
      return;
    }
    setShowPaymentModal(true);
  };

  const handleConfirmBooking = async () => {
    setSubmitting(true);
    setError('');
    try {
      const seatNumbers = selectedSeats.map((s) => s.seatNumber);
      const response = await axios.post('/api/bookings', {
        showtimeId,
        seatNumbers,
        paymentMethod,
      });

      if (response.data.success) {
        const booking = response.data.data;
        navigate(`/confirmation/${booking._id}`, { state: { booking } });
      }
    } catch (err) {
      console.error('Booking submission error:', err);
      setError(err.response?.data?.message || 'Booking failed. Seats might have been booked.');
      setShowPaymentModal(false);
      // Refresh seats to sync availability
      fetchShowtime();
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-danger" style={{ width: '3rem', height: '3rem' }} role="status"></div>
        <p className="text-muted mt-3">Rendering auditorium layout & seat map...</p>
      </div>
    );
  }

  if (!showtime) {
    return (
      <div className="container py-5 text-center">
        <div className="glass-panel p-5 mx-auto" style={{ maxWidth: '500px' }}>
          <i className="bi bi-exclamation-triangle text-danger display-4 mb-3"></i>
          <h4 className="text-white">Showtime Details Unavailable</h4>
          <p className="text-muted">The requested screening could not be located or has ended.</p>
          <Link to="/" className="btn btn-cinema-primary rounded-pill px-4 mt-2">Back to Movies</Link>
        </div>
      </div>
    );
  }

  const { movie } = showtime;

  return (
    <div className="container py-4">
      {/* Top Header Bar */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 pb-3 border-bottom border-secondary border-opacity-25 gap-3">
        <div>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb small mb-1">
              <li className="breadcrumb-item"><Link to="/" className="text-muted text-decoration-none">Home</Link></li>
              <li className="breadcrumb-item"><Link to={`/movie/${movie._id}`} className="text-muted text-decoration-none">{movie.title}</Link></li>
              <li className="breadcrumb-item active text-danger" aria-current="page">Seat Selection</li>
            </ol>
          </nav>
          <h2 className="fw-extrabold text-white mb-0">{movie.title}</h2>
          <div className="text-muted small mt-1 d-flex flex-wrap gap-3">
            <span><i className="bi bi-geo-alt-fill text-danger me-1"></i> {showtime.theaterName}</span>
            <span><i className="bi bi-calendar-event text-danger me-1"></i> {showtime.date}</span>
            <span><i className="bi bi-clock-fill text-danger me-1"></i> {showtime.time}</span>
          </div>
        </div>

        <Link to={`/movie/${movie._id}`} className="btn btn-cinema-outline btn-sm rounded-pill px-3 py-1.5 align-self-md-center">
          <i className="bi bi-arrow-left me-1"></i> Change Screening
        </Link>
      </div>

      {error && (
        <div className="alert alert-danger alert-dismissible fade show rounded-3" role="alert">
          <i className="bi bi-exclamation-circle-fill me-2"></i>
          {error}
          <button type="button" className="btn-close" onClick={() => setError('')}></button>
        </div>
      )}

      <div className="row g-4">
        {/* Left Column: Interactive Seat Grid */}
        <div className="col-lg-8">
          <SeatGrid
            seats={showtime.seats}
            selectedSeats={selectedSeats}
            onToggleSeat={handleToggleSeat}
          />
        </div>

        {/* Right Column: Sticky Booking Invoice Panel */}
        <div className="col-lg-4">
          <div className="glass-panel p-4 sticky-top" style={{ top: '90px' }}>
            <h5 className="fw-bold text-white mb-3 d-flex align-items-center gap-2">
              <i className="bi bi-receipt text-danger"></i> Reservation Summary
            </h5>

            {/* Movie Thumbnail and Info */}
            <div className="d-flex gap-3 mb-3 pb-3 border-bottom border-secondary border-opacity-25">
              <img
                src={movie.posterUrl}
                alt={movie.title}
                className="rounded-3 shadow"
                style={{ width: '65px', height: '90px', objectFit: 'cover' }}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=600&q=80';
                }}
              />
              <div className="d-flex flex-column justify-content-center">
                <h6 className="fw-bold text-white mb-1">{movie.title}</h6>
                <div className="small text-muted">{movie.language} • {movie.duration}m</div>
                <div className="small text-warning fw-semibold mt-1">
                  <i className="bi bi-badge-hd me-1"></i> {showtime.theaterName}
                </div>
              </div>
            </div>

            {/* Selected Seats Badges */}
            <div className="mb-3">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="text-muted small fw-bold text-uppercase tracking-wider">
                  Selected Seats ({selectedSeats.length})
                </span>
                {selectedSeats.length > 0 && (
                  <button
                    type="button"
                    className="btn btn-link btn-sm text-danger text-decoration-none p-0 small"
                    onClick={() => setSelectedSeats([])}
                  >
                    Clear All
                  </button>
                )}
              </div>

              {selectedSeats.length > 0 ? (
                <div className="d-flex flex-wrap gap-2">
                  {selectedSeats.map((seat) => (
                    <span
                      key={seat.seatNumber}
                      className="badge bg-danger bg-opacity-20 text-danger border border-danger border-opacity-40 py-1.5 px-2.5 rounded-2 d-flex align-items-center gap-1.5"
                    >
                      <span className="fw-bold">{seat.seatNumber}</span>
                      <small className="opacity-75">({seat.tier})</small>
                      <i
                        className="bi bi-x ms-1 cursor-pointer"
                        style={{ cursor: 'pointer' }}
                        onClick={() => handleToggleSeat(seat)}
                        title="Remove seat"
                      ></i>
                    </span>
                  ))}
                </div>
              ) : (
                <div className="text-muted small py-3 px-3 rounded-3 text-center border border-dashed border-secondary border-opacity-50">
                  <i className="bi bi-cursor-fill me-1 text-danger"></i>
                  Click available seats in auditorium to book
                </div>
              )}
            </div>

            {/* Itemized Price Breakdown */}
            {selectedSeats.length > 0 && (
              <div className="border-top border-secondary border-opacity-25 pt-3 mb-4 small">
                <div className="d-flex justify-content-between text-muted mb-2">
                  <span>Tickets Subtotal</span>
                  <span className="text-light fw-medium">₹{calculateSubtotal()}</span>
                </div>
                <div className="d-flex justify-content-between text-muted mb-2">
                  <span>Convenience & Audio GST (₹{convenienceFeePerTicket} × {selectedSeats.length})</span>
                  <span className="text-light fw-medium">₹{totalConvenienceFee}</span>
                </div>
                <div className="d-flex justify-content-between border-top border-secondary border-opacity-25 pt-2 fs-5 fw-bold text-white">
                  <span>Total Amount</span>
                  <span className="text-gradient-primary">₹{grandTotal}</span>
                </div>
              </div>
            )}

            {/* Action Checkout Button */}
            <button
              type="button"
              className="btn btn-cinema-primary w-100 py-3 rounded-pill fw-bold shadow-lg d-flex align-items-center justify-content-center gap-2"
              disabled={selectedSeats.length === 0}
              onClick={handleProceedToPayment}
            >
              <i className="bi bi-lock-fill"></i>
              <span>{user ? `Proceed to Pay ₹${grandTotal}` : 'Sign In to Complete Booking'}</span>
            </button>

            <div className="text-center text-muted small mt-3" style={{ fontSize: '0.75rem' }}>
              <i className="bi bi-shield-lock-fill text-success me-1"></i>
              256-Bit SSL Encrypted • Instant Digital Ticket Delivery
            </div>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)', backdropFilter: 'blur(8px)' }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content glass-panel text-white border-secondary border-opacity-50 shadow-2xl rounded-4 overflow-hidden" style={{ background: '#0e1526' }}>
              <div className="modal-header border-secondary border-opacity-25 px-4 pt-4">
                <h5 className="modal-title fw-bold d-flex align-items-center gap-2">
                  <i className="bi bi-credit-card-2-front-fill text-danger"></i>
                  Complete Ticket Payment
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setShowPaymentModal(false)}
                ></button>
              </div>

              <div className="modal-body px-4 py-3">
                <div className="glass-panel p-3 mb-3 border-secondary border-opacity-25">
                  <div className="d-flex justify-content-between mb-1 small">
                    <span className="text-muted">Movie:</span>
                    <strong className="text-white">{movie.title}</strong>
                  </div>
                  <div className="d-flex justify-content-between mb-1 small">
                    <span className="text-muted">Seats:</span>
                    <strong className="text-warning">{selectedSeats.map((s) => s.seatNumber).join(', ')}</strong>
                  </div>
                  <div className="d-flex justify-content-between mb-1 small">
                    <span className="text-muted">Screen & Time:</span>
                    <span className="text-light">{showtime.theaterName} • {showtime.time}</span>
                  </div>
                  <div className="d-flex justify-content-between border-top border-secondary border-opacity-25 pt-2 mt-2">
                    <span className="text-muted fw-bold">Payable Amount:</span>
                    <strong className="text-danger fs-5">₹{grandTotal}</strong>
                  </div>
                </div>

                <label className="form-label text-muted small text-uppercase fw-bold tracking-wider">
                  Select Payment Gateway
                </label>
                <div className="d-flex flex-column gap-2 mb-3">
                  {[
                    'UPI (Google Pay / PhonePe / Paytm)',
                    'Credit / Debit Card (Visa, MasterCard, RuPay)',
                    'Net Banking (All Indian Banks)',
                  ].map((method) => (
                    <div
                      key={method}
                      className={`p-3 rounded-3 border cursor-pointer d-flex align-items-center gap-3 transition ${
                        paymentMethod === method
                          ? 'border-danger bg-danger bg-opacity-15 text-white'
                          : 'border-secondary border-opacity-25 text-muted'
                      }`}
                      style={{ cursor: 'pointer' }}
                      onClick={() => setPaymentMethod(method)}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        checked={paymentMethod === method}
                        onChange={() => setPaymentMethod(method)}
                        className="form-check-input mt-0"
                      />
                      <span className="fw-medium small text-white">{method}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="modal-footer border-secondary border-opacity-25 px-4 pb-4">
                <button
                  type="button"
                  className="btn btn-cinema-outline rounded-pill px-4"
                  onClick={() => setShowPaymentModal(false)}
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-cinema-primary rounded-pill px-4 py-2 fw-bold"
                  onClick={handleConfirmBooking}
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      Authorizing Ticket...
                    </>
                  ) : (
                    `Pay ₹${grandTotal} & Issue Ticket`
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SeatSelectionPage;
