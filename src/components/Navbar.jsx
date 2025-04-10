import React, { useState } from 'react';

function Navbar() {
  const [isCreatingAccount, setIsCreatingAccount] = useState(false); // State to toggle between login and sign-up

  return (
    <>
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
              data-bs-toggle="modal"
              data-bs-target="#authModal"
            >
              Sign In
            </button>
          </div>
        </div>
      </nav>

      {/* Bootstrap Modal */}
      <div
        className="modal fade"
        id="authModal"
        tabIndex="-1"
        aria-labelledby="authModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="authModalLabel">
                {isCreatingAccount ? 'Create Account' : 'Sign In'}
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              {isCreatingAccount ? (
                <>
                  <div className="mb-3">
                    <label htmlFor="name" className="form-label">
                      Name
                    </label>
                    <input type="text" className="form-control" id="name" />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="surname" className="form-label">
                      Surname
                    </label>
                    <input type="text" className="form-control" id="surname" />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">
                      Email
                    </label>
                    <input type="email" className="form-control" id="email" />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="password" className="form-label">
                      Password
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      id="password"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">
                      Email
                    </label>
                    <input type="email" className="form-control" id="email" />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="password" className="form-label">
                      Password
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      id="password"
                    />
                  </div>
                </>
              )}
            </div>
            <div className="modal-footer">
              {isCreatingAccount ? (
                <button className="btn btn-primary">Create Account</button>
              ) : (
                <button className="btn btn-primary">Sign In</button>
              )}
              <button
                className="btn btn-link"
                onClick={() => setIsCreatingAccount(!isCreatingAccount)}
              >
                {isCreatingAccount
                  ? 'Already have an account? Sign In'
                  : "Don't have an account? Create one"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Navbar;