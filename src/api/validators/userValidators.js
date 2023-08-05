const Joi = require("joi");
const errorMessages = require("../constants/errorMessages");

exports.updateProfile = Joi.object().keys({
  email: Joi.string().error(new Error(errorMessages.EMAIL)).optional(),
  user_name: Joi.string().error(new Error(errorMessages.USERNAME)).optional(),
  first_name: Joi.string()
    .error(new Error(errorMessages.FIRST_NAME))
    .optional(),
  last_name: Joi.string().error(new Error(errorMessages.LAST_NAME)).optional(),
  password: Joi.string().error(new Error(errorMessages.PASSWORD)).optional(),
  role_id: Joi.number().error(new Error(errorMessages.ROLE)).optional(),
  class_code: Joi.string()
    .error(new Error(errorMessages.CLASS_CODE_INVALID))
    .optional(),
  profile: Joi.object().error(new Error(errorMessages.PROFILE)).optional(),
});

let usersObj = {
  email: Joi.string().error(new Error(errorMessages.EMAIL)).optional(),
  user_name: Joi.string().error(new Error(errorMessages.LAST_NAME)).required(),
  password: Joi.string().error(new Error(errorMessages.PASSWORD)).required(),
  role_id: Joi.number().error(new Error(errorMessages.ROLE)).optional(),
  role: Joi.string().error(new Error(errorMessages.ROLE)).optional(),
  profile: Joi.object().error(new Error(errorMessages.PROFILE)).optional(),
};

exports.create = Joi.object().keys({
  email: Joi.string().error(new Error(errorMessages.EMAIL)).optional(),
  user_name: Joi.string().error(new Error(errorMessages.LAST_NAME)).required(),
  password: Joi.string().error(new Error(errorMessages.PASSWORD)).required(),
  role_id: Joi.number().error(new Error(errorMessages.ROLE)).optional(),
  role: Joi.string().error(new Error(errorMessages.ROLE)).optional(),
  class_code: Joi.string()
    .error(new Error(errorMessages.CLASS_CODE_INVALID))
    .optional(),
  profile: Joi.object().error(new Error(errorMessages.PROFILE)).optional(),
});

exports.createAll = Joi.object().keys({
  students: Joi.array().items(usersObj).required(),
});

exports.update = Joi.object().keys({
  email: Joi.string().error(new Error(errorMessages.EMAIL)).optional(),
  user_name: Joi.string().error(new Error(errorMessages.USERNAME)).optional(),
  password: Joi.string().error(new Error(errorMessages.PASSWORD)).optional(),
  role_id: Joi.any().error(new Error(errorMessages.ROLE)).optional(),
  role: Joi.string().error(new Error(errorMessages.ROLE)).optional(),
  class_code: Joi.string()
    .error(new Error(errorMessages.CLASS_CODE_INVALID))
    .optional(),
  user_name: Joi.string().error(new Error(errorMessages.USERNAME)).optional(),
  first_name: Joi.string()
    .error(new Error(errorMessages.FIRST_NAME))
    .optional(),
  last_name: Joi.string().error(new Error(errorMessages.LAST_NAME)).optional(),
  password: Joi.string().error(new Error(errorMessages.PASSWORD)).optional(),
  teacher_id: Joi.string()
    .error(new Error(errorMessages.TEACHER_ID_INVALID))
    .optional(),
  student_learning_mode_id: Joi.number()
    .error(new Error(errorMessages.STUDENT_LEARING_MODE_ID_INVALID))
    .optional(),
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
  mul_div_level_id: Joi.string()
    .allow("")
    .error(new Error(errorMessages.MUL_DIV_LEVEL_ID_INVALID))
    .optional(),
  add_sub_level_id: Joi.string()
    .allow("")
    .error(new Error(errorMessages.ADD_SUB_LEVEL_ID_INVALID))
    .optional(),
  profile: Joi.object().error(new Error(errorMessages.PROFILE)).optional(),
});

exports.updateMultiple = Joi.object().keys({
  role_id: Joi.any().error(new Error(errorMessages.ROLE)).optional(),
  class_code: Joi.string()
    .error(new Error(errorMessages.CLASS_CODE_INVALID))
    .optional(),
  profile: Joi.object().error(new Error(errorMessages.PROFILE)).optional(),
});

exports.userCheck = Joi.object().keys({
  role: Joi.string().error(new Error(errorMessages.ROLE)).optional(),
  first_name: Joi.string()
    .error(new Error(errorMessages.FIRST_NAME))
    .required(),
  last_name: Joi.string().error(new Error(errorMessages.LAST_NAME)).required(),
  username: Joi.string().error(new Error(errorMessages.USERNAME)).optional(),
  password: Joi.string().error(new Error(errorMessages.PASSWORD)).optional(),
});
