const Joi = require("joi");
const errorMessages = require("../constants/errorMessages");

exports.create = Joi.object().keys({
  status_id: Joi.string()
    .error(new Error(errorMessages.STATUS_ID))
    .optional(),
  assigned_level_id: Joi.string()
    .error(new Error(errorMessages.ASSIGNED_LEVEL_ID))
    .optional(),
  strategy_id: Joi.string()
    .error(new Error(errorMessages.STRATEGY_ID))
    .optional(),
  title: Joi.string()
    .error(new Error(errorMessages.TITLE))
    .optional(),
  math_operation: Joi.string()
    .error(new Error(errorMessages.MATH_OPERATION_INVALID))
    .optional()
});

exports.update = Joi.object().keys({
  status_id: Joi.string()
    .error(new Error(errorMessages.STATUS_ID))
    .optional(),
  assigned_level_id: Joi.string()
    .error(new Error(errorMessages.ASSIGNED_LEVEL_ID))
    .optional(),
  strategy_id: Joi.string()
    .error(new Error(errorMessages.STRATEGY_ID))
    .optional(),
  title: Joi.string()
    .error(new Error(errorMessages.TITLE))
    .optional(),
  math_operation: Joi.string()
    .error(new Error(errorMessages.MATH_OPERATION_INVALID))
    .optional()
});
