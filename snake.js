'use strict';

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


const arePositionsEqual = function (position1, position2) {
  const equalityOfX = (position1[0] == position2[0]);
  const equalityOfY = (position1[1] == position2[1]);
  return equalityOfX && equalityOfY;
};

class Snake {
  constructor(positions, direction, type) {
    this.positions = positions.slice();
    this.direction = direction;
    this.type = type;
    this.previousTail = [0, 0];
  }

  get head() {
    return this.positions[this.positions.length - 1].slice();
  }

  state() {
    const state = {
      position: this.positions.slice(),
      tail: this.previousTail.slice(),
      type: this.type
    }
    return state;
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

  grow() {
    const [headX, headY] = this.positions[this.positions.length - 1];
    const [deltaX, deltaY] = this.direction.delta;
    const tail = [headX + deltaX, headY + deltaY];
    this.positions.push(tail);
  }

  isBodyTouch() {
    for (let idx = 0; idx < (this.positions.length - 1); idx++) {
      if (arePositionsEqual(this.head, this.positions[idx])) {
        return true;
      }
    }
    return false;
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


const isNotInRange = function (value, [min, max]) {
  return value < min || value > max;
}

const getNewFood = function (width, height) {
  const newFoodX = Math.floor(Math.random() * width);
  const newFoodY = Math.floor(Math.random() * height);
  return new Food(newFoodX, newFoodY);
}

class Game {
  constructor(size, snake, food) {
    [this.width, this.height] = size;
    this.snake = snake;
    this.food = food;
    this.isOver = false;
    this.score = 0
  }

  get size() {
    return [this.width, this.height];
  }

  getState() {
    return {
      isOver: this.isOver,
      snake: this.snake.state(),
      food: this.food.position,
      score: this.score
    }
  }

  turnSnake(direction) {
    if (this.snake.direction.heading === ((direction + 3) % 4)) {
      this.snake.turnLeft();
    }
    if (this.snake.direction.heading === ((direction + 1) % 4)) {
      this.snake.turnRight();
    }
  }

  isTouchedBoundary() {
    const snakeHead = this.snake.head;
    const isTouchedSide = isNotInRange(snakeHead[0], [0, this.width - 1]);
    const isTouchedTopDown = isNotInRange(snakeHead[1], [0, this.height - 1]);
    return isTouchedSide || isTouchedTopDown;
  }

  isSnakeDied() {
    return this.isTouchedBoundary() || this.snake.isBodyTouch();
  }

  isFoodEaten() {
    return arePositionsEqual(this.snake.head, this.food.position)
  }

  update() {
    if (this.isSnakeDied()) {
      this.isOver = true;
      return;
    }
    if (this.isFoodEaten()) {
      this.food = getNewFood(this.width, this.height);
      this.snake.grow();
      this.score += 5;
    }
    this.snake.move();
  }
}

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
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      createCell(grid, x, y);
    }
  }
};

const eraseFoodAndTail = function (game) {
  let [colId, rowId] = game.snake.tail;
  let cell = getCell(colId, rowId);
  cell.classList.remove(game.snake.type);
  [colId, rowId] = game.food;
  cell = getCell(colId, rowId);
  cell.classList.remove('food');
};

const drawSnakeAndFood = function (game) {
  game.snake.position.forEach(([colId, rowId]) => {
    const cell = getCell(colId, rowId);
    cell.classList.add(game.snake.type);
  });
  const [colId, rowId] = game.food;
  const cell = getCell(colId, rowId);
  cell.classList.add('food')
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

const gameLoop = function (game) {
  const gameState = game.getState();
  if (gameState.isOver) {
    document.location.href = "gameOver.html";
  }
  eraseFoodAndTail(gameState);
  game.update();
  const newState = game.getState();
  displayScore(newState.score);
  drawSnakeAndFood(newState);
};

const setup = (game, GRID_ID) => {
  const gameState = game.getState()
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
  const food = new Food(10, 10);
  const game = new Game([100, 60], snake, food);
  setup(game, GRID_ID);
  setInterval(() => {
    gameLoop(game);
  }, 100);
};
