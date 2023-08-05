const Joi = require("joi");
const errorMessages = require("../constants/errorMessages");

exports.create = Joi.object().keys({
  placement_test_submission_id: Joi.string()
    .error(new Error(errorMessages.PLACEMENT_TEST_SUBMISSION_ID))
    .optional(),
  question_id: Joi.string()
    .error(new Error(errorMessages.QUESTION))
    .optional(),
  answer: Joi.string().allow("")
    .error(new Error(errorMessages.ANSWER))
    .required(),
  is_correct: Joi.number()
    .error(new Error(errorMessages.IS_CORRECT))
    .optional(),
  retry_count: Joi.number()
    .error(new Error(errorMessages.RERTY_COUNT))
    .optional(),
  // auto_timeout_for_question: Joi.number()
  //   .error(new Error(errorMessages.AURO_TIMOUT_FOR_QUESTION_INVALID))
  //   .optional(),
  time_taken_in_secs: Joi.number()
    .error(new Error(errorMessages.TIME_TAKEN_IN_SECOND))
    .required()
});

exports.update = Joi.object().keys({
  placement_test_submission_id: Joi.string()
    .error(new Error(errorMessages.PLACEMENT_TEST_SUBMISSION_ID))
    .optional(),
  question_id: Joi.string()
    .error(new Error(errorMessages.QUESTION))
    .optional(),
  answer: Joi.string()
    .allow("")
    .error(new Error(errorMessages.ANSWER))
    .required(),
  is_correct: Joi.number()
    .error(new Error(errorMessages.IS_CORRECT))
    .optional(),
  retry_count: Joi.number()
    .error(new Error(errorMessages.RERTY_COUNT))
    .optional(),
  // auto_timeout_for_question: Joi.number()
  //   .error(new Error(errorMessages.AURO_TIMOUT_FOR_QUESTION_INVALID))
  //   .optional(),
  time_taken_in_secs: Joi.number()
    .error(new Error(errorMessages.TIME_TAKEN_IN_SECOND))
    .required()
});
