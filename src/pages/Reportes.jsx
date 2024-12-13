import { React, useState } from "react";
import NavBar from "../components/NavBar";
import Nav from "../components/Nav";
import { PlusIcon, ChartBarIcon, TrashIcon } from "@heroicons/react/24/outline";

function Reportes() {
  const [tipos, setTipos] = useState([]);
  const [nuevoTipo, setNuevoTipo] = useState("");

  const agregarTipo = () => {
    if (nuevoTipo.trim() !== "") {
      setTipos([...tipos, nuevoTipo]);
      setNuevoTipo("");
    }
  };

  const eliminarTipo = (tipo) => {
    setTipos(tipos.filter((t) => t !== tipo));
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-tr from-gray-900 via-gray-800 to-black text-white">
      <Nav />

      <div className="flex flex-1 pt-20">
        <NavBar />
        <main className="flex-1 p-8 overflow-auto ml-64">
          <div className="pb-8 border-b border-gray-700">
            <h1 className="text-4xl font-extrabold text-white">Generar Reportes</h1>
            <p className="text-gray-400 mt-2">
              Crea y gestiona los tipos de reportes para analizar los datos de forma profesional.
            </p>
          </div>

          <div className="mt-8">
            <h2 className="text-2xl font-bold text-white mb-4">Agregar Tipo de Reporte</h2>
            <div className="flex gap-4 items-center mb-6">
              <input
                type="text"
                value={nuevoTipo}
                onChange={(e) => setNuevoTipo(e.target.value)}
                placeholder="Escribe el nombre del tipo de reporte"
                className="flex-1 px-4 py-2 rounded-md bg-gray-800 text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
              <button
                onClick={agregarTipo}
                className="flex items-center bg-gradient-to-r from-blue-500 to-blue-700 text-white px-5 py-3 rounded-lg shadow-md hover:from-blue-600 hover:to-blue-800 transition-all duration-300 transform hover:scale-105"
              >
                <PlusIcon className="h-6 w-6 mr-2" /> Agregar
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {tipos.map((tipo, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-r from-gray-800 to-gray-700 rounded-lg shadow-lg p-6 hover:shadow-2xl hover:scale-105 transition-transform duration-300"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                    <ChartBarIcon className="h-8 w-8 text-blue-400 mr-3" />
                      <h3 className="text-xl font-bold text-white">{tipo}</h3>
                    </div>
                    <button
                      onClick={() => eliminarTipo(tipo)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                    >
                      <TrashIcon className="h-6 w-6" />
                    </button>
                  </div>
                  <p className="text-gray-300 mt-4">
                    Genera reportes personalizados para el tipo: <span className="text-blue-400">{tipo}</span>.
                  </p>
                  <button
                    className="mt-4 w-full bg-blue-500 text-white py-2 rounded-lg shadow-md hover:bg-blue-600 transition-all duration-300"
                  >
                    Generar Reporte
                  </button>
                </div>
              ))}
            </div>

            {tipos.length === 0 && (
              <p className="text-gray-400 mt-6 text-center">
                No hay tipos de reportes creados. Comienza agregando uno.
              </p>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default Reportes;
