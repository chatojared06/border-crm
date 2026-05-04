import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// 1. Extendemos la interfaz de Express para evitar el error de TypeScript
export interface AuthRequest extends Request {
    userId?: number; 
    email?: string;
}

export const verifyToken = (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        // 2. Extraer el token del Header 'Authorization' (Formato: "Bearer <token>")
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Acceso denegado: Token ausente o formato incorrecto' });
        }

        const token = authHeader.split(' ')[1];

        // 3. Desencriptar y validar el token
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: number, email: string };

        // 4. Inyectar los datos limpios en la petición
        req.userId = decoded.userId;
        req.email = decoded.email;

        // 5. Luz verde: Pasa al siguiente middleware o controlador
        next();
    } catch (error) {
        return res.status(403).json({ error: 'Acceso denegado: Token inválido o expirado' });
    }
};