import React from 'react';
import { Link } from 'react-router-dom';

const MovieCard = ({ movie }) => {
  return (
    <div className="col-12 col-sm-6 col-md-4 col-lg-3">
      <div className="movie-card h-100 d-flex flex-column">
        {/* Poster Wrapper with Zoom effect and badges */}
        <div className="poster-wrapper">
          <img
            src={movie.posterUrl || 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=600&q=80'}
            alt={movie.title}
            className="poster-img"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=600&q=80';
            }}
          />
          <div className="poster-overlay"></div>

          {/* Rating Badge */}
          <div
            className="position-absolute top-0 end-0 m-3 px-2.5 py-1 rounded-pill d-flex align-items-center gap-1.5 shadow-lg"
            style={{
              backgroundColor: 'rgba(7, 10, 18, 0.85)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(245, 158, 11, 0.5)',
            }}
          >
            <i className="bi bi-star-fill text-warning" style={{ fontSize: '0.8rem' }}></i>
            <span className="text-white fw-bold small">{movie.rating ? movie.rating.toFixed(1) : '8.0'}</span>
          </div>

          {/* Language & Experience Pill */}
          <div className="position-absolute bottom-0 start-0 m-3 d-flex gap-2">
            <span
              className="px-2.5 py-1 rounded-pill fw-semibold shadow"
              style={{
                backgroundColor: 'rgba(7, 10, 18, 0.85)',
                color: '#38bdf8',
                fontSize: '0.72rem',
                border: '1px solid rgba(56, 189, 248, 0.35)',
                backdropFilter: 'blur(8px)',
              }}
            >
              {movie.language}
            </span>
            <span
              className="px-2.5 py-1 rounded-pill fw-semibold shadow"
              style={{
                backgroundColor: 'rgba(225, 29, 72, 0.85)',
                color: '#ffffff',
                fontSize: '0.72rem',
                backdropFilter: 'blur(8px)',
              }}
            >
              IMAX 3D
            </span>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-3.5 d-flex flex-column flex-grow-1" style={{ background: '#0e1526' }}>
          <h5 className="text-white fw-bold text-truncate mb-1" title={movie.title}>
            {movie.title}
          </h5>

          {/* Genres Chips */}
          <div className="d-flex flex-wrap gap-1.5 mb-2.5">
            {movie.genres && movie.genres.slice(0, 3).map((genre, idx) => (
              <span
                key={idx}
                className="badge px-2 py-1 rounded-2 text-muted"
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  fontSize: '0.68rem',
                  fontWeight: 500,
                }}
              >
                {genre}
              </span>
            ))}
          </div>

          {/* Runtime & Format Specs */}
          <div className="d-flex align-items-center justify-content-between text-muted small mb-3">
            <div className="d-flex align-items-center gap-1.5">
              <i className="bi bi-clock text-danger"></i>
              <span>{movie.duration} mins</span>
            </div>
            <div className="d-flex align-items-center gap-1 text-secondary" style={{ fontSize: '0.72rem' }}>
              <i className="bi bi-soundwave"></i>
              <span>Dolby 7.1</span>
            </div>
          </div>

          {/* Action CTA */}
          <div className="mt-auto pt-1">
            <Link
              to={`/movie/${movie._id}`}
              className="btn btn-cinema-primary w-100 rounded-pill py-2.5 d-flex align-items-center justify-content-center gap-2 small"
            >
              <i className="bi bi-ticket-perforated-fill"></i>
              <span>Book Showtimes</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
