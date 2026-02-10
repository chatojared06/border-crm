// server/src/controllers/authController.ts
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
        const token = jwt.sign(
            { userId: user.id },
            process.env.JWT_SECRET || 'secreto_temporal',
            { expiresIn: '1h' }
        );

        // 4. Responder con el token
        res.json({ message: 'Login exitoso', token });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al iniciar sesión' });
    }
};