import { Router } from 'express';
// 1. Importamos el nuevo controlador changePassword
import { register, login, changePassword } from '../controllers/authController';
// 2. Importamos a nuestro "cadenero"
import { verifyToken } from '../middlewares/authMiddleware';

const router = Router();

// Rutas Públicas
router.post('/register', register);
router.post('/login', login);

// 3. Ruta Privada: Primero pasa por verifyToken, si todo sale bien, pasa a changePassword
router.put('/change-password', verifyToken, changePassword);

export default router;