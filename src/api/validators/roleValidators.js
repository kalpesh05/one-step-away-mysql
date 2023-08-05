const Joi = require("joi");
const errorMessages = require("../constants/errorMessages");

exports.create = Joi.object().keys({
  role_name: Joi.string().error(new Error(errorMessages.ROLE_INVALID))
});

exports.update = Joi.object().keys({
  role_name: Joi.string()
    .error(new Error(errorMessages.ROLE_INVALID))
    .optional()
});
