const Joi = require("joi");
const { Err } = require("joi/lib/errors");
const errorMessages = require("../constants/errorMessages");

exports.create = Joi.object().keys({
  name: Joi.string().error(new Error(errorMessages.NAME_INVALID)).required(),
  strategy_group: Joi.any()
    .error(new Error(errorMessages.STRATEGIES_GROUP_INVALID))
    .optional(),
  description: Joi.any()
    .error(new Error(errorMessages.STRATEGIES_DESCRIPTION_INVALID))
    .optional(),
  suffix: Joi.any()
    .error(new Error(errorMessages.STRATEGIES_SUFFIX_INVALID))
    .optional(),
  slug: Joi.any()
    .error(new Error(errorMessages.STRATEGIES_SUFFIX_INVALID))
    .optional(),
  math_operation: Joi.any()
    .error(new Error(errorMessages.math_operation))
    .optional(),
});

exports.update = Joi.object().keys({
  name: Joi.string().error(new Error(errorMessages.NAME_INVALID)).required(),
  strategy_group: Joi.any()
    .error(new Error(errorMessages.STRATEGIES_GROUP_INVALID))
    .optional(),
  description: Joi.any()
    .error(new Error(errorMessages.STRATEGIES_DESCRIPTION_INVALID))
    .optional(),
  suffix: Joi.any()
    .error(new Error(errorMessages.STRATEGIES_SUFFIX_INVALID))
    .optional(),
  slug: Joi.any()
    .error(new Error(errorMessages.STRATEGIES_SUFFIX_INVALID))
    .optional(),
  math_operation: Joi.any()
    .error(new Error(errorMessages.math_operation))
    .optional(),
});

let levelMapObj = {
  level_id: Joi.string().error(new Error(errorMessages.LEVEL_ID)).required(),
  strategy_id: Joi.any().error(new Error(errorMessages.STRATEGY_ID)).optional(),
  learning_mode_id: Joi.number()
    .error(new Error(errorMessages.STUDENT_LEARING_MODE_ID_INVALID))
    .optional(),
  level_strategy_index: Joi.number()
    .error(new Error(errorMessages.LEVEL_STRATEGY_INDEX))
    .optional(),
};

exports.levelMap = Joi.object().keys({
  relation: Joi.array().items(levelMapObj).required(),
});
