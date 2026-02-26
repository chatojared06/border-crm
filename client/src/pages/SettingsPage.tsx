import { useState } from "react";
import { User, Bell, Shield, Lock } from "lucide-react";
import { jwtDecode } from "jwt-decode";

interface MiToken {
  userId: number;
  email: string;
  iat: number;
  exp: number;
}

export default function SettingsPage() {
  const [usuario] = useState(() => {
    const token = localStorage.getItem("token");
    
    if (!token) {
      return { email: "No hay token", rol: "Invitado" };
    }
    
    try {
      const decoded = jwtDecode<MiToken>(token);
      return { email: decoded.email, rol: "Administrador" };
    } catch {
      return { email: "Token inválido", rol: "Invitado" };
    }
  });

  const [activeTab, setActiveTab] = useState("perfil");
  const [passwordVerificada, setPasswordVerificada] = useState(false);
  
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Configuración del Sistema</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Columna Izquierda: Menú de opciones */}
        <div className="md:col-span-1 space-y-2">
          
          <button className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
            activeTab === "perfil" ? "bg-blue-50 text-blue-700" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
          }`}
            onClick={() => setActiveTab("perfil")} >
            <User size={20} />
            Mi Perfil
          </button>
          
          <button className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
            activeTab === "notificaciones" ? "bg-blue-50 text-blue-700" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
          }`}
            onClick={() => setActiveTab("notificaciones")}>
            <Bell size={20} />
            Notificaciones
          </button>
          
          <button className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
            activeTab === "seguridad" ? "bg-blue-50 text-blue-700" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
          }`}
            onClick={() => setActiveTab("seguridad")}>
            <Shield size={20} />
            Seguridad
          </button>
        </div>

        {/* Columna Derecha: Contenido */}
        <div className="md:col-span-2 space-y-6">

          {activeTab === "perfil" && (
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
          )}

            {/* 🚨 PANEL DE NOTIFICACIONES */}
          {activeTab === "notificaciones" && (
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm animate-fade-in">
              <h2 className="text-lg font-semibold text-slate-800 mb-1">Preferencias de Notificaciones</h2>
              <p className="text-sm text-slate-500 mb-6">Elige qué tipo de alertas deseas recibir en tu correo o en el sistema.</p>

              <div className="space-y-4">
                
                {/* PRIMERA ALERTA: Nuevos Leads */}
                <div className="flex items-center justify-between p-4 border border-slate-100 rounded-lg hover:bg-slate-50 transition-colors">
                  <div>
                    <h3 className="font-medium text-slate-700">Nuevos Leads</h3>
                    <p className="text-sm text-slate-500">Avisarme cuando se registre o me asignen un prospecto nuevo.</p>
                  </div>
                  
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                  
                </div>

                {/* SEGUNDA ALERTA: Cambios en el Pipeline */}
                
                <div className="flex items-center justify-between p-4 border border-slate-100 rounded-lg hover:bg-slate-50 transition-colors">
                  <div>
                    <h3 className="font-medium text-slate-700">Cambios en el Pipeline</h3>
                    <p className="text-sm text-slate-500">Avisarme cuando un prospecto avance o cambie de etapa.</p>
                  </div>
            
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                  
                </div>

                {/* TERCERA ALERTA: Resumen Semanal */}
                
                <div className="flex items-center justify-between p-4 border border-slate-100 rounded-lg hover:bg-slate-50 transition-colors">
                  <div>
                    <h3 className="font-medium text-slate-700">Resumen Semanal</h3>
                    <p className="text-sm text-slate-500">Avisarme al finalizar cada semana con un resumen de actividades.</p>
                  </div>
                  
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                  
                </div>
              </div>

              {/* Botón de Guardar */}
              <div className="mt-8 pt-6 border-t border-slate-100 flex justify-end">
                <button className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                  Guardar Preferencias
                </button>
              </div>
            </div>
          )}

          {/* 🚨 PANEL DE SEGURIDAD */}
          {activeTab === "seguridad" && (
            <div className="space-y-6 animate-fade-in">
              
              {/* 🛡️ TARJETA 1: Cambio de Contraseña */}
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <h2 className="text-lg font-semibold text-slate-800 mb-1">Cambiar Contraseña</h2>
                <p className="text-sm text-slate-500 mb-6">Asegúrate de usar una contraseña larga y segura.</p>
                
                {/* LÓGICA DE 2 PASOS */}
                {!passwordVerificada ? (
                  
                  /* PASO 1: VERIFICAR IDENTIDAD */
                  <form 
                    className="space-y-4 max-w-md" 
                    onSubmit={(e) => {
                      e.preventDefault();
                      // Aquí en el futuro llamaríamos al backend. Por ahora, solo simulamos el éxito:
                      setPasswordVerificada(true); 
                    }}
                  >
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Ingresa tu Contraseña Actual</label>
                      <input 
                        type="password" 
                        placeholder="••••••••" 
                        required
                        className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" 
                      />
                    </div>
                    <button type="submit" className="bg-slate-800 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-900 transition-colors">
                      Verificar Identidad
                    </button>
                  </form>

                ) : (

                  /* PASO 2: INGRESAR NUEVA CONTRASEÑA */
                  <form 
                    className="space-y-4 max-w-md animate-fade-in"
                    onSubmit={(e) => {
                      e.preventDefault();
                      // Simulamos que se guardó la contraseña y reiniciamos el flujo
                      alert("¡Contraseña actualizada con éxito! 🔒");
                      setPasswordVerificada(false);
                    }}
                  >
                    <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-lg text-sm font-medium mb-4">
                      ✅ Identidad verificada. Ingresa tu nueva contraseña.
                    </div>
                    
                    {/* RETO: Pon aquí tus dos inputs (Nueva Contraseña y Confirmar Contraseña) */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Nueva Contraseña</label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                        <input
                          type="password"
                          className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                          placeholder="••••••••"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Confirmar Nueva Contraseña</label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                        <input
                          type="password"
                          className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                          placeholder="••••••••"
                        />
                      </div>
                    </div>
                    
                    
                    <div className="flex gap-3 pt-2">
                      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                        Guardar Nueva Contraseña
                      </button>
                      <button 
                        type="button" 
                        onClick={() => setPasswordVerificada(false)}
                        className="bg-white border border-slate-300 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors"
                      >
                        Cancelar
                      </button>
                    </div>
                  </form>

                )}
              </div>

              {/* 📱 TARJETA 2: Autenticación de Dos Pasos (2FA) */}
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h3 className="font-semibold text-slate-800">Autenticación de Dos Pasos (2FA)</h3>
                  <p className="text-sm text-slate-500 mt-1">Añade una capa extra de seguridad usando una aplicación como Google Authenticator.</p>
                </div>
                
                <button className="shrink-0 bg-blue-50 text-blue-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors">
                  Configurar 2FA
                </button>
              </div>

              {/* 💻 TARJETA 3: Sesiones Activas */}
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="font-semibold text-slate-800 mb-4">Dispositivos Activos</h3>
                
                {/* Fila del dispositivo actual */}
                <div className="flex justify-between items-center p-4 border border-slate-100 rounded-lg bg-slate-50">
                  <div>
                    <p className="font-medium text-slate-800 text-sm">MacBook Pro - Chrome</p>
                    <p className="text-xs text-slate-500">Tijuana, MX • Activo ahora</p>
                  </div>
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-100 px-2 py-1 rounded-full">Actual</span>
                </div>

                <div className="mt-4">
                  <button className="text-sm font-medium text-red-600 hover:text-red-700 transition-colors">
                    Cerrar sesión en otros dispositivos
                  </button>
                </div>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
}