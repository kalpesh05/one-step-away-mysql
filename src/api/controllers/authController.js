const config = require("../../configs");
const { use } = require("passport");
const {
  userService,
  tokenService,
  teacherService,
  studentService,
  superAdminService,
  classesService,
  googleClassrooomService,
} = require("../../services");
const passport = require("passport");
const moment = require("moment-timezone");
const { omit } = require("lodash");
const {
  USER_REGISTER,
  EMAIL_VERIFY,
  EMAIL_ALREADY_VERIFIED,
  LOGIN_SUCCESS,
  LOGOUT_SUCCESS,
  FORGOT_PASSWORD_SUCCESS,
  RESET_PASSWORD_SUCCESS,
} = require("../constants/successMessages");
const {
  LOGIN_FAILED,
  INTERNAL_SERVER_ERROR,
  INVALID_PASSWORD_TOKEN,
  INVALID_EMAIL_TOKEN,
  USER_NOT_FOUND,
  USER_NOT_ALLOWED,
  CODE_INVALID,
} = require("../constants/errorMessages");
const { USER_ROLES } = require("../constants/constans");
const {
  randomString,
  cryptoPassword,
  classCode,
  mongoId,
} = require("../../helpers/commonFunction");
const axios = require("axios");

class authController {
  /**
   * Register
   * @param req
   * @param res
   * @returns {Promise<*>}
   */
  async register(req, res, next) {
    const req_api_name = req.id + "_" + req.url.split("/")[1];
    let model = req.body;
    let teacherModel = {};
    let ip;
    if (req.headers["x-forwarded-for"]) {
      ip = req.headers["x-forwarded-for"].split(",")[0];
    } else if (req.connection && req.connection.remoteAddress) {
      ip = req.connection.remoteAddress;
    } else {
      ip = req.ip;
    }
    try {
      model.role_id = model.role_id ? model.role_id : USER_ROLES[model.role];
      model.is_password_encrypted = model.role_id === 3 ? false : true;
      model.is_gcl_data_access_granted = false;
      // model.profile.class_code = model.class_code
      //   ? model.class_code
      //   : classCode();
      model.user_name = req.body.user_name
        ? req.body.user_name
        : `${req.body.first_name} ${req.body.last_name}`;
      delete model.role;

      logger.debug({
        msg: req_api_name + " | " + "QUERY_EXECUTION",
      });

      let user = await userService.create(model);

      logger.debug({
        msg: req_api_name + " | " + "QUERY_EXECUTION",
      });

      const getUser = await userService.getOneWhere({
        id: user.user_id,
      });


      /**
       * Send email verification mail
       */
      // Welcome email won't be sent on production
      if (!process.env.NODE_ENV == "production") {
        // await userService.sendVerificationMail(req.body, user._id);
      }
      // console.log("****", ip);
      // genrate tokengigit

      logger.debug({
        msg: req_api_name + " | " + "QUERY_EXECUTION",
      });

      let tokenData = await tokenService.createToken({
        ip: ip,
        user_id: getUser.id,
        type: "user_login",
      });

      logger.debug({
        msg: req_api_name + " | " + "QUERY_EXECUTION",
      });

      let token = await tokenService.getOne(tokenData.insertId);

      return res.json({
        message: USER_REGISTER,
        data: { user: getUser, token: token.token },
      });
    } catch (error) {
      logger.error({
        error: error,
        msg: req_api_name + " | " + "QUERY_FAILED",
      });
      return next(error);
    }
  }

  /**
   *Google_Login
   * @param req
   * @param res
   * @param {*} next
   * @returns {Promise<*>}
   */
  async google(req, res, next) {
    const req_api_name = req.id + "_" + req.url.split("/")[1];

    try {
      let model = req.body;
      let code = req.body.code;

      let ip;
      if (req.headers["x-forwarded-for"]) {
        ip = req.headers["x-forwarded-for"].split(",")[0];
      } else if (req.connection && req.connection.remoteAddress) {
        ip = req.connection.remoteAddress;
      } else {
        ip = req.ip;
      }
      /**
       *  To get id_token from url of user
       */
      const options = {
        method: "POST",
        url: `https://oauth2.googleapis.com/token?code=${code}&client_id=${config.GOOGLE_CLIENT_ID}&client_secret=${config.GOOGLE_CLIENT_SECRET}&redirect_uri=${config.frontedUrl}${req.body.requested_url}&grant_type=authorization_code`,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      };
      /**
       * if code is not valid
       */
      if (!code) {
        throw new Error(CODE_INVALID);
      }
      const { data } = await axios(options);
      const { id_token: idToken } = data;

      const userTokenInfo = {
        method: "GET",
        url: `https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${idToken}`,
      };

      const { data: userTokenData } = await axios(userTokenInfo);
      /*
       * get email from the userTokenData
       */
      const User = await userService.getOneWhereRegister({
        email: userTokenData.email,
        role_id: 2,
      });
      /**
       * if user already register with us
       */
      delete data.id_token;
      delete data.scope;
      delete data.token_type;
      if (User) {
        logger.debug({
          msg: req_api_name + " | " + "QUERY_EXECUTION",
        });

        let token_Data = await tokenService.createToken({
          ip: ip,
          user_id: User.id,
          type: "google_login",
        });

        logger.debug({
          msg: req_api_name + " | " + "QUERY_EXECUTION",
        });

        let token_data = await tokenService.getOne(token_Data.insertId);

        return res.json({
          message: LOGIN_SUCCESS,
          data: { user: User, token: token_data.token },
        });
      } else {
        /**
         * verify the usre in req user and userToken
         *
         */


        logger.debug({
          msg: req_api_name + " | " + "QUERY_EXECUTION",
        });


        /**
         * if user is not register with us
         */
        model.email = model.email ? model.email : userTokenData.email;
        model.first_name = model.first_name ? model.first_name : userTokenData.given_name;
        model.last_name = model.last_name ? model.last_name : userTokenData.family_name;
        model.role_id = model.role_id ? model.role_id : USER_ROLES[model.role];
        // model.google_user_id = userTokenData.sub;


        logger.debug({
          msg: req_api_name + " | " + "QUERY_EXECUTION",
        });

        let user = await userService.create(model);

        logger.debug({
          msg: req_api_name + " | " + "QUERY_EXECUTION",
        });

        const getUser = await userService.getOneWhere({
          id: user.user_id,
        });


        /**
         * Send email verification mail
         */
        // Welcome email won't be sent on production
        if (!process.env.NODE_ENV == "production") {
          // await userService.sendVerificationMail(req.body, user._id);
        }
        // console.log("****", ip);

        /**
         * genrate token
         */

        logger.debug({
          msg: req_api_name + " | " + "QUERY_EXECUTION",
        });

        let tokenData = await tokenService.createToken({
          ip: ip,
          user_id: getUser.id,
          type: "google_login",
        });

        logger.debug({
          msg: req_api_name + " | " + "QUERY_EXECUTION",
        });

        let token = await tokenService.getOne(tokenData.insertId);
        /**
         * API response
         */
        return res.json({
          message: USER_REGISTER,
          data: { user: getUser, token: token.token },
        });
      }
    } catch (error) {
      logger.error({
        error: error,
        msg: req_api_name + " | " + "QUERY_FAILED",
      });
      return next(error);
    }
  }

  /**
   * Login
   * @param req
   * @param res
   * @param {*} next
   * @returns {Promise<*>}
   */
  async login(req, res, next) {
    const req_api_name = req.id + "_" + req.url.split("/")[1];
    passport.authenticate("login", function (err, user) {
      try {
        let role = req.body.role;

        if (req.body && user && role != user.user.role) {
          throw new Error(USER_NOT_ALLOWED);
        }

        if (user) {
          req.logIn(user, (err) => {
            if (err) {
              return next(LOGIN_FAILED);
            }

            let token = user.token;
            let userData = user.user;

            res.send({
              message: LOGIN_SUCCESS,
              data: {
                user: userData,
                token: token,
              },
            });
          });
        } else {
          return next(err);
        }
      } catch (error) {
        logger.error({
          error: error,
          msg: req_api_name + " | " + "QUERY_FAILED",
        });
        return next(error);
      }
    })(req, res, next);
  }


  /**
   * Logout
   * @param req
   * @param res
   * @param {*} next
   * @returns {Promise<*>}
   */
  async logout(req, res, next) {
    // console.log(req.user);
    let { user, headers } = req;
    const req_api_name = req.id + "_" + req.url.split("/")[1];

    try {
      /**
       * Token get from header
       */
      const tokenString = headers.authorization.slice(
        7,
        req.headers.authorization.length
      );

      logger.debug({
        msg: req_api_name + " | " + "QUERY_EXECUTION",
      });

      // console.log(req.user);
      let token = await tokenService.remove({
        user_id: user.id,
        token: tokenString,
      });

      return res.json({
        message: LOGOUT_SUCCESS,
        data: "",
      });
    } catch (error) {
      logger.error({
        error: error,
        msg: req_api_name + " | " + "QUERY_FAILED",
      });
      return next(error);
    }
  }

  /**
   * User verify email API main function
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  async verifyEmail(req, res, next) {
    let { removeToken, verfiyToken } = tokenService;
    const req_api_name = req.id + "_" + req.url.split("/")[1];
    try {
      /**
       * Validate token
       */

      logger.debug({
        msg: req_api_name + " | " + "QUERY_EXECUTION",
      });

      const userId = await verfiyToken(req.params.token);

      /**
       * Check user email verified
       */
      logger.debug({
        msg: req_api_name + " | " + "QUERY_EXECUTION",
      });

      let user = await userService.getOneWhere({
        id: userId,
      });

      if (!user) throw new Error(INVALID_EMAIL_TOKEN);

      if (user.is_email_verified) throw new Error(EMAIL_ALREADY_VERIFIED);

      /**
       * User email verify flag update in database
       */

      logger.debug({
        msg: req_api_name + " | " + "QUERY_EXECUTION",
      });

      user = await userService.update(userId, {
        is_email_verified: true,
      });

      if (!user) throw new Error(DATABASE_INTERNAL);

      /**
       * Remove token from database
       */

      logger.debug({
        msg: req_api_name + " | " + "QUERY_EXECUTION",
      });

      await removeToken(userId, "email_verification");

      /**
       * API response
       */
      return res.send({
        message: EMAIL_VERIFY,
        data: "",
      });
    } catch (error) {
      logger.error({
        error: error,
        msg: req_api_name + " | " + "QUERY_FAILED",
      });
      return next(error);
    }
  }

  /**
   * Forgot password
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  async forgotPassword(req, res, next) {
    const req_api_name = req.id + "_" + req.url.split("/")[1];

    try {
      let { email } = req.body;
      let { getOneWhere, sendForgotPasswordMail } = userService;
      let { removeToken } = tokenService;

      logger.debug({
        msg: req_api_name + " | " + "QUERY_EXECUTION",
      });

      const user = await userService.getOneWhere({ email });

      if (!user) throw new Error(USER_NOT_FOUND);
      let userId = user.id;
      const tokenString = randomString(16);

      const tokenObj = {
        user_id: userId,
        token: tokenString,
        type: "password_reset",
      };

      logger.debug({
        msg: req_api_name + " | " + "QUERY_EXECUTION",
      });

      let token = await tokenService.create(tokenObj);

      /**
       * Send email forgot password mail
       */

      logger.debug({
        msg: req_api_name + " | " + "QUERY_EXECUTION",
      });

      await sendForgotPasswordMail(user, tokenObj.token);

      logger.debug({
        msg: req_api_name + " | " + "QUERY_EXECUTION",
      });

      let tokenRemove = await removeToken(userId, "user_login");

      if (!tokenRemove) throw new Error(DATABASE_INTERNAL);

      /**
       * API response
       */
      return res.send({
        message: FORGOT_PASSWORD_SUCCESS,
        data: "",
      });
    } catch (error) {
      logger.error({
        error: error,
        msg: req_api_name + " | " + "QUERY_FAILED",
      });
      return next(error);
    }
  }

  /**
   * Reset password
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  async resetPassword(req, res, next) {
    let { token, new_password } = req.body;
    let { update } = userService;
    let { removeToken, getOneWhere } = tokenService;
    const req_api_name = req.id + "_" + req.url.split("/")[1];

    try {
      logger.debug({
        msg: req_api_name + " | " + "QUERY_EXECUTION",
      });

      const tokenData = await getOneWhere({
        token: token,
        type: "password_reset",
      });

      if (!tokenData) throw new Error(INVALID_PASSWORD_TOKEN);

      const currentDate = new Date();

      if (currentDate > moment(tokenData.created_at).add("24", "hours"))
        throw new Error(INVALID_PASSWORD_TOKEN);

      let userId = tokenData.user_id;

      const Password = cryptoPassword(null, new_password);

      logger.debug({
        msg: req_api_name + " | " + "QUERY_EXECUTION",
      });

      const user = await userService.update(userId, {
        password: Password.password,
        salt: Password.salt,
      });

      if (!user) throw new Error(DATABASE_INTERNAL);

      /**
       * Remove token from database
       */

      logger.debug({
        msg: req_api_name + " | " + "QUERY_EXECUTION",
      });

      await removeToken(userId, "password_reset");

      /**
       * Remove login session from database
       */

      logger.debug({
        msg: req_api_name + " | " + "QUERY_EXECUTION",
      });

      await removeToken(userId, "user_login");

      /**
       * API response
       */
      return res.send({
        message: RESET_PASSWORD_SUCCESS,
        data: "",
      });
    } catch (error) {
      logger.error({
        error: error,
        msg: req_api_name + " | " + "QUERY_FAILED",
      });
      return next(error);
    }
  }

  /**
   * Get LoggedIn User Detail
   * @param req
   * @param res
   * @returns {Promise<*>}
   */
  async getMyDetail(req, res, next) {
    const req_api_name = req.id + "_" + req.url.split("/")[1];
    try {
      let userDetails = {};
      // console.log("user_id", req.user.id);

      logger.debug({
        msg: req_api_name + " | " + "QUERY_EXECUTION",
      });

      const user = await userService.getOne(req.user.id);

      /**
       * API response
       */
      return res.send({
        message: "",
        data: user,
      });
    } catch (error) {
      logger.error({
        error: error,
        msg: req_api_name + " | " + "QUERY_FAILED",
      });
      return next(error);
    }
  }

  /**
   * Get LoggedIn User Detail
   * @param req
   * @param res
   * @returns {Promise<*>}
   */
  async updateDetail(req, res, next) {
    let { body } = req;
    const req_api_name = req.id + "_" + req.url.split("/")[1];

    try {
      let userDetails = {};
      let profile = {};
      // console.log(req.user);

      logger.debug({
        msg: req_api_name + " | " + "QUERY_EXECUTION",
      });

      const userExist = await userService.getOne(req.user.id);

      if (!userExist) throw new Error(USER_NOT_FOUND);

      // let profile=[];
      switch (userExist.role_id) {
        case USER_ROLES["SUPER_ADMIN"]:
          logger.debug({
            msg: req_api_name + " | " + "QUERY_EXECUTION",
          });

          let superAdmin = await superAdminService.update(
            req.user.id,
            body.profile
          );

          logger.debug({
            msg: req_api_name + " | " + "QUERY_EXECUTION",
          });

          let getSuperAdmin = await superAdminService.getOneWhere({
            user_id: req.user.id,
          });
          profile = getSuperAdmin;
          break;

        case USER_ROLES["TEACHER"]:
          logger.debug({
            msg: req_api_name + " | " + "QUERY_EXECUTION",
          });

          let teacher = await teacherService.update(req.user.id, body.profile);
          // userDetails.profile = teacher[0];

          logger.debug({
            msg: req_api_name + " | " + "QUERY_EXECUTION",
          });

          let getTeacher = await teacherService.getOneWhere({
            user_id: req.user.id,
          });
          profile = getTeacher;
          break;

        case USER_ROLES["STUDENT"]:
          logger.debug({
            msg: req_api_name + " | " + "QUERY_EXECUTION",
          });

          let student = await studentService.update(req.user.id, body.profile);

          logger.debug({
            msg: req_api_name + " | " + "QUERY_EXECUTION",
          });

          let getStudent = await studentService.getOneWhere({
            user_id: req.user.id,
          });
          profile = getStudent;
          break;
      }

      let userBody = omit(body, ["profile"]);
      userBody.is_password_encrypted =
        userExist.role_id === USER_ROLES["STUDENT"] ? 0 : 1;
      userBody = omit(userBody, ["role_name", "teacher_id", "student_id"]);

      logger.debug({
        msg: req_api_name + " | " + "QUERY_EXECUTION",
      });

      let userUpdate = await userService.update(req.user.id, userBody);

      logger.debug({
        msg: req_api_name + " | " + "QUERY_EXECUTION",
      });

      let user = await userService.getOneWhere({
        id: req.user.id,
      });

      userDetails = user;
      userDetails.profile = profile;
      /**
       * API response
       */
      return res.send({
        message: "",
        data: userDetails,
      });
    } catch (error) {
      logger.error({
        error: error,
        msg: req_api_name + " | " + "QUERY_FAILED",
      });
      return next(error);
    }
  }
}

module.exports = new authController();
