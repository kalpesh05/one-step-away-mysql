const Joi = require("joi");
const errorMessages = require("../constants/errorMessages");

let questionObj = {
  level_id: Joi.string().error(new Error(errorMessages.LEVEL_ID)).optional(),
  first_factor: Joi.number()
    .error(new Error(errorMessages.FIRST_FACTOR))
    .optional(),
  second_factor: Joi.number()
    .error(new Error(errorMessages.SECOND_FACTOR))
    .optional(),
  math_operation_id: Joi.number()
    .error(new Error(errorMessages.MATH_OPERATION_ID_INVALID))
    .optional(),
};

exports.create = Joi.object().keys({
  questions: Joi.array().items(questionObj).required(),
});

exports.update = Joi.object().keys({
  level_id: Joi.string().error(new Error(errorMessages.LEVEL_ID)).optional(),
  question_index: Joi.number().error(new Error(errorMessages.INDEX)).optional(),
  title: Joi.string().error(new Error(errorMessages.TITLE)).optional(),
  correct_answer: Joi.string()
    .error(new Error(errorMessages.CORRECT_ANSWER))
    .optional(),
  math_operation_id: Joi.number()
    .error(new Error(errorMessages.MATH_OPERATION_ID_INVALID))
    .optional(),
});

let questionMapObj = {
  question_id: Joi.string()
    .error(new Error(errorMessages.QUESTION))
    .required(),
};

exports.questionMap = Joi.object().keys({
  level_id: Joi.string()
    .error(new Error(errorMessages.LEVEL_ID))
    .optional(),
  questions: Joi.array()
    .items(questionMapObj)
    .required()
});