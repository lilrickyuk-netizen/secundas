import {
  useEffect,
  useState,
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
  loadGameData,
  updateGameSettings,
} from '../utils/storage';

import {
  setSoundSettings,
} from '../utils/sounds';

import {
  LAYOUT,
  RADII,
  SPACING,
  TYPOGRAPHY,
} from '../utils/theme';

export default function SettingsScreen({
  navigation,
}) {
  const [
    isReady,
    setIsReady,
  ] = useState(false);

  const [
    isMuted,
    setIsMuted,
  ] = useState(false);

  const [
    soundIntensity,
    setSoundIntensity,
  ] = useState('normal');

  useEffect(() => {
    let isActive = true;

    const loadSettings =
      async () => {
        const gameData =
          await loadGameData();

        if (!isActive) {
          return;
        }

        setIsMuted(
          gameData.settings
            ?.muted === true
        );

        setSoundIntensity(
          gameData.settings
            ?.soundIntensity ===
            'reduced'
            ? 'reduced'
            : 'normal'
        );

        setIsReady(true);
      };

    void loadSettings();

    return () => {
      isActive = false;
    };
  }, []);

  const handleSoundToggle =
    () => {
      if (!isReady) {
        return;
      }

      const nextMuted =
        !isMuted;

      setIsMuted(
        nextMuted
      );

      setSoundSettings({
        muted: nextMuted,
      });

      void updateGameSettings({
        muted: nextMuted,
      });
    };

  const handleIntensityChange =
    (nextIntensity) => {
      if (
        !isReady ||
        nextIntensity ===
          soundIntensity
      ) {
        return;
      }

      setSoundIntensity(
        nextIntensity
      );

      setSoundSettings({
        soundIntensity:
          nextIntensity,
      });

      void updateGameSettings({
        soundIntensity:
          nextIntensity,
      });
    };

  return (
    <SafeAreaView
      style={styles.screen}
    >
      <View style={styles.container}>
        <Text style={styles.eyebrow}>
          SYSTEM CONTROL
        </Text>

        <Text style={styles.title}>
          AUDIO
        </Text>

        <View style={styles.panel}>
          <View style={styles.row}>
            <View
              style={styles.labelBlock}
            >
              <Text
                style={styles.label}
              >
                SOUND
              </Text>

              <Text
                style={
                  styles.description
                }
              >
                GLOBAL GAME AUDIO
              </Text>
            </View>

            <Pressable
              disabled={!isReady}
              style={[
                styles.toggleButton,
                !isMuted &&
                  styles.activeButton,
              ]}
              onPress={
                handleSoundToggle
              }
            >
              <Text
                style={[
                  styles.toggleText,
                  !isMuted &&
                    styles.activeText,
                ]}
              >
                {isMuted
                  ? 'OFF'
                  : 'ON'}
              </Text>
            </Pressable>
          </View>

          <View
            style={styles.divider}
          />

          <View>
            <Text style={styles.label}>
              INTENSITY
            </Text>

            <Text
              style={
                styles.description
              }
            >
              REDUCED MODE LOWERS
              IMPACT AND REMOVES
              ORBIT PULSE
            </Text>

            <View
              style={
                styles.intensityRow
              }
            >
              <Pressable
                disabled={!isReady}
                style={[
                  styles.intensityButton,
                  soundIntensity ===
                    'normal' &&
                    styles.activeButton,
                ]}
                onPress={() =>
                  handleIntensityChange(
                    'normal'
                  )
                }
              >
                <Text
                  style={[
                    styles.toggleText,
                    soundIntensity ===
                      'normal' &&
                      styles.activeText,
                  ]}
                >
                  NORMAL
                </Text>
              </Pressable>

              <Pressable
                disabled={!isReady}
                style={[
                  styles.intensityButton,
                  soundIntensity ===
                    'reduced' &&
                    styles.activeButton,
                ]}
                onPress={() =>
                  handleIntensityChange(
                    'reduced'
                  )
                }
              >
                <Text
                  style={[
                    styles.toggleText,
                    soundIntensity ===
                      'reduced' &&
                      styles.activeText,
                  ]}
                >
                  REDUCED
                </Text>
              </Pressable>
            </View>
          </View>
        </View>

        <Text style={styles.note}>
          ADDITIONAL SETTINGS
          ARRIVE IN THE FULL
          SETTINGS PHASE
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
        SPACING.xl,
    },

    eyebrow: {
      ...TYPOGRAPHY.label,

      color: COLORS.electric,

      fontSize: 9,

      letterSpacing: 4,
    },

    title: {
      ...TYPOGRAPHY.heading,

      marginTop: SPACING.sm,

      color: COLORS.text,

      fontSize: 34,

      letterSpacing: 7,
    },

    panel: {
      marginTop: SPACING.xl,

      padding: SPACING.lg,

      borderWidth: 1,

      borderColor:
        'rgba(0,209,255,0.28)',

      borderRadius:
        RADII.medium,

      backgroundColor:
        'rgba(255,255,255,0.035)',
    },

    row: {
      flexDirection: 'row',

      justifyContent:
        'space-between',

      alignItems: 'center',

      gap: SPACING.md,
    },

    labelBlock: {
      flex: 1,
    },

    label: {
      ...TYPOGRAPHY.label,

      color: COLORS.text,

      fontSize: 11,

      letterSpacing: 3,
    },

    description: {
      ...TYPOGRAPHY.label,

      marginTop: SPACING.xs,

      color: COLORS.muted,

      fontSize: 7,

      lineHeight: 13,

      letterSpacing: 2,
    },

    toggleButton: {
      minWidth: 88,

      minHeight: 44,

      alignItems: 'center',

      justifyContent:
        'center',

      borderWidth: 1,

      borderColor:
        'rgba(160,190,210,0.45)',

      borderRadius:
        RADII.small,

      backgroundColor:
        'rgba(255,255,255,0.035)',
    },

    intensityRow: {
      flexDirection: 'row',

      gap: SPACING.sm,

      marginTop: SPACING.md,
    },

    intensityButton: {
      flex: 1,

      minHeight: 46,

      alignItems: 'center',

      justifyContent:
        'center',

      borderWidth: 1,

      borderColor:
        'rgba(160,190,210,0.45)',

      borderRadius:
        RADII.small,

      backgroundColor:
        'rgba(255,255,255,0.035)',
    },

    activeButton: {
      borderColor:
        COLORS.electric,

      backgroundColor:
        'rgba(0,209,255,0.09)',
    },

    toggleText: {
      ...TYPOGRAPHY.label,

      color: COLORS.muted,

      fontSize: 9,

      letterSpacing: 3,
    },

    activeText: {
      color: COLORS.electric,
    },

    divider: {
      height: 1,

      marginVertical:
        SPACING.lg,

      backgroundColor:
        'rgba(255,255,255,0.08)',
    },

    note: {
      ...TYPOGRAPHY.label,

      marginTop: SPACING.lg,

      color: COLORS.muted,

      fontSize: 7,

      lineHeight: 14,

      letterSpacing: 2,

      textAlign: 'center',
    },

    backButton: {
      marginTop: 'auto',

      minHeight: 52,

      alignItems: 'center',

      justifyContent:
        'center',

      borderWidth: 1,

      borderColor:
        'rgba(255,45,85,0.5)',

      borderRadius:
        RADII.small,

      backgroundColor:
        'rgba(255,45,85,0.055)',
    },

    backButtonText: {
      ...TYPOGRAPHY.label,

      color: COLORS.text,

      letterSpacing: 4,
    },
  });