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
    this.rulesArr = [];
    addRuleToList([0, 0, 0, 255], "R");
    addRuleToList([0, 0, 0, 0], "L");
    this.getRules();
  }

  // get all the colors and directions from ruleList (build a 2d arr of [color, dir])
  // get the color of the box the ant is on
  // rotate the ant the corresponding direction
  // change the color to the next color in the series from the ruleList
  // move the ant to the space in front of it

  moveAnt() {
    // if on an empty box, turn 90 CCW, flip the color, move forward
    // if on a filled box, turn 90 CW, flip the color, move forward
    const ruleList = document.getElementById("ruleList");
    if (ruleList.children.length !== this.rulesArr.length) this.getRules();
    const curColor = this.getCoordinateColor(this.curBox, this.direction);
    debugger;

    this.isCoordinateFilled(this.curBox, this.direction)
      ? (this.direction -= 90)
      : (this.direction += 90);
    if (Math.abs(this.direction) === 360) this.direction = 0;
    this.colorBox(this.curBox);
    const nextBox = this.getBoxInFront();
    this.curBox = nextBox;
  }

  getRules() {
    this.rulesArr = [];
    const ruleList = document.getElementById("ruleList");
    const ruleCount = ruleList.children.length;
    for (let i = 0; i < ruleCount; i++) {
      const color = ruleList.children[i].children[0].value;
      let dir;
      ruleList.children[i].children[1].checked ? (dir = "L") : (dir = "R");
      this.rulesArr.push([color, dir]);
    }
  }

  getCoordinateColor(coords) {
    let x, y;
    [x, y] = coords;
    return window.ctx.getImageData(x * BOX_SIZE, y * BOX_SIZE, 1, 1)["data"];
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

  fillBox(x, y, color = [0, 0, 0, 0]) {
    window.ctx.fillStyle = color;
    window.ctx.fillRect(x * BOX_SIZE, y * BOX_SIZE, BOX_SIZE, BOX_SIZE);
  }

  clearBox(x, y) {
    window.ctx.clearRect(x * BOX_SIZE, y * BOX_SIZE, BOX_SIZE, BOX_SIZE);
  }
}

const addRuleButton = document.getElementById("addRuleButton");
addRuleButton.addEventListener("click", handleClick);

function handleClick(e) {
  const randomDir = Math.round(Math.random()) === 0 ? "R" : "L";
  addRuleToList(getRandomColor(), randomDir);
}

function addRuleToList(color, direction) {
  const ruleList = document.getElementById("ruleList");
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

function getRandomColor() {
  const res = [];
  for (let i = 0; i < 4; i++) {
    res.push(Math.floor(Math.random() * 256));
  }
  return res;
}

function rgbaToHex(rgbaArr) {
  let r, g, b, a;
  [r, g, b, a] = rgbaArr;
  r = r.toString(16);
  g = g.toString(16);
  b = b.toString(16);
  a = a.toString(16);

  if (r.length == 1) r = "0" + r;
  if (g.length == 1) g = "0" + g;
  if (b.length == 1) b = "0" + b;

  return "#" + r + g + b;
}

function hexToRgba(hexStr) {
  let r = 0,
    g = 0,
    b = 0,
    a = 1;

  if (hexStr.length == 5) {
    r = parseInt(hexStr[1] + hexStr[1]);
    g = parseInt(hexStr[2] + hexStr[2]);
    b = parseInt(hexStr[3] + hexStr[3]);
    a = parseInt(hexStr[4] + hexStr[4]);
  }

  return [r, g, b, a];
}
