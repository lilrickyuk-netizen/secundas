import {
  useEffect,
  useMemo,
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

const BASE_FAIL_MESSAGES = [
  'NOT EVEN CLOSE',
  'YOU HESITATED',
  'TOO EAGER',
  'THE DOT MOCKS YOU',
  'TRY TAPPING... BETTER?',
];

function buildFailMessages(
  level,
  victimsToday
) {
  const messages = [
    ...BASE_FAIL_MESSAGES,
  ];

  if (
    Number.isFinite(
      victimsToday
    )
  ) {
    messages.push(
      `LEVEL ${level} HAS CLAIMED ${victimsToday} VICTIMS TODAY`
    );
  }

  return messages;
}

export default function DeathModal({
  visible,
  attempts,
  level,
  nearMiss = false,
  victimsToday = null,
  onDismiss,
  onShareSuffering,
  onChallengeFriend,
}) {
  const opacity =
    useRef(
      new Animated.Value(0)
    ).current;

  const translateY =
    useRef(
      new Animated.Value(35)
    ).current;

  const scale =
    useRef(
      new Animated.Value(0.96)
    ).current;

  const flashOpacity =
    useRef(
      new Animated.Value(0)
    ).current;

  const message = 
  useMemo(() =>{
    const messages = 
    buildFailMessages(
        level,
        victimsToday
    );

    const index = 
    Math.floor(
        Math.random() *
        messages.length
    );

    return messages[index];
}, [
    attempts,
    level,
    victimsToday,
    visible,

]);
 
  useEffect(() => {
    if (!visible) {
      return undefined;
    }

    opacity.setValue(0);
    translateY.setValue(35);
    scale.setValue(0.96);
    flashOpacity.setValue(0.42);

    Animated.parallel([
      Animated.timing(
        opacity,
        {
          toValue: 1,
          duration: 120,
          useNativeDriver: true,
        }
      ),

      Animated.spring(
        translateY,
        {
          toValue: 0,
          friction: 7,
          tension: 120,
          useNativeDriver: true,
        }
      ),

      Animated.spring(
        scale,
        {
          toValue: 1,
          friction: 6,
          tension: 130,
          useNativeDriver: true,
        }
      ),

      Animated.timing(
        flashOpacity,
        {
          toValue: 0,
          duration: 420,
          useNativeDriver: true,
        }
      ),
    ]).start();

    const timeout =
      setTimeout(() => {
        onDismiss?.();
      }, 1500);

    return () => {
      clearTimeout(timeout);
    };
  }, [
    visible,
    onDismiss,
    opacity,
    translateY,
    scale,
    flashOpacity,
  ]);
const milestoneText =
  attempts >= 25
    ? 'CHALLENGE A FRIEND TO SUFFER TOO'
    : attempts >= 10
      ? 'SHARE YOUR SUFFERING'
      : null;

const milestoneAction =
  attempts >= 25
    ? (
        onChallengeFriend ??
        onShareSuffering
      )
    : attempts >= 10
      ? onShareSuffering
      : null;

const handleMilestonePress =
  async (event) => {
    event.stopPropagation();

    if (!milestoneAction) {
      return;
    }

    await milestoneAction();

    onDismiss?.();
  };
  
  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
      statusBarTranslucent
      onRequestClose={onDismiss}
    >
      <Pressable
        style={styles.overlay}
        onPress={onDismiss}
      >
        <Animated.View
          pointerEvents="none"
          style={[
            styles.failFlash,
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
                  translateY,
                },
                {
                  scale,
                },
              ],
            },
          ]}
        >
          <View
            style={styles.topLine}
          />

        <Text
  style={styles.failTitle}
>
  FAIL
</Text>

{nearMiss && (
  <Text
    style={
      styles.nearMissTitle
    }
  >
    SO CLOSE!
  </Text>
)}

          <Text
            style={styles.message}
          >
            {message}
          </Text>

          <View
            style={styles.divider}
          />

          <View
            style={
              styles.statRow
            }
          >
            <View
              style={
                styles.statBlock
              }
            >
              <Text
                style={
                  styles.statLabel
                }
              >
                LEVEL
              </Text>

              <Text
                style={
                  styles.statValue
                }
              >
                {String(
                  level
                ).padStart(
                  2,
                  '0'
                )}
              </Text>
            </View>

            <View
              style={
                styles.statDivider
              }
            />

            <View
              style={
                styles.statBlock
              }
            >
              <Text
                style={
                  styles.statLabel
                }
              >
                ATTEMPT
              </Text>

              <Text
                style={
                  styles.attemptValue
                }
              >
                {attempts}
              </Text>
            </View>
          </View>

{milestoneText && (
  <Pressable
    disabled={
      !milestoneAction
    }
    onPress={
      handleMilestonePress
    }
  >
    <Text
      style={
        styles.thresholdText
      }
    >
      {milestoneText}
    </Text>
  </Pressable>
)}

          <Text
            style={styles.dismissText}
          >
            TAP TO RETRY
          </Text>

          <View
            style={styles.bottomLine}
          />
        </Animated.View>
      </Pressable>
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

      paddingHorizontal: 28,

      backgroundColor:
        'rgba(0,0,0,0.38)',
    },

    failFlash: {
      ...StyleSheet.absoluteFillObject,

      backgroundColor:
        'rgba(255,0,68,0.24)',
    },

    modalCard: {
      width: '100%',
      maxWidth: 360,

      paddingHorizontal:
        SPACING.xl,

      paddingVertical:
        SPACING.xl,

      alignItems:
        'center',

      backgroundColor:
        'rgba(8,8,13,0.96)',

      borderWidth: 1,

      borderColor:
        'rgba(255,0,68,0.80)',

      borderRadius:
        RADII.medium,

      shadowColor:
        COLORS.fail,

      shadowOpacity: 0.75,

      shadowRadius: 24,

      shadowOffset: {
        width: 0,
        height: 0,
      },

      elevation: 18,
    },

    topLine: {
      width: 72,
      height: 2,

      marginBottom:
        SPACING.lg,

      backgroundColor:
        COLORS.fail,

      shadowColor:
        COLORS.fail,

      shadowOpacity: 1,

      shadowRadius: 8,

      shadowOffset: {
        width: 0,
        height: 0,
      },
    },

    failTitle: {
      ...TYPOGRAPHY.title,

      color: COLORS.fail,

      fontSize: 48,

      letterSpacing: 10,

      textShadowColor:
        'rgba(255,0,68,0.95)',

      textShadowRadius: 18,

      textShadowOffset: {
        width: 0,
        height: 0,
      },
    },

    nearMissTitle: {
      ...TYPOGRAPHY.heading,
    marginTop:
    SPACING.sm,
      color:
        COLORS.warning,

      fontSize: 32,

      letterSpacing: 6,

      textShadowColor:
        'rgba(255,159,10,0.8)',

      textShadowRadius: 14,

      textShadowOffset: {
        width: 0,
        height: 0,
      },
    },

    message: {
      ...TYPOGRAPHY.label,

      marginTop:
        SPACING.md,

      color:
        COLORS.muted,

      letterSpacing: 3,

      textAlign:
        'center',
    },

    divider: {
      width: '100%',
      height: 1,

      marginVertical:
        SPACING.xl,

      backgroundColor:
        'rgba(255,255,255,0.08)',
    },

    statRow: {
      width: '100%',

      flexDirection:
        'row',

      justifyContent:
        'center',

      alignItems:
        'center',
    },

    statBlock: {
      flex: 1,

      alignItems:
        'center',
    },

    statDivider: {
      width: 1,
      height: 46,

      backgroundColor:
        'rgba(255,255,255,0.10)',
    },

    statLabel: {
      ...TYPOGRAPHY.label,

      color:
        COLORS.muted,

      fontSize: 8,

      letterSpacing: 3,
    },

    statValue: {
      ...TYPOGRAPHY.number,

      marginTop:
        SPACING.xs,

      color:
        COLORS.text,

      fontSize: 28,
    },

    attemptValue: {
      ...TYPOGRAPHY.number,

      marginTop:
        SPACING.xs,

      color:
        COLORS.fail,

      fontSize: 28,

      textShadowColor:
        COLORS.fail,

      textShadowRadius: 10,

      textShadowOffset: {
        width: 0,
        height: 0,
      },
    },

    thresholdText: {
      ...TYPOGRAPHY.label,

      marginTop:
        SPACING.xl,

      color:
        COLORS.electric,

      fontSize: 9,

      lineHeight: 17,

      letterSpacing: 3,

      textAlign:
        'center',
    },

    dismissText: {
      ...TYPOGRAPHY.label,

      marginTop:
        SPACING.xl,

      color:
        COLORS.text,

      fontSize: 9,

      letterSpacing: 4,

      opacity: 0.75,
    },

    bottomLine: {
      width: 42,
      height: 1,

      marginTop:
        SPACING.lg,

      backgroundColor:
        COLORS.fail,

      opacity: 0.55,
    },
  });