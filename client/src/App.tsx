import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RegisterCard from './pages/components/Login/RegisterCard';
import LoginCard from './pages/components/Login/LoginCard';
import Homepage from './pages/components/HomepageCard';
import { ThemeProvider } from './context/ThemeContext';

function App() {
  return (
    <ThemeProvider>
    <Router>
      <Routes>
        <Route path="/register" element={<RegisterCard />} />
        <Route path="/login" element={<LoginCard/>} />
        <Route path="/" element={<Homepage/>} />
        {/* <Route path="*" element={<NotFound />} /> */}
      </Routes>
    </Router>
    </ThemeProvider>
  );
}

export default App;
