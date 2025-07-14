import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Checkout from './pages/Checkout';
import CreateTest from './pages/CreateTest';
import QuizPlayer from './pages/QuizPlayer';
import Leaderboard from './pages/Leaderboard';
import FullLeaderboard from './pages/FullLeaderboard';
import Profile from './pages/Profile';


const App = () => {
  return (
    <Router>
      <nav>
        <Link to="/">Home</Link> |{" "}
        <Link to="/login">Login</Link> |{" "}
        <Link to="/register">Register</Link> |{" "}
        <Link to="/create-test">Create Test</Link> |{" "}
        <Link to="/checkout">Checkout</Link> |{" "}
        <Link to="/leaderboard">Leaderboard</Link> |{" "}
        <Link to="/profile">Profile</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/create-test" element={<CreateTest />} />
        <Route path="/quiz/:id" element={<QuizPlayer />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/leaderboard/:testId" element={<Leaderboard />} />
        <Route path="/leaderboard" element={<FullLeaderboard />} />    
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Router>
  );
};

export default App;