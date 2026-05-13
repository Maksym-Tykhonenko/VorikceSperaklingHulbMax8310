import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Mic } from 'lucide-react-native';
import ScreenCanvas from '../sharedCrystal/ScreenCanvas';
import { palette } from '../styleCurrent/palette';
import { typography } from '../styleCurrent/typography';

type Props = {
  onFinish: () => void;
  duration?: number;
};

const STAGE = 260;
const RING_SIZES = [240, 184, 132];
const RING_SCALES = [1.05, 1.07, 1.09];
const MIC_DIAMETER = 96;
const BAR_COUNT = 9;
const BAR_WIDTH = 5;
const BAR_GAP = 6;
const BAR_HEIGHT = 36;
const BAR_BASE_SCALES = [0.35, 0.6, 0.45, 0.95, 0.65, 1.0, 0.55, 0.7, 0.4];

export default function LaunchWaveScreen({  duration = 3400 }: Props) {
  const insets = useSafeAreaInsets();
  const progress = useRef(new Animated.Value(0)).current;
  const ringPulses = useRef(RING_SIZES.map(() => new Animated.Value(0))).current;
  const micBreath = useRef(new Animated.Value(0)).current;
  const barPulses = useRef(Array.from({ length: BAR_COUNT }, () => new Animated.Value(0))).current;

  useEffect(() => {
    const progressAnim = Animated.timing(progress, {
      toValue: 1,
      duration,
      easing: Easing.bezier(0.4, 0, 0.2, 1),
      useNativeDriver: false,
    });
    

    const ringLoops = ringPulses.map((value, idx) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(idx * 220),
          Animated.timing(value, {
            toValue: 1,
            duration: 1700,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(value, {
            toValue: 0,
            duration: 1700,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
        ]),
      ),
    );
    ringLoops.forEach(loop => loop.start());

    const micLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(micBreath, {
          toValue: 1,
          duration: 1700,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(micBreath, {
          toValue: 0,
          duration: 1700,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ]),
    );
    micLoop.start();

    const barLoops = barPulses.map((value, idx) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(idx * 90),
          Animated.timing(value, {
            toValue: 1,
            duration: 620,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(value, {
            toValue: 0,
            duration: 620,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
        ]),
      ),
    );
    barLoops.forEach(loop => loop.start());

    return () => {
      progressAnim.stop();
      ringLoops.forEach(loop => loop.stop());
      micLoop.stop();
      barLoops.forEach(loop => loop.stop());
    };
  }, [barPulses, duration, micBreath, progress, ringPulses]);

  const progressWidth = progress.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] });
  const micScale = micBreath.interpolate({ inputRange: [0, 1], outputRange: [1, 1.04] });

  return (
    <ScreenCanvas>
      <View
        style={[
          styles.shell,
          { paddingTop: insets.top + 16, paddingBottom: Math.max(insets.bottom, 16) + 18 },
        ]}
      >
        <View style={styles.topFlex} />

        <View style={styles.contentBlock}>
          <View style={styles.stage}>
            {RING_SIZES.map((size, idx) => {
              const offset = (STAGE - size) / 2;
              const scale = ringPulses[idx].interpolate({
                inputRange: [0, 1],
                outputRange: [1, RING_SCALES[idx]],
              });
              const opacity = ringPulses[idx].interpolate({
                inputRange: [0, 1],
                outputRange: [0.32, 0.85],
              });
              return (
                <Animated.View
                  key={`ring-${idx}`}
                  pointerEvents="none"
                  style={[
                    styles.ring,
                    {
                      width: size,
                      height: size,
                      borderRadius: size / 2,
                      top: offset,
                      left: offset,
                      opacity,
                      transform: [{ scale }],
                    },
                  ]}
                />
              );
            })}

            <Animated.View style={[styles.glyph, { transform: [{ scale: micScale }] }]}>
              <Mic size={42} color={palette.abyss} strokeWidth={2.4} />
            </Animated.View>
          </View>

          <View style={styles.waveRow}>
            {barPulses.map((value, idx) => {
              const base = BAR_BASE_SCALES[idx % BAR_BASE_SCALES.length];
              const scaleY = value.interpolate({
                inputRange: [0, 1],
                outputRange: [base * 0.35, base],
              });
              return (
                <Animated.View
                  key={`bar-${idx}`}
                  style={[styles.waveBar, { transform: [{ scaleY }] }]}
                />
              );
            })}
          </View>

          <View style={styles.copy}>
            <Text style={styles.brand}>Voice Speaking Hub</Text>
            <Text style={styles.tag}>Warm up. Read aloud. Speak with calm.</Text>
          </View>
        </View>

        <View style={styles.bottomFlex} />

        <View style={styles.progressTrack}>
          <Animated.View style={[styles.progressFill, { width: progressWidth }]} />
        </View>
      </View>
    </ScreenCanvas>
  );
}

const styles = StyleSheet.create({
  shell: {
    flex: 1,
    paddingHorizontal: 32,
    alignItems: 'center',
  },
  topFlex: { flex: 0.45 },
  bottomFlex: { flex: 1 },
  contentBlock: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  stage: {
    width: STAGE,
    height: STAGE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ring: {
    position: 'absolute',
    borderWidth: 1,
    borderColor: palette.panelEdgeStrong,
  },
  glyph: {
    width: MIC_DIAMETER,
    height: MIC_DIAMETER,
    borderRadius: MIC_DIAMETER / 2,
    backgroundColor: palette.polarMint,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: palette.arcticCyan,
    shadowOpacity: 0.85,
    shadowRadius: 32,
    shadowOffset: { width: 0, height: 0 },
  },
  waveRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: BAR_COUNT * BAR_WIDTH + (BAR_COUNT - 1) * BAR_GAP,
    height: BAR_HEIGHT,
    marginTop: 14,
    gap: BAR_GAP,
  },
  waveBar: {
    width: BAR_WIDTH,
    height: BAR_HEIGHT,
    borderRadius: BAR_WIDTH,
    backgroundColor: palette.arcticCyan,
  },
  copy: {
    alignItems: 'center',
    marginTop: 24,
    paddingHorizontal: 12,
  },
  brand: {
    ...typography.title,
    color: palette.bone,
    textAlign: 'center',
  },
  tag: {
    ...typography.body,
    color: palette.mistText,
    textAlign: 'center',
    marginTop: 6,
  },
  progressTrack: {
    width: '100%',
    height: 4,
    borderRadius: 4,
    backgroundColor: 'rgba(94,188,255,0.18)',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: palette.arcticCyan,
    borderRadius: 4,
  },
});
