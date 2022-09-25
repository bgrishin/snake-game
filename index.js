let canvas = document.getElementById("canvas"),
  isGameStarted = false,
  isLongTailModeEnabled = false,
  ctx = canvas.getContext("2d"),
  scoreIs = document.getElementById("score"),
  direction = "",
  directionQueue = "",
  speedInterval = 100,
  snake = [],
  snakeLength = 5,
  cellSize = 20,
  snakeColor = "#27AE60",
  snakeHeadColor = "#0ed22c",
  foodColor = "#FFD700",
  foodX = [],
  foodY = [],
  food = {
    x: 0,
    y: 0,
  },
  score = 0,
  interval;

for (let i = 0; i <= canvas.width - cellSize; i += cellSize) {
  foodX.push(i);
  foodY.push(i);
}

canvas.setAttribute("tabindex", "1");
canvas.style.outline = "none";
canvas.focus();

function roundRect(
  ctx,
  x,
  y,
  width,
  height,
  radius = 5,
  fill = false,
  stroke = true
) {
  if (typeof radius === "number") {
    radius = { tl: radius, tr: radius, br: radius, bl: radius };
  } else {
    radius = { ...{ tl: 0, tr: 0, br: 0, bl: 0 }, ...radius };
  }
  ctx.beginPath();
  ctx.moveTo(x + radius.tl, y);
  ctx.lineTo(x + width - radius.tr, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
  ctx.lineTo(x + width, y + height - radius.br);
  ctx.quadraticCurveTo(
    x + width,
    y + height,
    x + width - radius.br,
    y + height
  );
  ctx.lineTo(x + radius.bl, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
  ctx.lineTo(x, y + radius.tl);
  ctx.quadraticCurveTo(x, y, x + radius.tl, y);
  ctx.closePath();
  if (fill) {
    ctx.fill();
  }
  if (stroke) {
    ctx.stroke();
  }
}

function drawSquare(x, y, color, type) {
  ctx.fillStyle = color;
  roundRect(
    ctx,
    x,
    y,
    cellSize,
    cellSize,
    type === "food" ? 12 : 5,
    true,
    false
  );
}

function createFood() {
  food.x = foodX[Math.floor(Math.random() * foodX.length)];
  food.y = foodY[Math.floor(Math.random() * foodY.length)];

  for (let i = 0; i < snake.length; i++) {
    if (checkCollision(food.x, food.y, snake[i].x, snake[i].y)) {
      createFood();
    }
  }
}

function drawFood() {
  drawSquare(food.x, food.y, foodColor, "food");
}

function setBackground(color1, color2) {
  ctx.fillStyle = color1;
  ctx.strokeStyle = color2;

  ctx.fillRect(0, 0, canvas.height, canvas.width);

  for (let x = 0.2; x < canvas.width; x += cellSize) {
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
  }
  for (let y = 0.2; y < canvas.height; y += cellSize) {
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
  }

  ctx.stroke();
}

function createSnake() {
  snake = [];
  for (let i = snakeLength; i > 0; i--) {
    let k = i * cellSize;
    snake.push({ x: k, y: 0 });
  }
}

function drawSnake() {
  for (let i = 0; i < snake.length; i++) {
    drawSquare(
      snake[i].x,
      snake[i].y,
      !i ? snakeHeadColor : snakeColor,
      "snake"
    );
  }
}

function changeDirection(keycode) {
  if (keycode === 37 && direction !== "right") {
    directionQueue = "left";
  } else if (keycode === 38 && direction !== "down") {
    directionQueue = "up";
  } else if (keycode === 39 && direction !== "left") {
    directionQueue = "right";
  } else if (keycode === 40 && direction !== "up") {
    directionQueue = "down";
  }
}

function moveSnake() {
  let x = snake[0].x;

  let y = snake[0].y;

  direction = directionQueue;

  if (direction === "right") {
    x += cellSize;
  } else if (direction === "left") {
    x -= cellSize;
  } else if (direction === "up") {
    y -= cellSize;
  } else if (direction === "down") {
    y += cellSize;
  }

  let tail = snake.pop();
  tail.x = x;
  tail.y = y;
  snake.unshift(tail);
}

function checkCollision(x1, y1, x2, y2) {
  return x1 === x2 && y1 === y2;
}

function endGame() {
  clearInterval(interval);
  document.querySelector(".replay_button").style.display = "block";
}

function replay() {
  document.querySelector(".replay_button").style.display = "none";
  setBackground("#F8F8F8", "#e3e3e3");
  createSnake();
  drawSnake();
  createFood();
  drawFood();
  directionQueue = "right";
  score = 0;
  interval = setInterval(game, speedInterval);
}

function longTail() {
  if (!isLongTailModeEnabled) {
    document.querySelector(".long_tail_text").style.display = "block";
    document.querySelector(".long_tail_button").innerHTML =
      "Disable Long Tail Mode";
    snakeLength = 20;
    isLongTailModeEnabled = true;
  } else {
    document.querySelector(".long_tail_text").style.display = "none";
    document.querySelector(".long_tail_button").innerHTML =
      "Enable Long Tail Mode";
    snakeLength = 5;
    isLongTailModeEnabled = false;
  }
  setBackground("#F8F8F8", "#e3e3e3");
  createSnake();
  drawSnake();
  createFood();
  drawFood();
}

function game() {
  let head = snake[0];
  if (
    head.x < 0 ||
    head.x > canvas.width - cellSize ||
    head.y < 0 ||
    head.y > canvas.height - cellSize
  ) {
    endGame();
    return;
  }

  for (let i = 1; i < snake.length; i++) {
    if (head.x === snake[i].x && head.y === snake[i].y) {
      endGame();
      return;
    }
  }

  if (checkCollision(head.x, head.y, food.x, food.y)) {
    snake[snake.length] = { x: head.x, y: head.y };
    createFood();
    drawFood();
    score += 1;
  }

  ctx.beginPath();
  setBackground("#F8F8F8", "#e3e3e3");
  scoreIs.innerHTML = score;
  drawSnake();
  drawFood();
  moveSnake();
}

document.onkeydown = function (evt) {
  if (!isGameStarted) {
    isGameStarted = true;
    interval = setInterval(game, speedInterval);
    document.querySelector(".start_text").style.display = "none";
  } else {
    evt = evt || window.event;
    changeDirection(evt.keyCode);
  }
};

function newGame() {
  direction = "right";
  directionQueue = "right";
  ctx.beginPath();
  createSnake();
  createFood();

  game();
}
newGame();
