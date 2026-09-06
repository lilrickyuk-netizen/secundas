import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import {
  Animated,
  Easing,
  PanResponder,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {
  SafeAreaView,
} from 'react-native-safe-area-context';

import AttemptCounter from '../components/AttemptCounter';
import DeathModal from '../components/DeathModal';
import SuccessModal from '../components/SuccessModal';
import Indicator from '../components/Indicator';
import SafeZone from '../components/SafeZone';

import {
  getLevelConfig,
  getOrbitDurationForCycle,
} from '../game/levelEngine';

import {
  COLORS,
} from '../utils/constants';

import {
  LAYOUT,
  RADII,
  SPACING,
  TYPOGRAPHY,
} from '../utils/theme';

const ARENA_SIZE = 320;
const ARENA_RADIUS = 125;
const DOT_SIZE = 20;
const NEAR_MISS_PIXELS = 12;

const START_LEVEL = 1;
const START_ATTEMPTS = 0;

function normalizeAngle(angle) {
  return (
    ((angle % 360) + 360) %
    360
  );
}

function isAngleInsideZone(
  angle,
  zoneStart,
  zoneSize
) {
  const normalizedAngle =
    normalizeAngle(angle);

  const normalizedStart =
    normalizeAngle(zoneStart);

  const normalizedEnd =
    normalizeAngle(
      zoneStart + zoneSize
    );

  if (zoneSize >= 360) {
    return true;
  }

  if (
    normalizedStart <=
    normalizedEnd
  ) {
    return (
      normalizedAngle >=
        normalizedStart &&
      normalizedAngle <=
        normalizedEnd
    );
  }

  return (
    normalizedAngle >=
      normalizedStart ||
    normalizedAngle <=
      normalizedEnd
  );
}

function getAngularDistance(
  angleA,
  angleB
) {
  const difference =
    Math.abs(
      normalizeAngle(angleA) -
        normalizeAngle(angleB)
    );

  return Math.min(
    difference,
    360 - difference
  );
}

function isNearSafeZoneEdge(
  angle,
  zoneStart,
  zoneSize,
  radius
) {
  const circumference =
    2 * Math.PI * radius;

  const nearMissDegrees =
    (
      NEAR_MISS_PIXELS /
      circumference
    ) * 360;

  const zoneEnd =
    normalizeAngle(
      zoneStart + zoneSize
    );

  const distanceToStart =
    getAngularDistance(
      angle,
      zoneStart
    );

  const distanceToEnd =
    getAngularDistance(
      angle,
      zoneEnd
    );

  return (
    distanceToStart <=
      nearMissDegrees ||
    distanceToEnd <=
      nearMissDegrees
  );
}

export default function GameScreen({
  navigation,
}) {
  const [level, setLevel] =
    useState(START_LEVEL);

  const [attempts, setAttempts] =
    useState(START_ATTEMPTS);

  const [result, setResult] =
    useState(null);

    const [
      nearMiss,
      setNearMiss,
 ] = useState(false);

 const [
  attemptPattern,
  setAttemptPattern,
 ] = useState([]);

  const levelConfig =
    useMemo(
      () =>
        getLevelConfig(
          level,
          ARENA_RADIUS
        ),
      [level]
    );

  const [
    safeZoneStart,
    setSafeZoneStart,
  ] = useState(
    levelConfig.safeZoneStart
  );

  const [
    dotPosition,
    setDotPosition,
  ] = useState({
    x:
      ARENA_SIZE / 2 -
      DOT_SIZE / 2,

    y:
      ARENA_SIZE / 2 -
      ARENA_RADIUS -
      DOT_SIZE / 2,
  });

  const orbitProgress =
    useRef(
      new Animated.Value(0)
    ).current;

  const currentAngle =
    useRef(0);

  const orbitAnimation =
    useRef(null);

  const orbitRunId =
    useRef(0);

  const isRunning =
    useRef(false);

  const safeZoneStartRef =
    useRef(
      levelConfig.safeZoneStart
    );

  useEffect(() => {
    const listenerId =
      orbitProgress.addListener(
        ({ value }) => {
          const angle =
            value * 360;

          currentAngle.current =
            normalizeAngle(angle);

          const radians =
            (angle - 90) *
            (Math.PI / 180);

          const center =
            ARENA_SIZE / 2;

          const x =
            center +
            ARENA_RADIUS *
              Math.cos(radians) -
            DOT_SIZE / 2;

          const y =
            center +
            ARENA_RADIUS *
              Math.sin(radians) -
            DOT_SIZE / 2;

          setDotPosition({
            x,
            y,
          });

          if (
            levelConfig.rotatesSafeZone
          ) {
            const nextStart =
            normalizeAngle(
              levelConfig.safeZoneStart -
              angle
            );

            const previousStart =
              safeZoneStartRef.current;

            const difference =
              Math.abs(
                (
                  (
                    nextStart -
                    previousStart +
                    540
                  ) %
                  360
                ) -
                  180
              );

            if (difference >= 0.5) {
              safeZoneStartRef.current =
                nextStart;

              setSafeZoneStart(
                nextStart
              );
            }
          }
        }
      );

    return () => {
      orbitProgress.removeListener(
        listenerId
      );
    };
  }, [
    orbitProgress,
    levelConfig,
  ]);

  const runOrbitCycle = (
    cycleIndex,
    runId
  ) => {
    if (
      runId !==
      orbitRunId.current
    ) {
      return;
    }

    orbitProgress.setValue(0);

    const duration =
      getOrbitDurationForCycle(
        levelConfig,
        cycleIndex
      );

    orbitAnimation.current =
      Animated.timing(
        orbitProgress,
        {
          toValue: 1,
          duration,
          easing: Easing.linear,
          useNativeDriver: false,
        }
      );

    orbitAnimation.current.start(
      ({ finished }) => {
        if (
          finished &&
          isRunning.current &&
          runId ===
            orbitRunId.current
        ) {
          runOrbitCycle(
            cycleIndex + 1,
            runId
          );
        }
      }
    );
  };

  const startOrbit = () => {
    orbitRunId.current += 1;

    const runId =
      orbitRunId.current;

    isRunning.current = false;

    orbitAnimation.current?.stop();

    orbitProgress.setValue(0);

    safeZoneStartRef.current =
      levelConfig.safeZoneStart;

    setSafeZoneStart(
      levelConfig.safeZoneStart
    );


    setResult(null);
    setNearMiss(false);

    isRunning.current = true;

    runOrbitCycle(
      0,
      runId
    );
  };

  const stopOrbit = () => {
    if (!isRunning.current) {
      return;
    }

    isRunning.current = false;
    orbitRunId.current += 1;

    orbitAnimation.current?.stop();

    const stoppedAngle =
      currentAngle.current;

    const success =
      isAngleInsideZone(
        stoppedAngle,
        safeZoneStartRef.current,
        levelConfig.safeZoneSize
      );

setAttemptPattern(
  (currentPattern) => [
    ...currentPattern,
    success
    ? 'success'
    : 'fail',
  ]
);

setAttempts(
  (currentAttempts) =>
    currentAttempts + 1
);

    if (success) {
  setNearMiss(false);
  setResult('success');
  return;
}

const wasNearMiss =
  isNearSafeZoneEdge(
    stoppedAngle,
    safeZoneStartRef.current,
    levelConfig.safeZoneSize,
    ARENA_RADIUS
  );

setNearMiss(
  wasNearMiss
);

setResult('fail')
  };

  useEffect(() => {
    startOrbit();

    return () => {
      isRunning.current = false;

      orbitRunId.current += 1;

      orbitAnimation.current?.stop();
    };
  }, [level]);

  const panResponder =
    useMemo(
      () =>
        PanResponder.create({
          onStartShouldSetPanResponder:
            () => true,

          onPanResponderRelease:
            () => {
              stopOrbit();
            },
        }),
      [levelConfig]
    );

  const handleRetry = () => {
    if (result !== 'fail') {
      return;
    }

    startOrbit();
  };

  const handleContinue = () => {
    if (result !== 'success') {
      return;
    }

    setAttempts(
      START_ATTEMPTS
    );

    setAttemptPattern([]);

    setLevel(
      (currentLevel) =>
        currentLevel + 1
    );
  };

  return (
    <SafeAreaView
      style={styles.screen}
    >
      <View
        style={styles.gameplayTouchArea}
        {...panResponder.panHandlers}
      >
        <View style={styles.topHud}>
          <View style={styles.levelBlock}>
            <Text style={styles.levelText}>
              LEVEL{' '}
              {String(level).padStart(
                2,
                '0'
              )}
            </Text>

            <View style={styles.levelLine}>
              <View
                style={
                  styles.levelLineActive
                }
              />
            </View>
          </View>

          <Text style={styles.momentText}>
            A SMALL{'\n'}
            MOMENT{'\n'}
            A BIGGER YOU
          </Text>
        </View>

        <View style={styles.attemptBlock}>
          <AttemptCounter
            attempts={attempts}
            worldAverage={null}
          />
        </View>

        <View style={styles.gameArea}>
          <View style={styles.arenaShell}>
            <View
              style={
                styles.arenaBackground
              }
            >
              <Text
              pointerEvents="none"
              style={
                styles.levelWatermark
              }
>
  {String(level).padStart(
    2,
    '0'
  )}
</Text>
              <SafeZone
                size={ARENA_SIZE}
                radius={ARENA_RADIUS}
                safeStart={
                  safeZoneStart
                }
                safeSize={
                  levelConfig.safeZoneSize
                }
                dangerPulse={
                  result === 'fail'
                }
              />

              <Animated.View
                pointerEvents="none"
                style={[
                  styles.indicatorPosition,
                  {
                    left:
                      dotPosition.x,

                    top:
                      dotPosition.y,
                  },
                ]}
              >
                <Indicator
                  size={DOT_SIZE}
                  angle={
                    currentAngle.current
                  }
                />
              </Animated.View>

              <Text
                style={styles.safeLabel}
              >
                SAFE ZONE
              </Text>

              <Text
                style={
                  styles.dangerLabel
                }
              >
                DANGER ZONE
              </Text>
            </View>
          </View>
        </View>

        <View
          style={styles.instructionArea}
        >
          {result === null && (
            <>
              <Text
                style={styles.tapText}
              >
                TAP TO STOP
              </Text>

<Text
  style={
    styles.targetText
  }
>
  {levelConfig.realGameBegins
    ? 'NOW THE REAL GAME BEGINS'
    : levelConfig.tutorial
      ? 'STOP INSIDE THE GREEN SAFE ZONE'
      : 'HIT THE SAFE ZONE'}
</Text>

            </>
          )}

        </View>
      </View>

<SuccessModal
  visible={
    result === 'success'
  }
  level={level}
  attempts={attempts}
  worldAverage={null}
  pattern={attemptPattern}
  onNextLevel={
    handleContinue
  }
/>

<DeathModal
visible={result === 'fail'}
attempts={attempts}
level={level}
nearMiss={nearMiss}
onDismiss={handleRetry}
/> 

      <View
        style={styles.bottomControls}
      >
        <Pressable
          style={styles.controlButton}
        >
          <Text
            style={styles.controlIcon}
          >
            ◁
          </Text>

          <Text
            style={styles.controlText}
          >
            MUTE
          </Text>
        </Pressable>

        <Pressable
          style={styles.controlButton}
          onPress={() =>
            navigation.goBack()
          }
        >
          <Text
            style={styles.controlIcon}
          >
            □
          </Text>

          <Text
            style={styles.controlText}
          >
            EXIT
          </Text>
        </Pressable>
      </View>

      <View style={styles.footer}>
        <View
          style={styles.footerLine}
        />

        <Text
          style={styles.footerText}
        >
          TIMING IS EVERYTHING
        </Text>

        <View
          style={styles.footerLine}
        />
      </View>
    </SafeAreaView>
  );
}

const styles =
  StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor:
        COLORS.background,
      paddingHorizontal:
        LAYOUT.screenPadding,
      paddingTop: SPACING.md,
      paddingBottom: SPACING.sm,
    },

    gameplayTouchArea: {
      flex: 1,
    },

    topHud: {
      width: '100%',
      flexDirection: 'row',
      justifyContent:
        'space-between',
      alignItems: 'flex-start',
    },

    levelBlock: {
      minWidth: 122,
    },

    levelText: {
      ...TYPOGRAPHY.subheading,
      color: COLORS.text,
      fontSize: 17,
      letterSpacing: 4,
    },

    levelLine: {
      width: 120,
      height: 3,
      marginTop: SPACING.sm,
      backgroundColor:
        COLORS.panel,
    },

    levelLineActive: {
      width: '52%',
      height: '100%',
      backgroundColor:
        COLORS.accent,

      shadowColor:
        COLORS.accent,

      shadowOpacity: 0.9,
      shadowRadius: 6,

      shadowOffset: {
        width: 0,
        height: 0,
      },
    },

    momentText: {
      ...TYPOGRAPHY.label,
      color: COLORS.muted,
      fontSize: 7,
      lineHeight: 14,
      textAlign: 'right',
      letterSpacing: 3,
    },

    attemptBlock: {
      alignItems: 'center',
      marginTop: SPACING.md,
    },

    attemptNumber: {
      ...TYPOGRAPHY.number,
      color: COLORS.accent,
      fontSize: 72,
      lineHeight: 76,
      letterSpacing: 4,

      textShadowColor:
        'rgba(255, 45, 85, 0.75)',

      textShadowRadius: 18,

      textShadowOffset: {
        width: 0,
        height: 0,
      },
    },

    attemptText: {
      ...TYPOGRAPHY.label,
      color: COLORS.text,
      fontSize: 13,
      letterSpacing: 8,
    },

    gameArea: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      minHeight:
        ARENA_SIZE + 20,
    },

    arenaShell: {
      width: ARENA_SIZE + 12,
      height: ARENA_SIZE + 12,

      justifyContent: 'center',
      alignItems: 'center',

      borderRadius:
        (ARENA_SIZE + 12) / 2,

      borderWidth: 1,

      borderColor:
        'rgba(0, 209, 255, 0.22)',

      shadowColor:
        COLORS.electric,

      shadowOpacity: 0.25,
      shadowRadius: 18,

      shadowOffset: {
        width: 0,
        height: 0,
      },

      elevation: 6,
    },

    arenaBackground: {
      width: ARENA_SIZE,
      height: ARENA_SIZE,
      position: 'relative',

      borderRadius:
        ARENA_SIZE / 2,

      overflow: 'visible',

      backgroundColor:
        'rgba(3, 8, 12, 0.72)',
    },

    levelWatermark: { 
      ...TYPOGRAPHY.number,

      position: 'absolute',

      left: 0,
      right: 0,
      top: 78,

      zIndex: 0,

      color:
      'rgba(245,247,250,0.045)',

      fontSize: 138,
      lineHeight: 142,
      letterSpacing: 8,
      textAlign: 'center',

    },

    indicatorPosition: {
      position: 'absolute',

      width: DOT_SIZE,
      height: DOT_SIZE,

      zIndex: 10,
    },

    safeLabel: {
      ...TYPOGRAPHY.label,

      position: 'absolute',

      right: -5,
      top: 62,

      color: COLORS.safe,

      fontSize: 8,
      letterSpacing: 2,
    },

    dangerLabel: {
      ...TYPOGRAPHY.label,

      position: 'absolute',

      right: -12,
      bottom: 55,

      color: COLORS.fail,

      fontSize: 8,
      letterSpacing: 2,
    },

    instructionArea: {
      minHeight: 76,

      justifyContent: 'center',
      alignItems: 'center',
    },

    tapText: {
      ...TYPOGRAPHY.subheading,

      color: COLORS.text,

      fontSize: 17,
      letterSpacing: 5,
    },

    targetText: {
      ...TYPOGRAPHY.label,

      marginTop: SPACING.xs,

      color: COLORS.muted,

      fontSize: 9,
      letterSpacing: 4,
    },

    failText: {
      ...TYPOGRAPHY.heading,

      color: COLORS.fail,
      letterSpacing: 5,

      textShadowColor:
        'rgba(255, 0, 68, 0.7)',

      textShadowRadius: 12,

      textShadowOffset: {
        width: 0,
        height: 0,
      },
    },

    successText: {
      ...TYPOGRAPHY.heading,

      color: COLORS.success,

      letterSpacing: 5,

      textShadowColor:
        'rgba(0, 255, 136, 0.65)',

      textShadowRadius: 12,

      textShadowOffset: {
        width: 0,
        height: 0,
      },
    },

    actionText: {
      ...TYPOGRAPHY.label,

      marginTop: SPACING.sm,

      color: COLORS.electric,

      letterSpacing: 3,
    },

    bottomControls: {
      width: '100%',

      flexDirection: 'row',

      gap: SPACING.md,

      justifyContent: 'center',

      marginTop: SPACING.sm,
    },

    controlButton: {
      flex: 1,
      maxWidth: 160,
      minHeight: 54,

      flexDirection: 'row',

      justifyContent: 'center',
      alignItems: 'center',

      gap: SPACING.sm,

      backgroundColor:
        'rgba(255,255,255,0.035)',

      borderWidth: 1,

      borderColor:
        'rgba(160,190,210,0.45)',

      borderRadius:
        RADII.small,
    },

    controlIcon: {
      color: COLORS.muted,
      fontSize: 18,
    },

    controlText: {
      ...TYPOGRAPHY.label,

      color: COLORS.text,

      letterSpacing: 3,
    },

    footer: {
      minHeight: 34,

      flexDirection: 'row',

      justifyContent: 'center',
      alignItems: 'center',

      gap: SPACING.md,
    },

    footerLine: {
      width: 38,
      height: 1,

      backgroundColor:
        COLORS.accent,

      opacity: 0.4,
    },

    footerText: {
      ...TYPOGRAPHY.label,

      color: COLORS.muted,

      fontSize: 7,

      letterSpacing: 4,
    },
  });