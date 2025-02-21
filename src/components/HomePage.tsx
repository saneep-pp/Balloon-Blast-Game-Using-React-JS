import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Balloon from './Balloon'; // Balloon component with blast animation
import { gameOverSound, levelUpSound, winSound, blastSound } from './sounds'; // Import your sound effects

const HomePage: React.FC = () => {
  const [points, setPoints] = useState(0);
  const [level, setLevel] = useState(1);
  const [timeLeft, setTimeLeft] = useState(0);
  const [balloons, setBalloons] = useState<number[]>([]); // Track individual balloons
  const [gameOver, setGameOver] = useState(false);
  const [levelUp, setLevelUp] = useState(false);
  const [poppedBalloons, setPoppedBalloons] = useState<Set<number>>(new Set()); // Track popped balloons
  const navigate = useNavigate();

  const levelUpTimer = useRef<NodeJS.Timeout | null>(null);
  const gameTimer = useRef<NodeJS.Timeout | null>(null);

  const balloonSpeed = 2000 + level * 100; // Slow speed, very slow as level increases
  const maxBalloons = 5; // Maximum 5 balloons falling at once

  useEffect(() => {
    const startGameTimer = () => {
      let newTimeLeft = 0;

      if (level === 1) newTimeLeft = Infinity;
      else if (level <= 50) newTimeLeft = 300; // 5 minutes for levels 2-50
      else if (level <= 99) newTimeLeft = 30;  // 30 seconds for levels 51-99
      else if (level === 100) newTimeLeft = 10; // 10 seconds for level 100

      setTimeLeft(newTimeLeft);

      if (level !== 1) {
        gameTimer.current = setInterval(() => {
          setTimeLeft((prev) => {
            if (prev <= 1) {
              clearInterval(gameTimer.current!);
              setGameOver(true);
              gameOverSound(); // Play game over music
            }
            return prev - 1;
          });
        }, 1000);
      }
    };

    startGameTimer();
    generateBalloons();

    return () => {
      clearInterval(gameTimer.current!);
      clearInterval(levelUpTimer.current!);
    };
  }, [level]);

  const generateBalloons = () => {
    const interval = setInterval(() => {
      if (gameOver) {
        clearInterval(interval);
        return;
      }
      if (balloons.length < maxBalloons) {
        setBalloons((prev) => [...prev, Date.now()]);
      }
      if (balloons.length >= maxBalloons) {
        clearInterval(interval);
      }
    }, balloonSpeed); // Adjust time between balloon generations based on level
  };

  const handleBalloonPop = (key: number) => {
    // Only pop the clicked balloon and update the points
    if (!poppedBalloons.has(key)) {
      setPoppedBalloons((prev) => new Set(prev).add(key));
      setPoints((prev) => prev + 1);
      blastSound(); // Play blast sound

      if (points + 1 >= 50) {
        levelUpLogic();
      }
    }
  };

  const levelUpLogic = () => {
    setLevelUp(true);
    levelUpSound(); // Play level-up sound
    setLevel((prevLevel) => prevLevel + 1);
    clearInterval(levelUpTimer.current!);
    levelUpTimer.current = setTimeout(() => setLevelUp(false), 3000);
  };

  const handleNextLevel = () => {
    setLevelUp(false);
    generateBalloons();
  };

  if (gameOver) {
    return (
      <div className="game-over flex flex-col items-center justify-center h-screen bg-gradient-to-r from-blue-400 via-purple-400 to-pink-500 text-white">
        <p className="text-3xl font-bold mb-4">Game Over! You scored {points} points!</p>
        <button
          onClick={() => navigate('/')}
          className="px-6 py-3 bg-yellow-400 text-black rounded-full hover:bg-yellow-500"
        >
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="game-container flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-green-400 via-blue-500 to-indigo-600 text-white">
      <div className="stats w-full p-4 flex justify-between items-center text-lg font-semibold absolute top-4 px-6 md:px-16">
        <p>Level: {level}</p>
        <p>Time Left: {timeLeft}</p>
        <p>Points: {points}</p>
      </div>

      {/* Balloons Falling */}
      <div className="flex w-full h-full">
        {balloons.map((key) => (
          <Balloon
            key={key}
            onClick={() => handleBalloonPop(key)}
            isPopped={poppedBalloons.has(key)}
          />
        ))}
      </div>

      {/* Level-up Pop-up */}
      {levelUp && (
        <div className="level-up-popup fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-yellow-500 p-8 rounded-xl text-black">
            <p className="text-2xl font-bold mb-4">Level Up! 🚀</p>
            <button
              onClick={handleNextLevel}
              className="px-6 py-3 bg-blue-500 text-white rounded-full hover:bg-blue-600"
            >
              Next Level
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
