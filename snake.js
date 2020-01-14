'use strict';

class Snake {
  constructor(positions, direction, type) {
    this.positions = positions.slice();
    this.direction = direction;
    this.type = type;
    this.previousTail = [0, 0];
  }

  head() {
    return {
      position: this.positions[this.positions.length - 1].slice(),
      direction: this.direction.head
    }
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
    this.grow();
    this.previousTail = this.positions.shift();
  }

  ateFood(food) {
    return arePositionsEqual(food, this.head().position);
  }

  grow() {
    const [headX, headY] = this.positions[this.positions.length - 1];
    const [deltaX, deltaY] = this.direction.delta;
    const tail = [headX + deltaX, headY + deltaY];
    this.positions.push(tail);
  }

  isBodyTouch() {
    const head = this.positions[this.positions.length - 1];
    for (let idx = 0; idx < (this.positions.length - 1); idx++) {
      if (arePositionsEqual(head, this.positions[idx])) {
        return true;
      }
    }
    return false;
  }

  isOutOfBoundary(startX, startY, width, height) {
    const head = this.head().position;
    const isTouchedSides = isNotInRange(head[0], [startX, width - 1]);
    const isTouchedTopDown = isNotInRange(head[1], [startY, height - 1]);
    return isTouchedSides || isTouchedTopDown;
  }
}
