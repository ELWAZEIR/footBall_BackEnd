import rateLimit from 'express-rate-limit';
import { config } from '../config/config.js';

export const apiLimiter = rateLimit({
  windowMs: config.rateLimitWindowMs,
  max: config.rateLimitMax,
  message: {
    error: 'تم تجاوز الحد الأقصى للطلبات. حاول مرة أخرى لاحقاً.',
    success: false
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: {
    error: 'تم تجاوز الحد الأقصى لمحاولات تسجيل الدخول. حاول مرة أخرى لاحقاً.',
    success: false
  },
  standardHeaders: true,
  legacyHeaders: false,
});
