import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.min.css"
// Import your components
import Home from './pages/Home';


function App() {
  return (
    <Router>
    
        <Routes>
          <Route path="/" element={<Home />} />
      
        </Routes>
      
    </Router>
  );
}

export default App;
