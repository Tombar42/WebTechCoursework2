const questions = [];
let currentQuestionIndex = 0;
let score = 0;
let playerName = '';
const audioElement = new Audio();

const questionElement = document.getElementById('question');
const answersElement = document.getElementById('answers');
const nextButton = document.getElementById('next-btn');

// Prompt for player name at the start of the quiz
function startQuiz() {
  playerName = prompt("Enter your name:") || "Player";
  currentQuestionIndex = 0;
  score = 0;
  nextButton.style.display = 'none';
  fetchQuestions(); // Fetch music-related questions from iTunes
}

// Fetch music questions from iTunes API
function fetchQuestions() {
  fetch('https://itunes.apple.com/search?term=pop&media=music&limit=5') // Searching for pop music, you can change it
    .then(response => response.json())
    .then(data => {
      const tracks = data.results;
      tracks.forEach(track => {
        questions.push({
          question: `Who sings this song: "${track.trackName}"?`,
          audio: track.previewUrl,
          correctAnswer: track.artistName,
          options: [track.artistName, "Justin Bieber", "Drake", "Katy Perry"] // Replace with dynamic options later
        });
      });
      showQuestion(questions[currentQuestionIndex]);
    });
}

// Show the current question and audio preview
function showQuestion(question) {
  questionElement.innerText = question.question;
  answersElement.innerHTML = '';
  
  // Play the audio preview
  audioElement.src = question.audio;
  audioElement.play();
  
  question.options.forEach(option => {
    const button = document.createElement('button');
    button.innerText = option;
    button.classList.add('btn');
    button.addEventListener('click', () => selectAnswer(option));
    answersElement.appendChild(button);
  });
}

// Handle answer selection
function selectAnswer(selectedOption) {
  const currentQuestion = questions[currentQuestionIndex];
  if (selectedOption === currentQuestion.correctAnswer) {
    score++;
    alert("Correct!");
  } else {
    alert("Wrong answer!");
  }
  nextButton.style.display = 'block';
}

// Go to the next question
nextButton.addEventListener('click', () => {
  currentQuestionIndex++;
  if (currentQuestionIndex < questions.length) {
    showQuestion(questions[currentQuestionIndex]);
    nextButton.style.display = 'none';
  } else {
    showResults();
  }
});

// Show results at the end of the quiz
function showResults() {
  questionElement.innerText = `${playerName}, your score is ${score} out of ${questions.length}.`;
  answersElement.innerHTML = '';
  nextButton.style.display = 'none';

  // Save score to local storage
  saveScore(playerName, score);
  displayScores();
}

// Save the player's score to localStorage
function saveScore(name, score) {
  const scores = JSON.parse(localStorage.getItem('scores')) || [];
  scores.push({ name: name, score: score });
  localStorage.setItem('scores', JSON.stringify(scores));
}

// Display scores from local storage
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

// Start the quiz when the page loads
startQuiz();
