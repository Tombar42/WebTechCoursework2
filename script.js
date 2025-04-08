document.addEventListener('DOMContentLoaded', function () {
  const questions = [
    {
      question: "What is the name of the artist who sang 'Shape of You'?",
      answer: "Ed Sheeran",
      options: ["Ed Sheeran", "Justin Bieber", "Drake", "Katy Perry"],
      trackId: "132842576"  // Deezer track ID for "Shape of You"
    },
    {
      question: "Which band is known for the song 'Bohemian Rhapsody'?",
      answer: "Queen",
      options: ["Queen", "The Beatles", "Nirvana", "Pink Floyd"],
      trackId: "43195917"  // Deezer track ID for "Bohemian Rhapsody"
    },
    {
      question: "What year did Michael Jackson release 'Thriller'?",
      answer: "1982",
      options: ["1982", "1984", "1980", "1986"],
      trackId: "2996787"  // Deezer track ID for "Thriller"
    }
  ];

  let currentQuestionIndex = 0;
  const questionElement = document.getElementById('question');
  const answersElement = document.getElementById('answers');
  const playButton = document.getElementById('play-btn');
  const nextButton = document.getElementById('next-btn');
  let audioPlayer = null;

  // Show current question and options
  function showQuestion() {
    const currentQuestion = questions[currentQuestionIndex];
    questionElement.innerText = currentQuestion.question;
    answersElement.innerHTML = '';  // Clear previous answers

    // Display answer options
    currentQuestion.options.forEach(option => {
      const button = document.createElement('button');
      button.innerText = option;
      button.classList.add('btn');
      button.addEventListener('click', () => selectAnswer(option));
      answersElement.appendChild(button);
    });

    // Display play button for music snippet
    playButton.style.display = 'block';
    playButton.onclick = function() {
      playSnippet(currentQuestion.trackId);  // Play music snippet when clicked
    };
  }

  // Select answer and check if it's correct
  function selectAnswer(selectedOption) {
    const currentQuestion = questions[currentQuestionIndex];
    if (selectedOption === currentQuestion.answer) {
      alert("Correct!");
    } else {
      alert("Wrong answer!");
    }

    nextButton.style.display = 'block';
  }

  // Play music snippet
  function playSnippet(trackId) {
    const url = `https://api.deezer.com/track/${trackId}`;
    fetch(url)
      .then(response => response.json())
      .then(data => {
        if (audioPlayer) {
          audioPlayer.pause();  // Stop previous track
        }

        audioPlayer = new Audio(data.preview);  // Get the preview URL
        audioPlayer.play();  // Play the preview
      })
      .catch(error => console.error("Error fetching track:", error));
  }

  // Proceed to next question
  nextButton.addEventListener('click', () => {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
      showQuestion();
      nextButton.style.display = 'none';
    } else {
      showResults();
    }
  });

  // Display results
  function showResults() {
    questionElement.innerText = `Quiz completed! Your score is ${currentQuestionIndex + 1} out of ${questions.length}.`;
    answersElement.innerHTML = '';
    nextButton.style.display = 'none';
  }

  // Start the quiz
  showQuestion();
});


