import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface BalloonProps {
  onClick: () => void;
  isPopped: boolean;
}

const Balloon: React.FC<BalloonProps> = ({ onClick, isPopped }) => {
  const [balloonFalling, setBalloonFalling] = useState(true);

  const randomTop = Math.random() * 100;  // Randomize starting position of the balloon
  const randomLeft = Math.random() * 100;  // Randomize the position
  const randomRotation = Math.random() * 360; // Randomize rotation to make it more dynamic

  const balloonStyle = {
    position: 'absolute',
    top: `${randomTop}vh`,
    left: `${randomLeft}vw`,
    backgroundColor: getRandomColor(),
    width: '10vw', // Responsive width based on viewport width
    height: '14vw', // Responsive height based on viewport width
    zIndex: 5, // Keep the balloon above background but below explosion
  };

  return (
    <motion.div
      className="cursor-pointer rounded-full"
      style={balloonStyle}
      onClick={onClick}
      initial={{
        opacity: 1,
        y: '-20vh', // Start above the screen
        rotate: randomRotation,
      }}
      animate={{
        y: balloonFalling && !isPopped ? '100vh' : '0vh',  // Make balloon fall
        opacity: isPopped ? 0 : 1, // Hide balloon when popped
        scale: isPopped ? 0 : 1, // Shrink balloon when popped
        rotate: randomRotation,
      }}
      transition={{
        type: 'spring',
        stiffness: 10,  // Adjusted to make it fall slower
        damping: 40,  // Adjusted for slower bounce effect
        duration: 20,  // Slow falling duration
      }}
    >
      {isPopped && (
        <motion.div
          className="absolute rounded-full bg-orange-500"
          initial={{ scale: 1 }}
          animate={{ scale: [1, 1.5, 0], opacity: [1, 0.7, 0] }}
          transition={{ duration: 0.5 }}
          style={{
            width: '100%',
            height: '100%',
            zIndex: 10,  // Explosion on top
          }}
        />
      )}
    </motion.div>
  );
};

const getRandomColor = () => {
  const colors = ['red', 'blue', 'green', 'yellow', 'pink', 'purple'];
  return colors[Math.floor(Math.random() * colors.length)];
};

export default Balloon;
