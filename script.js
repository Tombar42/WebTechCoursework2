const questions = [
  {
    type: "audio",
    question: "Identify the iconic group behind the timeless hit 'Waterloo'.",
    src: "Abba - Waterloo_Reveal.mp3",
    answer: "ABBA",
    options: ["Ace of Base", "Queen", "ABBA", "Bananarama"]
  },
  {
    type: "audio",
    question: "Can you name the boy band that sang the energetic track 'Everybody'?",
    src: "Backstreet boys - Everybody_Reveal.mp3",
    answer: "Backstreet Boys",
    options: ["Boyz II Men", "NSYNC", "One Direction", "Backstreet Boys"]
  },
  {
    type: "audio",
    question: "Recognize the artist who serenaded us with 'Uptown Girl'.",
    src: "Billy Joel - Uptown Girl_Reveal.mp3",
    answer: "Billy Joel",
    options: ["Elton John", "Billy Joel", "Lionel Richie", "George Michael"]
  },
  {
    type: "audio",
    question: "Which legendary rock act delivered the powerful anthem 'Livin' On A Prayer'?",
    src: "Bon Jovi - Livin' On A Prayer_Reveal.mp3",
    answer: "Bon Jovi",
    options: ["Bruce Springsteen", "Bon Jovi", "Bryan Adams", "Jon Bonham"]
  },
  {
    type: "audio",
    question: "Pinpoint the singer responsible for the catchy pop sensation 'Call Me Maybe'.",
    src: "Carly Rae Jepsen - Call Me Maybe_Reveal.mp3",
    answer: "Carly Rae Jepsen",
    options: ["Taylor Swift", "Katy Perry", "Carly Rae Jepsen", "Selena Gomez"]
  },
  {
    type: "audio",
    question: "Determine the acclaimed band that gifted us the poignant track 'Go Your Own Way'.",
    src: "Fleetwood Mac - Go Your Own Way_Reveal.mp3",
    answer: "Fleetwood Mac",
    options: ["Fleetwood Mac", "The Eagles", "Journey", "Chicago"]
  },
  {
    type: "audio",
    question: "Identify the voice behind the upbeat hit 'Shotgun'.",
    src: "George Ezra - Shotgun_Reveal.mp3",
    answer: "George Ezra",
    options: ["Ed Sheeran", "George Ezra", "James Blunt", "Tom Walker"]
  },
  {
    type: "audio",
    question: "Which Australian band is famous for the iconic song 'Down Under'?",
    src: "Men At Work - Down Under_Reveal.mp3",
    answer: "Men At Work",
    options: ["INXS", "Crowded House", "Men At Work", "Midnight Oil"]
  },
  {
    type: "audio",
    question: "Name the artist who urged us to 'Get The Party Started' with this energetic track.",
    src: "Pink - Get The Party Started_Reveal.mp3",
    answer: "Pink",
    options: ["Gwen Stefani", "Avril Lavigne", "Pink", "Christina Aguilera"]
  },
  {
    type: "audio",
    question: "Recognize the group that encouraged us to believe in 'We Built This City'.",
    src: "Starship - We Built This City_Reveal.mp3",
    answer: "Starship",
    options: ["Journey", "REO Speedwagon", "Starship", "Foreigner"]
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
