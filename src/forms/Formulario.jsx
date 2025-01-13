import React, { useState, useEffect } from "react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function Formulario() {
  const [pedido, setPedido] = useState({
    nombre_cliente: "",
    telefono: "",
    correo: "",
    direccion: "",
    barrio: "",
    nombre_compania: "",
    tipo_reserva: "",
    descripcion_reserva: "",
    fecha_reserva: "",
    fecha_inicio: "",
    fecha_fin: "",
    categoria: "", // Agregar campo de categoría
    producto: "", // Agregar campo de producto
    cantidad: "",
  });

  const [categorias, setCategorias] = useState([]);
  const [productos, setProductos] = useState([]);
  const [mensaje, setMensaje] = useState(null);
  const [error, setError] = useState(null);

  // Cargar las categorías desde la API
  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/inventario/categorias/`
        );
        const data = await response.json();
        setCategorias(data); // Suponiendo que la respuesta es un array de categorías
      } catch (err) {
        setError("Error al cargar las categorías");
      }
    };

    fetchCategorias();
  }, []);



  useEffect(() => {
    const fetchProductos = async () => {
      if (pedido.categoria) {
        try {
          const response = await fetch(`${API_BASE_URL}/api/inventario/productos`);
          const data = await response.json();
  
          if (Array.isArray(data)) {
            // Filtrar productos según la categoría seleccionada
            const productosFiltrados = data.filter(
              (producto) => producto.categoria === parseInt(pedido.categoria, 10)
            );
  
            console.log("Productos filtrados:", productosFiltrados);
            setProductos(productosFiltrados);
          } else {
            setError("Error al cargar los productos");
          }
        } catch (err) {
          setError("Error al cargar los productos");
        }
      }
    };
  
    fetchProductos();
  }, [pedido.categoria]);
  
  
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPedido({
      ...pedido,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${API_BASE_URL}/api/inventario/pedido/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(pedido),
      });

      if (response.ok) {
        const data = await response.json();
        setMensaje("Reserva creada con éxito");
        setError(null);
        setPedido({
          nombre_cliente: "",
          telefono: "",
          correo: "",
          direccion: "",
          barrio: "",
          nombre_compania: "",
          tipo_reserva: "",
          descripcion: "",
          fecha_reserva: "",
          fecha_inicio: "",
          fecha_fin: "",
          categoria: "",
          producto: "",
          cantidad: "",
        });
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Ocurrió un error al crear la reserva");
        setMensaje(null);
      }
    } catch (err) {
      setError("Error al conectar con el servidor");
      setMensaje(null);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-800 via-gray-900 to-black">
      <div className="w-full max-w-4xl p-8 bg-gray-900 bg-opacity-80 rounded-3xl shadow-2xl border border-gray-700">
        <h2 className="text-3xl font-bold text-center text-white mb-8">
          Formulario de Reserva
        </h2>
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-300">
                Nombre
              </label>
              <input
                type="text"
                name="nombre_cliente"
                value={pedido.nombre_cliente}
                onChange={handleChange}
                className="mt-2 p-3 rounded-lg bg-gray-800 text-white border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition duration-200"
                required
              />
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-300">
                Teléfono
              </label>
              <input
                type="tel"
                name="telefono"
                value={pedido.telefono}
                onChange={handleChange}
                className="mt-2 p-3 rounded-lg bg-gray-800 text-white border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition duration-200"
                required
              />
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-300">
                Correo
              </label>
              <input
                type="email"
                name="correo"
                value={pedido.correo}
                onChange={handleChange}
                className="mt-2 p-3 rounded-lg bg-gray-800 text-white border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition duration-200"
                required
              />
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-300">
                Dirección
              </label>
              <input
                type="text"
                name="direccion"
                value={pedido.direccion}
                onChange={handleChange}
                className="mt-2 p-3 rounded-lg bg-gray-800 text-white border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition duration-200"
                required
              />
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-300">
                Barrio
              </label>
              <input
                type="text"
                name="barrio"
                value={pedido.barrio}
                onChange={handleChange}
                className="mt-2 p-3 rounded-lg bg-gray-800 text-white border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition duration-200"
                required
              />
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-300">
                Compañia
              </label>
              <input
                type="text"
                name="nombre_compania"
                value={pedido.nombre_compania}
                onChange={handleChange}
                className="mt-2 p-3 rounded-lg bg-gray-800 text-white border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition duration-200"
                required
              />
            </div>
            {/* <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-300">Tipo de Reserva</label>
              <select
                name="tipo_reserva"
                value={pedido.tipo_reserva}
                onChange={handleChange}
                className="mt-2 p-3 rounded-lg bg-gray-800 text-white border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition duration-200"
                required
              >
                <option value="">Seleccione</option>
                <option value="camara">Camara</option>
                <option value="sonido">Sonido</option>
                <option value="audiovisual">Audiovisual</option>
              </select>
            </div> */}
            {/* Dropdown de categorías */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-300">
                Categoría
              </label>
              <select
                name="categoria"
                value={pedido.categoria}
                onChange={handleChange}
                className="mt-2 p-3 rounded-lg bg-gray-800 text-white border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition duration-200"
                required
              >
                <option value="">Seleccione una categoría</option>
                {categorias.map((categoria) => (
                  <option key={categoria.id} value={categoria.id}>
                    {categoria.nombre}
                  </option>
                ))}
              </select>
            </div>

            {/* Dropdown de productos */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-300">
                Producto
              </label>
              <select
                name="producto"
                value={pedido.producto}
                onChange={handleChange}
                disabled={!pedido.categoria || productos.length === 0}
                className="mt-2 p-3 rounded-lg bg-gray-800 text-white border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition duration-200"
                required
              >
                <option value="">Seleccione un producto</option>
                {productos.map((producto) => (
                  <option key={producto.id} value={producto.id}>
                    {producto.equipo}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-300">
              Cantidad
            </label>
            <input
              type="number"
              name="cantidad"
              value={pedido.cantidad}
              onChange={handleChange}
              className="mt-2 p-3 rounded-lg bg-gray-800 text-white border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition duration-200"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-300">
                Descripción de la Reserva
              </label>
              <textarea
                name="descripcion"
                value={pedido.descripcion}
                onChange={handleChange}
                className="mt-2 p-3 rounded-lg bg-gray-800 text-white border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition duration-200"
                required
              />
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-300">
                Fecha de Reserva
              </label>
              <input
                type="date"
                name="fecha_reserva"
                value={pedido.fecha_reserva}
                onChange={handleChange}
                className="mt-2 p-3 rounded-lg bg-gray-800 text-white border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition duration-200"
                required
              />
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-300">
                Fecha de Inicio
              </label>
              <input
                type="date"
                name="fecha_inicio"
                value={pedido.fecha_inicio}
                onChange={handleChange}
                className="mt-2 p-3 rounded-lg bg-gray-800 text-white border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition duration-200"
                required
              />
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-300">
                Fecha de Fin
              </label>
              <input
                type="date"
                name="fecha_fin"
                value={pedido.fecha_fin}
                onChange={handleChange}
                className="mt-2 p-3 rounded-lg bg-gray-800 text-white border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition duration-200"
                required
              />
            </div>
          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold rounded-full shadow-lg transform hover:scale-105 transition-transform duration-300 focus:outline-none focus:ring-4 focus:ring-blue-400"
            >
              Enviar Reserva
            </button>
          </div>
        </form>
        {mensaje && (
          <p className="text-green-400 text-center mt-4">{mensaje}</p>
        )}
        {error && <p className="text-red-400 text-center mt-4">{error}</p>}
      </div>
    </div>
  );
}
