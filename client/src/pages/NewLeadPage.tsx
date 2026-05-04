import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner"; // Para mostrar la notificación de éxito
import api from "../lib/axios";

export default function NewLeadPage() {
  const navigate = useNavigate();

  // 1. La Memoria del formulario
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    source: "Web", // Valor por defecto
  });

  // 2. Función para actualizar la memoria cuando el usuario escribe
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // 3. Función que se ejecuta al darle clic a "Guardar"
  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault(); // Evita que la página recargue

    try {
      await api.post("/leads", formData);
      toast.success("Lead guardado correctamente 🚀");
      navigate("/leads"); // Te regresa a la tabla de leads
    } catch (error) {
      console.error(error);
      toast.error("Error de conexión con el servidor");
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Agregar Nuevo Lead</h1>
      
      <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100">
        {/* Conectamos la función handleSubmit al formulario */}
        <form onSubmit={handleSubmit} className="space-y-5">
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Nombre Completo *</label>
            <input 
              type="text" 
              name="name" 
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" 
              placeholder="Ej. Juan Pérez" 
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Correo Electrónico *</label>
            <input 
              type="email" 
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" 
              placeholder="juan@empresa.com" 
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Teléfono</label>
              <input 
                type="text" 
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" 
                placeholder="664..." 
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Origen</label>
              <select 
                name="source"
                value={formData.source}
                onChange={handleChange}
                className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
              >
                <option value="Web">Página Web</option>
                <option value="Referido">Referido</option>
                <option value="LinkedIn">LinkedIn</option>
                <option value="Otro">Otro</option>
              </select>
            </div>
          </div>

          <button 
            type="submit" 
            className="w-full bg-blue-600 text-white font-medium px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors mt-6"
          >
            Guardar Prospecto
          </button>
        </form>
      </div>
    </div>
  );
}