const solution = [
  [0,0,0,1,1,1,1,0,0,0],
  [0,0,1,1,1,1,1,1,0,0],
  [0,1,1,0,1,1,0,1,1,0],
  [0,1,1,1,1,1,1,1,1,0],
  [1,1,0,1,1,1,1,0,1,1],
  [1,1,1,1,1,1,1,1,1,1],
  [0,1,1,1,1,1,1,1,1,0],
  [0,0,1,1,1,1,1,1,0,0],
  [0,0,0,1,1,1,1,0,0,0],
  [0,0,1,1,0,0,1,1,0,0]
];

const board = document.getElementById("nonogram");
const checkButton = document.getElementById("check-button");
const clearButton = document.getElementById("clear-button");
const solutionButton = document.getElementById("solution-button");
const message = document.getElementById("message");
const finalMessage = document.getElementById("final-message");

const size = 10;

function getClues(line) {
  const clues = [];
  let count = 0;

  line.forEach(value => {
    if (value === 1) {
      count++;
    } else if (count > 0) {
      clues.push(count);
      count = 0;
    }
  });

  if (count > 0) {
    clues.push(count);
  }

  return clues.length ? clues : [0];
}

function getColumn(index) {
  return solution.map(row => row[index]);
}

function renderBoard() {
  board.innerHTML = "";

  const corner = document.createElement("div");
  corner.className = "corner";
  board.appendChild(corner);

  for (let col = 0; col < size; col++) {
    const clue = document.createElement("div");
    clue.className = "top-clue";
    clue.textContent = getClues(getColumn(col)).join("\n");
    board.appendChild(clue);
  }

  for (let row = 0; row < size; row++) {
    const rowClue = document.createElement("div");
    rowClue.className = "side-clue";
    rowClue.textContent = getClues(solution[row]).join(" ");
    board.appendChild(rowClue);

    for (let col = 0; col < size; col++) {
      const cell = document.createElement("button");
      cell.className = "cell";
      cell.type = "button";
      cell.dataset.row = row;
      cell.dataset.col = col;
      cell.setAttribute("aria-label", `Row ${row + 1}, column ${col + 1}`);

      cell.addEventListener("click", () => {
        cell.classList.remove("correct", "incorrect");

        if (cell.classList.contains("marked")) {
          cell.classList.remove("marked");
        }

        cell.classList.toggle("filled");
        message.textContent = "";
      });

      cell.addEventListener("contextmenu", event => {
        event.preventDefault();
        cell.classList.remove("correct", "incorrect");

        if (cell.classList.contains("filled")) {
          cell.classList.remove("filled");
        }

        cell.classList.toggle("marked");
        message.textContent = "";
      });

      board.appendChild(cell);
    }
  }
}

function checkBoard() {
  const cells = document.querySelectorAll(".cell");
  let correct = 0;

  cells.forEach(cell => {
    const row = Number(cell.dataset.row);
    const col = Number(cell.dataset.col);
    const shouldBeFilled = solution[row][col] === 1;
    const isFilled = cell.classList.contains("filled");

    cell.classList.remove("correct", "incorrect");

    if (isFilled === shouldBeFilled) {
      correct++;
      cell.classList.add("correct");
    } else {
      cell.classList.add("incorrect");
    }
  });

  if (correct === size * size) {
    message.textContent = "Correct! Penguin complete.";
    finalMessage.style.display = "block";
  } else {
    message.textContent = `${correct} / ${size * size} squares correct.`;
    finalMessage.style.display = "none";
  }
}

function clearBoard() {
  const cells = document.querySelectorAll(".cell");

  cells.forEach(cell => {
    cell.classList.remove("filled", "marked", "correct", "incorrect");
  });

  message.textContent = "";
  finalMessage.style.display = "none";
}

function showSolution() {
  const cells = document.querySelectorAll(".cell");

  cells.forEach(cell => {
    const row = Number(cell.dataset.row);
    const col = Number(cell.dataset.col);

    cell.classList.remove("marked", "correct", "incorrect");

    if (solution[row][col] === 1) {
      cell.classList.add("filled");
    } else {
      cell.classList.remove("filled");
    }
  });

  message.textContent = "Solution revealed. It was penguin all along.";
  finalMessage.style.display = "block";
}

checkButton.addEventListener("click", checkBoard);
clearButton.addEventListener("click", clearBoard);
solutionButton.addEventListener("click", showSolution);

renderBoard();
