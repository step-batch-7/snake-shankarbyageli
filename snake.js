const EAST = 0;
const NORTH = 1;
const WEST = 2;
const SOUTH = 3;

class Direction {
  constructor(initialHeading) {
    this.heading = initialHeading;
    this.deltas = {};
    this.deltas[EAST] = [1, 0];
    this.deltas[WEST] = [-1, 0];
    this.deltas[NORTH] = [0, -1];
    this.deltas[SOUTH] = [0, 1];
  }

  get delta() {
    return this.deltas[this.heading];
  }

  turnRight() {
    this.heading = (this.heading + 3) % 4;
  }

  turnLeft() {
    this.heading = (this.heading + 1) % 4;
  }
}

class Snake {
  constructor(positions, direction, type) {
    this.positions = positions.slice();
    this.direction = direction;
    this.type = type;
    this.previousTail = [0, 0];
  }

  get location() {
    return this.positions.slice();
  }

  get head() {
    return this.positions[this.positions.length - 1].slice();
  }

  get species() {
    return this.type;
  }

  get snake() {
    return this.positions.slice();
  }

  turnLeft() {
    this.direction.turnLeft();
  }

  turnRight() {
    this.direction.turnRight();
  }

  move() {
    const [headX, headY] = this.positions[this.positions.length - 1];
    this.previousTail = this.positions.shift();
    const [deltaX, deltaY] = this.direction.delta;
    this.positions.push([headX + deltaX, headY + deltaY]);
  }
}

class Food {
  constructor(colId, rowId) {
    this.x = colId;
    this.y = rowId;
  }

  get position() {
    return [this.x, this.y];
  }
}

const getNewFoodPosition = function (width, height) {
  const newFoodX = Math.floor(Math.random() * width);
  const newFoodY = Math.floor(Math.random() * height);
  return new Food(newFoodX, newFoodY);
}

const getNewSnakeTail = function (snake) {
  const [headX, headY] = snake.positions[snake.positions.length - 1];
  const [deltaX, deltaY] = snake.direction.delta;
  return [headX + deltaX, headY + deltaY];
};

class Game {
  constructor(size, snake, food) {
    [this.width, this.height] = size;
    this.snake = snake;
    this.food = food;
  }

  update() {
    this.snake.move();
    if (arePositionsEqual(this.snake.head, this.food.position)) {
      this.food = getNewFoodPosition(this.width, this.height);
      this.snake.positions.push(getNewSnakeTail(this.snake));
    }
  }
}

const NUM_OF_COLS = 100;
const NUM_OF_ROWS = 60;

const GRID_ID = 'grid';

const getGrid = () => document.getElementById(GRID_ID);
const getCellId = (colId, rowId) => colId + '_' + rowId;

const getCell = (colId, rowId) =>
  document.getElementById(getCellId(colId, rowId));

const createCell = function (grid, colId, rowId) {
  const cell = document.createElement('div');
  cell.className = 'cell';
  cell.id = getCellId(colId, rowId);
  grid.appendChild(cell);
};

const createGrids = function () {
  const grid = getGrid();
  for (let y = 0; y < NUM_OF_ROWS; y++) {
    for (let x = 0; x < NUM_OF_COLS; x++) {
      createCell(grid, x, y);
    }
  }
};

const arePositionsEqual = function (position1, position2) {
  const equalityOfX = (position1[0] == position2[0]);
  const equalityOfY = (position1[1] == position2[1]);
  return equalityOfX && equalityOfY;
};

const eraseTail = function (snake) {
  let [colId, rowId] = snake.previousTail;
  const cell = getCell(colId, rowId);
  cell.classList.remove(snake.species);
};

const eraseFood = function (food) {
  let [colId, rowId] = food.position;
  const cell = getCell(colId, rowId);
  cell.classList.remove('food');
};

const drawSnake = function (snake) {
  snake.location.forEach(([colId, rowId]) => {
    const cell = getCell(colId, rowId);
    cell.classList.add(snake.species);
  });
};

const drawFood = function (food) {
  const [colId, rowId] = food.position
  const cell = getCell(colId, rowId);
  cell.classList.add('food')
};

const handleKeyPress = snake => {
  const moves = {
    'ArrowUp': NORTH,
    'ArrowDown': SOUTH,
    'ArrowRight': EAST,
    'ArrowLeft': WEST
  }
  if (snake.direction.heading === ((moves[event.key] + 3) % 4)) {
    snake.turnLeft();
  }
  if (snake.direction.heading === ((moves[event.key] + 1) % 4)) {
    snake.turnRight();
  }
};

const attachEventListeners = snake => {
  document.body.onkeydown = handleKeyPress.bind(null, snake);
};

const gameLoop = function (game) {
  eraseFood(game.food);
  game.update();
  eraseTail(game.snake);
  drawSnake(game.snake);
  drawFood(game.food);
};

const setup = game => {
  attachEventListeners(game.snake);
  createGrids();
  drawSnake(game.snake);
  drawFood(game.food);
};

const main = function () {
  const snake = new Snake(
    [
      [40, 25],
      [41, 25],
      [42, 25]
    ],
    new Direction(EAST),
    'snake'
  );
  const food = new Food(10, 10);
  const game = new Game([100, 60], snake, food);
  setup(game);
  setInterval(() => {
    gameLoop(game);
  }, 200);
};
