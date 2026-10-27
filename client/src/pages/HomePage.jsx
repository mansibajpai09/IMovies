import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MovieCard from '../components/MovieCard';

const genresList = ['All', 'Action', 'Sci-Fi', 'Drama', 'Adventure', 'Animation', 'Biography', 'Fantasy'];
const languagesList = ['All', 'English', 'Hindi', 'Tamil', 'Telugu'];

const HomePage = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [selectedLanguage, setSelectedLanguage] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('rating');

  useEffect(() => {
    fetchMovies();
  }, [selectedGenre, selectedLanguage]);

  const fetchMovies = async () => {
    setLoading(true);
    try {
      const params = {};
      if (selectedGenre !== 'All') params.genre = selectedGenre;
      if (selectedLanguage !== 'All') params.language = selectedLanguage;
      if (searchTerm.trim()) params.search = searchTerm.trim();

      const response = await axios.get('/api/movies', { params });
      if (response.data.success) {
        setMovies(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching movies:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchMovies();
  };

  // Sort movies client side
  const sortedMovies = [...movies].sort((a, b) => {
    if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
    if (sortBy === 'duration') return (b.duration || 0) - (a.duration || 0);
    if (sortBy === 'title') return a.title.localeCompare(b.title);
    return 0;
  });

  // Pick first movie as hero feature
  const heroMovie = movies.length > 0 ? movies[0] : null;

  return (
    <div className="container py-4">
      {/* Featured Hero Showcase */}
      {heroMovie && (
        <div
          className="hero-banner-cinema mb-5 p-4 p-md-5 d-flex align-items-center"
          style={{
            backgroundImage: `url(${heroMovie.bannerUrl || heroMovie.posterUrl})`,
          }}
        >
          <div className="hero-overlay-gradient"></div>

          <div className="position-relative z-1 text-white col-lg-7 col-md-10">
            <div className="d-flex align-items-center gap-2 mb-3">
              <span className="badge bg-danger px-3 py-1.5 rounded-pill fw-bold small shadow">
                <i className="bi bi-fire me-1"></i> BLOCKBUSTER OF THE WEEK
              </span>
              <span className="badge bg-dark bg-opacity-75 border border-secondary px-3 py-1.5 rounded-pill small">
                {heroMovie.language} • {heroMovie.duration}m
              </span>
            </div>

            <h1 className="display-3 fw-extrabold mb-3 tracking-tight lh-sm">
              {heroMovie.title}
            </h1>

            <div className="d-flex flex-wrap gap-2 mb-3">
              {heroMovie.genres?.map((g, idx) => (
                <span key={idx} className="badge bg-white bg-opacity-10 text-light px-2.5 py-1 rounded-pill small">
                  {g}
                </span>
              ))}
            </div>

            <p className="lead text-light text-opacity-75 mb-4 line-clamp-3" style={{ fontSize: '1.05rem', maxWidth: '650px' }}>
              {heroMovie.description}
            </p>

            <div className="d-flex flex-wrap align-items-center gap-3">
              <a href="#now-showing" className="btn btn-cinema-primary btn-lg rounded-pill px-4 py-2.5 d-flex align-items-center gap-2">
                <i className="bi bi-ticket-perforated-fill fs-5"></i>
                <span>Reserve Cinema Seats</span>
              </a>

              <a
                href={`/movie/${heroMovie._id}`}
                className="btn btn-cinema-outline btn-lg rounded-pill px-4 py-2.5 d-flex align-items-center gap-2"
              >
                <i className="bi bi-info-circle"></i>
                <span>Movie Details</span>
              </a>

              <div className="d-flex align-items-center gap-2 text-warning fw-bold fs-5 ms-md-2">
                <i className="bi bi-star-fill text-warning"></i>
                <span className="text-white">{heroMovie.rating.toFixed(1)} <small className="text-muted fw-normal">/ 10</small></span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Formats Highlight Cards */}
      <div className="row g-3 mb-5">
        {[
          { title: 'IMAX Laser 3D', desc: 'Next-gen dual 4K laser projection', icon: 'bi-display', color: 'text-info' },
          { title: 'Dolby Atmos 7.1', desc: 'Multidimensional overhead acoustics', icon: 'bi-speaker', color: 'text-danger' },
          { title: '4DX Motion Seats', desc: 'Sync sensory cinema effects', icon: 'bi-joystick', color: 'text-warning' },
          { title: 'VIP Recliner Lounge', desc: 'Full-plush motorized seating & dine-in', icon: 'bi-gem', color: 'text-success' },
        ].map((feat, i) => (
          <div key={i} className="col-6 col-lg-3">
            <div className="glass-panel p-3 h-100 d-flex align-items-center gap-3">
              <div className={`fs-2 ${feat.color}`}>
                <i className={`bi ${feat.icon}`}></i>
              </div>
              <div>
                <h6 className="fw-bold text-white mb-0 small">{feat.title}</h6>
                <div className="text-muted" style={{ fontSize: '0.72rem' }}>{feat.desc}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filter and Search Section */}
      <div id="now-showing" className="pt-2">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end gap-3 mb-4">
          <div>
            <div className="d-flex align-items-center gap-2 mb-1">
              <span className="p-1 bg-danger rounded-circle d-inline-block"></span>
              <span className="text-danger fw-bold small text-uppercase tracking-wider">In Theaters Now</span>
            </div>
            <h2 className="fw-extrabold text-white mb-1">
              Explore Now Showing Movies
            </h2>
            <p className="text-muted small mb-0">Select your preferred movie and experience best-in-class cinema acoustics.</p>
          </div>

          {/* Search bar & Sort */}
          <div className="d-flex flex-wrap gap-2 align-items-center">
            <form onSubmit={handleSearchSubmit} className="d-flex gap-2">
              <div className="input-group">
                <span className="input-group-text bg-dark border-secondary text-secondary">
                  <i className="bi bi-search"></i>
                </span>
                <input
                  type="text"
                  className="form-control form-control-cinema"
                  style={{ minWidth: '220px' }}
                  placeholder="Search movie title..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <button
                    className="btn btn-dark border-secondary text-muted"
                    type="button"
                    onClick={() => { setSearchTerm(''); fetchMovies(); }}
                  >
                    <i className="bi bi-x-lg"></i>
                  </button>
                )}
              </div>
              <button className="btn btn-cinema-primary rounded-3 px-3" type="submit">
                Find
              </button>
            </form>

            <select
              className="form-select form-select-cinema"
              style={{ width: 'auto' }}
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="rating">Top Rated</option>
              <option value="duration">Shortest First</option>
              <option value="title">Alphabetical (A-Z)</option>
            </select>
          </div>
        </div>

        {/* Filter Pills Bar */}
        <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4 pb-2 border-bottom border-secondary border-opacity-25">
          {/* Genre Chips */}
          <div className="d-flex flex-wrap gap-2">
            {genresList.map((g) => (
              <button
                key={g}
                type="button"
                className={`btn btn-sm rounded-pill px-3 py-1.5 transition ${
                  selectedGenre === g
                    ? 'btn-danger fw-bold shadow'
                    : 'btn-cinema-outline text-light small'
                }`}
                onClick={() => setSelectedGenre(g)}
              >
                {g}
              </button>
            ))}
          </div>

          {/* Language filter pills */}
          <div className="d-flex align-items-center gap-1">
            <span className="text-muted small me-1">Language:</span>
            {languagesList.map((lang) => (
              <button
                key={lang}
                type="button"
                className={`btn btn-sm px-2.5 py-1 rounded-pill ${
                  selectedLanguage === lang
                    ? 'btn-info text-dark fw-bold'
                    : 'btn-outline-secondary text-muted border-0'
                }`}
                style={{ fontSize: '0.75rem' }}
                onClick={() => setSelectedLanguage(lang)}
              >
                {lang}
              </button>
            ))}
          </div>
        </div>

        {/* Movies Grid */}
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-danger" style={{ width: '3rem', height: '3rem' }} role="status">
              <span className="visually-hidden">Loading movies...</span>
            </div>
            <p className="text-muted mt-3">Fetching scheduled movies & screenings...</p>
          </div>
        ) : sortedMovies.length > 0 ? (
          <div className="row g-4 mb-5">
            {sortedMovies.map((movie) => (
              <MovieCard key={movie._id} movie={movie} />
            ))}
          </div>
        ) : (
          <div className="text-center py-5 glass-panel p-5 my-4">
            <div className="rounded-circle bg-danger bg-opacity-10 d-inline-flex p-4 text-danger mb-3">
              <i className="bi bi-camera-reels fs-1"></i>
            </div>
            <h4 className="text-white mt-1">No movies match your filters</h4>
            <p className="text-muted">Try switching genres or clearing your search term.</p>
            <button
              className="btn btn-cinema-primary rounded-pill px-4 mt-2"
              onClick={() => {
                setSelectedGenre('All');
                setSelectedLanguage('All');
                setSearchTerm('');
              }}
            >
              Reset Filters & Show All
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
