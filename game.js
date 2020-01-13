'use strict';

const isNotInRange = function (value, [min, max]) {
  return value < min || value > max;
}

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

  isTouchedBoundary() {
    const { position } = this.snake.head();
    const isTouchedSides = isNotInRange(position[0], [0, this.width - 1]);
    const isTouchedTopDown = isNotInRange(position[1], [0, this.height - 1]);
    return isTouchedSides || isTouchedTopDown;
  }

  isSnakeDied() {
    return this.isTouchedBoundary() || this.snake.isBodyTouch();
  }

  isFoodEaten() {
    const { position } = this.snake.head();
    return arePositionsEqual(position, this.food.position)
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
