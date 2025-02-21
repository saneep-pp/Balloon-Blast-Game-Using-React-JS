export const blastSound = () => {
    const sound = new Audio('/audio/blast-sound.wav');
    sound.play();
  };
  
  export const gameOverSound = () => {
    const sound = new Audio('/audio/game-over.mp3');
    sound.play();
  };
  
  export const levelUpSound = () => {
    const sound = new Audio('/audio/level-up.wav');
    sound.play();
  };
  
  export const winSound = () => {
    const sound = new Audio('/audio/win.mp3');
    sound.play();
  };
  