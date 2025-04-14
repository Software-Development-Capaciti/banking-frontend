import { useEffect, useState } from 'react';
import axios from 'axios';
import config from '../config';

function Profile() {
  const [profile, setProfile] = useState({ name: '', email: '' });

  useEffect(() => {
    axios.get(config.endpoints.profile)
      .then(response => setProfile(response.data))
      .catch(error => console.error('Error fetching profile:', error));
  }, []);

  return (
    <div>
      <h2 className="mb-4">Profile</h2>
      <div className="card">
        <div className="card-body">
          <h5 className="card-title">User Profile</h5>
          <p className="card-text"><strong>Name:</strong> {profile.name}</p>
          <p className="card-text"><strong>Email:</strong> {profile.email}</p>
        </div>
      </div>
    </div>
  );
}

export default Profile;