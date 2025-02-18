import { React, useState } from "react";
import NavBar from "../components/NavBar";
import Nav from "../components/Nav";
import { ChartBarIcon, ArrowDownTrayIcon } from "@heroicons/react/24/outline";
import generarGeneral from "../pdf/generarGeneral";
import generarStock from "../pdf/generarStock";
import generarActividades from "../pdf/generarActividades";
import generarReporteFactura from "../pdf/generarReporteFactura";

const ErrorModal = ({ message, onClose }) => (
  <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
    <div className="bg-white p-6 rounded-lg shadow-2xl max-w-sm w-full">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Error</h3>
      <p className="text-gray-600">{message}</p>
      <div className="mt-6 flex justify-end">
        <button
          onClick={onClose}
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition duration-200"
        >
          Cerrar
        </button>
      </div>
    </div>
  </div>
);

function Reportes() {
  const API_URL = import.meta.env.VITE_API_BASE_URL;

  const [reportType, setReportType] = useState("general");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [filter, setFilter] = useState("");
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleGenerateReport = async () => {
    setLoading(true);
    setError(null);

    const payload = {
      tipo: reportType,
      fecha_inicio: startDate || null,
      fecha_fin: endDate || null,
      filtro: filter || null,
    };

    try {
      const response = await fetch(`${API_URL}/api/inventario/reportes/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      setReportData(data.datos);
    } catch (err) {
      setError(err.message);
      setModalOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = () => {
    if (!reportData) {
      setError("Primero genera el reporte para exportar el PDF.");
      setModalOpen(true);
      return;
    }

    switch (reportType) {
      case "general":
        generarGeneral(reportData).download("reporte_general.pdf");
        break;
      case "stock":
        generarStock(reportData).download("reporte_stock.pdf");
        break;
      case "actividades":
        generarActividades(reportData).download("reporte_actividades.pdf");
        break;
      case "factura":
        generarReporteFactura(reportData).download("reporte_facturas.pdf");
        break;
      default:
        setError("Tipo de reporte no soportado.");
        setModalOpen(true);
    }
  };

  const closeModal = () => setModalOpen(false);

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F5F3] dark:bg-gradient-to-tr dark:from-gray-900 dark:via-gray-800 dark:to-black text-white">
      <Nav />
      <div className="flex flex-1 pt-20">
        <NavBar />
        <main className="flex-1 p-8 overflow-auto ml-64">
          <div className="mb-8">
            <h1 className="text-4xl text-black dark:text-white font-extrabold">Generador de Reportes</h1>
            <p className="text-[#333] dark:text-gray-400">
              Crea reportes personalizados con filtros avanzados y exporta tus
              datos fácilmente.
            </p>
          </div>

          <div className="bg-[#979797] dark:bg-gray-800 p-6 rounded-lg shadow-lg">
            <div className="mb-6">
              <label className="block text-sm font-medium text-white dark:text-gray-300 mb-2">
                Tipo de reporte
              </label>
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                className="w-full bg-gray-500 dark:bg-gray-900 border border-gray-400 dark:border-gray-700 text-gray-300 rounded-md px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="general">Reporte General</option>
                <option value="stock">Reporte de Stock</option>
                <option value="factura">Reporte de Facturas</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-white dark:text-gray-300 mb-2">
                  Fecha de inicio
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full bg-gray-500 dark:bg-gray-900 border border-gray-400 dark:border-gray-700 text-gray-300 rounded-md px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Fecha de fin
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full bg-gray-500 dark:bg-gray-900 border border-gray-400 dark:border-gray-700 text-gray-300 rounded-md px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={handleGenerateReport}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-md text-white font-medium shadow-md"
                disabled={loading}
              >
                <ChartBarIcon className="h-5 w-5" />{" "}
                {loading ? "Generando..." : "Generar Reporte"}
              </button>
              <button
                onClick={handleDownloadPDF}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 px-6 py-2 rounded-md text-white font-medium shadow-md"
              >
                <ArrowDownTrayIcon className="h-5 w-5" /> Exportar PDF
              </button>
            </div>
          </div>

          <div className="mt-10">
            <h2 className="text-2xl font-semibold text-black dark:text-gray-300 mb-4">
              Vista Previa
            </h2>
            <div className="bg-[#979797] dark:bg-gray-900 p-4 rounded-md shadow-lg h-96 overflow-y-auto text-gray-300">
              {loading ? (
                <p>Cargando datos...</p>
              ) : error ? (
                <p className="text-red-500">{error}</p>
              ) : reportData ? (
                <iframe
                  ref={(iframe) => {
                    if (!iframe || !reportData) return;

                    const generateFunction = {
                      general: generarGeneral,
                      stock: generarStock,
                      actividades: generarActividades,
                      factura: generarReporteFactura,
                    }[reportType];

                    if (generateFunction) {
                      generateFunction(reportData).getBlob((blob) => {
                        if (!blob) return;
                        const url = URL.createObjectURL(blob);
                        iframe.src = url;

                        iframe.onload = () => {
                          setTimeout(() => URL.revokeObjectURL(url), 1000);
                        };
                      });
                    }
                  }}
                  className="w-full h-full"
                  title="Vista previa del PDF"
                />
              ) : (
                <p className="text-black dark:text-white">La vista previa del reporte aparecerá aquí.</p>
              )}
            </div>
          </div>

          {modalOpen && <ErrorModal message={error} onClose={closeModal} />}
        </main>
      </div>
    </div>
  );
}

export default Reportes;
