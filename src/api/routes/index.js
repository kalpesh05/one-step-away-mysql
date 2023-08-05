const express = require("express");
const app = express();
const router = express.Router();
const passport = require("passport");
const controller = require("../controllers");
const { apiAuth, validation } = require("../middlewares");
// Routes list
const routes = [
  // Auth
  {
    method: "POST",
    path: "/register",
    handler: "AuthController.register",
  },
  {
    method: "post",
    path: "/sign-in-with-google",
    handler: "AuthController.google",
  },
  {
    method: "POST",
    path: "/login",
    handler: "AuthController.login",
  },
  {
    method: "POST",
    path: "/student-login",
    handler: "AuthController.studentLogin",
  },
  {
    method: "GET",
    path: "/logout",
    handler: "AuthController.logout",
    authenticate: true,
  },
  {
    method: "POST",
    path: "/forgot-password",
    handler: "AuthController.forgotPassword",
  },
  {
    method: "POST",
    path: "/reset-password",
    handler: "AuthController.resetPassword",
  },
  {
    method: "GET",
    path: "/user-profile",
    handler: "AuthController.getMyDetail",
    authenticate: true,
  },
  {
    method: "PUT",
    path: "/user-profile",
    handler: "AuthController.updateDetail",
    authenticate: true,
  },
  // user
  {
    method: "GET",
    path: "/users",
    handler: "UserController.getAllUsers",
    authenticate: true,
  },
  {
    method: "GET",
    path: "/teacher",
    handler: "UserController.getAllStudentsByTeacher",
    authenticate: true,
  },
  {
    method: "GET",
    path: "/users/classes",
    handler: "UserController.getClasses",
    authenticate: true,
  },
  {
    method: "POST",
    path: "/users",
    handler: "UserController.create",
    authenticate: true,
  },
  {
    method: "POST",
    path: "/users/students",
    handler: "UserController.createAll",
    authenticate: true,
  },
  {
    method: "GET",
    path: "/users/:user_id",
    handler: "UserController.getOne",
    authenticate: true,
  },
  {
    method: "PUT",
    path: "/user/:user_id",
    handler: "UserController.update",
    authenticate: true,
  },
  {
    method: "PUT",
    path: "/users/:user_ids",
    handler: "UserController.updateMultiple",
    authenticate: true,
  },
  {
    method: "DELETE",
    path: "/user/:user_id",
    handler: "UserController.remove",
    authenticate: true,
  },
  {
    method: "DELETE",
    path: "/users/:user_ids",
    handler: "UserController.removeMultiple",
    authenticate: true,
  },
  {
    method: "GET",
    path: "/users/:user_id/get-detailed-last-submission",
    handler: "UserController.getDetailedLastSubmission",
    authenticate: true,
  },
  {
    method: "GET",
    path: "/test/get-level-lifter-questions",
    handler: "UserController.getLevelLifterQuestion",
    authenticate: true,
  },
  {
    method: "GET",
    path: "/users/:user_id/get-detailed-last-practice-submission",
    handler: "UserController.getDetailedLastPracticeSubmission",
    authenticate: true,
  },
  // role
  {
    method: "GET",
    path: "/role",
    handler: "RoleController.getAllRoles",
    authenticate: true,
  },
  {
    method: "POST",
    path: "/roles",
    handler: "RoleController.create",
    authenticate: true,
  },
  {
    method: "GET",
    path: "/roles/:role_id",
    handler: "RoleController.getOne",
    authenticate: true,
  },
  {
    method: "PUT",
    path: "/roles/:role_id",
    handler: "RoleController.update",
    authenticate: true,
  },
  {
    method: "DELETE",
    path: "/roles/:user_id",
    handler: "RoleController.remove",
    authenticate: true,
  },
  // role
  {
    method: "GET",
    path: "/sessions",
    handler: "SessionController.getAllSessions",
    authenticate: true,
  },
  {
    method: "GET",
    path: "/user/sessions",
    handler: "SessionController.getAllSessionsWithUser",
    authenticate: true,
  },
  {
    method: "POST",
    path: "/session",
    handler: "SessionController.create",
    authenticate: true,
  },
  {
    method: "GET",
    path: "/session/:session_id",
    handler: "SessionController.getOne",
    authenticate: true,
  },
  {
    method: "PUT",
    path: "/session/:session_id",
    handler: "SessionController.update",
    authenticate: true,
  },
  {
    method: "DELETE",
    path: "/session/:session_id",
    handler: "SessionController.remove",
    authenticate: true,
  },
  // student learning mode
  {
    method: "GET",
    path: "/studentlearingmodes",
    handler: "StudentLearingModeController.getAllStudentLearingModes",
    authenticate: true,
  },
  {
    method: "POST",
    path: "/studentlearingmodes",
    handler: "StudentLearingModeController.create",
    authenticate: true,
  },
  {
    method: "GET",
    path: "/studentlearingmodes/:studentlearingmode_id",
    handler: "StudentLearingModeController.getOne",
    authenticate: true,
  },
  {
    method: "PUT",
    path: "/studentlearingmodes/:studentlearingmode_id",
    handler: "StudentLearingModeController.update",
    authenticate: true,
  },
  {
    method: "DELETE",
    path: "/studentlearingmodes/:studentlearingmode_id",
    handler: "StudentLearingModeController.remove",
    authenticate: true,
  },

  // math operation
  {
    method: "GET",
    path: "/mathoperations",
    handler: "MathOperationController.getAllMathOperations",
    authenticate: true,
  },
  {
    method: "POST",
    path: "/mathoperations",
    handler: "MathOperationController.create",
    authenticate: true,
  },
  {
    method: "GET",
    path: "/mathoperations/:mathoperation_id",
    handler: "MathOperationController.getOne",
    authenticate: true,
  },
  {
    method: "PUT",
    path: "/mathoperations/:mathoperation_id",
    handler: "MathOperationController.update",
    authenticate: true,
  },
  {
    method: "DELETE",
    path: "/mathoperations/:mathoperation_id",
    handler: "MathOperationController.remove",
    authenticate: true,
  },
  // placement-levels
  {
    method: "GET",
    path: "/placement-levels",
    handler: "PlacementTestLevelController.getAllLevels",
    authenticate: true,
  },
  {
    method: "POST",
    path: "/placement-levels",
    handler: "PlacementTestLevelController.create",
    authenticate: true,
  },
  {
    method: "GET",
    path: "/placement-levels/:level_id",
    handler: "PlacementTestLevelController.getOne",
    authenticate: true,
  },
  {
    method: "PUT",
    path: "/placement-levels/:level_id",
    handler: "PlacementTestLevelController.update",
    authenticate: true,
  },
  {
    method: "DELETE",
    path: "/placement-levels/:level_id",
    handler: "PlacementTestLevelController.remove",
    authenticate: true,
  },
  // level-lefiter-levels
  {
    method: "GET",
    path: "/level-lifter-levels",
    handler: "LevelLifterTestLevelController.getAllLevels",
    authenticate: true,
  },
  {
    method: "POST",
    path: "/level-lifter-levels",
    handler: "LevelLifterTestLevelController.create",
    authenticate: true,
  },
  {
    method: "GET",
    path: "/level-lifter-levels/:level_id",
    handler: "LevelLifterTestLevelController.getOne",
    authenticate: true,
  },
  {
    method: "PUT",
    path: "/level-lifter-levels/:level_id",
    handler: "LevelLifterTestLevelController.update",
    authenticate: true,
  },
  {
    method: "DELETE",
    path: "/level-lifter-levels/:level_id",
    handler: "LevelLifterTestLevelController.remove",
    authenticate: true,
  },
  // levels
  {
    method: "GET",
    path: "/levels",
    handler: "LevelController.getAllLevels",
    authenticate: true,
  },
  {
    method: "POST",
    path: "/levels",
    handler: "LevelController.create",
    authenticate: true,
  },
  {
    method: "POST",
    path: "/levels-learning-mode-map",
    handler: "LevelController.levelMap",
    authenticate: true,
  },
  {
    method: "GET",
    path: "/levels/:level_id",
    handler: "LevelController.getOne",
    authenticate: true,
  },
  {
    method: "PUT",
    path: "/levels/:level_id",
    handler: "LevelController.update",
    authenticate: true,
  },
  {
    method: "DELETE",
    path: "/levels/:level_id",
    handler: "LevelController.remove",
    authenticate: true,
  },
  // classes
  {
    method: "GET",
    path: "/classes",
    handler: "ClassController.getAll",
    authenticate: true,
  },
  {
    method: "POST",
    path: "/classes",
    handler: "ClassController.create",
    authenticate: true,
  },
  {
    method: "GET",
    path: "/classes/:class_id",
    handler: "ClassController.getOne",
    authenticate: true,
  },
  {
    method: "GET",
    path: "/teacher/classes",
    handler: "ClassController.getAllClassesByteacher",
    authenticate: true,
  },
  {
    method: "PUT",
    path: "/classes/:class_id",
    handler: "ClassController.update",
    authenticate: true,
  },
  {
    method: "DELETE",
    path: "/classes/:class_id",
    handler: "ClassController.remove",
    authenticate: true,
  },
  // question
  {
    method: "GET",
    path: "/questions",
    handler: "QuestionController.getAllQuestions",
    authenticate: true,
  },
  {
    method: "POST",
    path: "/questions",
    handler: "QuestionController.create",
    authenticate: true,
  },
  {
    method: "GET",
    path: "/questions/:question_id",
    handler: "QuestionController.getOne",
    authenticate: true,
  },
  {
    method: "PUT",
    path: "/questions/:question_id",
    handler: "QuestionController.update",
    authenticate: true,
  },
  {
    method: "DELETE",
    path: "/questions/:question_id",
    handler: "QuestionController.remove",
    authenticate: true,
  },
  // level lifter question
  {
    method: "GET",
    path: "/level-lifter-test-questions",
    handler: "LevelLifterTestQuestionController.getAllQuestions",
    authenticate: true,
  },
  {
    method: "POST",
    path: "/level-lifter-test-questions",
    handler: "LevelLifterTestQuestionController.create",
    authenticate: true,
  },
  {
    method: "POST",
    path: "/level-lifter-test-questions/map",
    handler: "LevelLifterTestQuestionController.questionMap",
    authenticate: true,
  },
  {
    method: "GET",
    path: "/mapped-level-lifter-test-questions/:level_id",
    handler: "LevelLifterTestQuestionController.getMapQuestion",
    authenticate: true,
  },
  {
    method: "GET",
    path: "/level-lifter-test-questions/:question_id",
    handler: "LevelLifterTestQuestionController.getOne",
    authenticate: true,
  },
  {
    method: "PUT",
    path: "/level-lifter-test-questions/:question_id",
    handler: "LevelLifterTestQuestionController.update",
    authenticate: true,
  },
  {
    method: "DELETE",
    path: "/level-lifter-test-questions/:question_id",
    handler: "LevelLifterTestQuestionController.remove",
    authenticate: true,
  },
  // question
  {
    method: "GET",
    path: "/practice-test-questions",
    handler: "practiceTestQuestionController.getAllQuestions",
    authenticate: true,
  },
  {
    method: "POST",
    path: "/practice-test-questions",
    handler: "practiceTestQuestionController.create",
    authenticate: true,
  },
  {
    method: "POST",
    path: "/practice-test-questions/map",
    handler: "practiceTestQuestionController.questionMap",
    authenticate: true,
  },
  {
    method: "GET",
    path: "/mapped-practice-test-questions/:level_id/:strategy_id",
    handler: "practiceTestQuestionController.getMapQuestion",
    authenticate: true,
  },
  {
    method: "GET",
    path: "/practice-test-questions/:question_id",
    handler: "practiceTestQuestionController.getOne",
    authenticate: true,
  },
  {
    method: "PUT",
    path: "/practice-test-questions/:question_id",
    handler: "practiceTestQuestionController.update",
    authenticate: true,
  },
  {
    method: "DELETE",
    path: "/practice-test-questions/:question_id",
    handler: "practiceTestQuestionController.remove",
    authenticate: true,
  },
  // placement test submission status
  {
    method: "GET",
    path: "/placementtestsubmissionstatuses",
    handler:
      "PlacementTestSubmissionStatusesController.getAllplacementTestSubmissionStatuses",
    authenticate: true,
  },
  {
    method: "POST",
    path: "/placementtestsubmissionstatuses",
    handler: "PlacementTestSubmissionStatusesController.create",
    authenticate: true,
  },
  {
    method: "GET",
    path: "/placementtestsubmissionstatuses/:placementtestsubmissionstatus_id",
    handler: "PlacementTestSubmissionStatusesController.getOne",
    authenticate: true,
  },
  {
    method: "PUT",
    path: "/placementtestsubmissionstatuses/:placementtestsubmissionstatus_id",
    handler: "PlacementTestSubmissionStatusesController.update",
    authenticate: true,
  },
  {
    method: "DELETE",
    path: "/placementtestsubmissionstatuses/:placementtestsubmissionstatus_id",
    handler: "PlacementTestSubmissionStatusesController.remove",
    authenticate: true,
  },
  // levellifter test submission
  {
    method: "GET",
    path: "/levelliftertestsubmissions",
    handler:
      "LevelLifterTestSubmissionController.getAllLevelLifterTestSubmissions",
    authenticate: true,
  },
  {
    method: "GET",
    path: "/levelliftertestsubmissionscount",
    handler:
      "LevelLifterTestSubmissionController.getAllLevelLifterTestSubmissionsCount",
    authenticate: true,
  },
  {
    method: "POST",
    path: "/levelliftertestsubmissions",
    handler: "LevelLifterTestSubmissionController.create",
    authenticate: true,
  },
  {
    method: "GET",
    path: "/levelliftertestsubmissions/:levelliftertestsubmission_id",
    handler: "LevelLifterTestSubmissionController.getOne",
    authenticate: true,
  },
  {
    method: "PUT",
    path: "/levelliftertestsubmissions/:levelliftertestsubmission_id",
    handler: "LevelLifterTestSubmissionController.update",
    authenticate: true,
  },
  {
    method: "DELETE",
    path: "/levelliftertestsubmissions/:levelliftertestsubmission_id",
    handler: "LevelLifterTestSubmissionController.remove",
    authenticate: true,
  },
  // placement test submission
  {
    method: "GET",
    path: "/placementtestsubmissions",
    handler: "PlacementTestSubmissionController.getAllPlacementTestSubmissions",
    authenticate: true,
  },
  {
    method: "POST",
    path: "/placementtestsubmissions",
    handler: "PlacementTestSubmissionController.create",
    authenticate: true,
  },
  {
    method: "GET",
    path: "/placementtestsubmissions/:placementtestsubmission_id",
    handler: "PlacementTestSubmissionController.getOne",
    authenticate: true,
  },
  {
    method: "PUT",
    path: "/placementtestsubmissions/:placementtestsubmission_id",
    handler: "PlacementTestSubmissionController.update",
    authenticate: true,
  },
  {
    method: "DELETE",
    path: "/placementtestsubmissions/:placementtestsubmission_id",
    handler: "PlacementTestSubmissionController.remove",
    authenticate: true,
  },
  // level lefiter test submission status
  {
    method: "GET",
    path: "/levellefitertestsubmissionstatuses",
    handler:
      "LevelLifterTestSubmissionStatusesController.getAlllevelLifterTestSubmissionStatuses",
    authenticate: true,
  },
  {
    method: "POST",
    path: "/levellefitertestsubmissionstatuses",
    handler: "LevelLifterTestSubmissionStatusesController.create",
    authenticate: true,
  },
  {
    method: "GET",
    path: "/levellefitertestsubmissionstatuses/:levelliftertestsubmissionstatus_id",
    handler: "LevelLifterTestSubmissionStatusesController.getOne",
    authenticate: true,
  },
  {
    method: "PUT",
    path: "/levellefitertestsubmissionstatuses/:levelliftertestsubmissionstatus_id",
    handler: "LevelLifterTestSubmissionStatusesController.update",
    authenticate: true,
  },
  {
    method: "DELETE",
    path: "/levellefitertestsubmissionstatuses/:levelliftertestsubmissionstatus_id",
    handler: "LevelLifterTestSubmissionStatusesController.remove",
    authenticate: true,
  },
  // practice test submission
  {
    method: "GET",
    path: "/practicetestsubmissions",
    handler: "PracticeTestSubmissionController.getAllPracticeTestSubmissions",
    authenticate: true,
  },
  {
    method: "POST",
    path: "/practicetestsubmissions",
    handler: "PracticeTestSubmissionController.create",
    authenticate: true,
  },
  {
    method: "GET",
    path: "/practicetestsubmissions/:practice_test_submission_id",
    handler: "PracticeTestSubmissionController.getOne",
    authenticate: true,
  },
  {
    method: "PUT",
    path: "/practicetestsubmissions/:practice_test_submission_id",
    handler: "PracticeTestSubmissionController.update",
    authenticate: true,
  },
  {
    method: "DELETE",
    path: "/practicetestsubmissions/:practice_test_submission_id",
    handler: "PracticeTestSubmissionController.remove",
    authenticate: true,
  },
  // answer
  {
    method: "POST",
    path: "/answers",
    handler: "AnswerController.create",
    authenticate: true,
  },
  {
    method: "GET",
    path: "/answers",
    handler: "AnswerController.getAll",
    authenticate: true,
  },
  {
    method: "GET",
    path: "/answers/:answer_id",
    handler: "AnswerController.getOne",
    authenticate: true,
  },
  {
    method: "PUT",
    path: "/answers/:answer_id",
    handler: "AnswerController.update",
    authenticate: true,
  },
  {
    method: "DELETE",
    path: "/answers/:answer_id",
    handler: "AnswerController.remove",
    authenticate: true,
  },
  // level lifter test answer
  {
    method: "POST",
    path: "/level-lifter-test-answer",
    handler: "LevelLifterTestAnswerController.create",
    authenticate: true,
  },
  {
    method: "GET",
    path: "/level-lifter-test-answer",
    handler: "LevelLifterTestAnswerController.getAll",
    authenticate: true,
  },
  {
    method: "GET",
    path: "/level-lifter-test-answer/:answer_id",
    handler: "LevelLifterTestAnswerController.getOne",
    authenticate: true,
  },
  {
    method: "PUT",
    path: "/level-lifter-test-answer/:answer_id",
    handler: "LevelLifterTestAnswerController.update",
    authenticate: true,
  },
  {
    method: "DELETE",
    path: "/level-lifter-test-answer/:answer_id",
    handler: "LevelLifterTestAnswerController.remove",
    authenticate: true,
  },
  // answer
  {
    method: "POST",
    path: "/practicetestanswers",
    handler: "PracticeTestAnswerController.create",
    authenticate: true,
  },
  {
    method: "POST",
    path: "/batchpracticetestanswers",
    handler: "PracticeTestAnswerController.batchCreate",
    authenticate: true,
  },
  {
    method: "GET",
    path: "/practicetestanswers",
    handler: "PracticeTestAnswerController.getAll",
    authenticate: true,
  },
  {
    method: "GET",
    path: "/practicetestanswers/:practice_test_answer_id",
    handler: "PracticeTestAnswerController.getOne",
    authenticate: true,
  },
  {
    method: "PUT",
    path: "/practicetestanswers/:practice_test_answer_id",
    handler: "PracticeTestAnswerController.update",
    authenticate: true,
  },
  {
    method: "DELETE",
    path: "/practicetestanswers/:practice_test_answer_id",
    handler: "PracticeTestAnswerController.remove",
    authenticate: true,
  },
  // strategy
  {
    method: "POST",
    path: "/strategies",
    handler: "StrategiesController.create",
    authenticate: true,
  },
  {
    method: "POST",
    path: "/strategies-level-map",
    handler: "StrategiesController.levelMap",
    authenticate: true,
  },
  {
    method: "GET",
    path: "/strategies",
    handler: "StrategiesController.getAllStrategies",
    authenticate: true,
  },
  {
    method: "GET",
    path: "/strategies-by-user",
    handler: "StrategiesController.getAllStrategiesFromUserLevel",
    authenticate: true,
  },
  {
    method: "GET",
    path: "/strategies/:strategy_id",
    handler: "StrategiesController.getOne",
    authenticate: true,
  },
  {
    method: "PUT",
    path: "/strategies/:strategy_id",
    handler: "StrategiesController.update",
    authenticate: true,
  },
  {
    method: "DELETE",
    path: "/strategies-level-map/:strategies_level_relation",
    handler: "StrategiesController.strategiesLevelRelationremove",
    authenticate: true,
  },
  {
    method: "GET",
    path: "/strategies/questions/old/:strategy_slug",
    handler: "StrategiesController.getAllQuestionByStrategy",
    authenticate: true,
  },
  {
    method: "GET",
    path: "/strategies/questions/:strategy_slug",
    handler: "StrategiesController.getQuestionNew",
    authenticate: true,
  },
  // google Classes
  {
    method: "GET",
    path: "/google-classroom/import-classes",
    handler: "GoogleClassroomController.googleClassroomImportClasses",
    authenticate: true,
  },
  // practice question sets
  {
    method: "GET",
    path: "/set-practice-question-sets",
    handler: "AddPracticeQuestionSets.setAll",
    authenticate: true,
  },
];

// Applying routes
routes.forEach((route) => {
  const handler = route.handler.split(".");

  let middleware = [
    (req, res, next) => {
      next();
    },
  ];
  let validationMiddlware = (req, res, next) => {
    console.log("ss", req.body);
    console.log("handler::", handler);
    validation.validate(req.body, handler);
    next();
  };

  if (route.authenticate) {
    middleware.push(apiAuth);
    middleware.push(passport.authenticate("jwt", { session: false }));
  }

  // Validators
  if (!["get", "delete"].includes(route.method.toLowerCase())) {
    middleware.push(validationMiddlware);
  }
  // console.log(route.path, handler[0], handler[1]);
  router[route.method.toLowerCase()](
    route.path,
    ...middleware,
    controller[handler[0]][handler[1]]
  );
});

exports.router = router;
