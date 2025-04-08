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
    const audioElement = document.getElementById('audioPlayer'); // Get the audio element

    if (startButton) startButton.addEventListener('click', startQuiz);
    if (nextButton) nextButton.addEventListener('click', nextQuestion);
    if (restartButton) restartButton.addEventListener('click', restartQuiz);

    // Start the quiz
    async function startQuiz() {
        console.log("startQuiz called");
        if (startButton) startButton.style.display = 'none';
        if (quizContainer) quizContainer.style.display = 'block';
        await loadTracks();
        if (tracks.length > 0) {
            showQuestion();
        } else {
            if (questionElement) questionElement.innerText = 'Failed to load tracks.';
            if (answersElement) answersElement.innerHTML = '';
        }
    }

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
        if (data && data.tracks && data.tracks.items) {
            tracks = data.tracks.items;
            console.log("Loaded tracks:", tracks);
        } else {
            console.error("Error loading tracks:", data);
            if (questionElement) questionElement.innerText = 'Failed to load tracks from Spotify.';
            if (answersElement) answersElement.innerHTML = '';
        }
    }

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
                    button.classList.add('btn');
                    button.addEventListener('click', () => selectAnswer(answer));
                    answersElement.appendChild(button);
                });
            }

            if (nextButton) nextButton.style.display = 'none';

            // Play the audio snippet
            playAudioSnippet(currentTrack.preview_url);

        } else {
            showResults();
        }
    }

    function playAudioSnippet(audioUrl) {
        console.log("playAudioSnippet called with URL:", audioUrl);
        if (audioElement && audioUrl) {
            audioElement.src = audioUrl;
            audioElement.load(); // Ensure the new source is loaded
            const playPromise = audioElement.play();

            if (playPromise !== undefined) {
                playPromise.then(() => {
                    console.log("Audio playback started");
                    setTimeout(() => {
                        audioElement.pause();
                        audioElement.currentTime = 0;
                        console.log("Audio playback stopped after 5 seconds");
                    }, 5000);
                }).catch(error => {
                    console.error("Error playing audio:", error);
                    console.warn("Attempting to play audio after user interaction...");
                    // Try playing again after a short delay (might help with autoplay issues)
                    setTimeout(() => {
                        audioElement.play().catch(retryError => {
                            console.error("Retry play failed:", retryError);
                        });
                    }, 500);
                });
            }
        } else {
            console.warn("audioElement is null or audioUrl is missing.");
        }
    }

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

    function nextQuestion() {
        currentQuestionIndex++;
        showQuestion();
    }

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

    function restartQuiz() {
        currentQuestionIndex = 0;
        score = 0;
        tracks = [];
        if (resultsContainer) resultsContainer.style.display = 'none';
        if (startButton) startButton.style.display = 'flex';
        if (musicResultsElement) musicResultsElement.innerHTML = '';
        loadTracks();
        if (quizContainer) quizContainer.style.display = 'none';
        if (audioElement) {
            audioElement.pause();
            audioElement.currentTime = 0;
        }
    }
});
