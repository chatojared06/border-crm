import { Router } from 'express';
import { createLead, deleteLead, getLeads, updateLead } from '../controllers/lead.controller';
import { generarCorreoVentas } from '../controllers/aiController';

const router = Router();

// 1. Cuando alguien haga una petición GET a esta ruta, le damos todos los leads
router.get('/', getLeads);

// 2. Cuando alguien haga una petición POST a esta ruta, guardamos el lead nuevo
router.post('/', createLead);

// 3. Cuando alguien haga una petición DELETE con un ID, borramos ese lead
router.delete('/:id', deleteLead);

// 4. Cuando alguien haga una petición PUT con un ID, actualizamos ese lead
router.put('/:id', updateLead);

// 5. Nueva ruta para generar el correo de ventas con IA
router.post('/generar-correo', generarCorreoVentas);

export default router;