import React, { useState, useEffect, Fragment } from "react";
import NavBar from "../components/NavBar";
import Nav from "../components/Nav";
import { MagnifyingGlassIcon, PlusIcon } from "@heroicons/react/24/outline";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
} from "@headlessui/react";

function Ventas() {
  const API_URL_V2 = import.meta.env.VITE_API_V2_BASE_URL + "/api/invoices";

  const [isOpen, setIsOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [invoice, setInvoice] = useState({
    number: "",
    date: "",
    items: [],
  });
  const [product, setProduct] = useState({
    productName: "",
    price: "",
    description: "",
    valor: "",
    poliza: "",
    fecha_entrada: "",
    fecha_salida: "",
    cantidad: "",
    serial: "",
    marca: "",
    referencia: "",
    equipo: "",
    observacion: "",
  });
  const [invoices, setInvoices] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);
  const openDetailsModal = () => setIsDetailsOpen(true);
  const closeDetailsModal = () => setIsDetailsOpen(false);

  const handleProductChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const addProductToInvoice = () => {
    if (!product.productName || !product.price || !product.cantidad) {
      alert("Por favor, complete todos los campos del producto.");
      return;
    }

    const newProduct = {
      productName: product.productName,
      price: product.price,
      description: product.description,
      valor: product.valor,
      poliza: product.poliza,
      fecha_entrada: product.fecha_entrada,
      fecha_salida: product.fecha_salida,
      cantidad: Number(product.cantidad),
      serial: product.serial,
      marca: product.marca,
      referencia: product.referencia,
      equipo: product.equipo,
      observacion: product.observacion,
    };

    setInvoice((prevInvoice) => ({
      ...prevInvoice,
      items: [...prevInvoice.items, newProduct],
    }));

    setProduct({
      productName: "",
      price: "",
      description: "",
      valor: "",
      poliza: "",
      fecha_entrada: "",
      fecha_salida: "",
      cantidad: "",
      serial: "",
      marca: "",
      referencia: "",
      equipo: "",
      observacion: "",
    });
  };

  const submitInvoice = async () => {
    if (invoice.items.length === 0) {
      alert("La factura debe incluir al menos un producto.");
      return;
    }

    try {
      const response = await fetch(API_URL_V2 + "/with-products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...invoice,
          date: new Date(invoice.date).toISOString(),
        }),
      });

      if (response.ok) {
        const newInvoice = await response.json();
        setInvoices([...invoices, newInvoice]);
        setInvoice({ number: "", date: "", items: [] });
        closeModal();
      } else {
        const errorData = await response.json();
        console.error(
          "Error al enviar la factura:",
          errorData.message || response.statusText
        );
        alert(errorData.message || "Error al enviar la factura.");
      }
    } catch (error) {
      console.error("Error al enviar la factura:", error);
      alert("Hubo un error al enviar la factura.");
    }
  };

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const response = await fetch(API_URL_V2);
        if (response.ok) {
          const data = await response.json();
          setInvoices(data);
        } else {
          alert("Error al obtener las facturas.");
        }
      } catch (error) {
        console.error("Error fetching invoices:", error);
        alert("Hubo un error al cargar las facturas.");
      }
    };

    fetchInvoices();
  }, []);

  const filteredInvoices = invoices.filter((invoice) =>
    invoice.number.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewDetails = async (invoiceId) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL_V2}/${invoiceId}`);
      if (response.ok) {
        const data = await response.json();
        setSelectedInvoice(data);
        openDetailsModal();
      } else {
        alert("Error al obtener los detalles de la factura.");
      }
    } catch (error) {
      console.error("Error fetching invoice details:", error);
      alert("Hubo un error al cargar los detalles.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F5F3] dark:bg-gradient-to-tr dark:from-gray-900 dark:via-gray-800 dark:to-black text-white">
      <Nav />
      <div className="flex flex-1 pt-20">
        <NavBar />
        <main className="flex-1 p-8 overflow-auto ml-64">
          <div className="flex items-center justify-between pb-8 border-b border-gray-300 dark:border-gray-700">
            <h1 className="text-4xl font-extrabold text-black dark:text-white">
              Compras
            </h1>
            <div className="flex items-center gap-4">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute h-6 w-6 text-gray-400 left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Buscar compra..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 rounded-md bg-gray-300 text-black dark:bg-gray-800 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
              <button
                onClick={openModal}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
              >
                <PlusIcon className="h-6 w-6 mr-2" />
                Agregar Compra
              </button>
            </div>
          </div>

          {filteredInvoices.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full mt-8 bg-white text-gray-700 rounded-lg shadow-md">
                <thead>
                  <tr className="bg-gray-200 text-sm uppercase text-gray-600 tracking-wider">
                    <th className="p-4 text-left">Factura</th>
                    <th className="p-4 text-left">Fecha</th>
                    <th className="p-4 text-left">Estado</th>
                    <th className="p-4 text-left">Productos</th>
                    <th className="p-4 text-left">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInvoices.map((invoice, index) => (
                    <tr
                      key={index}
                      className={`hover:bg-gray-50 transition ${
                        index % 2 === 0 ? "bg-gray-50" : "bg-white"
                      }`}
                    >
                      <td className="p-4">{invoice.number}</td>
                      <td className="p-4">
                        {new Date(invoice.date).toLocaleDateString()}
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs ${
                            invoice.status === "Pagada"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {invoice.status || "N/A"}
                        </span>
                      </td>
                      <td className="p-4">{invoice.items.length} Productos</td>
                      <td className="p-4">
                        <button
                          onClick={() => handleViewDetails(invoice._id)}
                          className="bg-blue-600 text-white px-4 py-2 text-sm rounded-lg hover:bg-blue-700 transition"
                        >
                          Ver Detalles
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="mt-8 text-center text-gray-500">
              No se han encontrado facturas.
            </p>
          )}

          <Transition show={isDetailsOpen} as={Fragment}>
            <Dialog as="div" open={isDetailsOpen} onClose={closeDetailsModal}>
              <div className="fixed inset-0 z-10 overflow-y-auto bg-black bg-opacity-25">
                <div className="flex items-center justify-center min-h-screen px-4">
                  <DialogPanel className="w-full max-w-5xl rounded-lg bg-white p-6 shadow-xl">
                    <DialogTitle className="text-2xl font-bold text-gray-800">
                      Detalles de la Factura
                    </DialogTitle>
                    {loading ? (
                      <p className="mt-4 text-center text-gray-600">
                        Cargando detalles...
                      </p>
                    ) : (
                      <div className="mt-4 overflow-x-auto">
                        <table className="w-full bg-white text-gray-700 rounded-lg shadow-md">
                          <thead>
                            <tr className="bg-gray-200 text-sm uppercase text-gray-600 tracking-wider">
                              <th className="p-4 text-left">Factura</th>
                              <th className="p-4 text-left">Equipo</th>
                              <th className="p-4 text-left">Referencia</th>
                              <th className="p-4 text-left">Marca</th>
                              <th className="p-4 text-left">Serial</th>
                              <th className="p-4 text-left">Cantidad</th>
                              <th className="p-4 text-left">Descripción</th>
                              <th className="p-4 text-left">Fecha Entrada</th>
                              <th className="p-4 text-left">Fecha Salida</th>
                              <th className="p-4 text-left">Estado</th>
                              <th className="p-4 text-left">Observaciones</th>
                              <th className="p-4 text-left">Póliza</th>
                              <th className="p-4 text-left">Valor</th>
                            </tr>
                          </thead>
                          <tbody>
                            {selectedInvoice?.items?.map((item, index) => (
                              <tr
                                key={index}
                                className={`hover:bg-gray-50 transition ${
                                  index % 2 === 0 ? "bg-gray-50" : "bg-white"
                                }`}
                              >
                                <td className="p-4">
                                  {selectedInvoice.number}
                                </td>
                                <td className="p-4">{item.product.equipo}</td>
                                <td className="p-4">
                                  {item.product.referencia}
                                </td>
                                <td className="p-4">{item.product.marca}</td>
                                <td className="p-4">{item.product.serial}</td>
                                <td className="p-4">{item.product.cantidad}</td>
                                <td className="p-4">
                                  {item.product.description}
                                </td>
                                <td className="p-4">
                                  {new Date(
                                    item.product.fecha_entrada
                                  ).toLocaleDateString()}
                                </td>
                                <td className="p-4">
                                  {new Date(
                                    item.product.fecha_salida
                                  ).toLocaleDateString()}
                                </td>
                                <td className="p-4">
                                  {item.product.estado || "N/A"}
                                </td>
                                <td className="p-4">
                                  {item.product.observacion || "N/A"}
                                </td>
                                <td className="p-4">{item.product.poliza}</td>
                                <td className="p-4">{item.product.valor}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                    <div className="mt-4 text-right">
                      <button
                        onClick={closeDetailsModal}
                        className="bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition"
                      >
                        Cerrar
                      </button>
                    </div>
                  </DialogPanel>
                </div>
              </div>
            </Dialog>
          </Transition>

          <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-10" onClose={closeModal}>
              <div className="fixed inset-0 bg-black bg-opacity-30 transition-opacity" />
              <div className="fixed inset-0 overflow-y-auto">
                <div className="flex min-h-full items-center justify-center p-4">
                  <DialogPanel className="w-full max-w-5xl transform rounded-xl bg-white p-8 shadow-lg transition-all">
                    <DialogTitle className="text-2xl font-semibold text-gray-800 mb-6">
                      Nueva Factura
                    </DialogTitle>

                    <div className="grid grid-cols-2 gap-8">
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Número de Factura
                          </label>
                          <input
                            type="text"
                            name="number"
                            value={invoice.number}
                            onChange={(e) =>
                              setInvoice({ ...invoice, number: e.target.value })
                            }
                            className="w-full mt-1 p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Fecha
                          </label>
                          <input
                            type="date"
                            name="date"
                            value={invoice.date}
                            onChange={(e) =>
                              setInvoice({ ...invoice, date: e.target.value })
                            }
                            className="w-full mt-1 p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Nombre del Producto
                          </label>
                          <input
                            type="text"
                            name="productName"
                            value={product.productName}
                            onChange={handleProductChange}
                            className="w-full mt-1 p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Precio
                          </label>
                          <input
                            type="number"
                            name="price"
                            value={product.price}
                            onChange={handleProductChange}
                            className="w-full mt-1 p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Valor
                          </label>
                          <input
                            type="text"
                            name="valor"
                            value={product.valor}
                            onChange={handleProductChange}
                            className="w-full mt-1 p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Observaciones
                          </label>
                          <input
                            type="text"
                            name="observacion"
                            value={product.observacion}
                            onChange={handleProductChange}
                            className="w-full mt-1 p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Equipo
                          </label>
                          <input
                            type="text"
                            name="equipo"
                            value={product.equipo}
                            onChange={handleProductChange}
                            className="w-full mt-1 p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Póliza
                          </label>
                          <input
                            type="text"
                            name="poliza"
                            value={product.poliza}
                            onChange={handleProductChange}
                            className="w-full mt-1 p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Fecha Entrada
                          </label>
                          <input
                            type="date"
                            name="fecha_entrada"
                            value={product.fecha_entrada}
                            onChange={handleProductChange}
                            className="w-full mt-1 p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Fecha Salida
                          </label>
                          <input
                            type="date"
                            name="fecha_salida"
                            value={product.fecha_salida}
                            onChange={handleProductChange}
                            className="w-full mt-1 p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Cantidad
                          </label>
                          <input
                            type="number"
                            name="cantidad"
                            value={product.cantidad}
                            onChange={handleProductChange}
                            className="w-full mt-1 p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Serial
                          </label>
                          <input
                            type="text"
                            name="serial"
                            value={product.serial}
                            onChange={handleProductChange}
                            className="w-full mt-1 p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Marca
                          </label>
                          <input
                            type="text"
                            name="marca"
                            value={product.marca}
                            onChange={handleProductChange}
                            className="w-full mt-1 p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Referencia
                          </label>
                          <input
                            type="text"
                            name="referencia"
                            value={product.referencia}
                            onChange={handleProductChange}
                            className="w-full mt-1 p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="mt-8 flex justify-end gap-4">
                      <button
                        onClick={closeModal}
                        className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 focus:ring focus:ring-gray-200"
                      >
                        Cancelar
                      </button>
                      <button
                        onClick={submitInvoice}
                        className="bg-green-600 text-white px-6 py-2 rounded-lg shadow hover:bg-green-700 focus:ring focus:ring-green-300"
                      >
                        Guardar Factura
                      </button>
                    </div>
                  </DialogPanel>
                </div>
              </div>
            </Dialog>
          </Transition>
        </main>
      </div>
    </div>
  );
}

export default Ventas;
