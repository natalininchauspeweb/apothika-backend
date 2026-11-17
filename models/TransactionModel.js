import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  paciente: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'El paciente es obligatorio']
  },
  producto: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    default: null // Es null cuando suma puntos por compra, y lleva el ID cuando canjea
  },
  tipo: {
    type: String,
    enum: ['suma', 'canje'],
    required: [true, 'El tipo de transacción es obligatorio']
  },
  puntos: {
    type: Number,
    required: [true, 'La cantidad de puntos es obligatoria'],
    min: [1, 'Los puntos deben ser mayores a 0']
  },
  detalle: {
    type: String,
    required: true
  },
  fecha: {
    type: Date,
    default: Date.now
  }
});

const Transaction = mongoose.model('Transaction', transactionSchema);

export default Transaction;