const Joi = require("joi");
const errorMessages = require("../constants/errorMessages");

exports.create = Joi.object().keys({
  start_time: Joi.date()
    .error(new Error(errorMessages.START_TIME_INVALID))
    .optional(),
  time_taken_in_min: Joi.number()
    .error(new Error(errorMessages.START_TIME_INVALID))
    .optional(),
  end_time: Joi.string()
    .error(new Error(errorMessages.START_TIME_INVALID))
    .optional(),
  status: Joi.number()
    .error(new Error(errorMessages.START_TIME_INVALID))
    .optional(),
});

exports.update = Joi.object().keys({
  start_time: Joi.number()
    .error(new Error(errorMessages.START_TIME_INVALID))
    .optional(),
  time_taken_in_min: Joi.number()
    .error(new Error(errorMessages.START_TIME_INVALID))
    .optional(),
  end_time: Joi.number()
    .error(new Error(errorMessages.START_TIME_INVALID))
    .optional(),
  status: Joi.number()
    .error(new Error(errorMessages.START_TIME_INVALID))
    .optional(),
});
