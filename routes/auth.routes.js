import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { validateRequest, loginSchema } from '../middleware/validation.js';
import { authLimiter } from '../middleware/rateLimit.js';
import { config } from '../config/config.js';
import logger from '../utils/logger.js';

const router = express.Router();

// POST  /api/auth/login
router.post('/login', authLimiter, validateRequest(loginSchema), async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      logger.warn(`Failed login attempt for email: ${email}`);
      return res.status(400).json({ 
        error: 'بيانات الدخول غير صحيحة',
        success: false
      });
    }

    // Verify password
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      logger.warn(`Failed login attempt for user: ${user._id}`);
      return res.status(400).json({ 
        error: 'بيانات الدخول غير صحيحة',
        success: false
      });
    }

    // Generate token
    const token = jwt.sign(
      { 
        id: user._id, 
        email: user.email, 
        role: user.role 
      }, 
      config.jwtSecret,
      { expiresIn: config.jwtExpiresIn }
    );

    logger.info(`Successful login for user: ${user._id} (${user.email})`);

    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        name: user.name,
        responsibleYears: user.responsibleYears
      },
      message: 'تم تسجيل الدخول بنجاح',
      success: true
    });
  } catch (err) {
    logger.error('Login error:', err);
    res.status(500).json({ 
      error: 'خطأ في الخادم',
      success: false
    });
  }
});

export default router;
