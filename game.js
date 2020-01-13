'use strict';

const isNotInRange = function (value, [min, max]) {
  return value < min || value > max;
}

const arePositionsEqual = function (position1, position2) {
  const isColIdEqual = (position1[0] == position2[0]);
  const isRowIdEqual = (position1[1] == position2[1]);
  return isColIdEqual && isRowIdEqual;
};

const getNewFood = function (width, height) {
  const colId = Math.floor(Math.random() * width);
  const rowId = Math.floor(Math.random() * height);
  return new Food(colId, rowId);
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

  turnSnake(turnDirection) {
    const { direction } = this.snake.head();
    if (direction === ((turnDirection + 3) % 4)) {
      this.snake.turnLeft();
    }
    if (direction === ((turnDirection + 1) % 4)) {
      this.snake.turnRight();
    }
  }

  isSnakeDied() {
    return this.snake.isOnLine(this.width, this.height) || this.snake.isBodyTouch();
  }

  update() {
    if (this.isSnakeDied()) {
      this.isOver = true;
      return;
    }
    if (this.snake.ateFood(this.food.position)) {
      this.food = getNewFood(this.width, this.height);
      this.snake.grow();
      this.score += 5;
    }
    this.snake.move();
  }
}
