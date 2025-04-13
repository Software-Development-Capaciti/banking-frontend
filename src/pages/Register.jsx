import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';

function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      console.log('✅ User registered successfully');
      navigate('/signin');
    } catch (error) {
      console.error('❌ Registration Error:', error.message);
      alert(error.message);
    }
  };

  return (
    <div
      style={{
        backgroundColor: '#1A2526',
        minHeight: '100vh',
        color: 'white',
        fontFamily: '"DM Sans", sans-serif',
      }}
    >
     <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4">
  <div className="container-fluid">
    {/* Brand/logo on the left */}
    <Link className="navbar-brand" to="/">DevBank</Link>
    
    {/* Links on the right */}
    <div className="d-flex">
      <Link to="/" className="nav-link" style={{ color: '#00C4B4', textDecoration: 'none', fontWeight: 'bold', marginRight: '15px' }}>
        Home
      </Link>
      <Link to="/signin" className="nav-link" style={{ color: '#00C4B4', textDecoration: 'none' }}>
        Sign In
      </Link>
    </div>
  </div>
</nav>

      {/* Registration Form */}
      <div className="container d-flex align-items-center justify-content-center py-5">
        <div className="col-12 col-md-6">
          <h2 className="mb-4 text-center">Register</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="username" className="form-label">Username</label>
              <input
                type="text"
                className="form-control"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
              />
            </div>
            <button
              type="submit"
              className="btn w-100"
              style={{
                backgroundColor: '#00C4B4',
                color: 'white',
                padding: '0.75rem',
                borderRadius: '10px',
                fontSize: '1rem',
                boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
              }}
            >
              Register
            </button>
            <p className="mt-3 text-center">
              Already have an account?{' '}
              <Link to="/signin" style={{ color: '#00C4B4' }}>
                Sign In
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;
