const BASE_ORBIT_DURATION = 3200;

const TUTORIAL_SAFE_PERCENT = 0.8;
const LEVEL_FOUR_SAFE_PERCENT = 0.45;

const SAFE_ZONE_SHRINK_RATE = 0.04;
const MIN_SAFE_ARC_PIXELS = 30;

const TUTORIAL_SPEED = 0.4;
const LEVEL_FOUR_SPEED = 1;
const SPEED_GROWTH_RATE = 0.06;

const SAFE_ZONE_BASE_START = 300;

const SAFE_ZONE_ROTATION_START_LEVEL = 10;
const SAFE_ZONE_ROTATION_SPEED = 6;

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

function getSpeedMultiplier(level) {
  if (level <= 3) {
    return TUTORIAL_SPEED;
  }

  if (level === 4) {
    return LEVEL_FOUR_SPEED;
  }

  const levelsAfterFour = level - 4;

  return (
    LEVEL_FOUR_SPEED *
    Math.pow(
      1 + SPEED_GROWTH_RATE,
      levelsAfterFour
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

    rotatesSafeZone:
      safeLevel >=
      SAFE_ZONE_ROTATION_START_LEVEL,

    safeZoneRotationSpeed:
      safeLevel >=
      SAFE_ZONE_ROTATION_START_LEVEL
        ? SAFE_ZONE_ROTATION_SPEED
        : 0,

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