import React, { useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import Nav from "../components/Nav";
import { PlusIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { Paper, ThemeProvider, createTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

function Despacho() {
  const [categorias, setCategorias] = useState([]);

  useEffect(() => {
    const fetchCategorias = () => {
      const data = [
        { id: 1, nombre: "Categoría 1", descripcion: "Descripción de la categoría 1" },
        { id: 2, nombre: "Categoría 2", descripcion: "Descripción de la categoría 2" },
        { id: 3, nombre: "Categoría 3", descripcion: "Descripción de la categoría 3" },
        { id: 4, nombre: "Categoría 4", descripcion: "Descripción de la categoría 4" },
        { id: 5, nombre: "Categoría 5", descripcion: "Descripción de la categoría 5" },
      ];
      setCategorias(data);
    };

    fetchCategorias();
  }, []);

  const columns = [
    { field: "id", headerName: "ID", width: 150 },
    { field: "nombre_categoria", headerName: "Nombre de Categoría", width: 250 },
    { field: "descripcion", headerName: "Descripción", width: 300 },
    // { field: "acciones", headerName: "Acciones", width: 200, renderCell: (params) => (
    //   <div className="flex justify-center pt-2 gap-2">
    //     <button className="bg-blue-600 text-white px-4 py-1 rounded-md">Ver</button>
    //     <button className="bg-yellow-600 text-white px-4 py-1 rounded-md">Editar</button>
    //     <button className="bg-red-600 text-white px-4 py-1 rounded-md">Eliminar</button>
    //   </div>
    // )}
  ];

  const rows = categorias.map((categoria) => ({
    id: categoria.id,
    nombre_categoria: categoria.nombre,
    descripcion: categoria.descripcion,
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
              <h1 className="text-4xl font-extrabold text-white">Pedidos en Despacho</h1>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute h-6 w-6 text-gray-400 left-3 top-1/2 transform -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Buscar categorías..."
                    className="pl-10 pr-4 py-2 rounded-md bg-gray-800 text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
                <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition">
                  <PlusIcon className="h-6 w-6 mr-2" /> Agregar Categoría
                </button>
              </div>
            </div>

            <div className="mt-8">
              {categorias.length > 0 ? (
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
                <p className="text-center text-gray-400">No hay categorías disponibles.</p>
              )}
            </div>
          </main>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default Despacho;
