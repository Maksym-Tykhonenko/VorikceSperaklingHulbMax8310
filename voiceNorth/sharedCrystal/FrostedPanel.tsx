import React from 'react';
import { View, ViewStyle, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { palette } from '../styleCurrent/palette';
import { radii } from '../styleCurrent/spacing';

type Props = {
  children: React.ReactNode;
  style?: ViewStyle | ViewStyle[];
  tone?: 'default' | 'accent' | 'ember';
};

export default function FrostedPanel({ children, style, tone = 'default' }: Props) {
  const colors =
    tone === 'accent'
      ? ['rgba(94,188,255,0.18)', 'rgba(20,38,70,0.55)']
      : tone === 'ember'
      ? ['rgba(255,179,71,0.22)', 'rgba(20,38,70,0.55)']
      : ['rgba(20,38,70,0.72)', 'rgba(10,20,40,0.55)'];
  return (
    <View style={[styles.shell, style]}>
      <LinearGradient
        colors={colors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.border} pointerEvents="none" />
      <View style={styles.inner}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  shell: {
    borderRadius: radii.lg,
    overflow: 'hidden',
    backgroundColor: palette.panelInk,
  },
  border: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: palette.panelEdge,
  },
  inner: {
    padding: 16,
  },
});
