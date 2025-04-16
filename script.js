const questions = [
  {
    type: "audio",
    question: "Which band performs this classic pop anthem?",
    src: "Abba - Waterloo_Reveal.mp3",
    answer: "ABBA",
    options: ["Ace of Base", "Queen", "ABBA", "Bananarama"]
  },
  {
    type: "audio",
    question: "Who's the boy band behind this hit?",
    src: "Backstreet boys - Everybody_Reveal.mp3",
    answer: "Backstreet Boys",
    options: ["Boyz II Men", "NSYNC", "One Direction", "Backstreet Boys"]
  },
  {
    type: "audio",
    question: "Which iconic band released this track?",
    src: "Fleetwood Mac - Go Your Own Way_Reveal.mp3",
    answer: "Fleetwood Mac",
    options: ["Fleetwood Mac", "The Eagles", "Journey", "Chicago"]
  },
  {
    type: "audio",
    question: "Who’s the artist behind this timeless pop track?",
    src: "Madonna - Like A Prayer_Reveal.mp3",
    answer: "Madonna",
    options: ["Cyndi Lauper", "Madonna", "Whitney Houston", "Janet Jackson"]
  },
  {
    type: "audio",
    question: "Which artist is singing this R&B jam?",
    src: "Usher - Yeah_Reveal.mp3",
    answer: "Usher",
    options: ["Ne-Yo", "Chris Brown", "R. Kelly", "Usher"]
  },
  {
    type: "audio",
    question: "Who’s the group behind this funky hit?",
    src: "Outkast - Hey Ya_Reveal.mp3",
    answer: "Outkast",
    options: ["Outkast", "Black Eyed Peas", "N.E.R.D", "The Roots"]
  },
  {
    type: "audio",
    question: "Who's singing this hit track from the 2000s?",
    src: "Rihanna - Umbrella_Reveal.mp3",
    answer: "Rihanna",
    options: ["Ciara", "Beyoncé", "Rihanna", "Ashanti"]
  },
  {
    type: "audio",
    question: "Which band made this rock anthem?",
    src: "Queen - We Will Rock You_Reveal.mp3",
    answer: "Queen",
    options: ["The Rolling Stones", "Queen", "The Beatles", "Led Zeppelin"]
  },
  {
    type: "audio",
    question: "Who performs this iconic 90s pop song?",
    src: "Spice Girls - Wannabe_Reveal.mp3",
    answer: "Spice Girls",
    options: ["Destiny's Child", "All Saints", "TLC", "Spice Girls"]
  },
  {
    type: "audio",
    question: "Who's the artist on this rap classic?",
    src: "Eminem - Lose Yourself_Reveal.mp3",
    answer: "Eminem",
    options: ["50 Cent", "Dr. Dre", "Eminem", "Kanye West"]
  }
];
// music from https://quizmasters.biz/

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

  // Handle audio (if it's an audio-based question)
  const audioPlayer = document.getElementById('audioPlayer');
  if (question.src) {
    audioPlayer.src = question.src;
    audioPlayer.style.display = 'block';
    audioPlayer.currentTime = 0;
    audioPlayer.play();

// Stop the audio after 10 seconds and make it unplayable
    setTimeout(() => {
      audioPlayer.pause();
      audioPlayer.currentTime = 0;
      audioPlayer.removeAttribute('src');  // Remove the source to prevent replaying
      audioPlayer.style.display = 'none';  // Hide the audio player
      audioPlayer.disabled = true;  // Disable the player to prevent future play
    }, 10500); // 10000 milliseconds = 10 seconds
  } else {
    audioPlayer.style.display = 'none';
    audioPlayer.pause();
    audioPlayer.removeAttribute('src');
  }


  // Show answer options
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
