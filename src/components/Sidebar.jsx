import { Link, useLocation } from 'react-router-dom';
import { House, CreditCard, ArrowLeftRight, Wallet, Person, ChatDots, Gear } from 'react-bootstrap-icons';

function Sidebar() {
  const location = useLocation();

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
            BamBank
          </h5>
          <button type="button" className="btn-close btn-close-white" data-bs-dismiss="offcanvas" aria-label="Close"></button>
        </div>
        <div className="offcanvas-body">
          <ul className="nav flex-column">
            <li className="nav-item mb-2">
              <Link
                to="/"
                className="nav-link d-flex align-items-center text-white"
                data-bs-dismiss="offcanvas"
                style={{
                  background: location.pathname === '/' ? 'linear-gradient(135deg, #00C4B4 0%, #00A3B9 100%)' : 'transparent',
                  borderRadius: '10px',
                  padding: '10px 15px'
                }}
              >
                <House className="me-2" />
                Overview
              </Link>
            </li>
            <li className="nav-item mb-2">
              <Link
                to="/cards"
                className="nav-link d-flex align-items-center text-white"
                data-bs-dismiss="offcanvas"
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
                data-bs-dismiss="offcanvas"
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
                to="/payments"
                className="nav-link d-flex align-items-center text-white"
                data-bs-dismiss="offcanvas"
                style={{
                  background: location.pathname === '/payments' ? 'linear-gradient(135deg, #00C4B4 0%, #00A3B9 100%)' : 'transparent',
                  borderRadius: '10px',
                  padding: '10px 15px'
                }}
              >
                <Wallet className="me-2" />
                Payments
              </Link>
            </li>
            <li className="nav-item mb-2">
              <Link
                to="/profile"
                className="nav-link d-flex align-items-center text-white"
                data-bs-dismiss="offcanvas"
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

      {/* Sidebar for Desktop - remains unchanged */}
      <div
        className="d-none d-md-block"
        style={{
          width: '189px',
          height: 'calc(100vh - 60px)',
          backgroundColor: '#1A2526',
          borderRight: 'none',
          position: 'fixed',
          top: '84px',
          left: 0
        }}
      >
        <div
          className="p-3 pt-4 pt-md-3 pt-lg-4"
          style={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}
        >
          <div>
            <h5 className="text-white" style={{ fontSize: '1.2rem' }}>
              DevBank
            </h5>
            <ul className="nav flex-column mt-4">
              <li className="nav-item mb-2">
                <Link
                  to="/"
                  className="nav-link d-flex align-items-center text-white"
                  style={{
                    background: location.pathname === '/' ? 'linear-gradient(135deg, #00C4B4 0%, #00A3B9 100%)' : 'transparent',
                    borderRadius: '10px',
                    padding: '8px 10px',
                    fontSize: '0.9rem',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}
                >
                  <House className="me-1" style={{ fontSize: '1.1rem' }} />
                  Overview
                </Link>
              </li>
              <li className="nav-item mb-2">
                <Link
                  to="/cards"
                  className="nav-link d-flex align-items-center text-white"
                  style={{
                    background: location.pathname === '/cards' ? 'linear-gradient(135deg, #00C4B4 0%, #00A3B9 100%)' : 'transparent',
                    borderRadius: '10px',
                    padding: '8px 10px',
                    fontSize: '0.9rem',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}
                >
                  <CreditCard className="me-1" style={{ fontSize: '1.1rem' }} />
                  Cards
                </Link>
              </li>
              <li className="nav-item mb-2">
                <Link
                  to="/transactions"
                  className="nav-link d-flex align-items-center text-white"
                  style={{
                    background: location.pathname === '/transactions' ? 'linear-gradient(135deg, #00C4B4 0%, #00A3B9 100%)' : 'transparent',
                    borderRadius: '10px',
                    padding: '8px 10px',
                    fontSize: '0.9rem',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}
                >
                  <ArrowLeftRight className="me-1" style={{ fontSize: '1.1rem' }} />
                  Transactions
                </Link>
              </li>
              <li className="nav-item mb-2">
                <Link
                  to="/payments"
                  className="nav-link d-flex align-items-center text-white"
                  style={{
                    background: location.pathname === '/payments' ? 'linear-gradient(135deg, #00C4B4 0%, #00A3B9 100%)' : 'transparent',
                    borderRadius: '10px',
                    padding: '8px 10px',
                    fontSize: '0.9rem',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}
                >
                  <Wallet className="me-1" style={{ fontSize: '1.1rem' }} />
                  Payments
                </Link>
              </li>
              <li className="nav-item mb-2">
                <Link
                  to="/profile"
                  className="nav-link d-flex align-items-center text-white"
                  style={{
                    background: location.pathname === '/profile' ? 'linear-gradient(135deg, #00C4B4 0%, #00A3B9 100%)' : 'transparent',
                    borderRadius: '10px',
                    padding: '8px 10px',
                    fontSize: '0.9rem',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}
                >
                  <Person className="me-1" style={{ fontSize: '1.1rem' }} />
                  Profile
                </Link>
              </li>
            </ul>
          </div>
          <div className="p-3">
            <button
              className="btn w-100 text-white"
              style={{
                background: 'linear-gradient(135deg, #00C4B4 0%, #00A3B9 100%)',
                borderRadius: '10px',
                border: 'none',
                fontSize: '0.9rem',
                padding: '10px',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}
            >
              <ChatDots className="me-2" style={{ fontSize: '1rem' }} />
              Contact Us
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Sidebar;