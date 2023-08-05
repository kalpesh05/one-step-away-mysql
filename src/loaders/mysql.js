const mysql = require("mysql");
const config = require("../configs");
const util = require("util");
const pino = require("pino");
const expressPino = require("express-pino-logger");
const sqlFormatter = require("sql-formatter");
const { compareSync } = require("bcryptjs");

global.db = mysql.createPool(config.DB_CONFIG);
db.getConnection((err, connection) => {
  if (err) {
    if (err.code === "PROTOCOL_CONNECTION_LOST") {
      console.error("Database connection was closed.");
    }
    if (err.code === "ER_CON_COUNT_ERROR") {
      console.error("Database has too many connections.");
    }
    if (err.code === "ECONNREFUSED") {
      console.error("Database connection was refused.");
    }
  }
  console.log(":: MySql Connectiopn done ::");
  if (connection) connection.release();
  return;
});

// Promisify for Node.js async/await.
//db.query = util.promisify(db.query).bind(db);
db.query = util.promisify(db.query);

// const prettifyQuery = (value) => {
//   // req.log.debug({ query: this.sql, msg: req_api_name + " | " + "QUERY_EXECUTION" });
//   return "\n------\n" + sqlFormatter.format(value) + "\n------\n";
// };
// const prettifyError = (value) => {
//   // req.log.error({ error: error, msg: req_api_name + " | " + "QUERY_FAILED" });

//   // req_api_name + " | " + "QUERY_FAILED: " + error;
//   return "\n------\n" + value + "\n------\n";
// };
// const prettifyReq = (value) => {
//   return value.id + " | " + value.method + " | " + value.url + "\n";
// };
// const prettifyRes = (value) => {
//   return value.statusCode + "\n";
// };
// const prettifyResponseTime = (value) => {
//   return value + "ms";
// };
// const logger = pino({
//   prettyPrint: {
//     crlf: false, // --crlf
//     errorLikeObjectKeys: ["err", "error"], // --errorLikeObjectKeys
//     errorProps: "", // --errorProps
//     levelFirst: false, // --levelFirst
//     messageKey: "msg", // --messageKey
//     timestampKey: "time", // --timestampKey
//     translateTime: "SYS:standard", // --translateTime
//     customPrettifiers: {
//       req: prettifyReq,
//       res: prettifyRes,
//       responseTime: prettifyResponseTime,
//       query: prettifyQuery,
//       error: prettifyError,
//     },
//   },
//   level: process.env.LOG_LEVEL || "info",
//   // level: "debug"
// });

module.exports = async () => {
  return db;
};

// exports.expressLogger = expressPino({ logger });

// exports.platFormLogging = (req, type) => {
//   let lgstart = process.hrtime();
//   let api = req.url.split("/")[2];
//   console.log(api);
//   switch (type) {
//     case "start":
//       let start = moment().format();
//       req.start_time = lgstart;
//       req.log.debug(`${req.id}_${api} | START TIME: ${start}`);
//       break;

//     case "end":
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
