const Joi = require('joi');
const errorMessages = require('../constants/errorMessages');

exports.create = Joi.object().keys({
  title: Joi.string()
    .min(3)
    .max(15)
    .error(new Error(errorMessages.TITLE))
    .optional(),
  level_index: Joi.number()
    .error(new Error(errorMessages.INDEX))
    .optional(),
  learning_mode_id: Joi.number()
    .error(new Error(errorMessages.STUDENT_LEARING_MODE_ID_INVALID))
    .optional()
});

exports.update = Joi.object().keys({
  title: Joi.string()
    .min(3)
    .max(15)
    .error(new Error(errorMessages.TITLE))
    .optional(),
  level_index: Joi.number()
    .error(new Error(errorMessages.INDEX))
    .optional(),
  learning_mode_id: Joi.number()
    .error(new Error(errorMessages.STUDENT_LEARING_MODE_ID_INVALID))
    .optional()
});

let levelMapObj = {
  level_id: Joi.string()
    .error(new Error(errorMessages.LEVEL_ID))
    .required(),
  learning_mode_id: Joi.number()
    .error(new Error(errorMessages.STUDENT_LEARING_MODE_ID_INVALID))
    .optional()
};

exports.levelMap = Joi.object().keys({
  relation: Joi.array()
    .items(levelMapObj)
    .required()
});
