const entries = [
  {
    number: 1,
    direction: "down",
    row: 4,
    col: 9,
    answer: "WOBBUFFET",
    clue: "why? why not?",
    icon: "clues/why.jpeg"
  },
  {
    number: 2,
    direction: "down",
    row: 1,
    col: 12,
    answer: "GREGORY",
    clue: "pixilated grasshopper",
    icon: "clues/gregory.jpeg"
  },
  {
    number: 3,
    direction: "across",
    row: 2,
    col: 11,
    answer: "GROUDON",
    clue: "Where is ____?",
    icon: "clues/waldo.jpeg"
  },
  {
    number: 4,
    direction: "across",
    row: 7,
    col: 2,
    answer: "SPARERIBS",
    clue: "what is a skeleton's favourite snack?",
    icon: "clues/skeleton.jpeg"
  },
  {
    number: 5,
    direction: "down",
    row: 4,
    col: 15,
    answer: "LEBRON",
    clue: "move that made ___ cry",
    icon: "clues/basketball.jpeg"
  },
  {
    number: 6,
    direction: "across",
    row: 10,
    col: 4,
    answer: "BAG",
    clue: "what kind of ___ is that?",
    icon: "clues/bag.jpeg"
  },
  {
    number: 7,
    direction: "down",
    row: 7,
    col: 17,
    answer: "THREE",
    clue: "every __ months a person is torn to pieces by a crocodile in North Queensland",
    icon: "clues/bob.jpeg"
  },
  {
    number: 8,
    direction: "down",
    row: 0,
    col: 16,
    answer: "FOOD",
    clue: "In the mood, for ____",
    icon: "clues/pooh.jpeg"
  },
  {
    number: 9,
    direction: "across",
    row: 12,
    col: 6,
    answer: "TOOTHLESS",
    clue: "year of the dragon dance meme",
    icon: "clues/toothless.jpeg"
  },
  {
    number: 10,
    direction: "down",
    row: 5,
    col: 6,
    answer: "TIEFIGHTERS",
    clue: "Two ______ share a romantic dinner",
    icon: "clues/date.jpeg"
  },
  {
    number: 11,
    direction: "down",
    row: 7,
    col: 2,
    answer: "SPLAT",
    clue: "cool, moist, and away from aquatic predators. The mud is the perfect place for clodsire to raise their young",
    icon: "clues/mud.jpeg"
  },
  {
    number: 12,
    direction: "down",
    row: 3,
    col: 5,
    answer: "WRR",
    clue: "words of wisdom from an airbus",
    icon: "clues/plane.jpeg"
  },
  {
    number: 13,
    direction: "across",
    row: 14,
    col: 6,
    answer: "R2D2",
    clue: 'best at singing the song "I feel good"',
    icon: "clues/r2d2.jpeg"
  },
  {
    number: 14,
    direction: "down",
    row: 9,
    col: 12,
    answer: "KERERU",
    clue: "orb bird using fermented berries",
    icon: "clues/berries.jpeg"
  },
  {
    number: 15,
    direction: "across",
    row: 5,
    col: 0,
    answer: "DINNERTOMORROWME",
    clue: "hey just checking you cleared your calendar for dinner tomorrow right?",
    icon: "clues/dinner.jpeg"
  },
  {
    number: 16,
    direction: "across",
    row: 9,
    col: 14,
    answer: "ENERGY",
    clue: "she is no longer matching ____. She is simply removing herself from any situation that doesn't vibrate her soul.",
    icon: "clues/shep.jpeg"
  },
  {
    number: 17,
    direction: "down",
    row: 5,
    col: 0,
    answer: "DEATH",
    clue: "There is no escape. The only hope is the sweet relief of _____",
    icon: "clues/star.jpeg"
  }
];

const crossword = document.getElementById("crossword");
const acrossClues = document.getElementById("across-clues");
const downClues = document.getElementById("down-clues");
const checkButton = document.getElementById("check-button");
const clearButton = document.getElementById("clear-button");
const message = document.getElementById("message");
const finalMessage = document.getElementById("final-message");

const rows = 16;
const cols = 20;
const solution = {};
const startNumbers = {};

function key(row, col) {
  return `${row},${col}`;
}

function buildSolution() {
  entries.forEach(entry => {
    const deltaRow = entry.direction === "down" ? 1 : 0;
    const deltaCol = entry.direction === "across" ? 1 : 0;

    const startKey = key(entry.row, entry.col);

    if (!startNumbers[startKey]) {
      startNumbers[startKey] = [];
    }

    startNumbers[startKey].push(entry.number);

    for (let i = 0; i < entry.answer.length; i++) {
      const row = entry.row + deltaRow * i;
      const col = entry.col + deltaCol * i;
      const cellKey = key(row, col);
      const letter = entry.answer[i];

      if (solution[cellKey] && solution[cellKey] !== letter) {
        console.error("Letter conflict at", cellKey, solution[cellKey], letter);
      }

      solution[cellKey] = letter;
    }
  });
}

function renderGrid() {
  crossword.style.gridTemplateColumns = `repeat(${cols}, 34px)`;

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const cellKey = key(row, col);
      const cell = document.createElement("div");

      if (!solution[cellKey]) {
        cell.className = "cell block";
        crossword.appendChild(cell);
        continue;
      }

      cell.className = "cell";
      cell.dataset.key = cellKey;

      if (startNumbers[cellKey]) {
        const number = document.createElement("span");
        number.className = "cell-number";
        number.textContent = startNumbers[cellKey].join("/");
        cell.appendChild(number);
      }

      const input = document.createElement("input");
      input.maxLength = 1;
      input.dataset.key = cellKey;
      input.autocomplete = "off";

      input.addEventListener("input", () => {
        input.value = input.value.toUpperCase();
        moveToNextInput(input);
      });

      cell.appendChild(input);
      crossword.appendChild(cell);
    }
  }
}

function renderClues() {
  entries.forEach(entry => {
    const li = document.createElement("li");
    li.value = entry.number;

    const row = document.createElement("div");
    row.className = "clue-row";

    const clueText = document.createElement("span");
    clueText.textContent = entry.clue;

    row.appendChild(clueText);

    if (entry.icon) {
      const hintButton = document.createElement("button");
      hintButton.className = "hint-button";
      hintButton.textContent = "Hint";

      const img = document.createElement("img");
      img.className = "clue-image-icon hidden";
      img.src = entry.icon;
      img.alt = "Hint image";

      hintButton.addEventListener("click", () => {
        img.classList.toggle("hidden");

        if (img.classList.contains("hidden")) {
          hintButton.textContent = "Hint";
        } else {
          hintButton.textContent = "Hide hint";
        }
      });

      row.appendChild(hintButton);
      row.appendChild(img);
    }

    li.appendChild(row);

    if (entry.direction === "across") {
      acrossClues.appendChild(li);
    } else {
      downClues.appendChild(li);
    }
  });
}
function moveToNextInput(input) {
  if (!input.value) {
    return;
  }

  const inputs = Array.from(document.querySelectorAll(".cell input"));
  const index = inputs.indexOf(input);

  if (inputs[index + 1]) {
    inputs[index + 1].focus();
  }
}

function checkAnswers() {
  const inputs = document.querySelectorAll(".cell input");
  let correctCount = 0;
  let totalCount = 0;

  inputs.forEach(input => {
    const cell = input.parentElement;
    const cellKey = input.dataset.key;
    const correctLetter = solution[cellKey];
    const guessedLetter = input.value.toUpperCase();

    cell.classList.remove("correct", "incorrect");

    totalCount++;

    if (guessedLetter === correctLetter) {
      cell.classList.add("correct");
      correctCount++;
    } else {
      cell.classList.add("incorrect");
    }
  });

  if (correctCount === totalCount) {
    message.textContent = "Correct! Crossword complete.";
    finalMessage.style.display = "block";
  
    document.querySelector(".crossword-layout").style.display = "none";
    document.querySelector(".controls").style.display = "none";
  } else {
    message.textContent = `${correctCount} / ${totalCount} letters correct.`;
    finalMessage.style.display = "none";
  }
}

function clearGrid() {
  const inputs = document.querySelectorAll(".cell input");

  inputs.forEach(input => {
    input.value = "";
    input.parentElement.classList.remove("correct", "incorrect");
  });

  message.textContent = "";
  finalMessage.style.display = "none";
}

checkButton.addEventListener("click", checkAnswers);
clearButton.addEventListener("click", clearGrid);

buildSolution();
renderGrid();
renderClues();
