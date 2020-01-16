'use strict';

const isNotInRange = function (value, [min, max]) {
  return value < min || value > max;
};

const arePositionsEqual = function (position1, position2) {
  const isColIdEqual = (position1[0] == position2[0]);
  const isRowIdEqual = (position1[1] == position2[1]);
  return isColIdEqual && isRowIdEqual;
};

const randomNumber = function (limit) {
  return Math.floor(Math.random() * limit);
};

class Game {
  #snake;
  #ghostSnake;
  #food;
  #score;
  #width;
  #height;
  constructor(size, snake, ghostSnake, food) {
    [this.#width, this.#height] = size;
    this.#snake = snake;
    this.#ghostSnake = ghostSnake;
    this.#food = food;
    this.#score = 0
  }

  get size() {
    return [this.#width, this.#height];
  }

  state() {
    return {
      snake: this.#snake.state(),
      ghostSnake: this.#ghostSnake.state(),
      food: this.#food.state(),
      score: this.#score
    }
  }

  generateFood() {
    const colId = randomNumber(this.#width);
    const rowId = randomNumber(this.#height);
    const [type, points] = this.#score % 45 === 0 ? ['special', 20] : ['normal', 5];
    return new Food(colId, rowId, type, points);
  }

  randomTurn() {
    const random = randomNumber(50);
    if (random > 40) {
      this.#ghostSnake.turnRight();
    }
    if (this.#ghostSnake.isOutOfBoundary(4, 4, this.#width - 4, this.#height - 4)) {
      this.#ghostSnake.turnRight();
      this.#ghostSnake.turnRight();
    }
  }

  turnSnake(turnDirection) {
    const { direction } = this.#snake.head();
    if (direction === ((turnDirection + 3) % 4)) {
      this.#snake.turnLeft();
    }
    if (direction === ((turnDirection + 1) % 4)) {
      this.#snake.turnRight();
    }
  }

  haveSnakesCollided() {
    const snake = this.#snake.state();
    const ghostSnake = this.#ghostSnake.state();
    const ghostTouch = this.#ghostSnake.isHeadOn(snake.position);
    const snakeTouch = this.#snake.isHeadOn(ghostSnake.position);
    return ghostTouch || snakeTouch;
  }

  isOver() {
    return this.#snake.isOutOfBoundary(0, 0, this.#width, this.#height) ||
      this.#snake.isBodyTouch() ||
        this.haveSnakesCollided();
  }

  update() {
    const food = this.#food.state();
    if (this.#snake.ateFood(food.position)) {
      this.#food = this.generateFood();
      if (food.type === 'normal') {
        this.#snake.grow();
      }
      this.#score += food.points;
    }
    this.#snake.move();
    this.#ghostSnake.move();
    this.randomTurn();
  }
}
