import { 
    Pressable,
    ScrollView,
    Settings,
    StyleSheet,
    Text,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../utils/constants';
import {
    LAYOUT,
    RADII,
    SPACING,
    TYPOGRAPHY,
} from '../utils/theme';

export default function HomeScreen({ navigation }) {
    return (
        <SafeAreaView style={styles.screen}>
            <ScrollView
            contentContainerStyle={styles.container}
            showsVerticalScrollIndicator={false}
            >
                <Text style={styles.title}>SECUNDAS</Text>

                <Text style={styles.tagline}>
                    One tap. One second. Endless rage.
                </Text>

                <Pressable
                style={styles.startButton}
                onPress={() => navigation.navigate('Game')}
            >
                <Text style={styles.startButtonText}>START</Text>
                </Pressable>

                <Pressable
                style={styles.continueButton}
                onPress={() => navigation.navigate('Game')}
            >
                <Text style={styles.continueButtonText}>CONTINUE LEVEL</Text>
            </Pressable>
            <View style={styles.dailyCard}>
                <View style={styles.dailyHeader}>
                    <Text style={styles.dailyTitle}>DAILY CHALLENGE</Text>
                    <Text style={styles.dailyBadge}>TODAY</Text>
                </View> 
                <Text style={styles.dailyText}>TODAY'S TIMING CHALLENGE
                </Text>
                </View>
                <View style={styles.statsRow}>
  <View style={styles.statPanel}>
    <Text style={styles.statValue}>0</Text>
    <Text style={styles.statLabel}>STREAK</Text>
  </View>

  <View style={styles.statPanel}>
    <Text style={styles.statValue}>0</Text>
    <Text style={styles.statLabel}>TOTAL ATTEMPTS</Text>
  </View>

  <View style={styles.statPanel}>
    <Text style={styles.statValue}>0</Text>
    <Text style={styles.statLabel}>LEVELS COMPLETE</Text>
  </View>
</View>

<Pressable
  style={styles.challengeButton}
  onPress={() => navigation.navigate('Challenge')}
>
  <Text style={styles.challengeButtonText}>CHALLENGES</Text>

  <View style={styles.challengeBadge}>
    <Text style={styles.challengeBadgeText}>0</Text>
  </View>
</Pressable>

<Pressable style={styles.settingsButton} onPress={() => navigation.navigate('Settings')}>
    <Text style={styles.settingsButtonText}>SETTINGS</Text>
</Pressable>

</ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: COLORS.background
    },
    container: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: LAYOUT.screenPadding
    },
    title: {
        ...TYPOGRAPHY.title,
        color: COLORS.text,
    },
    tagline: {
        ...TYPOGRAPHY.body,
        color: COLORS.muted,
        textAlign: 'center',
        marginTop: 12,
        letterSpacing: 1.5, 
    },
    startButton: {
        minHeight: LAYOUT.minimumTouchTarget,
        marginTop: SPACING.xxl,
        paddingHorizontal: SPACING.xxl,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.accent,
        borderRadius: RADII.medium,
        borderWidth: 1,
        borderColor: COLORS.accent,
        elevation: 8,
    },
    startButtonText: {
        ...TYPOGRAPHY.subheading,
        color: COLORS.text,
        letterSpacing: 4,
    },
    continueButton: {
        minHeight: LAYOUT.minimumTouchTarget,
        marginTop: SPACING.md,
        paddingHorizontal: SPACING.xxl,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.glass,
        borderRadius: RADII.medium,
        borderWidth: 1,
        borderColor: COLORS.electric,
    },
    continueButtonText: {
        ...TYPOGRAPHY.body,
        color: COLORS.electric,
        letterSpacing: 3,
    },
    dailyCard: {
        width: '100%',
        marginTop: SPACING.xxl,
        padding: SPACING.lg,
        backgroundColor: COLORS.panel,
        borderRadius: RADII.panel,
        borderWidth: 1,
        borderColor: COLORS.accent,
    },
    dailyHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    dailyTitle: {
        ...TYPOGRAPHY.subheading,
        color: COLORS.text,
        letterSpacing: 2,
    },
    dailyBadge: {
        ...TYPOGRAPHY.label,
        color: COLORS.accent,
        letterSpacing: 2,
    },
    dailyText: {
        ...TYPOGRAPHY.body,
        marginTop: SPACING.md,
        color: COLORS.muted,
    },
    statsRow: {
  width: '100%',
  flexDirection: 'row',
  marginTop: SPACING.lg,
  gap: SPACING.sm,
},

statPanel: {
  flex: 1,
  minHeight: 82,
  justifyContent: 'center',
  alignItems: 'center',
  padding: SPACING.sm,
  backgroundColor: COLORS.glass,
  borderRadius: RADII.medium,
  borderWidth: 1,
  borderColor: COLORS.panel,
},

statValue: {
  ...TYPOGRAPHY.number,
  fontSize: 28,
  color: COLORS.electric,
},

statLabel: {
  ...TYPOGRAPHY.label,
  marginTop: SPACING.xs,
  color: COLORS.muted,
  textAlign: 'center',
}, 
challengeButton: {
  width: '100%',
  minHeight: LAYOUT.minimumTouchTarget,
  marginTop: SPACING.lg,
  paddingHorizontal: SPACING.lg,
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  backgroundColor: COLORS.glass,
  borderRadius: RADII.medium,
  borderWidth: 1,
  borderColor: COLORS.accent,
},

challengeButtonText: {
  ...TYPOGRAPHY.label,
  color: COLORS.text,
  letterSpacing: 3,
},

challengeBadge: {
  minWidth: 28,
  height: 28,
  paddingHorizontal: SPACING.xs,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: COLORS.accent,
  borderRadius: RADII.pill,
},

challengeBadgeText: {
  ...TYPOGRAPHY.label,
  color: COLORS.text,
},
settingsButton: {
  minHeight: LAYOUT.minimumTouchTarget,
  width: '100%',
  marginTop: SPACING.lg,
  paddingHorizontal: SPACING.lg,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: COLORS.glass,
  borderRadius: RADII.medium,
  borderWidth: 1,
  borderColor: COLORS.muted,
},

settingsButtonText: {
  ...TYPOGRAPHY.label,
  color: COLORS.text,
  letterSpacing: 3,
}, 


});