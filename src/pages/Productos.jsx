import React, { useState, useEffect } from "react";
import NavBar from "../components/NavBar";
import Nav from "../components/Nav";
import { MagnifyingGlassIcon, PlusIcon } from "@heroicons/react/24/outline";

function Productos() {
  const [productos, setProductos] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);

  useEffect(() => {
    const fakeData = [
      {
        id: 1,
        equipo: "Cámara 1.5",
        referencia: "CAM-0015",
        marca: "Sony",
        serial: "SN12345",
        cantidad: 10,
        descripcion: "Cámara de alta definición con visión nocturna.",
        fechaEntrada: "2024-12-01",
        estado: "En uso",
        observaciones: "Incluye garantía de 1 año.",
        poliza: "Garantía extendida",
        valor: "$1,500",
        categoria: "Sonido",
        image: "https://via.placeholder.com/200",
      },
      {
        id: 2,
        equipo: "Audífonos Bluetooth",
        referencia: "AUD-0200",
        marca: "JBL",
        serial: "SN67890",
        cantidad: 15,
        descripcion: "Audífonos con sonido envolvente y gran autonomía.",
        fechaEntrada: "2024-11-20",
        estado: "Disponible",
        observaciones: "Sin observaciones.",
        poliza: "No aplica",
        valor: "$200",
        categoria: "Sonido",
        image: "https://via.placeholder.com/200",
      },
    ];
    setProductos(fakeData);
  }, []);

  const abrirModal = (producto) => {
    setProductoSeleccionado({ ...producto });
    setModalOpen(true);
  };

  const cerrarModal = () => {
    setModalOpen(false);
    setProductoSeleccionado(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductoSeleccionado((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSave = () => {
    const updatedProductos = productos.map((producto) =>
      producto.id === productoSeleccionado.id ? productoSeleccionado : producto
    );
    setProductos(updatedProductos);
    cerrarModal();
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
              <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition">
                <PlusIcon className="h-6 w-6 mr-2" />
                Agregar Producto
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {productos.map((producto) => (
              <div
                key={producto.id}
                className="bg-gray-800 rounded-lg shadow-lg p-6 flex flex-col items-center"
              >
                <img
                  src={producto.image}
                  alt={producto.equipo}
                  className="h-40 w-40 object-cover rounded-lg"
                />
                <h2 className="mt-4 text-xl font-semibold text-white">
                  {producto.equipo}
                </h2>

                <ul className="text-gray-400 mt-2 text-sm text-left w-full">
                  <li>
                    <strong>Serial:</strong> {producto.serial}
                  </li>
                  <li>
                    <strong>Cantidad:</strong> {producto.cantidad}
                  </li>
                  <li>
                    <strong>Estado:</strong> {producto.estado}
                  </li>
                </ul>
                <span className="text-lg font-bold text-blue-400 mt-4">
                  {producto.valor}
                </span>
                <button
                  onClick={() => abrirModal(producto)}
                  className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
                >
                  Ver detalles
                </button>
              </div>
            ))}
          </div>
        </main>
      </div>

      {modalOpen && (
  <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
    <div className="bg-gray-800 p-6 rounded-lg w-96 max-h-[80vh] overflow-y-auto">
      <h2 className="text-xl font-semibold text-white">Editar Producto</h2>
      {productoSeleccionado && (
        <div>

          <div className="mt-4">
            <label className="text-gray-400">Equipo</label>
            <input
              type="text"
              name="equipo"
              value={productoSeleccionado.equipo}
              onChange={handleChange}
              className="w-full p-2 mt-2 bg-gray-700 text-gray-300 rounded-md"
            />
          </div>

          <div className="mt-4">
            <label className="text-gray-400">Referencia</label>
            <input
              type="text"
              name="referencia"
              value={productoSeleccionado.referencia}
              onChange={handleChange}
              className="w-full p-2 mt-2 bg-gray-700 text-gray-300 rounded-md"
            />
          </div>

          <div className="mt-4">
            <label className="text-gray-400">Marca</label>
            <input
              type="text"
              name="marca"
              value={productoSeleccionado.marca}
              onChange={handleChange}
              className="w-full p-2 mt-2 bg-gray-700 text-gray-300 rounded-md"
            />
          </div>

          <div className="mt-4">
            <label className="text-gray-400">Serial</label>
            <input
              type="text"
              name="serial"
              value={productoSeleccionado.serial}
              onChange={handleChange}
              className="w-full p-2 mt-2 bg-gray-700 text-gray-300 rounded-md"
            />
          </div>

          <div className="mt-4">
            <label className="text-gray-400">Cantidad</label>
            <input
              type="number"
              name="cantidad"
              value={productoSeleccionado.cantidad}
              onChange={handleChange}
              className="w-full p-2 mt-2 bg-gray-700 text-gray-300 rounded-md"
            />
          </div>

          <div className="mt-4">
            <label className="text-gray-400">Descripción</label>
            <textarea
              name="descripcion"
              value={productoSeleccionado.descripcion}
              onChange={handleChange}
              className="w-full p-2 mt-2 bg-gray-700 text-gray-300 rounded-md"
            />
          </div>

          <div className="mt-4">
            <label className="text-gray-400">Fecha de Entrada</label>
            <input
              type="date"
              name="fechaEntrada"
              value={productoSeleccionado.fechaEntrada}
              onChange={handleChange}
              className="w-full p-2 mt-2 bg-gray-700 text-gray-300 rounded-md"
            />
          </div>


          <div className="mt-4">
            <label className="text-gray-400">Estado</label>
            <input
              type="text"
              name="estado"
              value={productoSeleccionado.estado}
              onChange={handleChange}
              className="w-full p-2 mt-2 bg-gray-700 text-gray-300 rounded-md"
            />
          </div>

          <div className="mt-4">
            <label className="text-gray-400">Observaciones</label>
            <textarea
              name="observaciones"
              value={productoSeleccionado.observaciones}
              onChange={handleChange}
              className="w-full p-2 mt-2 bg-gray-700 text-gray-300 rounded-md"
            />
          </div>

          <div className="mt-4">
            <label className="text-gray-400">Póliza</label>
            <input
              type="text"
              name="poliza"
              value={productoSeleccionado.poliza}
              onChange={handleChange}
              className="w-full p-2 mt-2 bg-gray-700 text-gray-300 rounded-md"
            />
          </div>

          <div className="mt-4">
            <label className="text-gray-400">Valor</label>
            <input
              type="text"
              name="valor"
              value={productoSeleccionado.valor}
              onChange={handleChange}
              className="w-full p-2 mt-2 bg-gray-700 text-gray-300 rounded-md"
            />
          </div>
          <div className="mt-4">
            <label className="text-gray-400">Categoria</label>
            <input
              type="text"
              name="valor"
              value={productoSeleccionado.categoria}
              onChange={handleChange}
              className="w-full p-2 mt-2 bg-gray-700 text-gray-300 rounded-md"
            />
          </div>

          <div className="mt-4 flex gap-4">
            <button
              onClick={handleSave}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
            >
              Guardar cambios
            </button>
            <button
              onClick={cerrarModal}
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  </div>
)}

    </div>
  );
}

export default Productos;
