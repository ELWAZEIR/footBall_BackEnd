import express from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { authenticateToken } from '../middleware/auth.js';
import { requireAdmin } from '../middleware/admin.js';

const router = express.Router();

// GET /api/users
router.get('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/users
router.post('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { email, password, name, role, salary, responsibleYears } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      email,
      password: hashedPassword,
      name,
      role,
      salary: role === 'COACH' ? salary : undefined,
      responsibleYears: role === 'COACH' ? responsibleYears : []
    });

    res.status(201).json(user);
  } catch (err) {
    if (err.code === 11000) {
      res.status(400).json({ error: 'Email already exists' });
    } else {
      res.status(500).json({ error: 'Server error' });
    }
  }
});

// PUT /api/users/:id
router.put('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { email, name, role, salary, responsibleYears } = req.body;

    const updated = await User.findByIdAndUpdate(id, {
      email,
      name,
      role,
      salary: role === 'COACH' ? salary : undefined,
      responsibleYears: role === 'COACH' ? responsibleYears : []
    }, { new: true }).select('-password');

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE /api/users/:id
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;