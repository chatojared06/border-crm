import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, Pencil } from "lucide-react";
import { Link } from "react-router-dom";

// Definimos la "forma" de un Lead en TypeScript para que nos ayude a autocompletar
interface Lead {
  id: number;
  name: string;
  email: string;
  phone: string;
  source: string;
  status: string;
}

export default function LeadsPage() {
  const navigate = useNavigate();
  // Aquí guardaremos la lista de leads que nos dé el Backend
  const [leads, setLeads] = useState<Lead[]>([]);

  // useEffect se ejecuta automáticamente cuando entras a la página
  useEffect(() => {
    fetch("https://border-crm.onrender.com/api/leads")
      .then((respuesta) => respuesta.json())
      .then((datos) => setLeads(datos))
      .catch((error) => console.error("Error al cargar leads:", error));
  }, []);

  const handleDelete = async (id: number) => {
  // 1. Preguntar si está seguro (Opcional, pero recomendado)
  const confirmar = window.confirm("¿Estás seguro de que deseas eliminar este prospecto?");
  if (!confirmar) return;

  try {
    const respuesta = await fetch(`https://border-crm.onrender.com/api/leads/${id}`, {
        method: "DELETE",
    });
    if (respuesta.ok) {
        // 2. Si el backend confirma que se eliminó, actualizamos la lista en el frontend
        setLeads(leads.filter((lead) => lead.id !== id));
    } else {
        console.error("Error al eliminar el prospecto");
    }
    
  } catch (error) {
    console.error("Error al eliminar:", error);
  }
};

  return (
    <div>
      {/* Cabecera de la página */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Datos del Lead</h1>
        
        <div className="flex gap-2">

          {/* Botón de Añadir Lead */}
          <button
            className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors text-sm font-medium shadow-sm"
            title="Añadir Lead"
          >
            <Plus size={16} />
            <span className="hidden sm:inline">Añadir Lead</span>
          </button>
        </div>
      </div>

      {/* Tabla de Leads */}

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 text-xs md:text-sm uppercase tracking-wider">
              <th className="p-4 font-medium">Nombre</th>
              <th className="p-4 font-medium text-center">Estado</th>
              <th className="p-4 font-medium text-center">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {leads.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-8 text-center text-slate-400">
                  No tienes leads todavía. ¡Agrega el primero!
                </td>
              </tr>
            ) : (
              leads.map((lead) => (

                <tr key={lead.id} className="hover:bg-slate-50 transition-colors cursor-pointer"
                onClick={() => navigate(`/leads/${lead.id}`)}>
                  <td className="p-4"> {lead.name}</td>
                  <td className="p-4 text-center">
                    <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold">
                      {lead.status}
                    </span>
                  </td>

                  <td className="p-4">
                    <div className="flex justify-center items-center gap-2">
                      

                    <Link 
                      to={`/leads/edit/${lead.id}`}
                      onClick={(e) => e.stopPropagation()} 
                      className="text-slate-400 hover:text-blue-600 transition-colors p-2 rounded-full hover:bg-blue-50"
                      title="Editar prospecto"
                    >
                      <Pencil size={18} />
                    </Link>
                      
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();   
                          handleDelete(lead.id); 
                        }}
                        className="text-slate-400 hover:text-red-600 transition-colors p-2 rounded-full hover:bg-red-50"
                        title="Eliminar prospecto"
                      >
                        <Trash2 size={18} />
                      </button>
                      
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}