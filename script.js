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
  let audioPlayer = null;  // This will hold the audio object

  // Show current question and options
  function showQuestion() {
    const question = questions[currentQuestionIndex];
    questionElement.innerText = question.question;
    answersElement.innerHTML = '';

    question.options.forEach(option => {
      const button = document.createElement('button');
      button.innerText = option;
      button.classList.add('btn');
      button.addEventListener('click', () => selectAnswer(option));
      answersElement.appendChild(button);
    });

    // Display play button for audio snippet
    playButton.style.display = 'inline-block';
    playButton.onclick = () => playAudio(question.trackId);
  }

  // Fetch track preview URL from Deezer API and play it
  function playAudio(trackId) {
    fetch(`https://api.deezer.com/track/${trackId}`)
      .then(response => response.json())
      .then(data => {
        const previewUrl = data.preview;
        if (previewUrl) {
          // Stop any existing audio before playing a new one
          if (audioPlayer) {
            audioPlayer.pause();
          }

          // Create a new audio player and play the snippet
          audioPlayer = new Audio(previewUrl);
          audioPlayer.play();
        } else {
          alert("No preview available for this track.");
        }
      })
      .catch(error => {
        console.error("Error fetching track:", error);
      });
  }

  // Handle answer selection
  function selectAnswer(selectedOption) {
    const currentQuestion = questions[currentQuestionIndex];
    if (selectedOption === currentQuestion.answer) {
      alert("Correct!");
    } else {
      alert("Wrong answer!");
    }
    nextButton.style.display = 'block'; // Show next button
  }

  // Show next question
  nextButton.addEventListener('click', () => {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
      showQuestion();
      nextButton.style.display = 'none'; // Hide next button again
    } else {
      alert("Quiz finished!");
    }
  });

  // Start the quiz
  showQuestion();
});

