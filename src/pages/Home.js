import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../styles/Home.css'; 

const Home = () => {
  const [tests, setTests] = useState([]);

  useEffect(() => {
    const fetchTests = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/tests`);
        setTests(res.data);
      } catch (err) {
        console.error('Failed to fetch tests:', err);
      }
    };

    fetchTests();
  }, []);

  const becomeCreator = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please log in first!');
      return;
    }
    try {
        const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/creator/become`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      localStorage.setItem('token', res.data.token);
      alert(res.data.message);
    } catch (err) {
      console.error('Become Creator Error:', err);
      alert('Failed to become creator.');
    }
  };

  const handleBuy = async (testId, price) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please log in first!');
      return;
    }
    try {
        await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/purchase`,
        { testId, amount: price },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Purchase successful! You can now start the quiz.');
    } catch (err) {
      console.error('Purchase failed:', err);
      alert('Purchase failed!');
    }
  };

  return (
    <div className="container">
      <h1>🏠 Home Page</h1>
      <p>Welcome to Practice Tests Marketplace!</p>

      <button onClick={becomeCreator}>Become a Creator</button>

      <h2>📚 Available Tests:</h2>
      {tests.length === 0 ? (
        <p>No tests available yet.</p>
      ) : (
        <ul>
          {tests.map((test) => (
            <li key={test.id} className="test-card">
              <h3>{test.title}</h3>
              <p>{test.description}</p>
              <p>Price: ${test.price}</p>
              <p>Creator: {test.creator?.name || 'Unknown'}</p>

              <div className="test-actions">
                {test.price === 0 ? (
                  <Link to={`/quiz/${test.id}`}>Start Quiz</Link>
                ) : (
                  <button onClick={() => handleBuy(test.id, test.price)}>Buy</button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Home;

