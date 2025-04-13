import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={{ backgroundColor: '#1A2526', minHeight: '100vh', color: 'white', fontFamily: '"DM Sans", sans-serif' }}>
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4">
        <div className="container-fluid">
          {/* Brand/logo on the left */}
          <Link className="navbar-brand" to="/">DevBank</Link>
          
          {/* Links on the right */}
          <div className="d-flex">
            <Link to="/" className="nav-link" style={{ color: '#00C4B4', textDecoration: 'none', fontWeight: 'bold', marginRight: '15px' }}>
              Home
            </Link>
            <Link to="/register" className="nav-link" style={{ color: '#00C4B4', textDecoration: 'none' }}>
              Register
            </Link>
          </div>
        </div>
      </nav>

      {/* Sign In Form */}
      <div
        className="p-4 p-md-5"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 'calc(100vh - 56px)' // Subtract navbar height
        }}
      >
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-12 col-md-6">
              <h2 className="mb-4 text-center">Sign In</h2>
              <form onSubmit={handleSignIn}>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="password" className="form-label">Password</label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                {error && (
                  <p className="text-danger text-center mb-3" style={{ fontSize: "0.9rem" }}>
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  className="btn w-100"
                  style={{
                    backgroundColor: '#2A3B3C',
                    color: 'white',
                    padding: '0.75rem',
                    borderRadius: '10px',
                    fontSize: '1rem',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
                  }}
                >
                  Sign In
                </button>
                <p className="mt-3 text-center">
                  Don't have an account?{' '}
                  <Link to="/register" style={{ color: '#00C4B4' }}>
                    Register
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignIn;