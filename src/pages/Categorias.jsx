import React, { useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import Nav from "../components/Nav";
import { PlusIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { FolderOpenIcon } from "@heroicons/react/24/outline";

function Categorias() {
  const [categorias, setCategorias] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [error, setError] = useState(null);

  const API_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const response = await fetch(`${API_URL}/api/inventario/categorias/`);
        if (!response.ok) {
          throw new Error('Error al obtener las categorías');
        }
        const data = await response.json();
        setCategorias(data);
      } catch (error) {
        console.error("Error al obtener las categorías:", error);
      }
    };

    fetchCategorias();
  }, [API_URL]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const nuevaCategoria = { nombre, descripcion };
  
    try {
      const response = await fetch(`${API_URL}/api/inventario/categorias/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(nuevaCategoria),
      });
  
      if (!response.ok) {
        throw new Error('Error al crear la categoría');
      }
  
      const data = await response.json();
      setCategorias([...categorias, data]); 
      setIsModalOpen(false); 
      setNombre('');
      setDescripcion('');
      setError(null);
    } catch (error) {
      console.error("Error al crear la categoría:", error);
      setError('Hubo un error al crear la categoría. Inténtalo de nuevo.');
    }
  };

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
              <button 
                onClick={() => setIsModalOpen(true)} 
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
              >
                <PlusIcon className="h-6 w-6 mr-2" /> Agregar Categoría
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {categorias.map((categoria) => (
              <div
                key={categoria.id}
                className="bg-gradient-to-r from-gray-800 to-gray-700 rounded-lg shadow-lg p-6"
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
              </div>
            ))}
          </div>
        </main>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-gray-900 rounded-lg p-8 w-full max-w-md shadow-xl transform transition-all">
            <h2 className="text-3xl font-bold text-center text-white mb-4">Agregar Nueva Categoría</h2>

            {error && (
              <div className="bg-red-500 text-white p-2 rounded-md mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="nombre" className="block text-sm font-medium text-gray-400 mb-1">
                  Nombre
                </label>
                <input 
                  type="text" 
                  id="nombre" 
                  value={nombre} 
                  onChange={(e) => setNombre(e.target.value)} 
                  className="w-full p-3 bg-gray-800 rounded-lg text-white focus:ring-2 focus:ring-blue-600" 
                  required 
                />
              </div>

              <div className="mb-4">
                <label htmlFor="descripcion" className="block text-sm font-medium text-gray-400 mb-1">
                  Descripción
                </label>
                <textarea 
                  id="descripcion" 
                  value={descripcion} 
                  onChange={(e) => setDescripcion(e.target.value)} 
                  className="w-full p-3 bg-gray-800 rounded-lg text-white focus:ring-2 focus:ring-blue-600" 
                  rows="4" 
                  required 
                ></textarea>
              </div>

              <div className="flex justify-end gap-4">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)} 
                  className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
                >
                  Crear
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Categorias;
