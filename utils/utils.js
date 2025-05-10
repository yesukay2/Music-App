export const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0");
  return `${mins}:${secs}`;
};

export const getRandomColor = () =>
  `#${Math.floor(Math.random() * 0xffffff).toString(16)}`;
