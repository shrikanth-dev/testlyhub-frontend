import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import '../styles/QuizPlayer.css';

const QuizPlayer = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [test, setTest] = useState(null);
  const [answers, setAnswers] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(null);
  const reattempting = useRef(false);

  useEffect(() => {
    const fetchTest = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/tests/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const testData = res.data;

        if (testData.price > 0) {
          const purchaseRes = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/purchase/check/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (!purchaseRes.data.purchased) {
            navigate('/');
            return;
          }
        }

        setTest(testData);
        setAnswers({});
        setCurrentIndex(0);
        setTimeLeft(testData.duration * 60);
        setSubmitted(false);
        setScore(null);
      } catch (error) {
        console.error('Failed to load test:', error);
        alert('Error loading quiz.');
      }
    };

    fetchTest();
  }, [id, navigate]);

  useEffect(() => {
    if (!test || submitted) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [test, submitted]);

  const handleSubmit = useCallback(async () => {
    if (!test) return;
    let correct = 0;

    test.solutions.forEach((solution, idx) => {
      const userAnswer = answers[idx]?.toString().trim().toLowerCase();
      const correctAnswer = solution.toString().trim().toLowerCase();
      if (userAnswer === correctAnswer) {
        correct++;
      }
    });

    setScore(correct);
    setSubmitted(true);
    setTimeLeft(0);
    reattempting.current = false;

    alert(`Test submitted! You scored ${correct} out of ${test.questions.length}`);

    try {
      const token = localStorage.getItem('token');
      const timeSpent = test.duration * 60 - timeLeft;
        await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/leaderboard/submit`, {
        testId: test.id,
        score: correct,
        time_taken: timeSpent,
      }, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error('Leaderboard submission failed:', error);
    }
  }, [answers, test, timeLeft]);

  useEffect(() => {
    if (timeLeft <= 0 && test && !submitted && !reattempting.current) {
      handleSubmit();
    }
  }, [timeLeft, test, submitted, handleSubmit]);

  const nextQuestion = () => {
    if (currentIndex < test.questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const prevQuestion = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleReattempt = () => {
    reattempting.current = true;
    setAnswers({});
    setCurrentIndex(0);
    setTimeLeft(test.duration * 60);
    setSubmitted(false);
    setScore(null);
  };

  if (!test) return <p className="loading-text">Loading test...</p>;

  if (submitted) {
    return (
      <div className="quiz-container">
        <h2>✅ Test Submitted</h2>
        <p>Your Score: {score} / {test.questions.length}</p>
        <button onClick={handleReattempt} className="primary-button">🔁 Reattempt Quiz</button>
        <Link to={`/leaderboard/${test.id}`} className="secondary-link">📊 View Leaderboard</Link>
      </div>
    );
  }

  const currentQuestion = test.questions[currentIndex];
  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;

  return (
    <div className="quiz-container">
      <h2>{test.title}</h2>
      <p className="timer">⏱️ Time Left: {mins}:{secs.toString().padStart(2, '0')}</p>

      <div className="question-card">
        <h3>Question {currentIndex + 1} of {test.questions.length}</h3>
        {test.type === 'mcq' && currentQuestion.question ? (
          <>
            <p>{currentQuestion.question}</p>
            {currentQuestion.options.map((option, idx) => (
              <label key={idx} className="mcq-option">
                <input
                  type="radio"
                  name={`question-${currentIndex}`}
                  value={option}
                  checked={answers[currentIndex] === option}
                  onChange={() => setAnswers({ ...answers, [currentIndex]: option })}
                />
                {option}
              </label>
            ))}
          </>
        ) : (
          <>
            <p>{typeof currentQuestion === 'string' ? currentQuestion : currentQuestion.question}</p>
            <input
              type="text"
              placeholder="Your answer"
              value={answers[currentIndex] || ''}
              onChange={(e) => setAnswers({ ...answers, [currentIndex]: e.target.value })}
              className="input-field"
            />
          </>
        )}
      </div>

      <div className="button-group">
        <button onClick={prevQuestion} disabled={currentIndex === 0} className="secondary-button">⬅️ Previous</button>
        <button onClick={nextQuestion} disabled={currentIndex === test.questions.length - 1} className="secondary-button">Next ➡️</button>
      </div>

      <button onClick={handleSubmit} className="primary-button submit-button">✅ Submit Test</button>
    </div>
  );
};

export default QuizPlayer;


