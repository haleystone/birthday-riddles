const puzzle = [
  [0,0,0,0,0,0,0,1,2],
  [0,0,0,0,0,0,0,0,0],
  [0,0,1,0,9,5,0,0,0],
  [0,0,0,0,0,0,4,0,0],
  [0,0,0,4,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0],
  [5,0,0,1,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0]
];

const solution = [
  [9,5,6,3,4,8,7,1,2],
  [3,7,4,2,1,6,9,5,8],
  [2,8,1,7,9,5,3,6,4],
  [1,9,8,5,6,2,4,7,3],
  [6,2,7,4,3,1,8,9,5],
  [4,3,5,8,7,9,2,1,6],
  [5,6,2,1,8,4,9,3,7],
  [7,1,9,6,2,3,5,8,4],
  [8,4,3,9,5,7,1,2,6]
];

const board = document.getElementById("sudoku-board");
const checkButton = document.getElementById("check-button");
const clearButton = document.getElementById("clear-button");
const solutionButton = document.getElementById("solution-button");
const message = document.getElementById("message");
const finalMessage = document.getElementById("final-message");

function renderBoard() {
  board.innerHTML = "";

  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      const cell = document.createElement("div");
      cell.className = "cell";

      const input = document.createElement("input");
      input.maxLength = 1;
      input.inputMode = "numeric";
      input.dataset.row = row;
      input.dataset.col = col;
      input.autocomplete = "off";

      if (puzzle[row][col] !== 0) {
        input.value = puzzle[row][col];
        input.disabled = true;
        cell.classList.add("given");
      }

      input.addEventListener("input", () => {
        input.value = input.value.replace(/[^1-9]/g, "");
        cell.classList.remove("correct", "incorrect");
        message.textContent = "";
      });

      cell.appendChild(input);
      board.appendChild(cell);
    }
  }
}

function checkSudoku() {
  const inputs = document.querySelectorAll(".cell input");
  let correctCount = 0;
  let filledCount = 0;

  inputs.forEach(input => {
    const row = Number(input.dataset.row);
    const col = Number(input.dataset.col);
    const cell = input.parentElement;
    const value = input.value;

    cell.classList.remove("correct", "incorrect");

    if (value) {
      filledCount++;
    }

    if (value === String(solution[row][col])) {
      correctCount++;

      if (!input.disabled) {
        cell.classList.add("correct");
      }
    } else if (value) {
      cell.classList.add("incorrect");
    }
  });

  if (correctCount === 81) {
    message.textContent = "Correct! Sudoku complete.";
    finalMessage.style.display = "block";
  } else {
    message.textContent = `${correctCount} / 81 cells correct. ${81 - filledCount} cells still empty.`;
    finalMessage.style.display = "none";
  }
}

function clearGuesses() {
  const inputs = document.querySelectorAll(".cell input");

  inputs.forEach(input => {
    if (!input.disabled) {
      input.value = "";
      input.parentElement.classList.remove("correct", "incorrect");
    }
  });

  message.textContent = "";
  finalMessage.style.display = "none";
}

function showSolution() {
  const inputs = document.querySelectorAll(".cell input");

  inputs.forEach(input => {
    const row = Number(input.dataset.row);
    const col = Number(input.dataset.col);

    input.value = solution[row][col];
    input.parentElement.classList.remove("incorrect");
    input.parentElement.classList.add("correct");
  });

  message.textContent = "Solution revealed. Agent Pebbles is judging kindly.";
  finalMessage.style.display = "block";
}

checkButton.addEventListener("click", checkSudoku);
clearButton.addEventListener("click", clearGuesses);
solutionButton.addEventListener("click", showSolution);

renderBoard();
