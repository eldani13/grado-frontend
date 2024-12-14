import { Link, useLocation } from "react-router-dom";
import {
  HomeIcon,
  ClipboardDocumentListIcon,
  FolderIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  BanknotesIcon 
} from "@heroicons/react/24/outline";

export default function NavBar() {
  const location = useLocation();

  const menuItems = [
    { name: "Dashboard", icon: <HomeIcon className="h-6 w-6" />, path: "/home" },
    {
      name: "Categorías",
      icon: <FolderIcon className="h-6 w-6" />,
      path: "/categorias",
    },
    {
      name: "Productos",
      icon: <ClipboardDocumentListIcon className="h-6 w-6" />,
      path: "/productos",
    },
    {
      name: "Factura",
      icon: <BanknotesIcon className="h-6 w-6" />,
      path: "/factura",
    },
    { name: "Reportes",
      icon: <ChartBarIcon className="h-6 w-6" />,
      path: "/reportes" },
    {
      name: "Configuración",
      icon: <Cog6ToothIcon className="h-6 w-6" />,
      path: "/configuracion",
    },
  ];

  return (
    <aside className="fixed top-0 left-0 w-64 h-screen bg-gradient-to-tr from-gray-900 via-gray-800 to-gray-700 shadow-lg overflow-hidden">
      <ul className="space-y-2 mt-28 overflow-y-auto">
        {menuItems.map((item) => (
          <li key={item.name}>
            <Link
              to={item.path}
              className={`group flex items-center gap-4 text-lg font-medium cursor-pointer p-3 rounded-md transition-all duration-300 ${
                location.pathname === item.path
                  ? "bg-blue-600 text-white shadow-md"
                  : "text-gray-300 hover:bg-gray-800 hover:text-white"
              }`}
            >
              <div
                className={`h-10 w-1 rounded-r-md transition-all duration-300 ${
                  location.pathname === item.path
                    ? "bg-blue-400"
                    : "group-hover:bg-blue-400"
                }`}
              ></div>
              {item.icon}
              <span>{item.name}</span>
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}
