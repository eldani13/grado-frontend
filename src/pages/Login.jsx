import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import { login } from "../validations/auth";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate(); 

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await login(username, password);
      navigate("/home"); 
    } catch (err) {
      setError(err.detail || "Error al iniciar sesión");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-purple-700 via-blue-900 to-black">
      <div className="w-full max-w-lg p-10 bg-gradient-to-br from-gray-800 via-gray-900 to-black rounded-2xl shadow-xl">
        <div className="flex flex-col items-center mb-8">
          <img src={logo} alt="Logo" className="w-80 mb-6 animate-spin-slow" />
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">Bienvenido</h1>
          <p className="text-gray-400 text-center mt-2">Conéctate a un mundo de posibilidades</p>
        </div>

        {error && (
          <div className="bg-red-600 text-white text-sm rounded p-3 text-center animate-pulse">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-gray-300 text-sm font-semibold mb-2">
              Usuario
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 text-white bg-gray-700 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent placeholder-gray-500"
              placeholder="Ingresa tu usuario"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-gray-300 text-sm font-semibold mb-2">
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 text-white bg-gray-700 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent placeholder-gray-500"
              placeholder="Ingresa tu contraseña"
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 px-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-pink-600 hover:to-purple-600 text-white font-bold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            Iniciar sesión
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
