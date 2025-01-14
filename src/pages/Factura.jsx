import React, { useState, useEffect } from "react";
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
  const [productos, setProductos] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAutoFacturaModalOpen, setAutoFacturaModalOpen] = useState(false);
  const [pedidos, setPedidos] = useState([]);
  const [selectedPedido, setSelectedPedido] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [isManualFactura, setIsManualFactura] = useState(false);
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };
  const filteredFacturas = facturas.filter(
    (factura) =>
      factura.numero_factura.toLowerCase().includes(searchTerm.toLowerCase()) ||
      factura.equipo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      factura.referencia.toLowerCase().includes(searchTerm.toLowerCase()) ||
      factura.marca.toLowerCase().includes(searchTerm.toLowerCase()) ||
      factura.serial.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const [formData, setFormData] = useState({
    numero_factura: "",
    equipo: "",
    referencia: "",
    marca: "",
    serial: "",
    cantidad: "",
    descripcion: "",
    fecha_entrada: "",
    fecha_salida: "",
    estado: "",
    observaciones: "",
    poliza: "",
    valor: "",
    total: "",
    nombre_cliente: "",
    compania_cliente: "",
    direccion: "",
    barrio: "",
    telefono: "",
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
  }, []);

  useEffect(() => {
    const fetchFacturas = async () => {
      try {
        const response = await fetch(`${API_URL}/api/inventario/facturas/`);
        const data = await response.json();
        setFacturas(data);
      } catch (error) {
        console.error("Error al obtener las facturas:", error);
      }
    };

    fetchFacturas();
  }, []);

  const fetchPedidos = async () => {
    try {
      const response = await fetch(`${API_URL}/api/inventario/pedido/`);
      if (!response.ok) {
        throw new Error("Error al obtener los pedidos");
      }
      const data = await response.json();
      // console.log("pedido:", data);

      const pedidosEnProceso = data.filter(
        (pedido) => pedido.estado === "en_proceso"
      );

      setPedidos(pedidosEnProceso);
    } catch (error) {
      console.error("Error al cargar los pedidos:", error);
    }
  };

  useEffect(() => {
    fetchPedidos();
  }, []);

  const rellenarDatosFactura = (pedido) => {
    // console.log("Pedido recibido:", pedido);

    const updatedFormData = {
      numero_factura: "",
      equipo: pedido.producto_nombre || "",
      referencia: "",
      marca: "",
      serial: "",
      cantidad: pedido.cantidad || 0,
      descripcion: pedido.descripcion || "Sin descripción",
      fecha_entrada: "",
      fecha_salida: new Date().toISOString().split("T")[0],
      estado: pedido.estado || "",
      observaciones: "",
      poliza: "",
      valor: 0,
      total: (pedido.valor || 0) * (pedido.cantidad || 0),
      nombre_cliente: pedido.nombre_cliente || "",
      compania_cliente: pedido.nombre_compania || "",
      direccion: pedido.direccion || "",
      barrio: pedido.barrio || "",
      telefono: pedido.telefono || "",
    };

    // console.log("Datos que se van a establecer en formData:", updatedFormData);

    setFormData(updatedFormData);
  };

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
        fecha_entrada: selectedProducto.fecha_entrada,
        estado: selectedProducto.estado,
        observaciones: selectedProducto.observaciones,
        poliza: selectedProducto.poliza,
        valor: selectedProducto.valor,
        total: (selectedProducto.valor * (formData.cantidad || 0)).toFixed(2),
      });
    }
  };

  const handleCantidadChange = (e) => {
    const cantidad = e.target.value;
    setFormData({
      ...formData,
      cantidad,
      total: (formData.valor * cantidad).toFixed(2),
    });
  };

  const terminarPedido = async () => {
    try {
      if (isManualFactura) {
        return; 
      }

      if (!selectedPedido) {
        throw new Error("No se ha seleccionado un pedido.");
      }

      const pedidoId = selectedPedido.id;

      const response = await fetch(
        `${API_URL}/api/inventario/pedido/${pedidoId}/terminar/`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
          }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error al terminar el pedido: ${errorText}`);
      }

      const updatedPedido = await response.json();

      setPedidos((prevPedidos) =>
        prevPedidos.map((pedido) =>
          pedido.id === updatedPedido.id
            ? { ...pedido, estado: "terminado" }
            : pedido
        )
      );
    } catch (error) {
      console.error(error);
      setErrorMessage(`Error al terminar el pedido: ${error.message}`);
    }
  };

  const handleAddFactura = async () => {
    const selectedProducto = productos.find(
      (producto) => producto.equipo === formData.equipo
    );

    if (!selectedProducto) {
      setErrorMessage("Debes seleccionar un producto válido.");
      return;
    }

    if (!formData.cantidad || formData.cantidad <= 0) {
      setErrorMessage("La cantidad debe ser mayor a 0.");
      return;
    }

    if (formData.cantidad > selectedProducto.cantidad) {
      setErrorMessage("No hay suficiente inventario disponible.");
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
      numero_factura: formData.numero_factura || `FAC-${Date.now()}`,
      producto: selectedProducto.id,
      equipo: formData.equipo || "N/A",
      referencia: formData.referencia || "N/A",
      marca: formData.marca || "N/A",
      serial: formData.serial || "N/A",
      cantidad: formData.cantidad,
      descripcion: formData.descripcion || "N/A",
      fecha_entrada: formData.fecha_entrada || "N/A",
      fecha_salida: formData.fecha_salida || "N/A",
      estado: formData.estado || "N/A",
      observaciones: formData.observaciones || "N/A",
      poliza: formData.poliza || "N/A",
      precio_unidad: formData.valor || 0,
      precio_total: formData.total || 0,
      nombre_cliente: formData.nombre_cliente || "N/A",
      compania_cliente: formData.compania_cliente || "N/A",
      direccion: formData.direccion || "N/A",
      barrio: formData.barrio || "N/A",
      telefono: formData.telefono || "N/A",
    };

    try {
      const response = await fetch(`${API_URL}/api/inventario/facturas/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nuevaFactura),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al registrar la factura");
      }

      const facturaGuardada = await response.json();
      setFacturas([...facturas, facturaGuardada]);

      await terminarPedido();

      setFormData({
        numero_factura: "",
        equipo: "",
        referencia: "",
        marca: "",
        serial: "",
        cantidad: "",
        descripcion: "",
        fecha_entrada: "",
        fecha_salida: "",
        estado: "",
        observaciones: "",
        poliza: "",
        valor: "",
        total: "",
        nombre_cliente: "",
        compania_cliente: "",
        direccion: "",
        barrio: "",
        telefono: "",
      });

      setModalOpen(false);
    } catch (error) {
      console.error("Error al registrar la factura:", error);
      setErrorMessage(`Error al registrar la factura: ${error.message}`);
    }
  };

  const ErrorModal = ({ message, onClose }) => (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-2xl max-w-sm w-full">
        <p className="text-lg font-semibold text-gray-800">{message}</p>
        <div className="mt-6 flex justify-end">
          <button
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition duration-200"
            onClick={onClose}
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-tr from-gray-900 via-gray-800 to-black text-white">
      <Nav />
      <div className="flex flex-1 pt-20">
        <NavBar />
        <main className="flex-1 p-8 overflow-auto ml-64">
          <div className="flex items-center justify-between pb-8 border-b border-gray-700">
            <h1 className="text-4xl font-extrabold text-white">Factura</h1>
            <div className="relative">
              <div className="flex items-center gap-4">
                <MagnifyingGlassIcon className="absolute h-6 w-6 text-gray-400 left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Buscar factura..."
                  className="pl-10 pr-4 py-2 rounded-md bg-gray-800 text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
                <button
                  onClick={() => {
                    setModalOpen(true);
                    setIsManualFactura(true); 
                  }}
                  className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
                >
                  <PlusIcon className="h-6 w-6 mr-2" />
                  Agregar Factura Manual
                </button>

                <button
                  onClick={() => {
                    setAutoFacturaModalOpen(true);
                    setIsManualFactura(false); 
                  }}
                  className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition"
                >
                  <PlusIcon className="h-6 w-6 mr-2" />
                  Auto Factura
                </button>
              </div>
            </div>
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
                {/* <th className="border-b border-gray-700 py-2 px-4">Poliza</th> */}
                <th className="border-b border-gray-700 py-2 px-4">
                  Precio Unidad
                </th>
                <th className="border-b border-gray-700 py-2 px-4">
                  Precio Total
                </th>
                <th className="border-b border-gray-700 py-2 px-4">PDF</th>
              </tr>
            </thead>
            <tbody>
              {filteredFacturas.map((factura, index) => (
                <tr key={index} className="hover:bg-gray-800">
                  <td className="py-2 px-4">{factura.numero_factura}</td>
                  <td className="py-2 px-4">{factura.equipo}</td>
                  <td className="py-2 px-4">{factura.referencia}</td>
                  <td className="py-2 px-4">{factura.marca}</td>
                  <td className="py-2 px-4">{factura.serial}</td>
                  <td className="py-2 px-4">{factura.cantidad}</td>
                  <td className="py-2 px-4">{factura.descripcion}</td>
                  <td className="py-2 px-4">{factura.fecha_entrada}</td>
                  <td className="py-2 px-4">{factura.fecha_salida}</td>
                  <td className="py-2 px-4">{factura.estado}</td>
                  <td className="py-2 px-4">{factura.observaciones}</td>
                  <td className="py-2 px-4">${factura.valor}</td>
                  <td className="py-2 px-4">${factura.total}</td>
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

          {isAutoFacturaModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center">
              <div className="bg-gray-900 p-8 rounded-md shadow-lg max-w-lg w-full">
                <h2 className="text-2xl font-bold mb-4">
                  Seleccionar Pedido en Proceso
                </h2>

                <div className="mb-4">
                  <label className="block text-gray-400 mb-1">
                    Pedidos en Proceso
                  </label>
                  <select
                    value={selectedPedido?.id || ""}
                    onChange={(e) => {
                      const pedido = pedidos.find(
                        (p) => p.id === parseInt(e.target.value)
                      );
                      setSelectedPedido(pedido);
                    }}
                    className="w-full bg-gray-800 text-gray-300 py-2 px-4 rounded-md"
                  >
                    <option value="">Seleccione un pedido</option>
                    {pedidos.map((pedido) => (
                      <option key={pedido.id} value={pedido.id}>
                        {`Pedido ${pedido.id} - ${pedido.nombre_cliente}`}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex justify-end gap-4">
                  <button
                    onClick={() => setAutoFacturaModalOpen(false)}
                    className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={() => {
                      if (selectedPedido) {
                        rellenarDatosFactura(selectedPedido);
                        setAutoFacturaModalOpen(false);
                        setModalOpen(true);
                      } else {
                        setErrorMessage("Por favor seleccione un pedido.");
                      }
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Confirmar
                  </button>
                </div>
              </div>
            </div>
          )}

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
                    Nombre del Cliente
                  </label>
                  <input
                    type="text"
                    value={formData.nombre_cliente}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        nombre_cliente: e.target.value,
                      })
                    }
                    className="w-full bg-gray-800 text-gray-300 py-2 px-4 rounded-md"
                    placeholder="Ingrese el nombre del cliente"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-400 mb-1">
                    Compañía del Cliente
                  </label>
                  <input
                    type="text"
                    value={formData.compania_cliente}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        compania_cliente: e.target.value,
                      })
                    }
                    className="w-full bg-gray-800 text-gray-300 py-2 px-4 rounded-md"
                    placeholder="Ingrese la compañía del cliente"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-400 mb-1">Dirección</label>
                  <input
                    type="text"
                    value={formData.direccion}
                    onChange={(e) =>
                      setFormData({ ...formData, direccion: e.target.value })
                    }
                    className="w-full bg-gray-800 text-gray-300 py-2 px-4 rounded-md"
                    placeholder="Ingrese la dirección"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-400 mb-1">Barrio</label>
                  <input
                    type="text"
                    value={formData.barrio}
                    onChange={(e) =>
                      setFormData({ ...formData, barrio: e.target.value })
                    }
                    className="w-full bg-gray-800 text-gray-300 py-2 px-4 rounded-md"
                    placeholder="Ingrese el barrio"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-400 mb-1">Teléfono</label>
                  <input
                    type="text"
                    value={formData.telefono}
                    onChange={(e) =>
                      setFormData({ ...formData, telefono: e.target.value })
                    }
                    className="w-full bg-gray-800 text-gray-300 py-2 px-4 rounded-md"
                    placeholder="Ingrese el teléfono"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-400 mb-1">
                    Fecha de Salida
                  </label>
                  <input
                    type="date"
                    value={formData.fecha_salida}
                    onChange={(e) =>
                      setFormData({ ...formData, fecha_salida: e.target.value })
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

                <div className="flex justify-end gap-4">
                  <button
                    onClick={() => setModalOpen(false)}
                    className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleAddFactura}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Guardar
                  </button>
                </div>
              </div>
            </div>
          )}

          <div>
            {errorMessage && (
              <ErrorModal
                message={errorMessage}
                onClose={() => setErrorMessage("")}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default Factura;
