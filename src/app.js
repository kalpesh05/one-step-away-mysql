const express = require("express");
const app = express();
const http = require("http");
const { port } = require("./configs");
global.io = require("./app-socket");

const server = http.createServer(app);

const { expressLoader , logger } = require("./loaders");

expressLoader(app);

server.listen(port, (err) => {
  if (err) {
    console.error(err);
    process.exit(1);
    return;
  }
  logger.info(`
      ########################################
      🛡️ Server listening on port: ${port} 🛡️ 
      ########################################
    `);
});
