import mongoose from "mongoose";

// Definición del esquema para los usuarios de Apothika
const userSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre es obligatorio'],
    minlength: [3, 'El nombre debe tener al menos 3 caracteres']
  },
  email: {
    type: String,
    required: [true, 'El correo electrónico es obligatorio'],
    unique: true, // No pueden existir dos usuarios con el mismo email
    match: [/^\S+@\S+\.\S+$/, 'El correo electrónico no es válido']
  },
  password: {
    type: String,
    required: [true, 'La contraseña es obligatoria']
  },
  rol: {
    type: String,
    enum: ['paciente', 'farmacia'], // Solo aceptamos estos dos roles
    default: 'paciente'
  },
  // La billetera de puntos arranca siempre en 0
  puntosAcumulados: { 
    type: Number, 
    default: 0 
  }
}, { timestamps: true }); // timestamps crea automáticamente createdAt y updatedAt

// Creación del modelo basado en el esquema
const User = mongoose.model('User', userSchema);

export default User;