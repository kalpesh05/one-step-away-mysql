/**
 * API error handler
 */
const {
  INTERNAL_SERVER_ERROR,
  SOMETHING_WENT_WRONG,
} = require("../api/constants/errorMessages");

const errorHandler = (error, req, res, next) => {
  let [code, message] = INTERNAL_SERVER_ERROR.split("::");

  console.log("error", error);

  if (error.message) {
    if (error.message.indexOf("::") > -1) {
      [code, message] = error.message.split("::");
    } else {
      code = 400;
      message =
        error.message === "Request failed with status code 401"
          ? SOMETHING_WENT_WRONG
          : error.message;
    }
  }

  const apiErrorResponse = {
    error: true,
    message: message || "",
    data: {},
  };

  res.status(code).send(apiErrorResponse);
};

module.exports = errorHandler;
