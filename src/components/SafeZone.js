import {
  Circle,
  Defs,
  G,
  Line,
  RadialGradient,
  Stop,
  Svg,
} from 'react-native-svg';

import { COLORS } from '../utils/constants';

function getArcValues(radius, angle) {
  const circumference =
    2 * Math.PI * radius;

  const arcLength =
    circumference *
    (angle / 360);

  return {
    circumference,
    arcLength,
  };
}

export default function SafeZone({
  size,
  radius,
  safeStart,
  safeSize,
}) {
  const center = size / 2;

  const safeArc =
    getArcValues(
      radius,
      safeSize
    );

  const dangerStart =
    safeStart + safeSize;

  const dangerSize =
    Math.max(
      0,
      360 - safeSize
    );

  const dangerArc =
    getArcValues(
      radius,
      dangerSize
    );

  const innerRadius =
    radius - 20;

  const outerRadius =
    radius + 14;

  return (
    <Svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
    >
      <Defs>
        <RadialGradient
          id="arenaGlow"
          cx="50%"
          cy="50%"
          rx="50%"
          ry="50%"
        >
          <Stop
            offset="0%"
            stopColor={COLORS.accent}
            stopOpacity="0.10"
          />

          <Stop
            offset="55%"
            stopColor={COLORS.electric}
            stopOpacity="0.025"
          />

          <Stop
            offset="100%"
            stopColor={COLORS.background}
            stopOpacity="0"
          />
        </RadialGradient>
      </Defs>

      <Circle
        cx={center}
        cy={center}
        r={radius + 40}
        fill="url(#arenaGlow)"
      />

      <G opacity={0.16}>
        <Line
          x1={center}
          y1={20}
          x2={center}
          y2={size - 20}
          stroke={COLORS.electric}
          strokeWidth={1}
        />

        <Line
          x1={20}
          y1={center}
          x2={size - 20}
          y2={center}
          stroke={COLORS.electric}
          strokeWidth={1}
        />

        <Line
          x1={55}
          y1={55}
          x2={size - 55}
          y2={size - 55}
          stroke={COLORS.muted}
          strokeWidth={0.7}
        />

        <Line
          x1={size - 55}
          y1={55}
          x2={55}
          y2={size - 55}
          stroke={COLORS.muted}
          strokeWidth={0.7}
        />
      </G>

      <Circle
        cx={center}
        cy={center}
        r={radius - 58}
        fill="none"
        stroke={COLORS.muted}
        strokeWidth={0.6}
        opacity={0.18}
      />

      <Circle
        cx={center}
        cy={center}
        r={radius - 38}
        fill="none"
        stroke={COLORS.muted}
        strokeWidth={0.6}
        opacity={0.22}
      />

      <Circle
        cx={center}
        cy={center}
        r={innerRadius}
        fill="none"
        stroke={COLORS.electric}
        strokeWidth={0.8}
        opacity={0.14}
      />

      <Circle
        cx={center}
        cy={center}
        r={radius}
        fill="none"
        stroke={COLORS.electric}
        strokeWidth={2}
        opacity={0.28}
      />

      <Circle
        cx={center}
        cy={center}
        r={outerRadius}
        fill="none"
        stroke={COLORS.muted}
        strokeWidth={1}
        opacity={0.16}
      />

      <Circle
        cx={center}
        cy={center}
        r={radius}
        fill="none"
        stroke={COLORS.safe}
        strokeWidth={12}
        strokeLinecap="butt"
        strokeDasharray={`${safeArc.arcLength} ${
          safeArc.circumference -
          safeArc.arcLength
        }`}
        transform={`rotate(${
          safeStart - 90
        } ${center} ${center})`}
      />

      <Circle
        cx={center}
        cy={center}
        r={radius}
        fill="none"
        stroke={COLORS.success}
        strokeWidth={4}
        strokeLinecap="round"
        strokeDasharray={`${safeArc.arcLength} ${
          safeArc.circumference -
          safeArc.arcLength
        }`}
        transform={`rotate(${
          safeStart - 90
        } ${center} ${center})`}
        opacity={0.7}
      />

      <Circle
        cx={center}
        cy={center}
        r={radius}
        fill="none"
        stroke={COLORS.fail}
        strokeWidth={12}
        strokeLinecap="butt"
        strokeDasharray={`${dangerArc.arcLength} ${
          dangerArc.circumference -
          dangerArc.arcLength
        }`}
        transform={`rotate(${
          dangerStart - 90
        } ${center} ${center})`}
      />

      <Circle
        cx={center}
        cy={center}
        r={radius}
        fill="none"
        stroke={COLORS.accent}
        strokeWidth={3}
        strokeLinecap="round"
        strokeDasharray={`${dangerArc.arcLength} ${
          dangerArc.circumference -
          dangerArc.arcLength
        }`}
        transform={`rotate(${
          dangerStart - 90
        } ${center} ${center})`}
        opacity={0.8}
      />

      <Circle
        cx={center}
        cy={center}
        r={5}
        fill={COLORS.accent}
        opacity={0.8}
      />

      <Circle
        cx={center}
        cy={center}
        r={18}
        fill="none"
        stroke={COLORS.accent}
        strokeWidth={0.8}
        opacity={0.25}
      />
    </Svg>
  );
}