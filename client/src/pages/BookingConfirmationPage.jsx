import React, { useState, useEffect } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import axios from 'axios';

const BookingConfirmationPage = () => {
  const { bookingId } = useParams();
  const location = useLocation();
  const [booking, setBooking] = useState(location.state?.booking || null);
  const [loading, setLoading] = useState(!booking);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!booking) {
      fetchBooking();
    }
  }, [bookingId]);

  const fetchBooking = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/bookings/${bookingId}`);
      if (response.data.success) {
        setBooking(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching booking:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCopyRef = () => {
    if (booking?.bookingReference) {
      navigator.clipboard.writeText(booking.bookingReference);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-danger" style={{ width: '3rem', height: '3rem' }} role="status"></div>
        <p className="text-muted mt-3">Generating your verified digital cinema ticket...</p>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="container py-5 text-center">
        <div className="glass-panel p-5 mx-auto" style={{ maxWidth: '500px' }}>
          <i className="bi bi-ticket-detailed text-danger display-3 mb-3"></i>
          <h4 className="text-white">Booking Record Not Found</h4>
          <p className="text-muted">We could not locate this ticket confirmation record.</p>
          <Link to="/" className="btn btn-cinema-primary rounded-pill px-4 mt-2">Back to Catalog</Link>
        </div>
      </div>
    );
  }

  const { movie, showtime, seats, totalAmount, bookingReference, paymentStatus, createdAt } = booking;
  const bookingDate = createdAt ? new Date(createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Today';

  return (
    <div className="container py-5">
      {/* Top Success Banner */}
      <div className="text-center mb-5">
        <div
          className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3 shadow"
          style={{
            width: '80px',
            height: '80px',
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(5, 150, 105, 0.4) 100%)',
            border: '2px solid #10b981',
            boxShadow: '0 0 25px rgba(16, 185, 129, 0.4)',
          }}
        >
          <i className="bi bi-check-lg text-success fs-1"></i>
        </div>
        <h1 className="fw-extrabold text-white mb-2">Booking Confirmed!</h1>
        <p className="text-muted lead" style={{ fontSize: '1.05rem' }}>
          Your cinema seats are locked & confirmed. Digital entry pass is ready below.
        </p>
      </div>

      {/* Ticket Pass Container */}
      <div className="row justify-content-center">
        <div className="col-lg-8 col-xl-7">
          <div className="ticket-stub-modern shadow-2xl position-relative p-4 p-md-5">
            {/* Cutout notches */}
            <div className="ticket-notch-left"></div>
            <div className="ticket-notch-right"></div>

            {/* Header of Ticket */}
            <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center border-bottom border-secondary border-opacity-25 pb-4 mb-4 gap-3">
              <div className="d-flex align-items-center gap-2">
                <div
                  className="d-flex align-items-center justify-content-center rounded-3"
                  style={{ width: '36px', height: '36px', background: 'var(--imovies-primary)' }}
                >
                  <i className="bi bi-film text-white"></i>
                </div>
                <div>
                  <span className="brand-font fw-extrabold fs-5 text-white">IMOVIES PASS</span>
                  <div className="text-muted" style={{ fontSize: '0.7rem' }}>AUTHORIZED DIGITAL TICKET</div>
                </div>
              </div>

              <div className="d-flex align-items-center gap-2">
                <div className="text-end">
                  <div className="text-muted small" style={{ fontSize: '0.7rem' }}>BOOKING REF</div>
                  <span className="fw-bold text-danger font-monospace fs-5">{bookingReference}</span>
                </div>
                <button
                  type="button"
                  className="btn btn-dark btn-sm rounded-circle p-1.5 border-secondary text-muted"
                  onClick={handleCopyRef}
                  title="Copy Reference ID"
                >
                  <i className={`bi ${copied ? 'bi-check text-success' : 'bi-clipboard'}`}></i>
                </button>
              </div>
            </div>

            {/* Movie & Venue Info */}
            <div className="row gy-4 align-items-center mb-4">
              <div className="col-sm-4 text-center">
                <img
                  src={movie.posterUrl}
                  alt={movie.title}
                  className="img-fluid rounded-3 shadow-lg"
                  style={{ maxHeight: '190px', objectFit: 'cover', border: '1px solid rgba(255, 255, 255, 0.1)' }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=600&q=80';
                  }}
                />
              </div>

              <div className="col-sm-8">
                <div className="d-flex align-items-center gap-2 mb-1">
                  <span className="badge bg-danger px-2.5 py-1 rounded-pill small">{movie.language}</span>
                  <span className="badge bg-dark border border-secondary text-light px-2 py-1 rounded-pill small">
                    {movie.duration} Mins
                  </span>
                </div>

                <h3 className="fw-extrabold text-white mb-2">{movie.title}</h3>

                <div className="d-flex flex-column gap-1.5 small text-light mt-3">
                  <div className="d-flex align-items-center gap-2">
                    <i className="bi bi-geo-alt-fill text-danger"></i>
                    <span><strong>Cinema:</strong> {showtime.theaterName}</span>
                  </div>
                  <div className="d-flex align-items-center gap-2">
                    <i className="bi bi-calendar3 text-danger"></i>
                    <span><strong>Date:</strong> {showtime.date}</span>
                  </div>
                  <div className="d-flex align-items-center gap-2">
                    <i className="bi bi-clock-fill text-danger"></i>
                    <span><strong>Showtime:</strong> {showtime.time}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Perforated Divider */}
            <div className="ticket-perforation"></div>

            {/* Seats, Price & Guest Badges */}
            <div className="glass-panel p-3.5 mb-4 border-secondary border-opacity-25">
              <div className="row text-center gy-3 align-items-center">
                <div className="col-4 border-end border-secondary border-opacity-25">
                  <div className="text-muted small text-uppercase" style={{ fontSize: '0.7rem' }}>SEAT NUMBERS</div>
                  <div className="fw-extrabold text-warning fs-4">
                    {seats.map((s) => s.seatNumber).join(', ')}
                  </div>
                </div>
                <div className="col-4 border-end border-secondary border-opacity-25">
                  <div className="text-muted small text-uppercase" style={{ fontSize: '0.7rem' }}>TOTAL PAID</div>
                  <div className="fw-extrabold text-white fs-4">₹{totalAmount}</div>
                  <span className="badge bg-success bg-opacity-20 text-success py-0.5 px-2 rounded-pill small" style={{ fontSize: '0.65rem' }}>
                    {paymentStatus.toUpperCase()}
                  </span>
                </div>
                <div className="col-4">
                  <div className="text-muted small text-uppercase" style={{ fontSize: '0.7rem' }}>TICKETS</div>
                  <div className="fw-extrabold text-light fs-4">{seats.length} Person(s)</div>
                </div>
              </div>
            </div>

            {/* QR Code and Barcode Scanner Simulation */}
            <div className="text-center pt-2">
              <div
                className="d-inline-block bg-white p-2.5 rounded-3 shadow mb-2"
                style={{ width: '135px', height: '135px' }}
              >
                <svg viewBox="0 0 100 100" width="100%" height="100%" fill="#070a12">
                  <rect x="0" y="0" width="30" height="30" />
                  <rect x="5" y="5" width="20" height="20" fill="#fff" />
                  <rect x="10" y="10" width="10" height="10" />

                  <rect x="70" y="0" width="30" height="30" />
                  <rect x="75" y="5" width="20" height="20" fill="#fff" />
                  <rect x="80" y="10" width="10" height="10" />

                  <rect x="0" y="70" width="30" height="30" />
                  <rect x="5" y="75" width="20" height="20" fill="#fff" />
                  <rect x="10" y="80" width="10" height="10" />

                  <rect x="40" y="12" width="15" height="15" />
                  <rect x="40" y="42" width="20" height="20" />
                  <rect x="70" y="50" width="15" height="15" />
                  <rect x="20" y="45" width="12" height="12" />
                  <rect x="45" y="75" width="25" height="15" />
                </svg>
              </div>
              <div className="text-muted small font-monospace tracking-widest mb-1">
                ║▌║▌║█│▌▌│█║▌║▌║
              </div>
              <p className="text-muted small mb-0" style={{ fontSize: '0.75rem' }}>
                Present this QR code or Ref ID at the theater auditorium entrance.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="d-flex flex-wrap justify-content-center gap-3 mt-4 btn-print-hide">
            <button type="button" className="btn btn-cinema-outline rounded-pill px-4 py-2" onClick={handlePrint}>
              <i className="bi bi-printer me-2"></i> Print / Save PDF
            </button>
            <Link to="/my-bookings" className="btn btn-cinema-primary rounded-pill px-4 py-2">
              <i className="bi bi-ticket-perforated me-2"></i> View All My Tickets
            </Link>
            <Link to="/" className="btn btn-cinema-outline rounded-pill px-4 py-2">
              Explore More Movies
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmationPage;
