import Joi from 'joi';

export const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        error: error.details[0].message,
        success: false
      });
    }
    next();
  };
};

// Validation schemas
export const playerSchema = Joi.object({
  fullName: Joi.string().min(2).max(50).required().messages({
    'string.min': 'الاسم يجب أن يكون على الأقل حرفين',
    'string.max': 'الاسم يجب أن يكون أقل من 50 حرف',
    'any.required': 'الاسم مطلوب'
  }),
  birthYear: Joi.number().min(1990).max(new Date().getFullYear()).required().messages({
    'number.min': 'سنة الميلاد يجب أن تكون بعد 1990',
    'number.max': 'سنة الميلاد لا يمكن أن تكون في المستقبل',
    'any.required': 'سنة الميلاد مطلوبة'
  }),
  parentPhone: Joi.string().pattern(/^01[0-2,5]{1}[0-9]{8}$/).required().messages({
    'string.pattern.base': 'رقم الهاتف يجب أن يكون رقم مصري صحيح',
    'any.required': 'رقم الهاتف مطلوب'
  }),
  notes: Joi.string().optional().max(500).messages({
    'string.max': 'الملاحظات يجب أن تكون أقل من 500 حرف'
  })
});

export const subscriptionSchema = Joi.object({
  playerId: Joi.string().required().messages({
    'any.required': 'معرف اللاعب مطلوب'
  }),
  month: Joi.string().required().messages({
    'any.required': 'الشهر مطلوب'
  }),
  hasPaid: Joi.boolean().required(),
  paymentDate: Joi.date().optional(),
  amount: Joi.number().positive().required().messages({
    'number.positive': 'المبلغ يجب أن يكون موجب',
    'any.required': 'المبلغ مطلوب'
  })
});

export const userSchema = Joi.object({
  name: Joi.string().min(2).max(50).required().messages({
    'string.min': 'الاسم يجب أن يكون على الأقل حرفين',
    'string.max': 'الاسم يجب أن يكون أقل من 50 حرف',
    'any.required': 'الاسم مطلوب'
  }),
  email: Joi.string().email().required().messages({
    'string.email': 'البريد الإلكتروني يجب أن يكون صحيح',
    'any.required': 'البريد الإلكتروني مطلوب'
  }),
  password: Joi.string().min(6).required().messages({
    'string.min': 'كلمة المرور يجب أن تكون على الأقل 6 أحرف',
    'any.required': 'كلمة المرور مطلوبة'
  }),
  role: Joi.string().valid('ADMIN', 'COACH').required().messages({
    'any.only': 'الدور يجب أن يكون ADMIN أو COACH',
    'any.required': 'الدور مطلوب'
  }),
  salary: Joi.number().positive().optional(),
  responsibleYears: Joi.array().items(Joi.number()).optional()
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'البريد الإلكتروني يجب أن يكون صحيح',
    'any.required': 'البريد الإلكتروني مطلوب'
  }),
  password: Joi.string().required().messages({
    'any.required': 'كلمة المرور مطلوبة'
  })
});
