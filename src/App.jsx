import { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom'; 
import './App.css';
import Login from './pages/Login';
import Home from './pages/Home';
import Productos from './pages/Productos';
import Categorias from './pages/Categorias';
import Reportes from './pages/Reportes';
import Configuracion from './pages/Configuracion';
import Factura from './pages/Factura';
import Pedidos from './pages/Pedidos';
import Formulario from './forms/Formulario';
// import 'mdb-react-ui-kit/dist/css/mdb.min.css';


function App() {

  return (
    <Router> 

        <Routes>
          <Route path="/" element={<Login />} /> 
          <Route path="/formulario" element={<Formulario />} /> 
          <Route path="/home" element={<Home />} /> 
          <Route path="/categorias" element={<Categorias />} /> 
          <Route path="/productos" element={<Productos />} /> 
          <Route path="/factura" element={<Factura />} /> 
          <Route path="/reportes" element={<Reportes />} /> 
          <Route path="/configuracion" element={<Configuracion />} /> 
          <Route path="/pedidos" element={<Pedidos />} /> 
        </Routes>
        
    </Router>
  );
}

export default App;
