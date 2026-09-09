import {
  useEffect,
  useState,
} from 'react';

import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {
  useIsFocused,
} from '@react-navigation/native';

import {
  COLORS,
} from '../utils/constants';

import {
  SPACING,
  TYPOGRAPHY,
} from '../utils/theme';

function getSecondsUntilNextMidnight() {
  const now = new Date();

  const nextMidnight =
    new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + 1,
      0,
      0,
      0,
      0
    );

  const millisecondsRemaining =
    nextMidnight.getTime() -
    now.getTime();

  return Math.max(
    0,
    Math.ceil(
      millisecondsRemaining /
        1000
    )
  );
}

function padTime(value) {
  return String(value).padStart(
    2,
    '0'
  );
}

function formatCountdown(
  totalSeconds
) {
  const safeSeconds =
    Math.max(
      0,
      Math.floor(totalSeconds)
    );

  const hours =
    Math.floor(
      safeSeconds / 3600
    );

  const minutes =
    Math.floor(
      (safeSeconds % 3600) /
        60
    );

  const seconds =
    safeSeconds % 60;

  return `${padTime(hours)}:${padTime(
    minutes
  )}:${padTime(seconds)}`;
}

export default function DailyTimer() {
  const isFocused =
    useIsFocused();

  const [
    secondsRemaining,
    setSecondsRemaining,
  ] = useState(
    getSecondsUntilNextMidnight
  );

  useEffect(() => {
    if (!isFocused) {
      return undefined;
    }

    const updateCountdown =
      () => {
        setSecondsRemaining(
          getSecondsUntilNextMidnight()
        );
      };

    updateCountdown();

    const intervalId =
      setInterval(
        updateCountdown,
        1000
      );

    return () => {
      clearInterval(
        intervalId
      );
    };
  }, [isFocused]);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        NEXT DAILY
      </Text>

      <Text style={styles.timer}>
        {formatCountdown(
          secondsRemaining
        )}
      </Text>
    </View>
  );
}

const styles =
  StyleSheet.create({
    container: {
      width: '100%',

      marginTop: SPACING.md,

      paddingTop: SPACING.md,

      flexDirection: 'row',

      justifyContent:
        'space-between',

      alignItems: 'center',

      borderTopWidth: 1,

      borderTopColor:
        'rgba(0,209,255,0.16)',
    },

    label: {
      ...TYPOGRAPHY.label,

      color: COLORS.muted,

      fontSize: 8,

      letterSpacing: 2,
    },

    timer: {
      ...TYPOGRAPHY.number,

      color: COLORS.electric,

      fontSize: 18,

      letterSpacing: 3,

      fontVariant: [
        'tabular-nums',
      ],
    },
  });