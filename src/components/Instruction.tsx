import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaVolumeUp, FaVolumeMute } from "react-icons/fa"; // Sound icons

const Instruction: React.FC = () => {
  const navigate = useNavigate();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [musicStarted, setMusicStarted] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const startMusic = () => {
    if (audioRef.current) {
        console.log(audioRef.current)
      audioRef.current.volume = 0.3; // Set volume level (0 to 1)
      audioRef.current.play().catch((error) => {
        console.warn("Play failed:", error);
      });
      setMusicStarted(true); // Hide the button after playing
    }
  };

  const toggleMusic = () => {
    if (audioRef.current) {
        console.log(audioRef.current)
      if (isMuted) {
        audioRef.current.muted = false;
      } else {
        audioRef.current.muted = true;
      }
      setIsMuted(!isMuted);
    }
  };
  const handlePlayButton = (): void => {
    navigate("/home");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-400 to-purple-500 p-6 text-center">
      {/* Background Music */}
      <audio ref={audioRef} loop>
        <source src="/audio/background-music.mp3" type="audio/mp3" />
        Your browser does not support the audio element.
      </audio>

      {/* Play Music Button (only shows if music hasn't started) */}
      {!musicStarted && (
        <motion.button
          onClick={startMusic}
          className="bg-green-500 text-white px-6 py-3 rounded-full text-lg font-bold mb-4 hover:bg-green-600 transition-all duration-300"
          whileHover={{ scale: 1.1 }}
        >
          🎵 Play Music
        </motion.button>
      )}
  <motion.button
        onClick={toggleMusic}
        className="absolute top-6 left-6 text-white bg-gray-800 p-3 rounded-full shadow-lg hover:bg-gray-700 transition-all"
        whileHover={{ scale: 1.2 }}
      >
        {isMuted ? <FaVolumeMute size={24} /> : <FaVolumeUp size={24} />}
      </motion.button>
      {/* Title Animation */}
      <motion.h1
        className="text-5xl font-extrabold text-yellow-300 drop-shadow-md mb-6"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        🎈 Balloon Blast! 🎈
      </motion.h1>

      {/* Instructions Card */}
      <motion.div
        className="bg-white p-6 rounded-3xl shadow-xl max-w-lg w-full text-lg text-gray-700"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <p className="text-xl font-semibold text-pink-600">How to Play:</p>
      
        <ul className="mt-4 text-left list-none space-y-3 text-gray-800">
          <li>🎯 <strong>Pop balloons</strong> to earn points!</li>
          <li>🎈 <strong>1 point</strong> per balloon.</li>
          <li>🔥 <strong>50 points</strong> to complete a level.</li>
          <li>🚀 <strong>100 exciting levels</strong> to explore!</li>
          <li>⚡ Balloons get <strong>faster</strong> as you progress!</li>
          <li>👆 Tap or click to pop them! 💥</li>
        </ul>
        <p className="mt-4 text-blue-600 font-semibold">
          🌟 Become the **Balloon Blast Champion**! 🏆
        </p>
      </motion.div>

      {/* Play Button Animation */}
      <motion.button
        onClick={handlePlayButton}
        className="mt-6 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-8 py-4 rounded-full text-xl font-bold shadow-lg hover:scale-110 transition-all duration-300"
        whileHover={{ scale: 1.2, rotate: 2 }}
        whileTap={{ scale: 0.9 }}
      >
        🚀 Start Popping! 🎮
      </motion.button>
    </div>
  );
};

export default Instruction;
