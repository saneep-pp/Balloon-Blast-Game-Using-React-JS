import React from 'react';
import { motion } from 'framer-motion';

interface BalloonProps {
  id: number;
  xPosition: number;
  onPop: (id: number) => void;
  isPopped: boolean;
  onRemove: (id: number) => void;
}

const Balloon: React.FC<BalloonProps> = ({ id, xPosition, onPop, isPopped, onRemove }) => {
  const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD', '#FF9F68'];
  const randomColor = colors[Math.floor(Math.random() * colors.length)];
  const floatDuration = 8 + Math.random() * 4; // Random fall speed

  return (
    <motion.div
      className="absolute cursor-pointer"
      style={{
        left: `${xPosition}%`,
        width: '8vw',
        height: '10vw',
        filter: 'drop-shadow(0 10px 8px rgba(0,0,0,0.2))',
      }}
      initial={{ y: '-20vh', opacity: 1, scale: 1 }} // Start above screen
      animate={
        isPopped
          ? { y: '-100vh', opacity: 0, scale: 0 } // Popped: rise and fade
          : { y: '120vh' } // Not popped: fall to bottom
      }
      transition={{
        y: {
          duration: isPopped ? 0.5 : floatDuration,
          ease: isPopped ? 'easeIn' : 'linear',
          repeat: isPopped ? 0 : Infinity, // Loop falling animation
          repeatType: 'loop',
        },
        opacity: { duration: isPopped ? 0.5 : 0 },
        scale: { duration: isPopped ? 0.5 : 0 },
      }}
      onAnimationComplete={(definition) => {
        // Remove balloon after pop animation finishes
        if (isPopped && definition.y === '-100vh') {
          onRemove(id);
        }
      }}
      onClick={() => !isPopped && onPop(id)} // Pop only if not already popped
    >
      {/* Sway animation */}
      <motion.div
        animate={{ x: ['0%', '5%', '-5%', '0%'] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <svg viewBox="0 0 100 140">
          <path
            d="M50 15C60 15 70 25 70 40C70 80 50 120 50 120C50 120 30 80 30 40C30 25 40 15 50 15Z"
            fill={randomColor}
          />
          <path
            d="M50 120L55 130L45 130Z"
            fill="#666"
            className="transition-all duration-300"
          />
        </svg>
      </motion.div>

      {/* Pop effect */}
      {isPopped && (
        <motion.div
          className="absolute inset-0 flex justify-center items-center"
          initial={{ scale: 0 }}
          animate={{ scale: [0, 2, 0], opacity: [1, 0.5, 0] }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-4 h-4 bg-yellow-400 rounded-full absolute" />
          <div className="w-4 h-4 bg-orange-500 rounded-full absolute" />
        </motion.div>
      )}
    </motion.div>
  );
};

export default Balloon;