import express from 'express';
import Uniform from '../models/Uniform.js';
import { authenticateToken } from '../middleware/auth.js';
import { requireAdmin } from '../middleware/admin.js';

const router = express.Router();

router.get('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const uniforms = await Uniform.find().populate('player').sort({ createdAt: -1 });
    res.json(uniforms);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { playerId, hasPaid, hasReceived, size, amount } = req.body;
    const uniform = await Uniform.create({
      player: playerId,
      hasPaid,
      hasReceived,
      size,
      amount
    });
    res.status(201).json(uniform);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const updated = await Uniform.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;