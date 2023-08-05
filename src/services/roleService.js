const { roleModel, tokenModel } = require("../models");
const tokenService = require("./tokenService");
const {
  EMAIL_ADDRESS_ALREADY_REGISTERED,
  EXTRA_FIELD_NOT_FOUND
} = require("../api/constants/errorMessages");
const jwt = require("jsonwebtoken");
const { mongoId } = require("../helpers/commonFunction");

class roleService {
  async getAllWhere(where = {}) {
    return roleModel.find(where);
  }

  async getOne(id) {
    return roleModel.findOne({ id: id });
  }

  async getOneWhere(where) {
    return roleModel.findOne(where);
  }

  async create(model) {
    model.id = mongoId("role");
    return roleModel.create(model);
  }

  async getAllroles() {
    return roleModel.find({});
  }

  async update(id, model) {
    return roleModel.update({ id: id }, model);
  }

  async remove(id) {
    return roleModel.remove(id);
    //   return roleModel.update(
    //     { id: id },
    //     { deleted_at: moment().format("YYYY-MM-DD") }
    //   );
  }
}

module.exports = new roleService();
