import express from 'express';
import Player from '../models/Player.js';
import User from '../models/User.js';
import { authenticateToken } from '../middleware/auth.js';
import { requireAdmin } from '../middleware/admin.js';
import { validateRequest, playerSchema } from '../middleware/validation.js';
import logger from '../utils/logger.js';

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
    res.json({
      data: players,
      success: true
    });
  } catch (err) {
    logger.error('Error fetching players:', err);
    res.status(500).json({ 
      error: 'خطأ في الخادم',
      success: false
    });
  }
});

// POST /api/players
router.post('/', authenticateToken, requireAdmin, validateRequest(playerSchema), async (req, res) => {
  try {
    const { fullName, birthYear, parentPhone, notes } = req.body;
    const player = await Player.create({ fullName, birthYear, parentPhone, notes });
    
    logger.info(`Player created: ${player._id} by user: ${req.user.id}`);
    
    res.status(201).json({
      data: player,
      message: 'تم إضافة اللاعب بنجاح',
      success: true
    });
  } catch (err) {
    logger.error('Error creating player:', err);
    res.status(500).json({ 
      error: 'خطأ في الخادم',
      success: false
    });
  }
});

// PUT /api/players/:id
router.put('/:id', authenticateToken, requireAdmin, validateRequest(playerSchema), async (req, res) => {
  try {
    const updated = await Player.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true }
    ).populate(['subscriptions', 'uniform', 'registration']);
    
    if (!updated) {
      return res.status(404).json({
        error: 'اللاعب غير موجود',
        success: false
      });
    }
    
    logger.info(`Player updated: ${req.params.id} by user: ${req.user.id}`);
    
    res.json({
      data: updated,
      message: 'تم تحديث اللاعب بنجاح',
      success: true
    });
  } catch (err) {
    logger.error('Error updating player:', err);
    res.status(500).json({ 
      error: 'خطأ في الخادم',
      success: false
    });
  }
});

// DELETE /api/players/:id
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const player = await Player.findByIdAndDelete(req.params.id);
    
    if (!player) {
      return res.status(404).json({
        error: 'اللاعب غير موجود',
        success: false
      });
    }
    
    logger.info(`Player deleted: ${req.params.id} by user: ${req.user.id}`);
    
    res.status(204).end();
  } catch (err) {
    logger.error('Error deleting player:', err);
    res.status(500).json({ 
      error: 'خطأ في الخادم',
      success: false
    });
  }
});

export default router;
