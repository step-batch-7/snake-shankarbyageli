'use strict';

const EAST = 0;
const NORTH = 1;
const WEST = 2;
const SOUTH = 3;

const getGrid = GRID_ID => document.getElementById(GRID_ID);
const getCellId = (colId, rowId) => colId + '_' + rowId;

const getCell = (colId, rowId) =>
  document.getElementById(getCellId(colId, rowId));

const createCell = function (grid, colId, rowId) {
  const cell = document.createElement('div');
  cell.className = 'cell';
  cell.id = getCellId(colId, rowId);
  grid.appendChild(cell);
};

const createGrids = function ([width, height], GRID_ID) {
  const grid = getGrid(GRID_ID);
  for (let rowId = 0; rowId < height; rowId++) {
    for (let colId = 0; colId < width; colId++) {
      createCell(grid, colId, rowId);
    }
  }
};

const eraseTail = function (snake) {
  const [colId, rowId] = snake.tail;
  const cell = getCell(colId, rowId);
  cell.classList.remove(snake.type);
};

const eraseFood = function (food) {
  const [colId, rowId] = food.position;
  const cell = getCell(colId, rowId);
  cell.classList.remove(food.type);
};

const drawFood = function (food) {
  const [colId, rowId] = food.position;
  const cell = getCell(colId, rowId);
  cell.classList.add(food.type);
};

const drawSnake = function (snake) {
  snake.position.forEach(([colId, rowId]) => {
    const cell = getCell(colId, rowId);
    cell.classList.add(snake.type);
  });
};

const handleKeyPress = game => {
  const moves = {
    'ArrowUp': NORTH,
    'ArrowDown': SOUTH,
    'ArrowRight': EAST,
    'ArrowLeft': WEST
  }
  game.turnSnake(moves[event.key]);
};

const attachEventListeners = game => {
  document.body.onkeydown = handleKeyPress.bind(null, game);
};

const pause = function () {
  alert("Press OK to continue the game!");
};

const displayScore = function (score) {
  document.getElementById('score').innerText = `Score : ${score}`;
};

const drawGame = function (game) {
  displayScore(game.score);
  drawFood(game.food);
  drawSnake(game.snake);
  drawSnake(game.ghostSnake);
};

const gameLoop = function (game, interval) {
  const gameState = game.state();
  if (game.isOver()) {
    document.getElementsByTagName('button')[0].disabled = true;
    clearInterval(interval);
    alert("Game Over!");
    return;
  }
  eraseFood(gameState.food);
  eraseTail(gameState.snake);
  eraseTail(gameState.ghostSnake);
  game.update();
  const newState = game.state();
  drawGame(newState);
};

const setup = (game, GRID_ID) => {
  const gameState = game.state();
  attachEventListeners(game);
  createGrids(game.size, GRID_ID);
  drawGame(gameState);
};

const initSnake = function () {
  const snake = new Snake(
    [
      [40, 25],
      [41, 25],
      [42, 25]
    ],
    new Direction(EAST),
    'snake'
  );
  return snake;
}

const initGhostSnake = function () {
  const ghostSnake = new Snake(
    [
      [60, 25],
      [61, 25],
      [62, 25],
      [63, 25]
    ],
    new Direction(EAST),
    'ghost'
  );
  return ghostSnake;
}

const main = function () {
  const GRID_ID = 'grid';
  const food = new Food(10, 10, 'normal', 5);
  const snake = initSnake();
  const ghostSnake = initGhostSnake();
  const game = new Game([100, 60], snake, ghostSnake, food);
  setup(game, GRID_ID);
  const gameInterval = setInterval(() => {
    gameLoop(game, gameInterval);
  }, 150);
};
