import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import authRoutes from './routes/authRoutes.js';

dotenv.config();

const prisma = new PrismaClient();

const app = express();
const PORT = process.env.PORT || 3333;

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({ message: "Backend is running!" });
});

app.use('/api', authRoutes);

app.listen(PORT, async () => {
  console.log(`\n🚀 Server running on http://localhost:${PORT}`);
  
  try {
    await prisma.$connect();
    console.log('✅ Database connected successfully!');
    console.log('📊 Database URL:', process.env.DATABASE_URL.split('@')[1].split('/')[0]);
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
  }
});
