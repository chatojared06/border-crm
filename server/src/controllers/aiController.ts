import { Request, Response } from 'express';
import { GoogleGenerativeAI} from '@google/generative-ai';


export const generarCorreoVentas = async (req: Request, res: Response) => {
  try {
    const { name, source, status } = req.body;

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);
    
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
      Eres un vendedor experto en tecnología y persuasión. 
      Redacta un correo electrónico de ventas corto, profesional y muy empático 
      para un cliente potencial llamado ${name}. 
      
      Contexto del cliente:
      - Nos conoció a través de: ${source}.
      - Actualmente está en la etapa de ventas: ${status}.
      
      El objetivo del correo es saludarlo, agradecer su interés y proponerle una llamada de 15 minutos para conocer sus necesidades.
      No escribas el "Asunto" del correo, solo redacta el cuerpo del mensaje.
      Firma el correo como "El equipo de BorderCRM".
    `;
    const result = await model.generateContent(prompt);
    const textoGenerado = result.response.text();

    res.json({ email: textoGenerado });

  } catch (error) {
    console.error("Error en la IA:", error);
    res.status(500).json({ error: "La Inteligencia Artificial no pudo generar el correo" });
  }
};

export const generarRespuestaChat = async (req: Request, res: Response): Promise<void> => {
  try {
    // 1. Recibimos el mensaje del usuario y la lista de leads desde el Frontend
    const { message, leads } = req.body;

    if (!message) {
      res.status(400).json({ error: "El mensaje es requerido" });
      return;
    }

    // 2. Inicializamos Gemini
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // 3. Construimos el "Súper Prompt" inyectando la base de datos (leads)
    const prompt = `
      Eres 'BorderAI', un asistente de ventas experto de Nivel Senior integrado en el CRM 'BorderCRM'.
      Tu objetivo es ayudar al usuario a analizar sus prospectos, dar consejos tácticos y ayudarle a cerrar más ventas.
      
      Reglas de tu comportamiento:
      - Sé profesional, directo, estratégico y empático.
      - Tus respuestas deben ser breves y fáciles de leer (usa viñetas si es necesario).
      - Si te preguntan sobre números, prospectos o métricas, analízalos basándote ÚNICAMENTE en la lista de prospectos que te proporciono a continuación.
      -Nunca menciones las bases de dato ni las claves unicas de los prospectos, solo analiza la información y da consejos prácticos pero, si di los nombres de los prospectos, menciona sus características.
      - Estructura tus respuestas usando viñetas o listas con saltos de línea para facilitar la lectura.
      
      --- CONTEXTO DE LA BASE DE DATOS DEL USUARIO ---
      Prospectos actuales en formato JSON: 
      ${JSON.stringify(leads || [])}
      -----------------------------------------------
      
      Pregunta/Mensaje del Vendedor: "${message}"
    `;

    // 4. Llamamos a Gemini
    const result = await model.generateContent(prompt);
    const textoGenerado = result.response.text();

    // 5. Devolvemos la respuesta
    res.json({ text: textoGenerado });

  } catch (error) {
    console.error("Error en el Chat de IA:", error);
    res.status(500).json({ error: "La Inteligencia Artificial no pudo procesar el mensaje del chat" });
  }
};

