import { useState, useEffect } from "react";
import api from "../lib/axios";

// Definimos la interfaz
interface Lead {
  id: number;
  name: string;
  email: string;
  phone: string;
  source: string;
  status: string;
}

// Estos son los estados exactos que definiste en tu base de datos
const COLUMNAS = ["NUEVO", "CONTACTADO", "NEGOCIACION", "CERRADO"];

export default function PipelinePage() {
  const [leads, setLeads] = useState<Lead[]>([]);

  useEffect(() => {
    // Usamos nuestra instancia de axios para traer los datos
    api.get("/leads")
      .then((respuesta) => {
        // Axios guarda la respuesta del servidor dentro de .data
        setLeads(respuesta.data);
      })
      .catch((error) => console.error("Error al cargar leads:", error));
  }, []);

  return (
    <div className="h-full flex flex-col">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Pipeline de Ventas</h1>
      
      {/* Contenedor del Tablero Kanban */}
      <div className="flex gap-6 overflow-x-auto pb-4 flex-1">
        
        {COLUMNAS.map((columna) => {
          // 1. Filtramos UNA sola vez y guardamos el resultado
          const leadsEnColumna = leads.filter(lead => lead.status === columna);

          return (
            <div key={columna} className="bg-slate-50 min-w-75 rounded-xl p-4 border border-slate-200 flex flex-col">
            
            {/* Cabecera de la columna */}
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-slate-700">{columna}</h3>
              <span className="bg-slate-200 text-slate-600 text-xs font-bold px-2 py-1 rounded-full">
                {/* Contar cuántos leads hay en esta columna */}
                {leadsEnColumna.length}
              </span>
            </div>
 
            {/* Lista de Tarjetas (Leads) */}
            <div className="flex-1 flex flex-col gap-3">
              {/* Mostrar las tarjetas correspondientes a esta columna */}
              {leadsEnColumna.map(lead => (
                <div key={lead.id} className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
                    <p className="font-medium text-slate-800">{lead.name}</p>
                    <p className="text-xs text-slate-500">{lead.source}</p>
                </div>
                ))}
              
              <div className="text-sm text-slate-400 text-center italic mt-4">
                Arrastra prospectos aquí
              </div>
            </div>

          </div>
          );
        })}

      </div>
    </div>
  );
}