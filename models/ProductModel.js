import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    trim: true // Borra los espacios en blanco accidentales al principio o al final
  },
  descripcion: {
    type: String,
    required: true
  },
  puntosOtorga: {
    type: Number,
    required: true, // ¡Clave para la fidelización! Cuántos puntos gana el paciente al comprarlo
    default: 10
  },
  imagenUrl: {
    type: String, // Acá luego guardaremos el link a la fotito del producto
    default: ""
  },
  farmacia: {
    // Vinculamos este producto con el ID de la farmacia que lo creó.
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true // Crea automáticamente la fecha de creación y de última modificación
});

const Product = mongoose.model('Product', productSchema);

export default Product;