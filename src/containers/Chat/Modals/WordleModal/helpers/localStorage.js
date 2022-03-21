const gameStateKey = 'gameState';
const highContrastKey = 'highContrast';

export const saveGameStateToLocalStorage = (gameState) => {
  localStorage.setItem(gameStateKey, JSON.stringify(gameState));
};

export const loadGameStateFromLocalStorage = () => {
  const state = localStorage.getItem(gameStateKey);
  return state ? JSON.parse(state) : null;
};

const gameStatKey = 'gameStats';

export const saveStatsToLocalStorage = (gameStats) => {
  localStorage.setItem(gameStatKey, JSON.stringify(gameStats));
};

export const loadStatsFromLocalStorage = () => {
  const stats = localStorage.getItem(gameStatKey);
  return stats ? JSON.parse(stats) : null;
};

export const setStoredIsHighContrastMode = (isHighContrast) => {
  if (isHighContrast) {
    localStorage.setItem(highContrastKey, '1');
  } else {
    localStorage.removeItem(highContrastKey);
  }
};

export const getStoredIsHighContrastMode = () => {
  const highContrast = localStorage.getItem(highContrastKey);
  return highContrast === '1';
};
