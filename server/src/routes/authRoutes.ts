// server/src/routes/authRoutes.ts
import { Router } from 'express';
import { register, login } from '../controllers/authController';

const router = Router();

// Definir la ruta POST para registrarse
// La dirección final será: https://border-crm.onrender.com/api/auth/register
router.post('/register', register);
router.post('/login', login);

export default router;