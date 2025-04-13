import { Link } from 'react-router-dom';

function Landing() {
  return (
    <div
      className="p-4 p-md-5"
      style={{
        backgroundColor: '#1A2526',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontFamily: '"DM Sans", sans-serif',
      }}
    >
      <div className="container">
        <div className="row align-items-center">
          {/* Hero Text */}
          <div className="col-12 col-md-6 mb-4 mb-md-0">
            <h1
              style={{
                fontSize: '2.5rem',
                fontWeight: 'bold',
                marginBottom: '1rem',
              }}
            >
              Welcome to Your Banking Hub
            </h1>
            <p
              style={{
                fontSize: '1.2rem',
                color: '#e0e0e0',
                marginBottom: '2rem',
              }}
            >
              Manage your finances with ease. Register or sign in to access your personalized dashboard.
            </p>
            <div className="d-flex gap-3">
              <Link
                to="/register"
                className="btn"
                style={{
                  backgroundColor: '#00C4B4',
                  color: 'white',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '10px',
                  fontSize: '1rem',
                  textDecoration: 'none',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
                }}
              >
                Register
              </Link>
              <Link
                to="/signin"
                className="btn"
                style={{
                  backgroundColor: '#2A3B3C',
                  color: 'white',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '10px',
                  fontSize: '1rem',
                  textDecoration: 'none',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
                }}
              >
                Sign In
              </Link>
            </div>
          </div>

          {/* Decorative VISA Card */}
          <div className="col-12 col-md-6 d-flex justify-content-center">
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
                  left: ποί

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
                <div className="visa-card__type">DEBIT</div>
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
                <div className="visa-card__name" aria-label="Your Name">
                  Your Name
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
        </div>
      </div>
    </div>
  );
}

export default Landing;