import {
  useCallback,
  useEffect,
  useState,
} from 'react';

import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {
  useFocusEffect,
} from '@react-navigation/native';

import {
  SafeAreaView,
} from 'react-native-safe-area-context';

import {
  COLORS,
  PRODUCT_IDS,
} from '../utils/constants';

import {
  loadGameData,
  resetLocalProgress,
  updateGameSettings,
} from '../utils/storage';

import {
  getRevenueCatProduct,
  getRevenueCatState,
  purchaseRevenueCatProduct,
  subscribeRevenueCatState,
} from '../services/revenuecat';

import {
  setSoundSettings,
} from '../utils/sounds';

import {
  LAYOUT,
  RADII,
  SPACING,
  TYPOGRAPHY,
} from '../utils/theme';

const APP_CONFIG =
  require('../../app.json');

const APP_VERSION =
  APP_CONFIG?.expo?.version ??
  '1.0.0';

const DOT_SKINS = [
  'CLASSIC',
  'GOLD',
  'FIRE',
  'GHOST',
  'NEON',
  'ICE',
  'SHADOW',
  'PULSE',
  'RETRO',
  'VOID',
];

function SectionTitle({
  children,
}) {
  return (
    <Text
      style={
        styles.sectionTitle
      }
    >
      {children}
    </Text>
  );
}

function SettingRow({
  title,
  description,
  children,
}) {
  return (
    <View
      style={styles.settingRow}
    >
      <View
        style={
          styles.settingIdentity
        }
      >
        <Text
          style={styles.label}
        >
          {title}
        </Text>

        {description ? (
          <Text
            style={
              styles.description
            }
          >
            {description}
          </Text>
        ) : null}
      </View>

      {children}
    </View>
  );
}

function ToggleButton({
  active,
  activeLabel = 'ON',
  inactiveLabel = 'OFF',
  onPress,
  disabled = false,
}) {
  return (
    <Pressable
      disabled={disabled}
      style={[
        styles.toggleButton,

        active &&
          styles.activeButton,

        disabled &&
          styles.disabledControl,
      ]}
      onPress={onPress}
    >
      <Text
        style={[
          styles.toggleText,

          active &&
            styles.activeText,
        ]}
      >
        {active
          ? activeLabel
          : inactiveLabel}
      </Text>
    </Pressable>
  );
}

function StatusRow({
  title,
  description,
  status,
  statusColor =
    COLORS.muted,
}) {
  return (
    <View
      style={styles.statusRow}
    >
      <View
        style={
          styles.settingIdentity
        }
      >
        <Text
          style={styles.label}
        >
          {title}
        </Text>

        {description ? (
          <Text
            style={
              styles.description
            }
          >
            {description}
          </Text>
        ) : null}
      </View>

      <Text
        style={[
          styles.statusText,
          {
            color: statusColor,
          },
        ]}
      >
        {status}
      </Text>
    </View>
  );
}

function LockedStoreButton({
  title,
  subtitle,
}) {
  return (
    <Pressable
      disabled
      style={[
        styles.storeButton,
        styles.disabledControl,
      ]}
    >
      <Text
        style={
          styles.storeButtonTitle
        }
      >
        {title}
      </Text>

      <Text
        style={
          styles.storeButtonSubtitle
        }
      >
        {subtitle}
      </Text>
    </Pressable>
  );
}

function PurchaseStoreButton({
  title,
  subtitle,
  disabled = false,
  loading = false,
  onPress,
}) {
  const isDisabled =
    disabled || loading;

  return (
    <Pressable
      disabled={isDisabled}
      style={[
        styles.storeButton,

        isDisabled &&
          styles.disabledControl,
      ]}
      onPress={onPress}
    >
      <Text
        style={
          styles.storeButtonTitle
        }
      >
        {loading
          ? 'PROCESSING...'
          : title}
      </Text>

      <Text
        style={
          styles.storeButtonSubtitle
        }
      >
        {subtitle}
      </Text>
    </Pressable>
  );
}

function getRevenueCatSystemLabel(
  status
) {
  switch (status) {
    case 'ready':
      return 'CONNECTED';

    case 'degraded':
      return 'DEGRADED';

    case 'initializing':
      return 'CONNECTING';

    case 'unavailable':
      return 'UNAVAILABLE';

    case 'idle':
      return 'WAITING';

    default:
      return 'NOT CONFIGURED';
  }
}

function getRevenueCatStoreLabel(
  state
) {
  const systemLabel =
    getRevenueCatSystemLabel(
      state.status
    );

  if (
    state.status !== 'ready' &&
    state.status !== 'degraded'
  ) {
    return systemLabel;
  }

  if (
    state.currentOfferingId
  ) {
    return 'OFFERING READY';
  }

  if (
    state.offeringsLoaded
  ) {
    return 'NO OFFERING';
  }

  return systemLabel;
}

function getRevenueCatStatusColor(
  status
) {
  switch (status) {
    case 'ready':
      return COLORS.success;

    case 'initializing':
      return COLORS.electric;

    case 'degraded':
    case 'unavailable':
      return COLORS.warning;

    default:
      return COLORS.muted;
  }
}

function getPurchaseSubtitle(
  product,
  revenueCatState
) {
  if (
    typeof product?.priceString ===
      'string' &&
    product.priceString.length >
      0
  ) {
    return product.priceString;
  }

  if (
    !revenueCatState.configured
  ) {
    return 'STORE CONNECTION REQUIRED';
  }

  if (
    !revenueCatState
      .currentOfferingId
  ) {
    return 'NO CURRENT OFFERING';
  }

  return 'PRODUCT NOT AVAILABLE';
}

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

  const [
    hapticsEnabled,
    setHapticsEnabled,
  ] = useState(true);

  const [
    visualEffectsEnabled,
    setVisualEffectsEnabled,
  ] = useState(true);

  const [
  isResetting,
  setIsResetting,
] = useState(false);

const [
  purchasingProductId,
  setPurchasingProductId,
] = useState(null);

const [
  revenueCatState,
  setRevenueCatState,
] = useState(
  () => getRevenueCatState()
);

useEffect(() => {
  setRevenueCatState(
    getRevenueCatState()
  );

  return subscribeRevenueCatState(
    setRevenueCatState
  );
}, []);

const revenueCatSystemLabel =
  getRevenueCatSystemLabel(
    revenueCatState.status
  );

const revenueCatStoreLabel =
  getRevenueCatStoreLabel(
    revenueCatState
  );

const revenueCatStatusColor =
  getRevenueCatStatusColor(
    revenueCatState.status
  );

  const proProduct =
  getRevenueCatProduct(
    PRODUCT_IDS.proMode
  );

const skinsProduct =
  getRevenueCatProduct(
    PRODUCT_IDS.unlockSkins
  );

const lifetimeProduct =
  getRevenueCatProduct(
    PRODUCT_IDS.lifetime
  );

const storeBusy =
  purchasingProductId !==
  null;

useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const loadSettings =
        async () => {
          const gameData =
            await loadGameData();

          if (!isActive) {
            return;
          }

          const nextMuted =
            gameData.settings
              ?.muted === true;

          const nextIntensity =
            gameData.settings
              ?.soundIntensity ===
              'reduced'
              ? 'reduced'
              : 'normal';

          setIsMuted(
            nextMuted
          );

          setSoundIntensity(
            nextIntensity
          );

          setHapticsEnabled(
            gameData.settings
              ?.haptics !== false
          );

          setVisualEffectsEnabled(
            gameData.settings
              ?.visualEffects !==
              false
          );

          setSoundSettings({
            muted:
              nextMuted,

            soundIntensity:
              nextIntensity,
          });

          setIsReady(true);
        };

      void loadSettings();

      return () => {
        isActive = false;
      };
    }, [])
  );

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
        muted:
          nextMuted,
      });

      void updateGameSettings({
        muted:
          nextMuted,
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

  const handleHapticsToggle =
    () => {
      if (!isReady) {
        return;
      }

      const nextEnabled =
        !hapticsEnabled;

      setHapticsEnabled(
        nextEnabled
      );

      void updateGameSettings({
        haptics:
          nextEnabled,
      });
    };

  const handleVisualEffectsToggle =
    () => {
      if (!isReady) {
        return;
      }

      const nextEnabled =
        !visualEffectsEnabled;

      setVisualEffectsEnabled(
        nextEnabled
      );

      void updateGameSettings({
        visualEffects:
          nextEnabled,
      });
    };

const handlePurchase =
  async (
    productId,
    productLabel
  ) => {
    if (
      purchasingProductId !==
      null
    ) {
      return;
    }

    setPurchasingProductId(
      productId
    );

    try {
      const result =
        await purchaseRevenueCatProduct(
          productId
        );

      if (
        result.status ===
        'purchased'
      ) {
        Alert.alert(
          'PURCHASE COMPLETE',
          `${productLabel} purchase confirmed.`
        );

        return;
      }

      if (
        result.status ===
        'cancelled'
      ) {
        return;
      }

      if (
        result.reason ===
        'not_configured'
      ) {
        Alert.alert(
          'STORE NOT CONFIGURED',
          'RevenueCat is not configured yet.'
        );

        return;
      }

      if (
        result.reason ===
        'product_not_found'
      ) {
        Alert.alert(
          'PRODUCT UNAVAILABLE',
          'This product is not available in the current RevenueCat offering.'
        );

        return;
      }

      Alert.alert(
        'PURCHASE FAILED',
        'The purchase could not be completed. Please try again later.'
      );
    } finally {
      setPurchasingProductId(
        null
      );
    }
  };

  const handleResetProgress =
    () => {
      if (
        !isReady ||
        isResetting
      ) {
        return;
      }

      Alert.alert(
        'RESET LOCAL PROGRESS',
        'This clears level progress, attempts, Daily Challenge history and challenge history. Settings and purchase records are kept.',
        [
          {
            text: 'CANCEL',
            style: 'cancel',
          },

          {
            text: 'RESET',
            style: 'destructive',

            onPress:
              async () => {
                setIsResetting(
                  true
                );

                try {
                  await resetLocalProgress();

                  navigation
                    .popToTop();
                } catch (error) {
                  console.warn(
                    'Progress reset failed:',
                    error
                  );

                  Alert.alert(
                    'RESET FAILED',
                    'Local progress could not be reset.'
                  );
                } finally {
                  setIsResetting(
                    false
                  );
                }
              },
          },
        ]
      );
    };

  return (
    <SafeAreaView
      style={styles.screen}
    >
      <ScrollView
        contentContainerStyle={
          styles.container
        }
        showsVerticalScrollIndicator={
          false
        }
      >
        <Text
          style={styles.eyebrow}
        >
          SYSTEM CONTROL
        </Text>

        <Text
          style={styles.title}
        >
          SETTINGS
        </Text>

        <Text
          style={
            styles.versionHeader
          }
        >
          {`SECUNDAS // V${APP_VERSION}`}
        </Text>

        <SectionTitle>
          AUDIO
        </SectionTitle>

        <View
          style={styles.panel}
        >
          <SettingRow
            title="SOUND / MUTE"
            description="GLOBAL GAME AUDIO"
          >
            <ToggleButton
              active={!isMuted}
              activeLabel="ON"
              inactiveLabel="OFF"
              disabled={!isReady}
              onPress={
                handleSoundToggle
              }
            />
          </SettingRow>

          <View
            style={styles.divider}
          />

          <View>
            <Text
              style={styles.label}
            >
              SOUND INTENSITY
            </Text>

            <Text
              style={
                styles.description
              }
            >
              REDUCED MODE LOWERS
              IMPACT AND DISABLES
              ORBIT PULSE
            </Text>

            <View
              style={
                styles.segmentRow
              }
            >
              <Pressable
                disabled={!isReady}
                style={[
                  styles.segmentButton,

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
                  styles.segmentButton,

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

        <SectionTitle>
          FEEDBACK
        </SectionTitle>

        <View
          style={styles.panel}
        >
          <SettingRow
            title="HAPTICS"
            description="IMPACT FEEDBACK"
          >
            <ToggleButton
              active={
                hapticsEnabled
              }
              disabled={!isReady}
              onPress={
                handleHapticsToggle
              }
            />
          </SettingRow>

          <View
            style={styles.divider}
          />

          <SettingRow
            title="VISUAL EFFECTS"
            description="TRAILS, PULSES AND HUD EFFECTS"
          >
            <ToggleButton
              active={
                visualEffectsEnabled
              }
              disabled={!isReady}
              onPress={
                handleVisualEffectsToggle
              }
            />
          </SettingRow>
        </View>

        <SectionTitle>
          DOT SKINS
        </SectionTitle>

        <View
          style={styles.panel}
        >
          <Text
            style={
              styles.description
            }
          >
            CLASSIC IS ACTIVE.
            PREMIUM SKINS UNLOCK
            AFTER STORE ENTITLEMENTS
            ARE CONNECTED.
          </Text>

          <View
            style={styles.skinGrid}
          >
            {DOT_SKINS.map(
              (skin) => {
                const isClassic =
                  skin ===
                  'CLASSIC';

                return (
                  <View
                    key={skin}
                    style={[
                      styles.skinTile,

                      isClassic &&
                        styles.skinTileActive,
                    ]}
                  >
                    <View
                      style={[
                        styles.skinDot,

                        isClassic &&
                          styles
                            .skinDotActive,
                      ]}
                    />

                    <Text
                      style={[
                        styles.skinName,

                        isClassic &&
                          styles.activeText,
                      ]}
                    >
                      {skin}
                    </Text>

                    <Text
                      style={
                        styles.skinState
                      }
                    >
                      {isClassic
                        ? 'ACTIVE'
                        : 'LOCKED'}
                    </Text>
                  </View>
                );
              }
            )}
          </View>
        </View>

        <SectionTitle>
          STORE
        </SectionTitle>

        <View
          style={styles.panel}
        >
          <StatusRow
  title="REVENUECAT"
  description="PURCHASE SERVICE"
  status={
    revenueCatStoreLabel
  }
  statusColor={
    revenueCatStatusColor
  }
/>

          <View
            style={styles.divider}
          />

          <PurchaseStoreButton
  title="GET PRO"
  subtitle={getPurchaseSubtitle(
    proProduct,
    revenueCatState
  )}
  disabled={
    !proProduct ||
    storeBusy
  }
  loading={
    purchasingProductId ===
    PRODUCT_IDS.proMode
  }
  onPress={() => {
    void handlePurchase(
      PRODUCT_IDS.proMode,
      'PRO MODE'
    );
  }}
/>

<PurchaseStoreButton
  title="UNLOCK SKINS"
  subtitle={getPurchaseSubtitle(
    skinsProduct,
    revenueCatState
  )}
  disabled={
    !skinsProduct ||
    storeBusy
  }
  loading={
    purchasingProductId ===
    PRODUCT_IDS.unlockSkins
  }
  onPress={() => {
    void handlePurchase(
      PRODUCT_IDS.unlockSkins,
      'UNLOCK SKINS'
    );
  }}
/>

<PurchaseStoreButton
  title="LIFETIME"
  subtitle={getPurchaseSubtitle(
    lifetimeProduct,
    revenueCatState
  )}
  disabled={
    !lifetimeProduct ||
    storeBusy
  }
  loading={
    purchasingProductId ===
    PRODUCT_IDS.lifetime
  }
  onPress={() => {
    void handlePurchase(
      PRODUCT_IDS.lifetime,
      'LIFETIME'
    );
  }}
/>

<LockedStoreButton
  title="RESTORE PURCHASES"
  subtitle="RESTORE SERVICE CONNECTS IN PHASE 32"
/>
        </View>

        <SectionTitle>
          SYSTEM STATUS
        </SectionTitle>

        <View
          style={styles.panel}
        >
          <StatusRow
            title="SUPABASE"
            description="OPTIONAL CLOUD SYNC"
            status="NOT CONFIGURED"
          />

          <View
            style={styles.divider}
          />

          <StatusRow
  title="REVENUECAT"
  description="PURCHASE STATUS"
  status={
    revenueCatSystemLabel
  }
  statusColor={
    revenueCatStatusColor
  }
/>

          <View
            style={styles.divider}
          />

          <StatusRow
            title="CORE GAME"
            description="LOCAL GAMEPLAY"
            status="OFFLINE READY"
            statusColor={
              COLORS.success
            }
          />
        </View>

        <SectionTitle>
          LEGAL & LICENCES
        </SectionTitle>

        <View
          style={styles.panel}
        >
          <StatusRow
            title="PRIVACY POLICY"
            description="PRODUCTION DOCUMENT"
            status="PUBLISHING PENDING"
          />

          <View
            style={styles.divider}
          />

          <StatusRow
            title="TERMS"
            description="PRODUCTION DOCUMENT"
            status="PUBLISHING PENDING"
          />

          <View
            style={styles.divider}
          />

          <StatusRow
            title="AUDIO LICENCES"
            description="KENNEY AUDIO ASSETS"
            status="CC0 DOCUMENTED"
            statusColor={
              COLORS.success
            }
          />
        </View>

        <SectionTitle>
          LOCAL DATA
        </SectionTitle>

        <View
          style={[
            styles.panel,
            styles.dangerPanel,
          ]}
        >
          <Text
            style={styles.label}
          >
            RESET LOCAL PROGRESS
          </Text>

          <Text
            style={
              styles.description
            }
          >
            CLEARS LEVELS, ATTEMPTS,
            DAILY HISTORY AND
            CHALLENGE HISTORY.
            SETTINGS AND PURCHASE
            RECORDS ARE PRESERVED.
          </Text>

          <Pressable
            disabled={
              !isReady ||
              isResetting
            }
            style={[
              styles.resetButton,

              (
                !isReady ||
                isResetting
              ) &&
                styles.disabledControl,
            ]}
            onPress={
              handleResetProgress
            }
          >
            <Text
              style={
                styles.resetButtonText
              }
            >
              {isResetting
                ? 'RESETTING...'
                : 'RESET PROGRESS'}
            </Text>
          </Pressable>
        </View>

        <SectionTitle>
          ABOUT
        </SectionTitle>

        <View
          style={styles.panel}
        >
          <StatusRow
            title="APP VERSION"
            description="SECUNDAS ANDROID"
            status={`V${APP_VERSION}`}
            statusColor={
              COLORS.electric
            }
          />
        </View>

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
      paddingHorizontal:
        LAYOUT.screenPadding,

      paddingTop:
        SPACING.xl,

      paddingBottom:
        SPACING.huge,
    },

    eyebrow: {
      ...TYPOGRAPHY.label,

      color:
        COLORS.electric,

      fontSize: 9,

      letterSpacing: 4,
    },

    title: {
      ...TYPOGRAPHY.heading,

      marginTop:
        SPACING.sm,

      color:
        COLORS.text,

      fontSize: 34,

      letterSpacing: 7,
    },

    versionHeader: {
      ...TYPOGRAPHY.label,

      marginTop:
        SPACING.sm,

      color:
        COLORS.muted,

      fontSize: 8,

      letterSpacing: 2,
    },

    sectionTitle: {
      ...TYPOGRAPHY.subheading,

      marginTop:
        SPACING.xxl,

      color:
        COLORS.text,

      fontSize: 16,

      letterSpacing: 5,
    },

    panel: {
      marginTop:
        SPACING.md,

      padding:
        SPACING.lg,

      backgroundColor:
        'rgba(255,255,255,0.035)',

      borderWidth: 1,

      borderColor:
        'rgba(0,209,255,0.28)',

      borderRadius:
        RADII.medium,
    },

    settingRow: {
      minHeight: 52,

      flexDirection: 'row',

      alignItems: 'center',

      justifyContent:
        'space-between',

      gap: SPACING.md,
    },

    statusRow: {
      minHeight: 52,

      flexDirection: 'row',

      alignItems: 'center',

      justifyContent:
        'space-between',

      gap: SPACING.md,
    },

    settingIdentity: {
      flex: 1,
    },

    label: {
      ...TYPOGRAPHY.label,

      color:
        COLORS.text,

      fontSize: 10,

      letterSpacing: 3,
    },

    description: {
      ...TYPOGRAPHY.label,

      marginTop:
        SPACING.xs,

      color:
        COLORS.muted,

      fontSize: 7,

      lineHeight: 13,

      letterSpacing: 1.7,
    },

    toggleButton: {
      minWidth: 82,

      minHeight: 44,

      justifyContent:
        'center',

      alignItems: 'center',

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

      color:
        COLORS.muted,

      fontSize: 9,

      letterSpacing: 3,
    },

    activeText: {
      color:
        COLORS.electric,
    },

    divider: {
      height: 1,

      marginVertical:
        SPACING.lg,

      backgroundColor:
        'rgba(255,255,255,0.08)',
    },

    segmentRow: {
      flexDirection: 'row',

      marginTop:
        SPACING.md,

      gap: SPACING.sm,
    },

    segmentButton: {
      flex: 1,

      minHeight: 46,

      justifyContent:
        'center',

      alignItems: 'center',

      borderWidth: 1,

      borderColor:
        'rgba(160,190,210,0.45)',

      borderRadius:
        RADII.small,

      backgroundColor:
        'rgba(255,255,255,0.035)',
    },

    statusText: {
      ...TYPOGRAPHY.label,

      maxWidth: 150,

      textAlign: 'right',

      fontSize: 8,

      lineHeight: 13,

      letterSpacing: 1.5,
    },

    skinGrid: {
      flexDirection: 'row',

      flexWrap: 'wrap',

      marginTop:
        SPACING.lg,

      gap: SPACING.sm,
    },

    skinTile: {
      width: '48%',

      minHeight: 92,

      justifyContent:
        'center',

      alignItems: 'center',

      padding:
        SPACING.sm,

      backgroundColor:
        'rgba(255,255,255,0.025)',

      borderWidth: 1,

      borderColor:
        'rgba(122,127,140,0.28)',

      borderRadius:
        RADII.medium,

      opacity: 0.5,
    },

    skinTileActive: {
      opacity: 1,

      borderColor:
        COLORS.electric,

      backgroundColor:
        'rgba(0,209,255,0.055)',
    },

    skinDot: {
      width: 20,

      height: 20,

      borderRadius: 10,

      backgroundColor:
        COLORS.muted,
    },

    skinDotActive: {
      backgroundColor:
        COLORS.electric,

      borderWidth: 2,

      borderColor:
        COLORS.text,

      shadowColor:
        COLORS.electric,

      shadowOpacity: 0.8,

      shadowRadius: 8,

      shadowOffset: {
        width: 0,
        height: 0,
      },
    },

    skinName: {
      ...TYPOGRAPHY.label,

      marginTop:
        SPACING.sm,

      color:
        COLORS.muted,

      fontSize: 8,

      letterSpacing: 2,
    },

    skinState: {
      ...TYPOGRAPHY.label,

      marginTop:
        SPACING.xs,

      color:
        COLORS.muted,

      fontSize: 6,

      letterSpacing: 1.5,
    },

    storeButton: {
      width: '100%',

      minHeight: 54,

      marginTop:
        SPACING.md,

      justifyContent:
        'center',

      alignItems: 'center',

      paddingHorizontal:
        SPACING.md,

      borderWidth: 1,

      borderColor:
        'rgba(255,45,85,0.4)',

      borderRadius:
        RADII.pill,

      backgroundColor:
        'rgba(255,45,85,0.035)',
    },

    storeButtonTitle: {
      ...TYPOGRAPHY.label,

      color:
        COLORS.text,

      fontSize: 9,

      letterSpacing: 3,
    },

    storeButtonSubtitle: {
      ...TYPOGRAPHY.label,

      marginTop:
        SPACING.xs,

      color:
        COLORS.muted,

      fontSize: 6,

      textAlign: 'center',

      letterSpacing: 1.2,
    },

    disabledControl: {
      opacity: 0.45,
    },

    dangerPanel: {
      borderColor:
        'rgba(255,0,68,0.45)',
    },

    resetButton: {
      width: '100%',

      minHeight: 52,

      marginTop:
        SPACING.lg,

      justifyContent:
        'center',

      alignItems: 'center',

      borderWidth: 1,

      borderColor:
        COLORS.fail,

      borderRadius:
        RADII.pill,

      backgroundColor:
        'rgba(255,0,68,0.08)',
    },

    resetButtonText: {
      ...TYPOGRAPHY.label,

      color:
        COLORS.fail,

      letterSpacing: 3,
    },

    backButton: {
      width: '100%',

      minHeight: 54,

      marginTop:
        SPACING.xxl,

      justifyContent:
        'center',

      alignItems: 'center',

      borderWidth: 1,

      borderColor:
        'rgba(255,45,85,0.5)',

      borderRadius:
        RADII.pill,

      backgroundColor:
        'rgba(255,45,85,0.055)',
    },

    backButtonText: {
      ...TYPOGRAPHY.label,

      color:
        COLORS.text,

      letterSpacing: 4,
    },
  });