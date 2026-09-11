const DAILY_MIN_LEVEL = 4;
const DAILY_MAX_LEVEL = 25;

function padDatePart(value) {
  return String(value).padStart(
    2,
    '0'
  );
}

export function getDailySeed(
  date = new Date()
) {
  const year =
    date.getFullYear();

  const month =
    padDatePart(
      date.getMonth() + 1
    );

  const day =
    padDatePart(
      date.getDate()
    );

  return `${year}-${month}-${day}`;
}

function hashSeed(seed) {
  let hash = 2166136261;

  for (
    let index = 0;
    index < seed.length;
    index += 1
  ) {
    hash ^=
      seed.charCodeAt(index);

    hash = Math.imul(
      hash,
      16777619
    );
  }

  return hash >>> 0;
}

export function createDailyChallenge(
  seed = getDailySeed()
) {
  const hash =
    hashSeed(seed);

  const levelCount =
    DAILY_MAX_LEVEL -
    DAILY_MIN_LEVEL +
    1;

  const level =
    DAILY_MIN_LEVEL +
    (hash % levelCount);

  return {
    date: seed,
    seed,
    level,
  };
}
function getDateAtOffset(
  date,
  dayOffset
) {
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate() +
      dayOffset,
    12,
    0,
    0,
    0
  );
}

function getDailyHistoryMap(
  dailyHistory
) {
  const safeHistory =
    Array.isArray(
      dailyHistory
    )
      ? dailyHistory
      : [];

  return new Map(
    safeHistory
      .filter(
        (entry) =>
          typeof entry?.date ===
          'string'
      )
      .map(
        (entry) => [
          entry.date,
          entry,
        ]
      )
  );
}

export function getDailyStreak(
  dailyHistory,
  date = new Date()
) {
  const historyByDate =
    getDailyHistoryMap(
      dailyHistory
    );

  const todaySeed =
    getDailySeed(date);

  const todayCompleted =
    historyByDate.get(
      todaySeed
    )?.completed === true;

  let dayOffset =
    todayCompleted
      ? 0
      : -1;

  let streak = 0;

  while (true) {
    const seed =
      getDailySeed(
        getDateAtOffset(
          date,
          dayOffset
        )
      );

    const entry =
      historyByDate.get(
        seed
      );

    if (
      entry?.completed !==
      true
    ) {
      break;
    }

    streak += 1;
    dayOffset -= 1;
  }

  return streak;
}

export function getYesterdayDailyResult(
  dailyHistory,
  date = new Date()
) {
  const yesterdaySeed =
    getDailySeed(
      getDateAtOffset(
        date,
        -1
      )
    );

  const historyByDate =
    getDailyHistoryMap(
      dailyHistory
    );

  const yesterday =
    historyByDate.get(
      yesterdaySeed
    );

  if (!yesterday) {
    return null;
  }

  return {
    date:
      yesterdaySeed,

    completed:
      yesterday.completed ===
      true,

    attempts:
      Number.isFinite(
        yesterday.attempts
      )
        ? yesterday.attempts
        : 0,
  };
}