import React, { useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import Nav from "../components/Nav";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { DataGrid } from "@mui/x-data-grid";
import { Paper, ThemeProvider, createTheme } from "@mui/material";

function Proceso({ pedidos }) {
  console.log("Datos de pedidos:", pedidos);

  const pedidosEnProceso = pedidos ? pedidos.filter((pedido) => pedido.estado === "en_proceso") : [];
  console.log("pedidos en proceso", pedidosEnProceso);

  const columns = [
    { field: "id", headerName: "ID", width: 300 },
    { field: "nombre_cliente", headerName: "Cliente", width: 300 },
    { field: "producto_nombre", headerName: "Producto", width: 300 },
    { field: "estado", headerName: "Estado", width: 160 },
  ];

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
              <h1 className="text-4xl font-extrabold text-white">Pedidos en Proceso</h1>
              <div className="relative">
                <MagnifyingGlassIcon className="absolute h-6 w-6 text-gray-400 left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Buscar..."
                  className="pl-10 pr-4 py-2 rounded-md bg-gray-800 text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
            </div>

            <div className="mt-8">
              {pedidosEnProceso.length > 0 ? (
                <Paper elevation={3} className="p-4 bg-gray-800 rounded-lg">
                  <div style={{ height: 400, width: "100%" }}>
                    <DataGrid
                      rows={pedidosEnProceso}
                      columns={columns}
                      pageSize={5}
                      rowsPerPageOptions={[5]}
                      disableSelectionOnClick
                    />
                  </div>
                </Paper>
              ) : (
                <p className="text-center text-gray-400">No hay pedidos en proceso.</p>
              )}
            </div>
          </main>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default Proceso;
