import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const MovieDetailPage = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [showtimes, setShowtimes] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMovieDetails();
  }, [id]);

  const fetchMovieDetails = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/movies/${id}`);
      if (response.data.success) {
        setMovie(response.data.data.movie);
        const fetchedShowtimes = response.data.data.showtimes;
        setShowtimes(fetchedShowtimes);

        // Set default selected date to first available date
        if (fetchedShowtimes.length > 0) {
          const uniqueDates = [...new Set(fetchedShowtimes.map((st) => st.date))];
          setSelectedDate(uniqueDates[0]);
        }
      }
    } catch (error) {
      console.error('Error fetching movie details:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-danger" style={{ width: '3rem', height: '3rem' }} role="status"></div>
        <p className="text-muted mt-3">Loading cinematic details...</p>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="container py-5 text-center">
        <div className="glass-panel p-5 mx-auto" style={{ maxWidth: '500px' }}>
          <i className="bi bi-film text-danger display-3 mb-3"></i>
          <h3 className="text-white">Movie Not Found</h3>
          <p className="text-muted">The requested movie listing is currently unavailable.</p>
          <Link to="/" className="btn btn-cinema-primary rounded-pill px-4 mt-2">Back to Catalog</Link>
        </div>
      </div>
    );
  }

  // Get unique show dates
  const availableDates = [...new Set(showtimes.map((st) => st.date))];
  const filteredShowtimes = showtimes.filter((st) => st.date === selectedDate);

  // Group filtered showtimes by theater
  const showtimesByTheater = filteredShowtimes.reduce((acc, st) => {
    if (!acc[st.theaterName]) {
      acc[st.theaterName] = [];
    }
    acc[st.theaterName].push(st);
    return acc;
  }, {});

  return (
    <div className="pb-5">
      {/* Top Backdrop Header */}
      <div
        className="position-relative py-5"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(7, 10, 18, 0.8) 0%, rgba(7, 10, 18, 0.98) 100%), url(${movie.bannerUrl || movie.posterUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center 20%',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        }}
      >
        <div className="container py-3">
          {/* Breadcrumbs */}
          <nav aria-label="breadcrumb" className="mb-4">
            <ol className="breadcrumb small mb-0">
              <li className="breadcrumb-item">
                <Link to="/" className="text-muted text-decoration-none">
                  <i className="bi bi-house me-1"></i> Home
                </Link>
              </li>
              <li className="breadcrumb-item">
                <Link to="/" className="text-muted text-decoration-none">Movies</Link>
              </li>
              <li className="breadcrumb-item active text-danger" aria-current="page">
                {movie.title}
              </li>
            </ol>
          </nav>

          <div className="row align-items-center gy-4">
            {/* Poster with glow effect */}
            <div className="col-md-4 col-lg-3 text-center text-md-start">
              <div className="position-relative d-inline-block">
                <img
                  src={movie.posterUrl}
                  alt={movie.title}
                  className="img-fluid rounded-4 shadow-lg"
                  style={{
                    maxHeight: '420px',
                    objectFit: 'cover',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    boxShadow: '0 20px 40px -15px rgba(225, 29, 72, 0.35)',
                  }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=600&q=80';
                  }}
                />
              </div>
            </div>

            {/* Details */}
            <div className="col-md-8 col-lg-9 ps-lg-4">
              <div className="d-flex flex-wrap align-items-center gap-2 mb-2">
                <span className="badge bg-danger px-3 py-1.5 rounded-pill fw-bold">
                  {movie.language}
                </span>
                <span className="badge bg-dark border border-secondary px-3 py-1.5 rounded-pill text-light">
                  <i className="bi bi-clock me-1 text-danger"></i> {movie.duration} Mins
                </span>
                <span className="badge bg-warning text-dark px-3 py-1.5 rounded-pill fw-bold d-flex align-items-center gap-1">
                  <i className="bi bi-star-fill"></i> {movie.rating.toFixed(1)} / 10
                </span>
                <span className="badge bg-info bg-opacity-20 text-info border border-info border-opacity-30 px-3 py-1.5 rounded-pill fw-medium">
                  U/A 16+
                </span>
              </div>

              <h1 className="display-4 fw-extrabold text-white mb-2 tracking-tight">
                {movie.title}
              </h1>

              {/* Genres */}
              <div className="d-flex flex-wrap gap-2 mb-3">
                {movie.genres?.map((genre, idx) => (
                  <span
                    key={idx}
                    className="badge rounded-pill px-3 py-1 text-light"
                    style={{
                      background: 'rgba(255, 255, 255, 0.08)',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                    }}
                  >
                    {genre}
                  </span>
                ))}
              </div>

              {/* Description */}
              <p className="text-light text-opacity-80 lead mb-4" style={{ fontSize: '1.05rem', maxWidth: '850px', lineHeight: 1.7 }}>
                {movie.description}
              </p>

              {/* Director & Cast Grid */}
              <div className="row g-3 pt-2 border-top border-secondary border-opacity-25" style={{ maxWidth: '750px' }}>
                {movie.director && (
                  <div className="col-sm-6">
                    <div className="text-muted small text-uppercase fw-semibold mb-1">Director</div>
                    <div className="fw-bold text-white d-flex align-items-center gap-2">
                      <div className="rounded-circle bg-danger bg-opacity-20 text-danger p-1 d-flex align-items-center justify-content-center" style={{ width: '28px', height: '28px' }}>
                        <i className="bi bi-person-video"></i>
                      </div>
                      <span>{movie.director}</span>
                    </div>
                  </div>
                )}

                {movie.cast && movie.cast.length > 0 && (
                  <div className="col-sm-6">
                    <div className="text-muted small text-uppercase fw-semibold mb-1">Starring Cast</div>
                    <div className="fw-semibold text-light text-truncate">
                      {movie.cast.join(', ')}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Showtime Booking Section */}
      <div className="container mt-5">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-2">
          <div>
            <div className="d-flex align-items-center gap-2 text-danger fw-bold small text-uppercase tracking-wider mb-1">
              <i className="bi bi-calendar2-week"></i> Select Date & Time
            </div>
            <h3 className="fw-extrabold text-white mb-0">
              Available Cinema Screenings
            </h3>
          </div>

          <div className="d-flex align-items-center gap-3 small text-muted">
            <span className="d-flex align-items-center gap-1.5">
              <span className="d-inline-block rounded-circle bg-success" style={{ width: '10px', height: '10px' }}></span>
              Available
            </span>
            <span className="d-flex align-items-center gap-1.5">
              <span className="d-inline-block rounded-circle bg-warning" style={{ width: '10px', height: '10px' }}></span>
              Fast Filling
            </span>
          </div>
        </div>

        {/* Date Selector */}
        {availableDates.length > 0 ? (
          <>
            <div className="d-flex flex-wrap gap-2.5 mb-4">
              {availableDates.map((dateStr) => {
                const dateObj = new Date(dateStr + 'T00:00:00');
                const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
                const monthName = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                const isSelected = selectedDate === dateStr;

                return (
                  <button
                    key={dateStr}
                    type="button"
                    className={`btn text-center px-4 py-2.5 rounded-3 transition ${
                      isSelected
                        ? 'btn-cinema-primary shadow-lg'
                        : 'btn-cinema-outline text-light'
                    }`}
                    style={{ minWidth: '105px' }}
                    onClick={() => setSelectedDate(dateStr)}
                  >
                    <div className="small text-uppercase opacity-75 fw-bold" style={{ fontSize: '0.72rem' }}>
                      {dayName}
                    </div>
                    <div className="fw-extrabold fs-5 lh-1 mt-1">{monthName}</div>
                  </button>
                );
              })}
            </div>

            {/* Theaters List */}
            <div className="d-flex flex-column gap-3">
              {Object.keys(showtimesByTheater).map((theaterName) => (
                <div key={theaterName} className="glass-panel p-4">
                  <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center pb-3 mb-3 border-bottom border-secondary border-opacity-25 gap-2">
                    <div className="d-flex align-items-center gap-2">
                      <div className="rounded-circle bg-danger bg-opacity-20 text-danger p-2">
                        <i className="bi bi-geo-alt-fill fs-5"></i>
                      </div>
                      <div>
                        <h5 className="fw-bold text-white mb-0">{theaterName}</h5>
                        <div className="text-muted small">Cinepolis Multiplex • Laser Projector • Air Conditioned</div>
                      </div>
                    </div>

                    <div className="d-flex gap-2">
                      <span className="badge bg-dark border border-secondary text-info py-1 px-3 rounded-pill small">
                        <i className="bi bi-soundwave me-1"></i> Dolby Atmos
                      </span>
                      <span className="badge bg-dark border border-secondary text-warning py-1 px-3 rounded-pill small">
                        <i className="bi bi-cup-straw me-1"></i> Food & Beverage
                      </span>
                    </div>
                  </div>

                  {/* Showtime chips */}
                  <div className="d-flex flex-wrap gap-3">
                    {showtimesByTheater[theaterName].map((st) => (
                      <Link
                        key={st._id}
                        to={`/booking/${st._id}`}
                        className="btn btn-cinema-outline d-flex flex-column align-items-center px-4 py-2.5 rounded-3 text-decoration-none"
                        style={{ minWidth: '130px' }}
                      >
                        <span className="fw-bold fs-5 text-warning">{st.time}</span>
                        <div className="d-flex align-items-center gap-2 mt-1">
                          <span className="small text-white fw-semibold">₹{st.ticketPrice}</span>
                          <span className="badge bg-success bg-opacity-20 text-success py-0.5 px-1.5 rounded" style={{ fontSize: '0.65rem' }}>
                            FAST FILLING
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="glass-panel p-5 text-center my-4">
            <div className="rounded-circle bg-danger bg-opacity-10 d-inline-flex p-4 text-danger mb-3">
              <i className="bi bi-clock-history fs-1"></i>
            </div>
            <h4 className="text-white">No Showtimes Scheduled</h4>
            <p className="text-muted small">Screenings for this movie will be scheduled shortly. Check back soon!</p>
            <Link to="/" className="btn btn-cinema-outline rounded-pill px-4 mt-2">
              Browse Other Movies
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieDetailPage;
