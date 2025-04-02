const questions = [
  {
    question: "What is the name of the artist who sang 'Shape of You'?",
    answer: "Ed Sheeran",
    options: ["Ed Sheeran", "Justin Bieber", "Drake", "Katy Perry"]
  },
  {
    question: "Which band is known for the song 'Bohemian Rhapsody'?",
    answer: "Queen",
    options: ["Queen", "The Beatles", "Nirvana", "Pink Floyd"]
  },
  {
    question: "What year did Michael Jackson release 'Thriller'?",
    answer: "1982",
    options: ["1982", "1984", "1980", "1986"]
  },
  {
    question: "Who is known as the 'Queen of Pop'?",
    answer: "Madonna",
    options: ["Madonna", "Beyoncé", "Lady Gaga", "Taylor Swift"]
  }
];

let currentQuestionIndex = 0;
let score = 0;
let playerName = '';

const questionElement = document.getElementById('question');
const answersElement = document.getElementById('answers');
const nextButton = document.getElementById('next-btn');
const currentScoreElement = document.getElementById('current-score');
const leaderboardDisplay = document.getElementById('leaderboard-display');
const backButton = document.getElementById('back-btn');

// Prompt for player name at the start of the quiz
function startQuiz() {
  playerName = prompt("Enter your name:") || "Player";
  currentQuestionIndex = 0;
  score = 0;
  nextButton.style.display = 'none';
  showQuestion(questions[currentQuestionIndex]);
}

function showQuestion(question) {
  questionElement.innerText = question.question;
  answersElement.innerHTML = '';

  question.options.forEach(option => {
    const button = document.createElement('button');
    button.innerText = option;
    button.classList.add('btn');
    button.addEventListener('click', () => selectAnswer(option));
    answersElement.appendChild(button);
  });
}

function selectAnswer(selectedOption) {
  const currentQuestion = questions[currentQuestionIndex];
  if (selectedOption === currentQuestion.answer) {
    score++;
    alert("Correct!");
  } else {
    alert("Wrong answer!");
  }
  
  // Update the score display
  currentScoreElement.innerText = score;

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
  
  // Show the leaderboard
  leaderboardDisplay.style.display = 'block';
  displayScores();
}

// Save score to local storage
function saveScore(name, score) {
  const scores = JSON.parse(localStorage.getItem('scores')) || [];
  scores.push({ name: name, score: score });
  localStorage.setItem('scores', JSON.stringify(scores));
}

// Display scores in the leaderboard
function displayScores() {
  const scoreList = document.getElementById('score-list');
  scoreList.innerHTML = ''; // Clear existing scores
  const scores = JSON.parse(localStorage.getItem('scores')) || [];
  
  console.log("Scores retrieved from local storage:", scores); // Debugging line
  
  scores.forEach((entry) => {
    const li = document.createElement('li');
    li.innerText = `${entry.name}: ${entry.score}`;
    scoreList.appendChild(li);
  });
}

// Event listener for the back button
backButton.addEventListener('click', () => {
  window.location.href = 'index.html'; // Redirect to the main page
});

// Function to display scores on the main page
function displayScoresOnMainPage() {
  const scoreList = document.getElementById('score-list');
  scoreList.innerHTML = ''; // Clear existing scores
  const scores = JSON.parse(localStorage.getItem('scores')) || [];
  
  console.log("Scores retrieved for main page:", scores); // Debugging line
  
  scores.forEach((entry) => {
    const li = document.createElement('li');
    li.innerText = `${entry.name}: ${entry.score}`;
    scoreList.appendChild(li);
  });
}

// Call the function to display scores when the main page loads
if (document.getElementById('score-list')) {
  displayScoresOnMainPage();
}

// Start the quiz when the quiz page loads
if (document.getElementById('question')) {
  startQuiz();
}