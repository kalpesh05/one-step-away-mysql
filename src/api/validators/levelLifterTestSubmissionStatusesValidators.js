const Joi = require("joi");
const errorMessages = require("../constants/errorMessages");

exports.create = Joi.object().keys({
  status: Joi.string().error(new Error(errorMessages.STATUS)).required(),
});

exports.update = Joi.object().keys({
  status: Joi.string().error(new Error(errorMessages.STATUS)).required(),
});
