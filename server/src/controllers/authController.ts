import { z } from 'zod';
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

// Función para REGISTRAR un nuevo usuario
export const register = async (req: Request, res: Response) => {
    try {
        const { name, email, password } = req.body;

        // 1. Validar que vengan los datos
        if (!name || !email || !password) {
            return res.status(400).json({ error: 'Faltan datos: nombre, email o password son obligatorios' });
        }

        // 2. Verificar si el usuario ya existe (para no duplicar emails)
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: 'El email ya está registrado' });
        }

        // 3. Encriptar la contraseña (Nunca guardar texto plano)
        const hashedPassword = await bcrypt.hash(password, 10);

        // 4. Crear el usuario en Neon
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword
            }
        });

        // 5. Generar el Token (Gafete de acceso)
        const token = jwt.sign(
            { userId: user.id }, 
            process.env.JWT_SECRET || 'secreto_temporal', 
            { expiresIn: '1h' }
        );

        // 6. Responder con éxito
        res.status(201).json({ message: 'Usuario registrado exitosamente', token });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al registrar usuario' });
    }
};

// Función para INICIAR SESIÓN (Login)
export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        // 1. Buscar al usuario por email
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(400).json({ error: 'Credenciales inválidas' });
        }

        // 2. Verificar si la contraseña coincide (compara el texto plano con el hash guardado)
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(400).json({ error: 'Credenciales inválidas' });
        }

        // 3. Generar un nuevo Token
        
        // El código corregido:
        const token = jwt.sign(
        { 
            userId: user.id, 
            email: user.email // ✨ ¡Agregamos esta línea! ✨
        }, 
        process.env.JWT_SECRET as string,
        { expiresIn: '1d' }
);

        // 4. Responder con el token
        res.json({ message: 'Login exitoso', token });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al iniciar sesión' });
    }
};


// Función para cambiar la contraseña 
export const changePassword = async (req: Request, res: Response) => {
    try {
        // 1. Extraer los datos
        const { userId, currentPassword, newPassword } = req.body;

        // 2. Buscar al usuario
        const user = await prisma.user.findUnique({ where: { id: userId } });

        // 3. Validar existencia
        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        // 4. Comprobar contraseña actual
        const validPassword = await bcrypt.compare(currentPassword, user.password);

        // 5. Rechazo (si aplica)
        if (!validPassword) {
            return res.status(400).json({ error: 'La contraseña actual es incorrecta' });
        }

        // 6. Encriptar la nueva
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // 7. Actualizar en Neon
        await prisma.user.update({
            where: { id: userId },
            data: { password: hashedPassword }
        });

        // 8. Responder
        res.json({ message: 'Contraseña actualizada exitosamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al cambiar la contraseña' });
    }
};

// Función para eliminar la cuenta (Delete Account)
const deleteAccountSchema = z.object({
  password: z.string().min(1, 'La contraseña es requerida para confirmar.'),
});

export const deleteAccount = async (req: Request, res: Response): Promise<void> => {
  try {
    
    const userId = (req as any).userId; 
    if (!userId) {
      res.status(401).json({ error: 'No autorizado.' });
      return;
    }

    const { password } = deleteAccountSchema.parse(req.body);

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      res.status(404).json({ error: 'Usuario no encontrado.' });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(400).json({ error: 'Contraseña incorrecta. No se pudo eliminar la cuenta.' });
      return;
    }

    await prisma.user.delete({
      where: { id: userId },
    });

    res.status(200).json({ message: 'Cuenta eliminada exitosamente.' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.issues[0].message });
      return;
    }
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
};