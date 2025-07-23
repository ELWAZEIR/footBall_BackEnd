import express from 'express';
import Subscription from '../models/Subscription.js';
import Player from '../models/Player.js';
import User from '../models/User.js';
import { authenticateToken } from '../middleware/auth.js';
import mongoose from 'mongoose'; 
const router = express.Router();

router.get('/', authenticateToken, async (req, res) => {
  // try {
  //   let query = Subscription.find().populate('player').sort({ createdAt: -1 });
  //   if (req.user.role === 'COACH') {
  //     const coach = await User.findById(req.user.id);
  //     if (coach?.responsibleYears?.length) {
  //       query = query.where('player.birthYear').in(coach.responsibleYears);
  //     }
  //   }
  //   const subs = await query.exec();
  //   res.json(subs);
  // } catch (err) {
  //   res.status(500).json({ error: 'Server error' });
  // }
  const coach = req.user.role === 'COACH'
  ? await User.findById(req.user.id)
  : null;

let query = Subscription.find()
  .populate({
    path: 'player',
    match: coach?.responsibleYears?.length
      ? { birthYear: { $in: coach.responsibleYears } }
      : {},
  })
  .sort({ createdAt: -1 });

const subs = await query.exec();

// فلترة الاشتراكات اللي فعلاً معاها بيانات player
const filteredSubs = subs.filter(sub => sub.player != null);

res.json(filteredSubs);

});

router.post('/', authenticateToken, async (req, res) => {
  try {
    const { playerId, month, hasPaid, paymentDate, amount } = req.body;

    if (!playerId || !mongoose.Types.ObjectId.isValid(playerId)) {
      return res.status(400).json({ error: 'Invalid or missing playerId' });
    }

    if (!month || amount === undefined) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const sub = await Subscription.create({
      player: playerId,
      month,
      hasPaid,
      paymentDate: paymentDate ? new Date(paymentDate) : null,
      amount,
    });

    res.status(201).json(sub);
  } catch (err) {
    console.error("Error in POST /subscriptions:", err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const updated = await Subscription.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;