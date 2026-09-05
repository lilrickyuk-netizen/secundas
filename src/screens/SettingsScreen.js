import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../utils/constants';

export default function SettingsScreen() {
    return (
        <SafeAreaView style={styles.screen} />
    );
    }

    const styles = StyleSheet.create({
        screen: {
            flex: 1,
            backgroundColor: COLORS.background,
        }
    });