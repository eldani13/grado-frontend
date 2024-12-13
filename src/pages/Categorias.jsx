import { React } from "react";
import NavBar from "../components/NavBar";
import Nav from "../components/Nav";
import {
  PlusIcon,
  FolderIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import { FolderOpenIcon } from "@heroicons/react/24/outline";

function Categorias() {
  const categorias = [
    {
      id: 1,
      nombre: "Tecnología",
      descripcion: "Dispositivos y accesorios avanzados.",
    },
    { id: 2, nombre: "Hogar", descripcion: "Todo para mejorar tu espacio." },
    { id: 3, nombre: "Moda", descripcion: "Estilo y confort a tu alcance." },
    {
      id: 4,
      nombre: "Deportes",
      descripcion: "Equipo y accesorios deportivos.",
    },
    { id: 5, nombre: "Salud", descripcion: "Cuidado personal y bienestar." },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-tr from-gray-900 via-gray-800 to-black text-white">
      <Nav />

      <div className="flex flex-1 pt-20">
        <NavBar />
        <main className="flex-1 p-8 overflow-auto ml-64">
          <div className="flex items-center justify-between pb-8 border-b border-gray-700">
            <h1 className="text-4xl font-extrabold text-white">Categorías</h1>
            <div className="flex items-center gap-4">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute h-6 w-6 text-gray-400 left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Buscar categorías..."
                  className="pl-10 pr-4 py-2 rounded-md bg-gray-800 text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
              <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition">
                <PlusIcon className="h-6 w-6 mr-2" /> Agregar Categoría
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {categorias.map((categoria) => (
              <div
                key={categoria.id}
                className="bg-gradient-to-r from-gray-800 to-gray-700 rounded-lg shadow-lg p-6 "
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <FolderOpenIcon className="h-8 w-8 text-blue-400 mr-3" />
                    <h2 className="text-2xl font-semibold text-white">
                      {categoria.nombre}
                    </h2>
                  </div>
                </div>
                <p className="text-gray-300">{categoria.descripcion}</p>
                <button className="mt-4 w-full bg-blue-500 text-white py-2 rounded-lg shadow-md hover:bg-blue-600 transition-all duration-300">
                  Ver Detalles
                </button>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}

export default Categorias;
