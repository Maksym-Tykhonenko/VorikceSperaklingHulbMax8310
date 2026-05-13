import React from 'react';
import { Pressable, Text, View, StyleSheet, ViewStyle, Animated } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { palette } from '../styleCurrent/palette';
import { radii, elevations } from '../styleCurrent/spacing';
import { typography } from '../styleCurrent/typography';
import { usePressShrink } from '../motionLayer/usePressShrink';

type Variant = 'primary' | 'ember' | 'ghost' | 'frost';

type Props = {
  label: string;
  onPress?: () => void;
  variant?: Variant;
  disabled?: boolean;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  style?: ViewStyle | ViewStyle[];
};

export default function GlowButton({ label, onPress, variant = 'primary', disabled, iconLeft, iconRight, style }: Props) {
  const press = usePressShrink(0.97);
  const gradient =
    variant === 'ember'
      ? ['#FFD27E', '#FF8A3D']
      : variant === 'frost'
      ? ['rgba(94,188,255,0.32)', 'rgba(94,188,255,0.08)']
      : variant === 'ghost'
      ? ['rgba(94,188,255,0.0)', 'rgba(94,188,255,0.0)']
      : ['#9DE7FF', '#5EBCFF'];
  const labelColor = variant === 'ghost' || variant === 'frost' ? palette.bone : palette.abyss;
  const shadow = variant === 'ember' ? elevations.ember : variant === 'ghost' ? undefined : elevations.strong;
  return (
    <Animated.View style={[press.style, style]}>
      <Pressable
        onPress={onPress}
        onPressIn={press.onPressIn}
        onPressOut={press.onPressOut}
        disabled={disabled}
        style={({ pressed }) => [
          styles.shell,
          shadow,
          disabled && styles.disabled,
          pressed && styles.pressed,
        ]}
      >
        <LinearGradient colors={gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFill} />
        {variant === 'ghost' && <View style={styles.ghostBorder} pointerEvents="none" />}
        {variant === 'frost' && <View style={styles.frostBorder} pointerEvents="none" />}
        <View style={styles.row}>
          {iconLeft ? <View style={styles.icon}>{iconLeft}</View> : null}
          <Text style={[styles.label, { color: labelColor }]}>{label}</Text>
          {iconRight ? <View style={styles.icon}>{iconRight}</View> : null}
        </View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  shell: {
    height: 54,
    borderRadius: radii.pill,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 22,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  label: {
    ...typography.cardTitle,
    fontWeight: '700',
  },
  icon: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  ghostBorder: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: palette.panelEdgeStrong,
  },
  frostBorder: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: palette.panelEdgeStrong,
  },
  disabled: {
    opacity: 0.5,
  },
  pressed: {
    opacity: 0.92,
  },
});
