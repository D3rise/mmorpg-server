module.exports = {
  evasion: (evRate, defenderAgility, currentWeight) => {
    const chance =
      ((randomNumber(1, 100) * evRate) /
        ((defenderAgility + currentWeight) * 200)) *
      100;

    const rand = randomNumber(1, 100);
    return rand < chance;
  }
};

const randomNumber = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};
