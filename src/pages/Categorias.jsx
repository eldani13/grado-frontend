import React, { useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import Nav from "../components/Nav";
import {
  PlusIcon,
  MagnifyingGlassIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { FolderOpenIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";

function Categorias() {
  const [categorias, setCategorias] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [categoriaId, setCategoriaId] = useState(null);

  const API_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const response = await fetch(`${API_URL}/api/inventario/categorias/`);
        if (!response.ok) {
          throw new Error("Error al obtener las categorías");
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

    const categoria = { nombre, descripcion };
    const url = editMode
      ? `${API_URL}/api/inventario/categorias/${categoriaId}/`
      : `${API_URL}/api/inventario/categorias/`;

    const method = editMode ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(categoria),
      });

      if (!response.ok) {
        throw new Error(
          editMode
            ? "Error al editar la categoría"
            : "Error al crear la categoría"
        );
      }

      const data = await response.json();
      if (editMode) {
        setCategorias(categorias.map((c) => (c.id === categoriaId ? data : c)));
      } else {
        setCategorias([...categorias, data]);
      }
      setIsModalOpen(false);
      setNombre("");
      setDescripcion("");
      setError(null);
      setEditMode(false);
      setCategoriaId(null);
    } catch (error) {
      console.error("Error al guardar la categoría:", error);
      setError("Hubo un error al guardar la categoría. Inténtalo de nuevo.");
    }
  };

  const handleEdit = (categoria) => {
    setNombre(categoria.nombre);
    setDescripcion(categoria.descripcion);
    setCategoriaId(categoria.id);
    setEditMode(true);
    setIsModalOpen(true);
  };

  const handleDelete = async (categoriaId) => {
    try {
      const response = await fetch(
        `${API_URL}/api/inventario/categorias/${categoriaId}/`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Error al eliminar la categoría");
      }

      setCategorias(
        categorias.filter((categoria) => categoria.id !== categoriaId)
      );
    } catch (error) {
      console.error("Error al eliminar la categoría:", error);
      setError("Hubo un error al eliminar la categoría. Inténtalo de nuevo.");
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
                className="bg-gradient-to-r from-gray-800 to-gray-700 rounded-lg shadow-lg p-6 flex flex-col"
              >
                <div className="mb-4">
                  <div className="flex items-center mb-3">
                    <FolderOpenIcon className="h-8 w-8 text-blue-400 mr-3" />
                    <h2 className="text-2xl font-semibold text-white">
                      {categoria.nombre}
                    </h2>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-gray-300">{categoria.descripcion}</p>
                </div>

                <div className="flex justify-between">
                  <button
                    onClick={() => handleEdit(categoria)}
                    className="bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 flex items-center"
                  >
                    <PencilIcon className="h-5 w-5 mr-2" />
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(categoria.id)}
                    className="bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700 flex items-center"
                  >
                    <TrashIcon className="h-5 w-5 mr-2" />
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center">
          <motion.div
            className="bg-gray-900 rounded-lg p-8 w-full max-w-md shadow-xl"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-3xl font-bold text-center text-white mb-4">
              {editMode ? "Editar Categoría" : "Agregar Nueva Categoría"}
            </h2>

            {error && (
              <div className="bg-red-500 text-white p-2 rounded-md mb-4">
                {error}
              </div>
            )}

            {error && (
              <div className="bg-red-500 text-white p-2 rounded-md mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label
                  htmlFor="nombre"
                  className="block text-sm font-medium text-gray-400 mb-1"
                >
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
                <label
                  htmlFor="descripcion"
                  className="block text-sm font-medium text-gray-400 mb-1"
                >
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
                  {editMode ? "Actualizar" : "Crear"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}

export default Categorias;
