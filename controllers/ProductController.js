import Product from '../models/ProductModel.js';

// Función para que la farmacia agregue un nuevo producto
export const crearProducto = async (req, res) => {
  try {
    const { nombre, descripcion, puntosOtorga, imagenUrl } = req.body;

    // Creamos el producto usando los datos del body y el ID del usuario logueado
    const nuevoProducto = new Product({
      nombre,
      descripcion,
      puntosOtorga,
      imagenUrl,
      // req.usuario.id nos lo dejó servido el middleware "verificarToken"
      farmacia: req.usuario.id 
    });

    await nuevoProducto.save();
    
    res.status(201).json({ 
      mensaje: 'Producto creado con éxito en tu catálogo', 
      producto: nuevoProducto 
    });

  } catch (error) {
    console.error('Error al crear producto:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
};

// Función para obtener el catálogo (filtra por dueño si es farmacia, o muestra todo si es paciente)
export const obtenerMisProductos = async (req, res) => {
  try {
    const filtro = req.usuario.rol === 'farmacia' ? { farmacia: req.usuario.id } : {};
    const productos = await Product.find(filtro);
    
    res.status(200).json(productos);
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
};

// Función para EDITAR un producto existente
export const actualizarProducto = async (req, res) => {
  try {
    const { id } = req.params; 
    const datosNuevos = req.body;

    // Buscamos el producto por su ID y nos aseguramos de que pertenezca a esta farmacia
    const producto = await Product.findOne({ _id: id, farmacia: req.usuario.id });

    if (!producto) {
      return res.status(404).json({ mensaje: 'Producto no encontrado o no tenés permiso para editarlo' });
    }

    // Actualizamos los datos usando el método de Mongoose "findByIdAndUpdate"
    const productoActualizado = await Product.findByIdAndUpdate(id, datosNuevos, { new: true });

    res.status(200).json({
      mensaje: 'Producto actualizado correctamente',
      producto: productoActualizado
    });

  } catch (error) {
    console.error('Error al actualizar producto:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
};

// Función para ELIMINAR un producto
export const eliminarProducto = async (req, res) => {
  try {
    const { id } = req.params;

    // Buscamos y eliminamos de un solo paso, filtrando siempre por el dueño (farmacia)
    const productoEliminado = await Product.findOneAndDelete({ _id: id, farmacia: req.usuario.id });

    if (!productoEliminado) {
      return res.status(404).json({ mensaje: 'Producto no encontrado o no tenés permiso para eliminarlo' });
    }

    res.status(200).json({ mensaje: 'Producto eliminado del catálogo con éxito' });

  } catch (error) {
    console.error('Error al eliminar producto:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
};