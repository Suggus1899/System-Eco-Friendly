const Joi = require('joi');

const createScheduleSchema = Joi.object({
    zone: Joi.string().max(100).required().messages({
        'any.required': 'La zona es obligatoria'
    }),
    material_category: Joi.string().max(100).required().messages({
        'any.required': 'La categoría de material es obligatoria'
    }),
    day_of_week: Joi.number().integer().min(0).max(6).required().messages({
        'number.min': 'Día inválido (0-6)',
        'number.max': 'Día inválido (0-6)',
        'any.required': 'El día de la semana es obligatorio'
    }),
    time: Joi.string().max(50).optional().allow(null, ''),
    description: Joi.string().optional().allow(null, ''),
    active: Joi.boolean().default(true)
});

const updateScheduleSchema = Joi.object({
    zone: Joi.string().max(100).optional(),
    material_category: Joi.string().max(100).optional(),
    day_of_week: Joi.number().integer().min(0).max(6).optional(),
    time: Joi.string().max(50).optional().allow(null, ''),
    description: Joi.string().optional().allow(null, ''),
    active: Joi.boolean().optional()
});

module.exports = {
    createScheduleSchema,
    updateScheduleSchema
};
