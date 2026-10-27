import React from 'react';

const SeatGrid = ({ seats, selectedSeats, onToggleSeat }) => {
  // Rows arranged in standard cinema order
  const rows = ['A', 'B', 'C', 'D', 'E', 'F'];

  const getSeatClasses = (seat) => {
    let base = 'seat-button ';
    if (seat.isReserved) {
      return base + 'seat-reserved';
    }
    if (selectedSeats.some((s) => s.seatNumber === seat.seatNumber)) {
      return base + 'seat-selected';
    }
    if (seat.tier === 'VIP') {
      return base + 'seat-vip';
    }
    if (seat.tier === 'Premium') {
      return base + 'seat-premium';
    }
    return base + 'seat-available';
  };

  const getTierLabel = (rowLetter) => {
    if (rowLetter === 'A' || rowLetter === 'B') return { name: 'VIP Recliner', price: '₹350', color: 'text-warning' };
    if (rowLetter === 'C' || rowLetter === 'D') return { name: 'Premium Executive', price: '₹250', color: 'text-info' };
    return { name: 'Standard Classic', price: '₹180', color: 'text-light' };
  };

  return (
    <div className="seat-grid-container p-4 p-md-5 glass-panel text-center">
      {/* Cinema Screen with Projected Neon Arc */}
      <div className="cinema-screen-wrap">
        <div className="cinema-screen-arc"></div>
        <div className="cinema-light-beam"></div>
        <div className="text-secondary small mt-2 mb-4 text-uppercase tracking-wider fw-semibold d-flex align-items-center justify-content-center gap-2">
          <i className="bi bi-display text-info"></i>
          <span>Curved Laser Cinema Screen This Way</span>
          <i className="bi bi-soundwave text-info"></i>
        </div>
      </div>

      {/* Seating Layout */}
      <div className="d-flex flex-column align-items-center gap-3 overflow-auto py-2">
        {rows.map((rowLetter, rIdx) => {
          const rowSeats = seats.filter((s) => s.row === rowLetter);
          if (!rowSeats.length) return null;
          const tier = getTierLabel(rowLetter);

          // Show tier label header before first row of each tier
          const showTierHeader = rowLetter === 'A' || rowLetter === 'C' || rowLetter === 'E';

          return (
            <React.Fragment key={rowLetter}>
              {showTierHeader && (
                <div className="w-100 d-flex align-items-center justify-content-between px-3 my-2 pt-2 border-top border-secondary border-opacity-25 text-muted small">
                  <span className={`fw-bold text-uppercase ${tier.color}`} style={{ fontSize: '0.75rem', letterSpacing: '0.08em' }}>
                    <i className="bi bi-bookmark-star-fill me-1"></i> {tier.name}
                  </span>
                  <span className="badge bg-dark border border-secondary text-light px-2 py-1" style={{ fontSize: '0.7rem' }}>
                    Base {tier.price}
                  </span>
                </div>
              )}

              <div className="d-flex align-items-center gap-2">
                {/* Row Letter Left */}
                <span className="fw-bold text-muted small" style={{ width: '22px' }}>
                  {rowLetter}
                </span>

                {/* Seats in Row */}
                <div className="d-flex align-items-center">
                  {rowSeats.map((seat, index) => {
                    const isAisle = index === 3; // add aisle space after 4th seat
                    const isSelected = selectedSeats.some((s) => s.seatNumber === seat.seatNumber);

                    return (
                      <React.Fragment key={seat.seatNumber}>
                        <button
                          type="button"
                          className={getSeatClasses(seat)}
                          disabled={seat.isReserved}
                          onClick={() => onToggleSeat(seat)}
                          title={`Seat ${seat.seatNumber} • ${seat.tier} • ₹${seat.price}`}
                          aria-label={`Seat ${seat.seatNumber}`}
                        >
                          {isSelected ? (
                            <i className="bi bi-check-lg fw-bold"></i>
                          ) : seat.isReserved ? (
                            '✕'
                          ) : (
                            seat.seatNumber
                          )}
                        </button>
                        {isAisle && (
                          <div
                            className="d-flex align-items-center justify-content-center text-secondary small opacity-25"
                            style={{ width: '32px' }}
                          >
                            <i className="bi bi-arrow-down-up" style={{ fontSize: '0.65rem' }}></i>
                          </div>
                        )}
                      </React.Fragment>
                    );
                  })}
                </div>

                {/* Row Letter Right */}
                <span className="fw-bold text-muted small" style={{ width: '22px' }}>
                  {rowLetter}
                </span>
              </div>
            </React.Fragment>
          );
        })}
      </div>

      {/* Legend / Key */}
      <div className="mt-5 pt-3 border-top border-secondary border-opacity-25 d-flex flex-wrap justify-content-center gap-4 small text-muted">
        <div className="d-flex align-items-center gap-2">
          <div className="seat-button seat-available m-0" style={{ width: '22px', height: '22px', fontSize: '0.6rem' }}></div>
          <span className="text-light">Available</span>
        </div>
        <div className="d-flex align-items-center gap-2">
          <div className="seat-button seat-selected m-0" style={{ width: '22px', height: '22px', fontSize: '0.6rem' }}>
            <i className="bi bi-check-lg"></i>
          </div>
          <span className="text-success fw-bold">Selected</span>
        </div>
        <div className="d-flex align-items-center gap-2">
          <div className="seat-button seat-reserved m-0" style={{ width: '22px', height: '22px', fontSize: '0.6rem' }}>✕</div>
          <span>Reserved</span>
        </div>
        <div className="d-flex align-items-center gap-2">
          <div className="seat-button seat-vip m-0" style={{ width: '22px', height: '22px', fontSize: '0.6rem' }}></div>
          <span className="text-warning">VIP Recliner (Row A-B)</span>
        </div>
        <div className="d-flex align-items-center gap-2">
          <div className="seat-button seat-premium m-0" style={{ width: '22px', height: '22px', fontSize: '0.6rem' }}></div>
          <span className="text-info">Premium (Row C-D)</span>
        </div>
      </div>
    </div>
  );
};

export default SeatGrid;
