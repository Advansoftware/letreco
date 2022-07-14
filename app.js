const tiles = document.querySelector(".tile-container");
const backspaceAndEnterRow = document.querySelector("#backspaceAndEnterRow");
const keyboardFirstRow = document.querySelector("#keyboardFirstRow");
const keyboardSecondRow = document.querySelector("#keyboardSecondRow");
const keyboardThirdRow = document.querySelector("#keyboardThirdRow");

const keysFirstRow = ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"];
const keysSecondRow = ["A", "S", "D", "F", "G", "H", "J", "K", "L"];
const keysThirdRow = ["Z", "X", "C", "V", "B", "N", "M"];

let letrecoMap = {};
let sort = Math.floor(Math.random() * letreco.length);
const rows = 6;
const columns = letreco[sort].length;
let currentRow = 0;
let currentColumn = 0;

for (let index = 0; index < letreco[sort].length; index++) {
  letrecoMap[letreco[sort][index]] = index;
}
const guesses = [];
for (let rowIndex = 0; rowIndex < rows; rowIndex++) {
  guesses[rowIndex] = new Array(columns);
  const tileRow = document.createElement("div");
  tileRow.setAttribute("id", "row" + rowIndex);
  tileRow.setAttribute("class", "tile-row");
  for (let columnIndex = 0; columnIndex < columns; columnIndex++) {
    const tileColumn = document.createElement("div");
    tileColumn.setAttribute("id", "row" + rowIndex + "column" + columnIndex);
    tileColumn.setAttribute(
      "class",
      rowIndex === 0 ? "tile-column typing" : "tile-column disabled"
    );
    tileRow.append(tileColumn);
    guesses[rowIndex][columnIndex] = "";
  }
  tiles.append(tileRow);
}
function addClass(id, classe) {
  var elemento = document.getElementById(id);
  var classes = elemento.className.split(" ");
  var getIndex = classes.indexOf(classe);

  if (getIndex === -1) {
    classes.push(classe);
    elemento.className = classes.join(" ");
  }
}

function removeClass(id, classe) {
  var elemento = document.getElementById(id);
  var classes = elemento.className.split(" ");
  var getIndex = classes.indexOf(classe);

  if (getIndex > -1) {
    classes.splice(getIndex, 1);
  }
  elemento.className = classes.join(" ");
}
const checkGuess = () => {
  enableKeyboard();
  const guess = guesses[currentRow].join("");
  let usedWord = [];
  let verify = [];
  if (guess.length !== columns) return;
  var currentColumns = document.querySelectorAll(".typing");
  for (let index = 0; index < columns; index++) {
    const letter = guess[index];
    if (letrecoMap[letter] === undefined)
      usedWord.push({ letter, state: "wrong" });
    else {
      letrecoMap[letter] === index
        ? usedWord.push({ letter, state: "right" })
        : verify.includes(letter)
        ? usedWord.push({ letter, state: "wrong" })
        : usedWord.push({ letter, state: "displaced" });
    }
    verify.push(letter);
    usedWord.forEach((columns, index) => {
      currentColumns[index].classList.add(columns.state);
      addClass(guess[index], columns.state);
    });
  }
  if (guess === letreco[sort]) {
    disableKeyboard();
    disableActionButton();
    window.alert("tu é demais, simplesmente o detetivao do entreterimento!");
    return;
  }
  {
    if (currentRow === rows - 1) {
      disableKeyboard();
      disableActionButton();
      window.alert("Errrrrrou!");
    } else {
      moveToNextRow();
    }
  }
};

const moveToNextRow = () => {
  var typingColumns = document.querySelectorAll(".typing");
  for (let index = 0; index < typingColumns.length; index++) {
    typingColumns[index].classList.remove("typing");
    typingColumns[index].classList.add("disabled");
  }
  currentRow++;
  currentColumn = 0;

  const currentRowEl = document.querySelector("#row" + currentRow);
  var currentColumns = currentRowEl.querySelectorAll(".tile-column");
  for (let index = 0; index < currentColumns.length; index++) {
    currentColumns[index].classList.remove("disabled");
    currentColumns[index].classList.add("typing");
  }
};

const handleKeyboardOnClick = (key) => {
  if (currentColumn === columns) return;
  if (currentColumn === columns - 1) disableKeyboard();
  const currentTile = document.querySelector(
    "#row" + currentRow + "column" + currentColumn
  );
  currentTile.textContent = key;
  guesses[currentRow][currentColumn] = key;
  currentColumn++;
};

const createKeyboardRow = (keys, keyboardRow) => {
  keys.forEach((key) => {
    var buttonElement = document.createElement("button");
    buttonElement.textContent = key;
    buttonElement.setAttribute("id", key);
    buttonElement.setAttribute("class", "keyItem");
    buttonElement.addEventListener("click", () => handleKeyboardOnClick(key));
    keyboardRow.append(buttonElement);
  });
};

createKeyboardRow(keysFirstRow, keyboardFirstRow);
createKeyboardRow(keysSecondRow, keyboardSecondRow);
createKeyboardRow(keysThirdRow, keyboardThirdRow);

const disableActionButton = () => {
  const currentEl = document.querySelectorAll(".actionButton");
  currentEl.forEach((buttons) => {
    buttons.setAttribute("disabled", true);
    buttons.style.cursor = "default";
  });
};
const disableKeyboard = () => {
  const currentEl = document.querySelectorAll(".keyItem");
  currentEl.forEach((buttons) => {
    buttons.setAttribute("disabled", true);
    buttons.style.cursor = "default";
  });
};
const enableKeyboard = () => {
  const currentEl = document.querySelectorAll(".keyItem");
  currentEl.forEach((buttons) => {
    buttons.removeAttribute("disabled");
    buttons.style.cursor = "pointer";
  });
};

const handleBackspace = () => {
  if (currentColumn === 0) {
    return;
  }
  enableKeyboard();
  currentColumn--;
  guesses[currentRow][currentColumn] = "";
  const tile = document.querySelector(
    "#row" + currentRow + "column" + currentColumn
  );
  tile.textContent = "";
};

const backspaceButton = document.createElement("button");
backspaceButton.addEventListener("click", handleBackspace);
backspaceButton.setAttribute("class", "actionButton");
backspaceButton.textContent = "<";
backspaceAndEnterRow.append(backspaceButton);

const enterButton = document.createElement("button");
enterButton.addEventListener("click", checkGuess);
enterButton.setAttribute("class", "actionButton");
enterButton.textContent = "ENTER";
backspaceAndEnterRow.append(enterButton);

document.onkeydown = function (evt) {
  evt = evt || window.evt;
  if (evt.key === "Enter") {
    checkGuess();
  } else if (evt.key === "Backspace") {
    handleBackspace();
  } else {
    handleKeyboardOnClick(evt.key.toUpperCase());
  }
};
