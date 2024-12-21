import { React, useState } from "react";
import NavBar from "../components/NavBar";
import Nav from "../components/Nav";
import { PlusIcon, ChartBarIcon, DocumentTextIcon, ArrowDownTrayIcon  } from "@heroicons/react/24/outline";

function Reportes() {
  const [reportType, setReportType] = useState("general");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [filter, setFilter] = useState("");

  const handleGenerateReport = () => {
    console.log("Generating report:", { reportType, startDate, endDate, filter });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-tr from-gray-900 via-gray-800 to-black text-white">
      <Nav />

      <div className="flex flex-1 pt-20">
        <NavBar />
        <main className="flex-1 p-8 overflow-auto ml-64">
          <div className="mb-8">
            <h1 className="text-4xl font-extrabold">
              Generador de Reportes
            </h1>
            <p className="text-gray-400">Crea reportes personalizados con filtros avanzados y exporta tus datos fácilmente.</p>
          </div>

          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">Tipo de reporte</label>
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                className="w-full bg-gray-900 border border-gray-700 text-gray-300 rounded-md px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="general">Reporte General</option>
                <option value="stock">Reporte de Stock</option>
                <option value="movements">Reporte de Actividades</option>
                <option value="sales">Reporte de Facturas</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Fecha de inicio</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-700 text-gray-300 rounded-md px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Fecha de fin</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-700 text-gray-300 rounded-md px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">Filtrar por</label>
              <input
                type="text"
                placeholder="Ejemplo: Producto, Categoría, Usuario"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="w-full bg-gray-900 border border-gray-700 text-gray-300 rounded-md px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={handleGenerateReport}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-md text-white font-medium shadow-md"
              >
                <ChartBarIcon className="h-5 w-5" /> Generar Reporte
              </button>
              <button
                onClick={() => console.log("Exporting report")}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 px-6 py-2 rounded-md text-white font-medium shadow-md"
              >
                <ArrowDownTrayIcon className="h-5 w-5" /> Exportar PDF
              </button>
            </div>
          </div>

          <div className="mt-10">
            <h2 className="text-2xl font-semibold text-gray-300 mb-4">Vista Previa</h2>
            <div className="bg-gray-900 p-4 rounded-md shadow-lg h-64 flex items-center justify-center text-gray-500">
              <p>La vista previa del reporte aparecerá aquí.</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Reportes;
