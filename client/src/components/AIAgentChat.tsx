import { useState, useRef, useEffect } from 'react';
import { BrainCircuit, ChevronDown, SendHorizontal, X, User } from 'lucide-react';

// 1. Definimos la forma de un Mensaje para TypeScript
type Message = {
  id: number;
  text: string;
  sender: 'user' | 'ai';
};

export default function AIAgentChat() {
  const [isOpen, setIsOpen] = useState(false);
  
  // --- NUEVOS ESTADOS PARA LA LÓGICA DEL CHAT ---
  const [inputText, setInputText] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  
  // Empezamos con un mensaje de bienvenida por defecto
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: "Hola, Tech Lead. Veo que tienes prospectos activos. ¿En qué te ayudo hoy?", sender: 'ai' }
  ]);

  // Creamos la referencia invisible
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Función que desliza la pantalla hacia el ancla
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Dile a React que ejecute scrollToBottom() cada vez que 'messages' o 'isThinking' cambien
  useEffect(() => {
    scrollToBottom();
  }, [messages, isThinking]);

 
  const handleSendMessage = () => {
    if (!inputText.trim()) return;
    const newMessage: Message = {
        id: Date.now(), 
        text: inputText,
        sender: 'user'
    };

    setMessages([...messages, newMessage]);
    setInputText("");
    setIsThinking(true);

    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: Date.now(),
        text: "Entendido. Estoy analizando tu solicitud.",
        sender: 'ai'
      }]);
      
      setIsThinking(false);
    }, 1500);
  };

  return (
    <div className="fixed bottom-6 right-8 z-50 w-96 h-137.5 pointer-events-none">
      
      {/* --- EL ÁREA DE CHAT --- */}
      <div 
        className={`absolute bottom-0 right-0 bg-white w-full h-full rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden transition-all duration-300 ease-in-out origin-bottom-right
        ${isOpen ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto' : 'opacity-0 scale-50 translate-y-10 pointer-events-none'}`}
      >
        {/* Cabecera */}
        <div className="bg-blue-600 p-4 text-white flex justify-between items-center shadow-md">
          <div className="flex items-center gap-2">
            <BrainCircuit size={20} />
            <h3 className="font-bold text-lg">BorderAI</h3>
          </div>
          <button onClick={() => setIsOpen(false)} className="p-1.5 hover:bg-blue-700 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* --- HISTORIAL DE MENSAJES DINÁMICO --- */}
        <div className="flex-1 p-4 space-y-4 overflow-y-auto bg-slate-50">
          
          {/* Recorremos el arreglo de mensajes */}
          {messages.map((msg) => (
            <div key={msg.id} className={`flex items-start gap-2 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
              
              {/* Icono del remitente */}
              <div className={`p-2 rounded-full mt-1 ${msg.sender === 'user' ? 'bg-slate-200 text-slate-600' : 'bg-blue-100 text-blue-700'}`}>
                {msg.sender === 'user' ? <User size={16} /> : <BrainCircuit size={16} />}
              </div>
              
              {/* Burbuja del mensaje */}
              <div className={`p-3 rounded-xl shadow-sm border text-sm max-w-[80%] 
                ${msg.sender === 'user' 
                  ? 'bg-blue-600 text-white border-blue-700 rounded-tr-none' 
                  : 'bg-white border-slate-100 text-slate-700 rounded-tl-none'}`}
              >
                {msg.text}
              </div>
            </div>
          ))}

          {/* --- INDICADOR DE "PENSANDO" (Aparece si isThinking es true) --- */}
          {isThinking && (
             <div className="flex items-start gap-2 animate-pulse">
               <div className="p-2 bg-blue-100 text-blue-700 rounded-full mt-1">
                 <BrainCircuit size={16} />
               </div>
               <div className="bg-white p-3 rounded-xl rounded-tl-none shadow-sm border border-slate-100 text-sm text-slate-500 italic">
                 BorderAI está analizando...
               </div>
             </div>
          )}
          
          <div ref={messagesEndRef} />

        </div>

        

        {/* --- CAJA DE TEXTO Y BOTÓN --- */}
        <div className="p-3 bg-white border-t border-slate-100 flex items-center gap-2">
          
          <input 
            type="text" 
            placeholder="Pregúntale a BorderAI..." 
            className="flex-1 p-2.5 bg-slate-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
          />
    
          <button onClick={handleSendMessage} className="p-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50">
            <SendHorizontal size={18} />
          </button>
        </div>
      </div>

      {/* --- EL BOTÓN DISPARADOR --- */}
      <button 
        onClick={() => setIsOpen(true)}
        className={`absolute bottom-0 right-0 flex items-center gap-3 bg-blue-600 text-white px-6 py-4 rounded-full shadow-lg hover:bg-blue-700 transition-all duration-300 ease-in-out origin-center
        ${isOpen ? 'opacity-0 scale-50 pointer-events-none' : 'opacity-100 scale-100 pointer-events-auto hover:scale-105'}`}
      >
        <BrainCircuit size={24} />
        <span className="font-bold text-lg">Hablar con Agente</span>
        <ChevronDown size={20} className="text-blue-200" />
      </button>

    </div>
  );
}