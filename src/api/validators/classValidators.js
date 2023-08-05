const Joi = require("joi");
const errorMessages = require("../constants/errorMessages");

let classObj = {
  name: Joi.string().error(new Error(errorMessages.NAME_INVALID)).optional(),
  google_classroom_id: Joi.string()
    .error(new Error(errorMessages.GOOGLE_CLASSROOM_ID))
    .optional(),
  user_id: Joi.string().error(new Error(errorMessages.USER_ID)).optional(),
  is_google_class: Joi.boolean(),
};

exports.create = Joi.object().keys({
  classes: Joi.array().items(classObj).required(),
});

exports.update = Joi.object().keys({
  name: Joi.string().error(new Error(errorMessages.NAME_INVALID)).optional(),
  class_code: Joi.string()
    .error(new Error(errorMessages.CLASS_CODE))
    .optional(),
  google_classroom_id: Joi.string()
    .error(new Error(errorMessages.GOOGLE_CLASSROOM_ID))
    .optional(),
  user_id: Joi.string().error(new Error(errorMessages.USER_ID)).optional(),
});
