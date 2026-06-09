import { Router } from 'express';
import { register, login, changePassword, deleteAccount } from '../controllers/authController';
import { verifyToken } from '../middlewares/authMiddleware';


const router = Router();

// Rutas Públicas
router.post('/register', register);
router.post('/login', login);

// Ruta para cambiar contraseña, protegida por el middleware de autenticación
router.put('/change-password', verifyToken, changePassword);

// Ruta para eliminar cuenta, protegida por el middleware de autenticación
router.delete('/delete-account', verifyToken, deleteAccount);

export default router;