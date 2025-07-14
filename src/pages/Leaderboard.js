import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const LeaderboardPage = () => {
  const { testId } = useParams();
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/leaderboard/${testId}`);
        setEntries(res.data);
      } catch (error) {
        console.error('Failed to load leaderboard:', error);
        alert('Could not load leaderboard.');
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [testId]);

  if (loading) return <p>Loading leaderboard...</p>;

  return (
    <div>
      <h2>🏆 Leaderboard</h2>
      {entries.length === 0 ? (
        <p>No entries yet.</p>
      ) : (
        <table border="1" cellPadding="8" style={{ width: '100%', marginTop: '1rem' }}>
          <thead>
            <tr>
              <th>#</th>
              <th>User</th>
              <th>Score</th>
              <th>Time Taken (s)</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry, index) => (
              <tr key={entry.id}>
                <td>{index + 1}</td>
                <td>{entry.User?.name || 'Anonymous'}</td>
                <td>{entry.score}</td>
                <td>{entry.time_taken}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default LeaderboardPage;


