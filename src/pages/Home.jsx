import React from "react";
import NavBar from "../components/NavBar";

function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-tr from-gray-900 via-gray-800 to-black text-white">
      <nav className="bg-gradient-to-r from-purple-700 to-blue-900 px-8 py-4 flex justify-between items-center shadow-lg fixed top-0 left-0 right-0 z-10">
        <div className="text-white text-2xl font-extrabold tracking-tight py-2 border-b border-gray-700">
          <span className="text-blue-400 text-3xl font-semibold">Admin</span>
          <span className="ml-1 text-white">Panel</span>
        </div>

        <button className="bg-gradient-to-r from-red-500 to-red-700 text-white px-5 py-2 rounded-lg shadow-md hover:bg-gradient-to-r hover:from-red-600 hover:to-red-800 transition duration-300 ease-in-out transform hover:scale-105">
          Cerrar sesión
        </button>
      </nav>

      <div className="flex flex-1 pt-20">
        {" "}
        <NavBar />
        <main className="flex-1 p-8 overflow-auto ml-64">
          {" "}
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-4xl font-extrabold">Resumen</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div className="p-6 bg-gradient-to-br from-purple-800 to-blue-900 rounded-xl shadow-xl">
              <h3 className="text-sm font-semibold text-gray-300">
                Productos Totales
              </h3>
              <p className="text-3xl font-bold text-white">120</p>
            </div>
            <div className="p-6 bg-gradient-to-br from-blue-800 to-purple-900 rounded-xl shadow-xl">
              <h3 className="text-sm font-semibold text-gray-300">
                Categorías
              </h3>
              <p className="text-3xl font-bold text-white">15</p>
            </div>
            <div className="p-6 bg-gradient-to-br from-red-700 to-red-900 rounded-xl shadow-xl">
              <h3 className="text-sm font-semibold text-gray-300">
                Stock Bajo
              </h3>
              <p className="text-3xl font-bold text-white">8</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-6 bg-gradient-to-br from-green-800 to-green-900 rounded-xl shadow-xl">
              <h3 className="text-sm font-semibold text-gray-300">
                Ventas del Día
              </h3>
              <p className="text-3xl font-bold text-white">$1,200.00</p>
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
            <div className="h-64 bg-gray-700 rounded-lg flex items-center justify-center">
              <p className="text-gray-400">[Gráfica Placeholder]</p>
            </div>
          </div>
          <div className="mt-8 bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-xl shadow-xl">
            <h3 className="text-xl font-bold mb-4 text-gray-200">
              Actividad Reciente
            </h3>
            <ul className="space-y-4">
              <li className="text-gray-300">
                Se agregó un nuevo producto:{" "}
                <span className="font-bold text-white">Producto X</span>.
              </li>
              <li className="text-gray-300">
                Se actualizó el stock de{" "}
                <span className="font-bold text-white">Producto Y</span>.
              </li>
              <li className="text-gray-300">
                Se registró una nueva venta de{" "}
                <span className="font-bold text-white">$500</span>.
              </li>
            </ul>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Home;
