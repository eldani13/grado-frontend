import React, { useState, useEffect } from "react";
import NavBar from "../components/NavBar";
import Nav from "../components/Nav";
import { MagnifyingGlassIcon, PlusIcon } from "@heroicons/react/24/outline";
import { motion, AnimatePresence } from "framer-motion";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function Pedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPedido, setSelectedPedido] = useState(null);

  const fetchPedidos = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/pedidos/pedidos/`);
      if (!response.ok) {
        throw new Error("Error al obtener los pedidos");
      }
      const data = await response.json();
      setPedidos(data);
    } catch (error) {
      console.error("Error al cargar los pedidos:", error);
    }
  };

  useEffect(() => {
    fetchPedidos();
  }, []);

  const filteredPedidos = pedidos.filter((pedido) =>
    pedido.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const closeModal = () => setSelectedPedido(null);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-tr from-gray-900 via-gray-800 to-black text-white">
      <Nav />

      <div className="flex flex-1 pt-20">
        <NavBar />
        <main className="flex-1 p-8 overflow-auto ml-64">
          <div className="flex items-center justify-between pb-8 border-b border-gray-700">
            <h1 className="text-4xl font-extrabold text-white">Pedidos</h1>
            <div className="flex items-center gap-4">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute h-6 w-6 text-gray-400 left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Buscar pedidos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 rounded-md bg-gray-800 text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
              <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition">
                <PlusIcon className="h-6 w-6 mr-2" />
                Agregar Pedidos
              </button>
            </div>
          </div>

          <div className="mt-8">
            {filteredPedidos.length > 0 ? (
              <ul className="space-y-4">
                {filteredPedidos.map((pedido) => (
                  <li
                    key={pedido.id}
                    className="p-4 bg-gray-800 rounded-lg shadow-md border border-gray-700 cursor-pointer hover:bg-gray-700"
                    onClick={() => setSelectedPedido(pedido)}
                  >
                    <h2 className="text-xl font-bold text-blue-400">
                      {pedido.nombre}
                    </h2>
                    <p>
                      <strong>Tipo de Reserva:</strong> {pedido.tipo_reserva}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-center text-gray-400">
                No hay pedidos disponibles.
              </p>
            )}
          </div>
        </main>
      </div>

      {selectedPedido && (
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
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-gray-900 p-6 rounded-lg shadow-lg max-w-md w-full text-white">
                  <h2 className="text-2xl font-bold text-blue-400 mb-4">
                    {selectedPedido.nombre}
                  </h2>
                  <p>
                    <strong>Teléfono:</strong> {selectedPedido.telefono}
                  </p>
                  <p>
                    <strong>Correo:</strong> {selectedPedido.correo}
                  </p>
                  <p>
                    <strong>Dirección:</strong> {selectedPedido.direccion}
                  </p>
                  <p>
                    <strong>Tipo de Reserva:</strong>{" "}
                    {selectedPedido.tipo_reserva}
                  </p>
                  <p>
                    <strong>Fecha de Reserva:</strong>{" "}
                    {selectedPedido.fecha_reserva}
                  </p>
                  <p>
                    <strong>Descripción:</strong>{" "}
                    {selectedPedido.descripcion_reserva}
                  </p>
                  <div className="flex gap-4 mt-6">
                    <button
                      className="flex-1 bg-green-600 py-2 rounded-lg hover:bg-green-700 transition"
                      onClick={() =>
                        console.log("Pedido terminado", selectedPedido.id)
                      }
                    >
                      Terminado
                    </button>
                    <button
                      className="flex-1 bg-red-600 py-2 rounded-lg hover:bg-red-700 transition"
                      onClick={() =>
                        console.log("Pedido cancelado", selectedPedido.id)
                      }
                    >
                      Cancelar
                    </button>
                  </div>
                  <button
                    className="mt-4 text-gray-400 hover:text-white transition text-sm"
                    onClick={closeModal}
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

export default Pedidos;
