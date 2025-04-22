
const questions = [
  {
    type: "audio",
    question: "Whats the name of the iconic group behind the timeless hit 'Waterloo'.",
    src: "Abba - Waterloo_Reveal.mp3",
    answer: "ABBA",
    options: ["Ace of Base", "Queen", "ABBA", "Bananarama"]
  },
  {
    type: "audio",
    question: "Can you name the boy band that sang the track 'Everybody'?",
    src: "Backstreet boys - Everybody_Reveal.mp3",
    answer: "Backstreet Boys",
    options: ["Boyz II Men", "NSYNC", "One Direction", "Backstreet Boys"]
  },
  {
    type: "audio",
    question: "who serenaded us with 'Uptown Girl'.",
    src: "Billy Joel - Uptown Girl_Reveal.mp3",
    answer: "Billy Joel",
    options: ["Elton John", "Billy Joel", "Lionel Richie", "George Michael"]
  },
  {
    type: "audio",
    question: "Which legendary rock act delivered the anthem 'Livin' On A Prayer'?",
    src: "Bon Jovi - Livin' On A Prayer_Reveal.mp3",
    answer: "Bon Jovi",
    options: ["Bruce Springsteen", "Bon Jovi", "Bryan Adams", "Jon Bonham"]
  },
  {
    type: "audio",
    question: "who was the singer responsible for the catchy pop sensation 'Call Me Maybe'.",
    src: "Carly Rae Jepsen - Call Me Maybe_Reveal.mp3",
    answer: "Carly Rae Jepsen",
    options: ["Taylor Swift", "Katy Perry", "Carly Rae Jepsen", "Selena Gomez"]
  },
  {
    type: "audio",
    question: "which band gifted us the track 'Go Your Own Way'.",
    src: "Fleetwood Mac - Go Your Own Way_Reveal.mp3",
    answer: "Fleetwood Mac",
    options: ["Fleetwood Mac", "The Eagles", "Journey", "Chicago"]
  },
  {
    type: "audio",
    question: "who's voice is behind the upbeat hit 'Shotgun'.",
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
    question: "Who sung the song 'We Built This City'.",
    src: "Starship - We Built This City_Reveal.mp3",
    answer: "Starship",
    options: ["Journey", "REO Speedwagon", "Starship", "Foreigner"]
  }
];
// music from https://quizmasters.biz/

let currentQuestionIndex = 0;
let score = 0;
let playerName = '';
let currentTimeout; // To store the ID of the current timeout
let timer; // timer variable
let timeLeft = 10; // 10 second timer for each question

const questionElement = document.getElementById('question');
const answersElement = document.getElementById('answers');
const nextButton = document.getElementById('next-btn');
const currentScoreElement = document.getElementById('current-score');
const leaderboardDisplay = document.getElementById('leaderboard-display');
const audioPlayer = document.getElementById('audioPlayer'); // Get the audio player element

// Prompt for player name at the start of the quiz
function startQuiz() {
  do {
    playerName = prompt("Enter your name:") || "";
    playerName = playerName.trim();
  } while (!playerName);

  // Capitalize first letter only
  playerName = playerName.charAt(0).toUpperCase() + playerName.slice(1);

  currentQuestionIndex = 0;
  score = 0;
  nextButton.style.display = 'none';
  showQuestion(questions[currentQuestionIndex]);
}


function showQuestion(question) {
  questionElement.innerText = `Q${currentQuestionIndex + 1} of ${questions.length}: ${question.question}`;
  answersElement.innerHTML = '';
  startTimer(); // Start the timer for current question

  // Clear any existing timeout
  if (currentTimeout) {
    clearTimeout(currentTimeout);
    currentTimeout = null;
  }

  if (question.src) {
    audioPlayer.src = question.src;
    audioPlayer.style.display = 'block';
    audioPlayer.currentTime = 0;
    audioPlayer.play();

    // Set the timeout for the current question
    currentTimeout = setTimeout(() => {
      audioPlayer.pause();
      audioPlayer.currentTime = 0;
      audioPlayer.removeAttribute('src');
      audioPlayer.style.display = 'none';
      audioPlayer.disabled = true;
    }, 10500); // 10.5 seconds to ensure it stops after 10 seconds of playback

  } else {
    audioPlayer.style.display = 'none';
    audioPlayer.pause();
    audioPlayer.removeAttribute('src');
  }

const shuffledOptions = shuffleArray(question.options);

shuffledOptions.forEach(option => {
  const button = document.createElement('button');
  button.innerText = option;
  button.classList.add('btn');
  button.addEventListener('click', () => selectAnswer(option));
  answersElement.appendChild(button);
});

}


function selectAnswer(selectedOption) {
  clearInterval(timer); // Stop the timer
  const currentQuestion = questions[currentQuestionIndex];
  if (selectedOption === currentQuestion.answer) {
    score++;
    alert("Correct!");
  } else {
    alert("Wrong answer!");
  }

  // Update the score display
  currentScoreElement.innerText = score;

  // Stop the audio and clear the timeout when an answer is selected
  if (audioPlayer.src) {
    audioPlayer.pause();
    audioPlayer.currentTime = 0;
    audioPlayer.removeAttribute('src');
    audioPlayer.style.display = 'none';
  }
  if (currentTimeout) {
    clearTimeout(currentTimeout);
    currentTimeout = null;
  }
  // Automatically go to the next question after a short delay
  setTimeout(() => {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
      showQuestion(questions[currentQuestionIndex]);
    } else {
      showResults();
    }
  }, 1000); // 1 second delay before next question
}

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

  const existing = scores.find(entry => entry.name === name);

  if (existing) {
    if (score > existing.score) {
      existing.score = score;
      showPopup("🎉 New High Score!");
    }
    // Otherwise, do nothing
  } else {
    scores.push({ name, score });
    showPopup("🎉 Welcome to the leaderboard!");
  }

  localStorage.setItem('scores', JSON.stringify(scores));
}

// Display scores in the leaderboard
function displayScores() {
  const scoreList = document.getElementById('score-list');
  scoreList.innerHTML = '';

  const scores = JSON.parse(localStorage.getItem('scores')) || [];

  scores
    .sort((a, b) => b.score - a.score) // Sort highest to lowest
    .slice(0, 5) // Only show top 5
    .forEach((entry) => {
      const li = document.createElement('li');
      li.innerText = `${entry.name}: ${entry.score}`;
      scoreList.appendChild(li);
    });
}

// Display scores on the main page
function displayScoresOnMainPage() {
  const scoreList = document.getElementById('score-list');
  scoreList.innerHTML = '';

  const scores = JSON.parse(localStorage.getItem('scores')) || [];

  scores
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
    .forEach((entry) => {
      const li = document.createElement('li');
      li.innerText = `${entry.name}: ${entry.score}`;
      scoreList.appendChild(li);
    });
}

// Timer functions
function startTimer() {
  timeLeft = 10;
  const timerBar = document.getElementById('timer-bar');

  timer = setInterval(() => {
    timeLeft--;
    document.getElementById('timer-display').innerText = `Time Left: ${timeLeft}s`;

    if (timerBar) {
      timerBar.style.width = `${(timeLeft / 10) * 100}%`;
    }

    if (timeLeft <= 0) {
      clearInterval(timer);
      alert("Time's up!");
      selectAnswer(""); // Automatically select no answer
    }
  }, 1000);
}

function shareScore() {
  const shareText = `I scored ${score}/${questions.length} on the Music Quiz! 🎶 Try it yourself: ${window.location.href}`;

  if (navigator.share) {
    navigator.share({
      title: "Music Quiz",
      text: shareText,
      url: window.location.href
    }).catch(console.error);
  } else {
    navigator.clipboard.writeText(shareText)
      .then(() => alert("📋 Copied to clipboard! Ready to paste anywhere 🎉"))
      .catch(() => alert("Couldn't copy. Try manually sharing."));
  }
}

function resetScores() {
  if (confirm("Are you sure you want to clear the leaderboard?")) {
    localStorage.removeItem('scores');
    displayScoresOnMainPage(); // refresh list
  }
}

function shuffleArray(array) {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function showPopup(message) {
  const popup = document.getElementById('popup');
  if (!popup) return; // In case it's not on the page
  popup.innerText = message;
  popup.style.display = 'block';

  setTimeout(() => {
    popup.style.display = 'none';
  }, 3000);
}

document.addEventListener('DOMContentLoaded', () => {
  console.log("DOMContentLoaded triggered");

  const backButton = document.getElementById('back-btn');
  if (backButton) {
    backButton.addEventListener('click', () => {
      window.location.href = 'index.html';
    });
  }

  if (document.getElementById('score-list')) {
    displayScoresOnMainPage();
  }

  if (document.getElementById('question')) {
    startQuiz();
  }
});

