import AsyncStorage from '@react-native-async-storage/async-storage';

export const GAME_DATA_KEY =
  '@secundas/game_data_v1';

const DEFAULT_SETTINGS = {
  muted: false,
  haptics: true,
  soundIntensity: 'normal',
  visualEffects: true,
};

export const DEFAULT_GAME_DATA = {
  version: 1,

  currentLevel: 1,

  levels: {},

  totalAttempts: 0,

  completedLevels: 0,

  dailyHistory: [],

  challenges: {},

  purchases: {},

  settings: {
    ...DEFAULT_SETTINGS,
  },
};

export async function saveData(
  key,
  value
) {
  try {
    const jsonValue =
      JSON.stringify(value);

    await AsyncStorage.setItem(
      key,
      jsonValue
    );

    return true;
  } catch (error) {
    console.error(
      'Failed to save data:',
      error
    );

    return false;
  }
}

export async function loadData(key) {
  try {
    const jsonValue =
      await AsyncStorage.getItem(
        key
      );

    if (jsonValue === null) {
      return null;
    }

    return JSON.parse(jsonValue);
  } catch (error) {
    console.error(
      'Failed to load data:',
      error
    );

    return null;
  }
}

export async function removeData(
  key
) {
  try {
    await AsyncStorage.removeItem(
      key
    );

    return true;
  } catch (error) {
    console.error(
      'Failed to remove data:',
      error
    );

    return false;
  }
}

function normalizeGameData(
  storedData
) {
  const data =
    storedData &&
    typeof storedData === 'object'
      ? storedData
      : {};

  const levels =
    data.levels &&
    typeof data.levels === 'object' &&
    !Array.isArray(data.levels)
      ? data.levels
      : {};

  const challenges =
    data.challenges &&
    typeof data.challenges === 'object' &&
    !Array.isArray(data.challenges)
      ? data.challenges
      : {};

  const purchases =
    data.purchases &&
    typeof data.purchases === 'object' &&
    !Array.isArray(data.purchases)
      ? data.purchases
      : {};

  const settings =
    data.settings &&
    typeof data.settings === 'object' &&
    !Array.isArray(data.settings)
      ? data.settings
      : {};

  return {
    ...DEFAULT_GAME_DATA,
    ...data,

    version: 1,

    currentLevel:
      Number.isInteger(
        data.currentLevel
      ) &&
      data.currentLevel >= 1
        ? data.currentLevel
        : 1,

    levels,

    totalAttempts:
      Number.isFinite(
        data.totalAttempts
      ) &&
      data.totalAttempts >= 0
        ? data.totalAttempts
        : 0,

    completedLevels:
      Number.isFinite(
        data.completedLevels
      ) &&
      data.completedLevels >= 0
        ? data.completedLevels
        : 0,

    dailyHistory:
      Array.isArray(
        data.dailyHistory
      )
        ? data.dailyHistory
        : [],

    challenges,

    purchases,

    settings: {
      ...DEFAULT_SETTINGS,
      ...settings,
    },
  };
}

let gameDataUpdateQueue =
  Promise.resolve();

async function readGameData() {
  const storedData =
    await loadData(
      GAME_DATA_KEY
    );

  return normalizeGameData(
    storedData
  );
}

export async function loadGameData() {
  await gameDataUpdateQueue;

  return readGameData();
}

export async function saveGameData(
  gameData
) {
  const normalizedData =
    normalizeGameData(
      gameData
    );

  return saveData(
    GAME_DATA_KEY,
    normalizedData
  );
}

export function updateGameData(
  updater
) {
  const queuedUpdate =
    gameDataUpdateQueue.then(
      async () => {
        const currentData =
          await readGameData();

        const updatedData =
          updater(currentData);

        const normalizedData =
          normalizeGameData(
            updatedData
          );

        const saved =
          await saveData(
            GAME_DATA_KEY,
            normalizedData
          );

        if (!saved) {
          return currentData;
        }

        return normalizedData;
      }
    );

  gameDataUpdateQueue =
    queuedUpdate.catch(
      (error) => {
        console.error(
          'Failed to update game data:',
          error
        );

        return null;
      }
    );

  return gameDataUpdateQueue;
}

export function updateGameSettings(
  settingsUpdate
) {
  return updateGameData(
    (gameData) => ({
      ...gameData,

      settings: {
        ...gameData.settings,
        ...settingsUpdate,
      },
    })
  );
}

export function recordLevelAttempt({
  level,
  attempts,
  pattern,
  success,
}) {
  return updateGameData(
    (gameData) => {
      const levelKey =
        `level_${level}`;

      const previousLevel =
        gameData.levels[
          levelKey
        ] ?? {};

      const wasCompleted =
        previousLevel.completed ===
        true;

      let bestAttempts =
        Number.isFinite(
          previousLevel.bestAttempts
        )
          ? previousLevel.bestAttempts
          : null;

      if (success) {
        bestAttempts =
          bestAttempts === null
            ? attempts
            : Math.min(
                bestAttempts,
                attempts
              );
      }

      return {
        ...gameData,

        currentLevel:
          success
            ? Math.max(
                gameData.currentLevel,
                level + 1
              )
            : Math.max(
                gameData.currentLevel,
                level
              ),

        totalAttempts:
          gameData.totalAttempts +
          1,

        completedLevels:
          success &&
          !wasCompleted
            ? gameData.completedLevels +
              1
            : gameData.completedLevels,

        levels: {
          ...gameData.levels,

          [levelKey]: {
            ...previousLevel,

            attempts,

            completed:
              wasCompleted ||
              success,

            pattern: [
              ...pattern,
            ],

            fastestMs:
              previousLevel.fastestMs ??
              null,

            bestAttempts,

            synced: false,
          },
        },
      };
    }
  );
}