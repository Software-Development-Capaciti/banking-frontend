import { useEffect, useState } from 'react';
import axios from 'axios';
import config from '../config';

function Dashboard() {
  const [dashboardData, setDashboardData] = useState({ creditLimit: 0, spend: 0, totalRevenue: 0, payments: [] });

  useEffect(() => {
    axios.get(config.endpoints.dashboard)
      .then(response => setDashboardData(response.data))
      .catch(error => console.error('Error fetching dashboard data:', error));
  }, []);

  return (
    <div
      className="p-4 p-md-3 p-lg-4"
      style={{
        backgroundColor: '#1A2526',
        minHeight: 'calc(100vh - 60px)',
        marginLeft: window.innerWidth < 768 ? '0' : '170px',
        paddingTop: '60px', // Starts below the navbar
        overflowY: 'auto',
        boxSizing: 'border-box',
        // Adjustment 1: Corrected width to match sidebar's 150px width
        width: window.innerWidth < 768 ? '100%' : 'calc(100% - 150px)', // Changed from calc(100% - 130px) to calc(100% - 150px)
        position: 'relative'
      }}
    >
      {/* Cards Section (VISA Cards) */}
      <div className="row mb-4">
        {dashboardData.payments.slice(0, 3).map((payment, index) => ( // Adjustment 2: Changed to display 3 cards
          <div className="col-12 col-md-4 mb-3" key={index}> {/* Adjustment 3: Changed col-md-6 to col-md-4 for 3 cards per row */}
            <div
              className="visa-card text-white"
              style={{
                width: '100%',
                maxWidth: '343px', // Kept the same, works well for 3 cards
                height: '226px',
                margin: '0 auto'
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

                .visa-card__info,
                .visa-card__chip-texture,
                .visa-card__texture {
                  position: absolute;
                }

                .visa-card__chip-texture,
                .visa-card__texture {
                  animation-name: texture;
                  top: 0;
                  left: 0;
                  width: 200%;
                  height: 100%;
                }

                .visa-card__info {
                  font: 0.75em/1 "DM Sans", sans-serif;
                  display: flex;
                  align-items: center;
                  flex-wrap: wrap;
                  padding: 0.75rem;
                  inset: 0;
                }

                .visa-card__logo,
                .visa-card__number {
                  width: 100%;
                }

                .visa-card__logo {
                  font-weight: bold;
                  font-style: italic;
                }

                .visa-card__chip {
                  background-image: linear-gradient(hsl(0,0%,70%),hsl(0,0%,80%));
                  border-radius: 0.2rem;
                  box-shadow: 0 0 0 0.05rem hsla(0,0%,0%,0.5) inset;
                  width: 1.25rem;
                  height: 1.25rem;
                  transform: translate3d(0,0,0);
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
                }

                .visa-card__digit-group,
                .visa-card__exp-date,
                .visa-card__name {
                  background: linear-gradient(hsl(0,0%,100%),hsl(0,0%,85%) 15% 55%,hsl(0,0%,70%) 70%);
                  -webkit-background-clip: text;
                  -webkit-text-fill-color: transparent;
                  font-family: "Courier Prime", monospace;
                  filter: drop-shadow(0 0.05rem hsla(0,0%,0%,0.3));
                }

                .visa-card__number {
                  font-size: 0.8rem;
                  display: flex;
                  justify-content: space-between;
                }

                .visa-card__valid-thru,
                .visa-card__exp-date,
                .visa-card__name {
                  text-transform: uppercase;
                }

                .visa-card__valid-thru,
                .visa-card__exp-date {
                  margin-bottom: 0.25rem;
                  width: 50%;
                }

                .visa-card__valid-thru {
                  font-size: 0.3rem;
                  padding-right: 0.25rem;
                  text-align: right;
                }

                .visa-card__exp-date,
                .visa-card__name {
                  font-size: 0.6rem;
                }

                .visa-card__exp-date {
                  padding-left: 0.25rem;
                }

                .visa-card__name {
                  overflow: hidden;
                  white-space: nowrap;
                  text-overflow: ellipsis;
                  width: 6.25rem;
                }

                .visa-card__vendor,
                .visa-card__vendor:before,
                .visa-card__vendor:after {
                  position: absolute;
                }

                .visa-card__vendor {
                  right: 0.375rem;
                  bottom: 0.375rem;
                  width: 2.55rem;
                  height: 1.5rem;
                }

                .visa-card__vendor:before,
                .visa-card__vendor:after {
                  border-radius: 50%;
                  content: "";
                  display: block;
                  top: 0;
                  width: 1.5rem;
                  height: 1.5rem;
                }

                .visa-card__vendor:before {
                  background-color: #1a2a6c;
                  left: 0;
                }

                .visa-card__vendor:after {
                  background-color: #b21f1f;
                  box-shadow: -1.05rem 0 0 #f5f5f5 inset;
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
                  background-image: linear-gradient(-80deg,hsla(0,0%,100%,0.3) 25%,hsla(0,0%,100%,0) 45%);
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
                  <svg className="visa-card__chip-lines" role="img" width="20px" height="20px" viewBox="0 0 100 100" aria-label="Chip">
                    <g opacity="0.8">
                      <polyline points="0,50 35,50" fill="none" stroke="#000" strokeWidth="2" />
                      <polyline points="0,20 20,20 35,35" fill="none" stroke="#000" strokeWidth="2" />
                      <polyline points="50,0 50,35" fill="none" stroke="#000" strokeWidth="2" />
                      <polyline points="65,35 80,20 100,20" fill="none" stroke="#000" strokeWidth="2" />
                      <polyline points="100,50 65,50" fill="none" stroke="#000" strokeWidth="2" />
                      <polyline points="35,35 65,35 65,65 35,65 35,35" fill="none" stroke="#000" strokeWidth="2" />
                      <polyline points="0,80 20,80 35,65" fill="none" stroke="#000" strokeWidth="2" />
                      <polyline points="50,100 50,65" fill="none" stroke="#000" strokeWidth="2" />
                      <polyline points="65,65 80,80 100,80" fill="none" stroke="#000" strokeWidth="2" />
                    </g>
                  </svg>
                  <div className="visa-card__chip-texture"></div>
                </div>
                <div className="visa-card__type">debit</div>
                <div className="visa-card__number">
                  <span className="visa-card__digit-group">0123</span>
                  <span className="visa-card__digit-group">4567</span>
                  <span className="visa-card__digit-group">8901</span>
                  <span className="visa-card__digit-group">2345</span>
                </div>
                <div className="visa-card__valid-thru" aria-label="Valid thru">Valid<br />thru</div>
                <div className="visa-card__exp-date"><time dateTime="2038-01">01/38</time></div>
                <div className="visa-card__name" aria-label={payment.user}>{payment.user}</div>
                <div className="visa-card__vendor" role="img" aria-labelledby="visa-card-vendor">
                  <span id="visa-card-vendor" className="visa-card__vendor-sr">VISA</span>
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
                padding: '15px'
              }}
            >
              <p className="mb-1">Total Balance</p>
              <h3>${dashboardData.creditLimit + dashboardData.spend}</h3>
            </div>
            <div
              className="card text-white flex-fill mb-3 mb-md-0 me-md-3"
              style={{
                backgroundColor: '#2A3B3C',
                border: 'none',
                borderRadius: '15px',
                boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
                padding: '15px'
              }}
            >
              <p className="mb-1">Credit</p>
              <h3>${dashboardData.creditLimit}</h3>
            </div>
            <div
              className="card text-white flex-fill"
              style={{
                backgroundColor: '#2A3B3C',
                border: 'none',
                borderRadius: '15px',
                boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
                padding: '15px'
              }}
            >
              <p className="mb-1">Debit</p>
              <h3>${dashboardData.spend}</h3>
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
              padding: '15px'
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
                  color: '#00C4B4'
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
              padding: '15px'
            }}
          >
            <div className="card-body p-0">
              {dashboardData.payments.map((payment, index) => (
                <div
                  key={index}
                  className="d-flex justify-content-between align-items-center p-3"
                  style={{
                    borderBottom: index < dashboardData.payments.length - 1 ? '1px solid #3A4B4C' : 'none'
                  }}
                >
                  <div>
                    <p className="text-white mb-1">{payment.user}</p>
                    <small className="text-muted">{payment.date}</small>
                  </div>
                  <span className="text-white">-${payment.amount}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;