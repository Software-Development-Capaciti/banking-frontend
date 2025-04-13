import { Link } from 'react-router-dom';

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

        {/* Logo linking to Home */}
        <Link to="/" className="navbar-brand text-white fw-bold">
          DevBank
        </Link>

        <div className="d-flex align-items-center">
          {/* Icons and User Profile */}
          <div className="d-flex align-items-center">
            {/* Optional Icons & Profile */}
            {/* <button className="btn btn-link text-white me-2" style={{ padding: '0', fontSize: '1.1rem' }}>
              <i className="bi bi-bell"></i>
            </button>
            <button className="btn btn-link text-white me-2 me-lg-3" style={{ padding: '0', fontSize: '1.1rem' }}>
              <i className="bi bi-gear"></i>
            </button> */}
            {/* <div className="rounded-circle d-flex align-items-center justify-content-center text-white" style={{
              width: '35px',
              height: '35px',
              background: 'linear-gradient(135deg, #00C4B4 0%, #00A3B9 100%)',
              boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
              fontSize: '0.9rem',
            }}>
              BP
            </div>
            <span className="text-white ms-2 d-none d-lg-block">Chadrack Ndalamba</span> */}

            {/* Logout Button */}
            <button
              className="btn ms-3 text-white fw-semibold"
              style={{
                background: 'linear-gradient(135deg, #00C4B4 0%, #00A3B9 100%)',
                border: 'none',
                borderRadius: '10px',
                padding: '6px 15px',
                fontSize: '0.85rem',
                boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                transition: 'all 0.3s ease',
              }}
              onClick={onLogout}
            >
              <i className="bi bi-box-arrow-right me-1"></i> Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
