import { useEffect, useState } from "react";
import { DollarSign, Users, Briefcase, Pencil } from "lucide-react";
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

export default function DashboardPage() {
  
  // Aquí guardaremos la lista de leads que nos dio el Backend
  const [leads, setLeads] = useState<Lead[]>([]);

  //Calcula los que están En Pipeline
  const leadsEnPipeline = leads.filter(lead => lead.status !== "CERRADO").length;

  //Calcula los que están Cerrados y las ventas del mes
  const leadsCerrados = leads.filter(lead => lead.status === "CERRADO").length;
  const ventasMes = leadsCerrados * 1500;

  // useEffect se ejecuta automáticamente cuando entras a la página
  useEffect(() => {
    fetch("https://border-crm.onrender.com/api/leads")
      .then((respuesta) => respuesta.json())
      .then((datos) => setLeads(datos))
      .catch((error) => console.error("Error al cargar leads:", error));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Resumen General</h1>
      
      {/* Tarjetas de Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Tarjeta 1 */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
              <Users size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Total Leads</p>
              <h3 className="text-2xl font-bold text-slate-800">{leads.length}</h3>
            </div>
          </div>
        </div>

        {/* Tarjeta 2 */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-100 text-purple-600 rounded-lg">
              <Briefcase size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">En Pipeline</p>
              <h3 className="text-2xl font-bold text-slate-800">{leadsEnPipeline}</h3>
            </div>
          </div>
        </div>

        {/* Tarjeta 3 */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 text-green-600 rounded-lg">
              <DollarSign size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Ventas Mes</p>
              <h3 className="text-2xl font-bold text-slate-800">${ventasMes}</h3>
            </div>
          </div>
        </div>
      </div>

      {/* --- SECCIÓN DE ACTIVIDAD RECIENTE --- */}
<div className="mt-8">
  <div className="flex justify-between items-center mb-4">
    <h2 className="text-xl font-bold text-slate-800">Actividad Reciente</h2>
    <Link to="/leads"
     className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors">
      Ver todos los leads &rarr;
    </Link>
  </div>
  
  <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
    <table className="w-full text-left border-collapse">
      <thead>
        <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-sm">
          <th className="p-4 font-medium">Nombre del Prospecto</th>
          <th className="p-4 font-medium hidden sm:table-cell">Origen</th>
          <th className="p-4 font-medium">Estado</th>
          <th className="p-4 font-medium text-right">Acción</th>
        </tr>
      </thead>
      <tbody>
       
        {leads.slice(0, 5).map((lead) => (
          <tr key={lead.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
            <td className="p-4 font-medium text-slate-800">{lead.name}</td>
            <td className="p-4 text-slate-600 hidden sm:table-cell">{lead.source}</td>
            <td className="p-4">
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-600 border border-blue-200">
                {lead.status} 
              </span>
            </td>
            <td className="p-4">
              <div className="flex justify-end">
                <Link 
                  to={`/leads/edit/${lead.id}`}
                  className="inline-flex items-center justify-center text-slate-400 hover:text-blue-600 transition-colors p-2 rounded-full hover:bg-blue-50"
                  title="Editar prospecto"
                >
                  <Pencil size={18} />
                </Link>
              </div>
            </td>
          </tr>
        ))}
        
        {leads.length === 0 && (
          <tr>
            <td colSpan={4} className="p-8 text-center text-slate-500">
              Aún no hay leads registrados. ¡Empieza a vender! 🚀
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
</div>
    </div>
  );
}