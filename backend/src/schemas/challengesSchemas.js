const Joi = require('joi');

const createChallengeSchema = Joi.object({
    title: Joi.string().max(255).required().messages({
        'any.required': 'El título es obligatorio'
    }),
    description: Joi.string().required().messages({
        'any.required': 'La descripción es obligatoria'
    }),
    points_reward: Joi.number().integer().min(0).default(10),
    challenge_type: Joi.string().max(100).default('weekly'),
    start_date: Joi.date().iso().optional().allow(null),
    end_date: Joi.date().iso().optional().allow(null),
    status: Joi.string().valid('active', 'inactive', 'completed').default('active'),
    target_value: Joi.number().integer().positive().optional().allow(null),
    icon: Joi.string().max(100).optional().allow(null, '')
});

const updateChallengeSchema = Joi.object({
    title: Joi.string().max(255).optional(),
    description: Joi.string().optional(),
    points_reward: Joi.number().integer().min(0).optional(),
    challenge_type: Joi.string().max(100).optional(),
    start_date: Joi.date().iso().optional().allow(null),
    end_date: Joi.date().iso().optional().allow(null),
    status: Joi.string().valid('active', 'inactive', 'completed').optional(),
    target_value: Joi.number().integer().positive().optional().allow(null),
    icon: Joi.string().max(100).optional().allow(null, '')
});

module.exports = {
    createChallengeSchema,
    updateChallengeSchema
};
