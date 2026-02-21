import { Request, Response } from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';

export const generarCorreoVentas = async (req: Request, res: Response) => {
  try {
    // Recibimos los datos del cliente desde el Frontend
    const { name, source, status } = req.body;

    // 1. Despertar a Gemini con tu llave secreta
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);
    // Usamos el modelo flash porque es rapidísimo para textos cortos
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // 2. El "Prompt": Le damos instrucciones estrictas a la IA de cómo actuar
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

    // 3. Mandamos el mensaje y esperamos la respuesta de la IA
    const result = await model.generateContent(prompt);
    const textoGenerado = result.response.text();

    // 4. Se lo devolvemos al Frontend
    res.json({ email: textoGenerado });

  } catch (error) {
    console.error("Error en la IA:", error);
    res.status(500).json({ error: "La Inteligencia Artificial no pudo generar el correo" });
  }
};