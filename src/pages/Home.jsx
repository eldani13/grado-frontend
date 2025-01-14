import React, { useState, useEffect } from "react";
import NavBar from "../components/NavBar";
import Nav from "../components/Nav";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { color } from "chart.js/helpers";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function Home() {
  const [totalProductos, setTotalProductos] = useState(0);
  const [totalCategorias, setTotalCategorias] = useState(0);
  const [stockBajo, setStockBajo] = useState(0);
  const [ventasDiarias, setVentasDiarias] = useState([]);
  const [ventasTotales, setVentasTotales] = useState(0);
  const [totalDelDia, setTotalDelDia] = useState(0);
  const [actividades, setActividades] = useState([]);
  const [labelsFiltrados, setLabelsFiltrados] = useState([]);
  const [dataFiltrada, setDataFiltrada] = useState([]);
  const [pedidosPendientes, setPedidosPendientes] = useState(0);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const userRole = localStorage.getItem("rol");

  const fetchProductos = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/inventario/productos/`);
      if (!response.ok) throw new Error("Error al obtener productos");
      const data = await response.json();
      setTotalProductos(data.length);
      const stockBajoCount = data.filter(
        (producto) => producto.cantidad < 5
      ).length;
      setStockBajo(stockBajoCount);
    } catch (error) {
      console.error(error.message);
    }
  };

  const fetchCategorias = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/inventario/categorias/`
      );
      if (!response.ok) throw new Error("Error al obtener categorías");
      const data = await response.json();
      setTotalCategorias(data.length);
    } catch (error) {
      console.error(error.message);
    }
  };

  const fetchPedidos = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/inventario/pedido/`);
      if (!response.ok) throw new Error("Error al obtener los pedidos");

      const data = await response.json();

      const pedidosFiltrados = data.filter(
        (pedido) =>
          pedido.estado === "disponible" || pedido.estado === "no_disponible"
      );

      const totalPedidos = pedidosFiltrados.length;
      setPedidosPendientes(totalPedidos);
    } catch (error) {
      console.error(error.message);
    }
  };

  const fetchActividades = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/inventario/actividades/`
      );
      if (!response.ok) throw new Error("Error al obtener actividades");
      const data = await response.json();
      const mensajes = data.map((actividad) => {
        switch (actividad.tipo) {
          case "factura":
            return `Se registró una nueva factura de $${
              actividad.valor_total || "0"
            }.`;
          case "reporte":
            return ` ${
              actividad.descripcion || "desconocido"
            }.`;
          case "producto":
            return `Se creo un nuevo producto: ${
              actividad.equipo || "desconocida"
            }.`;
          case "categoria":
            return `Se creo una nueva categoria: ${
              actividad.nombre || "sin descripción"
            }.`;
          default:
            return "Actividad desconocida.";
        }
      });
      setActividades(mensajes);
    } catch (error) {
      console.error(error.message);
    }
  };

  const fetchResumen = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/inventario/resumen/`);
      if (!response.ok) throw new Error("Error al obtener el resumen");

      const data = await response.json();
      // console.log("Datos del resumen:", data); 

      const resumen = data.datos || {};
      setVentasTotales(resumen.ventas_totales || 0);
      setTotalDelDia(resumen.total_del_dia || 0);

      const ventasCompletas = resumen.ventas_diarias || Array(7).fill(0);
      // console.log("Ventas completas:", ventasCompletas); 

      setVentasDiarias(ventasCompletas);
      setLabelsFiltrados([
        "Lunes",
        "Martes",
        "Miércoles",
        "Jueves",
        "Viernes",
        "Sábado",
        "Domingo",
      ]);
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    fetchProductos();
    fetchCategorias();
    fetchResumen();
    fetchActividades();
    fetchPedidos();
  }, []);

  useEffect(() => {
    const diasSemana = [
      "Lunes",
      "Martes",
      "Miércoles",
      "Jueves",
      "Viernes",
      "Sábado",
      "Domingo",
    ];

    const diaActual = new Date().getDay(); 
    const ultimoDiaGuardado = localStorage.getItem("ultimoDiaGuardado");

    if (ultimoDiaGuardado !== `${diaActual}`) {
      localStorage.setItem("ultimoDiaGuardado", `${diaActual}`);
      setVentasDiarias(Array(7).fill(0)); 
      setLabelsFiltrados(diasSemana);
    } else {
      const ventasCompletas = diasSemana.map((_, index) => {
        if (index === diaActual) {
          return totalDelDia || 0; 
        }
        return ventasDiarias[index] || 0; 
      });

      setLabelsFiltrados(diasSemana);
      setDataFiltrada(ventasCompletas); 
    }
  }, [ventasDiarias, totalDelDia]); 

  const data = {
    labels: labelsFiltrados,
    datasets: [
      {
        label: "Ventas Diarias ($)",
        data: dataFiltrada, 
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  // console.log("Ventas Diarias:", ventasDiarias); 
  // console.log("Labels Filtrados:", labelsFiltrados); 

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
      },
    },
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Ventas diaria",
        color: "#fff",
      },
    },
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
              <p className="text-3xl font-bold text-white">
                ${totalDelDia ? totalDelDia.toLocaleString() : "0.00"}
              </p>
            </div>
            {userRole !== "cliente" && (
              <div className="p-6 bg-gradient-to-br from-green-800 to-green-900 rounded-xl shadow-xl">
                <h3 className="text-sm font-semibold text-gray-300">
                  Ventas totales
                </h3>
                <p className="text-3xl font-bold text-white">
                  ${ventasTotales ? ventasTotales.toLocaleString() : "0.00"}
                </p>
              </div>
            )}
            <div className="p-6 bg-gradient-to-br from-orange-800 to-orange-900 rounded-xl shadow-xl">
              <h3 className="text-sm font-semibold text-gray-300">
                Pedidos Pendientes
              </h3>
              <p className="text-3xl font-bold text-white">
                {pedidosPendientes}
              </p>
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

          {userRole !== "cliente" && (
            <div className="mt-8 bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-xl shadow-xl">
              <h3 className="text-xl font-bold mb-4 text-gray-200">
                Actividad Reciente
              </h3>
              <div className="max-h-40 overflow-y-auto">
                <ul className="space-y-4">
                  {actividades.length > 0 ? (
                    actividades.map((mensaje, index) => (
                      <li key={index} className="text-gray-300">
                        {mensaje}
                      </li>
                    ))
                  ) : (
                    <li className="text-gray-500">
                      No hay actividades recientes.
                    </li>
                  )}
                </ul>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default Home;
