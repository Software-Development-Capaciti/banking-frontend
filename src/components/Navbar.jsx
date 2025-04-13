function Navbar({ onLogout }) {
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
        {/* Sidebar Toggle Button for Mobile */}
        <button
          className="navbar-toggler d-md-none"
          type="button"
          data-bs-toggle="offcanvas"
          data-bs-target="#sidebar"
          aria-controls="sidebar"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
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
          {/* Icons and User Profile */}
          <div className="d-flex align-items-center">
            <button
              className="btn btn-link text-white me-2"
              style={{ padding: '0', fontSize: '1.1rem' }}
            >
              <i className="bi bi-bell"></i>
            </button>
            <button
              className="btn btn-link text-white me-2 me-lg-3"
              style={{ padding: '0', fontSize: '1.1rem' }}
            >
              <i className="bi bi-gear"></i>
            </button>
            <div className="d-flex align-items-center">
              <div
                className="rounded-circle d-flex align-items-center justify-content-center text-white"
                style={{
                  width: '35px',
                  height: '35px',
                  background: 'linear-gradient(135deg, #00C4B4 0%, #00A3B9 100%)',
                  boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
                  fontSize: '0.9rem',
                }}
              >
                BP
              </div>
              <span className="text-white ms-2 d-none d-lg-block">Chadrack Ndalamba</span>
              <button
                className="btn btn-link text-white ms-2"
                style={{ padding: '0', fontSize: '0.9rem' }}
                onClick={onLogout}
              >
                <i className="bi bi-box-arrow-right"></i> Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;