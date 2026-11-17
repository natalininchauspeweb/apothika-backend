import express from 'express';
import { 
  crearProducto, 
  obtenerMisProductos, 
  actualizarProducto, 
  eliminarProducto 
} from '../controllers/ProductController.js';
import { verificarToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', verificarToken, crearProducto);
router.get('/', verificarToken, obtenerMisProductos);

// Agregamos /:id en la URL para saber exactamente qué producto quieren editar o borrar. El middleware "verificarToken" asegura que solo la farmacia dueña del producto pueda hacerlo.
router.put('/:id', verificarToken, actualizarProducto);   // PUT para actualizar
router.delete('/:id', verificarToken, eliminarProducto); // DELETE para borrar

export default router;