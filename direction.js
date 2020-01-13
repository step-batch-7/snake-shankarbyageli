'use strict';

class Direction {
  constructor(initialHeading) {
    this.heading = initialHeading;
    this.deltas = {};
    this.deltas[EAST] = [1, 0];
    this.deltas[WEST] = [-1, 0];
    this.deltas[NORTH] = [0, -1];
    this.deltas[SOUTH] = [0, 1];
  }

  get head() {
    return this.heading;
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

