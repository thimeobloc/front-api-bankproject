import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home/Home';

export default  function App() {
  return (
    <Router>
      <Routes>
        {/* Redirection de la racine "/" vers "/home" */}
        <Route path="/" element={<Navigate to="/home" />} />
        {/* Page Home */}
        <Route path="/home" element={<Home/>} />
      </Routes>
    </Router>
  );
}

