import { StyleSheet, View } from 'react-native';
import { COLORS } from '../utils/constants';

export default function Indicator({ size = 20 }) {
  return (
    <View
      style={[
        styles.outerGlow,
        {
          width: size * 2.6,
          height: size * 2.6,
          borderRadius: size * 1.3,
          marginLeft: -(size * 0.8),
          marginTop: -(size * 0.8),
        },
      ]}
    >
      <View
        style={[
          styles.middleGlow,
          {
            width: size * 1.7,
            height: size * 1.7,
            borderRadius: size,
          },
        ]}
      >
        <View
          style={[
            styles.dot,
            {
              width: size,
              height: size,
              borderRadius: size / 2,
            },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outerGlow: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 209, 255, 0.10)',
  },

  middleGlow: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 209, 255, 0.28)',
  },

  dot: {
    backgroundColor: COLORS.text,
    borderWidth: 3,
    borderColor: COLORS.electric,

    shadowColor: COLORS.electric,
    shadowOpacity: 1,
    shadowRadius: 12,
    shadowOffset: {
      width: 0,
      height: 0,
    },

    elevation: 14,
  },
});