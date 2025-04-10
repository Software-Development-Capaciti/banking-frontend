import React, { useState } from 'react';
import { auth } from '../firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { useNavigate } from 'react-router-dom'; // For navigation
import '../App.css';

function Navbar() {
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [message, setMessage] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate(); // React Router navigation

  const handleSignIn = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      setMessage('Logged in successfully!');
      setIsLoggedIn(true);
      console.log('User logged in:', userCredential.user);
      navigate('/profile'); // Redirect to the profile page
    } catch (err) {
      if (err.code === 'auth/user-not-found') {
        setMessage('You don’t have an account. Please create one.');
      } else {
        setMessage(err.message);
      }
      setIsLoggedIn(false);
    }
  };

  const handleCreateAccount = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, {
        displayName: `${name} ${surname}`,
      });
      setMessage('Account created successfully! You can now log in.');
      setIsCreatingAccount(false);
    } catch (err) {
      setMessage(err.message);
    }
  };

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
        <span className="navbar-brand text-white fw-bold">DevBank</span>
        <div className="d-flex align-items-center">
          {!isLoggedIn ? (
            <button
              className="btn"
              style={{ backgroundColor: '#00C4B4', color: 'white', border: 'none' }}
              data-bs-toggle="modal"
              data-bs-target="#authModal"
            >
              Sign In
            </button>
          ) : (
            <span className="text-success">Welcome!</span>
          )}
        </div>
      </div>

      {/* Authentication Modal */}
      <div
        className="modal fade"
        id="authModal"
        tabIndex="-1"
        aria-labelledby="authModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="authModalLabel">
                {isCreatingAccount ? 'Create Account' : 'Sign In'}
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <form
                onSubmit={isCreatingAccount ? handleCreateAccount : handleSignIn}
              >
                {isCreatingAccount && (
                  <>
                    <div className="mb-3">
                      <label htmlFor="name" className="form-label">
                        Name
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="surname" className="form-label">
                        Surname
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="surname"
                        value={surname}
                        onChange={(e) => setSurname(e.target.value)}
                        required
                      />
                    </div>
                  </>
                )}
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    Email address
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">
                    Password
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary">
                  {isCreatingAccount ? 'Create Account' : 'Sign In'}
                </button>
              </form>
              {message && (
                <p
                  className={`mt-3 ${
                    isLoggedIn ? 'text-success' : 'text-danger'
                  }`}
                >
                  {message}
                </p>
              )}
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-link"
                onClick={() => setIsCreatingAccount(!isCreatingAccount)}
              >
                {isCreatingAccount
                  ? 'Already have an account? Sign In'
                  : 'Create Account'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;