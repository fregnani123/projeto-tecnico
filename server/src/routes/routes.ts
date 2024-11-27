// routes.js
import { Router } from 'express';
import { buscarViagens } from '../controllers/buscarViagens';
import { calcularRota } from '../controllers/calcularRota';
import { registrarViagem } from '../controllers/registrarViagem';

const router: Router = Router();

// Definindo as rotas
router.post('/api/calcular-rota', calcularRota);
router.post('/api/viagens', registrarViagem);
router.get('/api/viagens', buscarViagens);

export default router;

