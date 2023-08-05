const Joi = require("joi");
const errorMessages = require("../constants/errorMessages");

exports.create = Joi.object().keys({
  user_name: Joi.string()
    .min(1)
    .max(15)
    .error(new Error(errorMessages.USERNAME))
    .optional(),
  first_name: Joi.string()
    .min(3)
    .max(15)
    .error(new Error(errorMessages.FIRST_NAME))
    .optional(),
  last_name: Joi.string()
    .min(3)
    .max(15)
    .error(new Error(errorMessages.LAST_NAME))
    .optional(),
  password: Joi.string()
    .error(new Error(errorMessages.PASSWORD))
    .required(),
  role: Joi.string()
    .error(new Error(errorMessages.ROLE))
    .optional()
});

exports.update = Joi.object().keys({
  user_name: Joi.string()
    .min(1)
    .max(15)
    .error(new Error(errorMessages.USERNAME))
    .optional(),
  first_name: Joi.string()
    .min(3)
    .max(15)
    .error(new Error(errorMessages.FIRST_NAME))
    .optional(),
  last_name: Joi.string()
    .min(3)
    .max(15)
    .error(new Error(errorMessages.LAST_NAME))
    .optional(),
  password: Joi.string()
    .error(new Error(errorMessages.PASSWORD))
    .required(),
  role: Joi.string()
    .error(new Error(errorMessages.ROLE))
    .optional()
});
