import { useState } from "react";
import { User, Bell, Shield } from "lucide-react";
import { jwtDecode } from "jwt-decode";

// Le decimos a TypeScript qué datos esperamos encontrar dentro del token
interface MiToken {
  userId: number;
  email: string;
  iat: number;
  exp: number;
}

export default function SettingsPage() {
  // Inicialización Perezosa: Lee el token una sola vez sin causar renders extra
  const [usuario] = useState(() => {
    const token = localStorage.getItem("token");
    
    if (!token) {
      return { email: "No hay token", rol: "Invitado" };
    }
    
    try {
      const decoded = jwtDecode<MiToken>(token);
      console.log("Contenido del token:", decoded);
      return { email: decoded.email, rol: "Administrador" };
    } catch {
      // Por si el token está corrupto
      return { email: "Token inválido", rol: "Invitado" };
    }
  });

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Configuración del Sistema</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Columna Izquierda: Menú de opciones */}
        <div className="md:col-span-1 space-y-2">
          <button className="w-full flex items-center gap-3 px-4 py-3 bg-blue-50 text-blue-700 rounded-lg font-medium transition-colors">
            <User size={20} />
            Mi Perfil
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-lg font-medium transition-colors">
            <Bell size={20} />
            Notificaciones
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-lg font-medium transition-colors">
            <Shield size={20} />
            Seguridad
          </button>
        </div>

        {/* Columna Derecha: Contenido */}
        <div className="md:col-span-2 space-y-6">
          
          {/* Tarjeta de Perfil */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-800 mb-4">Información Personal</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-500 mb-1">Correo Electrónico</label>
                <input 
                  type="email" 
                  disabled 
                  value={usuario.email} 
                  className="w-full p-2 border border-slate-200 rounded-lg bg-slate-50 text-slate-700 font-medium" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-500 mb-1">Rol en el sistema</label>
                <input 
                  type="text" 
                  disabled 
                  value={usuario.rol} 
                  className="w-full p-2 border border-slate-200 rounded-lg bg-slate-50 text-slate-700" 
                />
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}