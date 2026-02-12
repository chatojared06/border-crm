import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Users, Kanban, Settings, LogOut } from "lucide-react"; 

export const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
    { icon: Users, label: "Leads", path: "/leads" },
    { icon: Kanban, label: "Pipeline", path: "/pipeline" }, 
    { icon: Settings, label: "Configuración", path: "/settings" },
  ];

  const handleLogout = () => {
    // Borramos el token y recargamos para ir al login
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <div className="h-screen w-64 bg-slate-900 text-white flex flex-col border-r border-slate-800">
      {/* Logo */}
      <div className="p-6">
        <h1 className="text-2xl font-bold tracking-tight text-blue-400">BorderCRM</h1>
      </div>

      {/* Menú de Navegación */}
      <nav className="flex-1 px-4 space-y-2">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive 
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-900/20" 
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <item.icon size={20} />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Botón Salir */}
      <div className="p-4 border-t border-slate-800">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 px-4 py-3 text-slate-400 hover:text-red-400 transition-colors rounded-lg hover:bg-slate-800"
        >
          <LogOut size={20} />
          <span className="font-medium">Cerrar Sesión</span>
        </button>
      </div>
    </div>
  );
};