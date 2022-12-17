const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
require("dotenv").config();

const app = express();

app.use(express.static("public"));

const httpServer = createServer(app);
const io = new Server(httpServer, {
  /* options */
});

let player1 = null;
let player2 = null;

io.on("connection", (socket) => {
  console.log(socket.id, player1, player2);

  socket.on("join", (data) => {
    console.log(data);

    if (!data.name) return;

    if (!player1) {
      player1 = {
        name: data.name,
        id: socket.id,
      };
      io.emit("player1", { name: player1 });
      console.log("seting 1", data);
      return;
    }

    if (player1 && !player2) {
      player2 = {
        name: data.name,
        id: socket.id,
      };
      io.emit("player2", {
        name: player2,
        player1: player1,
      });
      console.log("seting 2", data);
    }
  });

  socket.on("selectBox", (data) => {
    console.log(data);
    if (data.id === player1.id) {
      io.to(player2.id).emit("selectBox", data);
    } else {
      io.to(player1.id).emit("selectBox", data);
    }
  });

  socket.on("disconnect", (res) => {
    console.log("disconnected", socket.id, res);
    if (player1?.id === socket.id) {
      player1 = null;
    }
    if (player2?.id === socket.id) {
      player2 = null;
    }
  });
});

httpServer.listen(3000, () => {
  console.log(`Example app listening on port 3000`);
});
