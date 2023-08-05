const express = require("express");
const app = express();
const http = require("http");
const { socketPort } = require("./configs");

const server = http.createServer(app);
const io = require("socket.io")(server);

io.on("connection", (socket) => {
  console.log("socket connected ", socket.id);

  socket.on("disconnect", () => {
    console.log("disconnected from server", socket.id);
  });
});

server.listen(socketPort, (err) => {
  if (err) {
    console.error(err);
    process.exit(1);
    return;
  }
  console.log(`
      ########################################
      🛡️ Server listening on port: ${socketPort} 🛡️ 
      ########################################
    `);
});

module.exports = io;
