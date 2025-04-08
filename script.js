import { questions } from './questions.js';

let currentQuestionIndex = 0;
let score = 0;
let playerName = '';

const questionElement = document.getElementById('question');
const answersElement = document.getElementById('answers');
const nextButton = document.getElementById('next-btn');

// Start the quiz
function startQuiz() {
  playerName = prompt("Enter your name:") || "Player";
  currentQuestionIndex = 0;
  score = 0;
  nextButton.style.display = 'none';
  showQuestion(questions[currentQuestionIndex]);
}

function showQuestion(question) {
  questionElement.innerText = '';
  answersElement.innerHTML = '';

  if (question.type === 'text') {
    questionElement.innerText = question.question;
    question.options.forEach(option => {
      const button = document.createElement('button');
      button.innerText = option;
      button.classList.add('btn');
      button.addEventListener('click', () => selectAnswer(option, question.answer));
      answersElement.appendChild(button);
    });
  } else if (question.type === 'audio') {
    loadAudioQuestion(question.query);
  }

  nextButton.style.display = 'none';
}

function selectAnswer(selectedOption, correctAnswer) {
  const currentQuestion = questions[currentQuestionIndex];
  if (selectedOption === correctAnswer) {
    score++;
    alert("Correct!");
  } else {
    alert("Wrong answer!");
  }
  nextButton.style.display = 'block';
}

nextButton.addEventListener('click', () => {
  currentQuestionIndex++;
  if (currentQuestionIndex < questions.length) {
    showQuestion(questions[currentQuestionIndex]);
    nextButton.style.display = 'none';
  } else {
    showResults();
  }
});

function showResults() {
  questionElement.innerText = `${playerName}, your score is ${score} out of ${questions.length}.`;
  answersElement.innerHTML = '';
  nextButton.style.display = 'none';

  // Save score to local storage
  saveScore(playerName, score);
  displayScores();
}

function saveScore(name, score) {
  const scores = JSON.parse(localStorage.getItem('scores')) || [];
  scores.push({ name: name, score: score });
  localStorage.setItem('scores', JSON.stringify(scores));
}

function displayScores() {
  const scoreList = document.getElementById('score-list');
  scoreList.innerHTML = ''; // Clear existing scores
  const scores = JSON.parse(localStorage.getItem('scores')) || [];

  scores.forEach((entry, index) => {
    const li = document.createElement('li');
    li.innerText = `${entry.name}: ${entry.score}`;
    scoreList.appendChild(li);
  });
}

// Load audio question from Deezer
function loadAudioQuestion(query) {
  const script = document.createElement("script");
  script.src = `https://api.deezer.com/search?q=${encodeURIComponent(query)}&output=jsonp&callback=handleDeezerResponse`;
  document.body.appendChild(script);
}

window.handleDeezerResponse = function(response) {
  if (!response || !response.data || response.data.length === 0) {
    questionElement.innerText = "Sorry, couldn't find that track.";
    return;
  }

  const track = response.data[0];
  const previewUrl = track.preview;
  const correctArtist = track.artist.name;
  const questionText = `Who sings this song?`;

  questionElement.innerText = questionText;
  answersElement.innerHTML = '';

  const audio = document.createElement("audio");
  audio.src = previewUrl;
  audio.controls = true;
  answersElement.appendChild(audio);

  // Button to play the audio
  const playBtn = document.createElement('button');
  playBtn.innerText = '▶️ Play Snippet';
  playBtn.classList.add('btn');
  playBtn.onclick = () => audio.play();
  answersElement.appendChild(playBtn);

  // Generate 3 random artists + correct one
  const options = [correctArtist];
  while (options.length < 4) {
    const randomTrack = response.data[Math.floor(Math.random() * response.data.length)];
    const name = randomTrack.artist.name;
    if (!options.includes(name)) options.push(name);
  }

  // Shuffle options
  options.sort(() => Math.random() - 0.5);

  options.forEach(option => {
    const button = document.createElement("button");
    button.innerText = option;
    button.classList.add('btn');
    button.addEventListener('click', () => selectAnswer(option, correctArtist));
    answersElement.appendChild(button);
  });
};

// Start the quiz when the page loads
startQuiz();
