import { useState, useEffect } from "react";
import api from "../lib/axios";
import { toast } from "sonner";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import type { DropResult } from "@hello-pangea/dnd";
import { useNavigate } from "react-router-dom";

interface Lead {
  id: number;
  name: string;
  email: string;
  phone: string;
  source: string;
  status: string;
}

const COLUMNAS = ["NUEVO", "CONTACTADO", "NEGOCIACION", "CERRADO"];

export default function PipelinePage() {
  const navigate = useNavigate();
  const [leads, setLeads] = useState<Lead[]>([]);

  useEffect(() => {
    api.get("api/leads")
      .then((respuesta) => setLeads(respuesta.data))
      .catch((error) => console.error("Error al cargar leads:", error));
  }, []);

  // Esta función se dispara mágicamente cuando sueltas una tarjeta
  const onDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;

    // Si lo sueltas fuera del tablero, no hace nada
    if (!destination) return;

    // Si lo sueltas exactamente donde mismo, no hace nada
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    const leadId = Number(draggableId);
    const nuevoEstado = destination.droppableId;

    // 1. Actualización Visual Optimista (se mueve al instante en pantalla)
    const leadsAnteriores = [...leads];
    setLeads(leads.map(lead => 
      lead.id === leadId ? { ...lead, status: nuevoEstado } : lead
    ));

    try {
      // 2. Guardamos el cambio en la Base de Datos
      await api.put(`/leads/${leadId}`, { status: nuevoEstado });
      toast.success("Estado actualizado");
    } catch (error) {
      console.error("Error al actualizar estado:", error);
      toast.error("Error al mover el prospecto");
      // Si el servidor falla, la tarjeta regresa a donde estaba visualmente
      setLeads(leadsAnteriores);
    }
  };

  return (
    <div className="h-full flex flex-col">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Pipeline de Ventas</h1>
      
      {/* Capa 1: El Contexto General */}
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6
       items-start">
          
          {COLUMNAS.map((columna) => {
            const leadsEnColumna = leads.filter(lead => lead.status === columna);

            return (
              // Capa 2: La Zona donde puedes soltar tarjetas (Columna)
              <Droppable key={columna} droppableId={columna}>
                {(provided, snapshot) => (
                  <div 
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`min-w-0 w-full rounded-xl p-4 border flex flex-col transition-colors ${
                      snapshot.isDraggingOver ? "bg-blue-50 border-blue-200" : "bg-slate-50 border-slate-200"
                    }`}
                    style={{ minHeight: "500px" }} // Importante para poder soltar en columnas vacías
                  >
                    
                    {/* Cabecera de la columna */}
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-semibold text-slate-700">{columna}</h3>
                      <span className="bg-slate-200 text-slate-600 text-xs font-bold px-2 py-1 rounded-full">
                        {leadsEnColumna.length}
                      </span>
                    </div>

                    {/* Lista de Tarjetas (Leads) */}
                    <div className="flex-1 flex flex-col gap-3">
                      {leadsEnColumna.map((lead, index) => (
                        
                        // Capa 3: La Tarjeta que se puede arrastrar
                        <Draggable key={lead.id} draggableId={lead.id.toString()} index={index}>
                          {(provided, snapshot) => (
                            <div
                            onClick={() => navigate(`/leads/${lead.id}`)}
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`bg-white p-4 rounded-lg border shadow-sm transition-shadow ${
                                snapshot.isDragging ? "shadow-lg border-blue-400 opacity-90" : "border-slate-200 hover:border-blue-300"
                              }`}
                            >
                              <p className="font-medium text-slate-800">{lead.name}</p>
                              <p className="text-xs text-slate-500 mt-1">{lead.source}</p>
                            </div>
                          )}
                        </Draggable>

                      ))}
                      {/* Espacio reservado por la librería */}
                      {provided.placeholder}

                      {/*  CUADRO DE ARRASTRE  */}
                      <div className="mt-2 border-2 border-dashed border-slate-300 rounded-lg p-4 flex items-center justify-center bg-transparent">
                        <p className="text-sm text-slate-400 text-center italic">
                          Arrastre un lead aquí para cambiar de estado.
                        </p>
                      </div>
                    </div>

                  </div>
                )}
              </Droppable>
            );
          })}

        </div>
      </DragDropContext>
    </div>
  );
}