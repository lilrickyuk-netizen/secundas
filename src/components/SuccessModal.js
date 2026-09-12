import {
  useEffect,
  useRef,
} from 'react';

import {
  Animated,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {
  COLORS,
} from '../utils/constants';

import {
  RADII,
  SPACING,
  TYPOGRAPHY,
} from '../utils/theme';

const AUTO_ADVANCE_MS = 3000;

const MAX_PATTERN_ITEMS = 20;

function getAchievement(
  attempts
) {
  if (attempts === 1) {
    return 'FLAWLESS';
  }

  if (attempts >= 100) {
    return 'PERSISTENCE';
  }

  return null;
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
      .map((item) => {
        if (item === 'success') {
          return '🟩';
        }

        if (item === 'fail') {
          return '🟥';
        }

        return '';
      })
      .join('');

  if (
    safePattern.length >
    MAX_PATTERN_ITEMS
  ) {
    return `${emojis}...`;
  }

  return emojis;
}

export default function SuccessModal({
  visible,
  level,
  attempts,
  worldAverage = null,
  pattern = [],
  onShareVictory,
  onChallengeFriend,
  onNextLevel,
  titleOverride = null,
  comparisonOverride = null,
  nextLabel = 'NEXT LEVEL',

}) {
  const opacity =
    useRef(
      new Animated.Value(0)
    ).current;

  const scale =
    useRef(
      new Animated.Value(0.94)
    ).current;

  const flashOpacity =
    useRef(
      new Animated.Value(0)
    ).current;

  const scanlineOpacity =
    useRef(
      new Animated.Value(0)
    ).current;

  const scanlineTranslateY =
    useRef(
      new Animated.Value(-100)
    ).current;

  const hasAdvanced =
    useRef(false);

  const nextLevelRef =
    useRef(onNextLevel);

  useEffect(() => {
    nextLevelRef.current =
      onNextLevel;
  }, [onNextLevel]);

  const handleNextLevel = () => {
    if (hasAdvanced.current) {
      return;
    }

    hasAdvanced.current = true;

    nextLevelRef.current?.();
  };

  useEffect(() => {
    if (!visible) {
      hasAdvanced.current = false;

      return undefined;
    }

    hasAdvanced.current = false;

    opacity.setValue(0);
    scale.setValue(0.94);
    flashOpacity.setValue(0.4);

    scanlineOpacity.setValue(0);
    scanlineTranslateY.setValue(
      -100
    );

    Animated.parallel([
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
          friction: 7,
          tension: 120,
          useNativeDriver: true,
        }
      ),

      Animated.timing(
        flashOpacity,
        {
          toValue: 0,
          duration: 450,
          useNativeDriver: true,
        }
      ),

      Animated.sequence([
        Animated.timing(
          scanlineOpacity,
          {
            toValue: 0.85,
            duration: 70,
            useNativeDriver: true,
          }
        ),

        Animated.timing(
          scanlineTranslateY,
          {
            toValue: 320,
            duration: 320,
            useNativeDriver: true,
          }
        ),

        Animated.timing(
          scanlineOpacity,
          {
            toValue: 0,
            duration: 90,
            useNativeDriver: true,
          }
        ),
      ]),
    ]).start();

    const autoAdvanceTimer =
      setTimeout(() => {
        handleNextLevel();
      }, AUTO_ADVANCE_MS);

    return () => {
      clearTimeout(
        autoAdvanceTimer
      );
    };
  }, [
    visible,
    opacity,
    scale,
    flashOpacity,
    scanlineOpacity,
    scanlineTranslateY,
  ]);

  const achievement =
    getAchievement(
      attempts
    );

  const patternText =
    getPatternText(
      pattern
    );

  const attemptWord =
    attempts === 1
      ? 'ATTEMPT'
      : 'ATTEMPTS';

  const comparisonText =
  comparisonOverride ??
  (
    Number.isFinite(
      worldAverage
    )
      ? `YOU: ${attempts} ${attemptWord}  |  WORLD AVG: ${worldAverage}`
      : `YOU: ${attempts} ${attemptWord}  |  WORLD AVG UNAVAILABLE`
  );

  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
      statusBarTranslucent
      onRequestClose={
        handleNextLevel
      }
    >
      <View
        style={styles.overlay}
      >
        <Animated.View
          pointerEvents="none"
          style={[
            styles.successFlash,
            {
              opacity:
                flashOpacity,
            },
          ]}
        />

        <Animated.View
          style={[
            styles.modalCard,
            {
              opacity,

              transform: [
                {
                  scale,
                },
              ],
            },
          ]}
        >
          <Animated.View
            pointerEvents="none"
            style={[
              styles.scanline,
              {
                opacity:
                  scanlineOpacity,

                transform: [
                  {
                    translateY:
                      scanlineTranslateY,
                  },
                ],
              },
            ]}
          />

          <View
            style={styles.topLine}
          />

          <Text
            style={
              styles.trophyMark
            }
          >
            ✦
          </Text>

          <Text
            style={styles.title}
          >{titleOverride ??
            `LEVEL ${level} COMPLETE`} 
          </Text>

          {achievement && (
            <Text
              style={
                styles.achievement
              }
            >
              {achievement}
            </Text>
          )}

          <Text
            style={
              styles.comparison
            }
          >
            {comparisonText}
          </Text>

          <View
            style={styles.divider}
          />

          <Text
            style={
              styles.patternLabel
            }
          >
            ATTEMPT PATTERN
          </Text>

          <Text
            style={styles.pattern}
          >
            {patternText || '—'}
          </Text>

          <View
            style={
              styles.secondaryActions
            }
          >
            <Pressable
              disabled={
                !onShareVictory
              }
              onPress={
                onShareVictory
              }
              style={[
                styles.secondaryButton,

                !onShareVictory &&
                  styles.disabledButton,
              ]}
            >
              <Text
                style={
                  styles.secondaryText
                }
              >
                SHARE VICTORY
              </Text>
            </Pressable>

            <Pressable
              disabled={
                !onChallengeFriend
              }
              onPress={
                onChallengeFriend
              }
              style={[
                styles.secondaryButton,

                !onChallengeFriend &&
                  styles.disabledButton,
              ]}
            >
              <Text
                style={
                  styles.secondaryText
                }
              >
                CHALLENGE FRIEND
              </Text>
            </Pressable>
          </View>

          <Pressable
            style={
              styles.nextButton
            }
            onPress={
              handleNextLevel
            }
          >
            <Text
              style={
                styles.nextButtonText
              }
            >
              {nextLabel}
            </Text>
          </Pressable>

          <Text
            style={
              styles.autoAdvanceText
            }
          >
            AUTO ADVANCE // 03 SEC
          </Text>

          <View
            style={
              styles.bottomLine
            }
          />
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles =
  StyleSheet.create({
    overlay: {
      flex: 1,

      justifyContent:
        'center',

      alignItems:
        'center',

      paddingHorizontal: 24,

      backgroundColor:
        'rgba(0,0,0,0.48)',
    },

    successFlash: {
      ...StyleSheet.absoluteFillObject,

      backgroundColor:
        'rgba(0,255,136,0.18)',
    },

    modalCard: {
      width: '100%',
      maxWidth: 370,

      paddingHorizontal:
        SPACING.xl,

      paddingVertical:
        SPACING.xl,

      borderRadius:
        RADII.panel,

      borderWidth: 1,

      borderColor:
        'rgba(0,255,136,0.62)',

      backgroundColor:
        'rgba(5,5,7,0.96)',

      overflow: 'hidden',

      shadowColor:
        COLORS.success,

      shadowOpacity: 0.45,

      shadowRadius: 22,

      shadowOffset: {
        width: 0,
        height: 0,
      },

      elevation: 14,
    },

    scanline: {
      position: 'absolute',

      top: 0,
      left: 0,
      right: 0,

      height: 2,

      backgroundColor:
        COLORS.electric,

      shadowColor:
        COLORS.electric,

      shadowOpacity: 0.9,

      shadowRadius: 8,

      shadowOffset: {
        width: 0,
        height: 0,
      },
    },

    topLine: {
      width: '36%',
      height: 2,

      alignSelf: 'center',

      marginBottom:
        SPACING.lg,

      backgroundColor:
        COLORS.success,
    },

    trophyMark: {
      color:
        COLORS.electric,

      fontSize: 24,

      textAlign: 'center',

      marginBottom:
        SPACING.sm,

      textShadowColor:
        COLORS.electric,

      textShadowRadius: 12,
    },

    title: {
      ...TYPOGRAPHY.heading,

      color:
        COLORS.success,

      textAlign: 'center',

      fontSize: 22,

      letterSpacing: 3,

      textShadowColor:
        COLORS.success,

      textShadowRadius: 14,
    },

    achievement: {
      ...TYPOGRAPHY.label,

      alignSelf: 'center',

      marginTop:
        SPACING.md,

      paddingHorizontal:
        SPACING.lg,

      paddingVertical:
        SPACING.sm,

      borderWidth: 1,

      borderColor:
        COLORS.electric,

      borderRadius:
        RADII.pill,

      color:
        COLORS.electric,

      backgroundColor:
        'rgba(0,209,255,0.08)',

      letterSpacing: 3,
    },

    comparison: {
      ...TYPOGRAPHY.label,

      marginTop:
        SPACING.lg,

      color:
        COLORS.text,

      textAlign: 'center',

      fontSize: 10,

      lineHeight: 18,

      letterSpacing: 1.4,
    },

    divider: {
      height: 1,

      marginVertical:
        SPACING.lg,

      backgroundColor:
        COLORS.glass,
    },

    patternLabel: {
      ...TYPOGRAPHY.label,

      color:
        COLORS.muted,

      textAlign: 'center',

      fontSize: 10,

      letterSpacing: 2.5,
    },

    pattern: {
      marginTop:
        SPACING.md,

      minHeight: 30,

      color:
        COLORS.text,

      textAlign: 'center',

      fontSize: 20,

      lineHeight: 30,

      letterSpacing: 2,
    },

    secondaryActions: {
      flexDirection: 'row',

      gap: SPACING.sm,

      marginTop:
        SPACING.xl,
    },

    secondaryButton: {
      flex: 1,

      minHeight: 48,

      alignItems: 'center',

      justifyContent:
        'center',

      paddingHorizontal:
        SPACING.sm,

      borderWidth: 1,

      borderColor:
        COLORS.electric,

      borderRadius:
        RADII.medium,

      backgroundColor:
        'rgba(0,209,255,0.07)',
    },

    disabledButton: {
      opacity: 0.42,
    },

    secondaryText: {
      ...TYPOGRAPHY.label,

      color:
        COLORS.electric,

      textAlign: 'center',

      fontSize: 9,

      letterSpacing: 1.5,
    },

    nextButton: {
      minHeight: 52,

      marginTop:
        SPACING.md,

      alignItems: 'center',

      justifyContent:
        'center',

      borderWidth: 1,

      borderColor:
        COLORS.success,

      borderRadius:
        RADII.medium,

      backgroundColor:
        'rgba(0,255,136,0.12)',

      shadowColor:
        COLORS.success,

      shadowOpacity: 0.32,

      shadowRadius: 12,

      shadowOffset: {
        width: 0,
        height: 0,
      },
    },

    nextButtonText: {
      ...TYPOGRAPHY.label,

      color:
        COLORS.success,

      fontSize: 12,

      letterSpacing: 3,
    },

    autoAdvanceText: {
      ...TYPOGRAPHY.label,

      marginTop:
        SPACING.md,

      color:
        COLORS.muted,

      textAlign: 'center',

      fontSize: 8,

      letterSpacing: 2,
    },

    bottomLine: {
      width: '24%',
      height: 1,

      alignSelf: 'center',

      marginTop:
        SPACING.lg,

      backgroundColor:
        COLORS.electric,
    },
  });