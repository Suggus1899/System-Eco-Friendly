const Joi = require('joi');

const registerSchema = Joi.object({
    email: Joi.string().email().required().messages({
        'string.email': 'El email debe ser válido',
        'any.required': 'El email es obligatorio',
        'string.empty': 'El email no puede estar vacío'
    }),
    password: Joi.string().min(6).required().messages({
        'string.min': 'La contraseña debe tener al menos 6 caracteres',
        'any.required': 'La contraseña es obligatoria',
        'string.empty': 'La contraseña no puede estar vacía'
    }),
    name: Joi.string().min(2).max(255).required().messages({
        'string.min': 'El nombre debe tener al menos 2 caracteres',
        'string.max': 'El nombre no puede exceder 255 caracteres',
        'any.required': 'El nombre es obligatorio',
        'string.empty': 'El nombre no puede estar vacío'
    }),
    zone: Joi.string().max(100).optional().allow(null, '').messages({
        'string.max': 'La zona no puede exceder 100 caracteres'
    })
});

const loginSchema = Joi.object({
    email: Joi.string().email().required().messages({
        'string.email': 'El email debe ser válido',
        'any.required': 'El email es obligatorio',
        'string.empty': 'El email no puede estar vacío'
    }),
    password: Joi.string().required().messages({
        'any.required': 'La contraseña es obligatoria',
        'string.empty': 'La contraseña no puede estar vacía'
    })
});

module.exports = {
    registerSchema,
    loginSchema
};
