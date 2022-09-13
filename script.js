const score = document.querySelector(".score");
const startScreen = document.querySelector(".startScreen");
const gameArea = document.querySelector(".gameArea");
const gameMessage = document.querySelector(".gameMessage");
gameMessage.addEventListener("click", start);
startScreen.addEventListener("click", start);
document.addEventListener("keydown", pressOn);
document.addEventListener("keyup", pressOff);
let keys = {};
let player = {};

function start() {
  player.score = 0;
  player.speed = 2;
  player.inplay = true;
  gameArea.innerHTML = "";
  gameMessage.classList.add("hide")
  startScreen.classList.add("hide");

  let bird = document.createElement("div");
  bird.classList.add("bird");

  let wing = document.createElement("div");
  wing.pos = 15;
  wing.style.top = wing.pos + "px";
  wing.classList.add("wing");

  bird.appendChild(wing);
  gameArea.appendChild(bird);

  player.x = bird.offsetLeft;
  player.y = bird.offsetTop;
  player.pipe = 0;
  let spacing = 300;
  let howMany = Math.floor(gameArea.offsetWidth / 300);

  for (let x = 0; x < howMany; x++) {
    buildPipes(player.pipe * spacing);
  }
  window.requestAnimationFrame(playGame);
}

function buildPipes(startPos) {
  let totalWidth = gameArea.offsetWidth;
  let totalHeight = gameArea.offsetHeight;
  let tempColor = getColor();
  let pipeTop = document.createElement("div");

  pipeTop.classList.add("pipe");
  pipeTop.style.top = "0px";
  pipeTop.x = totalWidth + startPos;
  pipeTop.style.left = pipeTop.x + "px";

  pipeTop.height = Math.floor(Math.random() * 350) + 100;
  pipeTop.style.height = pipeTop.height + "px";
  pipeTop.style.backgroundColor = tempColor;
  gameArea.appendChild(pipeTop);

  let spacing = Math.floor(Math.random() * 250) + 150;

  let pipeBot = document.createElement("div");
  pipeBot.classList.add("pipe");
  pipeBot.x = totalWidth + startPos;
  pipeBot.style.left = pipeBot.x + "px";
  pipeBot.height = totalHeight - spacing - pipeTop.height;
  pipeBot.style.height = pipeBot.height + "px";
  pipeBot.style.bottom = "0px";
  pipeBot.innerHTML = player.pipe;
  pipeBot.style.backgroundColor = tempColor;
  gameArea.appendChild(pipeBot);

  player.pipe++;
}

function playGame() {
  let bird = document.querySelector(".bird");
  let wing = document.querySelector(".wing");
  let move = false
  if (player.inplay) {
    moviePipes(bird);

    if (keys.ArrowUp || keys.Space) {
      player.y -= player.speed * 4;
      move = true
    }

    if (keys.ArrowDown && player.y < gameArea.offsetHeight) {
      player.y += player.speed;
      move = true
    }

    if (keys.ArrowRight && player.x < gameArea.offsetWidth - 50) {
      player.x += player.speed;
      move = true
    }

    if (keys.ArrowLeft && player.x > 0) {
      player.x -= player.speed;
      move = true
    }

    if (player.y > gameArea.offsetHeight - 50) {
      gameOver(bird);
    }
    if (move) {
        wing.pos = (wing.pos == 15) ? 25 : 15;
        wing.style.top = wing.pos + "px";
    }

    player.y += player.speed * 2;

    bird.style.top = player.y + "px";
    bird.style.left = player.x + "px";
    window.requestAnimationFrame(playGame);
    player.score++;
    score.innerHTML = player.score;
  }
}

function moviePipes(bird) {
  let pipes = document.querySelectorAll(".pipe");
  let counter = 0;

  pipes.forEach((pipe) => {
    pipe.x -= player.speed;
    pipe.style.left = pipe.x + "px";

    if (pipe.x < gameArea.offsetLeft) {
      pipe.parentElement.removeChild(pipe);
      counter++;
    }
    if (isCollide(pipe, bird)) {
      gameOver(bird);
    }
  });
  counter = counter / 2;
  for (let x = 0; x < counter; x++) {
    buildPipes(0);
  }
}

function gameOver(bird) {
  player.inplay = false;
  bird.style.transform = "rotateZ(180deg)";
  startScreen.classList.remove("hide");
  gameMessage.classList.remove("hide")
  gameMessage.innerHTML = `Game Over You Scored: ${player.score} points`
}

function isCollide(a, b) {
  let aRect = a.getBoundingClientRect();
  let bRect = b.getBoundingClientRect();
  return !(
    aRect.bottom < bRect.top ||
    aRect.top > bRect.bottom ||
    aRect.right < bRect.left ||
    aRect.left > bRect.right
  );
}

function getColor() {
  return "#" + Math.random().toString(16).substr(-6);
}

function pressOn(e) {
  e.preventDefault();
  keys[e.code] = true;
  console.log(e.code);
}

function pressOff(e) {
  e.preventDefault();
  keys[e.code] = false;
}
