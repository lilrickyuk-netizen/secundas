import {
  AppState,
  Platform,
} from 'react-native';

import 'react-native-url-polyfill/auto';

import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  createClient,
} from '@supabase/supabase-js';

import {
  loadGameData,
  updateGameData,
} from '../utils/storage';

import {
  getRevenueCatAccessState,
} from './revenuecat';

const SUPABASE_URL =
  process.env
    .EXPO_PUBLIC_SUPABASE_URL
    ?.trim() ??
  '';

const SUPABASE_KEY =
  (
    process.env
      .EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    process.env
      .EXPO_PUBLIC_SUPABASE_ANON_KEY ??
    ''
  ).trim();

const IS_CONFIGURED =
  SUPABASE_URL.length > 0 &&
  SUPABASE_KEY.length > 0;

const INITIAL_STATE = {
  configured:
    IS_CONFIGURED,

  status:
    IS_CONFIGURED
      ? 'idle'
      : 'not_configured',

  userId: null,

  lastSyncAt: null,

  attemptsUploaded: 0,

  dailyScoresUploaded: 0,
};

let supabaseState = {
  ...INITIAL_STATE,
};

let supabaseClient = null;

let initializationPromise =
  null;

let appStateSubscription =
  null;

const listeners =
  new Set();

function snapshotState() {
  return {
    ...supabaseState,
  };
}

function publishState(
  update
) {
  supabaseState = {
    ...supabaseState,
    ...update,
  };

  const snapshot =
    snapshotState();

  listeners.forEach(
    (listener) => {
      try {
        listener(snapshot);
      } catch {
        // Listener failure must
        // never block gameplay.
      }
    }
  );

  return snapshot;
}

async function hydrateLocalState() {
  const gameData =
    await loadGameData();

  const cached =
    gameData.sync
      ?.supabase;

  if (
    !cached ||
    typeof cached !==
      'object'
  ) {
    return;
  }

  publishState({
    userId:
      typeof cached.userId ===
        'string'
        ? cached.userId
        : null,

    lastSyncAt:
      Number.isFinite(
        cached.lastSyncAt
      )
        ? cached.lastSyncAt
        : null,
  });
}

function persistSyncMetadata(
  update
) {
  return updateGameData(
    (gameData) => ({
      ...gameData,

      sync: {
        ...gameData.sync,

        supabase: {
          ...(
            gameData.sync
              ?.supabase ??
            {}
          ),

          ...update,
        },
      },
    })
  );
}

function configureAutoRefresh(
  client
) {
  if (
    Platform.OS === 'web' ||
    appStateSubscription
  ) {
    return;
  }

  if (
    AppState.currentState ===
    'active'
  ) {
    client.auth
      .startAutoRefresh();
  }

  appStateSubscription =
    AppState.addEventListener(
      'change',
      (state) => {
        if (
          state === 'active'
        ) {
          client.auth
            .startAutoRefresh();

          return;
        }

        client.auth
          .stopAutoRefresh();
      }
    );
}

function getClient() {
  if (!IS_CONFIGURED) {
    return null;
  }

  if (supabaseClient) {
    return supabaseClient;
  }

  supabaseClient =
    createClient(
      SUPABASE_URL,
      SUPABASE_KEY,
      {
        auth: {
          ...(
            Platform.OS !== 'web'
              ? {
                  storage:
                    AsyncStorage,
                }
              : {}
          ),

          autoRefreshToken:
            true,

          persistSession:
            true,

          detectSessionInUrl:
            false,
        },
      }
    );

  configureAutoRefresh(
    supabaseClient
  );

  return supabaseClient;
}

async function getOrCreateAnonymousUser(
  client
) {
  const {
    data: sessionData,
    error: sessionError,
  } =
    await client.auth
      .getSession();

  if (sessionError) {
    throw sessionError;
  }

  const existingUser =
    sessionData
      ?.session
      ?.user;

  if (existingUser?.id) {
    return existingUser;
  }

  const {
    data,
    error,
  } =
    await client.auth
      .signInAnonymously();

  if (error) {
    throw error;
  }

  const user =
    data?.user ??
    data?.session?.user ??
    null;

  if (!user?.id) {
    throw new Error(
      'Anonymous Supabase user was not created.'
    );
  }

  return user;
}

async function syncProfile(
  client,
  userId,
  gameData
) {
  const revenueCatAccess =
    getRevenueCatAccessState(
      gameData.purchases
        ?.revenueCat
    );

  const {
    error,
  } =
    await client
      .from('profiles')
      .upsert(
        {
          id:
            userId,

          total_attempts:
            gameData.totalAttempts,

          levels_completed:
            gameData
              .completedLevels,

          pro_status:
            revenueCatAccess
              .hasProAccess,

          last_active:
            new Date()
              .toISOString(),
        },
        {
          onConflict: 'id',
        }
      );

  if (error) {
    throw error;
  }
}

function getUnsyncedLevels(
  gameData
) {
  return Object
    .entries(
      gameData.levels ?? {}
    )
    .map(
      ([
        levelKey,
        levelData,
      ]) => {
        const match =
          /^level_(\d+)$/
            .exec(
              levelKey
            );

        if (!match) {
          return null;
        }

        const levelNumber =
          Number(
            match[1]
          );

        if (
          !Number.isInteger(
            levelNumber
          ) ||
          levelNumber < 1 ||
          levelData
            ?.synced === true ||
          !Number.isFinite(
            levelData
              ?.attempts
          ) ||
          levelData
            .attempts < 1
        ) {
          return null;
        }

        const pattern =
          Array.isArray(
            levelData.pattern
          )
            ? [
                ...levelData
                  .pattern,
              ]
            : [];

        return {
          levelKey,

          levelNumber,

          attempts:
            levelData.attempts,

          completed:
            levelData
              .completed ===
            true,

          pattern,

          patternSnapshot:
            JSON.stringify(
              pattern
            ),

          fastestMs:
            Number.isFinite(
              levelData
                .fastestMs
            )
              ? levelData
                  .fastestMs
              : null,
        };
      }
    )
    .filter(Boolean);
}

async function syncLevels(
  client,
  userId,
  gameData
) {
  const pending =
    getUnsyncedLevels(
      gameData
    );

  if (
    pending.length === 0
  ) {
    return 0;
  }

  const {
    error,
  } =
    await client
      .from('attempts')
      .insert(
        pending.map(
          (entry) => ({
            user_id:
              userId,

            level_number:
              entry
                .levelNumber,

            attempts:
              entry.attempts,

            completed:
              entry.completed,

            pattern:
              entry.pattern,

            time_to_complete_ms:
              entry.fastestMs,
          })
        )
      );

  if (error) {
    throw error;
  }

  await updateGameData(
    (currentData) => {
      const nextLevels = {
        ...currentData.levels,
      };

      pending.forEach(
        (entry) => {
          const current =
            nextLevels[
              entry.levelKey
            ];

          if (!current) {
            return;
          }

          const currentPattern =
            Array.isArray(
              current.pattern
            )
              ? current.pattern
              : [];

          const unchanged =
            current.attempts ===
              entry.attempts &&
            (
              current.completed ===
              true
            ) ===
              entry.completed &&
            JSON.stringify(
              currentPattern
            ) ===
              entry
                .patternSnapshot;

          if (!unchanged) {
            return;
          }

          nextLevels[
            entry.levelKey
          ] = {
            ...current,

            synced: true,
          };
        }
      );

      return {
        ...currentData,

        levels:
          nextLevels,
      };
    }
  );

  return pending.length;
}

function getUnsyncedDailyScores(
  gameData
) {
  return (
    gameData.dailyHistory ??
    []
  )
    .map(
      (
        entry,
        index
      ) => {
        if (
          entry?.completed !==
            true ||
          entry?.synced ===
            true ||
          typeof entry?.date !==
            'string' ||
          !Number.isInteger(
            entry?.level
          ) ||
          !Number.isFinite(
            entry?.attempts
          ) ||
          entry.attempts < 1
        ) {
          return null;
        }

        return {
          index,

          date:
            entry.date,

          level:
            entry.level,

          attempts:
            entry.attempts,
        };
      }
    )
    .filter(Boolean);
}

async function syncDailyScores(
  client,
  userId,
  gameData
) {
  const pending =
    getUnsyncedDailyScores(
      gameData
    );

  if (
    pending.length === 0
  ) {
    return 0;
  }

  const {
    error,
  } =
    await client
      .from('daily_scores')
      .insert(
        pending.map(
          (entry) => ({
            user_id:
              userId,

            date:
              entry.date,

            level_completed:
              entry.level,

            attempts:
              entry.attempts,
          })
        )
      );

  if (error) {
    throw error;
  }

  await updateGameData(
    (currentData) => {
      const nextHistory = [
        ...(
          currentData
            .dailyHistory ??
          []
        ),
      ];

      pending.forEach(
        (entry) => {
          const current =
            nextHistory[
              entry.index
            ];

          if (
            !current ||
            current.date !==
              entry.date ||
            current.level !==
              entry.level ||
            current.attempts !==
              entry.attempts ||
            current.completed !==
              true
          ) {
            return;
          }

          nextHistory[
            entry.index
          ] = {
            ...current,

            synced: true,
          };
        }
      );

      return {
        ...currentData,

        dailyHistory:
          nextHistory,
      };
    }
  );

  return pending.length;
}

async function syncGameplayData(
  client,
  userId
) {
  const gameData =
    await loadGameData();

  await syncProfile(
    client,
    userId,
    gameData
  );

  const attemptsUploaded =
    await syncLevels(
      client,
      userId,
      gameData
    );

  const dailyScoresUploaded =
    await syncDailyScores(
      client,
      userId,
      gameData
    );

  return {
    attemptsUploaded,

    dailyScoresUploaded,
  };
}

async function runInitialization() {
  try {
    await hydrateLocalState();
  } catch {
    // Local sync metadata is
    // optional.
  }

  if (!IS_CONFIGURED) {
    return publishState({
      configured: false,

      status:
        'not_configured',
    });
  }

  publishState({
    configured: true,

    status: 'connecting',
  });

  try {
    const client =
      getClient();

    if (!client) {
      throw new Error(
        'Supabase client unavailable.'
      );
    }

    const user =
      await getOrCreateAnonymousUser(
        client
      );

    await persistSyncMetadata({
      userId:
        user.id,
    });

    publishState({
      userId:
        user.id,

      status: 'syncing',
    });

    const summary =
      await syncGameplayData(
        client,
        user.id
      );

    const lastSyncAt =
      Date.now();

    await persistSyncMetadata({
      userId:
        user.id,

      lastSyncAt,
    });

    return publishState({
      status: 'ready',

      userId:
        user.id,

      lastSyncAt,

      attemptsUploaded:
        summary
          .attemptsUploaded,

      dailyScoresUploaded:
        summary
          .dailyScoresUploaded,
    });
  } catch (error) {
    console.warn(
      'Supabase optional sync unavailable:',
      error?.message ??
        error
    );

    return publishState({
      configured: true,

      status:
        'unavailable',
    });
  }
}

export function getSupabaseState() {
  return snapshotState();
}

export function subscribeSupabaseState(
  listener
) {
  if (
    typeof listener !==
      'function'
  ) {
    return () => {};
  }

  listeners.add(
    listener
  );

  return () => {
    listeners.delete(
      listener
    );
  };
}

export function initializeSupabase() {
  if (
    initializationPromise
  ) {
    return initializationPromise;
  }

  initializationPromise =
    runInitialization()
      .finally(() => {
        initializationPromise =
          null;
      });

  return initializationPromise;
}

export function refreshSupabaseSync() {
  return initializeSupabase();
}