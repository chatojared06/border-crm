import { useEffect, useState } from "react";
import { DollarSign, Users, Briefcase, Pencil } from "lucide-react";
import { Link } from "react-router-dom";
import { PieChart, Pie, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import api from "../lib/axios";

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
    api.get("/leads")
      .then((respuesta) => setLeads(respuesta.data))
      .catch((error) => console.error("Error al cargar leads:", error));
  }, []);

  // 1. Agrupar leads y asignarles su color directamente aquí
  const statusData = [
    { name: 'Nuevos', value: leads.filter(l => l.status === 'NUEVO').length, fill: '#3b82f6' },
    { name: 'Contactados', value: leads.filter(l => l.status === 'CONTACTADO').length, fill: '#8b5cf6' },
    { name: 'En Negociación', value: leads.filter(l => l.status === 'NEGOCIACION').length, fill: '#f59e0b' },
    { name: 'Cerrados', value: leads.filter(l => l.status === 'CERRADO').length, fill: '#10b981' },
  ].filter(item => item.value > 0); 

  // 2. Agrupar leads por los orígenes reales de tus tarjetas
  const sourceData = [
    { name: 'Web', cantidad: leads.filter(l => l.source === 'Web').length },
    { name: 'LinkedIn', cantidad: leads.filter(l => l.source === 'LinkedIn').length },
    { name: 'Referido', cantidad: leads.filter(l => l.source === 'Referido').length },
    { name: 'Otro', cantidad: leads.filter(l => l.source === 'Otro').length },
  ];


  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Resumen General</h1>
      
      {/* Tarjetas de Estadísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
            Ver todos &rarr;
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
                  <td colSpan={4} className="p-8 text-center font-medium text-slate-500">
                    Sin actividad reciente. Registra tu primer prospecto para darle vida a tu CRM. ⚡
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- SECCIÓN DE GRÁFICAS --- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        
        {/* Gráfica 1: Estados del Pipeline */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Estado del Pipeline</h3>
          <div className="h-64">
            {leads.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-8">
                <p className="font-medium text-slate-500">
                  Pipeline vacío. Ingresa tus primeros contactos para empezar a medir tu proceso de ventas. 🎯
                </p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  /> 
                  <RechartsTooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Gráfica 2: Origen de Leads */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Leads por Origen</h3>
          <div className="h-64"> 
             {leads.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-8">
                <p className="font-medium text-slate-500">
                  Sin estadísticas de canales. Agrega leads y su origen para descubrir qué red te funciona mejor. 🌐
                </p>
              </div>
            ) : (
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
              <BarChart data={sourceData}>
                <CartesianGrid 
                strokeDasharray="3 3" 
                vertical={false} 
                stroke="#e2e8f0"
                />
                <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#64748b', fontSize: 12 }} 
                minTickGap={15} 
                />
                <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{fill: '#64748b'}} 
                allowDecimals={false} 
                />
                <RechartsTooltip 
                cursor={{fill: '#f8fafc'}} 
                />
                <Bar 
                dataKey="cantidad" 
                fill="#3b82f6" 
                radius={[4, 4, 0, 0]} 
                barSize={40} 
                />
              </BarChart>
            </ResponsiveContainer>
              )}
          </div>
        </div>
      </div>
    </div>
  );
}