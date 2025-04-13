import { Link, useLocation } from 'react-router-dom';
import { House, CreditCard, ArrowLeftRight, Wallet, Person, ChatDots } from 'react-bootstrap-icons';

function Sidebar() {
  const location = useLocation();

  const closeOffcanvas = () => {
    const offcanvas = document.getElementById('sidebar');
    const bsOffcanvas = bootstrap.Offcanvas.getInstance(offcanvas);
    if (bsOffcanvas) {
      bsOffcanvas.hide();
    }
  };

  return (
    <>
      {/* Offcanvas Sidebar for Mobile */}
      <div
        className="offcanvas offcanvas-start"
        tabIndex="-1"
        id="sidebar"
        aria-labelledby="sidebarLabel"
        style={{ backgroundColor: '#1A2526', width: '250px' }}
      >
        <div className="offcanvas-header">
          <h5 className="offcanvas-title text-white" id="sidebarLabel">
            DevBank
          </h5>
          <button type="button" className="btn-close btn-close-white" data-bs-dismiss="offcanvas" aria-label="Close"></button>
        </div>
        <div className="offcanvas-body">
          <ul className="nav flex-column">
            <li className="nav-item mb-2">
              <Link
                to="/"
                className="nav-link d-flex align-items-center text-white"
                onClick={closeOffcanvas}
                style={{
                  background: location.pathname === '/' ? 'linear-gradient(135deg, #00C4B4 0%, #00A3B9 100%)' : 'transparent',
                  borderRadius: '10px',
                  padding: '10px 15px'
                }}
              >
                <House className="me-2" />
                Home
              </Link>
            </li>
            <li className="nav-item mb-2">
              <Link
                to="/cards"
                className="nav-link d-flex align-items-center text-white"
                onClick={closeOffcanvas}
                style={{
                  background: location.pathname === '/cards' ? 'linear-gradient(135deg, #00C4B4 0%, #00A3B9 100%)' : 'transparent',
                  borderRadius: '10px',
                  padding: '10px 15px'
                }}
              >
                <CreditCard className="me-2" />
                Cards
              </Link>
            </li>
            <li className="nav-item mb-2">
              <Link
                to="/transactions"
                className="nav-link d-flex align-items-center text-white"
                onClick={closeOffcanvas}
                style={{
                  background: location.pathname === '/transactions' ? 'linear-gradient(135deg, #00C4B4 0%, #00A3B9 100%)' : 'transparent',
                  borderRadius: '10px',
                  padding: '10px 15px'
                }}
              >
                <ArrowLeftRight className="me-2" />
                Transactions
              </Link>
            </li>
            <li className="nav-item mb-2">
              <Link
                to="/bank-statement"
                className="nav-link d-flex align-items-center text-white"
                onClick={closeOffcanvas}
                style={{
                  background: location.pathname === '/bank-statement' ? 'linear-gradient(135deg, #00C4B4 0%, #00A3B9 100%)' : 'transparent',
                  borderRadius: '10px',
                  padding: '10px 15px'
                }}
              >
                <Wallet className="me-2" />
                Bank Statement
              </Link>
            </li>
            <li className="nav-item mb-2">
              <Link
                to="/profile"
                className="nav-link d-flex align-items-center text-white"
                onClick={closeOffcanvas}
                style={{
                  background: location.pathname === '/profile' ? 'linear-gradient(135deg, #00C4B4 0%, #00A3B9 100%)' : 'transparent',
                  borderRadius: '10px',
                  padding: '10px 15px'
                }}
              >
                <Person className="me-2" />
                Profile
              </Link>
            </li>
          </ul>
          <div className="position-absolute bottom-0 start-0 p-3 w-100">
            <button
              className="btn w-100 text-white"
              style={{
                background: 'linear-gradient(135deg, #00C4B4 0%, #00A3B9 100%)',
                borderRadius: '10px',
                border: 'none'
              }}
            >
              <ChatDots className="me-2" />
              Contact Us
            </button>
          </div>
        </div>
      </div>

      {/* Desktop Sidebar remains unchanged */}
      {/* ... existing desktop sidebar code ... */}
    </>
  );
}

export default Sidebar;