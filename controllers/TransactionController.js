import User from '../models/UserModel.js';
import Product from '../models/ProductModel.js';
import Transaction from '../models/TransactionModel.js';

export const sumarPuntos = async (req, res) => {
  try {
    if (req.usuario.rol !== 'farmacia') {
      return res.status(403).json({ mensaje: 'Acceso denegado: Solo el mostrador puede cargar puntos.' });
    }

    const { emailPaciente, montoGastado } = req.body;

    const paciente = await User.findOne({ email: emailPaciente, rol: 'paciente' });
    if (!paciente) {
      return res.status(404).json({ mensaje: 'No se encontró un paciente registrado con ese email.' });
    }

    const puntosGanados = Math.floor(montoGastado / 100);
    
    paciente.puntosAcumulados += puntosGanados;
    await paciente.save();

    // Guardamos el registro real en la colección de Transacciones (Entidad 3)
    const nuevaTransaccion = new Transaction({
      paciente: paciente._id,
      tipo: 'suma',
      puntos: puntosGanados,
      detalle: `Carga de puntos por compra de $${montoGastado}`
    });
    await nuevaTransaccion.save();

    res.status(200).json({
      mensaje: `Compra registrada exitosamente. Se sumaron ${puntosGanados} puntos.`,
      ticket: {
        idTransaccion: nuevaTransaccion._id,
        paciente: paciente.nombre,
        saldoActualizado: paciente.puntosAcumulados
      }
    });

  } catch (error) {
    console.error('Error al sumar puntos:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
};

export const canjearProducto = async (req, res) => {
  try {
    const { emailPaciente, idProducto } = req.body;

    const paciente = await User.findOne({ email: emailPaciente, rol: 'paciente' });
    if (!paciente) {
      return res.status(404).json({ mensaje: 'Paciente no encontrado.' });
    }

    if (req.usuario.rol === 'paciente' && paciente._id.toString() !== req.usuario.id) {
      return res.status(403).json({ mensaje: 'No tenés permiso para canjear puntos de otro usuario.' });
    }

    const filtroProducto = req.usuario.rol === 'farmacia' 
      ? { _id: idProducto, farmacia: req.usuario.id } 
      : { _id: idProducto };

    const producto = await Product.findOne(filtroProducto);
    if (!producto) {
      return res.status(404).json({ mensaje: 'Producto no encontrado en el catálogo.' });
    }

    if (paciente.puntosAcumulados < producto.puntosOtorga) {
      return res.status(400).json({
        mensaje: 'Saldo insuficiente para este canje.',
        puntosFaltantes: producto.puntosOtorga - paciente.puntosAcumulados
      });
    }

    paciente.puntosAcumulados -= producto.puntosOtorga;
    await paciente.save();

    // Guardamos el canje en la colección de Transacciones (Entidad 3)
    const nuevaTransaccion = new Transaction({
      paciente: paciente._id,
      producto: producto._id,
      tipo: 'canje',
      puntos: producto.puntosOtorga,
      detalle: `Canje de producto: ${producto.nombre}`
    });
    await nuevaTransaccion.save();

    res.status(200).json({
      mensaje: '¡Canje aprobado exitosamente!',
      ticket: {
        idTransaccion: nuevaTransaccion._id,
        paciente: paciente.nombre,
        productoEntregado: producto.nombre,
        puntosDescontados: producto.puntosOtorga,
        saldoRestante: paciente.puntosAcumulados
      }
    });

  } catch (error) {
    console.error('Error al procesar el canje:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
};

// Función para consultar el historial de transacciones (Operación READ de la 3ra entidad)
export const obtenerTransacciones = async (req, res) => {
  try {
    const filtro = req.usuario.rol === 'paciente' ? { paciente: req.usuario.id } : {};
    const historial = await Transaction.find(filtro)
      .populate('paciente', 'nombre email')
      .populate('producto', 'nombre puntosOtorga')
      .sort({ fecha: -1 });

    res.status(200).json(historial);
  } catch (error) {
    console.error('Error al obtener transacciones:', error);
    res.status(500).json({ mensaje: 'Error al obtener el historial de transacciones' });
  }
};