document.addEventListener('DOMContentLoaded', async function () {
    const clientId = 'YOUR_SPOTIFY_CLIENT_ID'; 
    const clientSecret = 'YOUR_SPOTIFY_CLIENT_SECRET';
    
    let currentQuestionIndex = 0;
    let score = 0;
    let tracks = [];
    let currentTrack = {};

    const startButton = document.getElementById('btn');
    const quizContainer = document.getElementById('quizContainer');
    const questionElement = document.getElementById('question');
    const answersElement = document.getElementById('answers');
    const nextButton = document.getElementById('nextButton');
    const resultsContainer = document.getElementById('results');
    const scoreElement = document.getElementById('score');
    const restartButton = document.getElementById('restartButton');
    const musicResultsElement = document.getElementById('musicResults');
    const audioElement = document.getElementById('audioPlayer');

    if (startButton) startButton.addEventListener('click', startQuiz);
    if (nextButton) nextButton.addEventListener('click', nextQuestion);
    if (restartButton) restartButton.addEventListener('click', restartQuiz);

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

    async function loadTracks() {
        const accessToken = await getAccessToken();
        const searchTerm = 'pop';
        const url = `https://api.spotify.com/v1/search?q=${searchTerm}&type=track&limit=10`;

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            }
        });

        const data = await response.json();
        tracks = data?.tracks?.items || [];
    }

    async function startQuiz() {
        if (startButton) startButton.style.display = 'none';
        if (quizContainer) quizContainer.style.display = 'block';
        await loadTracks();

        tracks.length ? showQuestion() : displayError("Failed to load tracks.");
    }

    function showQuestion() {
        if (currentQuestionIndex < tracks.length) {
            currentTrack = tracks[currentQuestionIndex];
            questionElement.innerText = `Who is the artist of "${currentTrack.name}"?`;

            const correctAnswer = currentTrack.artists[0].name;
            const otherArtists = tracks.filter(track => track.id !== currentTrack.id)
                                       .map(track => track.artists[0].name)
                                       .sort(() => Math.random() - 0.5)
                                       .slice(0, 3);

            const allAnswers = [correctAnswer, ...otherArtists].sort(() => Math.random() - 0.5);
            renderAnswers(allAnswers, correctAnswer);
            
            nextButton.style.display = 'none';
            playAudioSnippet(currentTrack.preview_url);
        } else {
            showResults();
        }
    }

    function renderAnswers(answers, correctAnswer) {
        answersElement.innerHTML = '';
        answers.forEach(answer => {
            const button = document.createElement('button');
            button.innerText = answer;
            button.classList.add('btn');
            button.addEventListener('click', () => selectAnswer(answer, correctAnswer));
            answersElement.appendChild(button);
        });
    }

    function playAudioSnippet(audioUrl) {
        if (!audioElement || !audioUrl) return;
        
        audioElement.src = audioUrl;
        audioElement.load();
        
        audioElement.play().then(() => {
            setTimeout(() => {
                audioElement.pause();
                audioElement.currentTime = 0;
            }, 5000);
        }).catch(() => console.warn("Autoplay blocked; try interacting first."));
    }

    function selectAnswer(selectedAnswer, correctAnswer) {
        [...answersElement.children].forEach(button => {
            button.disabled = true;
            button.classList.add(button.innerText === correctAnswer ? 'correct' : (button.innerText === selectedAnswer ? 'incorrect' : ''));
        });

        if (selectedAnswer === correctAnswer) score++;
        nextButton.style.display = 'block';
    }

    function nextQuestion() {
        currentQuestionIndex++;
        showQuestion();
    }

    function showResults() {
        quizContainer.style.display = 'none';
        resultsContainer.style.display = 'block';
        scoreElement.innerText = score;
        musicResultsElement.innerHTML = tracks.map(track => `<li>"${track.name}" by ${track.artists[0].name}</li>`).join('');
    }

    function restartQuiz() {
        currentQuestionIndex = 0;
        score = 0;
        tracks = [];
        resultsContainer.style.display = 'none';
        startButton.style.display = 'block';
        quizContainer.style.display = 'none';
        musicResultsElement.innerHTML = '';
        audioElement.pause();
        audioElement.currentTime = 0;
        loadTracks();
    }

    function displayError(message) {
        questionElement.innerText = message;
        answersElement.innerHTML = '';
    }
});

