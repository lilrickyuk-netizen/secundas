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