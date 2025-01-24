import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"; 
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
import Despacho from './pages/Despacho';
import Proceso from './pages/Proceso'; 
import Ventas from "./pages/Ventas";

function App() {

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const [pedidosData, setPedidosData] = useState([]); 

  useEffect(() => {
    const fetchPedidos = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/inventario/pedido/`); 
        if (!response.ok) {
          throw new Error("Error al obtener los pedidos");
        }
        const data = await response.json();
        setPedidosData(data); 
      } catch (error) {
        console.error("Error al cargar los pedidos:", error);
      }
    };

    fetchPedidos();
  }, []); 

  const pedidosEnProceso = pedidosData.filter(pedido => {
    // console.log(pedido.estado); 
    return pedido.estado === "en_proceso";
  });
  
  

  const pedidosTerminados = pedidosData.filter(pedido => pedido.estado === "terminado");

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
        <Route path="/pedidos" element={<Pedidos pedidos={pedidosEnProceso} />} /> 
        <Route path="/despacho" element={<Despacho pedidos={pedidosTerminados} />} />
        <Route path="/proceso" element={<Proceso pedidos={pedidosEnProceso} />} /> 
        <Route path="/compras" element={<Ventas />} /> 
      </Routes>
    </Router>
  );
}

export default App;
