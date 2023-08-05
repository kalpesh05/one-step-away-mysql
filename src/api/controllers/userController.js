const {
  userService,
  tokenService,
  levelLefiterTestAnswerService,
  levelLefiterTestLevelService,
  levelLifterTestSubmissionService,
  placementTestSubmissionService,
  practiceTestSubmissionService,
  placementTestQuestionService,
  practiceTestQuestionService,
  levelService,
  placementTestLevelService,
  placementTestAnswerService,
  practiceTestAnswerService,
  studentService,
  classesService,
  levelLearningModeRelationService,
  levelLifterTestQuestionLevelRelationService,
  strategyVisitJourneyService,
  sessionService,
} = require("../../services");
const {
  USER_ALREADY_REGISTERED,
  STUDENT_NOT_FOUND,
  STUDENT_ALREADY_EXIST,
  TEACHER_ALREADY_EXIST,
  STUDENT_EXIST_IN_CLASS,
  DATABASE_INTERNAL,
  USER_NOT_FOUND,
} = require("../constants/errorMessages");
const { MATH_OPERATION_SIGN } = require("../constants/constans");
const { groupBy, orderBy, omit } = require("lodash");
const moment = require("moment-timezone");
const { classCode } = require("../../helpers/commonFunction");
const { mongoId } = require("../../helpers/commonFunction");
const { platFormLogging } = require("../../helpers/commonFunction");
const {
  USER_ROLES,
  STUDENT_LEARNING_MODE,
  MATH_OPERATION,
} = require("../constants/constans");
class userController {
  /**
   * Get All User
   * @param req
   * @param res
   * @returns {Promise<*>}
   */
  async getAllUsers(req, res, next) {
    const req_api_name = req.id + "_" + req.url.split("/")[1];
    let query = req.query;
    try {
      if (
        query.role_id == USER_ROLES["STUDENT"] &&
        req.user.role_id == USER_ROLES["TEACHER"]
      ) {
        query.teacher_user_id = req.user.id;
      }

      logger.debug({
        msg: req_api_name + " | " + "QUERY_EXECUTION",
      });

      let users = await userService.getAllWhere(query);
      return res.json({
        data: users,
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
   * Get All students by teacher
   * @param req
   * @param res
   * @returns {Promise<*>}
   */
  async getAllStudentsByTeacher(req, res, next) {
    const req_api_name = req.id + "_" + req.url.split("/")[1];
    const { role_id } = req.query;
    // console.log(req.user.id);
    try {
      logger.debug({
        msg: req_api_name + " | " + "QUERY_EXECUTION",
      });

      let users = await userService.getAllWhere({
        role_id,
        teacher_user_id: req.user.id,
      });
      // console.log(users);
      return res.json({
        data: users,
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

      let user = await userService.getOne(params.user_id);
      return res.json({
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
   * Get classes
   * @param req
   * @param res
   * @returns {Promise<*>}
   */
  async getClasses(req, res, next) {
    const req_api_name = req.id + "_" + req.url.split("/")[1];
    let { params } = req;
    try {
      logger.debug({
        msg: req_api_name + " | " + "QUERY_EXECUTION",
      });

      let classes = await classesService.getAllWhere({ user_id: req.user.id });
      return res.json({
        message: "",
        data: classes,
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
  async userCheck(req, res, next) {
    const req_api_name = req.id + "_" + req.url.split("/")[1];
    let { body } = req;
    try {
      logger.debug({
        msg: req_api_name + " | " + "QUERY_EXECUTION",
      });

      const user = await userService.getOneWhere(body);

      return res.json({
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
   * Create User
   * @param req
   * @param res
   * @returns {Promise<*>}
   */
  async create(req, res, next) {
    const req_api_name = req.id + "_" + req.url.split("/")[1];
    let { body } = req;
    let model = body;
    try {
      model.role_id = model.role_id ? model.role_id : USER_ROLES[model.role];
      model.is_password_encrypted = model.role_id === 3 ? false : true;
      if (model.role_id !== USER_ROLES["SUPER_ADMIN"]) {
        model.profile.class_code = model.profile.class_code
          ? model.profile.class_code
          : classCode();
      }
      if (model.role_id === USER_ROLES["STUDENT"]) {
        model.profile.teacher_user_id = model.profile.teacher_user_id
          ? model.profile.teacher_user_id
          : req.user.id;
      }
      model.user_name = req.body.user_name
        ? req.body.user_name
        : `${req.body.first_name} ${req.body.last_name}`;
      model.class_code = model.profile.class_code;
      delete model.role;

      logger.debug({
        msg: req_api_name + " | " + "QUERY_EXECUTION",
      });

      const createUser = await userService.create(model);
      // console.log("userController :: createUser ::", createUser);

      if (!createUser) throw new Error(DATABASE_INTERNAL);

      logger.debug({
        msg: req_api_name + " | " + "QUERY_EXECUTION",
      });

      const getUser = await userService.getOneWhere({
        id: createUser.user_id,
      });

      return res.json({
        data: getUser,
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
   * Create multiple student
   * @param req
   * @param res
   * @returns {Promise<*>}
   */
  async createAll(req, res, next) {
    const req_api_name = req.id + "_" + req.url.split("/")[1];
    try {
      let { body } = req;
      let { students } = body;
      const { role_id } = req.query;
      let userModel = [];

      for (let i in students) {
        students[i].role_id = students[i].role_id
          ? students[i].role_id
          : USER_ROLES[students[i].role];
        students[i].is_password_encrypted =
          students[i].role_id === 3 ? false : true;
        if (students[i].role_id === USER_ROLES["STUDENT"]) {
          students[i].profile.teacher_user_id = students[i].profile
            .teacher_user_id
            ? students[i].profile.teacher_user_id
            : req.user.id;
        }
        students[i].user_name = students[i].user_name
          ? students[i].user_name
          : `${students[i].first_name} ${students[i].last_name}`;
        delete students[i].role;

        userModel.push({
          id: mongoId("user"),
          user_name: students[i]["user_name"],
          email: students[i]["email"],
          password: students[i]["password"],
          is_password_encrypted: students[i]["is_password_encrypted"],
          salt: students[i]["salt"],
          role_id: students[i]["role_id"],
          class_code: students[i].profile["class_code"],
          is_gcl_data_access_granted: students[i]["is_gcl_data_access_granted"],
          google_access_token_id: students[i]["gogole_access_token_id"],
          profile: students[i].profile,
        });
        // console.log("userModel::", userModel[i]["class_code"]);
      }

      logger.debug({
        msg: req_api_name + " | " + "QUERY_EXECUTION",
      });

      const createUser = await userService.createAll(userModel);
      // console.log(createUser);
      if (!createUser) throw new Error(DATABASE_INTERNAL);

      logger.debug({
        msg: req_api_name + " | " + "QUERY_EXECUTION",
      });

      let allUser = await userService.getAllWhere({
        role_id,
      });

      // const getUser = await userService.getOneWhere({
      //   id: createUser.user_id,
      // });

      return res.json({
        data: allUser,
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
   * Update  user
   * @param req
   * @param res
   * @returns {Promise<*>}
   */
  async update(req, res, next) {
    const req_api_name = req.id + "_" + req.url.split("/")[1];
    let { params, body } = req;
    let model = body;
    // let { update, getOneWhere } = userService;
    try {
      /**
       * Check valid  user
       */

      logger.debug({
        msg: req_api_name + " | " + "QUERY_EXECUTION",
      });

      let userExist = await userService.getOneWhere({
        id: params.user_id,
      });

      if (!userExist) throw new Error(USER_NOT_FOUND);

      let mulDivLevelId = req.body.profile
        ? req.body.profile.mul_div_level_id
        : req.body.mul_div_level_id;

      let addSubLevelId = req.body.profile
        ? req.body.profile.add_sub_level_id
        : req.body.add_sub_level_id;

      let studentLearningModeId = req.body.profile
        ? req.body.profile.student_learning_mode_id
        : req.body.student_learning_mode_id;

      userExist = {
        user_name: body.user_name ? body.user_name : userExist.user_name,
        email: body.email ? body.email : userExist.email,
        password: body.password ? body.password : userExist.profile.password,
        class_code: body.class_code
          ? body.class_code
          : userExist.profile.class_code,
        role_id: userExist.role_id
          ? userExist.role_id
          : USER_ROLES[userExist.role],
        profile: {
          first_name: body.first_name
            ? body.first_name
            : userExist.profile.first_name,
          last_name: body.last_name
            ? body.last_name
            : userExist.profile.last_name,
          class_code: body.class_code
            ? body.class_code
            : userExist.profile.class_code,
          student_learning_mode_id: studentLearningModeId
            ? studentLearningModeId
            : userExist.profile.student_learning_mode_id,
          is_add_sub_level_lifter: body.is_add_sub_level_lifter
            ? body.is_add_sub_level_lifter
            : userExist.profile.is_add_sub_level_lifter,
          is_mul_div_level_lifter: body.is_mul_div_level_lifter
            ? body.is_mul_div_level_lifter
            : userExist.profile.is_mul_div_level_lifter,
          mul_div_level_id:
            mulDivLevelId == "" || mulDivLevelId
              ? mulDivLevelId
              : userExist.profile.mul_div_level_id,
          add_sub_level_id:
            addSubLevelId == "" || addSubLevelId
              ? addSubLevelId
              : userExist.profile.add_sub_level_id,
          is_imported_from_google: body.is_imported_from_google
            ? body.is_imported_from_google
            : userExist.profile.is_imported_from_google,
          auto_timeout_for_question: body.auto_timeout_for_question
            ? body.auto_timeout_for_question
            : userExist.profile.auto_timeout_for_question,
          max_retry_count_to_attempt_question:
            body.max_retry_count_to_attempt_question
              ? body.max_retry_count_to_attempt_question
              : userExist.profile.max_retry_count_to_attempt_question,
          max_timeout_correct_ans_secs: body.max_timeout_correct_ans_secs
            ? body.max_timeout_correct_ans_secs
            : userExist.profile.max_timeout_correct_ans_secs,
          session_time_limit: body.session_time_limit
            ? body.session_time_limit
            : userExist.profile.session_time_limit,
        },
      };

      if (userExist.role_id === 3) {
        delete userExist.email;
      }
      delete userExist.role;
      /**
       * check condition for students level_id
       */
      if (
        (userExist.profile.mul_div_level_id === "" &&
          userExist.profile.student_learning_mode_id == 2) ||
        (userExist.profile.add_sub_level_id === "" &&
          userExist.profile.student_learning_mode_id == 1)
      ) {
        logger.debug({
          msg: req_api_name + " | " + "QUERY_EXECUTION",
        });

        await userService.update(params.user_id, userExist);

        logger.debug({
          msg: req_api_name + " | " + "QUERY_EXECUTION",
        });

        let removeSessions = await sessionService.removeByUserId({
          user_id: params.user_id,
          student_learning_mode_id: userExist.profile.student_learning_mode_id,
        });

        logger.debug({
          msg: req_api_name + " | " + "QUERY_EXECUTION",
        });

        let removeStragroyjourney =
          await strategyVisitJourneyService.removeByUserId({
            user_id: params.user_id,
            learning_mode_id: userExist.profile.student_learning_mode_id,
          });

        logger.debug({
          msg: req_api_name + " | " + "QUERY_EXECUTION",
        });

        let getAllplacementSubmission =
          await placementTestSubmissionService.getAllWhere({
            created_by: params.user_id,
            learning_mode_id: userExist.profile.student_learning_mode_id,
          });

        for (let i in getAllplacementSubmission) {
          logger.debug({
            msg: req_api_name + " | " + "QUERY_EXECUTION",
          });

          let removeplacementTestAnswers =
            await placementTestAnswerService.removeByplacementSubmissionId(
              getAllplacementSubmission[i]["id"]
            );
        }

        logger.debug({
          msg: req_api_name + " | " + "QUERY_EXECUTION",
        });

        let removeAllPlacmentSubmission =
          await placementTestSubmissionService.removeByQuery({
            created_by: params.user_id,
            learning_mode_id: userExist.profile.student_learning_mode_id,
          });

        logger.debug({
          msg: req_api_name + " | " + "QUERY_EXECUTION",
        });

        let getAllPracticetSubmission =
          await practiceTestSubmissionService.getAllWhere({
            created_by: params.user_id,
            learning_mode_id: userExist.profile.student_learning_mode_id,
          });

        for (let i in getAllPracticetSubmission) {
          logger.debug({
            msg: req_api_name + " | " + "QUERY_EXECUTION",
          });

          let removepracticeTestAnswers =
            await practiceTestAnswerService.removeByPracticetSubmissionId(
              getAllPracticetSubmission[i]["id"]
            );
        }

        logger.debug({
          msg: req_api_name + " | " + "QUERY_EXECUTION",
        });

        let removeAllPracticetSubmission =
          await practiceTestSubmissionService.removeByQuery({
            created_by: params.user_id,
            learning_mode_id: userExist.profile.student_learning_mode_id,
          });

        logger.debug({
          msg: req_api_name + " | " + "QUERY_EXECUTION",
        });

        let getAllLevelLifterSubmission =
          await levelLifterTestSubmissionService.getAllWhere({
            created_by: params.user_id,
            learning_mode_id: userExist.profile.student_learning_mode_id,
          });

        for (let i in getAllLevelLifterSubmission) {
          logger.debug({
            msg: req_api_name + " | " + "QUERY_EXECUTION",
          });

          let removelevelLifiterTestAnswers =
            await levelLefiterTestAnswerService.removeByLevelLifterSubmissionId(
              getAllLevelLifterSubmission[i]["id"]
            );
        }

        logger.debug({
          msg: req_api_name + " | " + "QUERY_EXECUTION",
        });

        let removeAllLevelLifterSubmission =
          await levelLifterTestSubmissionService.removeByQuery({
            created_by: params.user_id,
            learning_mode_id: userExist.profile.student_learning_mode_id,
          });
      } else {
        logger.debug({
          msg: req_api_name + " | " + "QUERY_EXECUTION",
        });

        let userUpdate = await userService.update(params.user_id, userExist);

        logger.debug({
          msg: req_api_name + " | " + "QUERY_EXECUTION",
        });
      }
      /**
       * find  user after update
       */

      let user = await userService.getOneWhere({
        id: params.user_id,
      });

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
   * Update  user
   * @param req
   * @param res
   * @returns {Promise<*>}
   */
  async updateMultiple(req, res, next) {
    const req_api_name = req.id + "_" + req.url.split("/")[1];
    let { params, body } = req;
    let model = body;
    try {
      const user_ids = params.user_ids.split(",");

      model.role_id = model.role_id ? model.role_id : USER_ROLES[model.role];
      delete model.role;
      /**
       * check condition for students level_id
       */
      for (let i in user_ids) {
        if (
          (model.profile.mul_div_level_id === "" &&
            model.profile.student_learning_mode_id === 2) ||
          (model.profile.add_sub_level_id === "" &&
            model.profile.student_learning_mode_id === 1)
        ) {
          logger.debug({
            msg: req_api_name + " | " + "QUERY_EXECUTION",
          });

          let userUpdate = await userService.update(user_ids[i], body);

          logger.debug({
            msg: req_api_name + " | " + "QUERY_EXECUTION",
          });

          let removeSessions = await sessionService.removeByUserId({
            user_id: user_ids[i],
            student_learning_mode_id: model.profile.student_learning_mode_id,
          });

          logger.debug({
            msg: req_api_name + " | " + "QUERY_EXECUTION",
          });

          let removeStragroyjourney =
            await strategyVisitJourneyService.removeByUserId({
              user_id: user_ids[i],
              learning_mode_id: model.profile.student_learning_mode_id,
            });

          logger.debug({
            msg: req_api_name + " | " + "QUERY_EXECUTION",
          });

          let getAllPlacementSubmission =
            await placementTestSubmissionService.getAllWhere({
              created_by: user_ids[i],
              learning_mode_id: model.profile.student_learning_mode_id,
            });

          for (let i in getAllPlacementSubmission) {
            logger.debug({
              msg: req_api_name + " | " + "QUERY_EXECUTION",
            });

            let removePlacementTestAnswers =
              await placementTestAnswerService.removeByPlacementSubmissionId(
                getAllPlacementSubmission[i]["id"]
              );
          }

          logger.debug({
            msg: req_api_name + " | " + "QUERY_EXECUTION",
          });

          let removeAllPlacementSubmission =
            await placementTestSubmissionService.removeByQuery({
              created_by: user_ids[i],
              learning_mode_id: model.profile.student_learning_mode_id,
            });

          logger.debug({
            msg: req_api_name + " | " + "QUERY_EXECUTION",
          });

          let getAllPracticetSubmission =
            await practiceTestSubmissionService.getAllWhere({
              created_by: user_ids[i],
              learning_mode_id: model.profile.student_learning_mode_id,
            });

          for (let i in getAllPracticetSubmission) {
            logger.debug({
              msg: req_api_name + " | " + "QUERY_EXECUTION",
            });

            let removePracticeTestAnswers =
              await practiceTestAnswerService.removeByPracticetSubmissionId(
                getAllPracticetSubmission[i]["id"]
              );
          }

          logger.debug({
            msg: req_api_name + " | " + "QUERY_EXECUTION",
          });

          let removeAllPracticetSubmission =
            await practiceTestSubmissionService.removeByQuery({
              created_by: user_ids[i],
              learning_mode_id: model.profile.student_learning_mode_id,
            });

          logger.debug({
            msg: req_api_name + " | " + "QUERY_EXECUTION",
          });

          let getAllLevelLifterSubmission =
            await levelLifterTestSubmissionService.getAllWhere({
              created_by: user_ids[i],
              learning_mode_id: model.profile.student_learning_mode_id,
            });

          for (let i in getAllLevelLifterSubmission) {
            logger.debug({
              msg: req_api_name + " | " + "QUERY_EXECUTION",
            });

            let removeLevelLifterTestAnswers =
              await levelLifterTestAnswerService.removeByLevelLifterSubmissionId(
                getAllLevelLifterSubmission[i]["id"]
              );
          }

          logger.debug({
            msg: req_api_name + " | " + "QUERY_EXECUTION",
          });

          let removeAllLevelLifterSubmission =
            await levelLifterTestSubmissionService.removeByQuery({
              created_by: user_ids[i],
              learning_mode_id: model.profile.student_learning_mode_id,
            });
        } else {
          logger.debug({
            msg: req_api_name + " | " + "QUERY_EXECUTION",
          });

          let userUpdate = await userService.update(user_ids[i], body);

          logger.debug({
            msg: req_api_name + " | " + "QUERY_EXECUTION",
          });
        }
      }
      logger.debug({
        msg: req_api_name + " | " + "QUERY_EXECUTION",
      });

      /**
       * find  user after update
       */

      let users = await userService.getAllWhere({
        role_id: 3,
        teacher_user_id: req.user.id,
      });

      /**
       * API response
       */
      return res.send({
        message: "",
        data: users,
      });
    } catch (error) {
      logger.error({
        error: error,
        msg: req_api_name + " | " + "QUERY_FAILED",
      });
      return next(error);
    }
  }

  async getDetailedLastSubmission(req, res, next) {
    const req_api_name = req.id + "_" + req.url.split("/")[1];
    let { body, params } = req;
    try {
      let report = [];
      let finalReport = [];
      let question_answer_groupby_level = [];

      logger.debug({
        msg: req_api_name + " | " + "QUERY_EXECUTION",
      });

      let getSubmission = await placementTestSubmissionService.getOneWhere({
        created_by: params.user_id,
      });
      let questionQuery = {};
      let isWhereIn = false;

      if (
        !req.query.isAll ||
        req.query.isAll == false ||
        req.query.learning_mode
      ) {
        let studentCheck = await studentService.getOneWhere({
          user_id: params.user_id,
        });
        let modeCheck = req.query.learning_mode
          ? req.query.learning_mode
          : studentCheck && studentCheck.student_learning_mode_id;
        let math_operation_ids =
          modeCheck == STUDENT_LEARNING_MODE["MUL_DIV"]
            ? [MATH_OPERATION["MULTIPLICATION"], MATH_OPERATION["DIVISION"]]
            : [MATH_OPERATION["ADDITION"], MATH_OPERATION["SUBTRACTION"]];
        questionQuery.math_operation_id = math_operation_ids;
        isWhereIn = true;
      }

      logger.debug({
        msg: req_api_name + " | " + "QUERY_EXECUTION",
      });

      let questions =
        req.query.type !== "attempted"
          ? await placementTestLevelService.getAllQuestionWhere(
              questionQuery,
              isWhereIn,
              "order by math_operation_id asc"
            )
          : await placementTestAnswerService.getDataBySubmisionQuery(
              params.user_id,
              req.query.learning_mode,
              questionQuery.math_operation_id
            );

      for (let i in questions) {
        let is_attempted = false;
        let is_correct = 0;
        let retry_count = 0;
        let time_taken_in_second = 0;
        let answer = 0;

        if (req.query.type == "attempted") {
          is_attempted = true;
          is_correct = questions[i]["is_correct"];
          retry_count = questions[i]["retry_count"];
          time_taken_in_second = questions[i]["time_taken_in_secs"];
          answer = questions[i]["answer"];
        } else {
          logger.debug({
            msg: req_api_name + " | " + "QUERY_EXECUTION",
          });

          let answers = getSubmission
            ? await placementTestAnswerService.getAnswersByUserSubmissions(
                params.user_id,
                questions[i]["id"],
                getSubmission.id
              )
            : [];
          answer = answers.length > 0 ? answers[0]["answer"] : answer;
          is_attempted = answers.length > 0 ? true : is_attempted;
          is_correct =
            answers.length > 0 ? answers[0]["is_correct"] : is_correct;
          retry_count =
            answers.length > 0 ? answers[0]["retry_count"] : retry_count;
          time_taken_in_second =
            answers.length > 0
              ? answers[0]["time_taken_in_secs"]
              : time_taken_in_second;
        }

        question_answer_groupby_level.push({
          question: questions[i]["title"],
          question_id: questions[i]["id"],
          math_operation_id: questions[i]["math_operation_id"],
          math_operation: questions[i]["math_operation"],
          correct_answer: questions[i]["correct_answer"],
          level_id: questions[i]["level_id"],
          level_title: questions[i]["level_title"],
          level_index: questions[i]["level_index"],
          question_index: questions[i]["question_index"],
          submission_id: questions[i]["placement_test_submissions_statuses"],
          answer: answer,
          is_attempted: is_attempted,
          is_correct: is_correct,
          retry_count: retry_count,
          time_taken_in_second: time_taken_in_second,
        });
      }

      question_answer_groupby_level = orderBy(
        question_answer_groupby_level,
        ["level_index"],
        ["asc"]
      );
      question_answer_groupby_level = groupBy(
        question_answer_groupby_level,
        "math_operation"
      );
      for (let property in question_answer_groupby_level) {
        question_answer_groupby_level[property] = groupBy(
          orderBy(
            question_answer_groupby_level[property],
            ["question_index"],
            ["asc"]
          ).map((v) => omit(v, ["question_index"])),
          "level_index"
        );
      }
      for (let property in question_answer_groupby_level) {
        for (let pr in question_answer_groupby_level[property]) {
          question_answer_groupby_level[property][pr] =
            question_answer_groupby_level[property][pr].filter(
              (v) => v.question
            ).length > 0
              ? question_answer_groupby_level[property][pr]
              : [];
        }
      }

      finalReport.push({
        question_answer_groupby_level: question_answer_groupby_level,
        submission_status: getSubmission ? getSubmission.status : null,
        submission_assign_level_id: getSubmission
          ? getSubmission.assigned_level_id
          : null,
        submission_created_at: getSubmission.created_at,
        submission_updated_at: getSubmission.updated_at,
      });
      return res.json({
        data: finalReport,
      });
    } catch (error) {
      logger.error({
        error: error,
        msg: req_api_name + " | " + "QUERY_FAILED",
      });
      return next(error);
    }
  }

  async getDetailedLastPracticeSubmission(req, res, next) {
    const req_api_name = req.id + "_" + req.url.split("/")[1];
    let { body, params } = req;
    try {
      let report = [];
      let finalReport = [];
      let question_answer_groupby_level = [];

      logger.debug({
        msg: req_api_name + " | " + "QUERY_EXECUTION",
      });

      let getSubmission = await practiceTestSubmissionService.getOneWhere({
        created_by: params.user_id,
      });
      let questionQuery = {};
      let isWhereIn = false;

      if (
        !req.query.isAll ||
        req.query.isAll == false ||
        req.query.learning_mode
      ) {
        logger.debug({
          msg: req_api_name + " | " + "QUERY_EXECUTION",
        });

        let studentCheck = await studentService.getOneWhere({
          user_id: params.user_id,
        });
        let modeCheck = req.query.learning_mode
          ? req.query.learning_mode
          : studentCheck && studentCheck.student_learning_mode_id;
        let math_operation_ids =
          modeCheck == STUDENT_LEARNING_MODE["MUL_DIV"]
            ? [MATH_OPERATION["MULTIPLICATION"], MATH_OPERATION["DIVISION"]]
            : [MATH_OPERATION["ADDITION"], MATH_OPERATION["SUBTRACTION"]];
        questionQuery.math_operation_id = math_operation_ids;
        isWhereIn = true;
      }

      logger.debug({
        msg: req_api_name + " | " + "QUERY_EXECUTION",
      });

      let questions =
        req.query.type !== "attempted"
          ? await levelService.getAllPracticeQuestionWhere(
              questionQuery,
              isWhereIn,
              "order by math_operation_id asc"
            )
          : await practiceTestAnswerService.getDataBySubmisionQuery(
              params.user_id,
              req.query.learning_mode,
              questionQuery.math_operation_id
            );

      for (let i in questions) {
        let is_attempted = false;
        let is_correct = 0;
        let retry_count = 0;
        let time_taken_in_second = 0;
        let answer = 0;

        if (req.query.type == "attempted") {
          is_attempted = true;
          is_correct = questions[i]["is_correct"];
          retry_count = questions[i]["retry_count"];
          time_taken_in_second = questions[i]["time_taken_in_secs"];
          answer = questions[i]["answer"];
        } else {
          logger.debug({
            msg: req_api_name + " | " + "QUERY_EXECUTION",
          });
          let answers = getSubmission
            ? await practiceTestAnswerService.getAnswersByUserSubmissions(
                params.user_id,
                questions[i]["id"],
                getSubmission.id
              )
            : [];
          answer = answers.length > 0 ? answers[0]["answer"] : answer;
          is_attempted = answers.length > 0 ? true : is_attempted;
          is_correct =
            answers.length > 0 ? answers[0]["is_correct"] : is_correct;
          retry_count =
            answers.length > 0 ? answers[0]["retry_count"] : retry_count;
          time_taken_in_second =
            answers.length > 0
              ? answers[0]["time_taken_in_secs"]
              : time_taken_in_second;
        }

        question_answer_groupby_level.push({
          question: questions[i]["title"],
          question_id: questions[i]["id"],
          math_operation_id: questions[i]["math_operation_id"],
          math_operation: questions[i]["math_operation"],
          correct_answer: questions[i]["correct_answer"],
          level_id: questions[i]["level_id"],
          level_title: questions[i]["level_title"],
          level_index: questions[i]["level_index"],
          question_index: questions[i]["question_index"],
          submission_id: questions[i]["placement_test_submissions_statuses"],
          answer: answer,
          is_attempted: is_attempted,
          is_correct: is_correct,
          retry_count: retry_count,
          time_taken_in_second: time_taken_in_second,
        });
      }

      question_answer_groupby_level = orderBy(
        question_answer_groupby_level,
        ["level_index"],
        ["asc"]
      );
      question_answer_groupby_level = groupBy(
        question_answer_groupby_level,
        "math_operation"
      );
      for (let property in question_answer_groupby_level) {
        question_answer_groupby_level[property] = groupBy(
          orderBy(
            question_answer_groupby_level[property],
            ["question_index"],
            ["asc"]
          ).map((v) => omit(v, ["question_index"])),
          "level_index"
        );
      }
      for (let property in question_answer_groupby_level) {
        for (let pr in question_answer_groupby_level[property]) {
          question_answer_groupby_level[property][pr] =
            question_answer_groupby_level[property][pr].filter(
              (v) => v.question
            ).length > 0
              ? question_answer_groupby_level[property][pr]
              : [];
        }
      }

      finalReport.push({
        question_answer_groupby_level: question_answer_groupby_level,
        submission_status: getSubmission ? getSubmission.status : null,
        submission_assign_level_id: getSubmission
          ? getSubmission.assigned_level_id
          : null,
      });
      return res.json({
        data: finalReport,
      });
    } catch (error) {
      logger.error({
        error: error,
        msg: req_api_name + " | " + "QUERY_FAILED",
      });
      return next(error);
    }
  }

  async getLevelLifterQuestion(req, res, next) {
    const req_api_name = req.id + "_" + req.url.split("/")[1];
    let { body, params } = req;
    try {
      let report = [];
      let finalReport = [];
      let question_answer_groupby_level = [];
      logger.debug({
        msg: req_api_name + " | " + "QUERY_EXECUTION",
      });
      let getSubmission =
        req.query.type == "attempted" && req.query.user_id
          ? await levelLifterTestSubmissionService.getOneWhere({
              created_by: req.query.user_id,
              learning_mode_id: req.query.learning_mode
                ? req.query.learning_mode
                : req.user.profile.student_learning_mode_id,
            })
          : await levelLifterTestSubmissionService.getOneWhere({
              created_by: req.user.id,
            });
      let questionQuery = {};
      let isWhereIn = false;
      let studentLevel = {};

      questionQuery.level_lifter_test_submission_id = getSubmission
        ? getSubmission.id
        : null;

      if (
        !req.query.isAll ||
        req.query.isAll == false ||
        req.query.learning_mode
        // req.query.
      ) {
        logger.debug({
          msg: req_api_name + " | " + "QUERY_EXECUTION",
        });

        let studentCheck =
          req.query.type == "attempted" && req.query.user_id
            ? await studentService.getOneWhere({
                user_id: req.query.user_id,
              })
            : await studentService.getOneWhere({
                user_id: req.user.id,
              });

        questionQuery.id = studentCheck.user_id;

        if (!studentCheck) throw new Error(STUDENT_NOT_FOUND);

        let level_index = req.query.learning_mode
          ? req.query.learning_mode
          : studentCheck.student_learning_mode_id === 1
          ? studentCheck.add_sub_level_id
          : studentCheck.mul_div_level_id;

        logger.debug({
          msg: req_api_name + " | " + "QUERY_EXECUTION",
        });

        if (level_index === "12") {
          level_index = "11";
        }
        let level = await levelService.getOneWhere({
          level_index,
          learning_mode_id: req.query.learning_mode
            ? req.query.learning_mode
            : studentCheck.student_learning_mode_id,
        });

        logger.debug({
          msg: req_api_name + " | " + "QUERY_EXECUTION",
        });

        let levelModel = await levelLearningModeRelationService.getOneWhere({
          level_id: level.id,
          learning_mode_id: req.query.learning_mode
            ? req.query.learning_mode
            : studentCheck.student_learning_mode_id,
        });
        // console.log(levelModel);

        let modeCheck = req.query.learning_mode
          ? req.query.learning_mode
          : studentCheck && studentCheck.student_learning_mode_id;

        let math_operation_ids =
          modeCheck == STUDENT_LEARNING_MODE["MUL_DIV"]
            ? [MATH_OPERATION["MULTIPLICATION"] || MATH_OPERATION["DIVISION"]]
            : [MATH_OPERATION["ADDITION"] || MATH_OPERATION["SUBTRACTION"]];
        questionQuery.math_operation_id = math_operation_ids;
        let levelCheck = req.query.stuents_level
          ? [studentCheck.mul_div_level_id]
          : [studentCheck.add_sub_level_id];
        questionQuery.learing_level_relation_id = level.id;
        isWhereIn = true;
      }
      logger.debug({
        msg: req_api_name + " | " + "QUERY_EXECUTION",
      });
      let questions =
        req.query.type !== "attempted"
          ? await levelLifterTestQuestionLevelRelationService.getMapQuestion(
              questionQuery,
              isWhereIn,
              "order by math_operation_id asc"
            )
          : await levelLefiterTestAnswerService.getDataBySubmisionQuery(
              questionQuery.id,
              req.query.learning_mode,
              questionQuery.level_lifter_test_submission_id
            );

      for (let i in questions) {
        let is_attempted = false;
        let is_correct = 0;
        let retry_count = 0;
        let time_taken_in_second = 0;
        let answer = 0;

        if (req.query.type == "attempted") {
          is_attempted = true;
          is_correct = questions[i]["is_correct"];
          retry_count = questions[i]["retry_count"];
          time_taken_in_second = questions[i]["time_taken_in_secs"];
          answer = questions[i]["answer"];
        } else {
          logger.debug({
            msg: req_api_name + " | " + "QUERY_EXECUTION",
          });
          let answers = getSubmission
            ? await levelLefiterTestAnswerService.getAnswersByUserSubmissions(
                req.user.id,
                questions[i]["id"],
                getSubmission.id
              )
            : [];
          answer = answers.length > 0 ? answers[0]["answer"] : answer;
          is_attempted = answers.length > 0 ? true : is_attempted;
          is_correct =
            answers.length > 0 ? answers[0]["is_correct"] : is_correct;
          retry_count =
            answers.length > 0 ? answers[0]["retry_count"] : retry_count;
          time_taken_in_second =
            answers.length > 0
              ? answers[0]["time_taken_in_secs"]
              : time_taken_in_second;
        }

        questions[i].answer = answer;
        questions[i].is_attempted = is_attempted;
        questions[i].is_correct = is_correct;
        questions[i].retry_count = retry_count;
        questions[i].time_taken_in_second = time_taken_in_second;
      }

      questions = orderBy(questions, ["math_operation_id"], ["asc"]);

      questions = groupBy(questions, "math_operation");

      // for (let property in questions) {
      //   questions[property] = groupBy(
      //     orderBy(
      //       questions[property],
      //       ["question_index"],
      //       ["asc"]
      //     ).map((v) => omit(v, ["question_index"])),
      //     "level_index"
      //   );
      // }
      // console.log("questoin ::", questions);

      for (let property in question_answer_groupby_level) {
        for (let pr in question_answer_groupby_level[property]) {
          question_answer_groupby_level[property][pr] =
            question_answer_groupby_level[property][pr].filter(
              (v) => v.question
            ).length > 0
              ? question_answer_groupby_level[property][pr]
              : [];
        }
      }

      finalReport.push({
        questions: questions,
      });
      return res.json({
        data: {
          questions: questions,
          assigned_level_id: getSubmission.assigned_level_id,
          submission_created_at: getSubmission.created_at,
          submission_updated_at: getSubmission.updated_at,
        },
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
    // let { getOneWhere, remove, update } = userService;

    try {
      /**
       * Check valid  user
       */
      logger.debug({
        msg: req_api_name + " | " + "QUERY_EXECUTION",
      });
      let userExist = await userService.getOneWhere({
        id: params.user_id,
      });

      if (!userExist) throw new Error(USER_NOT_FOUND);
      if (userExist.role_id === USER_ROLES["TEACHER"]) {
        logger.debug({
          msg: req_api_name + " | " + "QUERY_EXECUTION",
        });
        let studentExist = await userService.getOneWhere({
          class_code: userExist.class_code,
          role: "student",
        });

        if (!studentExist) throw new Error(STUDENT_EXIST_IN_CLASS);
      }
      // console.log(userExist);
      /**
       * Delete  user
       */
      logger.debug({
        msg: req_api_name + " | " + "QUERY_EXECUTION",
      });
      let userRemove = await userService.remove({
        id: params.user_id,
      });

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

  /**
   * Delete  question
   * @param req
   * @param res
   * @returns {Promise<*>}
   */
  async removeMultiple(req, res, next) {
    const req_api_name = req.id + "_" + req.url.split("/")[1];
    let { params } = req;
    // let { getOneWhere, remove, update } = userService;

    try {
      const user_ids = params.user_ids.split(",");
      for (let i in user_ids) {
        /**
         * Delete  user
         */
        logger.debug({
          msg: req_api_name + " | " + "QUERY_EXECUTION",
        });
        let usersRemove = await userService.remove({
          id: user_ids[i],
        });
      }
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

module.exports = new userController();
