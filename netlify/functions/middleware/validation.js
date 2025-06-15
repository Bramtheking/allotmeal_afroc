const Joi = require("joi")

// Validation middleware
const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body)
    if (error) {
      return res.status(400).json({
        error: "Validation failed",
        details: error.details.map((detail) => detail.message),
      })
    }
    next()
  }
}

// Validation schemas
const schemas = {
  register: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    firstName: Joi.string().min(2).max(50).required(),
    lastName: Joi.string().min(2).max(50).required(),
    phone: Joi.string().optional(),
  }),

  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),

  service: Joi.object({
    title: Joi.string().min(5).max(200).required(),
    description: Joi.string().min(10).max(2000).required(),
    subcategory: Joi.string().optional(),
    location: Joi.string().max(100).optional(),
    price: Joi.string().max(50).optional(),
    contact: Joi.object({
      phone: Joi.string().optional(),
      email: Joi.string().email().optional(),
      whatsapp: Joi.string().optional(),
    }).optional(),
    features: Joi.array().items(Joi.string()).optional(),
    images: Joi.array().items(Joi.string().uri()).optional(),
  }),

  contact: Joi.object({
    name: Joi.string().min(2).max(100).required(),
    email: Joi.string().email().required(),
    subject: Joi.string().min(5).max(200).required(),
    message: Joi.string().min(10).max(2000).required(),
  }),
}

module.exports = {
  validateRequest,
  schemas,
}
