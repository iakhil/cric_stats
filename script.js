// Game state variables
let battingData = [];
let bowlingData = [];
let currentFormat = 'test'; // Default format
let currentMode = 'batting'; // Default mode
let currentPlayer = null;
let selectedStat = '';
let totalScore = 0;
let currentRound = 0;
let maxRounds = 10;
let usedPlayers = [];

// Stats available for guessing
const testBattingStats = ['matches', 'runs', 'average', 'hundreds', 'fifties'];
const testBowlingStats = ['matches', 'wickets', 'average', 'economy', 'five_wicket_hauls'];
const iplBattingStats = ['mat', 'runs', 'ave', 'centuries', 'fifties'];
const iplBowlingStats = ['mat', 'wkts', 'ave', 'econ', 'fives'];

// DOM Elements
const testFormatBtn = document.getElementById('test-format');
const iplFormatBtn = document.getElementById('ipl-format');
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
        const battingFile = currentFormat === 'test' ? 'cricket_batting_stats.json' : 'ipl_batting.json';
        const bowlingFile = currentFormat === 'test' ? 'cricket_bowling_stats.json' : 'ipl_bowling.json';
        
        const battingResponse = await fetch(battingFile);
        battingData = await battingResponse.json();
        
        const bowlingResponse = await fetch(bowlingFile);
        bowlingData = await bowlingResponse.json();
        
        console.log('Data loaded successfully');
    } catch (error) {
        console.error('Error loading data:', error);
        alert('Failed to load cricket stats data. Please refresh the page.');
    }
}

// Function to update the game title based on format
function updateGameTitle() {
    const titleEl = document.querySelector('h1');
    titleEl.textContent = `${currentFormat === 'test' ? 'Test' : 'IPL'} Cricket Stats Guessing Game`;
}

// Initialize the game
async function initGame() {
    // Apply dark theme
    document.body.classList.add('dark-theme');
    
    // Set initial game title
    updateGameTitle();
    
    await fetchData();
    setupEventListeners();
}

// Set up event listeners
function setupEventListeners() {
    // Format selection
    testFormatBtn.addEventListener('click', () => switchFormat('test'));
    iplFormatBtn.addEventListener('click', () => switchFormat('ipl'));
    
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

// Switch between Test and IPL formats
function switchFormat(format) {
    currentFormat = format;
    
    // Update UI
    if (format === 'test') {
        testFormatBtn.classList.add('active');
        iplFormatBtn.classList.remove('active');
    } else {
        testFormatBtn.classList.remove('active');
        iplFormatBtn.classList.add('active');
    }
    
    // Update the game title
    updateGameTitle();
    
    // Reload data for the new format
    fetchData();
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

// Function to get the current stats array based on format and mode
function getCurrentStats() {
    if (currentFormat === 'test') {
        return currentMode === 'batting' ? testBattingStats : testBowlingStats;
    } else {
        return currentMode === 'batting' ? iplBattingStats : iplBowlingStats;
    }
}

// Randomly select a stat to guess
function selectRandomStat() {
    const stats = getCurrentStats();
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
        // Test cricket stats
        'matches': 'Matches',
        'runs': 'Runs',
        'average': 'Average',
        'hundreds': 'Hundreds',
        'fifties': 'Fifties',
        'wickets': 'Wickets',
        'economy': 'Economy Rate',
        'five_wicket_hauls': '5-Wicket Hauls',
        
        // IPL stats
        'mat': 'Matches',
        'ave': 'Average',
        'centuries': 'Hundreds',
        'wkts': 'Wickets',
        'econ': 'Economy Rate',
        'fives': '5-Wicket Hauls'
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
    
    // Safety check to make sure data is loaded
    if (!data || data.length === 0) {
        console.error("No data available for", currentMode, "in", currentFormat, "format");
        alert("No player data available. Please check that JSON files are loaded correctly.");
        return;
    }
    
    let randomIndex;
    let attempts = 0;
    
    // Try to find a player that hasn't been used yet
    do {
        randomIndex = Math.floor(Math.random() * data.length);
        attempts++;
    } while (usedPlayers.includes(randomIndex) && attempts < 50 && usedPlayers.length < data.length);
    
    usedPlayers.push(randomIndex);
    currentPlayer = data[randomIndex];
    
    // Safety check for player data
    if (!currentPlayer) {
        console.error("Invalid player data at index", randomIndex);
        nextPlayer(); // Try again with a different player
        return;
    }
    
    try {
        // Update player info based on format
        if (currentFormat === 'test') {
            playerNameEl.textContent = currentPlayer.name || "Unknown Player";
            playerTeamEl.textContent = currentPlayer.team || "Unknown Team";
        } else {
            // For IPL format, extract just the player name without the team
            if (currentPlayer.player) {
                const fullPlayerName = currentPlayer.player;
                const nameMatch = fullPlayerName.match(/^(.*?)\s*\(/);
                playerNameEl.textContent = nameMatch ? nameMatch[1].trim() : fullPlayerName;
                
                // Extract team from player field (inside parentheses)
                const teamMatch = fullPlayerName.match(/\((.*?)\)/);
                playerTeamEl.textContent = teamMatch ? teamMatch[1].trim() : "";
            } else {
                playerNameEl.textContent = "Unknown Player";
                playerTeamEl.textContent = "Unknown Team";
            }
        }
        
        playerSpanEl.textContent = currentPlayer.span || "";
        
        // Select a random stat for this player
        selectRandomStat();
    } catch (error) {
        console.error("Error processing player data:", error, currentPlayer);
        nextPlayer(); // Try again with a different player
    }
}

// Get actual value with special handling for non-numeric values
function getActualValue(player, stat) {
    const value = player[stat];
    
    // Handle non-numeric values like "-" by treating them as 0
    if (value === "-" || value === "" || value === null || value === undefined) {
        return 0;
    }
    
    // Handle cases where the value might contain non-numeric characters
    const parsedValue = parseFloat(value);
    if (isNaN(parsedValue)) {
        console.warn(`Non-numeric value found for ${stat}: ${value}`);
        return 0;
    }
    
    return parsedValue;
}

// Submit guess
function submitGuess() {
    if (!selectedStat || !currentPlayer) return;
    
    const guess = parseFloat(guessInput.value);
    
    if (isNaN(guess) || guess < 0) {
        alert('Please enter a valid number');
        return;
    }
    
    const actualValue = getActualValue(currentPlayer, selectedStat);
    let roundScore = 0;
    
    // Calculate score based on accuracy
    if (selectedStat === 'average' || selectedStat === 'economy' || 
        selectedStat === 'ave' || selectedStat === 'econ') {
        // For decimal stats, score based on percentage difference
        // Use a minimum value of 0.01 to avoid division by zero
        const percentDiff = Math.abs((guess - actualValue) / Math.max(actualValue, 0.01)) * 100;
        if (percentDiff <= 5) roundScore = 100;
        else if (percentDiff <= 10) roundScore = 80;
        else if (percentDiff <= 20) roundScore = 60;
        else if (percentDiff <= 30) roundScore = 40;
        else if (percentDiff <= 50) roundScore = 20;
        else roundScore = 10;
        
        // Show result
        if (percentDiff <= 5) {
            resultMessage.textContent = 'Excellent guess!';
        } else if (percentDiff <= 20) {
            resultMessage.textContent = 'Good guess!';
        } else if (percentDiff <= 50) {
            resultMessage.textContent = 'Not bad!';
        } else {
            resultMessage.textContent = 'Try again!';
        }
    } else {
        // For integer stats, score based on absolute difference
        const absDiff = Math.abs(guess - actualValue);
        // Use a minimum value of 1 to avoid division by zero
        const maxValue = Math.max(actualValue, 1);
        const percentDiff = (absDiff / maxValue) * 100;
        
        if (percentDiff <= 5) roundScore = 100;
        else if (percentDiff <= 10) roundScore = 80;
        else if (percentDiff <= 20) roundScore = 60;
        else if (percentDiff <= 30) roundScore = 40;
        else if (percentDiff <= 50) roundScore = 20;
        else roundScore = 10;
        
        // Show result
        if (percentDiff <= 5) {
            resultMessage.textContent = 'Excellent guess!';
        } else if (percentDiff <= 20) {
            resultMessage.textContent = 'Good guess!';
        } else if (percentDiff <= 50) {
            resultMessage.textContent = 'Not bad!';
        } else {
            resultMessage.textContent = 'Try again!';
        }
    }
    
    // Update score
    totalScore += roundScore;
    totalScoreEl.textContent = totalScore;
    scoreEl.textContent = roundScore;
    
    // Show result area
    resultStatName.textContent = formatStatName(selectedStat);
    actualValueEl.textContent = actualValue;
    userGuessEl.textContent = guess;
    
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