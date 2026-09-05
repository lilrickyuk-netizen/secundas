import { useEffect, useMemo, useRef } from 'react';
import {
  Animated,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { COLORS } from '../utils/constants';
import {
  SPACING,
  TYPOGRAPHY,
} from '../utils/theme';

const ATTEMPT_COLORS = {
  white: COLORS.text,
  gold: '#FFD166',
  orange: COLORS.warning,
  red: COLORS.accent,
  hotRed: COLORS.fail,
};

function getAttemptColor(
  attempts
) {
  if (attempts >= 200) {
    return ATTEMPT_COLORS.hotRed;
  }

  if (attempts >= 100) {
    return ATTEMPT_COLORS.red;
  }

  if (attempts >= 50) {
    return ATTEMPT_COLORS.orange;
  }

  if (attempts >= 10) {
    return ATTEMPT_COLORS.gold;
  }

  return ATTEMPT_COLORS.white;
}

function getGlowStrength(
  attempts
) {
  if (attempts >= 200) {
    return 28;
  }

  if (attempts >= 100) {
    return 24;
  }

  if (attempts >= 50) {
    return 20;
  }

  if (attempts >= 10) {
    return 12;
  }

  return 6;
}

export default function AttemptCounter({
  attempts,
  worldAverage = null,
}) {
  const translateY = useRef(
    new Animated.Value(0)
  ).current;

  const opacity = useRef(
    new Animated.Value(1)
  ).current;

  const scale = useRef(
    new Animated.Value(1)
  ).current;

  const hotPulse = useRef(
    new Animated.Value(1)
  ).current;

  const attemptColor = useMemo(
    () => getAttemptColor(attempts),
    [attempts]
  );

  const glowStrength = useMemo(
    () => getGlowStrength(attempts),
    [attempts]
  );

  useEffect(() => {
  translateY.setValue(-10);
  opacity.setValue(0.45);
  scale.setValue(1.08);

  Animated.parallel([
    Animated.spring(
      translateY,
      {
        toValue: 0,
        friction: 5,
        tension: 120,
        useNativeDriver: true,
      }
    ),

    Animated.timing(
      opacity,
      {
        toValue: 1,
        duration: 160,
        useNativeDriver: true,
      }
    ),

    Animated.spring(
      scale,
      {
        toValue: 1,
        friction: 4,
        tension: 140,
        useNativeDriver: true,
      }
    ),
  ]).start();
}, [
  attempts,
  opacity,
  scale,
  translateY,
]);

useEffect(() => {
  hotPulse.stopAnimation();
  hotPulse.setValue(1);

  if (attempts < 200) {
    return undefined;
  }

  const pulseAnimation =
    Animated.loop(
      Animated.sequence([
        Animated.timing(
          hotPulse,
          {
            toValue: 1.12,
            duration: 420,
            useNativeDriver: true,
          }
        ),

        Animated.timing(
          hotPulse,
          {
            toValue: 1,
            duration: 420,
            useNativeDriver: true,
          }
        ),
      ])
    );

  pulseAnimation.start();

  return () => {
    pulseAnimation.stop();
  };
}, [
  attempts,
  hotPulse,
]);

  const worldAverageText =
  typeof worldAverage ===
  'number'
    ? `WORLD AVG: ${worldAverage.toFixed(
        1
      )}`
    : 'WORLD AVG UNAVAILABLE';

  return (
    <View style={styles.container}>
      <View style={styles.numberShell}>
        <Animated.Text
          style={[
            styles.attemptNumber,
            {
              color: attemptColor,

              textShadowColor:
                attemptColor,

              textShadowRadius:
                glowStrength,

              transform: [
                {
                  translateY,
                },
                {
                  scale,
                },
                {
                  scale:hotPulse,
                },
              ],

              opacity,
            },
          ]}
        >
          {attempts}
        </Animated.Text>
      </View>

      <Text style={styles.attemptLabel}>
        ATTEMPTS
      </Text>

      <View style={styles.worldAverageRow}>
        <View style={styles.averageLine} />

        <Text style={styles.worldAverageText}>
           {worldAverageText}
        </Text>

        <View style={styles.averageLine} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
  },

  numberShell: {
    minHeight: 82,
    justifyContent: 'center',
    alignItems: 'center',
  },

  attemptNumber: {
    ...TYPOGRAPHY.number,

    fontSize: 72,
    lineHeight: 76,

    fontWeight: '900',
    letterSpacing: 4,

    textAlign: 'center',

    textShadowOffset: {
      width: 0,
      height: 0,
    },
  },

  attemptLabel: {
    ...TYPOGRAPHY.label,

    marginTop: -SPACING.xs,

    color: COLORS.text,

    fontSize: 13,
    letterSpacing: 8,

    textAlign: 'center',
  },

  worldAverageRow: {
    marginTop: SPACING.sm,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',

    gap: SPACING.sm,
  },

  averageLine: {
    width: 24,
    height: 1,

    backgroundColor: COLORS.muted,

    opacity: 0.25,
  },

  worldAverageText: {
    ...TYPOGRAPHY.label,

    color: COLORS.muted,

    fontSize: 7,
    letterSpacing: 2,
  },
});