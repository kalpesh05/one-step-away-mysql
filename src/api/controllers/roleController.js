const { roleService } = require("../../services");
const roleMole = require("../../models");
const {
  DATABASE_INTERNAL,
  ROLE_NOT_FOUND,
} = require("../constants/errorMessages");
const { groupBy, orderBy, omit } = require("lodash");
const moment = require("moment-timezone");
const { DB_CONFIG } = require("../../configs");
class roleController {
  /**
   * Get All Role
   * @param req
   * @param res
   * @returns {Promise<*>}
   */
  async getAllRoles(req, res, next) {
    const req_api_name = req.id + "_" + req.url.split("/")[1];

    let query = req.query;
    try {
      logger.debug({
        msg: req_api_name + " | " + "QUERY_EXECUTION",
      });
      let roles = await roleService.getAllWhere(query);

      return res.json({
        data: roles,
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
   * Get one  question
   * @param req
   * @param res
   * @returns {Promise<*>}
   */
  async getOne(req, res, next) {
    const req_api_name = req.id + "_" + req.url.split("/")[1];
    let { params } = req;
    try {
      logger.debug({
        msg: req_api_name + " | " + "QUERY_EXECUTION",
      });

      let role = await roleService.getOne(params.role_id);
      if (!role) throw new Error(ROLE_NOT_FOUND);

      return res.json({
        message: "",
        data: role,
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
   * Get one
   * @param req
   * @param res
   * @returns {Promise<*>}
   */
  async roleCheck(req, res, next) {
    const req_api_name = req.id + "_" + req.url.split("/")[1];
    let { body } = req;
    try {
      logger.debug({
        msg: req_api_name + " | " + "QUERY_EXECUTION",
      });

      const role = await roleService.getOneWhere(body);
      return res.json({
        message: "",
        data: role,
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
   * Create Role
   * @param req
   * @param res
   * @returns {Promise<*>}
   */
  async create(req, res, next) {
    const req_api_name = req.id + "_" + req.url.split("/")[1];
    let { body } = req;
    try {
      logger.debug({
        msg: req_api_name + " | " + "QUERY_EXECUTION",
      });

      const createRole = await roleService.create(body);

      logger.debug({
        msg: req_api_name + " | " + "QUERY_EXECUTION",
      });

      const getRole = await roleService.getOneWhere({
        id: createRole.insertId,
      });

      return res.json({
        data: getRole,
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
   * Update  role
   * @param req
   * @param res
   * @returns {Promise<*>}
   */
  async update(req, res, next) {
    const req_api_name = req.id + "_" + req.url.split("/")[1];
    let { params, body } = req;
    let { update, getOneWhere } = roleService;
    try {
      /**
       * Check valid  role
       */

      logger.debug({
        msg: req_api_name + " | " + "QUERY_EXECUTION",
      });

      let roleExist = await getOneWhere({
        id: params.role_id,
      });

      if (!roleExist) throw new Error(ROLE_NOT_FOUND);

      logger.debug({
        msg: req_api_name + " | " + "QUERY_EXECUTION",
      });

      let roleUpdate = await update(params.role_id, body);

      /**
       * find  role after update
       */
      logger.debug({
        msg: req_api_name + " | " + "QUERY_EXECUTION",
      });

      let role = await getOneWhere({
        id: params.role_id,
      });

      /**
       * API response
       */
      return res.send({
        message: "",
        data: role,
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
   * Delete  question
   * @param req
   * @param res
   * @returns {Promise<*>}
   */
  async remove(req, res, next) {
    const req_api_name = req.id + "_" + req.url.split("/")[1];
    let { params } = req;
    let { getOneWhere, remove, update } = roleService;

    try {
      /**
       * Check valid  role
       */
      logger.debug({
        msg: req_api_name + " | " + "QUERY_EXECUTION",
      });

      let roleExist = await getOneWhere({
        id: params.role_id,
      });

      if (!roleExist) throw new Error(ROLE_NOT_FOUND);

      logger.debug({
        msg: req_api_name + " | " + "QUERY_EXECUTION",
      });

      let roleUpdate = await remove(params.role_id);

      /**
       * API response
       */

      return res.send({
        message: "",
        data: {},
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

module.exports = new roleController();
