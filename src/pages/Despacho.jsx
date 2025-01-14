import React, { useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import Nav from "../components/Nav";
import { PlusIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { Paper, ThemeProvider, createTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function Despacho() {
  const [productos, setProductos] = useState([]);
  const [filtro, setFiltro] = useState("");

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/inventario/pedido/`);
        if (!response.ok) {
          throw new Error("Error al obtener los productos.");
        }
        const data = await response.json();
        const productosTerminados = data.filter(
          (producto) => producto.estado === "terminado"
        );
        setProductos(productosTerminados);
      } catch (error) {
        console.error("Error al obtener los productos:", error);
      }
    };

    fetchProductos();
  }, []);

  const columns = [
    { field: "id", headerName: "ID", width: 150 },
    { field: "producto_nombre", headerName: "Nombre del Producto", width: 250 },
    { field: "estado", headerName: "Estado", width: 150 },
  ];

  const rows = productos
    .filter((producto) => {
    
      const nombreProducto = producto.producto_nombre || ""; 
      return nombreProducto.toLowerCase().includes(filtro.toLowerCase());
    })
    .map((producto) => ({
      id: producto.id,
      producto_nombre: producto.producto_nombre || "Sin nombre", 
      estado: producto.estado || "N/A", 
    }));

  const theme = createTheme({
    palette: {
      mode: "dark",
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <div className="min-h-screen flex flex-col bg-gradient-to-tr from-gray-900 via-gray-800 to-black text-white">
        <Nav />
        <div className="flex flex-1 pt-20">
          <NavBar />
          <main className="flex-1 p-8 overflow-auto ml-64">
            <div className="flex items-center justify-between pb-8 border-b border-gray-700">
              <h1 className="text-4xl font-extrabold text-white">Productos Terminados</h1>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute h-6 w-6 text-gray-400 left-3 top-1/2 transform -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Buscar..."
                    value={filtro}
                    onChange={(e) => setFiltro(e.target.value)}
                    className="pl-10 pr-4 py-2 rounded-md bg-gray-800 text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>
            </div>

            <div className="mt-8">
              {productos.length > 0 ? (
                <Paper elevation={3} className="p-4 bg-gray-800 rounded-lg">
                  <div style={{ height: 400, width: "100%" }}>
                    <DataGrid
                      rows={rows}
                      columns={columns}
                      pageSize={5}
                      rowsPerPageOptions={[5]}
                      disableSelectionOnClick
                    />
                  </div>
                </Paper>
              ) : (
                <p className="text-center text-gray-400">No hay productos terminados disponibles.</p>
              )}
            </div>
          </main>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default Despacho;
