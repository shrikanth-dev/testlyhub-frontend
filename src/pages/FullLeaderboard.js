import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../styles/FullLeaderboard.css'; 

const FullLeaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [tests, setTests] = useState([]);
  const [selectedTest, setSelectedTest] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchTests = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/tests');
        setTests(res.data);
      } catch (err) {
        console.error('Error loading tests:', err);
      }
    };
    fetchTests();
  }, []);

  useEffect(() => {
    if (!selectedTest) return;

    const fetchLeaderboard = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`http://localhost:5000/api/leaderboard/${selectedTest}`);
        setLeaderboard(res.data);
      } catch (error) {
        console.error('Failed to load leaderboard:', error);
        alert('Could not load leaderboard.');
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [selectedTest]);

  return (
    <div className="leaderboard-container">
      <div className="leaderboard-card">
        <h2>📊 Full Leaderboard</h2>

        <div className="dropdown-container">
          <label htmlFor="test-select">Select a test:</label>
          <select
            id="test-select"
            value={selectedTest}
            onChange={(e) => setSelectedTest(e.target.value)}
          >
            <option value="">-- Choose a test --</option>
            {tests.map((test) => (
              <option key={test.id} value={test.id}>{test.title}</option>
            ))}
          </select>
        </div>

        {loading && selectedTest && <p>Loading leaderboard...</p>}

        {!loading && leaderboard.length > 0 && (
          <div className="table-container">
            <table className="leaderboard-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>User</th>
                  <th>Test</th>
                  <th>Score</th>
                  <th>Time Taken (s)</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.map((entry, index) => (
                  <tr key={entry.id}>
                    <td>{index + 1}</td>
                    <td>{entry.User?.name || 'Anonymous'}</td>
                    <td>{tests.find(t => t.id === entry.testId)?.title || 'Unknown Test'}</td>
                    <td>{entry.score}</td>
                    <td>{entry.time_taken}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!loading && selectedTest && leaderboard.length === 0 && (
          <p>No leaderboard data yet for this test.</p>
        )}

        <div className="back-link">
          <Link to="/">⬅️ Back to Home</Link>
        </div>
      </div>
    </div>
  );
};

export default FullLeaderboard;

