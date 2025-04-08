document.addEventListener('DOMContentLoaded', async function() {
    const clientId = '315f4b7ea08247d98712188666b73534'; // Replace with your Spotify Client ID
    const clientSecret = '77b0af707778471e8d7cf066d6a56276'; // Replace with your Spotify Client Secret

    let currentQuestionIndex = 0;
    let score = 0;
    let tracks = [];
    let currentTrack = {};

    // Get references to the HTML elements on Quiz.html
    const startButton = document.getElementById('btn');
    const quizContainer = document.getElementById('quizContainer');
    const questionElement = document.getElementById('question');
    const answersElement = document.getElementById('answers');
    const nextButton = document.getElementById('nextButton');
    const resultsContainer = document.getElementById('results');
    const scoreElement = document.getElementById('score');
    const restartButton = document.getElementById('restartButton');
    const musicResultsElement = document.getElementById('musicResults');

    if (startButton) startButton.addEventListener('click', startQuiz);
    if (nextButton) nextButton.addEventListener('click', nextQuestion);
    if (restartButton) restartButton.addEventListener('click', restartQuiz);

    // Start the quiz
    async function startQuiz() {
        if (startButton) startButton.style.display = 'none'; // Hide the start button
        if (quizContainer) quizContainer.style.display = 'block'; // Show the quiz container
        await loadTracks();
        if (tracks.length > 0) {
            showQuestion();
        } else {
            if (questionElement) questionElement.innerText = 'Failed to load tracks.';
            if (answersElement) answersElement.innerHTML = '';
        }
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
        const url = `https://api.spotify.com/v1/search?q=${searchTerm}&type=track&limit=10`; // Corrected Spotify Search URL

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            }
        });

        const data = await response.json();
        if (data && data.tracks && data.tracks.items) {
            tracks = data.tracks.items;
        } else {
            console.error("Error loading tracks:", data);
            if (questionElement) questionElement.innerText = 'Failed to load tracks from Spotify.';
            if (answersElement) answersElement.innerHTML = '';
        }
    }

    // Show the current question
    function showQuestion() {
        if (currentQuestionIndex < tracks.length) {
            currentTrack = tracks[currentQuestionIndex];
            if (questionElement) questionElement.innerText = `Who is the artist of the track: "${currentTrack.name}"?`;

            const correctAnswer = currentTrack.artists[0].name;
            const otherTracks = tracks.filter(track => track.id !== currentTrack.id);
            const randomArtists = otherTracks
                .sort(() => Math.random() - 0.5)
                .slice(0, 3)
                .map(track => track.artists[0].name);

            const allAnswers = [correctAnswer, ...randomArtists];
            allAnswers.sort(() => Math.random() - 0.5);

            if (answersElement) {
                answersElement.innerHTML = '';
                allAnswers.forEach(answer => {
                    const button = document.createElement('button');
                    button.innerText = answer;
                    button.classList.add('btn'); // Keep the 'btn' class for styling
                    button.addEventListener('click', () => selectAnswer(answer));
                    answersElement.appendChild(button);
                });
            }

            if (nextButton) nextButton.style.display = 'none'; // Hide next button initially
        } else {
            showResults();
        }
    }

    // Handle the answer selection
    function selectAnswer(selectedAnswer) {
        const correctAnswer = currentTrack.artists[0].name;
        const answerButtons = answersElement.querySelectorAll('button');
        answerButtons.forEach(button => {
            button.disabled = true;
            if (button.innerText === correctAnswer) {
                button.classList.add('correct');
            } else if (button.innerText === selectedAnswer) {
                button.classList.add('incorrect');
            }
        });

        if (selectedAnswer === correctAnswer) {
            score++;
        }

        if (nextButton) nextButton.style.display = 'block';
    }

    // Move to the next question
    function nextQuestion() {
        currentQuestionIndex++;
        showQuestion();
    }

    // Show the results of the quiz
    function showResults() {
        if (quizContainer) quizContainer.style.display = 'none';
        if (resultsContainer) resultsContainer.style.display = 'block';
        if (scoreElement) scoreElement.innerText = score;
        if (tracks && totalQuestionsElement) totalQuestionsElement.innerText = tracks.length;

        if (musicResultsElement && tracks) {
            musicResultsElement.innerHTML = '<h3>Correct Answers:</h3><ul>';
            tracks.forEach(track => {
                musicResultsElement.innerHTML += `<li>"${track.name}" by ${track.artists[0].name}</li>`;
            });
            musicResultsElement.innerHTML += '</ul>';
        }
    }

    // Restart the quiz
    function restartQuiz() {
        currentQuestionIndex = 0;
        score = 0;
        tracks = [];
        if (resultsContainer) resultsContainer.style.display = 'none';
        if (startButton) startButton.style.display = 'flex'; // Show the start button again
        if (musicResultsElement) musicResultsElement.innerHTML = '';
        loadTracks(); // Reload tracks for a new quiz
        if (quizContainer) quizContainer.style.display = 'none'; // Ensure quiz container is hidden
    }
});
