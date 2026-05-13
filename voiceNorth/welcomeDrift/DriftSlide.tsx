import React from 'react';
import { View, Text, ImageBackground, StyleSheet, Animated, Pressable } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Mic } from 'lucide-react-native';
import { palette } from '../styleCurrent/palette';
import { typography } from '../styleCurrent/typography';
import { useFadeRise } from '../motionLayer/useFadeRise';
import GlowButton from '../sharedCrystal/GlowButton';
import { DriftEntry } from './driftCopy';

type Props = {
  entry: DriftEntry;
  index: number;
  total: number;
  onNext: () => void;
  onSkip: () => void;
  visible: boolean;
};

const accentMap: Record<DriftEntry['accent'], string[]> = {
  cyan: ['#9DE7FF', '#5EBCFF'],
  cyanBright: ['#7CD3FF', '#3E9DFF'],
  mint: ['#9CF5C8', '#42D6A6'],
  ember: ['#FFD27E', '#FFB347'],
  emberDeep: ['#FFB07C', '#FF8A3D'],
};

const bgImage = require('../../slidsobrnigm/nordic_aurora.png');

export default function DriftSlide({ entry, index, total, onNext, onSkip, visible }: Props) {
  const insets = useSafeAreaInsets();
  const enter = useFadeRise({ delay: 80, enabled: visible });
  const Glyph = entry.glyph;
  const variant = entry.accent === 'ember' || entry.accent === 'emberDeep' ? 'ember' : 'primary';
  const gradient = accentMap[entry.accent];

  return (
    <View style={styles.shell}>
      <ImageBackground source={bgImage} style={StyleSheet.absoluteFill} resizeMode="cover" blurRadius={0}>
        <LinearGradient
          colors={['rgba(4,10,26,0.55)', 'rgba(4,10,26,0.78)', 'rgba(4,10,26,0.96)']}
          locations={[0, 0.55, 1]}
          style={StyleSheet.absoluteFill}
        />
      </ImageBackground>

      <View style={[styles.topBar, { paddingTop: insets.top + 10 }]}>
        <View style={styles.badgeRow}>
          <View style={styles.brandBubble}>
            <Mic size={14} color={palette.arcticCyan} strokeWidth={2.6} />
          </View>
          <Text style={styles.brand}>VoiceFlow</Text>
        </View>
        <Pressable onPress={onSkip} hitSlop={10} style={styles.skipPill}>
          <Text style={styles.skipText}>Skip</Text>
        </Pressable>
      </View>

      <Animated.View style={[styles.content, enter, { paddingBottom: insets.bottom + 26 }]}>
        <View style={[styles.glyphBubble, { backgroundColor: `${gradient[1]}26`, borderColor: `${gradient[1]}59` }]}>
          <Glyph size={30} color={gradient[1]} strokeWidth={2.2} />
        </View>

        <View style={[styles.chip, { backgroundColor: `${gradient[1]}26` }]}>
          <Text style={[styles.chipText, { color: gradient[1] }]}>{entry.badge.toUpperCase()}</Text>
        </View>

        <Text style={styles.title}>{entry.title}</Text>
        <Text style={styles.description}>{entry.description}</Text>

        <View style={styles.dotsRow}>
          {Array.from({ length: total }).map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                i === index && [styles.dotActive, { backgroundColor: gradient[1] }],
              ]}
            />
          ))}
        </View>

        <GlowButton
          label={entry.cta}
          variant={variant}
          onPress={onNext}
          style={styles.cta}
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  shell: {
    flex: 1,
    backgroundColor: palette.abyss,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
    backgroundColor: 'rgba(20,38,70,0.65)',
    borderWidth: 1,
    borderColor: palette.panelEdge,
  },
  brandBubble: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: 'rgba(94,188,255,0.16)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  brand: {
    ...typography.cardTitle,
    color: palette.bone,
    fontSize: 14,
  },
  skipPill: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 999,
    backgroundColor: 'rgba(20,38,70,0.65)',
    borderWidth: 1,
    borderColor: palette.panelEdge,
  },
  skipText: {
    ...typography.cardTitle,
    color: palette.mistText,
    fontSize: 13,
  },
  content: {
    marginTop: 'auto',
    paddingHorizontal: 28,
    gap: 14,
  },
  glyphBubble: {
    width: 64,
    height: 64,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    marginBottom: 4,
  },
  chip: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  chipText: {
    ...typography.caption,
    fontSize: 11,
  },
  title: {
    ...typography.hero,
    color: palette.bone,
  },
  description: {
    ...typography.body,
    color: palette.mistText,
    fontSize: 15,
    lineHeight: 22,
    marginTop: 2,
    paddingRight: 12,
  },
  dotsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 14,
    marginBottom: 8,
  },
  dot: {
    width: 22,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.18)',
  },
  dotActive: {
    width: 30,
  },
  cta: {
    marginTop: 4,
  },
});
