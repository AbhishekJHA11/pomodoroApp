import React, { useState, useEffect, useRef } from "react";
import "./App.css";

const WORK_TIME = 25 * 60;
const BREAK_TIME = 5 * 60;

const quotes = [
  "Focus on being productive instead of busy.",
  "Don’t watch the clock; do what it does. Keep going.",
  "Success is the sum of small efforts repeated day in and day out.",
  "Take breaks, recharge, and come back stronger.",
  "You don’t have to be great to start, but you have to start to be great.",
  "Discipline is the bridge between goals and accomplishment.",
  "Small steps every day lead to big results.",
  "Your future is created by what you do today, not tomorrow.",
  "Clear your mind and stay focused.",
  "Stay positive, work hard, make it happen.",
];

function App() {
  const [secondsLeft, setSecondsLeft] = useState(WORK_TIME);
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState("work");
  const [quote, setQuote] = useState("");

  const endSoundRef = useRef(null);
  const clickSoundRef = useRef(null);

  // Pick a random quote
  const getRandomQuote = () => {
    const index = Math.floor(Math.random() * quotes.length);
    return quotes[index];
  };

  useEffect(() => {
    let interval = null;
    if (isRunning) {
      interval = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev === 0) {
            playEndSound();
            switchMode();
            return mode === "work" ? BREAK_TIME : WORK_TIME;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, mode]);

  // When mode changes, if mode is work and timer starts, update the quote
  useEffect(() => {
    if (mode === "work" && isRunning) {
      setQuote(getRandomQuote());
    }
  }, [mode, isRunning]);

  const playEndSound = () => {
    if (endSoundRef.current) endSoundRef.current.play();
  };

  const playClickSound = () => {
    if (clickSoundRef.current) clickSoundRef.current.play();
  };

  const switchMode = () => {
    setMode((prev) => (prev === "work" ? "break" : "work"));
  };

  const formatTime = () => {
    const minutes = Math.floor(secondsLeft / 60);
    const seconds = secondsLeft % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  const handleStartPause = () => {
    playClickSound();
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    playClickSound();
    setIsRunning(false);
    setMode("work");
    setSecondsLeft(WORK_TIME);
    setQuote(""); // Clear quote on reset
  };

  return (
    <div className="app">
      <h1 className="title">Pomodoro Focus</h1>
      <div className="timer-wrapper">
        <div className={`circle ${mode}`}>
          <div className="time">{formatTime()}</div>
        </div>
        <div className="label">{mode === "work" ? "WORK" : "BREAK"}</div>

        {/* Motivational Quote */}
        {quote && <div className="quote-box">💡 {quote}</div>}

        <div className="buttons">
          <button className="glow-btn" onClick={handleStartPause}>
            {isRunning ? "Pause" : "Start"}
          </button>
          <button className="reset-btn" onClick={resetTimer}>Reset</button>
        </div>
      </div>

      <audio ref={endSoundRef} src="/ding.mp3" preload="auto" />
      <audio ref={clickSoundRef} src="/click.mp3" preload="auto" />
    </div>
  );
}

export default App;
