import React from 'react';
import { View, Text, Pressable, StyleSheet, Animated, Share } from 'react-native';
import { Share2 } from 'lucide-react-native';
import FrostedPanel from '../sharedCrystal/FrostedPanel';
import SectionChip from '../sharedCrystal/SectionChip';
import { TipEntry } from '../dataRelay/tipsProvider';
import { palette } from '../styleCurrent/palette';
import { typography } from '../styleCurrent/typography';
import { useFadeRise } from '../motionLayer/useFadeRise';

type Props = {
  entry: TipEntry;
  index: number;
};

export default function TipTile({ entry, index }: Props) {
  const enter = useFadeRise({ delay: index * 70 });
  const Glyph = entry.glyph;

  const share = async () => {
    try {
      await Share.share({
        message: `Speaking tip — ${entry.title}\n\n${entry.content}`,
      });
    } catch {
      // ignore
    }
  };

  const formattedNumber = String(index + 1).padStart(2, '0');

  return (
    <Animated.View style={[enter, { marginBottom: 12 }]}>
      <FrostedPanel>
        <View style={styles.header}>
          <View style={styles.glyph}>
            <Glyph size={22} color={palette.arcticCyan} strokeWidth={2.2} />
          </View>
          <View style={{ flex: 1 }}>
            <SectionChip label={entry.tone} />
          </View>
          <View style={styles.number}>
            <Text style={styles.numberText}>{formattedNumber}</Text>
          </View>
        </View>

        <Text style={styles.title}>{entry.title}</Text>
        <Text style={styles.body}>{entry.content}</Text>

        <Pressable onPress={share} style={({ pressed }) => [styles.shareBubble, pressed && { opacity: 0.8 }]}>
          <Share2 size={14} color={palette.arcticCyan} strokeWidth={2.4} />
          <Text style={styles.shareText}>Share Tip</Text>
        </Pressable>
      </FrostedPanel>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 10,
  },
  glyph: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: 'rgba(94,188,255,0.16)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  number: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: 'rgba(94,188,255,0.18)',
  },
  numberText: {
    ...typography.caption,
    color: palette.arcticCyan,
    fontSize: 11,
  },
  title: {
    ...typography.cardTitle,
    color: palette.bone,
    fontSize: 16,
    marginBottom: 6,
  },
  body: {
    ...typography.body,
    color: palette.mistText,
    lineHeight: 21,
  },
  shareBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(94,188,255,0.18)',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
    gap: 6,
    marginTop: 12,
  },
  shareText: {
    ...typography.caption,
    color: palette.arcticCyan,
    fontSize: 12,
  },
});
