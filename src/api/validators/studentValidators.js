const Joi = require("joi");
const errorMessages = require("../constants/errorMessages");

exports.create = Joi.object().keys({
  user_name: Joi.string().error(new Error(errorMessages.USERNAME)).optional(),
  first_name: Joi.string()
    .error(new Error(errorMessages.FIRST_NAME))
    .optional(),
  last_name: Joi.string().error(new Error(errorMessages.LAST_NAME)).optional(),
  password: Joi.string().error(new Error(errorMessages.PASSWORD)).required(),
  teacher_id: Joi.string()
    .error(new Error(errorMessages.TEACHER_ID_INVALID))
    .optional(),
  class_code: Joi.string()
    .error(new Error(errorMessages.CLASS_CODE_INVALID))
    .required(),
  student_learning_mode_id: Joi.number()
    .error(new Error(errorMessages.STUDENT_LEARING_MODE_ID_INVALID))
    .required(),
  auto_timeout_for_question: Joi.number()
    .error(new Error(errorMessages.AURO_TIMOUT_FOR_QUESTION_INVALID))
    .optional(),
  session_time_limit: Joi.number()
    .error(new Error(errorMessages.SESSION_TIME_LIMIT_INVALID))
    .optional(),
  max_retry_count_to_attempt_question: Joi.number()
    .error(new Error(errorMessages.MAX_COUNT_TO_ATTEMPT_QUESTION_INVALID))
    .optional(),
  max_timeout_correct_ans_secs: Joi.number()
    .error(new Error(errorMessages.MAX_TIMEOUT_CORRECT_ANS_IN_SEC_INVALID))
    .optional(),
  mul_div_level_id: Joi.string().allow("")
    .error(new Error(errorMessages.MUL_DIV_LEVEL_ID_INVALID))
    .optional(),
  add_sub_level_id: Joi.string().allow("")
    .error(new Error(errorMessages.ADD_SUB_LEVEL_ID_INVALID))
    .optional(),
  role: Joi.string().error(new Error(errorMessages.ROLE)).optional(),
});

exports.update = Joi.object().keys({
  user_name: Joi.string().error(new Error(errorMessages.USERNAME)).optional(),
  first_name: Joi.string()
    .error(new Error(errorMessages.FIRST_NAME))
    .optional(),
  last_name: Joi.string().error(new Error(errorMessages.LAST_NAME)).optional(),
  password: Joi.string().error(new Error(errorMessages.PASSWORD)).optional(),
  teacher_id: Joi.string()
    .error(new Error(errorMessages.TEACHER_ID_INVALID))
    .optional(),
  class_code: Joi.string()
    .error(new Error(errorMessages.CLASS_CODE_INVALID))
    .required(),
  student_learning_mode_id: Joi.number()
    .error(new Error(errorMessages.STUDENT_LEARING_MODE_ID_INVALID))
    .required(),
  auto_timeout_for_question: Joi.number()
    .error(new Error(errorMessages.AURO_TIMOUT_FOR_QUESTION_INVALID))
    .optional(),
  session_time_limit: Joi.number()
    .error(new Error(errorMessages.SESSION_TIME_LIMIT_INVALID))
    .optional(),
  max_retry_count_to_attempt_question: Joi.number()
    .error(new Error(errorMessages.MAX_COUNT_TO_ATTEMPT_QUESTION_INVALID))
    .optional(),
  max_timeout_correct_ans_secs: Joi.number()
    .error(new Error(errorMessages.MAX_TIMEOUT_CORRECT_ANS_IN_SEC_INVALID))
    .optional(),
  mul_div_level_id: Joi.string().allow("")
    .error(new Error(errorMessages.MUL_DIV_LEVEL_ID_INVALID))
    .optional(),
  add_sub_level_id: Joi.string().allow("")
    .error(new Error(errorMessages.ADD_SUB_LEVEL_ID_INVALID))
    .optional(),
  role: Joi.string().error(new Error(errorMessages.ROLE)).optional(),
});
