/**
 * API authentication middleware
 */
const { getOneWhere } = require("../../services/tokenService");
const moment = require("moment-timezone");
const { UNAUTHORIZED } = require("../constants/errorMessages");

const apiAuth = async (req, res, next) => {
  const [code, message] = UNAUTHORIZED.split("::");
  const apiErrorResponse = {
    error: true,
    message: message || "",
    data: {}
  };

  let requestedIp;
  if (req.headers["x-forwarded-for"]) {
    requestedIp = req.headers["x-forwarded-for"].split(",")[0];
  } else if (req.connection && req.connection.remoteAddress) {
    requestedIp = req.connection.remoteAddress;
  } else {
    requestedIp = req.ip;
  }

  let { authorization: token } = req.headers;
  let { ip, iat } = await parseJwt(token);
  let expiredDate = moment.unix(iat).add("7", "days");
  // console.log(ip , req.headers)
  if (ip !== requestedIp && !req.headers["x-coming-from"]) {
    apiErrorResponse.message = "400::Token is assigned with different system.";
    res.status(code).send(apiErrorResponse);
  }

  if (token && token.startsWith("bearer ")) {
    token = token.slice(7, token.length);

    const tokenFound = await getOneWhere({ token });
    // console.log(">>>>", tokenFound);
    if (tokenFound) {
      if (expiredDate.diff(moment(), "days") <= 0) {
        apiErrorResponse.message = "400::Token expired, please login again.";
        res.status(code).send(apiErrorResponse);
      }
      return next();
    } else {
      // console.log(">>>>>>>>>>>>>>>>");

      res.status(code).send(apiErrorResponse);
    }
  } else {
    res.status(code).send(apiErrorResponse);
  }
};

const parseJwt = token => {
  var base64Url = token.split(".")[1];
  // console.log(base64Url);
  var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");

  var jsonPayload = Buffer.from(base64, "base64").toString();
  // var jsonPayload = decodeURIComponent(
  //   atob(base64)
  //     .split("")
  //     .map(function(c) {
  //       return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
  //     })
  //     .join("")
  // );

  return JSON.parse(jsonPayload);
};
module.exports = apiAuth;
