import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RegisterCard from './pages/components/Login/RegisterCard';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/register" element={<RegisterCard />} />
        {/* <Route path="*" element={<NotFound />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
