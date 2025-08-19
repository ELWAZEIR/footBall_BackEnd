import express from 'express';
import Subscription from '../models/Subscription.js';
import Player from '../models/Player.js';
import User from '../models/User.js';
import { authenticateToken } from '../middleware/auth.js';
import { requireAdmin } from '../middleware/admin.js';
import { validateRequest, subscriptionSchema } from '../middleware/validation.js';
import logger from '../utils/logger.js';

const router = express.Router();

// GET /api/subscriptions
router.get('/', authenticateToken, async (req, res) => {
  try {
    let subscriptionsQuery = Subscription.find()
      .populate({
        path: 'playerId',
        select: 'fullName birthYear parentPhone'
      })
      .sort({ month: -1 });

    if (req.user.role === 'COACH') {
      const coach = await User.findById(req.user.id);
      if (coach?.responsibleYears?.length) {
        const playersInYears = await Player.find({
          birthYear: { $in: coach.responsibleYears }
        }).select('_id');
        const playerIds = playersInYears.map(p => p._id);
        subscriptionsQuery = subscriptionsQuery.where('playerId').in(playerIds);
      }
    }

    const subscriptions = await subscriptionsQuery.exec();
    res.json({
      data: subscriptions,
      success: true
    });
  } catch (err) {
    logger.error('Error fetching subscriptions:', err);
    res.status(500).json({ 
      error: 'خطأ في الخادم',
      success: false
    });
  }
});

// POST /api/subscriptions
router.post('/', authenticateToken, requireAdmin, validateRequest(subscriptionSchema), async (req, res) => {
  try {
    const { playerId, month, hasPaid, paymentDate, amount } = req.body;
    
    // Check if player exists
    const player = await Player.findById(playerId);
    if (!player) {
      return res.status(404).json({
        error: 'اللاعب غير موجود',
        success: false
      });
    }

    // Check if subscription already exists for this player and month
    const existingSubscription = await Subscription.findOne({
      playerId,
      month
    });

    if (existingSubscription) {
      return res.status(400).json({
        error: 'الاشتراك موجود بالفعل لهذا الشهر',
        success: false
      });
    }

    const subscription = await Subscription.create({
      playerId,
      month,
      hasPaid,
      paymentDate,
      amount
    });

    const populatedSubscription = await Subscription.findById(subscription._id)
      .populate('playerId', 'fullName birthYear parentPhone');

    logger.info(`Subscription created: ${subscription._id} by user: ${req.user.id}`);

    res.status(201).json({
      data: populatedSubscription,
      message: 'تم إضافة الاشتراك بنجاح',
      success: true
    });
  } catch (err) {
    logger.error('Error creating subscription:', err);
    res.status(500).json({ 
      error: 'خطأ في الخادم',
      success: false
    });
  }
});

// PUT /api/subscriptions/:id
router.put('/:id', authenticateToken, requireAdmin, validateRequest(subscriptionSchema), async (req, res) => {
  try {
    const updated = await Subscription.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).populate('playerId', 'fullName birthYear parentPhone');

    if (!updated) {
      return res.status(404).json({
        error: 'الاشتراك غير موجود',
        success: false
      });
    }

    logger.info(`Subscription updated: ${req.params.id} by user: ${req.user.id}`);

    res.json({
      data: updated,
      message: 'تم تحديث الاشتراك بنجاح',
      success: true
    });
  } catch (err) {
    logger.error('Error updating subscription:', err);
    res.status(500).json({ 
      error: 'خطأ في الخادم',
      success: false
    });
  }
});

// DELETE /api/subscriptions/:id
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const subscription = await Subscription.findByIdAndDelete(req.params.id);
    
    if (!subscription) {
      return res.status(404).json({
        error: 'الاشتراك غير موجود',
        success: false
      });
    }

    logger.info(`Subscription deleted: ${req.params.id} by user: ${req.user.id}`);

    res.status(204).end();
  } catch (err) {
    logger.error('Error deleting subscription:', err);
    res.status(500).json({ 
      error: 'خطأ في الخادم',
      success: false
    });
  }
});

export default router;