import { useEffect, useState } from 'react';
import { auth } from '../firebase';

function Profile() {
  const [userInfo, setUserInfo] = useState({
    name: '',
    email: '',
    photoURL: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    console.log('Checking auth state for profile');
    const user = auth.currentUser;
    if (user) {
      console.log('User found:', user.uid);
      setUserInfo({
        name: user.displayName || 'Unknown Name',
        email: user.email || 'Unknown Email',
        photoURL: user.photoURL || '',
      });
      console.log('User info set:', user.displayName, user.email, user.photoURL || 'No photo');
      setLoading(false);
    } else {
      console.log('No authenticated user found');
      setError('Please sign in to view your profile');
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <div
        className="d-flex align-items-center justify-content-center"
        style={{
          backgroundColor: '#1A2526',
          minHeight: '100vh',
          color: 'white',
          fontFamily: '"DM Sans", sans-serif',
        }}
      >
        <div className="text-center">
          <div className="spinner-border" style={{ color: '#00C4B4' }} role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="p-4"
        style={{
          backgroundColor: '#1A2526',
          minHeight: '100vh',
          color: 'white',
          fontFamily: '"DM Sans", sans-serif',
        }}
      >
        <div
          className="alert alert-danger text-center"
          style={{
            backgroundColor: '#ff6b6b',
            border: 'none',
            borderRadius: '8px',
            maxWidth: '500px',
            margin: '0 auto',
          }}
        >
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4" style={{ fontFamily: '"DM Sans", sans-serif', color: 'white' }}>
      <h2 className="mb-4">My Profile</h2>
      <div
        className="card text-white"
        style={{
          backgroundColor: '#2A3B3C',
          border: 'none',
          borderRadius: '15px',
          boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
          maxWidth: '500px',
          margin: '0 auto',
        }}
      >
        <div className="card-body text-center">
          {userInfo.photoURL ? (
            <img
              src={userInfo.photoURL}
              alt="Profile"
              style={{
                width: '100px',
                height: '100px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '2px solid #00C4B4',
                marginBottom: '1rem',
              }}
            />
          ) : (
            <div
              style={{
                width: '100px',
                height: '100px',
                borderRadius: '50%',
                backgroundColor: '#3A4B4C',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1rem',
                border: '2px solid #00C4B4',
                fontSize: '2rem',
                color: '#00C4B4',
              }}
            >
              {userInfo.name.charAt(0) || '?'}
            </div>
          )}
          <h5 className="card-title mb-3">{userInfo.name}</h5>
          <p className="card-text mb-2">
            <strong>Email:</strong> {userInfo.email}
          </p>
        </div>
      </div>
    </div>
  );
}

export default Profile;