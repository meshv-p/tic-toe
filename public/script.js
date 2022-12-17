const socket = io(process.env.HOST);
require("dotenv").config();

// Define variables
let CIRCLE = '<div class="circle"></div>';
let CROSS = '<div class="cross"></div>';
let TURN = 0;

let isPlayerOne = true;
let winner = null;

let board = [
  ["", "", ""],
  ["", "", ""],
  ["", "", ""],
];
console.log(isPlayerOne);

document.querySelectorAll(".block").forEach((block, id) => {
  block.addEventListener("click", selectBox);
});
let nextPlayer = document.querySelector(".nextPlayer");
let currentPlayerName = document.querySelector(".currentPlayerName");
let p1 = document.querySelector(".p1");
let p2 = document.querySelector(".p2");

nextPlayer.innerHTML = isPlayerOne ? "Next Player 1" : "Next Player 2";
let playerName = prompt("Enter your name");

currentPlayerName.innerHTML = `You:  ${playerName}`;

function getId(id) {
  return parseInt(id.split("").pop());
}

function restartGame() {
  document.querySelectorAll(".block").forEach((block, id) => {
    block.innerHTML = "";
  });

  TURN = 0;
  winner = null;
  board = [
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
  ];
  isPlayerOne = true;
  nextPlayer.innerHTML = isPlayerOne ? "Next Player 1" : "Next Player 2";
}

function endGame() {
  if (!winner) return;
  alert(winner);

  restartGame();
}

function checkWinner() {
  //   console.log(board);

  let lines = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
    [1, 4, 7],
    [2, 5, 8],
    [3, 6, 9],
    [3, 5, 7],
    [1, 5, 9],
  ];

  lines.map((line) => {
    let [a, b, c] = line;

    let row = ~~((a - 1) / 3);
    let col = (a - 1) % 3;

    // console.log(b, parseInt((b - 1) / 3), (b - 1) % 3);
    // console.log(board[parseInt((b - 1) / 3)][(b - 1) % 3]);

    if (
      board[row][col] &&
      board[~~((b - 1) / 3)][(b - 1) % 3] &&
      board[~~((c - 1) / 3)][(c - 1) % 3] &&
      [
        board[row][col],
        board[~~((b - 1) / 3)][(b - 1) % 3],
        board[~~((c - 1) / 3)][(c - 1) % 3],
      ].every((v) => v === board[row][col])
    ) {
      if (board[row][col] === CIRCLE) {
        winner = "1";
      } else {
        winner = "2";
      }
      // console.log(board[row][col], `Player ${winner} won`);
      winner = `Player ${winner} won`;
      endGame();

      return;
    }

    if (TURN == 9) {
      winner = `Match draw`;
      endGame();
    }
  });

  return;
  // //   For all posible 0
  // if ([board[0][0], board[0][1], board[0][2]].every((v) => v === CIRCLE)) {
  //   console.log("won 0");
  //   winner = "Player 0 won";
  //   // setTimeout(() => {
  //   endGame();
  //   // }, 2000);
  // }
  // if ([board[1][0], board[1][1], board[1][2]].every((v) => v === CIRCLE)) {
  //   console.log("won 0");
  //   winner = "Player 0 won";
  //   setTimeout(() => {
  //     endGame();
  //   }, 2000);
  // }
  // if ([board[2][0], board[2][1], board[2][2]].every((v) => v === CIRCLE)) {
  //   console.log("won 0");
  //   winner = "Player 0 won";
  //   setTimeout(() => {
  //     endGame();
  //   }, 2000);
  // }

  // if ([board[0][0], board[0][1], board[0][2]].every((v) => v === CIRCLE)) {
  //   console.log("won 0");
  //   winner = "Player 0 won";
  //   setTimeout(() => {
  //     endGame();
  //   }, 2000);
  // }
  // if ([board[0][0], board[1][1], board[2][2]].every((v) => v === CIRCLE)) {
  //   console.log("won 0");
  //   winner = "Player 0 won";
  //   setTimeout(() => {
  //     endGame();
  //   }, 2000);
  // }

  // //   For all posible X

  // if ([board[0][0], board[0][1], board[0][2]].every((v) => v === CROSS)) {
  //   console.log("won 1");
  //   winner = "Player 1 won";
  //   endGame();
  // }
  // if ([board[1][0], board[1][1], board[1][2]].every((v) => v === CROSS)) {
  //   console.log("won 1");
  //   winner = "Player 1 won";
  //   endGame();
  // }
  // if ([board[2][0], board[2][1], board[2][2]].every((v) => v === CROSS)) {
  //   console.log("won 1");
  //   winner = "Player 1 won";
  //   endGame();
  // }
  // if ([board[0][0], board[0][1], board[0][2]].every((v) => v === CROSS)) {
  //   console.log("won 1");
  //   winner = "Player 1 won";
  //   endGame();
  // }
  // if ([board[0][0], board[1][1], board[2][2]].every((v) => v === CROSS)) {
  //   console.log("won 1");
  //   winner = "Player 1 won";
  //   endGame();
  // }
}

function selectBox(block) {
  TURN++;

  let col = (getId(block.target.id) - 1) % 3;
  let row = getId(block.target.parentElement.id) - 1;

  if (board[row][col]) return;

  if (isPlayerOne) {
    document.getElementById(block.target.id).innerHTML = CIRCLE;
    board[row][col] = CIRCLE;
    isPlayerOne = false;
    socket.emit("selectBox", {
      player: playerName,
      row,
      col,
      id: socket.id,
      type: "CIRCLE",
      block: block.target.id,
    });
  } else {
    document.getElementById(block.target.id).innerHTML = CROSS;
    board[row][col] = CROSS;
    isPlayerOne = true;
    socket.emit("selectBox", {
      player: playerName,
      id: socket.id,
      row,
      col,
      type: "CROSS",
      block: block.target.id,
    });
  }
  nextPlayer.innerHTML = isPlayerOne ? "Next Player 1" : "Next Player 2";
  console.log(isPlayerOne);

  if (TURN > 3) {
    checkWinner();
  }
}

socket.on("connect", () => {
  console.log("connected to server");

  p1.innerHTML = playerName;

  socket.emit("join", { name: playerName });

  socket.on("player1", (data) => {
    console.log(data);
  });

  socket.on("player2", (data) => {
    console.log(data);

    p2.innerHTML = data.name.name;
    p1.innerHTML = data.player1.name;

    // p2.innerHTML = data.name;
  });

  socket.on("selectBox", (data) => {
    console.log(data);
    TURN++;
    if (board[data.row][data.col]) return;

    if (data.id != socket.id) {
      // player 2
      document.getElementById(data.block).innerHTML =
        data.type === "CIRCLE" ? CIRCLE : CROSS;
      board[data.row][data.col] = data.type === "CIRCLE" ? CIRCLE : CROSS;
      isPlayerOne = !isPlayerOne;
      nextPlayer.innerHTML = isPlayerOne ? "Next Player 1" : "Next Player 2";
      console.log(isPlayerOne);
    } else {
      // player 1
      isPlayerOne = !isPlayerOne;

      console.log("same player");
    }

    if (TURN > 3) {
      checkWinner();
    }
  });

  // socket.emit('join', {name: 'player1', room: 'room1'});
});
