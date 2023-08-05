const Joi = require("joi");
const errorMessages = require("../constants/errorMessages");

exports.create = Joi.object().keys({
  mode: Joi.string().error(new Error(errorMessages.MODE_INVALID))
});

exports.update = Joi.object().keys({
  mode: Joi.string()
    .error(new Error(errorMessages.MODE_INVALID))
    .optional()
});
