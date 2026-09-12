import {
  useEffect,
  useRef,
} from 'react';

import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {
  SafeAreaView,
} from 'react-native-safe-area-context';

import {
  COLORS,
} from '../utils/constants';

import {
  LAYOUT,
  RADII,
  SPACING,
  TYPOGRAPHY,
} from '../utils/theme';

import {
  playSound,
  SOUND_KEYS,
} from '../utils/sounds';

export default function ChallengeScreen({
  navigation,
  route,
}) {
  const challenge =
    route?.params?.challenge ??
    null;

  const challengeKey =
  challenge
    ? `${challenge.level}:${challenge.score}:${challenge.seed}:${challenge.kind ?? 'completed'}`
    : null;

  const lastPingedChallengeRef =
    useRef(null);

  useEffect(() => {
    if (
      !challengeKey ||
      lastPingedChallengeRef
        .current === challengeKey
    ) {
      return;
    }

    lastPingedChallengeRef.current =
      challengeKey;

    void playSound(
      SOUND_KEYS.CHALLENGE_PING
    );
  }, [challengeKey]);

  const handleAcceptChallenge =
    () => {
      if (!challenge) {
        return;
      }

      navigation.navigate(
        'Game',
        {
          mode: 'challenge',
          challenge,
        }
      );
    };

  return (
    <SafeAreaView
      style={styles.screen}
    >
      <View
        style={styles.container}
      >
        <View
          style={styles.topBar}
        >
          <Text
            style={styles.brandLabel}
          >
            SECUNDAS // CHALLENGE
          </Text>

          <Pressable
            style={styles.backButton}
            onPress={() =>
              navigation.goBack()
            }
          >
            <Text
              style={
                styles.backButtonText
              }
            >
              BACK
            </Text>
          </Pressable>
        </View>

        {challenge ? (
          <View
            style={styles.challengePanel}
          >
            <Text
              style={
                styles.incomingLabel
              }
            >
              INCOMING CHALLENGE
            </Text>

            <View
              style={styles.accentLine}
            />

            <Text
              style={styles.levelLabel}
            >
              {`LEVEL ${String(
                challenge.level
              ).padStart(2, '0')}`}
            </Text>

            <Text
  style={styles.message}
>
  {challenge.kind ===
  'suffering'
    ? `Someone has already spent ${challenge.score} ${
        challenge.score === 1
          ? 'attempt'
          : 'attempts'
      } on Level ${challenge.level} and still hasn't beaten it.`
    : `Someone beat Level ${challenge.level} in ${challenge.score} ${
        challenge.score === 1
          ? 'try'
          : 'tries'
      }.`}
</Text>

<Text
  style={styles.question}
>
  {challenge.kind ===
  'suffering'
    ? `Can you beat Level ${challenge.level} in fewer attempts?`
    : 'Can you beat them?'}
</Text>

            <View
              style={
                styles.targetPanel
              }
            >
              <Text
                style={
                  styles.targetLabel
                }
              >
                TARGET
              </Text>

              <Text
                style={
                  styles.targetScore
                }
              >
                {`BEAT ${challenge.score} ATTEMPTS`}
              </Text>
            </View>

            <Text
              style={styles.seedText}
            >
              {`SEED // ${challenge.seed}`}
            </Text>

            <Pressable
              style={
                styles.acceptButton
              }
              onPress={
                handleAcceptChallenge
              }
            >
              <Text
                style={
                  styles.acceptButtonText
                }
              >
                ACCEPT CHALLENGE
              </Text>
            </Pressable>
          </View>
        ) : (
          <View
            style={styles.emptyPanel}
          >
            <Text
              style={styles.emptyTitle}
            >
              NO ACTIVE CHALLENGE
            </Text>

            <Text
              style={styles.emptyText}
            >
              Open a Secundas challenge
              link to receive a
              challenge.
            </Text>
          </View>
        )}
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
    },

    container: {
      flex: 1,

      paddingHorizontal:
        LAYOUT.screenPadding,

      paddingTop: SPACING.xl,

      paddingBottom:
        SPACING.xxl,
    },

    topBar: {
      width: '100%',

      flexDirection: 'row',

      justifyContent:
        'space-between',

      alignItems: 'center',
    },

    brandLabel: {
      ...TYPOGRAPHY.label,

      color: COLORS.muted,

      fontSize: 9,

      letterSpacing: 3,
    },

    backButton: {
      minHeight:
        LAYOUT.minimumTouchTarget,

      justifyContent: 'center',

      paddingHorizontal:
        SPACING.md,

      backgroundColor:
        COLORS.glass,

      borderWidth: 1,

      borderColor:
        'rgba(122,127,140,0.45)',

      borderRadius:
        RADII.pill,
    },

    backButtonText: {
      ...TYPOGRAPHY.label,

      color: COLORS.text,

      fontSize: 9,

      letterSpacing: 2,
    },

    challengePanel: {
      width: '100%',

      marginTop:
        SPACING.huge,

      padding:
        SPACING.xl,

      alignItems: 'center',

      backgroundColor:
        'rgba(255,255,255,0.035)',

      borderWidth: 1,

      borderColor:
        'rgba(255,45,85,0.65)',

      borderRadius:
        RADII.panel,

      shadowColor:
        COLORS.accent,

      shadowOpacity: 0.35,

      shadowRadius: 24,

      shadowOffset: {
        width: 0,
        height: 0,
      },

      elevation: 8,
    },

    incomingLabel: {
      ...TYPOGRAPHY.label,

      color: COLORS.accent,

      fontSize: 10,

      letterSpacing: 4,
    },

    accentLine: {
      width: 86,

      height: 2,

      marginTop:
        SPACING.md,

      marginBottom:
        SPACING.xl,

      backgroundColor:
        COLORS.accent,

      shadowColor:
        COLORS.accent,

      shadowOpacity: 0.9,

      shadowRadius: 8,

      shadowOffset: {
        width: 0,
        height: 0,
      },
    },

    levelLabel: {
      ...TYPOGRAPHY.heading,

      color: COLORS.text,

      fontSize: 30,

      letterSpacing: 6,
    },

    message: {
      ...TYPOGRAPHY.body,

      marginTop:
        SPACING.xl,

      color: COLORS.text,

      lineHeight: 24,

      textAlign: 'center',

      letterSpacing: 1,
    },

    question: {
      ...TYPOGRAPHY.subheading,

      marginTop:
        SPACING.md,

      color: COLORS.text,

      textAlign: 'center',

      letterSpacing: 2,
    },

    targetPanel: {
      width: '100%',

      marginTop:
        SPACING.xl,

      padding:
        SPACING.lg,

      alignItems: 'center',

      backgroundColor:
        'rgba(0,209,255,0.055)',

      borderWidth: 1,

      borderColor:
        'rgba(0,209,255,0.6)',

      borderRadius:
        RADII.medium,
    },

    targetLabel: {
      ...TYPOGRAPHY.label,

      color: COLORS.muted,

      fontSize: 8,

      letterSpacing: 3,
    },

    targetScore: {
      ...TYPOGRAPHY.subheading,

      marginTop:
        SPACING.sm,

      color: COLORS.electric,

      fontSize: 18,

      letterSpacing: 3,

      textAlign: 'center',

      textShadowColor:
        'rgba(0,209,255,0.55)',

      textShadowRadius: 10,

      textShadowOffset: {
        width: 0,
        height: 0,
      },
    },

    seedText: {
      ...TYPOGRAPHY.label,

      marginTop:
        SPACING.lg,

      color: COLORS.muted,

      fontSize: 8,

      letterSpacing: 2,
    },

    acceptButton: {
      width: '100%',

      minHeight: 56,

      marginTop:
        SPACING.xl,

      justifyContent: 'center',

      alignItems: 'center',

      backgroundColor:
        COLORS.accent,

      borderRadius:
        RADII.pill,

      borderWidth: 1,

      borderColor:
        COLORS.accent,

      shadowColor:
        COLORS.accent,

      shadowOpacity: 0.55,

      shadowRadius: 16,

      shadowOffset: {
        width: 0,
        height: 0,
      },

      elevation: 8,
    },

    acceptButtonText: {
      ...TYPOGRAPHY.label,

      color: COLORS.text,

      letterSpacing: 3,
    },

    emptyPanel: {
      width: '100%',

      marginTop:
        SPACING.huge,

      padding:
        SPACING.xl,

      alignItems: 'center',

      backgroundColor:
        COLORS.glass,

      borderWidth: 1,

      borderColor:
        'rgba(255,45,85,0.35)',

      borderRadius:
        RADII.panel,
    },

    emptyTitle: {
      ...TYPOGRAPHY.heading,

      color: COLORS.text,

      textAlign: 'center',

      letterSpacing: 4,
    },

    emptyText: {
      ...TYPOGRAPHY.body,

      marginTop:
        SPACING.lg,

      color: COLORS.muted,

      lineHeight: 24,

      textAlign: 'center',
    },
  });