const { userModel, tokenModel } = require("../models");
const tokenService = require("./tokenService");
const teacherService = require("./teacherService");
const studentService = require("./studentService");
const classesService = require("./classesService");
const superAdminService = require("./superAdminService");
const {
  EMAIL_ADDRESS_ALREADY_REGISTERED,
  USER_ALREADY_REGISTERED,
  STUDENT_ALREADY_EXIST,
  USER_NOT_FOUND,
  EXTRA_FIELD_NOT_FOUND,
  STUDENT_NOT_FOUND,
  SUPER_ADMIN_NOT_FOUND,
  TEACHER_NOT_FOUND,
} = require("../api/constants/errorMessages");
const jwt = require("jsonwebtoken");
const {
  cryptoPassword,
  mongoId,
  generateKeyPair,
  classCode,
} = require("../helpers/commonFunction");
const {
  forgotPasswordEmailSend,
  emailVerificationEmailSend,
} = require("../helpers/mailSendUsingTemplateId");
const { omit, isEmpty } = require("lodash");
const { USER_ROLES } = require("../api/constants/constans");

class userService {
  async getAllWhere(where = {}) {
    let query = {};
    query = { ...where, ...query };
    let whereForUser = where.role_id ? { role_id: where.role_id } : {};
    let users = await userModel.find(query);
    return users;
  }

  async getOne(id) {
    let user = await userModel.findOne({ id: id });
    if (!user) throw new Error(USER_NOT_FOUND);
    return user;
  }

  async getOneWhere(where) {
    let query = {};
    query = { ...where, ...query };
    // console.log(query);
    let user = await userModel.findOne(query);
    if (!user) throw new Error(USER_NOT_FOUND);
    return user;
  }

  async getOneWhereRegister(where) {
    let query = {};
    query = { ...where, ...query };
    let user = await userModel.findOne(query);    
    return user;
  }


  async getOneWhereWithPassword(where) {
    let query = {};
    query = { ...where, ...query };
    // console.log(query);
    return userModel.findOneWithPassword(query);
  }

  async create(model) {
    let checkCondition = {
      email: model.email,
      // role_id: model.role_id,
    };

    let errormsg = USER_ALREADY_REGISTERED;
    
    let user = await userModel.findOne(checkCondition);

    if (user) throw new Error(errormsg);

    const { salt, password } = cryptoPassword(null, model.password);

    model.password = password;
    model.salt = salt;
    model = omit(model, ["profile"]);
    model.id = mongoId("user");

    let userData = await userModel.create(model);
    return userData;
  }

  async getAllUsers(where) {
    let users = await userModel.find(where);
    return users;
  }

  async getAllUsersWithSameName(where) {
    let userWithProfile = [];
    let users = await userModel.findSameName(where);
    for (let i in users) {
      let obj = users[i];
      obj.profile = this.getRelatedUserByRoleBySameName(
        users[i].role_id,
        users[i].id,
        where
      );
      userWithProfile.push(obj);
    }
    return userWithProfile;
  }

  //   removeAuthToken(token) {
  //     return app.models.Token.deleteOne({ token });
  //   }

  async update(id, model) {
    // console.log("id ::", model);
    let roleWiseUpdateModel = model.profile
      ? model.deleted_at
        ? { deleted_at: model.deleted_at }
        : model.profile
      : null;
    model = omit(model, ["profile"]);
    if (model.password && model.is_password_encrypted) {
      const { salt, password } = cryptoPassword(null, model.password);

      model.password = password;
      model.salt = salt;
    }

    if (!isEmpty(model)) {
      let user = await userModel.update({ id: id }, model);
    }
    return roleWiseUpdateModel
      ? await this.updateRelatedUserByRole(id, roleWiseUpdateModel)
      : {};
  }

  async updateGoogle(id, data) {
    // console.log("data::", data);
    if (!isEmpty(data)) {
      let user = await userModel.update({ id: id }, data);

      return user;
    }
  }

  async remove(where) {
    return userModel.remove(where);
  }

  /**
   * Send verification mail to user email
   */
  async sendVerificationMail(body, userId) {
    let tokenData = await tokenService.createToken({
      user_id: userId,
      type: "email_verification",
    });

    await emailVerificationEmailSend(
      body.email,
      body.first_name,
      `${process.env.FRONTEND_URL}/verify/email/${tokenData.token}`
    );

    return true;
  }

  /**
   * Send forgot password mail to user email
   */
  async sendForgotPasswordMail(user, token) {
    await forgotPasswordEmailSend(
      user.email,
      user.first_name,
      `${process.env.FRONTEND_URL}/reset-password/${token}`
    );

    return true;
  }

}
module.exports = new userService();
