import { React, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Nav() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);
  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("username");
    navigate("/");
  };
  return (
    <nav className="bg-gradient-to-r from-purple-700 to-blue-900 px-8 py-4 flex justify-between items-center shadow-lg fixed top-0 left-0 right-0 z-10">
      <div className="text-white text-2xl font-extrabold tracking-tight py-2 border-b border-gray-700">
        <span className="text-blue-400 text-3xl font-semibold">Admin</span>
        <span className="ml-1 text-white">Panel</span>
      </div>

      <div className="flex items-center space-x-4">
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
