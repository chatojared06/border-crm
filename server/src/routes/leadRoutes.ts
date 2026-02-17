import { Router } from 'express';
import { createLead, deleteLead, getLeads } from '../controllers/lead.controller';

const router = Router();

// 1. Cuando alguien haga una petición GET a esta ruta, le damos todos los leads
router.get('/', getLeads);

// 2. Cuando alguien haga una petición POST a esta ruta, guardamos el lead nuevo
router.post('/', createLead);

// 3. Cuando alguien haga una petición DELETE con un ID, borramos ese lead
router.delete('/:id', deleteLead);

export default router;