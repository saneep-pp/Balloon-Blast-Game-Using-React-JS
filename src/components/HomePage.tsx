import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Balloon from './Balloon';
import { gameOverSound, levelUpSound, blastSound } from './sounds';
import { motion } from 'framer-motion';
import backgroundMusic from '/audio/background-music.mp3'; // Adjust path as needed

const HomePage: React.FC = () => {
  // Initialize state from localStorage or default values
  const [points, setPoints] = useState<number>(() => {
    const savedPoints = localStorage.getItem('points');
    return savedPoints ? parseInt(savedPoints, 10) : 0;
  });
  const [level, setLevel] = useState<number>(() => {
    const savedLevel = localStorage.getItem('level');
    return savedLevel ? parseInt(savedLevel, 10) : 0;
  });
  const [timeLeft, setTimeLeft] = useState<number>(() => {
    const savedTime = localStorage.getItem('timeLeft');
    return savedTime ? parseInt(savedTime, 10) : 0;
  });
  const [balloons, setBalloons] = useState<{ id: number; xPosition: number }[]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [levelUp, setLevelUp] = useState(false);
  const [poppedBalloons, setPoppedBalloons] = useState<Set<number>>(new Set());
  const [nextId, setNextId] = useState(0);
  const navigate = useNavigate();

  const levelUpTimer = useRef<NodeJS.Timeout | null>(null);
  const gameTimer = useRef<NodeJS.Timeout | null>(null);
  const balloonInterval = useRef<NodeJS.Timeout | null>(null);
  const backgroundAudio = useRef<HTMLAudioElement | null>(null);

  const balloonSpeed = Math.max(500, 2000 - level * 20);
  const maxBalloons = 1;

  // Background music setup
  useEffect(() => {
    backgroundAudio.current = new Audio(backgroundMusic);
    backgroundAudio.current.loop = true;
    backgroundAudio.current.volume = 0.1;

    const playPromise = backgroundAudio.current.play();
    if (playPromise !== undefined) {
      playPromise.catch((error) => {
        console.log('Autoplay prevented:', error);
      });
    }

    return () => {
      if (backgroundAudio.current) {
        backgroundAudio.current.pause();
        backgroundAudio.current = null;
      }
    };
  }, []);

  // Pause/resume music based on game state
  useEffect(() => {
    if (gameOver && backgroundAudio.current) {
      backgroundAudio.current.pause();
    }
    if (!gameOver && backgroundAudio.current) {
      backgroundAudio.current.play().catch((error) => {
        console.log('Playback error:', error);
      });
    }
  }, [gameOver]);

  useEffect(() => {
    const startGameTimer = () => {
      let newTimeLeft = 0;
      if (level === 1) newTimeLeft = Infinity;
      else if (level <= 50) newTimeLeft = 300;
      else if (level <= 99) newTimeLeft = 30;
      else if (level === 100) newTimeLeft = 10;

      if (timeLeft === 0) {
        setTimeLeft(newTimeLeft);
        localStorage.setItem('timeLeft', newTimeLeft.toString());
      }

      if (level !== 1) {
        gameTimer.current = setInterval(() => {
          setTimeLeft((prev) => {
            const newTime = prev - 1;
            localStorage.setItem('timeLeft', newTime.toString());
            if (newTime <= 1) {
              clearInterval(gameTimer.current!);
              setGameOver(true);
              gameOverSound();
            }
            return newTime;
          });
        }, 1000);
      }
    };

    startGameTimer();
    generateBalloons();

    return () => {
      clearInterval(gameTimer.current!);
      clearInterval(levelUpTimer.current!);
      clearInterval(balloonInterval.current!);
    };
  }, [level]);

  useEffect(() => {
    localStorage.setItem('points', points.toString());
    localStorage.setItem('level', level.toString());
    localStorage.setItem('timeLeft', timeLeft.toString());
  }, [points, level, timeLeft]);

  const generateBalloons = () => {
    if (balloonInterval.current) clearInterval(balloonInterval.current);

    balloonInterval.current = setInterval(() => {
      setBalloons((prev) => {
        const activeBalloons = prev.filter((b) => !poppedBalloons.has(b.id));
        if (gameOver || levelUp || activeBalloons.length >= maxBalloons) {
          return prev;
        }
        const newBalloon = { id: nextId, xPosition: Math.random() * 90 };
        return [...prev, newBalloon];
      });
      setNextId((prevId) => prevId + 1);
    }, balloonSpeed + 10);
  };

  const generateLevelUpBalloons = () => {
    if (balloonInterval.current) clearInterval(balloonInterval.current);

    const intervals = [1000, 2000, 3000];
    intervals.forEach((intervalTime, index) => {
      setTimeout(() => {
        setBalloons((prev) => {
          const activeBalloons = prev.filter((b) => !poppedBalloons.has(b.id));
          if (gameOver || !levelUp || activeBalloons.length >= maxBalloons) {
            return prev;
          }
          const newBalloon = { id: nextId + index, xPosition: Math.random() * 90 };
          return [...prev, newBalloon];
        });
        setNextId((prevId) => prevId + 1);
      }, intervalTime);
    });
  };

  const handleBalloonPop = (id: number) => {
    if (!poppedBalloons.has(id)) {
      setPoppedBalloons((prev) => new Set([...prev, id]));
      setPoints((prev) => {
        const newPoints = prev + 1;
        if (newPoints % 50 === 0) levelUpLogic();
        return newPoints;
      });
      blastSound();
    }
  };

  const handleRemoveBalloon = (id: number) => {
    setBalloons((prev) => prev.filter((b) => b.id !== id));
    setPoppedBalloons((prev) => {
      const newSet = new Set(prev);
      newSet.delete(id);
      return newSet;
    });
  };

  const levelUpLogic = () => {
    setLevelUp(true);
    levelUpSound();
    setLevel((prev) => prev + 1);
    generateLevelUpBalloons();
    levelUpTimer.current = setTimeout(() => setLevelUp(false), 3000);
  };

  const handleNextLevel = () => {
    setLevelUp(false);
    setBalloons([]);
    setPoppedBalloons(new Set());
    generateBalloons();
  };

  const resetGame = () => {
    setPoints(0);
    setLevel(1);
    setTimeLeft(0);
    setBalloons([]);
    setPoppedBalloons(new Set());
    setNextId(0);
    setGameOver(false);
    localStorage.clear();
    if (backgroundAudio.current) {
      backgroundAudio.current.currentTime = 0;
      backgroundAudio.current.play().catch((error) => {
        console.log('Playback error:', error);
      });
    }
  };

  const toggleMusic = () => {
    if (backgroundAudio.current) {
      if (backgroundAudio.current.paused) {
        backgroundAudio.current.play().catch((error) => {
          console.log('Playback error:', error);
        });
      } else {
        backgroundAudio.current.pause();
      }
    }
  };

  if (gameOver) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-b from-purple-900 to-pink-900">
        <motion.h1
          className="text-5xl font-bold text-yellow-400 mb-8 drop-shadow-lg"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 100 }}
        >
          🎉 Game Over! 🎉
        </motion.h1>
        <p className="text-2xl text-white mb-8">You scored {points} points!</p>
        <motion.button
          onClick={resetGame}
          className="px-8 py-4 bg-yellow-400 rounded-full text-xl font-bold text-purple-900 hover:bg-yellow-300"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          Play Again
        </motion.button>
        <motion.button
          onClick={toggleMusic}
          className="mt-4 px-6 py-2 bg-blue-400 rounded-full text-lg font-bold text-white hover:bg-blue-300"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          Toggle Music
        </motion.button>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-sky-400 to-blue-600 overflow-hidden">
      <div className="container mx-auto px-4 py-8 flex justify-between items-center text-xl font-bold text-white">
        <div className="bg-blue-800/30 px-6 py-3 rounded-lg">Level: {level}</div>
        <div className="bg-blue-800/30 px-6 py-3 rounded-lg">
          Time: {level === 1 ? '∞' : timeLeft}
        </div>
        <div className="bg-blue-800/30 px-6 py-3 rounded-lg">⭐ {points}</div>
        <motion.button
          onClick={toggleMusic}
          className="bg-blue-800/30 px-6 py-3 rounded-lg"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          🎵
        </motion.button>
      </div>

      <div className="absolute inset-0">
        {balloons.map((balloon) => (
          <Balloon
            key={balloon.id}
            id={balloon.id}
            xPosition={balloon.xPosition}
            onPop={handleBalloonPop}
            isPopped={poppedBalloons.has(balloon.id)}
            onRemove={handleRemoveBalloon}
          />
        ))}
      </div>

      {levelUp && (
        <motion.div
          className="fixed inset-0 bg-black/50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="bg-yellow-400 p-12 rounded-2xl text-center">
            <motion.div
              animate={{ y: [-20, 0, -20], rotate: [-10, 10, -10] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              <div className="text-6xl mb-6">🎈</div>
              <h2 className="text-4xl font-bold text-purple-900 mb-6">
                Level Up!
              </h2>
              <p className="text-2xl text-white mb-8">
                Reached Level {level}!
              </p>
              <motion.button
                onClick={handleNextLevel}
                className="px-8 py-4 bg-purple-600 text-white rounded-full text-xl font-bold"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Keep Going!
              </motion.button>
            </motion.div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default HomePage;