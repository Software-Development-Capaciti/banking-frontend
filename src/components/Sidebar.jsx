import './Sidebar.css';
import { Link, useLocation } from 'react-router-dom';
import {
  House,
  CreditCard,
  ArrowLeftRight,
  Wallet,
  Person,
  ChatDots,
} from 'react-bootstrap-icons';
import { useEffect } from 'react';

function Sidebar() {
  const location = useLocation();

  useEffect(() => {
    // Load Bootstrap's JS if not already available
    if (!window.bootstrap && typeof bootstrap === 'undefined') {
      import('bootstrap');
    }
  }, []);

  const closeOffcanvas = () => {
    const offcanvas = document.getElementById('sidebar');
    const bsOffcanvas = window.bootstrap?.Offcanvas.getInstance(offcanvas);
    if (bsOffcanvas) {
      bsOffcanvas.hide();
    }
  };

  const navItems = [
    { to: '/', label: 'Home', icon: <House className="me-2" /> },
    { to: '/cards', label: 'Cards', icon: <CreditCard className="me-2" /> },
    {
      to: '/transactions',
      label: 'Transactions',
      icon: <ArrowLeftRight className="me-2" />,
    },
    {
      to: '/bank-statement',
      label: 'Bank Statement',
      icon: <Wallet className="me-2" />,
    },
    { to: '/profile', label: 'Profile', icon: <Person className="me-2" /> },
  ];

  const renderNavLinks = (isOffcanvas = false) =>
    navItems.map((item, index) => (
      <li className="nav-item mb-2" key={index}>
        <Link
          to={item.to}
          className="nav-link d-flex align-items-center text-white"
          onClick={isOffcanvas ? closeOffcanvas : null}
          style={{
            background:
              location.pathname === item.to
                ? 'linear-gradient(135deg, #00C4B4 0%, #00A3B9 100%)'
                : 'transparent',
            borderRadius: '10px',
            padding: '10px 15px',
          }}
        >
          {item.icon}
          {item.label}
        </Link>
      </li>
    ));

  return (
    <>
      {/* Offcanvas Sidebar (Mobile) */}
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
          <button
            type="button"
            className="btn-close btn-close-white"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          ></button>
        </div>
        <div className="offcanvas-body d-flex flex-column justify-content-between">
          <ul className="nav flex-column">{renderNavLinks(true)}</ul>
          <div className="p-3">
            <button
              className="btn w-100 text-white"
              style={{
                background: 'linear-gradient(135deg, #00C4B4 0%, #00A3B9 100%)',
                borderRadius: '10px',
                border: 'none',
              }}
            >
              <ChatDots className="me-2" />
              Contact Us
            </button>
          </div>
        </div>
      </div>

      {/* Sidebar for Desktop */}
      <div
        className="d-none d-md-block position-fixed"
        style={{
          backgroundColor: '#1A2526',
          width: '190px',
          height: '100vh',
          padding: '20px',
          marginTop: '84px',
        }}
      >
        <h5 className="text-white mb-4">DevBank</h5>
        <ul className="nav flex-column">{renderNavLinks()}</ul>
        <div className="mt-auto position-absolute bottom-0 start-0 p-3 w-100">
          <button
            className="btn w-100 text-white"
            style={{
              background: 'linear-gradient(135deg, #00C4B4 0%, #00A3B9 100%)',
              borderRadius: '10px',
              border: 'none',
            }}
          >
            <ChatDots className="me-2" />
            Contact Us
          </button>
        </div>
      </div>
    </>
  );
}

export default Sidebar;
