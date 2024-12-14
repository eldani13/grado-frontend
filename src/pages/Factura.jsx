import React, { useState } from "react";
import NavBar from "../components/NavBar";
import Nav from "../components/Nav";
import {
  MagnifyingGlassIcon,
  PlusIcon,
  PrinterIcon,
} from "@heroicons/react/24/outline";
import generarFacturaPDF from "../pdf/generarFactura";

function Factura() {
  const [facturas, setFacturas] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [productos, setProductos] = useState([
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
      valor: 1500,
      categoria: "Sonido",
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
      valor: 200,
      categoria: "Sonido",
    },
  ]);

  const [formData, setFormData] = useState({
    numeroFactura: "",
    equipo: "",
    referencia: "",
    marca: "",
    serial: "",
    cantidad: "",
    descripcion: "",
    fechaEntrada: "",
    fechaSalida: "",
    estado: "",
    observaciones: "",
    poliza: "",
    precioUnidad: "",
    precioTotal: "",
  });

  const handleProductoChange = (event) => {
    const selectedProducto = productos.find(
      (producto) => producto.equipo === event.target.value
    );
    if (selectedProducto) {
      setFormData({
        ...formData,
        equipo: selectedProducto.equipo,
        referencia: selectedProducto.referencia,
        marca: selectedProducto.marca,
        serial: selectedProducto.serial,
        descripcion: selectedProducto.descripcion,
        fechaEntrada: selectedProducto.fechaEntrada,
        estado: selectedProducto.estado,
        observaciones: selectedProducto.observaciones,
        poliza: selectedProducto.poliza,
        precioUnidad: selectedProducto.valor,
      });
    }
  };

  const handleAddFactura = () => {
    const selectedProducto = productos.find(
      (producto) => producto.equipo === formData.equipo
    );

    if (selectedProducto) {
      if (formData.cantidad > selectedProducto.cantidad) {
        alert("No hay suficiente inventario disponible.");
        return;
      }

      setProductos((prev) =>
        prev.map((producto) =>
          producto.id === selectedProducto.id
            ? { ...producto, cantidad: producto.cantidad - formData.cantidad }
            : producto
        )
      );

      const nuevaFactura = {
        ...formData,
        numeroFactura: `FAC-${Date.now()}`,
        precioTotal: formData.cantidad * formData.precioUnidad,
      };

      setFacturas([...facturas, nuevaFactura]);

      setFormData({
        numeroFactura: "",
        equipo: "",
        referencia: "",
        marca: "",
        serial: "",
        cantidad: "",
        descripcion: "",
        fechaEntrada: "",
        fechaSalida: "",
        estado: "",
        observaciones: "",
        poliza: "",
        precioUnidad: "",
        precioTotal: "",
      });
      setModalOpen(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-tr from-gray-900 via-gray-800 to-black text-white">
      <Nav />
      <div className="flex flex-1 pt-20">
        <NavBar />
        <main className="flex-1 p-8 overflow-auto ml-64">
          <div className="flex items-center justify-between pb-8 border-b border-gray-700">
            <h1 className="text-4xl font-extrabold text-white">Factura</h1>
            <button
              onClick={() => setModalOpen(true)}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
            >
              <PlusIcon className="h-6 w-6 mr-2" />
              Agregar Factura
            </button>
          </div>

          <table className="w-full text-left border-collapse mt-8">
            <thead>
              <tr>
                <th className="border-b border-gray-700 py-2 px-4">Factura</th>
                <th className="border-b border-gray-700 py-2 px-4">Equipo</th>
                <th className="border-b border-gray-700 py-2 px-4">
                  Referencia
                </th>
                <th className="border-b border-gray-700 py-2 px-4">Marca</th>
                <th className="border-b border-gray-700 py-2 px-4">Serial</th>
                <th className="border-b border-gray-700 py-2 px-4">Cantidad</th>
                <th className="border-b border-gray-700 py-2 px-4">
                  Descripcion
                </th>
                <th className="border-b border-gray-700 py-2 px-4">
                  Fecha Entrada
                </th>
                <th className="border-b border-gray-700 py-2 px-4">
                  Fecha Salida
                </th>
                <th className="border-b border-gray-700 py-2 px-4">Estado</th>
                <th className="border-b border-gray-700 py-2 px-4">
                  Observacion
                </th>
                <th className="border-b border-gray-700 py-2 px-4">Poliza</th>
                <th className="border-b border-gray-700 py-2 px-4">
                  Precio Unidad
                </th>
                <th className="border-b border-gray-700 py-2 px-4">
                  Precio Total
                </th>
              </tr>
            </thead>
            <tbody>
              {facturas.map((factura, index) => (
                <tr key={index} className="hover:bg-gray-800">
                  <td className="py-2 px-4">{factura.numeroFactura}</td>
                  <td className="py-2 px-4">{factura.equipo}</td>
                  <td className="py-2 px-4">{factura.referencia}</td>
                  <td className="py-2 px-4">{factura.marca}</td>
                  <td className="py-2 px-4">{factura.serial}</td>
                  <td className="py-2 px-4">{factura.cantidad}</td>
                  <td className="py-2 px-4">{factura.descripcion}</td>
                  <td className="py-2 px-4">{factura.fechaEntrada}</td>
                  <td className="py-2 px-4">{factura.fechaSalida}</td>
                  <td className="py-2 px-4">{factura.estado}</td>
                  <td className="py-2 px-4">{factura.observaciones}</td>
                  <td className="py-2 px-4">{factura.poliza}</td>
                  <td className="py-2 px-4">${factura.precioUnidad}</td>
                  <td className="py-2 px-4">${factura.precioTotal}</td>
                  <td className="py-2 px-4">
                    <button
                      onClick={() => generarFacturaPDF(factura)}
                      className="p-1 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
                    >
                      <PrinterIcon className="h-6 w-6" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {modalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center">
              <div className="bg-gray-900 p-8 rounded-md shadow-lg max-w-lg w-full">
                <h2 className="text-2xl font-bold mb-4">
                  Agregar Nueva Factura
                </h2>

                <div className="mb-4">
                  <label className="block text-gray-400 mb-1">Producto</label>
                  <select
                    value={formData.equipo}
                    onChange={handleProductoChange}
                    className="w-full bg-gray-800 text-gray-300 py-2 px-4 rounded-md"
                  >
                    <option value="">Selecciona un producto</option>
                    {productos.map((producto) => (
                      <option key={producto.id} value={producto.equipo}>
                        {producto.equipo}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-4">
                  <label className="block text-gray-400 mb-1">
                    Fecha de Salida
                  </label>
                  <input
                    type="date"
                    value={formData.fechaSalida}
                    onChange={(e) =>
                      setFormData({ ...formData, fechaSalida: e.target.value })
                    }
                    className="w-full bg-gray-800 text-gray-300 py-2 px-4 rounded-md"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-400 mb-1">Cantidad</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.cantidad}
                    onChange={(e) =>
                      setFormData({ ...formData, cantidad: e.target.value })
                    }
                    className="w-full bg-gray-800 text-gray-300 py-2 px-4 rounded-md"
                    placeholder="Ingrese la cantidad"
                  />
                </div>

                <button
                  onClick={handleAddFactura}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Guardar
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default Factura;
