document.addEventListener('DOMContentLoaded', async function() {
  const clientId = '315f4b7ea08247d98712188666b73534'; // Replace with your Spotify Client ID
  const clientSecret = '77b0af707778471e8d7cf066d6a56276'; // Replace with your Spotify Client Secret

  let currentQuestionIndex = 0;
  let score = 0;
  let tracks = [];
  let currentTrack = {};

  // Adding event listeners for buttons
  const startButton = document.getElementById('btn');
  const nextButton = document.getElementById('nextButton');
  const restartButton = document.getElementById('restartButton');

  if (startButton) startButton.addEventListener('click', startQuiz);
  if (nextButton) nextButton.addEventListener('click', nextQuestion);
  if (restartButton) restartButton.addEventListener('click', restartQuiz);

  // Start the quiz
  async function startQuiz() {
    document.getElementById('btn').style.display = 'none';
    document.getElementById('quizContainer').style.display = 'block';
    await loadTracks();
    showQuestion();
  }

  // Get Access Token from Spotify
  async function getAccessToken() {
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + btoa(clientId + ':' + clientSecret),
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials',
    });

    const data = await response.json();
    return data.access_token;
  }

  // Load a list of tracks from Spotify
  async function loadTracks() {
    const accessToken = await getAccessToken();
    const searchTerm = 'pop'; // Or change to a dynamic search term based on quiz
    const url = `https://api.spotify.com/v1/search?q=${searchTerm}&type=track&limit=10`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      }
    });

    const data = await response.json();
    tracks = data.tracks.items;
  }

  // Show the current question
  function showQuestion() {
    if (currentQuestionIndex < tracks.length) {
      currentTrack = tracks[currentQuestionIndex];
      const questionElement = document.getElementById('question');
      const answersElement = document.getElementById('answers');
      const nextButton = document.getElementById('nextButton');

      questionElement.innerText = `Who is the artist of the track: "${currentTrack.name}"?`;

      // Show possible answers (including correct and some random options)
      const correctAnswer = currentTrack.artists[0].name;
      const randomArtists = tracks
        .filter(track => track.artists[0].name !== correctAnswer)
        .slice(0, 3)
        .map(track => track.artists[0].name);

      const allAnswers = [correctAnswer, ...randomArtists];
      allAnswers.sort(() => Math.random() - 0.5); // Shuffle answers

      answersElement.innerHTML = '';
      allAnswers.forEach(answer => {
        const button = document.createElement('button');
        button.innerText = answer;
        button.classList.add('btn');
        button.addEventListener('click', () => selectAnswer(answer));
        answersElement.appendChild(button);
      });

      nextButton.style.display = 'none'; // Hide next button until an answer is selected
    } else {
      showResults();
    }
  }

  // Handle the answer selection
  function selectAnswer(selectedAnswer) {
    const correctAnswer = currentTrack.artists[0].name;
    if (selectedAnswer === correctAnswer) {
      score++;
    }

    const nextButton = document.getElementById('nextButton');
    nextButton.style.display = 'block';
  }

  // Move to the next question
  function nextQuestion() {
    currentQuestionIndex++;
    showQuestion();
  }

  // Show the results of the quiz
  function showResults() {
    document.getElementById('quizContainer').style.display = 'none';
    document.getElementById('results').style.display = 'block';
    document.getElementById('score').innerText = `${score} out of ${tracks.length}`;
  }

  // Restart the quiz
  function restartQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    document.getElementById('results').style.display = 'none';
    document.getElementById('startButton').style.display = 'block';
    document.getElementById('musicResults').innerHTML = '';
  }
});
