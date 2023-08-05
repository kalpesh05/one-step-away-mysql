const Joi = require("joi");
const validator = require("../validators");
const { authValidators } = validator;
const { capitalize, lowerCase, camelCase } = require("lodash");

exports.validate = (data, handler) => {
  let schema = `${camelCase(handler[0].replace("Controller", ""))}Validators`;

  // console.log(
  //   schema,
  //   handler[0],
  //   handler[0].replace("Controller", ""),
  //   camelCase(handler[1])
  // );
  let validationSchema = validator[schema][camelCase(handler[1])];
  //console.log(schema, camelCase(handler[1]));
  //console.log("data::",data)

  const validateData = Joi.validate(data, validationSchema);

// console.log("validateData::",validateData)
  if (validateData.error !== null) throw new Error(validateData.error.message);
};
