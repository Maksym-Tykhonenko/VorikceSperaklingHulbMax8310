import React from 'react';
import { View, Text, ScrollView, StyleSheet, Share, Animated, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import { Trophy, Share2, RotateCcw, BarChart3, Mic, Wind, Type } from 'lucide-react-native';
import BackPill from '../sharedCrystal/BackPill';
import FrostedPanel from '../sharedCrystal/FrostedPanel';
import GlowButton from '../sharedCrystal/GlowButton';
import StatPill from '../sharedCrystal/StatPill';
import { categoryByKey } from '../dataRelay/categoryRegistry';
import { speedByKey, SpeedKey } from '../dataRelay/speedRegistry';
import { sizeByKey, SizeKey } from '../dataRelay/sizeRegistry';
import { LibraryEntry } from '../dataRelay/libraryProvider';
import { palette } from '../styleCurrent/palette';
import { typography } from '../styleCurrent/typography';
import { spacing } from '../styleCurrent/spacing';
import { useFadeRise } from '../motionLayer/useFadeRise';
import { usePulseHalo } from '../motionLayer/usePulseHalo';

type Props = {
  entry: LibraryEntry;
  seconds: number;
  wordsRead: number;
  speed: SpeedKey;
  size: SizeKey;
  onBack: () => void;
  onTryAgain: () => void;
  onViewStats: () => void;
};

export default function PracticeResultPanel({ entry, seconds, wordsRead, speed, size, onBack, onTryAgain, onViewStats }: Props) {
  const insets = useSafeAreaInsets();
  const profile = categoryByKey(entry.categoryKey);
  const enter = useFadeRise({ delay: 80 });
  const pulse = usePulseHalo();
  const haloScale = pulse.interpolate({ inputRange: [0, 1], outputRange: [1, 1.1] });
  const haloOpacity = pulse.interpolate({ inputRange: [0, 1], outputRange: [0.5, 1] });

  const share = async () => {
    try {
      await Share.share({
        message: `I just practiced "${entry.title}" in ${formatClock(seconds)} with the Voice Hub teleprompter.`,
      });
    } catch {
      // swallow
    }
  };

  const speedTitle = speedByKey(speed).title;
  const sizeTitle = sizeByKey(size).title;

  return (
    <View style={styles.shell}>
      <View style={[styles.topRow, { paddingTop: insets.top + 8 }]}>
        <BackPill onPress={onBack} label="Back" />
      </View>
      <ScrollView contentContainerStyle={{ paddingHorizontal: spacing.pageGutter, paddingBottom: 160 }} showsVerticalScrollIndicator={false}>
        <Animated.View style={enter}>
          <View style={styles.heroWrap}>
            <Animated.View style={[styles.heroHalo, { opacity: haloOpacity, transform: [{ scale: haloScale }] }]} />
            <View style={styles.heroBubble}>
              <Trophy size={40} color={palette.abyss} strokeWidth={2.2} />
            </View>
            <Text style={styles.heroTitle}>Session Complete</Text>
            <Text style={styles.heroSubtitle}>You finished in {formatClock(seconds)}. Calm pace, clear voice.</Text>

            {profile ? (
              <View style={[styles.categoryChip, { backgroundColor: `${profile.accent}26` }]}>
                <Mic size={14} color={profile.accent} strokeWidth={2.4} />
                <Text style={[styles.categoryChipText, { color: profile.accent }]}>{profile.title}</Text>
              </View>
            ) : null}
          </View>

          <FrostedPanel style={{ marginBottom: 14 }}>
            <Text style={styles.metaLabel}>Text Practiced</Text>
            <Text style={styles.metaValue}>{entry.title}</Text>
          </FrostedPanel>

          <View style={styles.dualRow}>
            <StatPill value={formatClock(seconds)} label="Time" glyph={<Trophy size={18} color={palette.arcticCyan} />} />
            <StatPill value={speedTitle} label="Speed" accent={palette.fjordGreen} glyph={<Wind size={18} color={palette.fjordGreen} />} />
          </View>

          <View style={styles.dualRow}>
            <StatPill value={String(wordsRead)} label="Words Read" accent={palette.ember} glyph={<Mic size={18} color={palette.ember} />} />
            <StatPill value={sizeTitle} label="Text Size" glyph={<Type size={18} color={palette.arcticCyan} />} />
          </View>

          <FrostedPanel style={{ marginTop: 8 }} tone="ember">
            <Text style={styles.tipLabel}>Pro Tip</Text>
            <Text style={styles.tipText}>
              Try bumping up to Medium speed for the next session to challenge your delivery while keeping clear pacing.
            </Text>
          </FrostedPanel>

          <GlowButton
            label="Share"
            onPress={share}
            variant="frost"
            iconLeft={<Share2 size={18} color={palette.bone} />}
            style={{ marginTop: 16 }}
          />
          <GlowButton
            label="Try Again"
            onPress={onTryAgain}
            iconLeft={<RotateCcw size={18} color={palette.abyss} />}
            style={{ marginTop: 12 }}
          />
          <Pressable onPress={onViewStats} style={({ pressed }) => [styles.linkRow, pressed && { opacity: 0.7 }]}>
            <BarChart3 size={18} color={palette.arcticCyan} />
            <Text style={styles.linkText}>View Full Statistics</Text>
          </Pressable>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

function formatClock(seconds: number): string {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

const styles = StyleSheet.create({
  shell: { flex: 1 },
  topRow: {
    paddingHorizontal: spacing.pageGutter,
    paddingBottom: 12,
  },
  heroWrap: {
    alignItems: 'center',
    marginBottom: 18,
    paddingVertical: 22,
  },
  heroHalo: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 1,
    borderColor: palette.panelEdgeStrong,
    top: 6,
  },
  heroBubble: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: palette.polarMint,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: palette.arcticCyan,
    shadowOpacity: 0.6,
    shadowRadius: 22,
    shadowOffset: { width: 0, height: 0 },
  },
  heroTitle: {
    ...typography.title,
    color: palette.bone,
    marginTop: 14,
  },
  heroSubtitle: {
    ...typography.body,
    color: palette.fadedText,
    marginTop: 4,
    paddingHorizontal: 12,
    textAlign: 'center',
  },
  categoryChip: {
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    marginTop: 12,
  },
  categoryChipText: {
    ...typography.cardTitle,
    fontSize: 13,
  },
  metaLabel: {
    ...typography.caption,
    color: palette.fadedText,
    marginBottom: 6,
  },
  metaValue: {
    ...typography.cardTitle,
    color: palette.bone,
    fontSize: 17,
  },
  dualRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10,
  },
  tipLabel: {
    ...typography.caption,
    color: palette.ember,
    marginBottom: 6,
  },
  tipText: {
    ...typography.body,
    color: palette.mistText,
  },
  linkRow: {
    marginTop: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  linkText: {
    ...typography.cardTitle,
    color: palette.arcticCyan,
    fontSize: 14,
  },
});
