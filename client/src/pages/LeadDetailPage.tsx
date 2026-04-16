import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { Sparkles, Copy, Mail, Pencil, Trash2 } from "lucide-react"; 
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

  const navigate = useNavigate();

  const handleDelete = async () => {
    // Candado de seguridad para evitar clics accidentales
    if (!window.confirm("¿Estás seguro de que deseas eliminar este prospecto?")) {
      return;
    }

    try {
      // Llamamos a tu backend para borrarlo (verifica que esta sea tu ruta correcta)
      await api.delete(`/leads/${id}`);
      toast.success("Prospecto eliminado exitosamente 🗑️");
      
      // Lo mandamos de regreso a la lista principal
      navigate("/leads");
    } catch (error) {
      console.error(error);
      toast.error("Hubo un error al eliminar el prospecto");
    }
  };

  const handleAbrirGmail = () => {
    // 1. Usamos formData en lugar de lead
    if (!formData.email || !correoIA) {
      alert("Falta el correo del destinatario o generar el mensaje.");
      return; 
    }

    // 2. Extraemos el correo y el nombre desde formData
    const destinatario = formData.email; 
    const asuntoBruto = `Seguimiento de contacto - ${formData.name}`;
    
    // 3. Codificamos el texto
    const asunto = encodeURIComponent(asuntoBruto);
    const cuerpo = encodeURIComponent(correoIA); 

    // 4. Abrimos Gmail
    const mailtoLink = `mailto:${destinatario}?subject=${asunto}&body=${cuerpo}`;
    window.open(mailtoLink, '_blank');
  };


  return (
    <div className="max-w-2xl mx-auto pb-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Datos del Lead</h1>
        
        <div className="flex gap-2">
          {/* Botón de Editar (Nos lleva a la ruta que ya tienes construida) */}
          <Link
            to={`/leads/edit/${id}`}
            className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors text-sm font-medium shadow-sm"
            title="Editar prospecto"
          >
            <Pencil size={16} />
            <span className="hidden sm:inline">Editar</span>
          </Link>

          {/* Botón de Eliminar */}
          <button
            onClick={handleDelete}
            className="flex items-center gap-2 px-3 py-2 bg-white border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors text-sm font-medium shadow-sm"
            title="Eliminar prospecto"
          >
            <Trash2 size={16} />
            <span className="hidden sm:inline">Eliminar</span>
          </button>
        </div>
      </div>
      
      <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100 mb-6">
        <div className="space-y-5">
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Nombre Completo </label>
            <p
            className="w-full p-2 border border-slate-300 rounded-lg font-medium text-slate-800" 
            >{formData.name}</p>
          </div>
          
           <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Correo Electrónico </label>
            <p
            className="w-full p-2 border border-slate-300 rounded-lg font-medium text-slate-800" 
            >{formData.email}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
             <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Telefono </label>
            <p
            className="w-full p-2 border border-slate-300 rounded-lg font-medium text-slate-800" 
            >{formData.phone}</p>
          </div>

           <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Origen </label>
                <p
                className="w-full p-2 border border-slate-300 rounded-lg font-medium text-slate-800" 
                >{formData.source}</p>
           </div>
          </div>

           <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Estado del lead </label>
            <p
            className="w-full p-2 border border-slate-300 rounded-lg font-medium text-slate-800" 
            >{formData.status}</p>
          </div>

          <div className="mt-8 p-5 bg-linear-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-100 flex flex-col"> {/* Cambiado a flex-col para apilado vertical */}
            
            {/* Fila 1: Título del Asistente (arriba) */}
            <div className="mb-3 pb-3 border-b border-indigo-100"> {/* Añadido margen, padding y borde inferior para separación */}
              <h3 className="text-sm font-bold text-indigo-900 flex items-center gap-2 m-0">
                <Sparkles size={18} className="text-indigo-600" />
                Asistente de Ventas IA
              </h3>
            </div>
            
            {/* Fila 2: Botones de Acción (apilados verticalmente abajo) */}
            <div className="flex flex-col gap-2 w-full"> {/* flex-col para apilar botones, gap-2 para separación, w-full para ocupar ancho */}
              
              {/* Botón 1: Copiar */}
              <button
                type="button"
                onClick={handleCopiar}
                className="flex items-center justify-center gap-2 w-full bg-white border border-indigo-200 text-indigo-700 hover:bg-indigo-50 px-3 py-1.5 rounded-lg text-sm font-medium transition-all"
                title="Copiar correo"
              >
                <Copy size={18} />
                <span>Copiar Texto</span> 
              </button>
              
              {/* Botón 2: Enviar por Gmail (Solo aparece si hay correoIA) */}
              {correoIA && (
                <button
                  type="button"
                  onClick={handleAbrirGmail}
                  className="flex items-center justify-center gap-2 w-full bg-white border border-red-200 text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-lg text-sm font-medium transition-all"
                  title="Abrir en Gmail"
                >
                  <Mail size={18} />
                  <span>Enviar por Gmail</span> 
                </button>
              )}
              
              {/* Botón 3: Generar Correo */}
              <button
                type="button"
                onClick={handleGenerarCorreo}
                disabled={generando}
                className="flex items-center justify-center gap-2 w-full bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all disabled:opacity-50 whitespace-nowrap"
              >
                {generando ? "Redactando..." : "Generar Correo"}
              </button>

               <textarea
              value={correoIA}
              onChange={(e) => setCorreoIA(e.target.value)}
              placeholder="Haz clic en 'Generar Correo' para que la IA redacte un mensaje personalizado para este cliente..."
              className="w-full h-40 p-3 text-sm border border-indigo-200 rounded-lg bg-white  text-slate-800 focus:ring-2 focus:ring-indigo-400 outline-none resize-none"
            /> 
            
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

