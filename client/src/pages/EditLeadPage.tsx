import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { Sparkles, Copy } from "lucide-react"; 
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

  //  Nuevos estados para controlar la Inteligencia Artificial
  const [correoIA, setCorreoIA] = useState("");
  const [generando, setGenerando] = useState(false);

  useEffect(() => {
    fetch("http://localhost:5000/api/leads")
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

  const handleGenerarCorreo = async () => {
    if (!formData.name) {
      toast.error("El prospecto necesita un nombre primero");
      return;
    }

    setGenerando(true);
    try {
      const respuesta = await api.post("/leads/generar-correo", {
        name: formData.name,
        source: formData.source,
        status: formData.status
      });

      setCorreoIA(respuesta.data.email);
      toast.success("¡Correo redactado por IA con éxito! 🤖");
    } catch (error) {
      console.error(error);
      toast.error("Error al generar el correo con IA");
    } finally {
      setGenerando(false);
    }
  };

  const handleCopiar = async () => {

    if (!correoIA) {
      toast.error("No hay correo para copiar");
      return;
    }
    navigator.clipboard.writeText(correoIA);
    toast.success("¡Correo copiado al portapapeles! 📋");
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
              className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" 
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
                className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" 
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

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Estado del Lead</label>
            <select name="status" value={formData.status} onChange={handleChange} className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white">
              <option value="NUEVO">Nuevo</option>
              <option value="CONTACTADO">Contactado</option>
              <option value="NEGOCIACION">En Negociación</option>
              <option value="CERRADO">Cerrado / Ganado</option>
            </select>
          </div>

          <div className="mt-8 p-5 bg-linear-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-100">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-indigo-900 flex items-center gap-2">
                <Sparkles size={18} className="text-indigo-600" />
                Asistente de Ventas IA
              </h3>
              
             
            <div className="flex gap-2">
              
              
              <button
                type="button"
                onClick={handleCopiar}
                className="flex items-center gap-2 bg-white border border-indigo-200 text-indigo-700 hover:bg-indigo-50 px-3 py-1.5 rounded-lg text-sm font-medium transition-all"
                title="Copiar correo"
              >
                <Copy size={18} />
              </button>
              
              
              <button
                type="button"
                onClick={handleGenerarCorreo}
                disabled={generando}
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all disabled:opacity-50"
              >
                {generando ? "Redactando..." : "Generar Correo"}
              </button>

            </div>
            </div>

            <textarea
              value={correoIA}
              onChange={(e) => setCorreoIA(e.target.value)}
              placeholder="Haz clic en 'Generar Correo' para que la IA redacte un mensaje personalizado para este cliente..."
              className="w-full h-40 p-3 text-sm border border-indigo-200 rounded-lg bg-white text-slate-700 focus:ring-2 focus:ring-indigo-400 outline-none resize-none"
            />
          </div>

          <button type="submit" className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors mt-6 font-bold">
            Guardar Cambios del Prospecto
          </button>
        </form>
      </div>
    </div>
  );
}