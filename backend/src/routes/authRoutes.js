import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();
const prisma = new PrismaClient();

router.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);
    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword }
    });

    const token = jwt.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '24h' });
    const refreshToken = jwt.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '30d' });

    res.status(201).json({
      message: 'User created successfully',
      token,
      refreshToken,
      user: { id: user.id, name: user.name, email: user.email }
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '24h' });
    const refreshToken = jwt.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '30d' });

    res.json({
      message: 'Login successful',
      token,
      refreshToken,
      user: { id: user.id, name: user.name, email: user.email }
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: { id: true, name: true, email: true }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/transactions', authenticateToken, async (req, res) => {
  try {
    const { page = '1', limit = '10', type, sortBy = 'date', order = 'desc' } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const where = { userId: req.user.userId };
    if (type && type !== 'all') where.type = type;
    
    const orderByMap = {
      date: { date: order },
      amount: { amount: order },
      category: { category: order }
    };
    
    const [transactions, total] = await Promise.all([
      prisma.transaction.findMany({
        where,
        orderBy: orderByMap[sortBy] || { date: 'desc' },
        skip,
        take: parseInt(limit)
      }),
      prisma.transaction.count({ where })
    ]);
    
    res.json({
      transactions: transactions.map(t => ({ ...t, amount: parseFloat(t.amount) })),
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Transactions fetch error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/transactions', authenticateToken, async (req, res) => {
  try {
    const { amount, type, category, note, date } = req.body;
    const transaction = await prisma.transaction.create({
      data: { amount: amount.toString(), type, category, note: note || '', date: new Date(date), userId: req.user.userId }
    });
    res.status(201).json({ ...transaction, amount: parseFloat(transaction.amount) });
  } catch (error) {
    console.error('Transaction creation error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/transactions/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { amount, type, category, note, date } = req.body;
    const transaction = await prisma.transaction.update({
      where: { id: parseInt(id), userId: req.user.userId },
      data: { amount: amount.toString(), type, category, note: note || '', date: new Date(date) }
    });
    res.json({ ...transaction, amount: parseFloat(transaction.amount) });
  } catch (error) {
    console.error('Transaction update error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/transactions/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.transaction.delete({ where: { id: parseInt(id), userId: req.user.userId } });
    res.json({ message: 'Transaction deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/goals', authenticateToken, async (req, res) => {
  try {
    const { page = '1', limit = '10', status, sortBy = 'createdAt', order = 'desc' } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const where = { userId: req.user.userId };
    
    const orderByMap = {
      createdAt: { createdAt: order },
      deadline: { deadline: order },
      targetAmount: { targetAmount: order },
      title: { title: order }
    };
    
    const [goals, total] = await Promise.all([
      prisma.goal.findMany({
        where,
        orderBy: orderByMap[sortBy] || { createdAt: 'desc' },
        skip,
        take: parseInt(limit)
      }),
      prisma.goal.count({ where })
    ]);
    
    let formattedGoals = goals.map(g => ({
      ...g,
      targetAmount: parseFloat(g.targetAmount),
      currentAmount: parseFloat(g.currentAmount),
      progress: (parseFloat(g.currentAmount) / parseFloat(g.targetAmount)) * 100,
      status: parseFloat(g.currentAmount) >= parseFloat(g.targetAmount) ? 'completed' : new Date(g.deadline) < new Date() ? 'overdue' : 'active'
    }));
    
    if (status) {
      formattedGoals = formattedGoals.filter(g => g.status === status);
    }
    
    res.json({
      goals: formattedGoals,
      pagination: {
        total: status ? formattedGoals.length : total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil((status ? formattedGoals.length : total) / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Goals fetch error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/goals', authenticateToken, async (req, res) => {
  try {
    const { title, targetAmount, deadline } = req.body;
    const goal = await prisma.goal.create({
      data: { title, targetAmount: targetAmount.toString(), deadline: new Date(deadline), userId: req.user.userId }
    });
    res.status(201).json({ ...goal, targetAmount: parseFloat(goal.targetAmount), currentAmount: parseFloat(goal.currentAmount) });
  } catch (error) {
    console.error('Goal creation error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/goals/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, targetAmount, currentAmount, deadline } = req.body;
    const goal = await prisma.goal.update({
      where: { id: parseInt(id), userId: req.user.userId },
      data: { title, targetAmount: targetAmount.toString(), currentAmount: (currentAmount || 0).toString(), deadline: new Date(deadline) }
    });
    res.json({ ...goal, targetAmount: parseFloat(goal.targetAmount), currentAmount: parseFloat(goal.currentAmount) });
  } catch (error) {
    console.error('Goal update error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/goals/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.goal.delete({ where: { id: parseInt(id), userId: req.user.userId } });
    res.json({ message: 'Goal deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/monthly-spending', authenticateToken, async (req, res) => {
  try {
    const transactions = await prisma.transaction.findMany({
      where: { userId: req.user.userId, type: 'expense' },
      select: { amount: true, date: true }
    });

    const monthlyData = transactions.reduce((acc, t) => {
      const month = new Date(t.date).toLocaleString('en-US', { month: 'short' });
      acc[month] = (acc[month] || 0) + parseFloat(t.amount);
      return acc;
    }, {});

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const result = months.map(month => ({ month, amount: monthlyData[month] || 0 }));

    res.json(result);
  } catch (error) {
    console.error('Monthly spending fetch error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
