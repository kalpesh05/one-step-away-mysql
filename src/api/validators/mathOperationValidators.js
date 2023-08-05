const Joi = require("joi");
const errorMessages = require("../constants/errorMessages");

exports.create = Joi.object().keys({
  math_operation_index: Joi.number()
    .error(new Error(errorMessages.INDEX))
    .optional(),
  name: Joi.string()
    .min(3)
    .max(15)
    .error(new Error(errorMessages.NAME_INVALID))
    .optional(),
  student_learning_mode_id: Joi.number()
    .error(new Error(errorMessages.STUDENT_LEARING_MODE_ID_INVALID))
    .required()
});

exports.update = Joi.object().keys({
  math_operation_index: Joi.number()
    .error(new Error(errorMessages.INDEX))
    .optional(),
  name: Joi.string()
    .min(3)
    .max(15)
    .error(new Error(errorMessages.NAME_INVALID))
    .optional(),
  student_learning_mode_id: Joi.number()
    .error(new Error(errorMessages.STUDENT_LEARING_MODE_ID_INVALID))
    .required()
});
