import React, { useState, useEffect } from "react";
import NavBar from "../components/NavBar";
import Nav from "../components/Nav";
import { Bar } from 'react-chartjs-2'; 
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { color } from "chart.js/helpers";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function Home() {
  const [totalProductos, setTotalProductos] = useState(0);
  const [totalCategorias, setTotalCategorias] = useState(0);
  const [stockBajo, setStockBajo] = useState(0);
  const [ventasSemanales, setVentasSemanales] = useState([]);
  const [ventasTotales, setVentasTotales] = useState(0);
  const [actividades, setActividades] = useState([]);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const fetchProductos = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/inventario/productos/`);
      const data = await response.json();
      setTotalProductos(data.length); 
      const stockBajoCount = data.filter(producto => producto.cantidad < 5).length; 
      setStockBajo(stockBajoCount);
    } catch (error) {
      console.error("Error al obtener productos:", error);
    }
  };

  const fetchCategorias = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/inventario/categorias/`);
      const data = await response.json();
      setTotalCategorias(data.length);
    } catch (error) {
      console.error("Error al obtener categorías:", error);
    }
  };

  const fetchVentasSemanales = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/inventario/ventas/`);
      const data = await response.json();

      const ventas = data.map(venta => venta.total);
      setVentasSemanales(ventas);
    } catch (error) {
      console.error("Error al obtener ventas semanales:", error);
    }
  };

  const fetchActividades = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/inventario/actividades/`);
      const data = await response.json();

      const mensajes = data.map((actividad) => {
        switch (actividad.tipo) {
          case "venta":
            return `Se registró una nueva venta de $${actividad.descripcion || "0"}.`;
          case "actualizacion":
            return `Se actualizó el producto: ${actividad.descripcion || "desconocido"}.`;
          case "factura":
            return `Se emitió una factura: ${actividad.factura || "desconocida"}.`;
          case "otro":
            return `Actividad registrada: ${actividad.descripcion || "sin descripción"}.`;
          default:
            return "Actividad desconocida.";
        }
      });

      setActividades(mensajes);
    } catch (error) {
      console.error("Error al obtener actividades:", error);
    }
  };

  const fetchResumen = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/inventario/resumen/`);
      const data = await response.json();
      setVentasTotales(data.ventas_totales); 
    } catch (error) {
      console.error("Error al obtener el resumen:", error);
    }
  };

  useEffect(() => {
    fetchProductos();
    fetchCategorias();
    fetchVentasSemanales();
    fetchResumen();
    fetchActividades();
  }, []);

  const data = {
    labels: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'], 
    datasets: [
      {
        label: 'Ventas Diarias ($)',
        data: ventasSemanales, 
        backgroundColor: '#fff', 
        borderColor: '#fff', 
        borderWidth: 1,
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true
      }
    },
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Ventas de la última semana',
        color: '#fff'
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-tr from-gray-900 via-gray-800 to-black text-white">
      <Nav />

      <div className="flex flex-1 pt-20">
        <NavBar />
        <main className="flex-1 p-8 overflow-auto ml-64">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-4xl font-extrabold">Resumen</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div className="p-6 bg-gradient-to-br from-purple-800 to-blue-900 rounded-xl shadow-xl">
              <h3 className="text-sm font-semibold text-gray-300">
                Productos Totales
              </h3>
              <p className="text-3xl font-bold text-white">{totalProductos}</p>
            </div>
            <div className="p-6 bg-gradient-to-br from-blue-800 to-purple-900 rounded-xl shadow-xl">
              <h3 className="text-sm font-semibold text-gray-300">
                Categorías
              </h3>
              <p className="text-3xl font-bold text-white">{totalCategorias}</p>
            </div>
            <div className="p-6 bg-gradient-to-br from-red-700 to-red-900 rounded-xl shadow-xl">
              <h3 className="text-sm font-semibold text-gray-300">
                Stock Bajo
              </h3>
              <p className="text-3xl font-bold text-white">{stockBajo}</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 bg-gradient-to-br from-green-800 to-green-900 rounded-xl shadow-xl">
              <h3 className="text-sm font-semibold text-gray-300">
                Ventas del Día
              </h3>
              <p className="text-3xl font-bold text-white">$1,200.00</p>
            </div>
            <div className="p-6 bg-gradient-to-br from-green-800 to-green-900 rounded-xl shadow-xl">
              <h3 className="text-sm font-semibold text-gray-300">
                Ventas totales
              </h3>
              <p className="text-3xl font-bold text-white">${ventasTotales.toLocaleString()}</p>
            </div>
            <div className="p-6 bg-gradient-to-br from-orange-800 to-orange-900 rounded-xl shadow-xl">
              <h3 className="text-sm font-semibold text-gray-300">
                Pedidos Pendientes
              </h3>
              <p className="text-3xl font-bold text-white">5</p>
            </div>
          </div>

          <div className="mt-8 bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-xl shadow-xl">
            <h3 className="text-xl font-bold mb-4 text-gray-200">
              Gráfica de Ventas
            </h3>
            <div className="h-64 bg-gray-700 rounded-lg">
              <Bar data={data} options={options} />
            </div>
          </div>

          <div className="mt-8 bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-xl shadow-xl">
            <h3 className="text-xl font-bold mb-4 text-gray-200">Actividad Reciente</h3>
            <ul className="space-y-4">
              {actividades.length > 0 ? (
                actividades.map((mensaje, index) => (
                  <li key={index} className="text-gray-300">
                    {mensaje}
                  </li>
                ))
              ) : (
                <li className="text-gray-500">No hay actividades recientes.</li>
              )}
            </ul>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Home;
