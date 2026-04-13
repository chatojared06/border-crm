import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import api from "../lib/axios";

interface Lead {
  id: number;
  name: string;
  email: string;
  phone: string;
  source: string;
  status: string;
}

export default function EditLeadPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    source: "Web",
    status: "NUEVO"
  });

  useEffect(() => {
    fetch("https://border-crm.onrender.com/api/leads")
      .then((res) => res.json())
      .then((datos) => {
        const leadActual = datos.find((l: Lead) => l.id === Number(id));
        if (leadActual) {
          setFormData({
            name: leadActual.name,
            email: leadActual.email,
            phone: leadActual.phone || "",
            source: leadActual.source || "Web",
            status: leadActual.status,
          });
        }
      });
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    try {
      const respuesta = await api.put(`/leads/${id}`, formData);
      if (respuesta.status === 200) {
        toast.success("Prospecto actualizado 🚀");
        navigate("/leads");
      }
    } catch (error) { 
      console.error(error);
      const axiosError = error as { response?: { data?: { error?: string } } };
      toast.error(axiosError.response?.data?.error || "Error al actualizar");
    }
  };

  return (
    <div className="max-w-2xl mx-auto pb-10">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Editar Prospecto</h1>
      
      <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100 mb-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Nombre Completo *</label>
            <input 
              type="text" 
              name="name" 
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none font-medium text-slate-800" 
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
              className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none font-medium text-slate-800" 
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Teléfono</label>
              <input 
                type="text" 
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none font-medium text-slate-800" 
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Origen</label>
              <select 
                name="source"
                value= {formData.source}
                onChange={handleChange}
                className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white font-medium text-slate-800"
              >
                <option value="Web">Página Web</option>
                <option value="Referido">Referido</option>
                <option value="LinkedIn">LinkedIn</option>
                <option value="Otro">Otro</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Estado del Lead</label>
            <select name="status" value={formData.status} onChange={handleChange} className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white font-medium text-slate-800">
              <option className="font-medium text-slate-800" value="NUEVO">Nuevo</option>
              <option className="font-medium text-slate-800" value="CONTACTADO">Contactado</option>
              <option className="font-medium text-slate-800" value="NEGOCIACION">En Negociación</option>
              <option className="font-medium text-slate-800" value="CERRADO">Cerrado / Ganado</option>
            </select>
          </div>


          <button type="submit" className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors mt-6 font-bold">
            Guardar Cambios del Prospecto
          </button>
        </form>
      </div>
    </div>
  );
}