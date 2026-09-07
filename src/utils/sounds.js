import {
  createAudioPlayer,
  preload,
  setAudioModeAsync,
} from 'expo-audio';

import {
  loadGameData,
} from './storage';

export const SOUND_KEYS =
  Object.freeze({
    TAP: 'tap',
    SUCCESS: 'success',
    FAIL: 'fail',
    NEAR_MISS: 'nearMiss',
    LEVEL_COMPLETE:
      'levelComplete',
    DAILY_OPEN: 'dailyOpen',
    CHALLENGE_PING:
      'challengePing',
    SHARE_READY: 'shareReady',
    ORBIT_PULSE: 'orbitPulse',
    HARD_LEVEL: 'hardLevel',
  });

const SOUND_SOURCES = {
  [SOUND_KEYS.TAP]:
    require(
      '../assets/sounds/tap.wav'
    ),

  [SOUND_KEYS.SUCCESS]:
    require(
      '../assets/sounds/success.wav'
    ),

  [SOUND_KEYS.FAIL]:
    require(
      '../assets/sounds/fail.wav'
    ),

  [SOUND_KEYS.NEAR_MISS]:
    require(
      '../assets/sounds/near_miss.wav'
    ),

  [SOUND_KEYS.LEVEL_COMPLETE]:
    require(
      '../assets/sounds/level_complete.wav'
    ),

  [SOUND_KEYS.DAILY_OPEN]:
    require(
      '../assets/sounds/daily_open.wav'
    ),

  [SOUND_KEYS.CHALLENGE_PING]:
    require(
      '../assets/sounds/challenge_ping.wav'
    ),

  [SOUND_KEYS.SHARE_READY]:
    require(
      '../assets/sounds/share_ready.wav'
    ),

  [SOUND_KEYS.ORBIT_PULSE]:
    require(
      '../assets/sounds/orbit_pulse.wav'
    ),

  [SOUND_KEYS.HARD_LEVEL]:
    require(
      '../assets/sounds/hard_level.wav'
    ),
};

const SOUND_CHANNELS = {
  [SOUND_KEYS.TAP]:
    'input',

  [SOUND_KEYS.SUCCESS]:
    'result',

  [SOUND_KEYS.FAIL]:
    'result',

  [SOUND_KEYS.NEAR_MISS]:
    'result',

  [SOUND_KEYS.LEVEL_COMPLETE]:
    'event',

  [SOUND_KEYS.DAILY_OPEN]:
    'event',

  [SOUND_KEYS.CHALLENGE_PING]:
    'event',

  [SOUND_KEYS.SHARE_READY]:
    'event',

  [SOUND_KEYS.ORBIT_PULSE]:
    'ambient',

  [SOUND_KEYS.HARD_LEVEL]:
    'event',
};

const SOUND_VOLUMES = {
  [SOUND_KEYS.TAP]:
    0.35,

  [SOUND_KEYS.SUCCESS]:
    0.55,

  [SOUND_KEYS.FAIL]:
    0.65,

  [SOUND_KEYS.NEAR_MISS]:
    0.5,

  [SOUND_KEYS.LEVEL_COMPLETE]:
    0.6,

  [SOUND_KEYS.DAILY_OPEN]:
    0.5,

  [SOUND_KEYS.CHALLENGE_PING]:
    0.45,

  [SOUND_KEYS.SHARE_READY]:
    0.35,

  [SOUND_KEYS.ORBIT_PULSE]:
    0.18,

  [SOUND_KEYS.HARD_LEVEL]:
    0.6,
};

const REDUCED_VOLUME_MULTIPLIER =
  0.55;

const REDUCED_FAIL_VOLUME =
  0.28;

const soundEntries =
  Object.entries(
    SOUND_SOURCES
  );

const preloadPromise =
  Promise.allSettled(
    soundEntries.map(
      ([, source]) =>
        preload(
          source,
          {
            preferredForwardBufferDuration:
              1,
          }
        )
    )
  );

const players =
  new Map();

const activeByChannel = {
  input: null,
  result: null,
  event: null,
  ambient: null,
};

let soundSettings = {
  muted: false,
  soundIntensity: 'normal',
};

let initialized = false;

let initializationPromise =
  null;

function normalizeSoundSettings(
  settings = {}
) {
  return {
    muted:
      settings?.muted === true,

    soundIntensity:
      settings
        ?.soundIntensity ===
      'reduced'
        ? 'reduced'
        : 'normal',
  };
}

function getSoundVolume(key) {
  if (soundSettings.muted) {
    return 0;
  }

  const baseVolume =
    SOUND_VOLUMES[key] ??
    0.5;

  if (
    soundSettings
      .soundIntensity !==
    'reduced'
  ) {
    return baseVolume;
  }

  if (
    key ===
    SOUND_KEYS.ORBIT_PULSE
  ) {
    return 0;
  }

  if (
    key ===
    SOUND_KEYS.FAIL
  ) {
    return REDUCED_FAIL_VOLUME;
  }

  return (
    baseVolume *
    REDUCED_VOLUME_MULTIPLIER
  );
}

function applyPlayerVolumes() {
  players.forEach(
    (player, key) => {
      try {
        player.volume =
          getSoundVolume(key);
      } catch (error) {
        console.warn(
          'Audio volume update failed:',
          key,
          error
        );
      }
    }
  );
}

async function stopPlayer(
  player
) {
  if (!player) {
    return;
  }

  try {
    player.pause();

    await player.seekTo(0);
  } catch (error) {
    console.warn(
      'Audio stop failed:',
      error
    );
  }
}

async function stopChannel(
  channel
) {
  const activeKey =
    activeByChannel[channel];

  if (!activeKey) {
    return;
  }

  const player =
    players.get(
      activeKey
    );

  await stopPlayer(
    player
  );

  activeByChannel[channel] =
    null;
}

function isChannelPlaying(
  channel
) {
  const activeKey =
    activeByChannel[channel];

  if (!activeKey) {
    return false;
  }

  const player =
    players.get(
      activeKey
    );

  return (
    player?.playing === true
  );
}

export async function initializeSoundManager() {
  if (initialized) {
    return (
      players.size > 0
    );
  }

  if (
    initializationPromise
  ) {
    return initializationPromise;
  }

  initializationPromise =
    (async () => {
      try {
        await setAudioModeAsync({
          allowsRecording: false,
          shouldPlayInBackground:
            false,
          interruptionMode:
            'mixWithOthers',
        });
      } catch (error) {
        console.warn(
          'Audio mode setup failed:',
          error
        );
      }

      try {
        const gameData =
          await loadGameData();

        soundSettings =
          normalizeSoundSettings(
            gameData.settings
          );
      } catch (error) {
        console.warn(
          'Audio settings load failed:',
          error
        );
      }

      const preloadResults =
        await preloadPromise;

      preloadResults.forEach(
        (
          result,
          index
        ) => {
          if (
            result.status ===
            'rejected'
          ) {
            console.warn(
              'Audio preload failed:',
              soundEntries[
                index
              ][0],
              result.reason
            );
          }
        }
      );

      soundEntries.forEach(
        ([key, source]) => {
          try {
            const player =
              createAudioPlayer(
                source,
                {
                  downloadFirst:
                    true,
                }
              );

            player.volume =
              getSoundVolume(
                key
              );

            players.set(
              key,
              player
            );
          } catch (error) {
            console.warn(
              'Audio player creation failed:',
              key,
              error
            );
          }
        }
      );

      initialized = true;

      return (
        players.size > 0
      );
    })()
      .catch(
        (error) => {
          console.warn(
            'Sound manager initialization failed:',
            error
          );

          initialized =
            true;

          return false;
        }
      )
      .finally(() => {
        initializationPromise =
          null;
      });

  return initializationPromise;
}

export async function playSound(
  key
) {
  if (
    !Object.prototype
      .hasOwnProperty.call(
        SOUND_SOURCES,
        key
      )
  ) {
    console.warn(
      'Unknown sound key:',
      key
    );

    return false;
  }

  const ready =
    await initializeSoundManager();

  if (
    !ready ||
    soundSettings.muted
  ) {
    return false;
  }

  if (
    soundSettings
      .soundIntensity ===
      'reduced' &&
    key ===
      SOUND_KEYS.ORBIT_PULSE
  ) {
    return false;
  }

  const player =
    players.get(key);

  if (!player) {
    console.warn(
      'Sound unavailable:',
      key
    );

    return false;
  }

  const channel =
    SOUND_CHANNELS[key];

  try {
    if (
      channel ===
      'ambient'
    ) {
      if (
        isChannelPlaying(
          'result'
        ) ||
        isChannelPlaying(
          'event'
        )
      ) {
        return false;
      }
    } else {
      await stopChannel(
        'ambient'
      );
    }

    await stopChannel(
      channel
    );

    player.volume =
      getSoundVolume(
        key
      );

    player.play();

    activeByChannel[
      channel
    ] = key;

    return true;
  } catch (error) {
    console.warn(
      'Sound playback failed:',
      key,
      error
    );

    return false;
  }
}

export async function stopSound(
  key
) {
  const player =
    players.get(key);

  if (!player) {
    return false;
  }

  const channel =
    SOUND_CHANNELS[key];

  await stopPlayer(
    player
  );

  if (
    activeByChannel[
      channel
    ] === key
  ) {
    activeByChannel[
      channel
    ] = null;
  }

  return true;
}

export async function stopAllSounds() {
  await Promise.all(
    Array.from(
      players.values()
    ).map(
      (player) =>
        stopPlayer(player)
    )
  );

  Object.keys(
    activeByChannel
  ).forEach(
    (channel) => {
      activeByChannel[
        channel
      ] = null;
    }
  );
}

export function setSoundSettings(
  settings = {}
) {
  soundSettings =
    normalizeSoundSettings({
      ...soundSettings,
      ...settings,
    });

  applyPlayerVolumes();

  if (
    soundSettings.muted
  ) {
    void stopAllSounds();
  }

  return {
    ...soundSettings,
  };
}

export async function refreshSoundSettings() {
  try {
    const gameData =
      await loadGameData();

    return setSoundSettings(
      gameData.settings
    );
  } catch (error) {
    console.warn(
      'Audio settings refresh failed:',
      error
    );

    return {
      ...soundSettings,
    };
  }
}

export async function unloadSoundManager() {
  await stopAllSounds();

  players.forEach(
    (player, key) => {
      try {
        player.remove();
      } catch (error) {
        console.warn(
          'Audio player cleanup failed:',
          key,
          error
        );
      }
    }
  );

  players.clear();

  initialized = false;

  initializationPromise =
    null;
}

export function getSoundManagerState() {
  return {
    initialized,

    expectedSounds:
      soundEntries.length,

    loadedSounds:
      Array.from(
        players.keys()
      ),

    settings: {
      ...soundSettings,
    },
  };
}