import {
  forwardRef,
} from 'react';

import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {
  COLORS,
} from '../utils/constants';

import {
  SPACING,
  TYPOGRAPHY,
} from '../utils/theme';

const MAX_PATTERN_ITEMS = 20;

const VALID_TYPES =
  new Set([
    'fail',
    'success',
    'challenge',
    'daily',
  ]);

function getPatternText(
  pattern
) {
  const safePattern =
    Array.isArray(pattern)
      ? pattern
      : [];

  const visiblePattern =
    safePattern.slice(
      -MAX_PATTERN_ITEMS
    );

  const emojis =
    visiblePattern
      .map(
        (result) =>
          result === 'success'
            ? '🟩'
            : '🟥'
      )
      .join('');

  if (
    safePattern.length >
    MAX_PATTERN_ITEMS
  ) {
    return `${emojis}...`;
  }

  return emojis;
}

function getCardCopy({
  type,
  level,
  date,
}) {
  if (type === 'fail') {
    return {
      headline:
        `LEVEL ${level} BROKE ME`,

      context:
        `ATTEMPTS ON LEVEL ${level}`,

      message:
        'CAN YOU DO BETTER?',
    };
  }

  if (
    type === 'challenge'
  ) {
    return {
      headline:
        `CHALLENGE // LEVEL ${level}`,

      context:
        'TARGET ATTEMPTS',

      message:
        'CAN YOU BEAT THIS?',
    };
  }

  if (type === 'daily') {
    return {
      headline:
        'DAILY CHALLENGE',

      context:
        date ??
        `LEVEL ${level}`,

      message:
        'TODAY’S TIMING TEST',
    };
  }

  return {
    headline:
      `LEVEL ${level} SURVIVED`,

    context:
      `TO BEAT LEVEL ${level}`,

    message:
      'I DID IT. YOUR TURN.',
  };
}

const ShareCard =
  forwardRef(
    function ShareCard(
      {
        level,
        attempts,
        pattern = [],
        type = 'success',
        link =
          'secundas.app',
        date = null,
      },
      ref
    ) {
      const safeLevel =
        Number.isFinite(level)
          ? Math.max(
              1,
              Math.floor(level)
            )
          : 1;

      const safeAttempts =
        Number.isFinite(
          attempts
        )
          ? Math.max(
              0,
              Math.floor(
                attempts
              )
            )
          : 0;

      const safeType =
        VALID_TYPES.has(type)
          ? type
          : 'success';

      const copy =
        getCardCopy({
          type: safeType,
          level: safeLevel,
          date,
        });

      const patternText =
        getPatternText(
          pattern
        );

      return (
        <View
          ref={ref}
          collapsable={false}
          style={styles.card}
        >
          <Text
            style={
              styles.brand
            }
          >
            SECUNDAS
          </Text>

          <Text
            style={
              styles.headline
            }
          >
            {copy.headline}
          </Text>

          <Text
            style={
              styles.attempts
            }
          >
            {safeAttempts}
          </Text>

          <Text
            style={
              styles.attemptLabel
            }
          >
            ATTEMPTS
          </Text>

          <Text
            style={
              styles.context
            }
          >
            {copy.context}
          </Text>

          <Text
            style={
              styles.pattern
            }
          >
            {patternText ||
              '—'}
          </Text>

          <Text
            style={
              styles.message
            }
          >
            {copy.message}
          </Text>

          <View
            style={
              styles.footer
            }
          >
            <Text
              style={
                styles.link
              }
            >
              {link}
            </Text>

            <Text
              style={
                styles.tapToPlay
              }
            >
              TAP TO PLAY
            </Text>
          </View>
        </View>
      );
    }
  );

export default ShareCard;

const styles =
  StyleSheet.create({
    card: {
      width: 320,
      height: 400,

      padding:
        SPACING.xl,

      justifyContent:
        'space-between',

      backgroundColor:
        COLORS.background,

      borderWidth: 1,

      borderColor:
        COLORS.electric,
    },

    brand: {
      ...TYPOGRAPHY.label,

      color:
        COLORS.text,

      textAlign:
        'center',

      letterSpacing: 5,
    },

    headline: {
      ...TYPOGRAPHY.heading,

      color:
        COLORS.text,

      textAlign:
        'center',

      fontSize: 20,

      letterSpacing: 2,
    },

    attempts: {
      ...TYPOGRAPHY.number,

      color:
        COLORS.accent,

      textAlign:
        'center',

      fontSize: 76,
    },

    attemptLabel: {
      ...TYPOGRAPHY.label,

      color:
        COLORS.text,

      textAlign:
        'center',

      letterSpacing: 5,
    },

    context: {
      ...TYPOGRAPHY.label,

      color:
        COLORS.muted,

      textAlign:
        'center',

      letterSpacing: 2,
    },

    pattern: {
      color:
        COLORS.text,

      textAlign:
        'center',

      fontSize: 18,

      lineHeight: 26,
    },

    message: {
      ...TYPOGRAPHY.label,

      color:
        COLORS.electric,

      textAlign:
        'center',

      letterSpacing: 2,
    },

    footer: {
      alignItems:
        'center',

      gap:
        SPACING.xs,
    },

    link: {
      ...TYPOGRAPHY.label,

      color:
        COLORS.text,

      fontSize: 8,

      letterSpacing: 2,
    },

    tapToPlay: {
      ...TYPOGRAPHY.label,

      color:
        COLORS.muted,

      fontSize: 7,

      letterSpacing: 3,
    },
  });