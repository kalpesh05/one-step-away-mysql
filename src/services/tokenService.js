const { tokenModel } = require("../models");
const jwt = require("jsonwebtoken");
const moment = require("moment-timezone");
const { mongoId } = require("../helpers/commonFunction");
const { LOGIN_FAILED } = require("../api/constants/errorMessages");
const {
  emailVerificationEmailSend,
  forgotPasswordEmailSend
} = require("../helpers/mailSendUsingTemplateId");

class tokenService {
  async getOne(id) {
    return tokenModel.findOne({ id: id });
  }

  async getOneWhere(where) {
    return tokenModel.findOne(where);
  }

  async createToken(model) {
    let jwtToken = "";
    // console.log(model);
    try {
      jwtToken = jwt.sign(
        {
          ip: model.ip,
          id: model.user_id,
          workspace: "USER"
        },
        process.env.JWT_SECRET
      );
    } catch (error) {
      // console.log(error);
      throw new Error(LOGIN_FAILED);
    }

    delete model.ip;
    // model.id = mongoId("token");
    model.token = jwtToken;

    return tokenModel.create(model);
  }

  async create(model) {
    let jwtToken = "";
    // console.log(model, process.env.JWT_SECRET);
    try {
      jwtToken = jwt.sign(
        {
          id: model.user_id,
          ip: model.ip
        },
        process.env.JWT_SECRET
      );
      // console.log(jwtToken);
    } catch (error) {
      throw new Error(LOGIN_FAILED);
    }
    delete model.role_id;
    delete model.ip;
    // model._id = mongoId("token");
    // delete model.user_id;
    model.token = jwtToken;
    // console.log("model");
    // console.log(model);
    // console.log("model");

    return tokenModel.create(model);
  }

  async remove(model) {
    return tokenModel.remove(model);
  }

  async verfiyToken(where) {
    let token = {};
    token = await tokenModel.findOne(where);
    if (!token) throw new Error(INVALID_EMAIL_TOKEN);

    const currentDate = new Date();

    if (currentDate > moment(token.created_at).add("24", "hours"))
      throw new Error(INVALID_EMAIL_TOKEN);

    return token[0].user_id;
  }

  async update(userId, model) {
    return tokenModel.update({user_id: userId }, model);
  }

  /**
   *  Remove from token from database
   */
  async removeToken(userId, type) {
    // return tokenModel.update(
    //   { user_id: userId, type: type },
    //   { deleted_at: moment().format("YYYY-MM-DD") }
    // );
    return tokenModel.remove({ user_id: userId, type: type });
  }
}

module.exports = new tokenService();
