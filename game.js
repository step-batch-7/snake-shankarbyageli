'use strict';

const isNotInRange = function (value, [min, max]) {
  return value < min || value > max;
}

const arePositionsEqual = function (position1, position2) {
  const isColIdEqual = (position1[0] == position2[0]);
  const isRowIdEqual = (position1[1] == position2[1]);
  return isColIdEqual && isRowIdEqual;
};

const getNewFood = function (width, height, score) {
  const colId = Math.floor(Math.random() * width);
  const rowId = Math.floor(Math.random() * height);
  const [type, points] = score % 45 === 0 ? ['special', 20] : ['normal', 5];
  return new Food(colId, rowId, type, points);
}

class Game {
  constructor(size, snake, food) {
    [this.width, this.height] = size;
    this.snake = snake;
    this.food = food;
    this.score = 0
  }

  get size() {
    return [this.width, this.height];
  }

  state() {
    return {
      snake: this.snake.state(),
      food: this.food.state(),
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

  isOver() {
    return this.snake.isOnLine(this.width, this.height) || this.snake.isBodyTouch();
  }

  update() {
    const food = this.food.state();
    if (this.snake.ateFood(food.position)) {
      this.food = getNewFood(this.width, this.height, this.score);
      if (food.type === 'normal') {
        this.snake.grow();
      }
      this.score += food.points;
    }
    this.snake.move();
  }
}
