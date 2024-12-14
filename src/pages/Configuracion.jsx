import { React, useState } from "react";
import NavBar from "../components/NavBar";
import Nav from "../components/Nav";
import {
  CogIcon,
  UserIcon,
  BellIcon,
  AdjustmentsHorizontalIcon,
  ShieldCheckIcon,
  KeyIcon,
  CloudIcon,
  ServerIcon,
  GlobeAltIcon,
} from "@heroicons/react/24/outline";

function Configuracion() {
  const [notificationSettings, setNotificationSettings] = useState(true);
  const [theme, setTheme] = useState("dark");
  const [userRole, setUserRole] = useState("admin");
  const [advancedModal, setAdvancedModal] = useState(false);
  const [cloudBackup, setCloudBackup] = useState(false);
  const [deviceSync, setDeviceSync] = useState(true);
  const [language, setLanguage] = useState("es");

  const handleSaveSettings = () => {
    console.log("Settings saved:", {
      notificationSettings,
      theme,
      userRole,
      cloudBackup,
      deviceSync,
      language,
    });
    alert("Configuración guardada exitosamente!");
  };

  const openAdvancedModal = () => {
    setAdvancedModal(true);
  };

  const closeAdvancedModal = () => {
    setAdvancedModal(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-tr from-gray-900 via-gray-800 to-black text-white">
      <Nav />

      <div className="flex flex-1 pt-20">
        <NavBar />
        <main className="flex-1 p-8 overflow-auto ml-64">
          <div className="mb-8">
            <h1 className="text-4xl font-extrabold">Configuración del Sistema</h1>
            <p className="text-gray-400">
              Administra las configuraciones de tu sistema de inventario y personaliza la experiencia.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
              <h2 className="text-2xl font-semibold text-gray-200 mb-4">Notificaciones</h2>
              <p className="text-gray-400 mb-4">Controla las notificaciones del sistema.</p>
              <label className="flex items-center gap-4">
                <input
                  type="checkbox"
                  checked={notificationSettings}
                  onChange={() => setNotificationSettings(!notificationSettings)}
                  className="form-checkbox h-6 w-6 text-blue-600"
                />
                <span className="text-gray-300">Habilitar notificaciones</span>
              </label>
            </div>

            <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
              <h2 className="text-2xl font-semibold text-gray-200 mb-4">Tema</h2>
              <p className="text-gray-400 mb-4">Selecciona el tema del sistema.</p>
              <select
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                className="w-full bg-gray-900 border border-gray-700 text-gray-300 rounded-md px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="dark">Oscuro</option>
                <option value="light">Claro</option>
              </select>
            </div>

            <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
              <h2 className="text-2xl font-semibold text-gray-200 mb-4">Respaldo en la Nube</h2>
              <p className="text-gray-400 mb-4">Habilita el respaldo automático de tus datos.</p>
              <label className="flex items-center gap-4">
                <input
                  type="checkbox"
                  checked={cloudBackup}
                  onChange={() => setCloudBackup(!cloudBackup)}
                  className="form-checkbox h-6 w-6 text-green-600"
                />
                <span className="text-gray-300">Habilitar respaldo en la nube</span>
              </label>
            </div>

            <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
              <h2 className="text-2xl font-semibold text-gray-200 mb-4">Sincronización de Dispositivos</h2>
              <p className="text-gray-400 mb-4">Mantén tus dispositivos sincronizados.</p>
              <label className="flex items-center gap-4">
                <input
                  type="checkbox"
                  checked={deviceSync}
                  onChange={() => setDeviceSync(!deviceSync)}
                  className="form-checkbox h-6 w-6 text-purple-600"
                />
                <span className="text-gray-300">Activar sincronización</span>
              </label>
            </div>

            <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
              <h2 className="text-2xl font-semibold text-gray-200 mb-4">Idioma</h2>
              <p className="text-gray-400 mb-4">Selecciona el idioma del sistema.</p>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full bg-gray-900 border border-gray-700 text-gray-300 rounded-md px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="es">Español</option>
                <option value="en">Inglés</option>
                <option value="fr">Francés</option>
              </select>
            </div>

            <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
              <h2 className="text-2xl font-semibold text-gray-200 mb-4">Ajustes Avanzados</h2>
              <p className="text-gray-400 mb-4">Configura detalles avanzados del sistema.</p>
              <button
                onClick={openAdvancedModal}
                className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 px-6 py-2 rounded-md text-white font-medium shadow-md"
              >
                <AdjustmentsHorizontalIcon className="h-5 w-5" /> Abrir Ajustes Avanzados
              </button>
            </div>
          </div>

          <div className="mt-10 flex justify-end">
            <button
              onClick={handleSaveSettings}
              className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-md text-white font-medium shadow-md"
            >
              Guardar Configuración
            </button>
          </div>
        </main>
      </div>

      {advancedModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-gray-900 p-8 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">Opciones Avanzadas</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold">Seguridad</h3>
                <p className="text-gray-400">Configura las opciones de seguridad del sistema.</p>
                <div className="flex items-center gap-2 mt-2">
                  <ShieldCheckIcon className="h-5 w-5 text-green-500" />
                  <span className="text-gray-300">Activar protección avanzada</span>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold">Accesos</h3>
                <p className="text-gray-400">Administra claves y accesos.</p>
                <div className="flex items-center gap-2 mt-2">
                  <KeyIcon className="h-5 w-5 text-yellow-500" />
                  <span className="text-gray-300">Rotar claves de acceso automáticamente</span>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold">Integraciones</h3>
                <p className="text-gray-400">Conecta tu sistema con herramientas externas.</p>
                <div className="flex items-center gap-2 mt-2">
                  <CloudIcon className="h-5 w-5 text-blue-500" />
                  <span className="text-gray-300">Habilitar integraciones con la nube</span>
                </div>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-4">
              <button
                onClick={closeAdvancedModal}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md text-white"
              >
                Cancelar
              </button>
              <button
                onClick={closeAdvancedModal}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-white"
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Configuracion;
