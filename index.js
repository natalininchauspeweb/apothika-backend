import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/AuthRouter.js';
import productRoutes from './routes/ProductRouter.js';
import transactionRoutes from './routes/TransactionRouter.js';

dotenv.config();
const app = express();
connectDB();

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Rutas de las 3 entidades principales de Apothika
app.use('/api/auth', authRoutes);
app.use('/api/productos', productRoutes);
app.use('/api/transacciones', transactionRoutes);

app.get('/', (req, res) => {
  res.send('¡El backend de Apothika está vivo y funcionando! 🚀');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor de Apothika corriendo en el puerto ${PORT}`);
});