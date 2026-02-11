import { useForm } from "react-hook-form";
import { Lock, Mail, ArrowRight, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import api from "../lib/axios";

// Definimos la forma exacta que tendrán los datos del formulario
interface LoginForm {
  email: string;
  password: string;
}

export default function LoginPage() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (data: LoginForm) => {
    try {
      // 1. Enviar datos al backend
      const response = await api.post("/auth/login", data);
      
      // 2. Si todo sale bien: Guardar el token en el navegador
      localStorage.setItem("token", response.data.token);
      
      // 3. Avisar al usuario
      toast.success("¡Bienvenido de nuevo!");
      
      // 4. Redirigir al Dashboard
      navigate("/dashboard");

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
      console.error(error);
      // Si falla, mostrar el error que viene del backend o uno genérico
      const mensaje = error.response?.data?.error || "Error al iniciar sesión";
      toast.error(mensaje);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-slate-100">
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-800">BorderCRM</h1>
          <p className="text-slate-500 mt-2">Inicia sesión para gestionar tus ventas</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Correo Electrónico</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
              <input
                {...register("email", { required: "El correo es obligatorio" })}
                type="email"
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                placeholder="tu@email.com"
              />
            </div>
            {errors.email && <p className="text-red-500 text-xs mt-1">{String(errors.email.message)}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Contraseña</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
              <input
                {...register("password", { required: "La contraseña es obligatoria" })}
                type="password"
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                placeholder="••••••••"
              />
            </div>
            {errors.password && <p className="text-red-500 text-xs mt-1">{String(errors.password.message)}</p>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" /> Conectando...
              </>
            ) : (
              <>
                Entrar al Sistema <ArrowRight className="h-5 w-5" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-500">
          ¿No tienes cuenta? <span className="text-blue-600 font-medium cursor-pointer">Contacta al admin</span>
        </div>
      </div>
    </div>
  );
}