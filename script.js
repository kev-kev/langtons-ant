window.addEventListener("load", () => {
  const canvas = document.getElementById("myCanvas");
  window.ctx = canvas.getContext("2d");
  const game = new Game();
  setInterval(() => game.moveAnt(), 1000);
});

// canvas size is 500x500, so we have a 50x50 grid of 10px boxes
const BOX_SIZE = 10;

class Game {
  constructor() {
    this.curBox = [25, 25]; // start in middle
    this.direction = 0; // 0 degrees = north, 90 = east, etc...
  }

  moveAnt() {
    // if on an empty box, turn 90 CCW, flip the color, move forward
    // if on a filled box, turn 90 CW, flip the color, move forward

    // need to determine if the current box is filled or not and the coords of the box in front of the ant
    // then, flip the box, rotate the ant, and move forward

    isCoordinateFilled(this.curBox)
      ? (this.direction -= 90)
      : (this.direction += 90);

    console.log("After:", this.direction);
    if (Math.abs(this.direction) === 360) this.direction = 0;
    flipBox(this.curBox);
    const nextBox = this.getBoxInFront();
    console.log("Next box: ", nextBox);
    this.curBox = nextBox;
  }

  getBoxInFront() {
    switch (this.direction) {
      case 0:
        return [this.curBox[0], this.curBox[1] - 1];
      case 90:
      case -270:
        return [this.curBox[0] + 1, this.curBox[1]];
      case 180:
      case -180:
        return [this.curBox[0], this.curBox[1] + 1];
      case 270:
      case -90:
        return [this.curBox[0] - 1, this.curBox[1]];
    }
  }
}

// returns true if any color other than white
const isCoordinateFilled = (coords) => {
  let x, y;
  [x, y] = coords;
  const imageData = window.ctx.getImageData(x * BOX_SIZE, y * BOX_SIZE, 1, 1);
  return imageData["data"]["0"] > 0;
};

const flipBox = (coords) => {
  let x, y;
  [x, y] = coords;
  isCoordinateFilled(coords) ? clearBox(x, y) : fillBox(x, y);
};

const fillBox = (x, y, color = "black") => {
  window.ctx.fillStyle = color;
  window.ctx.fillRect(x * BOX_SIZE, y * BOX_SIZE, BOX_SIZE, BOX_SIZE);
};

const clearBox = (x, y) => {
  window.ctx.clearRect(x * BOX_SIZE, y * BOX_SIZE, BOX_SIZE, BOX_SIZE);
};
