# Cricket Stats Guessing Game

A fun interactive game where players can test their cricket knowledge by guessing statistics of famous cricket players in both Test and IPL formats.

## Features

- Two formats: Test Cricket and IPL
- Two game modes: Batting Stats and Bowling Stats
- Random stat selection for each player - guess runs, wickets, averages, and more
- Score based on how close your guess is to the actual value
- 10 rounds per game with different players
- Beautiful and responsive UI with a sleek dark theme

## How to Play

1. **Important:** You must use a web server to play this game (see Setup section below)
2. Open the game in your web browser at http://localhost:8000 (or the URL provided by your server)
3. Select a format (Test or IPL)
4. Select a game mode (Batting or Bowling)
5. Click "Start Game"
6. For each player shown, you'll be asked to guess a randomly selected statistic
7. Enter your guess and click "Submit" (or press Enter)
8. See how close you were and your score for that round
9. Continue for 10 rounds to get your final score
10. Try to beat your high score!

## Stats by Format

### Test Cricket
- **Batting Stats:** Matches, Runs, Average, Hundreds, Fifties
- **Bowling Stats:** Matches, Wickets, Average, Economy, 5-Wicket Hauls

### IPL Cricket
- **Batting Stats:** Matches, Runs, Average, Hundreds, Fifties
- **Bowling Stats:** Matches, Wickets, Average, Economy, 5-Wicket Hauls

> **Note:** In cases where a player has not achieved a certain stat (like centuries), the value may be displayed as "-" in the data. When guessing these stats, a value of 0 is the correct answer.

## Scoring System

The scoring system is based on how close your guess is to the actual value:
- Within 5% of actual value: 100 points
- Within 10% of actual value: 80 points
- Within 20% of actual value: 60 points
- Within 30% of actual value: 40 points
- Within 50% of actual value: 20 points
- More than 50% off: 10 points

## Data Sources

The game uses four JSON files containing cricket statistics:
- `cricket_batting_stats.json` - Contains Test batting statistics
- `cricket_bowling_stats.json` - Contains Test bowling statistics
- `ipl_batting.json` - Contains IPL batting statistics
- `ipl_bowling.json` - Contains IPL bowling statistics

## Setup

⚠️ **Important**: Due to browser security restrictions (CORS), this game must be accessed through a web server rather than opening the HTML file directly.

### Option 1: Using Python to create a simple web server

1. Make sure you have Python installed on your computer
2. Open a terminal/command prompt in the game directory
3. Run one of these commands to start a web server:
   - On macOS/Linux: `python3 -m http.server 8000`
   - On Windows: `python -m http.server 8000`
4. Open your browser and go to: http://localhost:8000

### Option 2: Using Visual Studio Code with Live Server

1. Open the project folder in Visual Studio Code
2. Install the "Live Server" extension
3. Right-click on `index.html` and select "Open with Live Server"
4. The game will open in your default browser

## Troubleshooting

- **Blank page or errors in console**: Make sure you're accessing the game through a web server (http://localhost:...) and not opening the file directly (file://...)
- **Player names not showing**: Check that all JSON files are properly formatted and accessible
- **Stats not loading**: Verify that the JSON files have the correct structure for Test and IPL formats

## Browser Compatibility

This game works best in modern browsers like:
- Google Chrome
- Mozilla Firefox
- Microsoft Edge
- Safari

## License

This project is open source and available for personal and educational use. 