import { Router } from 'express';
import { buscarViagens } from '../controllers/buscarViagens';
import { calcularRota } from '../controllers/calcularRota';
import { registrarViagem } from '../controllers/registrarViagem';
import { cadastrarUsuario } from '../controllers/newUsers';
import { listarUsuarios } from '../controllers/newUsers';
import { getGoogleApiKey } from '../controllers/acessMap';

const router: Router = Router();

// Definindo as rotas
router.post('/api/calcular-rota', calcularRota);
router.post('/api/viagens', registrarViagem);
router.get('/api/viagens', buscarViagens);
router.post('/api/newUser', cadastrarUsuario);
router.get('/api/listaUser', listarUsuarios);
router.get('/api/acessMap', getGoogleApiKey);

export default router;
