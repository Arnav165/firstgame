// src/App.js
import React, { useState } from 'react';
import './App.css';

function App() {
  const [playerChoice, setPlayerChoice] = useState(null);
  const [computerChoice, setComputerChoice] = useState(null);
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const playGame = async (choice) => {
    setPlayerChoice(choice);
    setIsLoading(true);
    setComputerChoice(null);
    setResult(null);
    
    try {
      const response = await fetch('https://firstgame-fn6e.onrender.com/play', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ choice }),
      });
      
      const data = await response.json();
      
      // Add a slight delay for effect
      setTimeout(() => {
        setComputerChoice(data.computer_choice);
        setResult(data.result);
        setIsLoading(false);
      }, 800);
      
    } catch (error) {
      console.error('Error:', error);
      setResult('Error connecting to the server');
      setIsLoading(false);
    }
  };

  const getResultStyle = () => {
    if (result === 'you win') return 'win';
    if (result === 'you lose') return 'lose';
    if (result === 'tie') return 'tie';
    return '';
  };

  return (
    <div className="app">
      <header>
        <h1>Rock Paper Scissors</h1>
      </header>
      
      <div className="game-container">
        <div className="choice-buttons">
          <button 
            className={playerChoice === 'rock' ? 'active' : ''} 
            onClick={() => playGame('rock')}
            disabled={isLoading}
          >
            ✊ Rock
          </button>
          <button 
            className={playerChoice === 'paper' ? 'active' : ''} 
            onClick={() => playGame('paper')}
            disabled={isLoading}
          >
            ✋ Paper
          </button>
          <button 
            className={playerChoice === 'scissors' ? 'active' : ''} 
            onClick={() => playGame('scissors')}
            disabled={isLoading}
          >
            ✌️ Scissors
          </button>
        </div>
        
        <div className="result-area">
          {isLoading ? (
            <div className="loading-spinner"></div>
          ) : result ? (
            <div className="result-display">
              <div className="choices">
                <div className="choice-box">
                  <div className="choice-icon">
                    {playerChoice === 'rock' && '✊'}
                    {playerChoice === 'paper' && '✋'}
                    {playerChoice === 'scissors' && '✌️'}
                  </div>
                  <div className="choice-label">You</div>
                </div>
                
                <div className="vs">VS</div>
                
                <div className="choice-box">
                  <div className="choice-icon">
                    {computerChoice === 'rock' && '✊'}
                    {computerChoice === 'paper' && '✋'}
                    {computerChoice === 'scissors' && '✌️'}
                  </div>
                  <div className="choice-label">Computer</div>
                </div>
              </div>
              
              <div className={`result-message ${getResultStyle()}`}>
                {result === 'you win' && 'You Win! 🎉'}
                {result === 'you lose' && 'You Lose! 😢'}
                {result === 'tie' && "It's a Tie! 🤝"}
              </div>
              
              <button className="play-again" onClick={() => {
                setPlayerChoice(null);
                setComputerChoice(null);
                setResult(null);
              }}>
                Play Again
              </button>
            </div>
          ) : (
            <div className="initial-message">Select rock, paper, or scissors to start</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;