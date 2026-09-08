import {
  useCallback,
  useState,
} from 'react';

import {
  useFocusEffect,
} from '@react-navigation/native';

import {
  Pressable,
  ScrollView,
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
  ensureDailyChallenge,
  loadGameData,
} from '../utils/storage';

import {
  createDailyChallenge,
  getDailySeed,
} from '../utils/dailyChallenge';

import {
  playSound,
  SOUND_KEYS,
} from '../utils/sounds';

import {
  LAYOUT,
  RADII,
  SPACING,
  TYPOGRAPHY,
} from '../utils/theme';

function TrophyMark() {
  return (
    <View style={styles.trophyMark}>
      <View style={styles.trophyCup} />
      <View style={styles.trophyStem} />
      <View style={styles.trophyBase} />
    </View>
  );
}

export default function HomeScreen({
  navigation,
}) {
 const [
  gameStats,
  setGameStats,
] = useState({
  totalAttempts: 0,
  completedLevels: 0,
});

const [
  dailyChallenge,
  setDailyChallenge,
] = useState(null);

useFocusEffect(
  useCallback(() => {
    let isActive = true;

    const refreshHomeData =
      async () => {
        const gameData =
          await loadGameData();

        const todaySeed =
          getDailySeed();

        const generatedDaily =
          createDailyChallenge(
            todaySeed
          );

        let savedDaily =
          gameData.dailyHistory.find(
            (entry) =>
              entry.date ===
              todaySeed
          );

        if (!savedDaily) {
          const updatedGameData =
            await ensureDailyChallenge(
              generatedDaily
            );

          savedDaily =
            updatedGameData
              ?.dailyHistory
              ?.find(
                (entry) =>
                  entry.date ===
                  todaySeed
              );
        }

        if (!isActive) {
          return;
        }

        setGameStats({
          totalAttempts:
            gameData.totalAttempts,

          completedLevels:
            gameData.completedLevels,
        });

        setDailyChallenge(
          savedDaily ?? {
            ...generatedDaily,
            completed: false,
            attempts: 0,
            pattern: [],
            synced: false,
          }
        );
      };

    void refreshHomeData();

    return () => {
      isActive = false;
    };
  }, [])
);

const handleDailyChallenge =
  () => {
    if (
      !dailyChallenge ||
      dailyChallenge.completed
    ) {
      return;
    }

    void playSound(
      SOUND_KEYS.DAILY_OPEN
    );

    navigation.navigate(
      'Game',
      {
        mode: 'daily',

        dailyChallenge,
      }
    );
  };

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView
        contentContainerStyle={
          styles.container
        }
        showsVerticalScrollIndicator={
          false
        }
      >
        <View style={styles.brandBlock}>
          <View
            style={styles.eclipseGlow}
          />

          <View
            style={styles.eclipseRing}
          />

          <View
            style={styles.eclipseCore}
          />

          <Text style={styles.title}>
            SECUNDAS
          </Text>

          <Text style={styles.tagline}>
            One tap. One second.
            Endless rage.
          </Text>
        </View>

        <Pressable
          style={styles.startButton}
          onPress={() =>
            navigation.navigate(
              'Game',
              {
                mode: 'new',
              }
            )
          }
        >
          <Text
            style={
              styles.startButtonText
            }
          >
            START
          </Text>
        </Pressable>

        <Pressable
          style={styles.continueButton}
          onPress={() =>
            navigation.navigate(
              'Game',
              {
                mode: 'continue',
              }
            )
          }
        >
          <Text
            style={
              styles.continueButtonText
            }
          >
            CONTINUE LEVEL
          </Text>
        </Pressable>

        <Pressable
  style={styles.dailyCard}
  onPress={
    handleDailyChallenge
  }
  disabled={
    !dailyChallenge ||
    dailyChallenge.completed
  }
>
          <View style={styles.dailyHeader}>
            <View
              style={
                styles.dailyIdentity
              }
            >
              <TrophyMark />

              <View>
                <Text
                  style={
                    styles.dailyTitle
                  }
                >
                  DAILY CHALLENGE
                </Text>

                <Text
                  style={
                    styles.dailyText
                  }
                >
                  TODAY'S TIMING
                  CHALLENGE
                </Text>

<Text
  style={styles.dailyText}
>
  {dailyChallenge
    ? dailyChallenge.completed
      ? `${dailyChallenge.seed} // COMPLETE // ${dailyChallenge.attempts} ATTEMPTS`
      : `${dailyChallenge.seed} // ${dailyChallenge.attempts} ATTEMPTS`
    : 'PREPARING DAILY...'}
</Text>

              </View>
            </View>

            <Text
              style={styles.dailyBadge}
            >
              TODAY
            </Text>
          </View>
        </Pressable>

        <View style={styles.statsRow}>
          <View style={styles.statPanel}>
            <Text style={styles.statIcon}>
              ✦
            </Text>

            <Text
              style={styles.statLabel}
            >
              STREAK
            </Text>

            <Text
              style={styles.statValue}
            >
              0
            </Text>
          </View>

          <View style={styles.statPanel}>
            <Text style={styles.statIcon}>
              ◉
            </Text>

            <Text
              style={styles.statLabel}
            >
              TOTAL ATTEMPTS
            </Text>

            <Text
              style={styles.statValue}
            >
              {gameStats.totalAttempts}
            </Text>
          </View>

          <View style={styles.statPanel}>
            <Text style={styles.statIcon}>
              ◇
            </Text>

            <Text
              style={styles.statLabel}
            >
              LEVELS COMPLETE
            </Text>

            <Text
              style={styles.statValue}
            >
              {gameStats.completedLevels}
            </Text>
          </View>
        </View>

        <Pressable
          style={styles.challengeButton}
          onPress={() =>
            navigation.navigate(
              'Challenge'
            )
          }
        >
          <Text
            style={
              styles.challengeButtonText
            }
          >
            CHALLENGES
          </Text>

          <View
            style={
              styles.challengeBadge
            }
          >
            <Text
              style={
                styles.challengeBadgeText
              }
            >
              0
            </Text>
          </View>
        </Pressable>

        <Pressable
          style={styles.settingsButton}
          onPress={() =>
            navigation.navigate(
              'Settings'
            )
          }
        >
          <Text
            style={
              styles.settingsButtonText
            }
          >
            SETTINGS
          </Text>
        </Pressable>
      </ScrollView>
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
      flexGrow: 1,

      alignItems: 'center',

      paddingHorizontal:
        LAYOUT.screenPadding,

      paddingTop: SPACING.xl,

      paddingBottom:
        SPACING.xxl,
    },

    brandBlock: {
      width: '100%',
      height: 170,

      justifyContent: 'center',
      alignItems: 'center',

      position: 'relative',
    },

    eclipseGlow: {
      position: 'absolute',

      width: 280,
      height: 118,

      borderRadius:
        RADII.pill,

      backgroundColor:
        'rgba(255,45,85,0.035)',

      shadowColor:
        COLORS.accent,

      shadowOpacity: 0.5,
      shadowRadius: 28,

      shadowOffset: {
        width: 0,
        height: 0,
      },

      elevation: 8,
    },

    eclipseRing: {
      position: 'absolute',

      width: 245,
      height: 94,

      borderRadius:
        RADII.pill,

      borderWidth: 1,

      borderColor:
        'rgba(255,45,85,0.62)',

      backgroundColor:
        'rgba(255,45,85,0.025)',

      shadowColor:
        COLORS.accent,

      shadowOpacity: 0.75,
      shadowRadius: 18,

      shadowOffset: {
        width: 0,
        height: 0,
      },
    },

    eclipseCore: {
      position: 'absolute',

      width: 190,
      height: 68,

      borderRadius:
        RADII.pill,

      backgroundColor:
        COLORS.background,

      borderWidth: 1,

      borderColor:
        'rgba(255,255,255,0.035)',
    },

    title: {
      ...TYPOGRAPHY.title,

      color: COLORS.text,

      zIndex: 2,

      textShadowColor:
        'rgba(255,255,255,0.18)',

      textShadowRadius: 10,

      textShadowOffset: {
        width: 0,
        height: 0,
      },
    },

    tagline: {
      ...TYPOGRAPHY.body,

      marginTop: SPACING.md,

      color: COLORS.muted,

      textAlign: 'center',

      letterSpacing: 2,

      zIndex: 2,
    },

    startButton: {
      width: '100%',
      maxWidth: 330,

      minHeight: 54,

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

    startButtonText: {
      ...TYPOGRAPHY.subheading,

      color: COLORS.text,

      letterSpacing: 5,
    },

    continueButton: {
      width: '100%',
      maxWidth: 330,

      minHeight: 54,

      marginTop: SPACING.md,

      justifyContent: 'center',
      alignItems: 'center',

      backgroundColor:
        'rgba(0,209,255,0.035)',

      borderRadius:
        RADII.pill,

      borderWidth: 1,

      borderColor:
        COLORS.electric,
    },

    continueButtonText: {
      ...TYPOGRAPHY.body,

      color:
        COLORS.electric,

      letterSpacing: 3,
    },

    dailyCard: {
      width: '100%',

      marginTop:
        SPACING.xxl,

      padding: SPACING.lg,

      backgroundColor:
        'rgba(255,255,255,0.035)',

      borderRadius:
        RADII.panel,

      borderWidth: 1,

      borderColor:
        'rgba(255,45,85,0.55)',
    },

    dailyHeader: {
      flexDirection: 'row',

      justifyContent:
        'space-between',

      alignItems: 'center',
    },

    dailyIdentity: {
      flexDirection: 'row',

      alignItems: 'center',

      gap: SPACING.md,
    },

    trophyMark: {
      width: 30,
      height: 34,

      alignItems: 'center',

      justifyContent:
        'flex-start',
    },

    trophyCup: {
      width: 22,
      height: 14,

      borderWidth: 2,

      borderColor:
        COLORS.warning,

      borderBottomLeftRadius: 9,

      borderBottomRightRadius: 9,
    },

    trophyStem: {
      width: 2,
      height: 8,

      backgroundColor:
        COLORS.warning,
    },

    trophyBase: {
      width: 16,
      height: 2,

      backgroundColor:
        COLORS.warning,
    },

    dailyTitle: {
      ...TYPOGRAPHY.subheading,

      color: COLORS.text,

      fontSize: 15,

      letterSpacing: 2,
    },

    dailyText: {
      ...TYPOGRAPHY.label,

      marginTop: SPACING.xs,

      color: COLORS.muted,

      fontSize: 8,

      letterSpacing: 2,
    },

    dailyBadge: {
      ...TYPOGRAPHY.label,

      color: COLORS.accent,

      fontSize: 9,

      letterSpacing: 2,
    },

    statsRow: {
      width: '100%',

      flexDirection: 'row',

      marginTop: SPACING.lg,

      gap: SPACING.sm,
    },

    statPanel: {
      flex: 1,

      minHeight: 106,

      justifyContent: 'center',

      alignItems: 'center',

      padding: SPACING.sm,

      backgroundColor:
        COLORS.glass,

      borderRadius:
        RADII.medium,

      borderWidth: 1,

      borderColor:
        'rgba(255,255,255,0.055)',
    },

    statIcon: {
      color: COLORS.electric,

      fontSize: 18,

      lineHeight: 22,
    },

    statLabel: {
      ...TYPOGRAPHY.label,

      marginTop: SPACING.xs,

      color: COLORS.muted,

      fontSize: 8,

      textAlign: 'center',

      letterSpacing: 1.5,
    },

    statValue: {
      ...TYPOGRAPHY.number,

      marginTop: SPACING.xs,

      color: COLORS.text,

      fontSize: 28,
    },

    challengeButton: {
      width: '100%',

      minHeight:
        LAYOUT.minimumTouchTarget,

      marginTop: SPACING.lg,

      paddingHorizontal:
        SPACING.lg,

      flexDirection: 'row',

      justifyContent:
        'space-between',

      alignItems: 'center',

      backgroundColor:
        COLORS.glass,

      borderRadius:
        RADII.medium,

      borderWidth: 1,

      borderColor:
        'rgba(255,45,85,0.55)',
    },

    challengeButtonText: {
      ...TYPOGRAPHY.label,

      color: COLORS.text,

      letterSpacing: 3,
    },

    challengeBadge: {
      minWidth: 28,
      height: 28,

      paddingHorizontal:
        SPACING.xs,

      justifyContent: 'center',
      alignItems: 'center',

      backgroundColor:
        COLORS.accent,

      borderRadius:
        RADII.pill,
    },

    challengeBadgeText: {
      ...TYPOGRAPHY.label,

      color: COLORS.text,
    },

    settingsButton: {
      width: '100%',

      minHeight:
        LAYOUT.minimumTouchTarget,

      marginTop: SPACING.md,

      paddingHorizontal:
        SPACING.lg,

      justifyContent: 'center',

      alignItems: 'center',

      backgroundColor:
        COLORS.glass,

      borderRadius:
        RADII.medium,

      borderWidth: 1,

      borderColor:
        'rgba(122,127,140,0.45)',
    },

    settingsButtonText: {
      ...TYPOGRAPHY.label,

      color: COLORS.text,

      letterSpacing: 3,
    },
  });