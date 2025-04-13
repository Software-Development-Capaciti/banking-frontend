import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Payments from './pages/Payments';
import Transactions from './pages/Transactions';
import Cards from './pages/Cards';
import Profile from './pages/Profile';
import Landing from './pages/Landing';
import Register from './pages/Register';
import SignIn from './pages/SignIn';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState({ name: '', photoURL: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log('Auth state:', user ? user.uid : 'No user');
      if (user) {
        setIsAuthenticated(true);
        const name = user.displayName || user.email.split('@')[0];
        localStorage.setItem('banking_user', name);
        setUserData({ name, photoURL: user.photoURL || '' });
      } else {
        setIsAuthenticated(false);
        localStorage.removeItem('banking_user');
        setUserData({ name: '', photoURL: '' });
      }
      setLoading(false);
    });
    return () => {
      console.log('Unsubscribing auth listener');
      unsubscribe();
    };
  }, []);

  const handleLogout = () => {
    console.log('Logging out');
    auth.signOut().catch((err) => console.error('Logout error:', err));
  };

  if (loading) {
    return (
      <div
        style={{
          backgroundColor: '#1A2526',
          minHeight: '100vh',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        Loading...
      </div>
    );
  }

  const AuthLayout = ({ children }) => (
    <div className="d-flex">
      <Sidebar />
      <div className="flex-grow-1" style={{ paddingTop: '60px' }}>
        <Navbar onLogout={handleLogout} userData={userData} />
        <div className="container-fluid p-4">{children}</div>
      </div>
    </div>
  );

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/register" element={<Register />} />
        <Route path="/signin" element={<SignIn />} />
        <Route
          path="/dashboard"
          element={
            isAuthenticated ? (
              <AuthLayout>
                <Dashboard />
              </AuthLayout>
            ) : (
              <Navigate to="/signin" />
            )
          }
        />
        <Route
          path="/payments"
          element={
            isAuthenticated ? (
              <AuthLayout>
                <Payments />
              </AuthLayout>
            ) : (
              <Navigate to="/signin" />
            )
          }
        />
        <Route
          path="/transactions"
          element={
            isAuthenticated ? (
              <AuthLayout>
                <Transactions />
              </AuthLayout>
            ) : (
              <Navigate to="/signin" />
            )
          }
        />
        <Route
          path="/cards"
          element={
            isAuthenticated ? (
              <AuthLayout>
                <Cards />
              </AuthLayout>
            ) : (
              <Navigate to="/signin" />
            )
          }
        />
        <Route
          path="/profile"
          element={
            isAuthenticated ? (
              <AuthLayout>
                <Profile />
              </AuthLayout>
            ) : (
              <Navigate to="/signin" />
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;