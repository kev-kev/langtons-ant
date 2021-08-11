window.addEventListener("load", () => {
  const canvas = document.getElementById("myCanvas");
  window.ctx = canvas.getContext("2d");
  const game = new Game();
  setInterval(() => game.moveAnt(), 100);
});

// canvas size is 500x500, so using 5px boxes gives us a 100x100 grid
const BOX_SIZE = 5;

class Game {
  constructor() {
    this.curBox = [50, 50]; // start in middle
    this.direction = 0; // 0 degrees = north, 90 = east, etc...
    addRuleToList("#000000", "R");
    addRuleToList("#FFFFFF", "L");
    this.ruleArr = [];
  }

  // get all the colors and directions from ruleList (build a 2d arr of [color, dir])
  // get the color of the box the ant is on
  // rotate the ant the corresponding direction
  // change the color to the next color in the series from the ruleList
  // move the ant to the space in front of it

  moveAnt() {
    // if on an empty box, turn 90 CCW, flip the color, move forward
    // if on a filled box, turn 90 CW, flip the color, move forward
    this.isCoordinateFilled(this.curBox, this.direction)
      ? (this.direction -= 90)
      : (this.direction += 90);

    if (Math.abs(this.direction) === 360) this.direction = 0;
    this.colorBox(this.curBox);
    const nextBox = this.getBoxInFront();
    this.curBox = nextBox;
  }

  getCoordinateInfo(coords) {
    let x, y;
    [x, y] = coords;
    const imageData = window.ctx.getImageData(x * BOX_SIZE, y * BOX_SIZE, 1, 1);

    console.log(imageData["data"]);
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

  isCoordinateFilled(coords) {
    let x, y;
    [x, y] = coords;
    const imageData = window.ctx.getImageData(x * BOX_SIZE, y * BOX_SIZE, 1, 1);
    return imageData["data"]["3"] > 0;
  }

  colorBox(coords) {
    let x, y;
    [x, y] = coords;
    this.isCoordinateFilled(coords) ? this.clearBox(x, y) : this.fillBox(x, y);
  }

  fillBox(x, y, color = "#000000") {
    window.ctx.fillStyle = color;
    window.ctx.fillRect(x * BOX_SIZE, y * BOX_SIZE, BOX_SIZE, BOX_SIZE);
  }

  clearBox(x, y) {
    window.ctx.clearRect(x * BOX_SIZE, y * BOX_SIZE, BOX_SIZE, BOX_SIZE);
  }
}

const addRuleButton = document.getElementById("addRuleButton");
addRuleButton.addEventListener("click", handleClick);
const ruleList = document.getElementById("ruleList");

function getRandomColor() {
  const chars = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += chars[Math.floor(Math.random() * 16)];
  }
  return color;
}

function handleClick(e) {
  const randDir = Math.round(Math.random()) === 0 ? "R" : "L";
  addRuleToList(getRandomColor(), randDir);
}

function addRuleToList(color, direction) {
  debugger;
  const ruleForm = document.createElement("form");
  createInputs(ruleForm);
  direction === "L"
    ? (ruleForm.children[1].checked = true)
    : (ruleForm.children[3].checked = true);
  ruleForm.children[0].value = color;
  ruleList.appendChild(ruleForm);
}

function createInputs(ruleForm) {
  const colorInput = document.createElement("input");
  colorInput.setAttribute("type", "color");
  colorInput.setAttribute("class", "colorInput");
  ruleForm.appendChild(colorInput);
  for (let i = 0; i < 2; i++) {
    const dirInput = document.createElement("input");
    const label = document.createElement("label");
    i === 0 ? (label.innerHTML = "L") : (label.innerHTML = "R");
    dirInput.setAttribute("type", "radio");
    dirInput.setAttribute("class", "radio");
    dirInput.setAttribute("name", "radio");
    ruleForm.appendChild(dirInput);
    ruleForm.appendChild(label);
  }
}
