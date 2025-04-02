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

const questionElement = document.getElementById('question');
const answersElement = document.getElementById('answers');
const nextButton = document.getElementById('next-btn');

function startQuiz() {
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
  questionElement.innerText = `Quiz Finished! Your score is ${score} out of ${questions.length}.`;
  answersElement.innerHTML = '';
  nextButton.style.display = 'none';
}

// Start the quiz when the page loads
startQuiz();