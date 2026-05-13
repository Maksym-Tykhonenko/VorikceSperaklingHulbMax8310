import React from 'react';
import { Pressable, View, Text, StyleSheet, Animated } from 'react-native';
import { Share2, Heart } from 'lucide-react-native';
import FrostedPanel from '../sharedCrystal/FrostedPanel';
import SectionChip from '../sharedCrystal/SectionChip';
import { BlogEntry } from '../dataRelay/blogProvider';
import { palette } from '../styleCurrent/palette';
import { typography } from '../styleCurrent/typography';
import { usePressShrink } from '../motionLayer/usePressShrink';
import { useFadeRise } from '../motionLayer/useFadeRise';

type Props = {
  entry: BlogEntry;
  delayIndex: number;
  isFavorite: boolean;
  onOpen: () => void;
  onShare: () => void;
  onToggleFavorite: () => void;
  variant?: 'standard' | 'featured';
};

export default function ArticleCard({ entry, delayIndex, isFavorite, onOpen, onShare, onToggleFavorite, variant = 'standard' }: Props) {
  const press = usePressShrink(0.98);
  const enter = useFadeRise({ delay: delayIndex * 60 });
  const featured = variant === 'featured';

  return (
    <Animated.View style={[press.style, enter, { marginBottom: 12 }]}>
      <Pressable onPress={onOpen} onPressIn={press.onPressIn} onPressOut={press.onPressOut}>
        <FrostedPanel tone={featured ? 'accent' : 'default'}>
          {featured ? <SectionChip label="✦ Featured" tone="cyan" /> : null}
          <View style={[featured ? styles.bodyFeatured : styles.bodyDefault]}>
            <View style={styles.topMeta}>
              <SectionChip label={entry.tone} tone={mapTone(entry.tone)} />
            </View>
            <Text style={[styles.title, featured && styles.titleFeatured]} numberOfLines={2}>
              {entry.title}
            </Text>
            <Text style={styles.excerpt} numberOfLines={2}>
              {entry.excerpt}
            </Text>
            <View style={styles.bottomRow}>
              <Text style={styles.meta}>{entry.publishedLabel} · {entry.minutes} min read</Text>
              <View style={styles.actionsRow}>
                <Pressable onPress={onShare} hitSlop={12} style={styles.actionBubble}>
                  <Share2 size={16} color={palette.bone} strokeWidth={2.2} />
                </Pressable>
                <Pressable onPress={onToggleFavorite} hitSlop={12} style={[styles.actionBubble, isFavorite && styles.favOn]}>
                  <Heart
                    size={16}
                    color={isFavorite ? palette.ember : palette.bone}
                    strokeWidth={2.2}
                    fill={isFavorite ? palette.ember : 'transparent'}
                  />
                </Pressable>
              </View>
            </View>
          </View>
        </FrostedPanel>
      </Pressable>
    </Animated.View>
  );
}

function mapTone(tone: BlogEntry['tone']): 'cyan' | 'ember' | 'mint' | 'muted' {
  if (tone === 'Foundation') return 'mint';
  if (tone === 'Mindset' || tone === 'Voice') return 'ember';
  if (tone === 'Practice') return 'muted';
  return 'cyan';
}

const styles = StyleSheet.create({
  bodyDefault: {
    gap: 6,
  },
  bodyFeatured: {
    gap: 8,
    marginTop: 8,
  },
  topMeta: {
    marginBottom: 2,
  },
  title: {
    ...typography.cardTitle,
    color: palette.bone,
    fontSize: 16,
  },
  titleFeatured: {
    fontSize: 19,
    lineHeight: 24,
  },
  excerpt: {
    ...typography.body,
    color: palette.fadedText,
    fontSize: 13,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  meta: {
    ...typography.body,
    color: palette.whisperText,
    fontSize: 11,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  actionBubble: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(94,188,255,0.12)',
    borderWidth: 1,
    borderColor: palette.panelEdge,
    justifyContent: 'center',
    alignItems: 'center',
  },
  favOn: {
    backgroundColor: 'rgba(255,179,71,0.18)',
    borderColor: 'rgba(255,179,71,0.5)',
  },
});
