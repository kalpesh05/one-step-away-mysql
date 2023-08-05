/**
 * Passport middleware
 */
const jwt = require("jsonwebtoken");
const passport = require("passport");
const localStrategy = require("passport-local").Strategy;
const passportJWT = require("passport-jwt");
const bcrypt = require("bcryptjs");
const ExtractJwt = passportJWT.ExtractJwt;
const JwtStrategy = passportJWT.Strategy;
const config = require("../configs");
const { cryptoPassword } = require("../helpers/commonFunction");
const {
  getOneWhere,
  getOneWhereWithPassword,
} = require("../services/userService");
const {
  studentService,
  superAdminService,
  teacherService,
  userService,
  classesService,
} = require("../services");
const { create, getOne } = require("../services/tokenService");
const { omit } = require("lodash");
const {
  INVALID_PASSWORD,
  INVALID_PASSWORD_STUDENT,
  UNAUTHORIZED,
  USER_NOT_FOUND,
  CLASS_CODE_MISSING,
} = require("../api/constants/errorMessages");
const { USER_ROLES } = require("../api/constants/constans");
passport.serializeUser(async (user, done) => {
  // console.log(user.user.id);
  done(null, user.user.id);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

/**
 * JWT option
 */
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
};

/**
 * Passport jwt strategy
 */
const jwtStrategy = new JwtStrategy(jwtOptions, async (jwtPayload, next) => {
  const user = await userService.getOneWhere({
    id: jwtPayload.id,
  });

  if (user) {
    // console.log(user);
    next(null, user);
  } else {
    next({ message: UNAUTHORIZED }, false);
  }
});

/**
 * Passport JWT strategy include in passport
 */
passport.use(jwtStrategy);

/**
 * Passport login local strategy
 */
const loginLocalStrategy = new localStrategy(
  {
    usernameField: "email",
    passwordField: "password",
    passReqToCallback: true,
    session: false,
  },
  async (req, email, password, done) => {
    const req_api_name = req.id + "_" + req.url.split("/")[1];

    let field = { email: email };
    // console.log(password, user_name);
    logger.debug({
      msg: req_api_name + " | " + "QUERY_EXECUTION",
    });

    let user = await userService.getOneWhereWithPassword(field);
    // console.log(user);
    if (!user) {
      return done({ message: USER_NOT_FOUND }, false);
    }
    let profile = {};

    user = omit(user, ["level"]);
    const comparePassword = cryptoPassword(user.salt, password);
    // console.log(comparePassword, user.password);
    let ip;
    if (req.headers["x-forwarded-for"]) {
      ip = req.headers["x-forwarded-for"].split(",")[0];
    } else if (req.connection && req.connection.remoteAddress) {
      ip = req.connection.remoteAddress;
    } else {
      ip = req.ip;
    }
    // console.log("client IP is *********************" + ip);
    const isMatchPassword =
      (user.is_password_encrypted ? comparePassword.password : password) ===
      user.password
        ? true
        : false;

    if (isMatchPassword) {
      switch (user.role_id) {
        case USER_ROLES["SUPER_ADMIN"]:
          logger.debug({
            msg: req_api_name + " | " + "QUERY_EXECUTION",
          });
          let getSuperAdmin = await superAdmin.getAllWhere({
            user_id: user.id,
          });
          profile = getSuperAdmin[0];
          break;

        case USER_ROLES["TEACHER"]:
          logger.debug({
            msg: req_api_name + " | " + "QUERY_EXECUTION",
          });
          let getTeacher = await teacherService.getAllWhere({
            user_id: user.id,
          });
          profile = getTeacher[0];
          break;

        case USER_ROLES["STUDENT"]:
          logger.debug({
            msg: req_api_name + " | " + "QUERY_EXECUTION",
          });
          let getStudent = await studentService.getAllWhere({
            user_id: user.id,
          });
          profile = getStudent[0];
          break;
      }
      user.profile = profile;

      const tokenObj = {
        ip: ip,
        user_id: user.id,
        type: "user_login",
      };

      logger.debug({
        msg: req_api_name + " | " + "QUERY_EXECUTION",
      });

      const token = await create(tokenObj);

      logger.debug({
        msg: req_api_name + " | " + "QUERY_EXECUTION",
      });

      const getToken = await getOne(token.insertId);

      return done(null, { user, token: getToken["token"] });
    } else {
      return done({ message: INVALID_PASSWORD }, false);
    }
  }
);

/**
 * Passport student login local strategy
 */
const studentLoginLocalStrategy = new localStrategy(
  {
    usernameField: "user_name",
    passwordField: "password",
    passReqToCallback: true,
    session: false,
  },
  async (req, user_name, password, done) => {
    const req_api_name = req.id + "_" + req.url.split("/")[1];

    let field = {
      user_name: user_name,
      class_code: req.body.class_code,
    };
    // let studentField = { class_code: req.body.class_code };
    // console.log(field);

    if (!req.body.class_code) {
      return done({ message: CLASS_CODE_MISSING }, false);
    }

    logger.debug({
      msg: req_api_name + " | " + "QUERY_EXECUTION",
    });

    let user = await userService.getOneWhereWithPassword(field);

    // let checkClass = await classesService.getOneWhere({
    //   user_id: user.id,
    //   class_code: req.body.class_code
    // });
    // console.log(checkClass);
    // if (!checkClass) {
    // let  checkClass = await studentService.getOneWhere(studentField);
    // }
    if (!user) {
      return done({ message: USER_NOT_FOUND }, false);
    }
    let profile = {};
    // user = user[0];
    // console.log(password, user);

    let ip;
    if (req.headers["x-forwarded-for"]) {
      ip = req.headers["x-forwarded-for"].split(",")[0];
    } else if (req.connection && req.connection.remoteAddress) {
      ip = req.connection.remoteAddress;
    } else {
      ip = req.ip;
    }
    const isMatchPassword = password === user.password ? true : false;

    if (isMatchPassword) {
      logger.debug({
        msg: req_api_name + " | " + "QUERY_EXECUTION",
      });

      let getStudent = await studentService.getAllWhere({
        user_id: user.id,
      });

      profile = getStudent[0];
      profile.class_code = req.body.class_code;
      user.profile = profile;
      const tokenObj = {
        ip: ip,
        user_id: user.id,
        type: "user_login",
      };

      logger.debug({
        msg: req_api_name + " | " + "QUERY_EXECUTION",
      });

      const token = await create(tokenObj);

      logger.debug({
        msg: req_api_name + " | " + "QUERY_EXECUTION",
      });

      const getToken = await getOne(token.insertId);

      return done(null, { user, token: getToken["token"] });
    } else {
      return done({ message: INVALID_PASSWORD_STUDENT }, false);
    }
  }
);

/**
 * Passport login local strategy
 */
passport.use("login", loginLocalStrategy);

/**
 * Passport student login local strategy
 */

passport.use("student-login", studentLoginLocalStrategy);

module.exports = passport;
