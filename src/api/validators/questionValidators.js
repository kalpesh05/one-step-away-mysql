const Joi = require("joi");
const errorMessages = require("../constants/errorMessages");

exports.create = Joi.object().keys({
  level_id: Joi.string()
    .error(new Error(errorMessages.LEVEL_ID))
    .optional(),
  question_index: Joi.number()
    .error(new Error(errorMessages.INDEX))
    .optional(),
  title: Joi.string()
    .error(new Error(errorMessages.TITLE))
    .optional(),
  correct_answer: Joi.string()
    .allow("")
    .error(new Error(errorMessages.CORRECT_ANSWER))
    .optional(),
  math_operation_id: Joi.number()
    .error(new Error(errorMessages.MATH_OPERATION_ID_INVALID))
    .optional()
});

exports.update = Joi.object().keys({
  level_id: Joi.string()
    .error(new Error(errorMessages.LEVEL_ID))
    .optional(),
  question_index: Joi.number()
    .error(new Error(errorMessages.INDEX))
    .optional(),
  title: Joi.string()
    .error(new Error(errorMessages.TITLE))
    .optional(),
  correct_answer: Joi.string()
    .allow("")
    .error(new Error(errorMessages.CORRECT_ANSWER))
    .optional(),
  math_operation_id: Joi.number()
    .error(new Error(errorMessages.MATH_OPERATION_ID_INVALID))
    .optional()
});
