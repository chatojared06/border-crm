import { useEffect, useState } from "react";
import { DollarSign, Users, Briefcase } from "lucide-react";

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
    fetch("http://localhost:5000/api/leads")
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
    </div>
  );
}