const gameStateKey = 'gameState';

export const saveGameStateToLocalStorage = (gameState) => {
  localStorage.setItem(gameStateKey, JSON.stringify(gameState));
};

const gameStatKey = 'gameStats';

export const saveStatsToLocalStorage = (gameStats) => {
  localStorage.setItem(gameStatKey, JSON.stringify(gameStats));
};

export const loadStatsFromLocalStorage = () => {
  const stats = localStorage.getItem(gameStatKey);
  return stats ? JSON.parse(stats) : null;
};
