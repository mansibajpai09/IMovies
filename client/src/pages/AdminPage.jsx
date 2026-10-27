import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const AdminPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [movies, setMovies] = useState([]);
  const [activeTab, setActiveTab] = useState('add-movie');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Add Movie Form State
  const [movieForm, setMovieForm] = useState({
    title: '',
    description: '',
    genres: 'Action, Sci-Fi',
    duration: 150,
    language: 'English',
    rating: 8.5,
    director: '',
    posterUrl: '',
    bannerUrl: '',
  });

  // Add Showtime Form State
  const [showtimeForm, setShowtimeForm] = useState({
    movie: '',
    theaterName: 'IMovies IMAX - Audi 1',
    date: new Date().toISOString().split('T')[0],
    time: '07:00 PM',
    ticketPrice: 250,
  });

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      return;
    }
    fetchMoviesList();
  }, [user]);

  const fetchMoviesList = async () => {
    try {
      const res = await axios.get('/api/movies');
      if (res.data.success) {
        setMovies(res.data.data);
        if (res.data.data.length > 0 && !showtimeForm.movie) {
          setShowtimeForm((prev) => ({ ...prev, movie: res.data.data[0]._id }));
        }
      }
    } catch (err) {
      console.error('Error fetching movies for admin:', err);
    }
  };

  const handleMovieSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const payload = {
        ...movieForm,
        genres: movieForm.genres.split(',').map((g) => g.trim()),
      };

      const res = await axios.post('/api/movies', payload);
      if (res.data.success) {
        setMessage({ type: 'success', text: `Movie "${res.data.data.title}" added to catalog!` });
        setMovieForm({
          title: '',
          description: '',
          genres: 'Action, Adventure',
          duration: 140,
          language: 'English',
          rating: 8.0,
          director: '',
          posterUrl: '',
          bannerUrl: '',
        });
        fetchMoviesList();
      }
    } catch (err) {
      setMessage({
        type: 'danger',
        text: err.response?.data?.message || 'Failed to create movie.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleShowtimeSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const res = await axios.post('/api/showtimes', showtimeForm);
      if (res.data.success) {
        setMessage({
          type: 'success',
          text: `Showtime successfully created with complete interactive seating layout!`,
        });
      }
    } catch (err) {
      setMessage({
        type: 'danger',
        text: err.response?.data?.message || 'Failed to create showtime.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMovie = async (movieId) => {
    if (!window.confirm('Are you sure? This will delete the movie and its scheduled showtimes.')) {
      return;
    }

    try {
      const res = await axios.delete(`/api/movies/${movieId}`);
      if (res.data.success) {
        setMessage({ type: 'success', text: 'Movie deleted successfully.' });
        fetchMoviesList();
      }
    } catch (err) {
      setMessage({
        type: 'danger',
        text: err.response?.data?.message || 'Failed to delete movie.',
      });
    }
  };

  if (!user || user.role !== 'admin') {
    return (
      <div className="container py-5 text-center">
        <div className="glass-panel p-5 mx-auto" style={{ maxWidth: '500px' }}>
          <i className="bi bi-shield-x text-danger display-3 mb-3"></i>
          <h4 className="text-white">Admin Privileges Required</h4>
          <p className="text-muted">You must be signed in with administrator credentials to manage cinema auditoriums and movies.</p>
          <button className="btn btn-cinema-primary rounded-pill px-4" onClick={() => navigate('/login')}>
            Sign in as Admin
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      {/* Top Banner Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
        <div>
          <div className="d-flex align-items-center gap-2 text-warning fw-bold small text-uppercase tracking-wider mb-1">
            <i className="bi bi-shield-lock-fill"></i> Cinema Control Panel
          </div>
          <h2 className="fw-extrabold text-white mb-0">Auditorium & Movie Management</h2>
          <p className="text-muted small mb-0">Publish new movies, generate auditorium seating layouts, and control ticket pricing.</p>
        </div>
        <span className="badge bg-warning text-dark py-2 px-3 rounded-pill fw-bold">
          ADMIN OPERATOR
        </span>
      </div>

      {/* Metrics Highlights Cards */}
      <div className="row g-3 mb-4">
        <div className="col-sm-6 col-lg-3">
          <div className="glass-panel p-3 d-flex align-items-center gap-3">
            <div className="rounded-circle bg-danger bg-opacity-20 text-danger p-3">
              <i className="bi bi-film fs-4"></i>
            </div>
            <div>
              <div className="text-muted small text-uppercase fw-semibold" style={{ fontSize: '0.7rem' }}>CATALOG MOVIES</div>
              <div className="fw-extrabold fs-4 text-white">{movies.length} Movies</div>
            </div>
          </div>
        </div>

        <div className="col-sm-6 col-lg-3">
          <div className="glass-panel p-3 d-flex align-items-center gap-3">
            <div className="rounded-circle bg-info bg-opacity-20 text-info p-3">
              <i className="bi bi-display fs-4"></i>
            </div>
            <div>
              <div className="text-muted small text-uppercase fw-semibold" style={{ fontSize: '0.7rem' }}>ACTIVE SCREENS</div>
              <div className="fw-extrabold fs-4 text-white">4 Screens</div>
            </div>
          </div>
        </div>

        <div className="col-sm-6 col-lg-3">
          <div className="glass-panel p-3 d-flex align-items-center gap-3">
            <div className="rounded-circle bg-warning bg-opacity-20 text-warning p-3">
              <i className="bi bi-ticket-perforated fs-4"></i>
            </div>
            <div>
              <div className="text-muted small text-uppercase fw-semibold" style={{ fontSize: '0.7rem' }}>SEATS / AUDI</div>
              <div className="fw-extrabold fs-4 text-white">48 Seats</div>
            </div>
          </div>
        </div>

        <div className="col-sm-6 col-lg-3">
          <div className="glass-panel p-3 d-flex align-items-center gap-3">
            <div className="rounded-circle bg-success bg-opacity-20 text-success p-3">
              <i className="bi bi-check2-circle fs-4"></i>
            </div>
            <div>
              <div className="text-muted small text-uppercase fw-semibold" style={{ fontSize: '0.7rem' }}>SERVER STATUS</div>
              <div className="fw-extrabold fs-4 text-success">Live & Online</div>
            </div>
          </div>
        </div>
      </div>

      {message.text && (
        <div className={`alert alert-${message.type} alert-dismissible fade show rounded-3 mb-4`} role="alert">
          <i className="bi bi-info-circle-fill me-2"></i>
          {message.text}
          <button type="button" className="btn-close" onClick={() => setMessage({ type: '', text: '' })}></button>
        </div>
      )}

      {/* Tabs */}
      <ul className="nav nav-pills gap-2 mb-4">
        <li className="nav-item">
          <button
            className={`btn rounded-pill px-4 ${activeTab === 'add-movie' ? 'btn-danger fw-bold' : 'btn-cinema-outline text-light'}`}
            onClick={() => setActiveTab('add-movie')}
          >
            <i className="bi bi-film me-2"></i> Add Movie
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`btn rounded-pill px-4 ${activeTab === 'add-showtime' ? 'btn-danger fw-bold' : 'btn-cinema-outline text-light'}`}
            onClick={() => setActiveTab('add-showtime')}
          >
            <i className="bi bi-calendar-plus me-2"></i> Schedule Showtime
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`btn rounded-pill px-4 ${activeTab === 'manage' ? 'btn-danger fw-bold' : 'btn-cinema-outline text-light'}`}
            onClick={() => setActiveTab('manage')}
          >
            <i className="bi bi-list-stars me-2"></i> Movies Catalog ({movies.length})
          </button>
        </li>
      </ul>

      {/* Tab 1: Add Movie Form */}
      {activeTab === 'add-movie' && (
        <div className="glass-panel p-4 p-md-5">
          <h4 className="fw-bold text-white mb-4 d-flex align-items-center gap-2">
            <i className="bi bi-plus-circle text-danger"></i> Add New Movie to Catalog
          </h4>
          <form onSubmit={handleMovieSubmit}>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label text-light small fw-bold text-uppercase">Movie Title *</label>
                <input
                  type="text"
                  className="form-control form-control-cinema"
                  placeholder="e.g. Dune: Part Two"
                  value={movieForm.title}
                  onChange={(e) => setMovieForm({ ...movieForm, title: e.target.value })}
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="form-label text-light small fw-bold text-uppercase">Genres (comma separated) *</label>
                <input
                  type="text"
                  className="form-control form-control-cinema"
                  placeholder="Action, Sci-Fi, Adventure"
                  value={movieForm.genres}
                  onChange={(e) => setMovieForm({ ...movieForm, genres: e.target.value })}
                  required
                />
              </div>

              <div className="col-12">
                <label className="form-label text-light small fw-bold text-uppercase">Description / Synopsis *</label>
                <textarea
                  className="form-control form-control-cinema"
                  rows="3"
                  placeholder="Enter detailed plot synopsis..."
                  value={movieForm.description}
                  onChange={(e) => setMovieForm({ ...movieForm, description: e.target.value })}
                  required
                ></textarea>
              </div>

              <div className="col-md-3">
                <label className="form-label text-light small fw-bold text-uppercase">Duration (minutes) *</label>
                <input
                  type="number"
                  className="form-control form-control-cinema"
                  value={movieForm.duration}
                  onChange={(e) => setMovieForm({ ...movieForm, duration: Number(e.target.value) })}
                  required
                />
              </div>

              <div className="col-md-3">
                <label className="form-label text-light small fw-bold text-uppercase">Language *</label>
                <input
                  type="text"
                  className="form-control form-control-cinema"
                  value={movieForm.language}
                  onChange={(e) => setMovieForm({ ...movieForm, language: e.target.value })}
                  required
                />
              </div>

              <div className="col-md-3">
                <label className="form-label text-light small fw-bold text-uppercase">Rating (out of 10)</label>
                <input
                  type="number"
                  step="0.1"
                  min="1"
                  max="10"
                  className="form-control form-control-cinema"
                  value={movieForm.rating}
                  onChange={(e) => setMovieForm({ ...movieForm, rating: Number(e.target.value) })}
                />
              </div>

              <div className="col-md-3">
                <label className="form-label text-light small fw-bold text-uppercase">Director</label>
                <input
                  type="text"
                  className="form-control form-control-cinema"
                  placeholder="e.g. Denis Villeneuve"
                  value={movieForm.director}
                  onChange={(e) => setMovieForm({ ...movieForm, director: e.target.value })}
                />
              </div>

              <div className="col-md-6">
                <label className="form-label text-light small fw-bold text-uppercase">Poster Image URL *</label>
                <input
                  type="url"
                  className="form-control form-control-cinema"
                  placeholder="https://..."
                  value={movieForm.posterUrl}
                  onChange={(e) => setMovieForm({ ...movieForm, posterUrl: e.target.value })}
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="form-label text-light small fw-bold text-uppercase">Banner Image URL (Optional)</label>
                <input
                  type="url"
                  className="form-control form-control-cinema"
                  placeholder="https://..."
                  value={movieForm.bannerUrl}
                  onChange={(e) => setMovieForm({ ...movieForm, bannerUrl: e.target.value })}
                />
              </div>

              {/* Preview Thumbnail if entered */}
              {movieForm.posterUrl && (
                <div className="col-12 mt-2">
                  <span className="text-muted small d-block mb-1">Poster Preview:</span>
                  <img
                    src={movieForm.posterUrl}
                    alt="Preview"
                    className="rounded-3 shadow"
                    style={{ height: '110px', width: '80px', objectFit: 'cover' }}
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                </div>
              )}

              <div className="col-12 mt-4">
                <button type="submit" className="btn btn-cinema-primary px-5 py-2.5 rounded-pill fw-bold" disabled={loading}>
                  {loading ? 'Publishing...' : 'Add Movie to Catalog'}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Tab 2: Schedule Showtime */}
      {activeTab === 'add-showtime' && (
        <div className="glass-panel p-4 p-md-5">
          <h4 className="fw-bold text-white mb-4 d-flex align-items-center gap-2">
            <i className="bi bi-calendar-event text-danger"></i> Schedule Auditorium Showtime
          </h4>
          <form onSubmit={handleShowtimeSubmit}>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label text-light small fw-bold text-uppercase">Select Movie *</label>
                <select
                  className="form-select form-select-cinema"
                  value={showtimeForm.movie}
                  onChange={(e) => setShowtimeForm({ ...showtimeForm, movie: e.target.value })}
                  required
                >
                  {movies.map((m) => (
                    <option key={m._id} value={m._id}>
                      {m.title} ({m.language})
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-6">
                <label className="form-label text-light small fw-bold text-uppercase">Auditorium / Screen Name *</label>
                <input
                  type="text"
                  className="form-control form-control-cinema"
                  placeholder="e.g. IMovies IMAX - Audi 1"
                  value={showtimeForm.theaterName}
                  onChange={(e) => setShowtimeForm({ ...showtimeForm, theaterName: e.target.value })}
                  required
                />
              </div>

              <div className="col-md-4">
                <label className="form-label text-light small fw-bold text-uppercase">Screening Date *</label>
                <input
                  type="date"
                  className="form-control form-control-cinema"
                  value={showtimeForm.date}
                  onChange={(e) => setShowtimeForm({ ...showtimeForm, date: e.target.value })}
                  required
                />
              </div>

              <div className="col-md-4">
                <label className="form-label text-light small fw-bold text-uppercase">Showtime (HH:MM AM/PM) *</label>
                <input
                  type="text"
                  className="form-control form-control-cinema"
                  placeholder="07:00 PM"
                  value={showtimeForm.time}
                  onChange={(e) => setShowtimeForm({ ...showtimeForm, time: e.target.value })}
                  required
                />
              </div>

              <div className="col-md-4">
                <label className="form-label text-light small fw-bold text-uppercase">Base Ticket Price (₹) *</label>
                <input
                  type="number"
                  className="form-control form-control-cinema"
                  value={showtimeForm.ticketPrice}
                  onChange={(e) => setShowtimeForm({ ...showtimeForm, ticketPrice: Number(e.target.value) })}
                  required
                />
              </div>

              <div className="col-12 mt-4">
                <button type="submit" className="btn btn-cinema-primary px-5 py-2.5 rounded-pill fw-bold" disabled={loading}>
                  {loading ? 'Generating...' : 'Generate 48-Seat Layout & Publish Showtime'}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Tab 3: Current Movies Catalog Table */}
      {activeTab === 'manage' && (
        <div className="glass-panel p-4">
          <div className="table-responsive">
            <table className="table table-dark table-hover align-middle mb-0" style={{ background: 'transparent' }}>
              <thead>
                <tr className="border-secondary border-opacity-25 text-muted small text-uppercase">
                  <th>Poster</th>
                  <th>Title</th>
                  <th>Genres</th>
                  <th>Duration</th>
                  <th>Rating</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {movies.map((m) => (
                  <tr key={m._id} className="border-secondary border-opacity-25">
                    <td>
                      <img
                        src={m.posterUrl}
                        alt={m.title}
                        className="rounded"
                        style={{ width: '45px', height: '60px', objectFit: 'cover' }}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=600&q=80';
                        }}
                      />
                    </td>
                    <td className="fw-bold text-white">{m.title}</td>
                    <td className="text-muted small">{m.genres?.join(', ')}</td>
                    <td className="text-light small">{m.duration} mins</td>
                    <td><span className="text-warning fw-bold">★ {m.rating}</span></td>
                    <td className="text-end">
                      <button
                        className="btn btn-outline-danger btn-sm rounded-pill px-3"
                        onClick={() => handleDeleteMovie(m._id)}
                      >
                        <i className="bi bi-trash me-1"></i> Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;
