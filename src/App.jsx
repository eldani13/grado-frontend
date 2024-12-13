import { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom'; 
import './App.css';
import Login from './pages/login';
import Home from './pages/Home';
import Productos from './pages/Productos';
import Categorias from './pages/Categorias';
import Reportes from './pages/Reportes';
// import 'mdb-react-ui-kit/dist/css/mdb.min.css';


function App() {

  return (
    <Router> 

        <Routes>
          <Route path="/" element={<Login />} /> 
          <Route path="/home" element={<Home />} /> 
          <Route path="/productos" element={<Productos />} /> 
          <Route path="/categorias" element={<Categorias />} /> 
          <Route path="/reportes" element={<Reportes />} /> 
        </Routes>
        
    </Router>
  );
}

export default App;
