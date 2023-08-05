const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { router } = require("../api/routes");
const config = require("../configs");
const responseFormat = require("../api/middlewares/responseFormat");
const passport = require("passport");
const passportLoader = require("./passport");
const pino = require("pino");
const expressPino = require("express-pino-logger");
const sqlFormatter = require("sql-formatter");
const mysql = require("mysql");
const util = require("util");

MongoID = require("mongodb").ObjectID;

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

const prettifyQuery = (value) => {
  // req.log.debug({ query: this.sql, msg: req_api_name + " | " + "QUERY_EXECUTION" });
  return "\n------\n" + sqlFormatter.format(value) + "\n------\n";
};
const prettifyError = (value) => {
  // req.log.error({ error: error, msg: req_api_name + " | " + "QUERY_FAILED" });

  // req_api_name + " | " + "QUERY_FAILED: " + error;
  return "\n------\n" + value + "\n------\n";
};
const prettifyReq = (value) => {
  return value.id + " | " + value.method + " | " + value.url + "\n";
};
const prettifyRes = (value) => {
  return value.statusCode + "\n";
};
const prettifyResponseTime = (value) => {
  return value + "ms";
};

const logger = pino({
  prettyPrint: {
    crlf: false, // --crlf
    errorLikeObjectKeys: ["err", "error"], // --errorLikeObjectKeys
    errorProps: "", // --errorProps
    levelFirst: false, // --levelFirst
    messageKey: "msg", // --messageKey
    timestampKey: "time", // --timestampKey
    translateTime: "SYS:standard", // --translateTime
    customPrettifiers: {
      req: prettifyReq,
      res: prettifyRes,
      responseTime: prettifyResponseTime,
      query: prettifyQuery,
      error: prettifyError,
    },
  },
  level: process.env.LOG_LEVEL || "info",
  // level: "debug"
});
global.logger = logger;
function setDistributedRequestId(MongoID) {
  return (req, res, next) => {
    const reqId = req.get("X-Request-Id") || new MongoID().toString();
    req.id = reqId;
    res.set("X-RequestId", reqId);
    next();
  };
}

function logIncomingRequests(logger) {
  return (req, res, next) => {
    // without custom serializers, we must be explicit
    req.log.info({ req }, "request incoming");
    next();
  };
}
const expressLogger = expressPino({ logger });

module.exports = (app) => {
  app.use(setDistributedRequestId(MongoID));
  app.use(expressLogger);
  app.use(logIncomingRequests());

  app.get("/status", (req, res) => {
    res.status(200).end();
  });

  app.head("/status", (req, res) => {
    res.status(200).end();
  });

  // Useful if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
  // It shows the real origin IP in the heroku or Cloudwatch logs
  app.enable("trust proxy");

  // The magic package that prevents frontend developers going nuts
  // Alternate description:
  // Enable Cross Origin Resource Sharing to all origins by default

  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    next();
  });

  app.use(cors());

  // custom response middlewear
  app.use(responseFormat);

  // Some sauce that always add since 2014
  // "Lets you use HTTP verbs such as PUT or DELETE in places where the client doesn't support it."
  // Maybe not needed anymore ?
  // app.use(require("method-override")());

  // Middleware that transforms the raw string of req.body into json
  app.use(bodyParser.json());

  /**
   * Set middleware initialize passport
   */
  app.use(passport.initialize());

  passportLoader;

  // Load API routes
  app.use(config.api.prefix, router);

  /// catch 404 and forward to error handler
  // app.use((req, res, next) => {
  //   const err = new Error("Not Found");
  //   err["status"] = 404;
  //   next(err);
  // });

  /// error handlers
  app.use(require("./errorHandler"));
};
