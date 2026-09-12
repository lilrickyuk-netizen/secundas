import * as Linking
  from 'expo-linking';

const APP_SCHEME =
  'secundas';

const UNIVERSAL_HOST =
  'secundas.app';

const CHALLENGE_PATH =
  'c';

const QUERY_CHALLENGE_HOST =
  'challenge';

function parsePositiveInteger(
  value
) {
  if (
    typeof value !==
      'string' ||
    !/^\d+$/.test(value)
  ) {
    return null;
  }

  const parsed =
    Number(value);

  if (
    !Number.isSafeInteger(
      parsed
    ) ||
    parsed < 1
  ) {
    return null;
  }

  return parsed;
}

function parseSeed(
  value
) {
  if (
    typeof value !==
    'string'
  ) {
    return null;
  }

  let decodedSeed;

  try {
    decodedSeed =
      decodeURIComponent(
        value
      );
  } catch {
    return null;
  }

  const seed =
    decodedSeed.trim();

  if (
    seed.length === 0 ||
    seed.length > 128 ||
    /[\s/?#]/.test(seed)
  ) {
    return null;
  }

  return seed;
}

function parseChallengeKind(
  value
) {
  if (
    value === null ||
    value === undefined ||
    value === ''
  ) {
    return 'completed';
  }

  if (
    value === 'completed' ||
    value === 'suffering'
  ) {
    return value;
  }

  return null;
}

function createChallengeData({
  level,
  score,
  seed,
  kind = 'completed',
}) {
  const parsedLevel =
    parsePositiveInteger(
      level
    );

  const parsedScore =
    parsePositiveInteger(
      score
    );

  const parsedSeed =
    parseSeed(seed);

  const parsedKind =
    parseChallengeKind(
      kind
    );

  if (
    parsedLevel === null ||
    parsedScore === null ||
    parsedSeed === null ||
    parsedKind === null
  ) {
    return null;
  }

  return {
    level: parsedLevel,
    score: parsedScore,
    seed: parsedSeed,
    kind: parsedKind,
  };
}

function parsePathChallenge(
  parsedUrl
) {
  const pathSegments =
    typeof parsedUrl.path ===
      'string'
      ? parsedUrl.path
          .split('/')
          .filter(Boolean)
      : [];

  const segments =
    parsedUrl.scheme ===
      APP_SCHEME &&
    parsedUrl.hostname ===
      CHALLENGE_PATH
      ? [
          CHALLENGE_PATH,
          ...pathSegments,
        ]
      : pathSegments;

  if (
    segments.length !== 4 ||
    segments[0] !==
      CHALLENGE_PATH
  ) {
    return null;
  }

  const kind =
    typeof parsedUrl.queryParams
      ?.kind === 'string'
      ? parsedUrl.queryParams.kind
      : null;

  return createChallengeData({
    level: segments[1],
    score: segments[2],
    seed: segments[3],
    kind,
  });
}

function parseQueryChallenge(
  parsedUrl
) {
  const queryParams =
    parsedUrl.queryParams;

  if (!queryParams) {
    return null;
  }

  return createChallengeData({
    level:
      typeof queryParams.level ===
      'string'
        ? queryParams.level
        : null,

    score:
      typeof queryParams.score ===
      'string'
        ? queryParams.score
        : null,

    seed:
      typeof queryParams.seed ===
      'string'
        ? queryParams.seed
        : null,

    kind:
      typeof queryParams.kind ===
      'string'
        ? queryParams.kind
        : null,
  });
}

export function parseChallengeLink(
  url
) {
  if (
    typeof url !== 'string' ||
    url.trim().length === 0
  ) {
    return null;
  }

  let parsedUrl;

  try {
    parsedUrl =
      Linking.parse(url);
  } catch {
    return null;
  }

  const scheme =
    parsedUrl.scheme
      ?.toLowerCase();

  const hostname =
    parsedUrl.hostname
      ?.toLowerCase();

  const normalizedUrl = {
    ...parsedUrl,
    scheme,
    hostname,
  };

  if (
    scheme === APP_SCHEME &&
    hostname ===
      QUERY_CHALLENGE_HOST
  ) {
    return parseQueryChallenge(
      normalizedUrl
    );
  }

  if (
    scheme === APP_SCHEME
  ) {
    return parsePathChallenge(
      normalizedUrl
    );
  }

  if (
    scheme === 'https' &&
    hostname === UNIVERSAL_HOST
  ) {
    return parsePathChallenge(
      normalizedUrl
    );
  }

  return null;
}

export function createChallengeLink({
  level,
  score,
  seed,
  kind = 'completed',
}) {
  const challengeData =
    createChallengeData({
      level: String(level),
      score: String(score),
      seed,
      kind,
    });

  if (!challengeData) {
    return null;
  }

  const kindSuffix =
    challengeData.kind ===
    'suffering'
      ? '?kind=suffering'
      : '';

  return (
    `https://${UNIVERSAL_HOST}/` +
    `${CHALLENGE_PATH}/` +
    `${challengeData.level}/` +
    `${challengeData.score}/` +
    `${encodeURIComponent(
      challengeData.seed
    )}${kindSuffix}`
  );
}