import { useEffect, useState, useCallback } from 'react';

// Local storage keys from Transactions.jsx
const STORAGE_KEYS = {
  TRANSACTIONS: 'banking_transactions',
  ACCOUNT_BALANCES: 'banking_account_balances',
  USER: 'banking_user',
};

function Dashboard() {
  const [dashboardData, setDashboardData] = useState({
    creditLimit: 0,
    spend: 0,
    totalRevenue: 0,
    payments: [],
  });
  const [error, setError] = useState(null);
  const [userName, setUserName] = useState('User Name');

  // Format amount in ZAR
  const formatAmount = (amount) => {
    if (!amount && amount !== 0) return 'R0.00';
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
    }).format(amount);
  };

  // Load data from localStorage
  const loadData = useCallback(() => {
    try {
      // Load user name
      const savedUser = localStorage.getItem(STORAGE_KEYS.USER);
      if (savedUser) {
        setUserName(savedUser);
      } else {
        localStorage.setItem(STORAGE_KEYS.USER, 'User Name');
      }

      // Load account balances
      const savedBalances = localStorage.getItem(STORAGE_KEYS.ACCOUNT_BALANCES);
      let accountBalances = { current: 0, savings: 0 };
      if (savedBalances) {
        accountBalances = JSON.parse(savedBalances);
      }

      // Load transactions
      const savedTransactions = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
      let transactions = [];
      if (savedTransactions) {
        transactions = JSON.parse(savedTransactions);
      }

      // Calculate spend
      const spend = transactions
        .filter(
          (t) => t.accountType === 'current' && (t.type === 'debit' || t.type === 'withdrawal')
        )
        .reduce((sum, t) => sum + (t.amount || 0), 0);

      // Calculate totalRevenue
      const totalRevenue = transactions
        .filter(
          (t) => t.accountType === 'current' && (t.type === 'credit' || t.type === 'deposit')
        )
        .reduce((sum, t) => sum + (t.amount || 0), 0);

      // Map transactions to payments
      const payments = transactions
        .filter((t) => t.accountType === 'current')
        .map((t) => ({
          user: t.description || 'Unknown',
          date: t.date ? new Date(t.date).toISOString().split('T')[0] : 'Unknown',
          amount: t.amount || 0,
        }))
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 5);

      // Update state
      setDashboardData({
        creditLimit: accountBalances.current || 0,
        spend: spend || 0,
        totalRevenue: totalRevenue || accountBalances.current || 0,
        payments,
      });

      setError(null);
    } catch (err) {
      console.error('Error loading data from localStorage:', err);
      setError('Failed to load dashboard data.');
    }
  }, []);

  // Initial load and setup listeners
  useEffect(() => {
    // Load data on mount
    loadData();

    // Listen for storage events (cross-tab updates)
    const handleStorageChange = (e) => {
      if (
        e.key === STORAGE_KEYS.TRANSACTIONS ||
        e.key === STORAGE_KEYS.ACCOUNT_BALANCES ||
        e.key === STORAGE_KEYS.USER
      ) {
        loadData();
      }
    };
    window.addEventListener('storage', handleStorageChange);

    // Poll for same-tab updates
    const intervalId = setInterval(loadData, 1000); // Check every 1 second

    // Cleanup
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(intervalId);
    };
  }, [loadData]);

  // Define the three card types
  const cardTypes = [
    { type: 'CREDIT', label: 'Credit Card' },
    { type: 'DEBIT', label: 'Debit Card' },
    { type: 'VIRTUAL', label: 'Virtual Card' },
  ];

  if (error) {
    return (
      <div
        className="p-4"
        style={{
          backgroundColor: '#1A2526',
          minHeight: 'calc(100vh - 60px)',
          color: 'white',
        }}
      >
        <div className="text-danger">{error}</div>
      </div>
    );
  }

  return (
    <div
      className="p-4 p-md-3 p-lg-4"
      style={{
        backgroundColor: '#1A2526',
        minHeight: 'calc(100vh - 60px)',
        marginLeft: window.innerWidth < 768 ? '0' : '170px',
        paddingTop: '60px',
        overflowY: 'auto',
        boxSizing: 'border-box',
        width: window.innerWidth < 768 ? '100%' : 'calc(100% - 150px)',
        position: 'relative',
      }}
    >
      {/* Cards Section (VISA Cards) */}
      <div className="row mb-4">
        {cardTypes.map((card, index) => (
          <div className="col-12 col-md-4 mb-3" key={index}>
            <div
              className="visa-card text-white"
              style={{
                width: '100%',
                maxWidth: '343px',
                height: '226px',
                margin: '0 auto',
              }}
            >
              <style>{`
                .visa-card,
                .visa-card__chip {
                  overflow: hidden;
                  position: relative;
                }

                .visa-card,
                .visa-card__chip-texture,
                .visa-card__texture {
                  animation-duration: 3s;
                  animation-timing-function: ease-in-out;
                  animation-iteration-count: infinite;
                }

                .visa-card {
                  animation-name: rotate_500;
                  background-color: #1a1a2e;
                  background-image: radial-gradient(circle at 100% 0%,hsla(0,0%,100%,0.08) 29.5%,hsla(0,0%,100%,0) 30%),
                    radial-gradient(circle at 100% 0%,hsla(0,0%,100%,0.08) 39.5%,hsla(0,0%,100%,0) 40%),
                    radial-gradient(circle at 100% 0%,hsla(0,0%,100%,0.08) 49.5%,hsla(0,0%,100%,0) 50%);
                  border-radius: 0.5em;
                  box-shadow: 0 0 0 hsl(0,0%,80%),
                    0 0 0 hsl(0,0%,100%),
                    -0.2rem 0 0.75rem 0 hsla(0,0%,0%,0.3);
                  color: hsl(0,0%,100%);
                  width: 100%;
                  height: 100%;
                  transform: translate3d(0,0,0);
                }

                .visa-card__info {
                  font: 0.9em/1.2 "DM Sans", sans-serif;
                  display: flex;
                  flex-wrap: wrap;
                  padding: 1rem;
                  position: absolute;
                  inset: 0;
                }

                .visa-card__logo,
                .visa-card__number {
                  width: 100%;
                }

                .visa-card__logo {
                  font-weight: bold;
                  font-style: italic;
                  font-size: 1.5em;
                  color: #ffffff;
                  margin-bottom: 0.5rem;
                }

                .visa-card__chip {
                  background-image: linear-gradient(hsl(0,0%,70%),hsl(0,0%,80%));
                  border-radius: 0.2rem;
                  box-shadow: 0 0 0 0.05rem hsla(0,0%,0%,0.5) inset;
                  width: 1.5rem;
                  height: 1.5rem;
                  transform: translate3d(0,0,0);
                  margin: 0.5rem 0;
                }

                .visa-card__chip-lines {
                  width: 100%;
                  height: auto;
                }

                .visa-card__chip-texture {
                  background-image: linear-gradient(-80deg,hsla(0,0%,100%,0),hsla(0,0%,100%,0.6) 48% 52%,hsla(0,0%,100%,0));
                }

                .visa-card__type {
                  align-self: flex-end;
                  margin-left: auto;
                  font-size: 1em;
                  color: #e0e0e0;
                  text-transform: uppercase;
                }

                .visa-card__number {
                  font-size: 1.1em;
                  display: flex;
                  justify-content: space-between;
                  color: #ffffff;
                  font-family: "Courier Prime", monospace;
                  margin: 0.5rem 0;
                }

                .visa-card__valid-thru,
                .visa-card__exp-date,
                .visa-card__name {
                  text-transform: uppercase;
                  color: #ffffff;
                }

                .visa-card__valid-thru,
                .visa-card__exp-date {
                  margin-bottom: 0.5rem;
                  width: 50%;
                }

                .visa-card__valid-thru {
                  font-size: 0.6em;
                  padding-right: 0.5rem;
                  text-align: right;
                }

                .visa-card__exp-date {
                  font-size: 0.8em;
                  padding-left: 0.5rem;
                }

                .visa-card__name {
                  font-size: 1em;
                  font-family: "DM Sans", sans-serif;
                  overflow: hidden;
                  white-space: nowrap;
                  text-overflow: ellipsis;
                  width: 100%;
                  max-width: 200px;
                }

                .visa-card__vendor {
                  position: absolute;
                  right: 0.5rem;
                  bottom: 0.5rem;
                  width: 2.75rem;
                  height: 1.75rem;
                }

                .visa-card__vendor:before,
                .visa-card__vendor:after {
                  border-radius: 50%;
                  content: "";
                  display: block;
                  top: 0;
                  width: 1.75rem;
                  height: 1.75rem;
                }

                .visa-card__vendor:before {
                  background-color: #1a2a6c;
                  left: 0;
                }

                .visa-card__vendor:after {
                  background-color: #b21f1f;
                  box-shadow: -1.2rem 0 0 #f5f5f5 inset;
                  right: 0;
                }

                .visa-card__vendor-sr {
                  clip: rect(1px,1px,1px,1px);
                  overflow: hidden;
                  position: absolute;
                  width: 1px;
                  height: 1px;
                }

                .visa-card__texture {
                  animation-name: texture;
                  background-image: linear-gradient(-80deg,hsla(0,0%,100%,0.2) 25%,hsla(0,0%,100%,0) 45%);
                  top: 0;
                  left: 0;
                  width: 200%;
                  height: 100%;
                }

                @keyframes rotate_500 {
                  from, to {
                    animation-timing-function: ease-in;
                    box-shadow: 0 0 0 hsl(0,0%,80%),
                      0.1rem 0 0 hsl(0,0%,100%),
                      -0.2rem 0 0.75rem 0 hsla(0,0%,0%,0.3);
                    transform: rotateY(-10deg);
                  }

                  25%, 75% {
                    animation-timing-function: ease-out;
                    box-shadow: 0 0 0 hsl(0,0%,80%),
                      0 0 0 hsl(0,0%,100%),
                      -0.25rem -0.05rem 1rem 0.15rem hsla(0,0%,0%,0.3);
                    transform: rotateY(0deg);
                  }

                  50% {
                    animation-timing-function: ease-in;
                    box-shadow: -0.1rem 0 0 hsl(0,0%,80%),
                      0 0 0 hsl(0,0%,100%),
                      -0.3rem -0.1rem 1.5rem 0.3rem hsla(0,0%,0%,0.3);
                    transform: rotateY(10deg);
                  }
                }

                @keyframes texture {
                  from, to {
                    transform: translate3d(0,0,0);
                  }

                  50% {
                    transform: translate3d(-50%,0,0);
                  }
                }
              `}</style>

              <div className="visa-card__info">
                <div className="visa-card__logo">VISA</div>
                <div className="visa-card__chip">
                  <svg
                    className="visa-card__chip-lines"
                    role="img"
                    width="24px"
                    height="24px"
                    viewBox="0 0 100 100"
                    aria-label="Chip"
                  >
                    <g opacity="0.8">
                      <polyline points="0,50 35,50" fill="none" stroke="#000" strokeWidth="2" />
                      <polyline points="0,20 20,20 35,35" fill="none" stroke="#000" strokeWidth="2" />
                      <polyline points="50,0 50,35" fill="none" stroke="#000" strokeWidth="2" />
                      <polyline points="65,35 80,20 100,20" fill="none" stroke="#000" strokeWidth="2" />
                      <polyline points="100,50 65,50" fill="none" stroke="#000" strokeWidth="2" />
                      <polyline
                        points="35,35 65,35 65,65 35,65 35,35"
                        fill="none"
                        stroke="#000"
                        strokeWidth="2"
                      />
                      <polyline points="0,80 20,80 35,65" fill="none" stroke="#000" strokeWidth="2" />
                      <polyline points="50,100 50,65" fill="none" stroke="#000" strokeWidth="2" />
                      <polyline points="65,65 80,80 100,80" fill="none" stroke="#000" strokeWidth="2" />
                    </g>
                  </svg>
                  <div className="visa-card__chip-texture"></div>
                </div>
                <div className="visa-card__type">{card.type}</div>
                <div className="visa-card__number">
                  <span className="visa-card__digit-group">0123</span>
                  <span className="visa-card__digit-group">4567</span>
                  <span className="visa-card__digit-group">8901</span>
                  <span className="visa-card__digit-group">2345</span>
                </div>
                <div className="visa-card__valid-thru" aria-label="Valid thru">
                  VALID<br />THRU
                </div>
                <div className="visa-card__exp-date">
                  <time dateTime="2038-01">01/38</time>
                </div>
                <div className="visa-card__name" aria-label={userName}>
                  {userName}
                </div>
                <div className="visa-card__vendor" role="img" aria-labelledby="visa-card-vendor">
                  <span id="visa-card-vendor" className="visa-card__vendor-sr">
                    VISA
                  </span>
                </div>
                <div className="visa-card__texture"></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bank Balance Section */}
      <div className="row mb-4">
        <div className="col-12">
          <h5 className="text-white mb-3">Bank Balance</h5>
          <div className="d-flex flex-column flex-md-row justify-content-between">
            <div
              className="card text-white flex-fill mb-3 mb-md-0 me-md-3"
              style={{
                backgroundColor: '#2A3B3C',
                border: 'none',
                borderRadius: '15px',
                boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
                padding: '15px',
              }}
            >
              <p className="mb-1">Total Balance</p>
              <h3>{formatAmount(dashboardData.creditLimit)}</h3>
            </div>
            <div
              className="card text-white flex-fill mb-3 mb-md-0 me-md-3"
              style={{
                backgroundColor: '#2A3B3C',
                border: 'none',
                borderRadius: '15px',
                boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
                padding: '15px',
              }}
            >
              <p className="mb-1">Credit</p>
              <h3>{formatAmount(dashboardData.totalRevenue)}</h3>
            </div>
            <div
              className="card text-white flex-fill"
              style={{
                backgroundColor: '#2A3B3C',
                border: 'none',
                borderRadius: '15px',
                boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
                padding: '15px',
              }}
            >
              <p className="mb-1">Debit</p>
              <h3>{formatAmount(dashboardData.spend)}</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Statistic and Recent Transaction Section */}
      <div className="row">
        {/* Statistic Section */}
        <div className="col-12 col-md-8 mb-4">
          <h5 className="text-white mb-3">Statistic</h5>
          <div
            className="card"
            style={{
              backgroundColor: '#2A3B3C',
              border: 'none',
              borderRadius: '15px',
              boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
              padding: '15px',
            }}
          >
            <div className="card-body">
              <div className="d-flex justify-content-between mb-3">
                <span className="text-white">Annual Balance Statistic</span>
                <div>
                  <button className="btn btn-outline-light btn-sm me-2">Monthly</button>
                  <button className="btn btn-outline-light btn-sm">Yearly</button>
                </div>
              </div>
              <div
                style={{
                  height: '200px',
                  backgroundColor: '#1A2526',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#00C4B4',
                }}
              >
                [Line Chart Placeholder]
              </div>
            </div>
          </div>
        </div>

        {/* Recent Transaction Section */}
        <div className="col-12 col-md-4">
          <h5 className="text-white mb-3">Recent Transaction</h5>
          <div
            className="card"
            style={{
              backgroundColor: '#2A3B3C',
              border: 'none',
              borderRadius: '15px',
              boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
              padding: '15px',
            }}
          >
            <div className="card-body p-0">
              {(dashboardData.payments || []).length > 0 ? (
                dashboardData.payments.map((payment, index) => (
                  <div
                    key={index}
                    className="d-flex justify-content-between align-items-center p-3"
                    style={{
                      borderBottom:
                        index < dashboardData.payments.length - 1
                          ? '1px solid #3A4B4C'
                          : 'none',
                    }}
                  >
                    <div>
                      <p className="text-white mb-1">{payment.user}</p>
                      <small className="text-muted">{payment.date}</small>
                    </div>
                    <span className="text-white">{formatAmount(payment.amount)}</span>
                  </div>
                ))
              ) : (
                <p className="text-white p-3">No transactions available.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;