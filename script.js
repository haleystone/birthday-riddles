const groups = [
  {
    name: "Albatross species",
    words: ["Wandering", "Sooty", "Buller’s", "Laysan"],
    color: "#f6d365"
  },
  {
    name: "Hyrax species",
    words: ["Bush", "Rock", "Eastern Tree", "Benin Tree"],
    color: "#c3e6cb"
  },
  {
    name: "Venomous mammals",
    words: ["Platypus", "Slow loris", "Solenodon", "Shrew"],
    color: "#d7c7ff"
  },
  {
    name: "Baby animal names",
    words: ["Puffling", "Weaner", "Pup", "Chick"],
    color: "#a9d8ff"
  }
];

let tiles = [];
let selected = [];
let solvedGroups = [];
let mistakes = 0;

const grid = document.getElementById("grid");
const solvedArea = document.getElementById("solved-area");
const message = document.getElementById("message");
const mistakesText = document.getElementById("mistakes");
const finalMessage = document.getElementById("final-message");

const submitButton = document.getElementById("submit-button");
const deselectButton = document.getElementById("deselect-button");
const shuffleButton = document.getElementById("shuffle-button");

function startGame() {
  tiles = groups.flatMap(group =>
    group.words.map(word => ({
      word: word,
      group: group.name
    }))
  );

  shuffleTiles();
  render();
}

function shuffleTiles() {
  tiles.sort(() => Math.random() - 0.5);
}

function render() {
  grid.innerHTML = "";

  tiles.forEach(tile => {
    if (solvedGroups.includes(tile.group)) {
      return;
    }

    const button = document.createElement("button");
    button.className = "tile";
    button.textContent = tile.word;

    if (selected.includes(tile.word)) {
      button.classList.add("selected");
    }

    button.addEventListener("click", () => toggleTile(tile.word));
    grid.appendChild(button);
  });

  renderSolvedGroups();
  mistakesText.textContent = `Mistakes: ${mistakes}`;
}

function renderSolvedGroups() {
  solvedArea.innerHTML = "";

  solvedGroups.forEach(groupName => {
    const group = groups.find(g => g.name === groupName);

    const div = document.createElement("div");
    div.className = "solved-group";
    div.style.background = group.color;

    div.innerHTML = `
      ${group.name}
      <span>${group.words.join(", ")}</span>
    `;

    solvedArea.appendChild(div);
  });
}

function toggleTile(word) {
  message.textContent = "";

  if (selected.includes(word)) {
    selected = selected.filter(item => item !== word);
  } else {
    if (selected.length === 4) {
      message.textContent = "You can only pick four.";
      return;
    }

    selected.push(word);
  }

  render();
}

function submitGuess() {
  if (selected.length !== 4) {
    message.textContent = "Pick exactly four tiles.";
    return;
  }

  const matchingGroup = groups.find(group =>
    group.words.every(word => selected.includes(word))
  );

  if (matchingGroup && !solvedGroups.includes(matchingGroup.name)) {
    solvedGroups.push(matchingGroup.name);
    selected = [];
    message.textContent = "Correct!";

    if (solvedGroups.length === groups.length) {
      message.textContent = "";
      finalMessage.style.display = "block";
    }
  } else {
    mistakes++;
    message.textContent = "Not quite.";
  }

  render();
}

function deselectAll() {
  selected = [];
  message.textContent = "";
  render();
}

submitButton.addEventListener("click", submitGuess);

deselectButton.addEventListener("click", deselectAll);

shuffleButton.addEventListener("click", () => {
  shuffleTiles();
  render();
});

startGame();
