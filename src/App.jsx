import { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom'; 
import './App.css';
import Login from './pages/login';
import Home from './pages/Home';
// import 'mdb-react-ui-kit/dist/css/mdb.min.css';


function App() {

  return (
    <Router> 

        <Routes>
          <Route path="/" element={<Login />} /> 
          <Route path="/home" element={<Home />} /> 
        </Routes>
        
    </Router>
  );
}

export default App;
