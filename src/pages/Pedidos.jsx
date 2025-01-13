import React, { useState, useEffect } from "react";
import NavBar from "../components/NavBar";
import Nav from "../components/Nav";
import { MagnifyingGlassIcon, PlusIcon } from "@heroicons/react/24/outline";
import { motion, AnimatePresence } from "framer-motion";
import { Paper, Button, ThemeProvider, createTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { Visibility, Edit, Delete } from "@mui/icons-material";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const theme = createTheme({
  palette: {
    mode: "dark",
  },
});

const columnas = [
  { field: "id", headerName: "ID", width: 90 },
  { field: "producto_nombre", headerName: "Equipo", width: 200 },
  { field: "cantidad", headerName: "Cantidad", width: 150 },
  { field: "stock", headerName: "En stock", width: 200 },
];

function Pedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [productos, setProductos] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPedido, setSelectedPedido] = useState(null);
  const closeModal = () => setSelectedPedido(null);

  const fetchPedidos = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/inventario/pedido/`);
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

  const fetchProductos = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/inventario/productos/`);
      if (!response.ok) {
        throw new Error("Error al obtener los productos");
      }
      const data = await response.json();
      setProductos(data);
    } catch (error) {
      console.error("Error al cargar los productos:", error);
    }
  };

  useEffect(() => {
    fetchPedidos();
    fetchProductos();
  }, []);

  const filteredPedidos = pedidos.filter(
    (pedido) =>
      pedido.nombre_cliente.toLowerCase().includes(searchTerm.toLowerCase()) &&
      pedido.estado !== "en_proceso"
  );

  const columns = [
    { field: "id", headerName: "ID", width: 300 },
    { field: "nombre_cliente", headerName: "Nombre", width: 300 },
    { field: "telefono", headerName: "Telefono", width: 300 },
    { field: "categoria_nombre", headerName: "Categoria", width: 200 },
    { field: "estado", headerName: "Estado", width: 160 },
    {
      field: "acciones",
      headerName: "Acciones",
      width: 300,
      renderCell: (params) => (
        <div className="flex justify-center pt-2 gap-2">
          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={() => setSelectedPedido(params.row)}
            // startIcon={<Visibility />}
          >
            Detalles del pedido
          </Button>
          {/* <Button
            variant="contained"
            color="error"
            size="small"
            startIcon={<Delete />}
            onClick={() => console.log("Eliminar pedido", params.row.id)}
          >
            Eliminar
          </Button> */}
        </div>
      ),
    },
  ];

  const getStock = (id) => {
    const producto = productos.find((data) => data.id === id);
    return producto ? producto.cantidad : 0;
  };

  const rows = filteredPedidos.map((pedido) => ({
    id: pedido.id,
    producto_nombre: pedido.producto_nombre,
    cantidad: pedido.cantidad,
    stock: getStock(pedido.producto),
  }));

  const rowsDetalle =
    selectedPedido && selectedPedido.producto
      ? [
          {
            id: selectedPedido.id,
            producto_nombre:
              productos.find((prod) => prod.id === selectedPedido.producto)
                ?.equipo || "Desconocido",
            cantidad: selectedPedido.cantidad,
            stock: getStock(selectedPedido.producto),
          },
        ]
      : [];

  const aprobarPedido = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/inventario/pedido/${selectedPedido.id}/aprobar/`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error al aprobar el pedido: ${errorText}`);
      }

      const updatedPedido = await response.json();
      console.log("Pedido aprobado", updatedPedido);

      setPedidos((prevPedidos) =>
        prevPedidos.map((pedido) =>
          pedido.id === selectedPedido.id
            ? { ...pedido, estado: "en_proceso" }
            : pedido
        )
      );

      closeModal();
    } catch (error) {
      console.error("Error al aprobar el pedido:", error);
    }
  };

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
              <ThemeProvider theme={theme}>
                <Paper elevation={3} className="p-4 bg-gray-800 rounded-lg">
                  <div style={{ height: 400, width: "100%" }}>
                    <DataGrid
                      rows={filteredPedidos}
                      columns={columns}
                      pageSize={5}
                      rowsPerPageOptions={[5]}
                      disableSelectionOnClick
                    />
                  </div>
                </Paper>
              </ThemeProvider>
            ) : (
              <p className="text-center text-gray-400">
                No hay pedidos disponibles.
              </p>
            )}
          </div>
        </main>
      </div>

      {selectedPedido && selectedPedido.producto_nombre && (
        <AnimatePresence>
          <motion.div
            className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="bg-white p-6 rounded-lg w-[1000px] max-h-[80vh] overflow-auto"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              transition={{ duration: 0.3 }}
            >
              <div className="">
                <div className="bg-white p-6 rounded-lg shadow-lg max-w-full w-full text-black">
                  <h2 className="text-2xl font-bold text-blue-400 mb-4">
                    Detalle del pedido
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col space-y-2">
                      <p className="text-sm font-semibold text-gray-700">
                        <span className="font-bold text-black">Nombre:</span>{" "}
                        {selectedPedido.nombre_cliente}
                      </p>
                      <p className="text-sm font-semibold text-gray-700">
                        <span className="font-bold text-black">Teléfono:</span>{" "}
                        {selectedPedido.telefono}
                      </p>
                      <p className="text-sm font-semibold text-gray-700">
                        <span className="font-bold text-black">Correo:</span>{" "}
                        {selectedPedido.correo}
                      </p>
                      <p className="text-sm font-semibold text-gray-700">
                        <span className="font-bold text-black">Dirección:</span>{" "}
                        {selectedPedido.direccion}
                      </p>
                    </div>
                    <div className="flex flex-col space-y-2">
                      <p className="text-sm font-semibold text-gray-700">
                        <span className="font-bold text-black">Barrio:</span>{" "}
                        {selectedPedido.barrio}
                      </p>
                      <p className="text-sm font-semibold text-gray-700">
                        <span className="font-bold text-black">Categoria:</span>{" "}
                        {selectedPedido.categoria_nombre}
                      </p>
                      <p className="text-sm font-semibold text-gray-700">
                        <span className="font-bold text-black">
                          Fecha de Reserva:
                        </span>{" "}
                        {selectedPedido.fecha_reserva}
                      </p>
                      <p className="text-sm font-semibold text-gray-700">
                        <span className="font-bold text-black">
                          Descripción:
                        </span>{" "}
                        {selectedPedido.descripcion_reserva}
                      </p>
                    </div>
                  </div>

                  <div
                    style={{ height: 300, width: "100%", marginTop: "20px" }}
                  >
                    <DataGrid
                      rows={rowsDetalle}
                      columns={columnas}
                      pageSize={5}
                      rowsPerPageOptions={[5]}
                      sx={{
                        backgroundColor: "#fff",
                        color: "#000",
                        "& .MuiDataGrid-cell": {
                          borderBottom: "1px solid #ccc",
                        },
                      }}
                    />
                  </div>

                  <div className="flex justify-around gap-4 mt-6">
                    <Button
                      variant="contained"
                      color="success"
                      onClick={aprobarPedido}
                    >
                      Aprobar
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      onClick={closeModal}
                    >
                      Cancelar
                    </Button>
                    <Button
                      variant="contained"
                      color="warning"
                      onClick={() =>
                        console.log("Pedido rechazado", selectedPedido.id)
                      }
                    >
                      Rechazar
                    </Button>
                  </div>
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
