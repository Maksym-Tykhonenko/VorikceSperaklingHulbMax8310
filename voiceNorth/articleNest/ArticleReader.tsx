import React from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable, Share, Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Share2, Heart } from 'lucide-react-native';
import BackPill from '../sharedCrystal/BackPill';
import SectionChip from '../sharedCrystal/SectionChip';
import GlowButton from '../sharedCrystal/GlowButton';
import { BlogEntry } from '../dataRelay/blogProvider';
import { palette } from '../styleCurrent/palette';
import { typography } from '../styleCurrent/typography';
import { spacing } from '../styleCurrent/spacing';
import { useFadeRise } from '../motionLayer/useFadeRise';

type Props = {
  entry: BlogEntry;
  isFavorite: boolean;
  onBack: () => void;
  onToggleFavorite: () => void;
};

export default function ArticleReader({ entry, isFavorite, onBack, onToggleFavorite }: Props) {
  const insets = useSafeAreaInsets();
  const enter = useFadeRise({ delay: 60 });
  const share = async () => {
    try {
      await Share.share({
        message: `${entry.title}\n\n${entry.content}`,
      });
    } catch {
      // ignore
    }
  };
  return (
    <View style={styles.shell}>
      <View style={[styles.topRow, { paddingTop: insets.top + 8 }]}>
        <BackPill onPress={onBack} label="Back" />
        <View style={styles.topActions}>
          <Pressable onPress={share} hitSlop={10} style={styles.topAction}>
            <Share2 size={18} color={palette.bone} strokeWidth={2.2} />
          </Pressable>
          <Pressable onPress={onToggleFavorite} hitSlop={10} style={[styles.topAction, isFavorite && styles.favOn]}>
            <Heart size={18} color={isFavorite ? palette.ember : palette.bone} fill={isFavorite ? palette.ember : 'transparent'} />
          </Pressable>
        </View>
      </View>
      <ScrollView contentContainerStyle={[styles.body, { paddingBottom: insets.bottom + 140 }]} showsVerticalScrollIndicator={false}>
        <Animated.View style={enter}>
          <SectionChip label={`${entry.tone} · ${entry.minutes} min read`} />
          <Text style={styles.title}>{entry.title}</Text>
          <Text style={styles.meta}>{entry.publishedLabel}</Text>
          <Text style={styles.content}>{entry.content}</Text>
          <GlowButton
            label={isFavorite ? 'Saved' : 'Save'}
            variant={isFavorite ? 'ember' : 'frost'}
            iconLeft={<Heart size={18} color={isFavorite ? palette.abyss : palette.bone} fill={isFavorite ? palette.abyss : 'transparent'} />}
            onPress={onToggleFavorite}
            style={{ marginTop: 24 }}
          />
          <GlowButton
            label="Share Article"
            onPress={share}
            iconLeft={<Share2 size={18} color={palette.abyss} />}
            style={{ marginTop: 12 }}
          />
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  shell: { flex: 1 },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.pageGutter,
    paddingBottom: 12,
  },
  topActions: {
    flexDirection: 'row',
    gap: 10,
  },
  topAction: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(20,38,70,0.65)',
    borderWidth: 1,
    borderColor: palette.panelEdge,
    justifyContent: 'center',
    alignItems: 'center',
  },
  favOn: {
    backgroundColor: 'rgba(255,179,71,0.18)',
    borderColor: 'rgba(255,179,71,0.5)',
  },
  body: {
    paddingHorizontal: 22,
    paddingTop: 8,
  },
  title: {
    ...typography.title,
    color: palette.bone,
    marginTop: 12,
  },
  meta: {
    ...typography.body,
    color: palette.fadedText,
    marginTop: 4,
    marginBottom: 18,
    fontSize: 12,
  },
  content: {
    ...typography.body,
    color: palette.mistText,
    fontSize: 15,
    lineHeight: 24,
  },
});
