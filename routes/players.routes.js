import express from 'express';
import Player from '../models/Player.js';
import User from '../models/User.js';
import { authenticateToken } from '../middleware/auth.js';
import { requireAdmin } from '../middleware/admin.js';

const router = express.Router();

// GET /api/players
router.get('/', authenticateToken, async (req, res) => {
  try {
    let playersQuery = Player.find().populate(['subscriptions', 'uniform', 'registration']).sort({ createdAt: -1 });

    if (req.user.role === 'COACH') {
      const coach = await User.findById(req.user.id);
      if (coach?.responsibleYears?.length) {
        playersQuery = playersQuery.where('birthYear').in(coach.responsibleYears);
      }
    }

    const players = await playersQuery.exec();
    res.json(players);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/players
router.post('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { fullName, birthYear, parentPhone, notes } = req.body;
    const player = await Player.create({ fullName, birthYear, parentPhone, notes });
    res.status(201).json(player);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT /api/players/:id
router.put('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const updated = await Player.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate(['subscriptions', 'uniform', 'registration']);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE /api/players/:id
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    await Player.findByIdAndDelete(req.params.id);
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
