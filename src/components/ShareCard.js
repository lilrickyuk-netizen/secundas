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

const GRID_LINES = [
  1,
  2,
  3,
  4,
  5,
  6,
  7,
];

function getAccentColor(
  type
) {
  if (type === 'fail') {
    return COLORS.fail;
  }

  if (type === 'challenge') {
    return COLORS.electric;
  }

  if (type === 'daily') {
    return COLORS.accent;
  }

  return COLORS.success;
}

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

          const accentColor =
  getAccentColor(
    safeType
  );

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
    style={[
      styles.card,
      {
        borderColor:
          accentColor,

        shadowColor:
          accentColor,
      },
    ]}
  >
    <View
      pointerEvents="none"
      style={styles.glassWash}
    />

    <View
      pointerEvents="none"
      style={[
        styles.ambientGlow,
        {
          backgroundColor:
            accentColor,
        },
      ]}
    />

    <View
      pointerEvents="none"
      style={styles.grid}
    >
      {GRID_LINES.map(
        (line) => (
          <View
            key={`vertical-${line}`}
            style={[
              styles.gridVertical,
              {
                left:
                  `${line * 12.5}%`,
              },
            ]}
          />
        )
      )}

      {GRID_LINES.map(
        (line) => (
          <View
            key={`horizontal-${line}`}
            style={[
              styles.gridHorizontal,
              {
                top:
                  `${line * 12.5}%`,
              },
            ]}
          />
        )
      )}
    </View>

    <View
      pointerEvents="none"
      style={[
        styles.innerBorder,
        {
          borderColor:
            accentColor,
        },
      ]}
    />

    <View style={styles.topSection}>
      <Text
        style={[
          styles.brand,
          {
            color:
              accentColor,
          },
        ]}
      >
        SECUNDAS
      </Text>

      <View
        style={[
          styles.brandRule,
          {
            backgroundColor:
              accentColor,
          },
        ]}
      />
    </View>

    <View style={styles.scoreSection}>
      <View
        pointerEvents="none"
        style={[
          styles.scoreGlow,
          {
            backgroundColor:
              accentColor,
          },
        ]}
      />

      <Text
        style={[
          styles.attempts,
          {
            color:
              accentColor,

            textShadowColor:
              accentColor,
          },
        ]}
      >
        {safeAttempts}
      </Text>

      <Text style={styles.attemptLabel}>
        ATTEMPTS
      </Text>

      <Text style={styles.headline}>
        {copy.headline}
      </Text>

      <Text style={styles.context}>
        {copy.context}
      </Text>
    </View>

    <View style={styles.patternPanel}>
      <Text style={styles.patternLabel}>
        ATTEMPT PATTERN
      </Text>

      <Text style={styles.pattern}>
        {patternText || '—'}
      </Text>
    </View>

    <Text
      style={[
        styles.message,
        {
          color:
            accentColor,
        },
      ]}
    >
      {copy.message}
    </Text>

    <View style={styles.footer}>
      <View
        style={[
          styles.footerRule,
          {
            backgroundColor:
              accentColor,
          },
        ]}
      />

      <Text style={styles.link}>
        {link}
      </Text>

      <Text style={styles.tapToPlay}>
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

      paddingHorizontal:
        SPACING.xl,

      paddingVertical:
        SPACING.lg,

      justifyContent:
        'space-between',

      backgroundColor:
        'rgba(5,5,7,0.98)',

      borderWidth: 1.5,
      borderRadius: 22,

      overflow: 'hidden',

      shadowOpacity: 0.4,
      shadowRadius: 18,

      shadowOffset: {
        width: 0,
        height: 0,
      },

      elevation: 12,
    },

    glassWash: {
      ...StyleSheet.absoluteFillObject,

      backgroundColor:
        'rgba(255,255,255,0.025)',
    },

    ambientGlow: {
      position: 'absolute',

      top: 82,
      left: 40,

      width: 240,
      height: 170,

      borderRadius: 120,

      opacity: 0.055,
    },

    grid: {
      ...StyleSheet.absoluteFillObject,

      opacity: 0.16,
    },

    gridVertical: {
      position: 'absolute',

      top: 0,
      bottom: 0,

      width: 1,

      backgroundColor:
        'rgba(0,209,255,0.18)',
    },

    gridHorizontal: {
      position: 'absolute',

      left: 0,
      right: 0,

      height: 1,

      backgroundColor:
        'rgba(255,45,85,0.12)',
    },

    innerBorder: {
      ...StyleSheet.absoluteFillObject,

      margin: 5,

      borderWidth: 1,
      borderRadius: 18,

      opacity: 0.22,
    },

    topSection: {
      alignItems: 'center',
    },

    brand: {
      ...TYPOGRAPHY.label,

      fontSize: 12,
      fontWeight: '900',

      letterSpacing: 6,

      textAlign: 'center',
    },

    brandRule: {
      width: 56,
      height: 2,

      marginTop:
        SPACING.sm,

      opacity: 0.85,
    },

    scoreSection: {
      position: 'relative',

      width: '100%',

      alignItems: 'center',
      justifyContent: 'center',
    },

    scoreGlow: {
      position: 'absolute',

      width: 220,
      height: 145,

      borderRadius: 110,

      opacity: 0.06,
    },

    attempts: {
      ...TYPOGRAPHY.number,

      fontSize: 88,
      lineHeight: 94,

      fontWeight: '900',

      textAlign: 'center',

      letterSpacing: 3,

      textShadowOffset: {
        width: 0,
        height: 0,
      },

      textShadowRadius: 16,
    },

    attemptLabel: {
      ...TYPOGRAPHY.label,

      color: COLORS.text,

      marginTop: -4,

      textAlign: 'center',

      fontSize: 10,
      letterSpacing: 5,
    },

    headline: {
      ...TYPOGRAPHY.heading,

      color: COLORS.text,

      marginTop:
        SPACING.sm,

      textAlign: 'center',

      fontSize: 18,
      lineHeight: 23,

      letterSpacing: 2.5,
    },

    context: {
      ...TYPOGRAPHY.label,

      color: COLORS.muted,

      marginTop:
        SPACING.xs,

      textAlign: 'center',

      fontSize: 8,
      letterSpacing: 2,
    },

    patternPanel: {
      width: '100%',

      paddingVertical:
        SPACING.sm,

      paddingHorizontal:
        SPACING.sm,

      backgroundColor:
        'rgba(255,255,255,0.035)',

      borderWidth: 1,

      borderColor:
        'rgba(0,209,255,0.16)',

      borderRadius: 12,

      alignItems: 'center',
    },

    patternLabel: {
      ...TYPOGRAPHY.label,

      color: COLORS.muted,

      fontSize: 7,

      letterSpacing: 2.5,
    },

    pattern: {
      marginTop:
        SPACING.xs,

      color: COLORS.text,

      textAlign: 'center',

      fontSize: 16,
      lineHeight: 22,
    },

    message: {
      ...TYPOGRAPHY.label,

      textAlign: 'center',

      fontSize: 10,

      letterSpacing: 2.5,
    },

    footer: {
      width: '100%',

      alignItems: 'center',

      gap: SPACING.xs,
    },

    footerRule: {
      width: '72%',
      height: 1,

      marginBottom:
        SPACING.xs,

      opacity: 0.5,
    },

    link: {
      ...TYPOGRAPHY.label,

      color: COLORS.text,

      fontSize: 8,

      letterSpacing: 2,
    },

    tapToPlay: {
      ...TYPOGRAPHY.label,

      color: COLORS.muted,

      fontSize: 7,

      letterSpacing: 3,
    },
  });