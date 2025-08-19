import express from 'express';
import Registration from '../models/Registration.js';
import { authenticateToken } from '../middleware/auth.js';
import { requireAdmin } from '../middleware/admin.js';

const router = express.Router();

router.get('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const regs = await Registration.find().populate('player').sort({ createdAt: -1 });
    res.json(regs);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { playerId, hasPaid, hasSubmittedDocs, paymentDate } = req.body;
    const reg = await Registration.create({
      player: playerId,
      hasPaid,
      hasSubmittedDocs,
      amount: 500,
      paymentDate: hasPaid ? (paymentDate || new Date()) : null
    });
    res.status(201).json(reg);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { hasPaid, paymentDate, ...otherFields } = req.body;
    
    // Handle payment date logic
    let updateData = { ...otherFields, hasPaid };
    if (hasPaid) {
      updateData.paymentDate = paymentDate || new Date();
    } else {
      updateData.paymentDate = null;
    }
    
    const updated = await Registration.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;