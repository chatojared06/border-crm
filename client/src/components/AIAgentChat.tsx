import { useState, useRef, useEffect } from 'react';
import { BrainCircuit, SendHorizontal, X, User } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import api from '../lib/axios';

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

 
  const handleSendMessage = async() => {
   try {
     if (!inputText.trim()) return;
     const newMessage: Message = {
         id: Date.now(), 
         text: inputText,
         sender: 'user'
     };

      setMessages(prev => [...prev, newMessage]);
      setInputText('');
      setIsThinking(true);

      // Descargamos los leads frescos en este preciso momento 
      const leadsResponse = await api.get('/api/leads'); // Llamamos a tu ruta GET de leads
      const leadsActualizados = leadsResponse.data;

      // Le mandamos el mensaje a la IA junto con la base de datos fresca
      const respuesta = await api.post('/api/leads/chat', {
        message: inputText,
        leads: leadsActualizados // <--- ¡Le inyectamos los datos reales!
      });

      const aiMessage: Message = {
        id: Date.now() + 1,
        text: respuesta.data.text, 
        sender: 'ai'
      };

  
      setMessages(prev => [...prev, aiMessage]);
      setIsThinking(false);
   
   } catch (error) {
      console.error("Error al enviar el mensaje:", error);
      setIsThinking(false);
   }

  };

  return (
    <>
      {/* --- EL ÁREA DE CHAT --- */}
      <div 
        className={`fixed z-50 bg-white flex flex-col shadow-2xl transition-all duration-300 ease-in-out overflow-hidden
        /* MÓVIL: Pantalla completa (Cubre toda la pantalla sin bordes) */
        inset-0 w-full h-[100dvh] rounded-none
        /* TABLET / PC: Flotante abajo a la derecha (Cambiamos md: por sm:) */
        sm:inset-auto sm:bottom-6 sm:right-8 sm:w-96 sm:h-125 sm:max-h-[80vh] sm:rounded-2xl sm:border sm:border-slate-200
        ${isOpen ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-95 pointer-events-none sm:translate-y-10 sm:scale-50'}`}
        style={{ transformOrigin: 'bottom right' }}
      >
        {/* Cabecera */}
        <div className="bg-blue-600 p-4 text-white flex justify-between items-center shadow-md shrink-0">
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
          
          {messages.map((msg) => (
            <div key={msg.id} className={`flex items-start gap-2 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`p-2 rounded-full mt-1 shrink-0 ${msg.sender === 'user' ? 'bg-slate-200 text-slate-600' : 'bg-blue-100 text-blue-700'}`}>
                {msg.sender === 'user' ? <User size={16} /> : <BrainCircuit size={16} />}
              </div>
              <div className={`p-3 rounded-xl shadow-sm border text-sm max-w-[80%] break-words
                ${msg.sender === 'user' 
                  ? 'bg-blue-600 font-medium text-white border-blue-700 rounded-tr-none' 
                  : 'bg-white border-slate-100 font-medium text-slate-800 rounded-tl-none'}`}
              >
                {msg.sender === 'ai' ? <ReactMarkdown>{msg.text}</ReactMarkdown> : msg.text}
              </div>
            </div>
          ))}

          {isThinking && (
             <div className="flex items-start gap-2 animate-pulse">
               <div className="p-2 bg-blue-100 text-blue-700 rounded-full mt-1 shrink-0">
                 <BrainCircuit size={16} />
               </div>
               <div className="bg-white p-3 rounded-xl rounded-tl-none shadow-sm border border-slate-100 text-sm font-medium text-slate-500 italic">
                 BorderAI está analizando...
               </div>
             </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* --- CAJA DE TEXTO Y BOTÓN --- */}
        <div className="p-3 pb-6 sm:pb-3 bg-white border-t border-slate-100 flex items-center gap-2 shrink-0">
          <input 
            type="text" 
            placeholder="Pregúntale a BorderAI..." 
            className="flex-1 p-2.5 bg-slate-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 font-medium text-slate-800"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
          />
          <button onClick={handleSendMessage} className="p-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50 shrink-0">
            <SendHorizontal size={18} />
          </button>
        </div>
      </div>

      {/* --- EL BOTÓN DISPARADOR --- */}
      <button 
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 sm:right-8 z-40 flex items-center gap-3 bg-blue-600 text-white p-4 sm:px-5 sm:py-4 rounded-full shadow-lg hover:bg-blue-700 transition-all duration-300 ease-in-out
        ${isOpen ? 'opacity-0 scale-50 pointer-events-none' : 'opacity-100 scale-100 pointer-events-auto hover:scale-105'}`}
      >
        <BrainCircuit size={24} />
        <span className="font-bold text-lg hidden sm:inline">Hablar con Agente</span>
      </button>
    </>
  );
}