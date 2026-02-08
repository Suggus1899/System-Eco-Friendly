const Joi = require('joi');

const createReminderSchema = Joi.object({
    user_id: Joi.number().integer().required().messages({
        'number.base': 'El ID de usuario debe ser un número',
        'any.required': 'El ID de usuario es obligatorio'
    }),
    title: Joi.string().max(255).required().messages({
        'string.max': 'El título no puede exceder 255 caracteres',
        'any.required': 'El título es obligatorio',
        'string.empty': 'El título no puede estar vacío'
    }),
    message: Joi.string().optional().allow(null, ''),
    zone: Joi.string().max(100).optional().allow(null, ''),
    material_category: Joi.string().max(100).optional().allow(null, ''),
    reminder_date: Joi.date().iso().optional().allow(null).messages({
        'date.format': 'La fecha debe tener formato ISO (YYYY-MM-DD)'
    }),
    reminder_time: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/).optional().allow(null, '').messages({
        'string.pattern.base': 'La hora debe tener formato HH:MM o HH:MM:SS'
    }),
    frequency: Joi.string().valid('once', 'weekly', 'monthly').default('once').messages({
        'any.only': 'La frecuencia debe ser: once, weekly, o monthly'
    })
});

const updateReminderSchema = Joi.object({
    title: Joi.string().max(255).optional(),
    message: Joi.string().optional().allow(null, ''),
    zone: Joi.string().max(100).optional().allow(null, ''),
    material_category: Joi.string().max(100).optional().allow(null, ''),
    reminder_date: Joi.date().iso().optional().allow(null),
    reminder_time: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/).optional().allow(null, ''),
    frequency: Joi.string().valid('once', 'weekly', 'monthly').optional(),
    active: Joi.boolean().optional()
});

module.exports = {
    createReminderSchema,
    updateReminderSchema
};
