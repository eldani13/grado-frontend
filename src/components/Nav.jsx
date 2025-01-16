import { React, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BellIcon } from "@heroicons/react/24/outline";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function Nav({ notificationSettings }) {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [stockBajo, setStockBajo] = useState(0);
  const [productosStockBajo, setProductosStockBajo] = useState([]);
  const [prevPedidos, setPrevPedidos] = useState([]);
  const [nuevosPedidos, setNuevosPedidos] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showNotificationCount, setShowNotificationCount] = useState(true);
  const [notificationMessage, setNotificationMessage] = useState("");

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    }

    const fetchProductos = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/inventario/productos/`
        );
        if (!response.ok) throw new Error("Error al obtener productos");
        const data = await response.json();

        const productosConStockBajo = data.filter(
          (producto) => producto.cantidad < 5
        );
        setStockBajo(productosConStockBajo.length);
        setProductosStockBajo(productosConStockBajo);
      } catch (error) {
        console.error(error.message);
      }
    };

    fetchProductos();
  }, []);

  useEffect(() => {
    const fetchPedidos = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/inventario/pedido/`);
        if (!response.ok) throw new Error("Error al obtener pedidos");
        const data = await response.json();

        if (prevPedidos.length > 0 && data.length > prevPedidos.length) {
          const nuevos = data.filter(
            (pedido) => !prevPedidos.some((prev) => prev.id === pedido.id)
          );
          setNuevosPedidos((prev) => [...prev, ...nuevos].slice(-5)); 
        }

        setPrevPedidos(data);
      } catch (error) {
        console.error("Error al obtener pedidos:", error.message);
      }
    };

    fetchPedidos();

    const interval = setInterval(fetchPedidos, 5000);
    return () => clearInterval(interval);
  }, [prevPedidos]);

  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("username");
    localStorage.removeItem("rol");

    navigate("/");
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    if (!isMenuOpen) {
      setShowNotificationCount(false); 
    }
  };

  const handleBellClick = () => {
    if (!notificationSettings) {
      setNotificationMessage("Las notificaciones están desactivadas.");
    } else {
      setNotificationMessage(""); 
    }
  };

  return (
    <nav className="bg-gray-400 dark:bg-gradient-to-r dark:from-purple-700 dark:to-blue-900 px-8 py-4 flex justify-between items-center shadow-lg fixed top-0 left-0 right-0 z-10">
      <div className="text-white text-2xl font-extrabold tracking-tight py-2 border-b border-gray-700">
        <span className="text-black dark:text-blue-400 text-3xl font-semibold">Admin</span>
        <span className="ml-1 text-white">Panel</span>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative">
          <button onClick={toggleMenu} onFocus={handleBellClick}>
            <BellIcon className="h-8 w-8 text-white" />
          </button>
          {notificationSettings &&
            showNotificationCount &&
            (stockBajo > 0 || nuevosPedidos.length > 0) && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] font-bold rounded-full px-2 py-1">
                {stockBajo + nuevosPedidos.length}
              </span>
            )}

          {isMenuOpen && (
            <div className="absolute right-0 mt-2 w-72 bg-white border border-gray-200 rounded-lg shadow-xl p-5 transform transition-all duration-300 ease-in-out">
              <h3 className="text-lg font-bold text-gray-800 border-b pb-2 mb-3">
                Notificaciones
              </h3>
              <ul className="space-y-3 max-h-64 overflow-y-auto">
                {!notificationSettings ? (
                  <li className="bg-gray-100 p-4 rounded-lg text-gray-500 text-center">
                    Las notificaciones están desactivadas.
                  </li>
                ) : (
                  <>
                    {productosStockBajo.length > 0 && (
                      <div>
                        <h4 className="text-gray-800 font-semibold text-sm mb-2">
                          🔔 Productos con stock bajo:
                        </h4>
                        {productosStockBajo.map((producto) => (
                          <li
                            key={producto.id}
                            className="flex items-center justify-between bg-gray-50 p-3 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
                          >
                            <span className="text-gray-700 text-sm font-medium">
                              {producto.equipo}
                            </span>
                            <span className="text-red-500 font-bold text-xs">
                              Cantidad: {producto.cantidad}
                            </span>
                          </li>
                        ))}
                      </div>
                    )}
                    {nuevosPedidos.length > 0 && (
                      <div className="mt-4">
                        <h4 className="text-gray-800 font-semibold text-sm mb-2">
                          📦 Nuevos pedidos:
                        </h4>
                        {nuevosPedidos.map((pedido) => (
                          <li
                            key={pedido.id}
                            className="flex items-center justify-between bg-gray-50 p-3 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
                          >
                            <span className="text-gray-700 text-sm font-medium">
                              Pedido:
                            </span>
                            <span className="text-blue-500 font-bold text-xs">
                              {pedido.nombre_cliente}
                            </span>
                          </li>
                        ))}
                      </div>
                    )}
                    {productosStockBajo.length === 0 &&
                      nuevosPedidos.length === 0 && (
                        <li className="bg-gray-100 p-4 rounded-lg text-gray-500 text-center">
                          No hay notificaciones.
                        </li>
                      )}
                  </>
                )}
              </ul>
              <button
                className="mt-4 w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-2 px-4 rounded-lg shadow hover:shadow-lg transition-shadow duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                Cerrar
              </button>
            </div>
          )}
        </div>
        <span className="text-white font-medium text-lg">
          Hola, {username || "Usuario"}
        </span>
        <button
          className="bg-gradient-to-r from-red-500 to-red-700 text-white px-5 py-2 rounded-lg shadow-md hover:bg-gradient-to-r hover:from-red-600 hover:to-red-800 transition duration-300 ease-in-out transform hover:scale-105"
          onClick={handleLogout}
        >
          Cerrar sesión
        </button>
      </div>
    </nav>
  );
}
