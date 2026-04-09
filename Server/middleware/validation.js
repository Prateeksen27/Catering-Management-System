/**
 * Input Validation Middleware
 * Validates request bodies using Joi
 */

import Joi from 'joi';

// Validation schemas
export const schemas = {
  // Booking schemas
  createBooking: Joi.object({
    eventDetails: Joi.object({
      eventName: Joi.string().required().trim(),
      eventDate: Joi.date().required(),
      eventTime: Joi.string(),
      pax: Joi.number().integer().min(1).required(),
      venue: Joi.string().required().trim(),
      notes: Joi.string().trim()
    }).required(),
    clientDetails: Joi.object({
      fullName: Joi.string().required().trim(),
      email: Joi.string().email().required(),
      phone: Joi.string().pattern(/^[0-9]{10}$/).required()
    }).required(),
    priority: Joi.string().valid('High', 'Medium', 'Low').default('Medium'),
    menu: Joi.object({
      starters: Joi.array().items(Joi.string()),
      maincourse: Joi.array().items(Joi.string()),
      beverages: Joi.array().items(Joi.string()),
      desserts: Joi.array().items(Joi.string())
    }),
    Payment_Details: Joi.object({
      estimatedAmount: Joi.number().min(0).required(),
      paidAmount: Joi.number().min(0).default(0)
    })
  }),

  approveBooking: Joi.object({
    bookingId: Joi.string().required()
  }),

  rejectBooking: Joi.object({
    bookingId: Joi.string().required(),
    reason: Joi.string().trim().required()
  }),

  assignStaff: Joi.object({
    manager: Joi.string(),
    workers: Joi.array().items(Joi.string()),
    chefs: Joi.array().items(Joi.string()),
    drivers: Joi.array().items(Joi.string())
  }),

  assignVehicles: Joi.object({
    vehicles: Joi.array().items(Joi.string()).required()
  }),

  // Employee schemas
  createEmployee: Joi.object({
    name: Joi.string().required().trim(),
    empType: Joi.string().valid('Admin', 'Manager', 'Driver', 'Worker', 'Chef').required(),
    email: Joi.string().email().required(),
    phone: Joi.string().pattern(/^[0-9]{10}$/),
    location: Joi.string().trim(),
    skills: Joi.array().items(Joi.string())
  }),

  // Login schema
  login: Joi.object({
    empID: Joi.string().required(),
    password: Joi.string().required(),
    empType: Joi.string().valid('Admin', 'Manager', 'Driver', 'Worker', 'Chef').required()
  }),

  // Chef requirement schema
  submitRequirement: Joi.object({
    bookingId: Joi.string().required(),
    ingredients: Joi.array().items(
      Joi.object({
        ingredientName: Joi.string().required(),
        quantity: Joi.number().min(0).required(),
        unit: Joi.string().valid('kg', 'litres', 'grams', 'pieces', 'packets', 'bottles', 'dozen', 'boxes').required()
      })
    ).min(1).required(),
    estimatedCost: Joi.number().min(0).default(0),
    notes: Joi.string().trim()
  })
};

/**
 * Middleware factory for validating request bodies
 * @param {string} schemaName - Name of the schema to use
 * @param {string} property - Property to validate ('body', 'query', 'params')
 */
export const validate = (schemaName, property = 'body') => {
  const schema = schemas[schemaName];
  if (!schema) {
    console.error(`Validation schema '${schemaName}' not found`);
    return (req, res, next) => next();
  }

  return (req, res, next) => {
    const { error, value } = schema.validate(req[property], {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const errorMessage = error.details.map(detail => detail.message).join(', ');
      return res.status(400).json({
        error: 'Validation failed',
        details: errorMessage
      });
    }

    // Replace the validated data
    req[property] = value;
    next();
  };
};

export default {
  schemas,
  validate
};
