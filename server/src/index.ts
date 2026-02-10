// server/src/index.ts
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes'; 

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json()); 

// Rutas
app.use('/api/auth', authRoutes); 

// Ruta de prueba base
app.get('/', (req, res) => {
  res.send('API de BorderCRM funcionando 🚀');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});