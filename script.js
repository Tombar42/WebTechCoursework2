const questions = [
  {
    type: "text",
    question: "What is the name of the artist who sang 'Shape of You'?",
    answer: "Ed Sheeran",
    options: ["Ed Sheeran", "Justin Bieber", "Drake", "Katy Perry"]
  },
  {
    type: "audio",
    query: "Imagine Dragons", // Search keyword for Deezer
    answer: "", // Will be dynamically set
    options: [] // Will be dynamically set
  }
];


let currentQuestionIndex = 0;
let score = 0;
let playerName = '';

const questionElement = document.getElementById('question');
const answersElement = document.getElementById('answers');
const nextButton = document.getElementById('next-btn');

// Prompt for player name at the start of the quiz
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
  nextButton.style.display = 'none';

  if (question.type === 'text') {
    questionElement.innerText = question.question;
    question.options.forEach(option => {
      const btn = document.createElement('button');
      btn.innerText = option;
      btn.classList.add('btn');
      btn.addEventListener('click', () => selectAnswer(option));
      answersElement.appendChild(btn);
    });
  } else if (question.type === 'audio') {
    questionElement.innerText = 'Which song is this?';
    loadAudioQuestion(question);
  }
}


function selectAnswer(selectedOption) {
  const currentQuestion = questions[currentQuestionIndex];
  if (selectedOption === currentQuestion.answer) {
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

// Start the quiz when the page loads
startQuiz();
