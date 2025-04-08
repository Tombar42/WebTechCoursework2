import { questions } from './questions.js';

let currentQuestionIndex = 0;
let score = 0;
let playerName = '';

const questionElement = document.getElementById('question');
const answersElement = document.getElementById('answers');
const nextButton = document.getElementById('next-btn');

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

function loadAudioQuestion(question) {
  const callbackName = "deezerCallback_" + Math.random().toString(36).substring(7);
  const script = document.createElement('script');
  script.src = `https://api.deezer.com/search?q=${encodeURIComponent(question.query)}&output=jsonp&limit=4&callback=${callbackName}`;

  window[callbackName] = function(data) {
    if (!data.data || data.data.length < 4) {
      questionElement.innerText = 'Could not load audio question.';
      return;
    }

    const tracks = shuffleArray(data.data).slice(0, 4);
    const correctTrack = tracks[0];

    question.answer = correctTrack.title;
    question.options = tracks.map(t => t.title);

    const audio = new Audio(correctTrack.preview);
    audio.play();
    setTimeout(() => {
      audio.pause();
      audio.currentTime = 0;
    }, 5000);

    question.options.forEach(option => {
      const btn = document.createElement('button');
      btn.innerText = option;
      btn.classList.add('btn');
      btn.addEventListener('click', () => selectAnswer(option));
      answersElement.appendChild(btn);
    });

    delete window[callbackName];
    document.body.removeChild(script);
  };

  document.body.appendChild(script);
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
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
  saveScore(playerName, score);
  displayScores();
}

function saveScore(name, score) {
  const scores = JSON.parse(localStorage.getItem('scores')) || [];
  scores.push({ name, score });
  localStorage.setItem('scores', JSON.stringify(scores));
}

function displayScores() {
  const scoreList = document.getElementById('score-list') || document.createElement('ul');
  scoreList.id = 'score-list';
  document.body.appendChild(scoreList);
  scoreList.innerHTML = '';
  const scores = JSON.parse(localStorage.getItem('scores')) || [];
  scores.forEach(entry => {
    const li = document.createElement('li');
    li.innerText = `${entry.name}: ${entry.score}`;
    scoreList.appendChild(li);
  });
}

startQuiz();

// Start the quiz when the page loads
startQuiz();
