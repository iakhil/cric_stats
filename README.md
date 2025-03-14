# Cricket Stats Guessing Game

A fun interactive game where players can test their cricket knowledge by guessing statistics of famous cricket players.

## Features

- Two game modes: Batting Stats and Bowling Stats
- Random stat selection for each player - guess runs, wickets, averages, and more
- Score based on how close your guess is to the actual value
- 10 rounds per game with different players
- Beautiful and responsive UI with a sleek dark theme

## How to Play

1. Open `index.html` in your web browser
2. Select a game mode (Batting or Bowling)
3. Click "Start Game"
4. For each player shown, you'll be asked to guess a randomly selected statistic
5. Enter your guess and click "Submit" (or press Enter)
6. See how close you were and your score for that round
7. Continue for 10 rounds to get your final score
8. Try to beat your high score!

## Scoring System

The scoring system is based on how close your guess is to the actual value:
- Within 5% of actual value: 100 points
- Within 10% of actual value: 80 points
- Within 20% of actual value: 60 points
- Within 30% of actual value: 40 points
- Within 50% of actual value: 20 points
- More than 50% off: 10 points

## Data Sources

The game uses two JSON files containing cricket statistics:
- `cricket_batting_stats.json` - Contains batting statistics for Test cricket players
- `cricket_bowling_stats.json` - Contains bowling statistics for Test cricket players

## Technologies Used

- HTML5
- CSS3
- JavaScript (ES6+)
- Fetch API for loading JSON data

## Setup

No installation required. Simply download all files and open `index.html` in a web browser.

## Browser Compatibility

This game works best in modern browsers like:
- Google Chrome
- Mozilla Firefox
- Microsoft Edge
- Safari

## License

This project is open source and available for personal and educational use. 