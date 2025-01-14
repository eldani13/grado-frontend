import { React, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BellIcon } from "@heroicons/react/24/outline";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function Nav() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [stockBajo, setStockBajo] = useState(0);
  const [productosStockBajo, setProductosStockBajo] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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

  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("username");
    localStorage.removeItem("rol");

    navigate("/");
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-gradient-to-r from-purple-700 to-blue-900 px-8 py-4 flex justify-between items-center shadow-lg fixed top-0 left-0 right-0 z-10">
      <div className="text-white text-2xl font-extrabold tracking-tight py-2 border-b border-gray-700">
        <span className="text-blue-400 text-3xl font-semibold">Admin</span>
        <span className="ml-1 text-white">Panel</span>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative">
          <button onClick={toggleMenu}>
            <BellIcon className="h-8 w-8 text-white" />
          </button>
          {stockBajo > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] font-bold rounded-full px-2 py-1">
              {stockBajo}
            </span>
          )}

          {isMenuOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white border rounded-lg shadow-lg p-4">
              <h3 className="font-bold text-gray-700">Stock bajo</h3>
              <ul className="mt-2">
                {productosStockBajo.length > 0 ? (
                  productosStockBajo.map((producto) => (
                    <li
                      key={producto.id}
                      className="text-gray-600 text-sm py-1 border-b last:border-none"
                    >
                      {producto.equipo} (Cantidad: {producto.cantidad})
                    </li>
                  ))
                ) : (
                  <li className="text-gray-500 text-sm">
                    No hay productos con stock bajo.
                  </li>
                )}
              </ul>
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
