const Joi = require("joi")

const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body)
    if (error) {
      return res.status(400).json({
        error: "Validation error",
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
    firstName: Joi.string().min(2).required(),
    lastName: Joi.string().min(2).required(),
    phone: Joi.string().optional(),
  }),

  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),

  service: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    category: Joi.string().required(),
    subcategory: Joi.string().optional(),
    price: Joi.string().optional(),
    location: Joi.string().optional(),
    contact: Joi.object({
      phone: Joi.string().optional(),
      email: Joi.string().email().optional(),
      whatsapp: Joi.string().optional(),
    }).optional(),
    features: Joi.array().items(Joi.string()).optional(),
    images: Joi.array().items(Joi.string()).optional(),
    status: Joi.string().valid("active", "inactive", "pending").default("active"),
  }),

  contact: Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    subject: Joi.string().required(),
    message: Joi.string().required(),
  }),
}

module.exports = { validateRequest, schemas }
