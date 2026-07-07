const rounds = [
  {
    image: "images/littlem.png",
    placeName: "The Little Marionette - where we first met",
    latitude: -33.91699418928862,
    longitude: 151.23492268042054,
    month: "March",
    year: "2022"
  },
  {
    image: "images/library.png",
    placeName: "Lionel Bowen Library - where we declared our relationship",
    latitude: -33.93814942489405,
    longitude: 151.2381681981487,
    month: "July",
    year: "2024"
  },
  {
    image: "images/kangaroovalley.jpg",
    placeName: "Kangaroo Valley - our first trip together",
    latitude: -34.72671865078512,
    longitude: 150.52079187797955,
    month: "December",
    year: "2022"
  },
  {
    image: "images/travelscotland.jpg",
    placeName: "Edinburgh - our first trip in Scotland together",
    latitude: 55.953318634834204,
    longitude: -3.193068329311077,
    month: "September",
    year: "2025"
  }
];

let currentRound = 0;
let guessedLocation = null;
let guessMarker = null;
let answerMarker = null;
let line = null;
let totalScore = 0;

const roundInfo = document.getElementById("round-info");
const placeImage = document.getElementById("place-image");
const monthGuess = document.getElementById("month-guess");
const yearGuess = document.getElementById("year-guess");
const submitButton = document.getElementById("submit-guess");
const nextButton = document.getElementById("next-round");
const message = document.getElementById("message");

const resultCard = document.getElementById("result-card");
const correctPlace = document.getElementById("correct-place");
const distanceResult = document.getElementById("distance-result");
const dateResult = document.getElementById("date-result");
const scoreResult = document.getElementById("score-result");
const finalMessage = document.getElementById("final-message");

const map = L.map("map").setView([20, 0], 2);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution: "&copy; OpenStreetMap contributors"
}).addTo(map);

map.on("click", function (event) {
  guessedLocation = event.latlng;

  if (guessMarker) {
    map.removeLayer(guessMarker);
  }

  guessMarker = L.marker(guessedLocation).addTo(map);
  message.textContent = "Location selected.";
});

function loadRound() {
  const round = rounds[currentRound];

  roundInfo.textContent = `Round ${currentRound + 1} of ${rounds.length}`;
  placeImage.src = round.image;

  guessedLocation = null;
  monthGuess.value = "";
  yearGuess.value = "";
  message.textContent = "";

  resultCard.style.display = "none";
  finalMessage.style.display = "none";
  submitButton.disabled = false;
  nextButton.style.display = "inline-block";

  if (guessMarker) {
    map.removeLayer(guessMarker);
    guessMarker = null;
  }

  if (answerMarker) {
    map.removeLayer(answerMarker);
    answerMarker = null;
  }

  if (line) {
    map.removeLayer(line);
    line = null;
  }

  map.setView([20, 0], 2);

  setTimeout(() => {
    map.invalidateSize();
  }, 100);
}

function submitGuess() {
  const round = rounds[currentRound];

  if (!guessedLocation) {
    message.textContent = "Click the map to guess the location.";
    return;
  }

  if (!monthGuess.value || !yearGuess.value) {
    message.textContent = "Guess both the month and the year.";
    return;
  }

  const distanceKm = calculateDistanceKm(
    guessedLocation.lat,
    guessedLocation.lng,
    round.latitude,
    round.longitude
  );

  const monthCorrect = monthGuess.value === round.month;
  const yearCorrect = String(yearGuess.value) === String(round.year);

  const locationScore = calculateLocationScore(distanceKm);
  const dateScore = calculateDateScore(monthCorrect, yearCorrect);
  const roundScore = locationScore + dateScore;

  totalScore += roundScore;

  answerMarker = L.marker([round.latitude, round.longitude]).addTo(map);

  line = L.polyline(
    [
      [guessedLocation.lat, guessedLocation.lng],
      [round.latitude, round.longitude]
    ],
    { color: "#2f6f73" }
  ).addTo(map);

  map.fitBounds(line.getBounds(), {
    padding: [40, 40]
  });

  correctPlace.textContent = `Correct place: ${round.placeName}`;
  distanceResult.textContent = `You were ${distanceKm.toFixed(1)} km away.`;
  dateResult.textContent = `Correct date: ${round.month} ${round.year}. You guessed ${monthGuess.value} ${yearGuess.value}.`;
  scoreResult.textContent = `Round score: ${roundScore} / 1200. Total score: ${totalScore}.`;

  resultCard.style.display = "block";
  submitButton.disabled = true;
  message.textContent = "";
}

function nextRound() {
  currentRound++;

  if (currentRound >= rounds.length) {
    showFinalMessage();
  } else {
    loadRound();
  }
}

function showFinalMessage() {
  document.querySelector(".photo-map-layout").style.display = "none";
  document.querySelector(".guess-card").style.display = "none";
  resultCard.style.display = "none";
  roundInfo.style.display = "none";

  finalMessage.style.display = "block";
  finalMessage.innerHTML = `
    <h2>You finished the place game!</h2>
    <p>Final score: ${totalScore}</p>
    <p>Birthday geography nonsense complete.</p>
  `;
}

function calculateDateScore(monthCorrect, yearCorrect) {
  let score = 0;

  if (monthCorrect) {
    score += 100;
  }

  if (yearCorrect) {
    score += 100;
  }

  return score;
}

function calculateLocationScore(distanceKm) {
  if (distanceKm <= 1) {
    return 1000;
  }

  if (distanceKm <= 10) {
    return 800;
  }

  if (distanceKm <= 50) {
    return 600;
  }

  if (distanceKm <= 100) {
    return 400;
  }

  if (distanceKm <= 500) {
    return 200;
  }

  return 50;
}

function calculateDistanceKm(lat1, lon1, lat2, lon2) {
  const earthRadiusKm = 6371;

  const dLat = degreesToRadians(lat2 - lat1);
  const dLon = degreesToRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(degreesToRadians(lat1)) *
      Math.cos(degreesToRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return earthRadiusKm * c;
}

function degreesToRadians(degrees) {
  return degrees * (Math.PI / 180);
}

submitButton.addEventListener("click", submitGuess);
nextButton.addEventListener("click", nextRound);

loadRound();
