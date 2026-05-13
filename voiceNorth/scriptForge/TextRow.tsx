import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, Animated } from 'react-native';
import { Trash2, ChevronDown, ChevronUp } from 'lucide-react-native';
import FrostedPanel from '../sharedCrystal/FrostedPanel';
import SectionChip from '../sharedCrystal/SectionChip';
import { LibraryEntry } from '../dataRelay/libraryProvider';
import { palette } from '../styleCurrent/palette';
import { typography } from '../styleCurrent/typography';
import { useFadeRise } from '../motionLayer/useFadeRise';

type Props = {
  entry: LibraryEntry;
  index: number;
  onDelete: () => void;
};

export default function TextRow({ entry, index, onDelete }: Props) {
  const enter = useFadeRise({ delay: index * 60 });
  const [expanded, setExpanded] = useState(false);
  const words = entry.body.split(/\s+/).filter(Boolean).length;
  const chipTone = entry.isCustom ? 'ember' : 'cyan';
  return (
    <Animated.View style={[enter, { marginBottom: 12 }]}>
      <FrostedPanel>
        <View style={styles.row}>
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>{entry.title}</Text>
            <Text style={styles.excerpt} numberOfLines={expanded ? undefined : 2}>
              {entry.body}
            </Text>
          </View>
          <Pressable onPress={onDelete} hitSlop={10} style={styles.deleteBubble}>
            <Trash2 size={16} color={palette.rubyRed} strokeWidth={2.2} />
          </Pressable>
        </View>
        <View style={styles.footer}>
          <Pressable onPress={() => setExpanded(prev => !prev)} hitSlop={6} style={styles.readMoreRow}>
            <Text style={styles.readMore}>{expanded ? 'Show less' : 'Read more'}</Text>
            {expanded ? (
              <ChevronUp size={14} color={palette.arcticCyan} strokeWidth={2.4} />
            ) : (
              <ChevronDown size={14} color={palette.arcticCyan} strokeWidth={2.4} />
            )}
          </Pressable>
          <View style={styles.footerRight}>
            <Text style={styles.meta}>{words} words</Text>
            <SectionChip label={entry.isCustom ? 'Custom' : 'Default'} tone={chipTone} />
          </View>
        </View>
      </FrostedPanel>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  title: {
    ...typography.cardTitle,
    color: palette.bone,
    fontSize: 16,
    marginBottom: 4,
  },
  excerpt: {
    ...typography.body,
    color: palette.fadedText,
    fontSize: 13,
  },
  deleteBubble: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,107,123,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255,107,123,0.35)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  readMoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  readMore: {
    ...typography.cardTitle,
    color: palette.arcticCyan,
    fontSize: 13,
  },
  footerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  meta: {
    ...typography.body,
    color: palette.fadedText,
    fontSize: 12,
  },
});
