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

const eraseFoodAndTail = function (game) {
  let [colId, rowId] = game.snake.tail;
  let cell = getCell(colId, rowId);
  cell.classList.remove(game.snake.type);

  [colId, rowId] = game.food.position;
  cell = getCell(colId, rowId);
  cell.classList.remove(game.food.type);
};

const drawSnakeAndFood = function (game) {
  game.snake.position.forEach(([colId, rowId]) => {
    const cell = getCell(colId, rowId);
    cell.classList.add(game.snake.type);
  });
  const [colId, rowId] = game.food.position;
  const cell = getCell(colId, rowId);
  cell.classList.add(game.food.type);
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

const displayScore = function (score) {
  document.getElementById('score').innerText = `Score : ${score}`;
}

const gameLoop = function (game, interval) {
  const gameState = game.state();
  if (game.isOver()) {
    clearInterval(interval);
    alert("Game Over!")
  }
  eraseFoodAndTail(gameState);
  game.update();
  const newState = game.state();
  displayScore(newState.score);
  drawSnakeAndFood(newState);
};

const setup = (game, GRID_ID) => {
  const gameState = game.state()
  attachEventListeners(game);
  createGrids(game.size, GRID_ID);
  drawSnakeAndFood(gameState);
};

const main = function () {
  const GRID_ID = 'grid';
  const snake = new Snake(
    [
      [40, 25],
      [41, 25],
      [42, 25]
    ],
    new Direction(EAST),
    'snake'
  );
  const food = new Food(10, 10, 'normal', 5);
  const game = new Game([100, 60], snake, food);
  setup(game, GRID_ID);
  const gameInterval = setInterval(() => {
    gameLoop(game, gameInterval);
  }, 100);
};
