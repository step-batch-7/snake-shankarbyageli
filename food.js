'use strict';

class Food {
  constructor(colId, rowId, type, points) {
    this.colId = colId;
    this.rowId = rowId;
    this.type = type;
    this.points = points;
  }

  state() {
    return {
      position: [this.colId, this.rowId],
      type: this.type,
      points: this.points
    }
  }
}