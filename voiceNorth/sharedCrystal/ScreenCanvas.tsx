import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { palette } from '../styleCurrent/palette';

type Props = {
  children: React.ReactNode;
  style?: ViewStyle | ViewStyle[];
};

export default function ScreenCanvas({ children, style }: Props) {
  return (
    <View style={[styles.shell, style]}>
      <LinearGradient
        colors={[palette.abyss, palette.midnightCove, palette.glacierBay]}
        locations={[0, 0.5, 1]}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.haloUpper} pointerEvents="none">
        <LinearGradient
          colors={['rgba(94,188,255,0.22)', 'rgba(94,188,255,0)']}
          style={StyleSheet.absoluteFill}
        />
      </View>
      <View style={styles.haloLower} pointerEvents="none">
        <LinearGradient
          colors={['rgba(94,188,255,0)', 'rgba(94,188,255,0.10)']}
          style={StyleSheet.absoluteFill}
        />
      </View>
      <View style={styles.children}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  shell: {
    flex: 1,
    backgroundColor: palette.abyss,
  },
  haloUpper: {
    position: 'absolute',
    top: -120,
    left: -60,
    right: -60,
    height: 320,
    borderRadius: 280,
    opacity: 0.95,
  },
  haloLower: {
    position: 'absolute',
    bottom: -180,
    left: -80,
    right: -80,
    height: 360,
    borderRadius: 280,
  },
  children: {
    flex: 1,
  },
});
