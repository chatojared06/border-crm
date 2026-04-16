import { useState } from 'react';
import { useForm } from "react-hook-form";
import { Mail, Lock, User, ArrowRight, Eye, EyeClosed } from 'lucide-react';

// Le decimos a TypeScript exactamente qué campos esperar
interface RegisterFormData {
  nombre: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export const RegisterPage = () => {
// ✅ El ojo se queda igual
  const [showPassword, setShowPassword] = useState(false);

  // ✅ Inicializa React Hook Form
  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormData>();



  // Esta función es especial para React Hook Form. Mira los valores finales ('data').
  const onSubmit = (data: RegisterFormData) => {
    console.log("Datos listos y validados:", data);
  };

  return (
    // Contenedor principal: pantalla completa y centrado
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      
      {/* Tarjeta blanca del formulario */}
      <div className="bg-white w-full max-w-md rounded-2xl shadow-sm border border-slate-200 p-8">
        
        {/* Encabezado */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">BorderCRM</h1>
          <p className="text-slate-500">Crea tu cuenta y comienza a vender</p>
        </div>

        {/* Formulario principal conectado a handleSubmit */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          
          {/* Campo: Nombre Completo */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Nombre Completo
            </label>
            <div className="relative">
              {/* Icono posicionado sobre el input */}
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <User size={20} />
              </div>
              {/* Input conectado al estado 'formData.nombre' */}
              <input
                type="text"
                {...register("nombre", { required: "El nombre es obligatorio" })}
                placeholder="Ej. Juan Pérez"
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all font-medium text-slate-600"
                required
              />
            </div>
            {errors.nombre && <p className="text-red-500 text-xs mt-1">{String(errors.nombre.message)}</p>}
          </div>

          {/* Campo: Correo Electrónico */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Correo Electrónico
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Mail size={20} />
              </div>
              <input
                type="email"
                {...register("email", { 
                  required: "El correo es obligatorio",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Ingresa un correo electrónico válido"
                  }
                })}
                placeholder="tu@email.com"
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all font-medium text-slate-600"
                required
              />
            </div>
            {errors.email && <p className="text-red-500 text-xs mt-1">{String(errors.email.message)}</p>}
          </div>

          {/* Campo: Contraseña */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Contraseña
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Lock size={20} />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                {...register("password", { 
                  required: "La contraseña es obligatoria",
                  minLength: {
                    value: 6,
                    message: "La contraseña debe tener al menos 6 caracteres"
                  }
                })}
                placeholder="••••••••"
                className=" w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all font-medium text-slate-600"
                required
              />
               <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
              >
                {showPassword ? <Eye size={20} /> : <EyeClosed size={20} />}
               </button>
            </div>
            {errors.password && <p className="text-red-500 text-xs mt-1">{String(errors.password.message)}</p>}
          </div>

          {/* Campo: Confirmar Contraseña */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Confirmar Contraseña
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Lock size={20} />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                {...register("confirmPassword", { 
                  required: "Por favor, confirma tu contraseña",
                  validate: (value, formValues) => value === formValues.password || "Las contraseñas no coinciden"
                })}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all font-medium text-slate-600"
                required
              />
            </div>
            {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{String(errors.confirmPassword.message)}</p>}
          </div>

          {/* Botón de Enviar */}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg flex items-center justify-center gap-2 transition-colors mt-2"
          >
            Crear Cuenta <ArrowRight size={20} />
          </button>

        </form>

        {/* Enlace para regresar al Login */}
        <div className="mt-6 text-center text-sm text-slate-500">
          ¿Ya tienes cuenta?{' '}
          <a href="/login" className="text-blue-600 hover:text-blue-700 font-medium hover:underline">
            Inicia sesión aquí
          </a>
        </div>

      </div>
    </div>
  );
};