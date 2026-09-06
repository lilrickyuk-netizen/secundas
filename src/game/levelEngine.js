const BASE_ORBIT_DURATION = 3200;

const TUTORIAL_SAFE_PERCENT = 0.8;
const LEVEL_FOUR_SAFE_PERCENT = 0.45;

const SAFE_ZONE_SHRINK_RATE = 0.04;
const MIN_SAFE_ARC_PIXELS = 30;

const BASE_SPEED = 0.75;
const SPEED_TIER_GROWTH = 0.20;
const LEVELS_PER_SPEED_TIER = 5;

const SAFE_ZONE_BASE_START = 300;

const SAFE_ZONE_ROTATION_BASE_SPEED = 6;
const SAFE_ZONE_ROTATION_TIER_GROWTH = 0.20;

const SPEED_PULSE_START_LEVEL = 25;
const SPEED_PULSE_PERCENT = 0.15;

function getSafeZonePercent(level, orbitRadius) {
  const circumference =
    2 * Math.PI * orbitRadius;

  const minimumPercent =
    MIN_SAFE_ARC_PIXELS / circumference;

  if (level <= 3) {
    return TUTORIAL_SAFE_PERCENT;
  }

  if (level === 4) {
    return LEVEL_FOUR_SAFE_PERCENT;
  }

  const levelsAfterFour = 
  level - 4;

 const reducedPercent =
LEVEL_FOUR_SAFE_PERCENT -
SAFE_ZONE_SHRINK_RATE * 
levelsAfterFour;

  return Math.max(
    reducedPercent,
    minimumPercent
  );
}

function getDifficultyTier(level) {
  return Math.floor(
    (level - 1) /
      LEVELS_PER_SPEED_TIER
  );
}

function getSpeedMultiplier(level) {
  const tier =
    getDifficultyTier(level);

  return (
    BASE_SPEED *
    Math.pow(
      1 + SPEED_TIER_GROWTH,
      tier
    )
  );
}

function getSafeZoneRotationSpeed(
  level
) {
  const tier =
    getDifficultyTier(level);

  return (
    SAFE_ZONE_ROTATION_BASE_SPEED *
    Math.pow(
      1 +
        SAFE_ZONE_ROTATION_TIER_GROWTH,
      tier
    )
  );
}

export function getLevelConfig(
  level,
  orbitRadius
) {
  const safeLevel = Math.max(1, level);

  const safeZonePercent =
    getSafeZonePercent(
      safeLevel,
      orbitRadius
    );

  const speedMultiplier =
    getSpeedMultiplier(safeLevel);

  return {
    level: safeLevel,

    safeZoneStart:
      SAFE_ZONE_BASE_START,

    safeZoneSize:
      safeZonePercent * 360,

    safeZonePercent,

    speedMultiplier,

    orbitDuration:
      BASE_ORBIT_DURATION /
      speedMultiplier,

    tutorial:
      safeLevel <= 3,

    realGameBegins:
      safeLevel === 4,

    rotatesSafeZone: true,

    safeZoneRotationSpeed:
      getSafeZoneRotationSpeed(
        safeLevel
      ),

    pulsesSpeed:
      safeLevel >=
      SPEED_PULSE_START_LEVEL,

    speedPulsePercent:
      SPEED_PULSE_PERCENT,
  };
}

export function getOrbitDurationForCycle(
  config,
  cycleIndex
) {
  if (!config.pulsesSpeed) {
    return config.orbitDuration;
  }

  const pulseDirection =
    cycleIndex % 2 === 0
      ? 1
      : -1;

  const pulseMultiplier =
    1 +
    config.speedPulsePercent *
      pulseDirection;

  return (
    config.orbitDuration /
    pulseMultiplier
  );
}