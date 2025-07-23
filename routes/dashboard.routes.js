import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { requireAdmin } from '../middleware/admin.js';
import Player from '../models/Player.js';
import Subscription from '../models/Subscription.js';
import Uniform from '../models/Uniform.js';
import Registration from '../models/Registration.js';

const router = express.Router();

router.get('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const totalPlayers = await Player.countDocuments();
    const subscriptionIncome = await Subscription.aggregate([{ $match: { hasPaid: true } }, { $group: { _id: null, total: { $sum: '$amount' } } }]);
    const uniformIncome = await Uniform.aggregate([{ $match: { hasPaid: true } }, { $group: { _id: null, total: { $sum: '$amount' } } }]);
    const registrationIncome = await Registration.aggregate([{ $match: { hasPaid: true } }, { $group: { _id: null, total: { $sum: '$amount' } } }]);
    const unpaidSubscriptions = await Subscription.countDocuments({ hasPaid: false });
    const overdueSubscriptions = await Subscription.countDocuments({ hasPaid: false, createdAt: { $lt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } });

    res.json({
      totalPlayers,
      subscriptionIncome: subscriptionIncome[0]?.total || 0,
      uniformIncome: uniformIncome[0]?.total || 0,
      registrationIncome: registrationIncome[0]?.total || 0,
      unpaidSubscriptions,
      overdueSubscriptions
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;