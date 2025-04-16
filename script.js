document.addEventListener('DOMContentLoaded', async function () {
    const clientId = '315f4b7ea08247d98712188666b73534'; 
    const clientSecret = '77b0af707778471e8d7cf066d6a56276';
    
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

    // Ensure buttons exist before adding event listeners
    if (startButton) startButton.addEventListener('click', startQuiz);
    if (nextButton) nextButton.addEventListener('click', nextQuestion);
    if (restartButton) restartButton.addEventListener('click', restartQuiz);

    async function getAccessToken() {
        try {
            const response = await fetch('https://accounts.spotify.com/api/token', {
                method: 'POST',
                headers: {
                    'Authorization': 'Basic ' + btoa(clientId + ':' + clientSecret),
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: 'grant_type=client_credentials',
            });

            if (!response.ok) {
                throw new Error(`Spotify Token Error: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            return data.access_token;
        } catch (error) {
            console.error("Error fetching access token:", error);
            return null;
        }
    }

    async function loadTracks() {
    const accessToken = await getAccessToken();
    if (!accessToken) {
        displayError("Failed to authenticate with Spotify.");
        return;
    }

    const searchTerm = 'top hits';
    const url = `https://api.spotify.com/v1/search?q=${searchTerm}&type=track&limit=50`;

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            }
        });

        const data = await response.json();
        tracks = data.tracks?.items || [];

        // ✅ Filter out tracks that have no preview URL
        tracks = tracks.filter(track => track.preview_url);

        if (tracks.length === 0) {
            displayError("No playable tracks found. Try a different search.");
        }
    } catch (error) {
        console.error("Error fetching tracks:", error);
        displayError("Failed to load tracks.");
    }
}


    async function startQuiz() {
        if (startButton) startButton.style.display = 'none';
        if (quizContainer) quizContainer.style.display = 'block';
        
        await loadTracks();

        if (tracks.length > 0) {
            showQuestion();
        }
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
    if (!audioUrl) {
        console.warn("No preview URL available for this track.");
        questionElement.innerText = "⚠️ No preview available for this track!";
        return;
    }

    const audioElement = document.getElementById("audioPlayer");
    if (!audioElement) {
        console.error("Audio element not found.");
        return;
    }

    console.log("Playing audio:", audioUrl);
    audioElement.src = audioUrl;
    audioElement.load();

    audioElement.play().catch(error => {
        console.warn("Autoplay blocked—try clicking the play button manually.", error);
    });
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
         totalQuestions.innerText = tracks.length;
    musicResultsElement.innerHTML = tracks.map(track => `<li>"${track.name}" by ${track.artists[0].name}</li>`).join('');

    // Prompt for name and save score
    const name = prompt("Enter your name for the leaderboard:");
    if (name) {
        saveScoreToLeaderboard(name, score);
    }
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
function saveScoreToLeaderboard(name, score) {
    const leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];
    leaderboard.push({ name, score });
    leaderboard.sort((a, b) => b.score - a.score); // Sort scores from highest to lowest
    localStorage.setItem("leaderboard", JSON.stringify(leaderboard));
}

