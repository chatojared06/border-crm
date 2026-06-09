import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Bell, Shield, Lock } from "lucide-react";
import { jwtDecode } from "jwt-decode";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { isAxiosError } from "axios";
import api from "../lib/axios"; 

interface MiToken {
  userId: number;
  email: string;
  iat: number;
  exp: number;
}

interface UsuarioState {
  userId?: number;
  email: string;
  rol: string;
}

const passwordSchema = z.object({
  currentPassword: z.string().min(1, "La contraseña actual es requerida"),
  newPassword: z.string().min(8, "La nueva contraseña debe tener al menos 8 caracteres"),
  confirmPassword: z.string()
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"],
});

type PasswordFormValues = z.infer<typeof passwordSchema>;


export default function SettingsPage() {
  const [usuario] = useState<UsuarioState>(() => {
    const token = localStorage.getItem("token");
    
    if (!token) {
      return { email: "No hay token", rol: "Invitado" };
    }
    
    try {
      const decoded = jwtDecode<MiToken>(token);
      return { userId: decoded.userId, email: decoded.email, rol: "Administrador" };
    } catch {
      return { email: "Token inválido", rol: "Invitado" };
    }
  });

  const [activeTab, setActiveTab] = useState("perfil");
  
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [deleteError, setDeleteError] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();

  // 1. Inicializamos React Hook Form con Zod
  const { 
    register, 
    handleSubmit, 
    reset, 
    formState: { errors, isSubmitting } 
  } = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema) 
  });

  // 2. Función que ejecuta el Submit
  const onSubmitPassword = async (data: PasswordFormValues) => {
    try {
      if (!usuario.userId) {
        toast.error("Usuario no válido");
        return;
      }

      // Hacemos la petición PUT a tu backend
      await api.put('api/auth/change-password', {
        userId: usuario.userId,
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });

      toast.success("¡Contraseña actualizada con éxito! 🔒");
      reset(); // Limpiamos los inputs
      setActiveTab("perfil");
    } catch (error) {
      if (isAxiosError(error)) {
        toast.error(error.response?.data?.error || "Ocurrió un error al cambiar la contraseña");
      } else {
        toast.error("Ocurrió un error al cambiar la contraseña");
      }
    }
  };

  const handleDeleteAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setDeleteError('');
    setIsDeleting(true);

    try {
      await api.delete('/api/auth/delete-account', {
        data: { password: deletePassword },
      });
      
      localStorage.removeItem('token'); 
      navigate('/login');
      toast.success("¡Cuenta eliminada con éxito!");
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        setDeleteError(error.response?.data?.error || 'Error al intentar eliminar la cuenta.');
      } else {
        setDeleteError('Error al intentar eliminar la cuenta.');
      }
    } finally {
      setIsDeleting(false);
    }
  };
  
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
              {/* 🛡️ TARJETA 1: Cambio de Contraseña */}
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <h2 className="text-lg font-semibold text-slate-800 mb-1">Cambiar Contraseña</h2>
                <p className="text-sm text-slate-500 mb-6">Asegúrate de usar una contraseña larga y segura.</p>
                
                {/* FORMULARIO ÚNICO CON REACT HOOK FORM */}
                <form 
                  className="space-y-4 max-w-md animate-fade-in" 
                  onSubmit={handleSubmit(onSubmitPassword)}
                >
                  {/* 1. Contraseña Actual */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Contraseña Actual</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                      <input 
                        type="password" 
                        placeholder="••••••••" 
                        {...register("currentPassword")}
                        className={`w-full pl-10 pr-4 py-2.5 rounded-lg border ${errors.currentPassword ? 'border-red-500 focus:ring-red-500' : 'border-slate-300 focus:ring-blue-500'} focus:ring-2 outline-none transition-all`}
                      />
                    </div>
                    {errors.currentPassword && <p className="text-red-500 text-xs mt-1">{errors.currentPassword.message}</p>}
                  </div>

                  {/* 2. Nueva Contraseña */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Nueva Contraseña</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                      <input
                        type="password"
                        placeholder="••••••••"
                        {...register("newPassword")}
                        className={`w-full pl-10 pr-4 py-2.5 rounded-lg border ${errors.newPassword ? 'border-red-500 focus:ring-red-500' : 'border-slate-300 focus:ring-blue-500'} focus:ring-2 outline-none transition-all`}
                      />
                    </div>
                    {errors.newPassword && <p className="text-red-500 text-xs mt-1">{errors.newPassword.message}</p>}
                  </div>

                  {/* 3. Confirmar Contraseña */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Confirmar Nueva Contraseña</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                      <input
                        type="password"
                        placeholder="••••••••"
                        {...register("confirmPassword")}
                        className={`w-full pl-10 pr-4 py-2.5 rounded-lg border ${errors.confirmPassword ? 'border-red-500 focus:ring-red-500' : 'border-slate-300 focus:ring-blue-500'} focus:ring-2 outline-none transition-all`}
                      />
                    </div>
                    {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>}
                  </div>
                  
                  {/* Botón de Submit */}
                  <div className="pt-2">
                    <button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center min-w-45"
                    >
                      {isSubmitting ? "Actualizando..." : "Guardar Nueva Contraseña"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
          {/* --- ZONA DE PELIGRO --- */}
              <div className="mt-12 border-t border-red-200 pt-6 animate-fade-in">
                <h3 className="text-lg font-bold text-red-600">Zona de Peligro</h3>
                <p className="mt-1 text-sm text-gray-500 mb-4">
                  Al eliminar tu cuenta, todos tus prospectos (Leads) y datos operativos en BorderCRM se borrarán permanentemente.
                </p>

                {!showDeleteConfirm ? (
                  <button
                    type="button"
                    onClick={() => setShowDeleteConfirm(true)}
                    className="bg-red-600 hover:bg-red-700 text-white text-sm font-semibold py-2 px-4 rounded-lg transition-colors"
                  >
                    Eliminar mi cuenta
                  </button>
                ) : (
                  <form onSubmit={handleDeleteAccount} className="max-w-md bg-red-50 p-5 rounded-xl border border-red-200 shadow-sm">
                    <label className="block text-sm font-medium text-red-800 mb-2">
                      Por seguridad, introduce tu contraseña actual para confirmar:
                    </label>
                    <input
                      type="password"
                      value={deletePassword}
                      onChange={(e) => setDeletePassword(e.target.value)}
                      className="w-full px-3 py-2 border border-red-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 bg-white transition-all"
                      placeholder="••••••••"
                      required
                      disabled={isDeleting}
                    />
                    
                    {deleteError && (
                      <p className="mt-2 text-sm text-red-600 font-medium">{deleteError}</p>
                    )}

                    <div className="mt-4 flex gap-3">
                      <button
                        type="submit"
                        disabled={isDeleting}
                        className="bg-red-600 hover:bg-red-700 text-white text-sm font-semibold py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
                      >
                        {isDeleting ? 'Eliminando...' : 'Confirmar Eliminación'}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowDeleteConfirm(false);
                          setDeletePassword('');
                          setDeleteError('');
                        }}
                        className="bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm font-semibold py-2 px-4 rounded-lg transition-colors"
                        disabled={isDeleting}
                      >
                        Cancelar
                      </button>
                    </div>
                  </form>
                )}
              </div>
        </div>
      </div>
    </div>
  );
}