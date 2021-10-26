window.addEventListener("load", () => {
  const canvas = document.getElementById("myCanvas");
  window.ctx = canvas.getContext("2d");
  const game = new Game();
  for (let i = 0; i < game.ants.length; i++) {
    setInterval(() => game.ants[i].move(), 20);
  }
});

// canvas size is 500x500, so using 5px boxes gives us a 100x100 grid
const BOX_SIZE = 2;

document.getElementById("newAntForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const dir = document.getElementById("dirSelect").value;
  const x = document.getElementById("x").value;
  const y = document.getElementById("y").value;
});

class Game {
  constructor() {
    this.ants = [new Ant([125, 125], 0)];
  }
}

class Ant {
  constructor(coords, dir) {
    this.coords = coords;
    this.dir = dir;
  }
  move() {
    // if on an empty box, turn 90 CCW, flip the color, move forward
    // if on a filled box, turn 90 CW, flip the color, move forward

    this.isCoordinateFilled(this.coords, this.dir)
      ? (this.dir -= 90)
      : (this.dir += 90);

    if (Math.abs(this.dir) === 360) this.dir = 0;
    this.flipBox(this.coords, this.dir);
    const nextBox = this.getBoxInFront();
    this.coords = nextBox;
  }

  getBoxInFront() {
    switch (this.dir) {
      case 0:
        return [this.coords[0], this.coords[1] - 1];
      case 90:
      case -270:
        return [this.coords[0] + 1, this.coords[1]];
      case 180:
      case -180:
        return [this.coords[0], this.coords[1] + 1];
      case 270:
      case -90:
        return [this.coords[0] - 1, this.coords[1]];
    }
  }

  isCoordinateFilled(coords) {
    let x, y;
    [x, y] = coords;
    const imageData = window.ctx.getImageData(x * BOX_SIZE, y * BOX_SIZE, 1, 1);
    return imageData["data"]["3"] > 0;
  }

  flipBox(coords) {
    let x, y;
    [x, y] = coords;
    this.isCoordinateFilled(coords) ? this.clearBox(x, y) : this.fillBox(x, y);
  }

  fillBox(x, y, color = "black") {
    window.ctx.fillStyle = color;
    window.ctx.fillRect(x * BOX_SIZE, y * BOX_SIZE, BOX_SIZE, BOX_SIZE);
  }

  clearBox(x, y) {
    window.ctx.clearRect(x * BOX_SIZE, y * BOX_SIZE, BOX_SIZE, BOX_SIZE);
  }
}
