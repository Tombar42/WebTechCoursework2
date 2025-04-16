const questions = [
  {
    type: "audio",
    question: "Which band performs this song?",
    src: "audio/Abba - Waterloo_Reveal.mp3",
    answer: "ABBA",
    options: ["ABBA", "Queen", "Ace of Base", "Bananarama"]
  },
  {
    type: "audio",
    question: "Who's behind this boy band anthem?",
    src: "audio/Backstreet boys - Everybody_Reveal.mp3",
    answer: "Backstreet Boys",
    options: ["Backstreet Boys", "NSYNC", "Boyz II Men", "One Direction"]
  },
  {
    type: "audio",
    question: "Who sings this 80s hit?",
    src: "audio/Billy Joel - Uptown Girl_Reveal.mp3",
    answer: "Billy Joel",
    options: ["Billy Joel", "Phil Collins", "Elton John", "George Michael"]
  },
  {
    type: "audio",
    question: "Can you name the band behind this rock classic?",
    src: "audio/Bon Jovi - Livin' On A Prayer_Reveal.mp3",
    answer: "Bon Jovi",
    options: ["Bon Jovi", "Aerosmith", "Guns N' Roses", "KISS"]
  },
  {
    type: "audio",
    question: "Who's the artist of this catchy pop song?",
    src: "audio/Carly Rae Jepsen - Call Me Maybe_Reveal.mp3",
    answer: "Carly Rae Jepsen",
    options: ["Carly Rae Jepsen", "Katy Perry", "Avril Lavigne", "Selena Gomez"]
  },
  {
    type: "audio",
    question: "Who performs this classic rock tune?",
    src: "audio/Fleetwood Mac - Go Your Own Way_Reveal.mp3",
    answer: "Fleetwood Mac",
    options: ["Fleetwood Mac", "The Eagles", "The Rolling Stones", "The Beatles"]
  },
  {
    type: "audio",
    question: "Name the artist of this modern hit.",
    src: "audio/George Ezra - Shotgun_Reveal.mp3",
    answer: "George Ezra",
    options: ["George Ezra", "Ed Sheeran", "James Bay", "Sam Fender"]
  },
  {
    type: "audio",
    question: "Which band performs this iconic Australian track?",
    src: "audio/Men At Work - Down Under_Reveal.mp3",
    answer: "Men At Work",
    options: ["Men At Work", "INXS", "Midnight Oil", "Crowded House"]
  },
  {
    type: "audio",
    question: "Who sings this party anthem?",
    src: "audio/Pink - Get The Party Started_Reveal.mp3",
    answer: "Pink",
    options: ["Pink", "Lady Gaga", "Avril Lavigne", "Christina Aguilera"]
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
