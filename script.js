// Game state variables
let battingData = [];
let bowlingData = [];
let currentMode = 'batting'; // Default mode
let currentPlayer = null;
let selectedStat = '';
let totalScore = 0;
let currentRound = 0;
let maxRounds = 10;
let usedPlayers = [];

// Stats available for guessing
const battingStats = ['matches', 'runs', 'average', 'hundreds', 'fifties'];
const bowlingStats = ['matches', 'wickets', 'average', 'economy', 'five_wicket_hauls'];

// DOM Elements
const battingModeBtn = document.getElementById('batting-mode');
const bowlingModeBtn = document.getElementById('bowling-mode');
const battingStatsDiv = document.getElementById('batting-stats');
const bowlingStatsDiv = document.getElementById('bowling-stats');
const playerNameEl = document.getElementById('player-name');
const playerTeamEl = document.getElementById('player-team');
const playerSpanEl = document.getElementById('player-span');
const guessArea = document.querySelector('.guess-area');
const resultArea = document.querySelector('.result-area');
const selectedStatEl = document.getElementById('selected-stat');
const guessInput = document.getElementById('guess-input');
const submitGuessBtn = document.getElementById('submit-guess');
const resultMessage = document.getElementById('result-message');
const resultStatName = document.getElementById('result-stat-name');
const actualValueEl = document.getElementById('actual-value');
const userGuessEl = document.getElementById('user-guess');
const scoreEl = document.getElementById('score');
const totalScoreEl = document.getElementById('total-score');
const roundCounterEl = document.getElementById('round-counter');
const nextPlayerBtn = document.getElementById('next-player');
const startGameBtn = document.getElementById('start-game');
const restartGameBtn = document.getElementById('restart-game');
const gameOverDiv = document.querySelector('.game-over');
const finalScoreEl = document.getElementById('final-score');
const playAgainBtn = document.getElementById('play-again');

// Fetch data
async function fetchData() {
    try {
        const battingResponse = await fetch('cricket_batting_stats.json');
        battingData = await battingResponse.json();
        
        const bowlingResponse = await fetch('cricket_bowling_stats.json');
        bowlingData = await bowlingResponse.json();
        
        console.log('Data loaded successfully');
    } catch (error) {
        console.error('Error loading data:', error);
        alert('Failed to load cricket stats data. Please refresh the page.');
    }
}

// Initialize the game
async function initGame() {
    // Apply dark theme
    document.body.classList.add('dark-theme');
    
    await fetchData();
    setupEventListeners();
}

// Set up event listeners
function setupEventListeners() {
    // Mode selection
    battingModeBtn.addEventListener('click', () => switchMode('batting'));
    bowlingModeBtn.addEventListener('click', () => switchMode('bowling'));
    
    // Game controls
    submitGuessBtn.addEventListener('click', submitGuess);
    nextPlayerBtn.addEventListener('click', nextPlayer);
    startGameBtn.addEventListener('click', startGame);
    restartGameBtn.addEventListener('click', restartGame);
    playAgainBtn.addEventListener('click', restartGame);
    
    // Enter key for submitting guess
    guessInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            submitGuess();
        }
    });
}

// Switch between batting and bowling modes
function switchMode(mode) {
    currentMode = mode;
    
    // Update UI
    if (mode === 'batting') {
        battingModeBtn.classList.add('active');
        bowlingModeBtn.classList.remove('active');
    } else {
        battingModeBtn.classList.remove('active');
        bowlingModeBtn.classList.add('active');
    }
    
    // Hide stat selection buttons as they're no longer needed
    battingStatsDiv.classList.add('hidden');
    bowlingStatsDiv.classList.add('hidden');
}

// Randomly select a stat to guess
function selectRandomStat() {
    const stats = currentMode === 'batting' ? battingStats : bowlingStats;
    const randomIndex = Math.floor(Math.random() * stats.length);
    selectedStat = stats[randomIndex];
    
    // Show guess area with the randomly selected stat
    selectedStatEl.textContent = formatStatName(selectedStat);
    guessArea.classList.remove('hidden');
    resultArea.classList.add('hidden');
    
    // Focus on input
    guessInput.value = '';
    guessInput.focus();
}

// Format stat name for display
function formatStatName(stat) {
    const formattedNames = {
        'matches': 'Matches',
        'runs': 'Runs',
        'average': 'Average',
        'hundreds': 'Hundreds',
        'fifties': 'Fifties',
        'wickets': 'Wickets',
        'economy': 'Economy Rate',
        'five_wicket_hauls': '5-Wicket Hauls'
    };
    
    return formattedNames[stat] || stat;
}

// Start the game
function startGame() {
    // Reset game state
    totalScore = 0;
    currentRound = 0;
    usedPlayers = [];
    
    // Update UI
    totalScoreEl.textContent = totalScore;
    roundCounterEl.textContent = currentRound;
    startGameBtn.classList.add('hidden');
    restartGameBtn.classList.remove('hidden');
    
    // Get first player
    nextPlayer();
}

// Get next player
function nextPlayer() {
    currentRound++;
    
    if (currentRound > maxRounds) {
        endGame();
        return;
    }
    
    // Update round counter
    roundCounterEl.textContent = `${currentRound}/${maxRounds}`;
    
    // Get random player
    const data = currentMode === 'batting' ? battingData : bowlingData;
    let randomIndex;
    let attempts = 0;
    
    // Try to find a player that hasn't been used yet
    do {
        randomIndex = Math.floor(Math.random() * data.length);
        attempts++;
    } while (usedPlayers.includes(randomIndex) && attempts < 50 && usedPlayers.length < data.length);
    
    usedPlayers.push(randomIndex);
    currentPlayer = data[randomIndex];
    
    // Update player info
    playerNameEl.textContent = currentPlayer.name;
    playerTeamEl.textContent = currentPlayer.team;
    playerSpanEl.textContent = currentPlayer.span;
    
    // Select a random stat for this player
    selectRandomStat();
}

// Submit guess
function submitGuess() {
    if (!selectedStat || !currentPlayer) return;
    
    const guess = parseFloat(guessInput.value);
    
    if (isNaN(guess) || guess < 0) {
        alert('Please enter a valid number');
        return;
    }
    
    const actualValue = currentPlayer[selectedStat];
    let roundScore = 0;
    
    // Calculate score based on accuracy
    if (selectedStat === 'average' || selectedStat === 'economy') {
        // For decimal stats, score based on percentage difference
        const percentDiff = Math.abs((guess - actualValue) / actualValue) * 100;
        if (percentDiff <= 5) roundScore = 100;
        else if (percentDiff <= 10) roundScore = 80;
        else if (percentDiff <= 20) roundScore = 60;
        else if (percentDiff <= 30) roundScore = 40;
        else if (percentDiff <= 50) roundScore = 20;
        else roundScore = 10;
    } else {
        // For integer stats, score based on percentage difference
        const percentDiff = Math.abs((guess - actualValue) / actualValue) * 100;
        if (percentDiff <= 5) roundScore = 100;
        else if (percentDiff <= 10) roundScore = 80;
        else if (percentDiff <= 20) roundScore = 60;
        else if (percentDiff <= 30) roundScore = 40;
        else if (percentDiff <= 50) roundScore = 20;
        else roundScore = 10;
    }
    
    // Update total score
    totalScore += roundScore;
    
    // Update UI
    resultStatName.textContent = formatStatName(selectedStat);
    actualValueEl.textContent = actualValue;
    userGuessEl.textContent = guess;
    scoreEl.textContent = roundScore;
    totalScoreEl.textContent = totalScore;
    
    // Show result message
    if (roundScore >= 80) {
        resultMessage.textContent = 'Excellent guess!';
    } else if (roundScore >= 60) {
        resultMessage.textContent = 'Good guess!';
    } else if (roundScore >= 40) {
        resultMessage.textContent = 'Not bad!';
    } else {
        resultMessage.textContent = 'Try again!';
    }
    
    // Show result area
    guessArea.classList.add('hidden');
    resultArea.classList.remove('hidden');
}

// End the game
function endGame() {
    gameOverDiv.classList.remove('hidden');
    finalScoreEl.textContent = totalScore;
}

// Restart the game
function restartGame() {
    gameOverDiv.classList.add('hidden');
    startGame();
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', initGame); 