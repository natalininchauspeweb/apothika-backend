import express from 'express';
import { 
  sumarPuntos, 
  canjearProducto, 
  obtenerTransacciones 
} from '../controllers/TransactionController.js';
import { verificarToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Consultar historial de transacciones (Operación READ de la 3ra entidad)
router.get('/', verificarToken, obtenerTransacciones);

// Rutas transaccionales de suma y canje (Operaciones CREATE de la 3ra entidad)
router.post('/sumar', verificarToken, sumarPuntos);
router.post('/canjear', verificarToken, canjearProducto);

export default router;