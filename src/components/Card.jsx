function Card({ type, number, expiry }) {
  return (
    <div
      className="card mb-3"
      style={{
        // Adjustment 1: Set responsive width
        width: '100%',
        maxWidth: '350px', // Matches the VISA card maxWidth for consistency
        margin: '0 auto', // Center the card
        backgroundColor: '#2A3B3C', // Match the dashboard's card background
        border: 'none',
        borderRadius: '15px',
        boxShadow: '0 4px 15px rgba(0,0,0,0.3)', // Match the dashboard's card shadow
      }}
    >
      <div
        className="card-body p-3 p-md-4" // Adjustment 2: Responsive padding
        style={{
          // Adjustment 3: Ensure content doesn't overflow
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem', // Space between elements
        }}
      >
        <h6
          className="card-title text-white mb-0"
          style={{
            // Adjustment 4: Responsive font size
            fontSize: 'clamp(0.9rem, 2vw, 1.1rem)', // Scales between 0.9rem and 1.1rem
          }}
        >
          {type} ending in {number}
        </h6>
        <p
          className="card-text text-muted mb-2"
          style={{
            // Adjustment 5: Responsive font size for expiry
            fontSize: 'clamp(0.8rem, 1.5vw, 0.9rem)', // Scales between 0.8rem and 0.9rem
          }}
        >
          EXP: {expiry}
        </p>
        <button
          className="btn btn-primary w-100" // Adjustment 6: Full width button, removed btn-sm
          style={{
            // Adjustment 7: Ensure button is touch-friendly
            padding: '0.5rem 1rem',
            fontSize: 'clamp(0.8rem, 1.5vw, 0.9rem)', // Scales button text
            maxWidth: '200px', // Prevent button from being too wide
            alignSelf: 'center', // Center the button
          }}
        >
          Set as default
        </button>
      </div>
    </div>
  );
}

export default Card;