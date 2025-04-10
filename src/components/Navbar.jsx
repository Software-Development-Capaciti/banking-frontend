import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation

function Navbar() {
  const navigate = useNavigate(); // Initialize navigate hook

  // Function to handle button click and redirect
  const handleSignInClick = () => {
    navigate('/signin'); // Redirect to the sign-in page
  };

  return (
    <nav
      className="navbar navbar-expand-lg"
      style={{
        backgroundColor: 'rgba(26, 37, 38, 0.9)',
        borderBottom: 'none',
        padding: '10px 15px',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        height: '80px',
      }}
    >
      <div className="container-fluid">
        <span className="navbar-brand text-white fw-bold">DevBank</span>
        <div className="d-flex align-items-center">
          {/* Search Bar */}
          <form className="d-none d-md-flex me-3 position-relative">
            <input
              className="form-control"
              type="search"
              placeholder="Search Something..."
              aria-label="Search"
              style={{
                backgroundColor: '#3A4B4C',
                border: '1px solid #00C4B4',
                color: '#fff',
                borderRadius: '10px',
                padding: '8px 35px 8px 12px',
                boxShadow: '0 2px 5px rgba(0,0,0,0.3)',
                width: '200px',
                fontSize: '0.85rem',
              }}
            />
            <i
              className="bi bi-search position-absolute"
              style={{
                right: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#00C4B4',
                fontSize: '0.9rem',
              }}
            ></i>
          </form>
          {/* Sign In Button */}
          <button
            className="btn btn-primary text-white"
            style={{
              backgroundColor: '#00C4B4',
              border: 'none',
              borderRadius: '5px',
              padding: '8px 15px',
              fontSize: '1rem',
            }}
            onClick={handleSignInClick} // Add onClick event
          >
            Sign In
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;