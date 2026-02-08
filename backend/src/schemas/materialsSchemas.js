const Joi = require('joi');

const createMaterialSchema = Joi.object({
    name: Joi.string().max(255).required().messages({
        'any.required': 'El nombre es obligatorio',
        'string.empty': 'El nombre no puede estar vacío'
    }),
    category: Joi.string().valid('organico', 'plastico', 'vidrio', 'papel', 'electronico').required().messages({
        'any.only': 'Categoría inválida. Debe ser: organico, plastico, vidrio, papel, o electronico',
        'any.required': 'La categoría es obligatoria'
    }),
    description: Joi.string().optional().allow(null, ''),
    disposal_instructions: Joi.string().optional().allow(null, ''),
    recyclable: Joi.boolean().default(true),
    image_url: Joi.string().uri().optional().allow(null, '').messages({
        'string.uri': 'La URL de la imagen no es válida'
    })
});

const updateMaterialSchema = Joi.object({
    name: Joi.string().max(255).optional(),
    category: Joi.string().valid('organico', 'plastico', 'vidrio', 'papel', 'electronico').optional(),
    description: Joi.string().optional().allow(null, ''),
    disposal_instructions: Joi.string().optional().allow(null, ''),
    recyclable: Joi.boolean().optional(),
    image_url: Joi.string().uri().optional().allow(null, '')
});

module.exports = {
    createMaterialSchema,
    updateMaterialSchema
};
