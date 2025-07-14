import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/Profile.css'; 

const Profile = () => {
  const [user, setUser] = useState(null);
  const [attempts, setAttempts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      if (!token) return navigate('/login');

      try {
        const userRes = await axios.get('http://localhost:5000/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(userRes.data);

        const attemptsRes = await axios.get('http://localhost:5000/api/leaderboard/user', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAttempts(attemptsRes.data);
      } catch (err) {
        console.error('Error fetching profile:', err);
        alert('Could not load profile.');
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="profile-container">
      <div className="profile-card">
        <h2>👤 Your Profile</h2>

        {user ? (
          <>
            {/* Profile Info */}
            <div className="profile-header">
              <img
                src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`}
                alt="Profile"
                className="profile-avatar"
              />
              <div>
                <p><strong>Name:</strong> {user.name}</p>
                <p><strong>Email:</strong> {user.email}</p>
              </div>
            </div>

            {/* Test Attempts */}
            <h3>📝 Your Test Attempts</h3>
            {attempts.length === 0 ? (
              <p>No attempts yet.</p>
            ) : (
              <div className="table-container">
                <table className="profile-table">
                  <thead>
                    <tr>
                      <th>Test</th>
                      <th>Score</th>
                      <th>Time Taken (s)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attempts.map((entry) => (
                      <tr key={entry.id}>
                        <td>{entry.Test?.title || 'Untitled'}</td>
                        <td>{entry.score}</td>
                        <td>{entry.time_taken}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Navigation */}
            <div className="profile-links">
              <Link to="/leaderboard">🌍 View Full Leaderboard</Link>
            </div>

            {/* Logout */}
            <button onClick={handleLogout} className="logout-button">
              🔓 Logout
            </button>
          </>
        ) : (
          <p>Loading profile...</p>
        )}
      </div>
    </div>
  );
};

export default Profile;

