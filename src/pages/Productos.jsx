import React, { useState, useEffect } from "react";
import NavBar from "../components/NavBar";
import Nav from "../components/Nav";
import { MagnifyingGlassIcon, PlusIcon } from "@heroicons/react/24/outline";

function Productos() {
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    const fakeData = [
      {
        id: 1,
        name: "Camara 1.5",
        price: "$1,500",
        image: "https://via.placeholder.com/200",
        description: "Potente laptop con hardware de última generación.",
      },
      {
        id: 2,
        name: "Audífonos Bluetooth",
        price: "$200",
        image: "https://via.placeholder.com/200",
        description: "Audífonos con sonido envolvente y gran autonomía.",
      },
      {
        id: 3,
        name: "Smartphone Pro",
        price: "$1,200",
        image: "https://via.placeholder.com/200",
        description: "Teléfono con cámara profesional y pantalla AMOLED.",
      },
      {
        id: 4,
        name: "Camara 1.5",
        price: "$1,500",
        image: "https://via.placeholder.com/200",
        description: "Potente laptop con hardware de última generación.",
      },
      {
        id: 5,
        name: "Audífonos Bluetooth",
        price: "$200",
        image: "https://via.placeholder.com/200",
        description: "Audífonos con sonido envolvente y gran autonomía.",
      },
      {
        id: 6,
        name: "Smartphone Pro",
        price: "$1,200",
        image: "https://via.placeholder.com/200",
        description: "Teléfono con cámara profesional y pantalla AMOLED.",
      },
      {
        id: 7,
        name: "Camara 1.5",
        price: "$1,500",
        image: "https://via.placeholder.com/200",
        description: "Potente laptop con hardware de última generación.",
      },
      {
        id: 8,
        name: "Audífonos Bluetooth",
        price: "$200",
        image: "https://via.placeholder.com/200",
        description: "Audífonos con sonido envolvente y gran autonomía.",
      },
      {
        id: 9,
        name: "Smartphone Pro",
        price: "$1,200",
        image: "https://via.placeholder.com/200",
        description: "Teléfono con cámara profesional y pantalla AMOLED.",
      },
      {
        id: 10,
        name: "Camara 1.5",
        price: "$1,500",
        image: "https://via.placeholder.com/200",
        description: "Potente laptop con hardware de última generación.",
      },
      {
        id: 11,
        name: "Audífonos Bluetooth",
        price: "$200",
        image: "https://via.placeholder.com/200",
        description: "Audífonos con sonido envolvente y gran autonomía.",
      },
      {
        id: 12,
        name: "Smartphone Pro",
        price: "$1,200",
        image: "https://via.placeholder.com/200",
        description: "Teléfono con cámara profesional y pantalla AMOLED.",
      },
    ];
    setProductos(fakeData);
  }, []);

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
                  alt={producto.name}
                  className="h-40 w-40 object-cover rounded-lg"
                />
                <h2 className="mt-4 text-xl font-semibold text-white">
                  {producto.name}
                </h2>
                <p className="text-gray-400 mt-2 text-sm text-center">
                  {producto.description}
                </p>
                <span className="text-lg font-bold text-blue-400 mt-4">
                  {producto.price}
                </span>
                <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition">
                  Ver detalles
                </button>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}

export default Productos;
