/**
 * Common function
 */
const crypto = require("crypto");
const moment = require("moment-timezone");
const {
  MATH_OPERATION_SIGN,
  QUESTION_COUNT_CONFIG,
  USER_ROLES,
} = require("../api/constants/constans");
const configs = require("../configs");
const axios = require("axios");
const { uniq } = require("lodash");
exports.cryptoPassword = function (userSalt, password) {
  let salt = `${Math.round(new Date().valueOf() * Math.random())}`;

  if (userSalt) {
    salt = userSalt;
  }

  const newPassword = crypto
    .createHmac("sha1", salt)
    .update(password)
    .digest("hex");

  return {
    salt,
    password: newPassword,
  };
};

exports.randomString = function (length) {
  const token = crypto.randomBytes(length).toString("hex");

  return token;
};

exports.structuredWhere = function (where) {
  let condition = [];
  let filterdWhere = "";
  for (let i in Object.keys(where)) {
    condition.push(` ${Object.keys(where)[i]}="${Object.values(where)[i]}" `);
  }
  filterdWhere = condition.length > 0 ? condition.join("and") : filterdWhere;

  return filterdWhere;
};

exports.classCode = function () {
  return Math.floor(10000 + Math.random() * 90000);
};

exports.mongoId = function (model) {
  let token = crypto.randomBytes(12).toString("hex");

  switch (model) {
    case "classes":
      token = `cls_${token}`;
      break;

    case "user":
      token = `usr_${token}`;
      break;

    case "token":
      token = `tok_${token}`;
      break;

    case "teacher":
      token = `thr_${token}`;
      break;

    case "super_admin":
      token = `spa_${token}`;
      break;

    case "student_learning_mode":
      token = `stm_${token}`;
      break;

    case "students":
      token = `std_${token}`;
      break;

    case "math_operations":
      token = `mop_${token}`;
      break;

    case "levels":
      token = `lvl_${token}`;
      break;

    case "level_learning_mode_relation":
      token = `llr_${token}`;
      break;

    case "levle_lefiter_test_submission_statuses":
      token = `lss_${token}`;
      break;

    case "placement_test_levels":
      token = `plv_${token}`;
      break;

    case "levle_lefiter_test_levels":
      token = `llv_${token}`;
      break;

    case "levle_lefiter_test_questions":
      token = `lqu_${token}`;
      break;

    case "placement_test_questions":
      token = `que_${token}`;
      break;

    case "practice_test_questions":
      token = `pqu_${token}`;
      break;

    case "practice_questions_level_relation":
      token = `pql_${token}`;
      break;

    case "level_lifter_question_level_relation":
      token = `lql_${token}`;
      break;

    case "level_lifter_test_submission":
      token = `lls_${token}`;
      break;

    case "placement_test_submissions":
      token = `pts_${token}`;
      break;

    case "practice_test_submissions":
      token = `prs_${token}`;
      break;

    case "placement_test_submission_statuses":
      token = `pss_${token}`;
      break;

    case "level_lifter_test_answers":
      token = `lla_${token}`;
      break;

    case "practice_test_answers":
      token = `pra_${token}`;
      break;

    case "practice_test_answers":
      token = `pra_${token}`;
      break;

    case "strategies":
      token = `str_${token}`;
      break;

    case "strategies_level_relation":
      token = `slr_${token}`;
      break;

    case "strategies_question_relation":
      token = `sqr_${token}`;
      break;

    case "google_access_tokens":
      token = `gat_${token}`;
      break;

    case "students_session":
      token = `sse_${token}`;
      break;

    case "strategy_visit_journey":
      token = `svj_${token}`;
      break;

    default:
      token = token;
      break;
  }

  return token;
};

exports.addTime = function (time, type) {
  const date = new Date(Date.parse(moment().add(time, type)));

  return date;
};

exports.shuffleFisherYates = (array) => {
  let i = array.length;
  while (i--) {
    const ri = Math.floor(Math.random() * (i + 1));
    [array[i], array[ri]] = [array[ri], array[i]];
  }
  return array;
};

exports.shuffle = (array) => {
  var currentIndex = array.length,
    randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
};
exports.repeatElement = (element, count) => Array(count).fill(element);

const derangementNumber = (n) => {
  if (n == 0) {
    return 1;
  }
  var factorial = 1;
  while (n) {
    factorial *= n--;
  }
  return Math.floor(factorial / Math.E);
};

exports.derange = (array) => {
  array = array.slice();
  var mark = array.map(function () {
    return false;
  });
  for (var i = array.length - 1, u = array.length - 1; u > 0; i--) {
    if (!mark[i]) {
      var unmarked = mark
        .map(function (_, i) {
          return i;
        })
        .filter(function (j) {
          return !mark[j] && j < i;
        });
      var j = unmarked[Math.floor(Math.random() * unmarked.length)];

      var tmp = array[j];
      array[j] = array[i];
      array[i] = tmp;

      // this introduces the unbiased random characteristic
      if (
        Math.random() <
        (u * derangementNumber(u - 1)) / derangementNumber(u + 1)
      ) {
        mark[j] = true;
        u--;
      }
      u--;
    }
  }
  return array;
};

function random_item(items) {
  return items[Math.floor(Math.random() * items.length)];
}

exports.makeQuestionDeck = (
  array,
  currentLevel,
  currentLevelLength,
  previousLevelLength
) => {
  let hashSize = 6;
  let hash = [0, 0, 0, 0, 0, 0];
  let i = 0;
  // ans = [t];

  let t = random_item(array);
  // hash[t - 1] = 1;
  // hash[t.correct_answer - 1] = 1;
  let ans = [t];
  let q = 0;
  while (ans.length != configs.ENV.NO_QUESTION_IN_DECK) {
    // console.log('BEFORE', ans[ans.length - 1], previousLevelLength);

    if (
      ans.filter((v) => v.level_index < currentLevel).length ==
      previousLevelLength
    ) {
      array = array.filter((v) => v.level_index == currentLevel);
    }

    if (
      ans.filter((v) => v.level_index == currentLevel).length ==
      currentLevelLength
    ) {
      array = array.filter((v) => v.level_index < currentLevel);
    }
    t = random_item(array);
    // console.log('==============', t.id === ans[q].id);
    // for (i = 1; i < ans.length; i++) {
    // console.info(t.id, '==', ans[ans.length - 1].id);

    if (
      t.math_operation_id > 2
        ? Math.abs(t.correct_answer - ans[ans.length - 1].correct_answer) <= 2
        : t.id === ans[ans.length - 1].id
    ) {
      // console.log(
      //   t.id,
      //   '<===>',
      //   ans[ans.length - 1].id,
      //   'BEFORE'
      //   // array.filter(v => v.id !== t.id).map(v => v.id)
      // );
      t = random_item(array.filter((v) => v.id !== t.id));
    }

    // console.log('AFTER', t.id);

    //   // console.log(t.correct_answer == ans[i - 1].correct_answer);
    // }
    // console.log('AFTER', t.correct_answer, ans.length, previousLevelLength);

    ans.push(t);
    q++;
  }

  // for (i = 1; i < array.length; i++) {
  //   t = random_item(array);
  //   console.log(
  //     t.second_factor,
  //     ans[i - 1].second_factor,
  //     t.math_operation_id,
  //     t.correct_answer,
  //     ans[i - 1].correct_answer,
  //     ans.length,
  //     ans.filter(v => v.level_index == currentLevel).length,
  //     currentLevelLength,
  //     ans.filter(v => v.level_index < currentLevel).length,
  //     previousLevelLength,
  //     'deck',
  //     configs.ENV.NO_QUESTION_IN_DECK
  //   );
  //   if (
  //     ans.filter(v => v.level_index < currentLevel).length ==
  //     previousLevelLength
  //   ) {
  //     array = array.filter(v => v.level_index == currentLevel);
  //   }
  //   // while (
  //   //   t.id == ans[i - 1].id ||
  //   //   // hash[t.correct_answer - 1] >= hashSize
  //   //   (t.math_operation_id == 2
  //   //     ? Math.abs(t.correct_answer - ans[i - 1].correct_answer) <= 2
  //   //     : t.correct_answer === ans[i - 1].correct_answer)
  //   // ) {
  //   //   if (
  //   //     ans.filter(v => v.level_index < currentLevel).length ==
  //   //     previousLevelLength
  //   //   ) {
  //   //     array = array.filter(v => v.level_index == currentLevel);
  //   //   }
  //   //   t = random_item(array);
  //   //   console.log(
  //   //     'inside',
  //   //     ans.filter(v => v.level_index < currentLevel).length,
  //   //     previousLevelLength,
  //   //     'inside'
  //   //   );
  //   // }
  //   // console.log(t);
  //   // console.log(
  //   //   'outside',
  //   //   ans.filter(v => v.level_index < currentLevel).length,
  //   //   previousLevelLength,
  //   //   'outside'
  //   // );
  //   if (ans.length != configs.ENV.NO_QUESTION_IN_DECK) {
  //     ans.push(t);
  //   }
  //   hash[t - 1] += 1;
  // }

  return ans;
};

exports.calculateAnswer = (first_factor, second_factor, math_operation) => {
  // let op = math_operation;
  // console.log(
  // `${first_factor}${MATH_OPERATION_SIGN[math_operation]}${second_factor}`
  // );
  return eval(
    `${first_factor}${MATH_OPERATION_SIGN[math_operation]}${second_factor}`
  );
};

// calculation for question division according to weightage
exports.questionDivisionBasedOnWeight = (reamingQuestion, question) => {
  let normalQuestion = [];
  let impQuestion = [];
  let firstIntroduce = [];
  let impPer = 50;
  let normalPer = 20;
  let firtPerc = 30;

  // process of selecting number question based on weightage
  let highWeighage = question.filter((v) => v.weightage === 1);
  let firstIntroduceWeighage = question.filter(
    (v) => v.is_first_introduced == 1
  );
  let normalWeighage = question.filter((v) => v.weightage === 0);

  if (highWeighage.length === 0) {
    normalPer = normalPer + impPer;
    impPer = 0;
  }
  if (firstIntroduceWeighage.length === 0) {
    normalPer = normalPer + firtPerc;
    firtPerc = 0;
  }
  // made changes if normal question not existing
  if (normalWeighage.length === 0) {
    impPer = normalPer + impPer;
    normalPer = 0;
  }
  // console.log(impPer, firtPerc);
  let normalQuestionCount = Math.round((normalPer * reamingQuestion) / 100);
  let firstIntroduceCount = Math.round((firtPerc * reamingQuestion) / 100);
  let impQuestionCount = Math.round((impPer * reamingQuestion) / 100);

  // console.log(
  //   normalPer,
  //   firtPerc,
  //   impPer,
  //   impQuestionCount,
  //   firstIntroduceCount,
  //   normalQuestionCount,
  //   reamingQuestion,
  //   highWeighage.length,
  //   reamingQuestion,
  //   'imp',
  //   question.filter(v => v.weightage === 1).length
  // );

  // // made same length as impQuestionCount
  // if (highWeighage.length < impQuestionCount) {
  //   for (let i in highWeighage) {
  //     // check that newQuestion array must be require normal question count
  //     if (highWeighage.length <= impQuestionCount) {
  //       // push random order question
  //       highWeighage.push(
  //         highWeighage[
  //           Math.abs(Math.floor(Math.random() * highWeighage.length))
  //         ]
  //       );
  //     }
  //   }
  // }

  // process to fill normal question as requires normalQuestionCount
  if (normalQuestionCount > 0) {
    for (let i = 1; i <= normalQuestionCount; i++) {
      // console.log('normal loop', i, normalQuestionCount, normalQuestion.length);
      // push random order question
      normalQuestion.push(
        normalWeighage[
          Math.abs(Math.floor(Math.random() * normalWeighage.length))
        ]
      );
    }
  }
  // for (let i in normalWeighage) {
  //   // check that newQuestion array must be require normal question count
  //   if (normalQuestion.length < normalQuestionCount) {
  //     // push random order question
  //     normalQuestion.push(
  //       normalWeighage[
  //         Math.abs(Math.floor(Math.random() * normalQuestionCount))
  //       ]
  //     );
  //   }
  // }

  // process to fill normal question as requires impQuestionCount
  if (impQuestionCount > 0) {
    for (let i = 1; i <= impQuestionCount; i++) {
      // console.log('imp loop', i, impQuestion.length);

      // push random order question
      impQuestion.push(
        highWeighage[Math.abs(Math.floor(Math.random() * highWeighage.length))]
      );
    }
  }

  // process to fill normal question as requires impQuestionCount
  if (firstIntroduceCount > 0) {
    for (let i = 1; i <= firstIntroduceCount; i++) {
      // console.log('imp loop', i, impQuestion.length);

      // push random order question
      firstIntroduce.push(
        firstIntroduceWeighage[
          Math.abs(Math.floor(Math.random() * firstIntroduceWeighage.length))
        ]
      );
    }
  }
  // for (let i in highWeighage) {
  //   // check that newQuestion array must be require high weightage question count
  //   if (impQuestion.length < impQuestionCount) {
  //     // push random order question
  //     impQuestion.push(
  //       highWeighage[Math.abs(Math.floor(Math.random() * impQuestionCount))]
  //     );
  //   }
  // }

  return [...normalQuestion, ...impQuestion, ...firstIntroduce];
};

exports.studentPasswordList = [
  "add",
  "all",
  "apple",
  "bag",
  "ball",
  "barn",
  "bear",
  "bee",
  "bell",
  "best",
  "better",
  "bike",
  "bird",
  "blue",
  "boat",
  "book",
  "bow",
  "box",
  "brave",
  "bus",
  "camp",
  "cap",
  "car",
  "card",
  "care",
  "cart",
  "cat",
  "cats",
  "clap",
  "clay",
  "clean",
  "clock",
  "cloud",
  "code",
  "cone",
  "cook",
  "cool",
  "cork",
  "corn",
  "cute",
  "dance",
  "day",
  "days",
  "dog",
  "dogs",
  "drum",
  "drums",
  "duck",
  "ducks",
  "face",
  "fact",
  "farm",
  "farmer",
  "farms",
  "fast",
  "feet",
  "fish",
  "fix",
  "flash",
  "flip",
  "foot",
  "fox",
  "free",
  "frog",
  "frogs",
  "funny",
  "game",
  "games",
  "garden",
  "gate",
  "gates",
  "give",
  "glad",
  "glide",
  "goat",
  "goats",
  "gold",
  "good",
  "grand",
  "grape",
  "grapes",
  "grass",
  "great",
  "green",
  "grin",
  "hall",
  "hand",
  "hands",
  "hat",
  "hats",
  "head",
  "hen",
  "hero",
  "hill",
  "hills",
  "hop",
  "hope",
  "house",
  "inch",
  "joke",
  "jokes",
  "joy",
  "jump",
  "kid",
  "kids",
  "kind",
  "kite",
  "kites",
  "lake",
  "lakes",
  "land",
  "learn",
  "lime",
  "list",
  "luck",
  "lucky",
  "magnet",
  "many",
  "map",
  "maple",
  "maps",
  "math",
  "mile",
  "moon",
  "more",
  "morning",
  "music",
  "nest",
  "nice",
  "north",
  "oak",
  "page",
  "paper",
  "park",
  "parks",
  "pass",
  "pen",
  "penny",
  "pens",
  "pine",
  "pines",
  "plant",
  "play",
  "plum",
  "pond",
  "ponds",
  "pop",
  "print",
  "prize",
  "puppy",
  "rabbit",
  "race",
  "ranch",
  "red",
  "ride",
  "river",
  "robin",
  "room",
  "sand",
  "seed",
  "shape",
  "sheep",
  "shell",
  "shine",
  "ship",
  "shirt",
  "shoe",
  "silver",
  "sing",
  "skate",
  "sky",
  "sled",
  "smile",
  "snap",
  "snow",
  "soft",
  "song",
  "songs",
  "spin",
  "spot",
  "stamp",
  "start",
  "step",
  "stick",
  "straw",
  "strong",
  "sun",
  "sunny",
  "swim",
  "table",
  "tap",
  "team",
  "thank",
  "think",
  "tree",
  "trees",
  "try",
  "vote",
  "walk",
  "watch",
  "well",
  "west",
  "whale",
  "win",
  "wind",
  "wing",
  "wise",
  "wish",
  "wood",
  "yard",
  "yards",
  "year",
  "years",
  "zap",
  "zebra",
  "zip",
  "zoo",
];

exports.randomTwoDigitNumberGeneratior = () => {
  let randomNumber = Math.floor(Math.random() * 90 + 10);

  if (randomNumber === 69) {
    randomNumber = Math.floor(Math.random() * 90 + 10);
    console.log("random");
    return randomNumber;
  } else {
    return randomNumber;
  }
};

exports.createGoogleClassRoomStudent = (
  teacherUserId,
  firstName,
  lastName,
  classCode,
  userName,
  password,
  googleUserId,
  userId
) => {
  const studentProfile = {
    teacher_user_id: teacherUserId,
    is_imported_from_google: true,
    first_name: firstName,
    last_name: lastName,
    class_code: classCode,
    student_learning_mode_id: 1,
    session_time_limit: 15,
    auto_timeout_for_question: 10,
    max_retry_count_to_attempt_question: 1,
    max_timeout_correct_ans_secs: 4,
  };
  const user = {
    role_id: USER_ROLES.STUDENT,
    is_password_encrypted: false,
    id:userId,
    user_name: userName,
    password: password,
    class_code: classCode,
    google_user_id: googleUserId,
    profile: studentProfile,
  };

  return user;
};

exports.questioneckForNewStratergy = (
  questions,
  currentMode,
  currentLevel,
  length = null
) => {
  let t = random_item(questions);
  let ans = [t];
  // console.log(t.id)

  // console.log(QUESTION_COUNT_CONFIG[currentMode][currentLevel], ans)
  let finalLength = length
    ? length
    : QUESTION_COUNT_CONFIG[currentMode][currentLevel]["total"];
  while (ans.filter((v) => v).length != finalLength) {
    t = random_item(questions);
    // console.log(t.id)
    // if(ans.filter((v) => v.id === t.id).length > 0){
    switch (currentMode) {
      case "ADD_SUB":
        t = random_item(
          questions.filter((v) => ans.filter((a) => a.id === v.id).length === 0)
        );
        break;

      case "MUL_DIV":
        switch (currentLevel) {
          case "1":
            t = random_item(
              questions.filter(
                (v) => ans.filter((a) => a.id === v.id).length === 0
              )
            );
            break;

          case "2":
            t = random_item(
              questions.filter(
                (v) => ans.filter((a) => a.id === v.id).length === 0
              )
            );
            break;

          case "3":
            // console.log(ans.filter((v) => v).length)
            t = random_item(
              questions.filter(
                (v) =>
                  ans.filter((c) => c).filter((a) => a.id === v.id).length === 0
              )
            );
            break;

          default:
            t = random_item(
              questions.filter(
                (v) =>
                  ans.filter((c) => c).filter((a) => a.id === v.id).length === 0
              )
            );
            break;
        }
        break;
    }
    // }
    // console.log(t.id)

    // console.log('==============', t.id === ans[q].id);
    // for (i = 1; i < ans.length; i++) {
    // console.info(t.id, '==', ans[ans.length - 1].id);

    ans.push(t);
    // q++;
  }
  return ans;
};

exports.pickWeightWisQeuestionForMD = (
  questions,
  currentLevel,
  previsouCount,
  pickOnlyHighWeight,
  levelToExclude = []
) => {
  /**
   * Get all level index
   */
  let Lindex = [...Array(parseInt(currentLevel)).keys()];
  /**
   * adjustment question count to level wise
   */
  Lindex = Lindex.map((v, i) => {
    v = v + 1;
    return v;
  });
  /**
   * Make total of all question count
   */
  let totalWeightCount = Lindex.reduce((a, b) => a + b, 0);
  /**
   * Take percentage of each question
   */
  let individualQueperc = totalWeightCount / Lindex.length;
  /**
   * find how many question we need to pick
   */
  let levelWiseQuestion = Lindex.filter((v) => v != currentLevel).map((v) => {
    return Math.ceil(previsouCount * ((v * individualQueperc) / 100));
  });
  /**
   * decide equal part of total levles
   */
  let levelFromWhereTossHappen = levelWiseQuestion.length / 2;

  // console.log(totalWeightCount, individualQueperc, Lindex.filter((v) => v != currentLevel).map((v) => { return Math.ceil(QUESTION_COUNT_CONFIG[currentMode][currentLevel]["previousHighWeight"] * ((v * individualQueperc) / 100)); }))
  /**
   * array to get final question
   */
  let finalQue = [];
  /**
   * itteration count
   */
  let itteration = 1;

  /**
   * Process to pick questions untill requried question appeared
   */
  while (finalQue.filter((v) => v).length < previsouCount) {
    /**
     * rever loop of level and it's count
     */
    for (let pl = levelWiseQuestion.length; pl > 0; pl--) {
      /**
       * get level
       */
      let lv = parseInt(pl);
      /**
       * get current level question
       */
      let levelQuestions = pickOnlyHighWeight
        ? questions.filter((v) => v.level_index == lv && v.weightage)
        : questions.filter((v) => v.level_index == lv);
      // console.log(lv, "LV",)
      // console.log(itteration, "itteration", lv)
      /**
       * condition if it was second itteration , onot pick level 1 and 3 question
       */
      // if (itteration > 1) {
      //   levelQuestions = levelQuestions.filter((v) => v.weightage).length > 0 ? levelQuestions.filter((v) => v.weightage) : levelQuestions;
      //   levelWiseQuestion[pl - 1] = [4, 5].includes(lv) ? 0 : levelWiseQuestion[pl - 1];
      // }

      if (levelToExclude.length > 0) {
        // console.log(lv, levelToExclude)
        levelWiseQuestion[pl - 1] = levelToExclude.includes(lv)
          ? 0
          : levelWiseQuestion[pl - 1];
      }

      /**
       * declare toss , and logic to random flip it after 50%
       */
      let tossRes = 1;
      if (pl <= levelFromWhereTossHappen) {
        tossRes = Math.floor(Math.random() * 2);
      }
      // console.log(levelFromWhereTossHappen, levelQuestions.length, "levelFromWhereTossHappen", pl)
      // console.log(levelWiseQuestion[pl - 1], nextEQue.filter((v) => v.level_index === lv).length, tossRes, pl, "=================", nextEQue.filter((v) => v.level_index === lv).length)
      /**
       * each level quesion put in this array
       */
      let nextEQue = [];
      /**
       * if toss is 1 then need to do process
       */
      if (tossRes) {
        /**
         * conditon for when we need to travers and pick question
         */
        // console.log("--------------------", nextEQue.length, "------------------------------", 0 < levelWiseQuestion[pl - 1])
        while (
          finalQue.filter((v) => v).length < previsouCount &&
          nextEQue.filter((v) => v && v.level_index === lv).length <
            levelWiseQuestion[pl - 1]
        ) {
          // console.log("=89", tossRes)
          /**
           * randomise quesion
           */
          let q = random_item(levelQuestions);

          let questionToExclude = [
            ...nextEQue
              .filter(
                (v) =>
                  v &&
                  (v.id == q.id || v.correct_answer == q.correct_answer || v.id)
              )
              .map((v) => v.id),
            ...finalQue
              .filter(
                (v) =>
                  v &&
                  q &&
                  (v.id == q.id || v.correct_answer == q.correct_answer || v.id)
              )
              .map((v) => v.id),
          ];
          questionToExclude = uniq(questionToExclude);

          /**
           * exclude repeat question
           */
          if (q && questionToExclude.includes(q.id)) {
            // console.log(levelQuestions.filter((v) => !questionToExclude.map((s) => s.id).includes(v.id)).map((v) => v.id))
            q = random_item(
              levelQuestions.filter((v) => !questionToExclude.includes(v.id))
            );
          }

          // if(tossRes){
          if (q) {
            nextEQue.push(q);
          }

          if (finalQue.filter((v) => v).length < previsouCount) {
            break;
          }

          // }
          // console.log("////", nextEQue.filter((v) => v.level_index === lv).length, levelWiseQuestion[pl - 1])
        }
      }

      finalQue = [...finalQue, ...nextEQue];
    }

    itteration++;
  }
  // console.log(finalQue..length, previsouCount)

  return finalQue.filter((v) => v);
};
exports.random_item = random_item;
// exports.platFormLogging = (req, type) => {
//   let lgstart = process.hrtime();
//   let api = req.url.split('/')[1];
//   switch (type) {
//     case 'start':
//       let start = moment().format();
//       req.start_time = lgstart;
//       req.log.debug(req, ` | START TIME: ${start}`);
//       break;

//     case 'end':
//       let end = moment().format();
//       let lgend = process.hrtime(req.start_time);
//       req.log.debug(`${req.id}_${api} | END TIME: ${end}`);
//       req.log.debug(
//         `${req.id}_${api} | DURATION: %ds %dms`,
//         lgend[0],
//         lgend[1] / 1000000
//       );
//       break;
//   }
// };

function* splitNParts(num, parts) {
  let sumParts = 0;
  for (let i = 0; i < parts - 1; i++) {
    const pn = Math.ceil(Math.random() * (num - sumParts));
    yield pn;
    sumParts += pn;
  }
  yield num - sumParts;
}
exports.splitNParts = splitNParts;
