import {
  StyleSheet,
  View,
} from 'react-native';

import {
  COLORS,
} from '../utils/constants';

const TRAIL_SEGMENTS = [
  {
    distance: 13,
    scale: 0.55,
    opacity: 0.55,
  },
  {
    distance: 22,
    scale: 0.42,
    opacity: 0.38,
  },
  {
    distance: 31,
    scale: 0.30,
    opacity: 0.24,
  },
  {
    distance: 40,
    scale: 0.20,
    opacity: 0.12,
  },
];

export default function Indicator({
  size = 20,
  angle = 0,
}) {
  const radians =
    (angle - 90) *
    (Math.PI / 180);

  const trailDirectionX =
    Math.sin(radians);

  const trailDirectionY =
    -Math.cos(radians);

  return (
    <View
      style={[
        styles.container,
        {
          width: size,
          height: size,
        },
      ]}
    >
      {TRAIL_SEGMENTS.map(
        (
          segment,
          index
        ) => {
          const segmentSize =
            size *
            segment.scale;

          return (
            <View
              key={index}
              pointerEvents="none"
              style={[
                styles.trailSegment,
                {
                  width:
                    segmentSize,

                  height:
                    segmentSize,

                  borderRadius:
                    segmentSize / 2,

                  opacity:
                    segment.opacity,

                  left:
                    size / 2 -
                    segmentSize / 2 +
                    trailDirectionX *
                      segment.distance,

                  top:
                    size / 2 -
                    segmentSize / 2 +
                    trailDirectionY *
                      segment.distance,
                },
              ]}
            />
          );
        }
      )}

      <View
        style={[
          styles.outerGlow,
          {
            width:
              size * 2.6,

            height:
              size * 2.6,

            borderRadius:
              size * 1.3,

            left:
              -(size * 0.8),

            top:
              -(size * 0.8),
          },
        ]}
      >
        <View
          style={[
            styles.middleGlow,
            {
              width:
                size * 1.7,

              height:
                size * 1.7,

              borderRadius:
                size,
            },
          ]}
        >
          <View
            style={[
              styles.dot,
              {
                width: size,
                height: size,

                borderRadius:
                  size / 2,
              },
            ]}
          />
        </View>
      </View>
    </View>
  );
}

const styles =
  StyleSheet.create({
    container: {
      position: 'relative',

      overflow: 'visible',
    },

    trailSegment: {
      position: 'absolute',

      backgroundColor:
        COLORS.electric,

      shadowColor:
        COLORS.electric,

      shadowOpacity: 0.75,

      shadowRadius: 7,

      shadowOffset: {
        width: 0,
        height: 0,
      },
    },

    outerGlow: {
      position: 'absolute',

      justifyContent:
        'center',

      alignItems: 'center',

      backgroundColor:
        'rgba(0,209,255,0.10)',
    },

    middleGlow: {
      justifyContent:
        'center',

      alignItems: 'center',

      backgroundColor:
        'rgba(0,209,255,0.28)',
    },

    dot: {
      backgroundColor:
        COLORS.electric,

      borderWidth: 2,

      borderColor:
        COLORS.text,

      shadowColor:
        COLORS.electric,

      shadowOpacity: 1,

      shadowRadius: 12,

      shadowOffset: {
        width: 0,
        height: 0,
      },

      elevation: 14,
    },
  });