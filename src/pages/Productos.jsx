import React, { useState, useEffect } from "react";
import NavBar from "../components/NavBar";
import Nav from "../components/Nav";
import {
  MagnifyingGlassIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
} from "@heroicons/react/24/outline";
import { motion, AnimatePresence } from "framer-motion";

function Productos() {
  const [productos, setProductos] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editarModalOpen, setEditarModalOpen] = useState(false);
  const [detalleModalOpen, setDetalleModalOpen] = useState(false);
  const [categorias, setCategorias] = useState([]);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [productoEditado, setProductoEditado] = useState(null);
  const [nuevoProducto, setNuevoProducto] = useState({
    equipo: "",
    referencia: "",
    marca: "",
    serial: "",
    cantidad: 1,
    descripcion: "",
    categoria: "",
    fecha_entrada: "",
    valor: 0,
    observaciones: "",
    estado: "",
    esta_en_mantenimiento: "",
  });

  const API_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const response = await fetch(`${API_URL}/api/inventario/productos/`);
        const data = await response.json();
        setProductos(data);
      } catch (error) {
        console.error("Error al obtener los productos:", error);
      }
    };

    fetchProductos();
  }, [API_URL]);

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const response = await fetch(`${API_URL}/api/inventario/categorias/`);
        const data = await response.json();
        setCategorias(data);
      } catch (error) {
        console.error("Error al obtener las categorías:", error);
      }
    };

    fetchCategorias();
  }, [API_URL]);

  const abrirModal = () => {
    setModalOpen(true);
  };

  const cerrarModal = () => {
    setModalOpen(false);
  };

  const abrirEditarModal = (producto) => {
    setProductoEditado(producto);
    setEditarModalOpen(true);
  };

  const cerrarEditarModal = () => {
    setEditarModalOpen(false);
    setProductoEditado(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNuevoProducto((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setProductoEditado((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    const fecha = new Date(nuevoProducto.fecha_entrada);
    const fechaEntradaFormateada = fecha.toISOString().split("T")[0];

    const productoConFechaCorregida = {
      ...nuevoProducto,
      fecha_entrada: fechaEntradaFormateada,
    };

    try {
      const response = await fetch(`${API_URL}/api/inventario/productos/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productoConFechaCorregida),
      });

      if (response.ok) {
        const data = await response.json();
        setProductos([...productos, data]);
        cerrarModal();
      } else {
        const errorData = await response.json();
        console.error("Error al guardar el producto:", errorData);
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
    }
  };

  const handleEdit = async () => {
    const fecha = new Date(productoEditado.fecha_entrada);
    const fechaEntradaFormateada = fecha.toISOString().split("T")[0];

    const productoConFechaCorregida = {
      ...productoEditado,
      fecha_entrada: fechaEntradaFormateada,
    };

    try {
      const response = await fetch(
        `${API_URL}/api/inventario/productos/${productoEditado.id}/`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(productoConFechaCorregida),
        }
      );

      if (response.ok) {
        const data = await response.json();
        const updatedProductos = productos.map((producto) =>
          producto.id === data.id ? data : producto
        );
        setProductos(updatedProductos);
        cerrarEditarModal();
      } else {
        const errorData = await response.json();
        console.error("Error al editar el producto:", errorData);
      }
    } catch (error) {
      console.error("Error en la solicitud de edición:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(
        `${API_URL}/api/inventario/productos/${id}/`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        setProductos(productos.filter((producto) => producto.id !== id));
      } else {
        const errorData = await response.json();
        console.error("Error al eliminar el producto:", errorData);
      }
    } catch (error) {
      console.error("Error en la solicitud de eliminación:", error);
    }
  };

  const abrirDetalleModal = (producto) => {
    setProductoSeleccionado(producto);
    setDetalleModalOpen(true);
  };

  const cerrarDetalleModal = () => {
    setDetalleModalOpen(false);
    setProductoSeleccionado(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-tr from-gray-900 via-gray-800 to-black text-white">
      <Nav />
      <div className="flex flex-1 pt-20">
        <NavBar />
        <main className="flex-1 p-8 overflow-auto ml-64">
          <div className="flex items-center justify-between pb-8 border-b border-gray-700">
            <h1 className="text-4xl font-extrabold text-white">Productos</h1>
            <div className="flex items-center gap-4">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute h-6 w-6 text-gray-400 left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Buscar productos..."
                  className="pl-10 pr-4 py-2 rounded-md bg-gray-800 text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
              <button
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
                onClick={abrirModal}
              >
                <PlusIcon className="h-6 w-6 mr-2" />
                Agregar Producto
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {productos.map((producto) => (
              <div
                key={producto.id}
                className="bg-gray-800 rounded-lg shadow-lg p-6 relative"
              >
                <div className="flex flex-col gap-1">
                  <h2 className="text-xl font-bold">{producto.equipo}</h2>
                  <p>
                    <strong>Referencia:</strong> {producto.referencia}
                  </p>
                  <p>
                    <strong>Marca:</strong> {producto.marca}
                  </p>
                  <div className="flex flex-row gap-3">
                    <button
                      onClick={() => abrirDetalleModal(producto)}
                      className="bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700"
                    >
                      <EyeIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => abrirEditarModal(producto)}
                      className="bg-yellow-600 text-white px-3 py-1 rounded-md hover:bg-yellow-700"
                    >
                      <PencilIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(producto.id)}
                      className="bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>

      {modalOpen && (
        <AnimatePresence>
          <motion.div
            className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="bg-gray-800 p-6 rounded-lg w-[800px] max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              transition={{ duration: 0.3 }}
            >
              <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
                <div className="bg-gray-800 p-6 rounded-lg w-[800px] max-h-[90vh] overflow-y-auto">
                  <h2 className="text-2xl font-bold">Crear Producto</h2>
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="mt-4">
                      <label className="text-gray-400">Equipo</label>
                      <input
                        type="text"
                        name="equipo"
                        value={nuevoProducto.equipo}
                        onChange={handleChange}
                        className="w-full p-2 bg-gray-700 text-gray-300 rounded-md"
                      />
                    </div>
                    <div className="mt-4">
                      <label className="text-gray-400">Referencia</label>
                      <input
                        type="text"
                        name="referencia"
                        value={nuevoProducto.referencia}
                        onChange={handleChange}
                        className="w-full p-2 bg-gray-700 text-gray-300 rounded-md"
                      />
                    </div>
                    <div className="mt-4">
                      <label className="text-gray-400">Marca</label>
                      <input
                        type="text"
                        name="marca"
                        value={nuevoProducto.marca}
                        onChange={handleChange}
                        className="w-full p-2 bg-gray-700 text-gray-300 rounded-md"
                      />
                    </div>
                    <div className="mt-4">
                      <label className="text-gray-400">Serial</label>
                      <input
                        type="text"
                        name="serial"
                        value={nuevoProducto.serial}
                        onChange={handleChange}
                        className="w-full p-2 bg-gray-700 text-gray-300 rounded-md"
                      />
                    </div>
                    <div className="mt-4">
                      <label className="text-gray-400">Categoría</label>
                      <select
                        name="categoria"
                        value={nuevoProducto.categoria}
                        onChange={handleChange}
                        className="w-full p-2 bg-gray-700 text-gray-300 rounded-md"
                      >
                        <option value="">Selecciona una categoría</option>
                        {categorias.map((categoria) => (
                          <option key={categoria.id} value={categoria.id}>
                            {categoria.nombre}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="mt-4">
                      <label className="text-gray-400">Fecha de Entrada</label>
                      <input
                        type="date"
                        name="fecha_entrada"
                        value={nuevoProducto.fecha_entrada}
                        onChange={handleChange}
                        className="w-full p-2 bg-gray-700 text-gray-300 rounded-md"
                      />
                    </div>
                    <div className="mt-4">
                      <label className="text-gray-400">Estado</label>
                      <select
                        name="estado"
                        value={nuevoProducto.estado}
                        onChange={handleChange}
                        className="w-full p-2 bg-gray-700 text-gray-300 rounded-md"
                      >
                        <option value="">Selecciona un estado</option>
                        <option value="disponible">Disponible</option>
                        <option value="prestado">Prestado</option>
                        <option value="en_mantenimiento">
                          En Mantenimiento
                        </option>
                        <option value="retirado">Retirado</option>
                      </select>
                    </div>
                    <div className="mt-4">
                      <label className="text-gray-400">Cantidad</label>
                      <input
                        type="number"
                        name="cantidad"
                        value={nuevoProducto.cantidad}
                        onChange={handleChange}
                        className="w-full p-2 bg-gray-700 text-gray-300 rounded-md"
                      />
                    </div>
                    <div className="mt-4">
                      <label className="text-gray-400">Valor</label>
                      <input
                        type="number"
                        name="valor"
                        value={nuevoProducto.valor}
                        onChange={handleChange}
                        className="w-full p-2 bg-gray-700 text-gray-300 rounded-md"
                      />
                    </div>
                    <div className="mt-4">
                      <label className="text-gray-400">Mantenimiento</label>
                      <select
                        name="esta_en_mantenimiento"
                        value={nuevoProducto.esta_en_mantenimiento}
                        onChange={handleChange}
                        className="w-full p-2 bg-gray-700 text-gray-300 rounded-md"
                      >
                        <option value="">Selecciona un estado</option>
                        <option value="true">Si</option>
                        <option value="false">No</option>
                      </select>
                    </div>
                    <div className="mt-4">
                      <label className="text-gray-400">Observaciones</label>
                      <input
                        type="text"
                        name="observaciones"
                        value={nuevoProducto.observaciones}
                        onChange={handleChange}
                        className="w-full p-2 bg-gray-700 text-gray-300 rounded-md"
                      />
                    </div>
                    <div className="mt-4">
                      <label className="text-gray-400">Descripción</label>
                      <input
                        type="text"
                        name="descripcion"
                        value={nuevoProducto.descripcion}
                        onChange={handleChange}
                        className="w-full p-2 bg-gray-700 text-gray-300 rounded-md"
                      />
                    </div>
                  </div>
                  <button
                    onClick={handleSave}
                    className="mt-4 bg-blue-600 px-4 py-2 rounded-md"
                  >
                    Guardar
                  </button>
                  <button
                    onClick={cerrarModal}
                    className="ml-4 bg-red-600 px-4 py-2 rounded-md"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      )}

      {editarModalOpen && productoEditado && (
        <AnimatePresence>
          <motion.div
            className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="bg-gray-800 p-6 rounded-lg w-[800px] max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              transition={{ duration: 0.3 }}
            >
              <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
                <div className="bg-gray-800 p-6 rounded-lg w-[800px] max-h-[90vh] overflow-y-auto">
                  <h2 className="text-2xl font-bold">Editar Producto</h2>
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="mt-4">
                      <label className="text-gray-400">Equipo</label>
                      <input
                        type="text"
                        name="equipo"
                        value={productoEditado.equipo}
                        onChange={handleEditChange}
                        className="mt-2 p-2 w-full bg-gray-700 rounded-md text-white"
                      />
                    </div>
                    <div className="mt-4">
                      <label className="text-gray-400">Referencia</label>
                      <input
                        type="text"
                        name="referencia"
                        value={productoEditado.referencia}
                        onChange={handleEditChange}
                        className="mt-2 p-2 w-full bg-gray-700 rounded-md text-white"
                      />
                    </div>
                    <div className="mt-4">
                      <label className="text-gray-400">Marca</label>
                      <input
                        type="text"
                        name="marca"
                        value={productoEditado.marca}
                        onChange={handleEditChange}
                        className="w-full p-2 bg-gray-700 text-gray-300 rounded-md"
                      />
                    </div>
                    <div className="mt-4">
                      <label className="text-gray-400">Serial</label>
                      <input
                        type="text"
                        name="serial"
                        value={productoEditado.serial}
                        onChange={handleEditChange}
                        className="w-full p-2 bg-gray-700 text-gray-300 rounded-md"
                      />
                    </div>
                    <div className="mt-4">
                      <label className="text-gray-400">Categoría</label>
                      <select
                        name="categoria"
                        value={productoEditado.categoria}
                        onChange={handleEditChange}
                        className="w-full p-2 bg-gray-700 text-gray-300 rounded-md"
                      >
                        <option value="">Selecciona una categoría</option>
                        {categorias.map((categoria) => (
                          <option key={categoria.id} value={categoria.id}>
                            {categoria.nombre}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="mt-4">
                      <label className="text-gray-400">Fecha de Entrada</label>
                      <input
                        type="date"
                        name="fecha_entrada"
                        value={productoEditado.fecha_entrada}
                        onChange={handleEditChange}
                        className="w-full p-2 bg-gray-700 text-gray-300 rounded-md"
                      />
                    </div>
                    <div className="mt-4">
                      <label className="text-gray-400">Estado</label>
                      <select
                        name="estado"
                        value={productoEditado.estado}
                        onChange={handleEditChange}
                        className="w-full p-2 bg-gray-700 text-gray-300 rounded-md"
                      >
                        <option value="">Selecciona un estado</option>
                        <option value="disponible">Disponible</option>
                        <option value="prestado">Prestado</option>
                        <option value="en_mantenimiento">
                          En Mantenimiento
                        </option>
                        <option value="retirado">Retirado</option>
                      </select>
                    </div>
                    <div className="mt-4">
                      <label className="text-gray-400">Cantidad</label>
                      <input
                        type="number"
                        name="cantidad"
                        value={productoEditado.cantidad}
                        onChange={handleEditChange}
                        className="w-full p-2 bg-gray-700 text-gray-300 rounded-md"
                      />
                    </div>
                    <div className="mt-4">
                      <label className="text-gray-400">Valor</label>
                      <input
                        type="number"
                        name="valor"
                        value={productoEditado.valor}
                        onChange={handleEditChange}
                        className="w-full p-2 bg-gray-700 text-gray-300 rounded-md"
                      />
                    </div>
                    <div className="mt-4">
                      <label className="text-gray-400">Mantenimiento</label>
                      <select
                        name="esta_en_mantenimiento"
                        value={productoEditado.esta_en_mantenimiento}
                        onChange={handleEditChange}
                        className="w-full p-2 bg-gray-700 text-gray-300 rounded-md"
                      >
                        <option value="">Selecciona un estado</option>
                        <option value="true">Si</option>
                        <option value="false">No</option>
                      </select>
                    </div>
                    <div className="mt-4">
                      <label className="text-gray-400">Observaciones</label>
                      <input
                        type="text"
                        name="observaciones"
                        value={productoEditado.observaciones}
                        onChange={handleEditChange}
                        className="w-full p-2 bg-gray-700 text-gray-300 rounded-md"
                      />
                    </div>
                    <div className="mt-4">
                      <label className="text-gray-400">Descripción</label>
                      <input
                        type="text"
                        name="descripcion"
                        value={productoEditado.descripcion}
                        onChange={handleEditChange}
                        className="w-full p-2 bg-gray-700 text-gray-300 rounded-md"
                      />
                    </div>
                  </div>
                  <button
                    onClick={handleEdit}
                    className="mt-4 bg-yellow-600 px-4 py-2 rounded-md"
                  >
                    Guardar Cambios
                  </button>
                  <button
                    onClick={cerrarEditarModal}
                    className="ml-4 bg-red-600 px-4 py-2 rounded-md"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      )}

      {detalleModalOpen && productoSeleccionado && (
        <AnimatePresence>
          <motion.div
            className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="bg-gray-800 p-6 rounded-lg w-[800px] max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              transition={{ duration: 0.3 }}
            >
              <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
                <div className="bg-gray-800 p-6 rounded-lg w-[800px] max-h-[90vh] overflow-y-auto">
                  <h2 className="text-2xl font-bold">Detalles del Producto</h2>
                  <div className="mt-4 grid grid-cols-2 gap-4">
                    {Object.entries(productoSeleccionado).map(
                      ([key, value]) => (
                        <div key={key}>
                          <strong className="text-gray-400 capitalize">
                            {key}:
                          </strong>
                          <p className="text-white">{value}</p>
                        </div>
                      )
                    )}
                  </div>
                  <button
                    onClick={cerrarDetalleModal}
                    className="mt-4 bg-red-600 px-4 py-2 rounded-md"
                  >
                    Cerrar
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}

export default Productos;
