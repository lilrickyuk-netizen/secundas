import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

import {
  Pressable,
  ScrollView,
  Share,
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

import {
  createChallengeLink,
} from '../services/deepLinks';

import {
  loadGameData,
  recordAcceptedChallenge,
  recordReceivedChallenge,
} from '../utils/storage';

function getChallengeTime(
  challenge
) {
  return (
    challenge.completedAt ??
    challenge.acceptedAt ??
    challenge.timestamp ??
    0
  );
}

function formatChallengeTime(
  challenge
) {
  const timestamp =
    getChallengeTime(
      challenge
    );

  if (!timestamp) {
    return 'LOCAL RECORD';
  }

  try {
    return new Date(
      timestamp
    ).toLocaleString();
  } catch {
    return 'LOCAL RECORD';
  }
}

function getStatusColor(
  status
) {
  switch (status) {
    case 'completed':
      return COLORS.success;

    case 'accepted':
      return COLORS.electric;

    case 'sent':
      return COLORS.warning;

    default:
      return COLORS.accent;
  }
}

function ChallengeHistoryCard({
  challenge,
  onPlay,
  onShare,
}) {
  const completed =
    challenge.status ===
    'completed';

  const playable =
    challenge.status ===
      'received' ||
    challenge.status ===
      'accepted';

  const suffering =
    challenge.kind ===
    'suffering';

  const outcomeText =
    challenge.outcome === 'won'
      ? 'YOU WIN'
      : challenge.outcome ===
          'lost'
        ? 'THEY GOT YOU'
        : null;

  return (
    <View
      style={styles.historyCard}
    >
      <View
        style={styles.historyTopRow}
      >
        <Text
          style={styles.historyLevel}
        >
          {`LEVEL ${String(
            challenge.level
          ).padStart(2, '0')}`}
        </Text>

        <Text
          style={[
            styles.historyStatus,

            {
              color:
                getStatusColor(
                  challenge.status
                ),
            },
          ]}
        >
          {challenge.status
            .toUpperCase()}
        </Text>
      </View>

      <Text
        style={styles.historyTarget}
      >
        {suffering
          ? `TARGET // ${challenge.score} ATTEMPTS`
          : `THEM // ${challenge.score} ATTEMPTS`}
      </Text>

      <Text
        style={styles.historySeed}
      >
        {`SEED // ${challenge.seed}`}
      </Text>

      {completed &&
        Number.isFinite(
          challenge.challengedScore
        ) && (
          <View
            style={
              styles.resultPanel
            }
          >
            <Text
              style={[
                styles.resultTitle,

                {
                  color:
                    challenge.outcome ===
                    'won'
                      ? COLORS.success
                      : COLORS.fail,
                },
              ]}
            >
              {outcomeText}
            </Text>

            <Text
              style={
                styles.resultComparison
              }
            >
              {suffering
                ? `YOU // ${challenge.challengedScore}   TARGET // ${challenge.score}`
                : `YOU // ${challenge.challengedScore}   THEM // ${challenge.score}`}
            </Text>
          </View>
        )}

      <Text
        style={styles.historyTime}
      >
        {formatChallengeTime(
          challenge
        )}
      </Text>

      <View
        style={styles.historyActions}
      >
        {playable && (
          <Pressable
            style={
              styles.historyPlayButton
            }
            onPress={() =>
              onPlay(challenge)
            }
          >
            <Text
              style={
                styles.historyPlayText
              }
            >
              {challenge.status ===
              'received'
                ? 'ACCEPT'
                : 'PLAY CHALLENGE'}
            </Text>
          </Pressable>
        )}

        <Pressable
          style={
            styles.historyShareButton
          }
          onPress={() =>
            onShare(challenge)
          }
        >
          <Text
            style={
              styles.historyShareText
            }
          >
            SHARE LINK
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

function HistorySection({
  title,
  challenges,
  emptyText,
  onPlay,
  onShare,
}) {
  return (
    <View
      style={styles.historySection}
    >
      <View
        style={
          styles.historySectionHeader
        }
      >
        <Text
          style={
            styles.historySectionTitle
          }
        >
          {title}
        </Text>

        <Text
          style={
            styles.historySectionCount
          }
        >
          {challenges.length}
        </Text>
      </View>

      {challenges.length === 0 ? (
        <Text
          style={
            styles.historyEmptyText
          }
        >
          {emptyText}
        </Text>
      ) : (
        challenges.map(
          (challenge) => (
            <ChallengeHistoryCard
              key={
                challenge.challengeId
              }
              challenge={
                challenge
              }
              onPlay={onPlay}
              onShare={onShare}
            />
          )
        )
      )}
    </View>
  );
}

export default function ChallengeScreen({
  navigation,
  route,
}) {
  const routeChallenge =
    route?.params?.challenge ??
    null;

  const [
    activeChallenge,
    setActiveChallenge,
  ] = useState(
    routeChallenge
  );

  const [
    challengeHistory,
    setChallengeHistory,
  ] = useState([]);

  const challengeKey =
    routeChallenge
      ? `${routeChallenge.level}:${routeChallenge.score}:${routeChallenge.seed}:${routeChallenge.kind ?? 'completed'}`
      : null;

  const lastPingedChallengeRef =
    useRef(null);

  const refreshHistory =
    useCallback(
      async () => {
        const gameData =
          await loadGameData();

        const history =
          Object.values(
            gameData.challenges ??
              {}
          )
            .filter(Boolean)
            .sort(
              (
                challengeA,
                challengeB
              ) =>
                getChallengeTime(
                  challengeB
                ) -
                getChallengeTime(
                  challengeA
                )
            );

        setChallengeHistory(
          history
        );
      },
      []
    );

  useFocusEffect(
    useCallback(() => {
      void refreshHistory();
    }, [refreshHistory])
  );

  useEffect(() => {
    if (!routeChallenge) {
      setActiveChallenge(
        null
      );

      return undefined;
    }

    let isActive = true;

    void recordReceivedChallenge(
      routeChallenge
    ).then(
      (
        recordedChallenge
      ) => {
        if (!isActive) {
          return;
        }

        setActiveChallenge(
          recordedChallenge ??
            routeChallenge
        );

        void refreshHistory();
      }
    );

    return () => {
      isActive = false;
    };
  }, [
    challengeKey,
    refreshHistory,
  ]);

  useEffect(() => {
    if (
      !challengeKey ||
      lastPingedChallengeRef
        .current ===
        challengeKey
    ) {
      return;
    }

    lastPingedChallengeRef.current =
      challengeKey;

    void playSound(
      SOUND_KEYS.CHALLENGE_PING
    );
  }, [challengeKey]);

  const handlePlayChallenge =
    async (
      challengeToPlay
    ) => {
      if (!challengeToPlay) {
        return;
      }

      let persistedChallenge =
        challengeToPlay;

      if (
        !persistedChallenge
          .challengeId
      ) {
        persistedChallenge =
          await recordReceivedChallenge(
            persistedChallenge
          );
      }

      if (
        !persistedChallenge
          ?.challengeId
      ) {
        return;
      }

      if (
        persistedChallenge.status !==
        'accepted'
      ) {
        persistedChallenge =
          await recordAcceptedChallenge(
            persistedChallenge
              .challengeId
          );
      }

      if (!persistedChallenge) {
        return;
      }

      setActiveChallenge(
        persistedChallenge
      );

      await refreshHistory();

      navigation.navigate(
        'Game',
        {
          mode: 'challenge',

          challenge:
            persistedChallenge,
        }
      );
    };

  const handleShareChallenge =
    async (
      challengeToShare
    ) => {
      if (!challengeToShare) {
        return;
      }

      const link =
        createChallengeLink({
          level:
            challengeToShare.level,

          score:
            challengeToShare.score,

          seed:
            challengeToShare.seed,

          kind:
            challengeToShare.kind ??
            'completed',
        });

      if (!link) {
        return;
      }

      const suffering =
        challengeToShare.kind ===
        'suffering';

      const message =
        suffering
          ? `I've spent ${challengeToShare.score} attempts on Level ${challengeToShare.level} in Secundas and still haven't beaten it. Can you beat it in fewer attempts? ${link}`
          : `I spent ${challengeToShare.score} attempts on Level ${challengeToShare.level} in Secundas. Think you can do better? ${link}`;

      try {
        await Share.share({
          title:
            'Secundas challenge',

          message,
        });
      } catch (error) {
        console.warn(
          'Challenge history share failed:',
          error
        );
      }
    };

  const inboxChallenges =
    challengeHistory.filter(
      (challenge) =>
        challenge.status ===
          'received' &&
        challenge.challengeId !==
          activeChallenge
            ?.challengeId
    );

  const sentChallenges =
    challengeHistory.filter(
      (challenge) =>
        challenge.status ===
        'sent'
    );

  const acceptedChallenges =
    challengeHistory.filter(
      (challenge) =>
        challenge.status ===
        'accepted'
    );

  const completedChallenges =
    challengeHistory.filter(
      (challenge) =>
        challenge.status ===
        'completed'
    );

  const showIncoming =
    activeChallenge?.status ===
    'received';

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

        {showIncoming && (
          <View
            style={
              styles.challengePanel
            }
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
                activeChallenge.level
              ).padStart(2, '0')}`}
            </Text>

            <Text
              style={styles.message}
            >
              {activeChallenge.kind ===
              'suffering'
                ? `Someone has already spent ${activeChallenge.score} ${
                    activeChallenge.score ===
                    1
                      ? 'attempt'
                      : 'attempts'
                  } on Level ${activeChallenge.level} and still hasn't beaten it.`
                : `Someone beat Level ${activeChallenge.level} in ${activeChallenge.score} ${
                    activeChallenge.score ===
                    1
                      ? 'try'
                      : 'tries'
                  }.`}
            </Text>

            <Text
              style={styles.question}
            >
              {activeChallenge.kind ===
              'suffering'
                ? `Can you beat Level ${activeChallenge.level} in fewer attempts?`
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
                {`BEAT ${activeChallenge.score} ATTEMPTS`}
              </Text>
            </View>

            <Text
              style={styles.seedText}
            >
              {`SEED // ${activeChallenge.seed}`}
            </Text>

            <Pressable
              style={
                styles.acceptButton
              }
              onPress={() =>
                handlePlayChallenge(
                  activeChallenge
                )
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

            <Pressable
              style={
                styles.incomingShareButton
              }
              onPress={() =>
                handleShareChallenge(
                  activeChallenge
                )
              }
            >
              <Text
                style={
                  styles.incomingShareText
                }
              >
                SHARE LINK
              </Text>
            </Pressable>
          </View>
        )}

        <HistorySection
          title="INBOX"
          challenges={
            inboxChallenges
          }
          emptyText="NO PENDING CHALLENGES"
          onPlay={
            handlePlayChallenge
          }
          onShare={
            handleShareChallenge
          }
        />

        <HistorySection
          title="SENT"
          challenges={
            sentChallenges
          }
          emptyText="NO SENT CHALLENGES"
          onPlay={
            handlePlayChallenge
          }
          onShare={
            handleShareChallenge
          }
        />

        <HistorySection
          title="ACCEPTED"
          challenges={
            acceptedChallenges
          }
          emptyText="NO ACTIVE CHALLENGES"
          onPlay={
            handlePlayChallenge
          }
          onShare={
            handleShareChallenge
          }
        />

        <HistorySection
          title="COMPLETED"
          challenges={
            completedChallenges
          }
          emptyText="NO COMPLETED CHALLENGES"
          onPlay={
            handlePlayChallenge
          }
          onShare={
            handleShareChallenge
          }
        />
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

      paddingTop: SPACING.xl,

      paddingBottom:
        SPACING.huge,
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
        SPACING.xxl,

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
    },

    acceptButtonText: {
      ...TYPOGRAPHY.label,

      color: COLORS.text,

      letterSpacing: 3,
    },

    incomingShareButton: {
      width: '100%',

      minHeight:
        LAYOUT.minimumTouchTarget,

      marginTop:
        SPACING.md,

      justifyContent: 'center',

      alignItems: 'center',

      backgroundColor:
        'rgba(0,209,255,0.04)',

      borderWidth: 1,

      borderColor:
        COLORS.electric,

      borderRadius:
        RADII.pill,
    },

    incomingShareText: {
      ...TYPOGRAPHY.label,

      color: COLORS.electric,

      letterSpacing: 3,
    },

    historySection: {
      width: '100%',

      marginTop:
        SPACING.xxl,
    },

    historySectionHeader: {
      flexDirection: 'row',

      justifyContent:
        'space-between',

      alignItems: 'center',

      paddingBottom:
        SPACING.sm,

      borderBottomWidth: 1,

      borderBottomColor:
        'rgba(255,255,255,0.08)',
    },

    historySectionTitle: {
      ...TYPOGRAPHY.subheading,

      color: COLORS.text,

      letterSpacing: 4,
    },

    historySectionCount: {
      ...TYPOGRAPHY.label,

      color: COLORS.accent,

      letterSpacing: 2,
    },

    historyEmptyText: {
      ...TYPOGRAPHY.label,

      marginTop:
        SPACING.md,

      color: COLORS.muted,

      fontSize: 8,

      letterSpacing: 2,
    },

    historyCard: {
      width: '100%',

      marginTop:
        SPACING.md,

      padding:
        SPACING.lg,

      backgroundColor:
        'rgba(255,255,255,0.035)',

      borderWidth: 1,

      borderColor:
        'rgba(255,45,85,0.38)',

      borderRadius:
        RADII.medium,
    },

    historyTopRow: {
      flexDirection: 'row',

      justifyContent:
        'space-between',

      alignItems: 'center',
    },

    historyLevel: {
      ...TYPOGRAPHY.subheading,

      color: COLORS.text,

      letterSpacing: 3,
    },

    historyStatus: {
      ...TYPOGRAPHY.label,

      fontSize: 8,

      letterSpacing: 2,
    },

    historyTarget: {
      ...TYPOGRAPHY.label,

      marginTop:
        SPACING.md,

      color: COLORS.electric,

      fontSize: 9,

      letterSpacing: 2,
    },

    historySeed: {
      ...TYPOGRAPHY.label,

      marginTop:
        SPACING.xs,

      color: COLORS.muted,

      fontSize: 7,

      letterSpacing: 1.5,
    },

    historyTime: {
      ...TYPOGRAPHY.label,

      marginTop:
        SPACING.md,

      color: COLORS.muted,

      fontSize: 7,

      letterSpacing: 1,
    },

    resultPanel: {
      marginTop:
        SPACING.md,

      padding:
        SPACING.md,

      backgroundColor:
        'rgba(0,209,255,0.04)',

      borderWidth: 1,

      borderColor:
        'rgba(0,209,255,0.24)',

      borderRadius:
        RADII.medium,
    },

    resultTitle: {
      ...TYPOGRAPHY.subheading,

      textAlign: 'center',

      letterSpacing: 3,
    },

    resultComparison: {
      ...TYPOGRAPHY.label,

      marginTop:
        SPACING.sm,

      color: COLORS.text,

      textAlign: 'center',

      fontSize: 8,

      letterSpacing: 1.5,
    },

    historyActions: {
      flexDirection: 'row',

      marginTop:
        SPACING.lg,

      gap: SPACING.sm,
    },

    historyPlayButton: {
      flex: 1,

      minHeight:
        LAYOUT.minimumTouchTarget,

      justifyContent: 'center',

      alignItems: 'center',

      backgroundColor:
        COLORS.accent,

      borderRadius:
        RADII.pill,
    },

    historyPlayText: {
      ...TYPOGRAPHY.label,

      color: COLORS.text,

      fontSize: 8,

      letterSpacing: 2,
    },

    historyShareButton: {
      flex: 1,

      minHeight:
        LAYOUT.minimumTouchTarget,

      justifyContent: 'center',

      alignItems: 'center',

      backgroundColor:
        'rgba(0,209,255,0.035)',

      borderWidth: 1,

      borderColor:
        COLORS.electric,

      borderRadius:
        RADII.pill,
    },

    historyShareText: {
      ...TYPOGRAPHY.label,

      color: COLORS.electric,

      fontSize: 8,

      letterSpacing: 2,
    },
  });