const Joi = require('joi');

const createCenterSchema = Joi.object({
    name: Joi.string().max(255).required().messages({
        'any.required': 'El nombre es obligatorio'
    }),
    address: Joi.string().required().messages({
        'any.required': 'La dirección es obligatoria'
    }),
    latitude: Joi.number().min(-90).max(90).required().messages({
        'number.min': 'Latitud inválida',
        'number.max': 'Latitud inválida',
        'any.required': 'La latitud es obligatoria'
    }),
    longitude: Joi.number().min(-180).max(180).required().messages({
        'number.min': 'Longitud inválida',
        'number.max': 'Longitud inválida',
        'any.required': 'La longitud es obligatoria'
    }),
    phone: Joi.string().max(50).optional().allow(null, ''),
    email: Joi.string().email().max(255).optional().allow(null, ''),
    accepted_materials: Joi.array().items(Joi.string()).optional(),
    hours_operation: Joi.string().optional().allow(null, ''),
    status: Joi.string().valid('active', 'inactive', 'pending').default('pending')
});

const updateCenterSchema = Joi.object({
    name: Joi.string().max(255).optional(),
    address: Joi.string().optional(),
    latitude: Joi.number().min(-90).max(90).optional(),
    longitude: Joi.number().min(-180).max(180).optional(),
    phone: Joi.string().max(50).optional().allow(null, ''),
    email: Joi.string().email().max(255).optional().allow(null, ''),
    accepted_materials: Joi.array().items(Joi.string()).optional(),
    hours_operation: Joi.string().optional().allow(null, ''),
    status: Joi.string().valid('active', 'inactive', 'pending').optional()
});

module.exports = {
    createCenterSchema,
    updateCenterSchema
};
