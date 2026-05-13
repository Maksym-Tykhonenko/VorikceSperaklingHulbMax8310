import React, { useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Library } from 'lucide-react-native';
import ScreenHeader from '../sharedCrystal/ScreenHeader';
import FrostedPanel from '../sharedCrystal/FrostedPanel';
import TipTile from './TipTile';
import { tipsCatalog } from '../dataRelay/tipsProvider';
import { palette } from '../styleCurrent/palette';
import { typography } from '../styleCurrent/typography';
import { spacing } from '../styleCurrent/spacing';

export default function GuidanceCardsScreen() {
  const insets = useSafeAreaInsets();
  const tips = useMemo(() => tipsCatalog(), []);

  return (
    <ScrollView
      style={styles.shell}
      contentContainerStyle={[styles.content, { paddingTop: insets.top + 6, paddingBottom: 140 }]}
      showsVerticalScrollIndicator={false}
    >
      <ScreenHeader caption="Daily Practice" title="Speaking Tips" />

      <FrostedPanel style={styles.intro} tone="accent">
        <View style={styles.introRow}>
          <View style={styles.introBubble}>
            <Library size={22} color={palette.arcticCyan} strokeWidth={2.2} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.introTitle}>{tips.length} Expert Tips</Text>
            <Text style={styles.introBody}>
              Actionable techniques curated for speech coaches and self-paced practice.
            </Text>
          </View>
        </View>
      </FrostedPanel>

      {tips.map((entry, index) => (
        <TipTile key={entry.id} entry={entry} index={index} />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  shell: { flex: 1 },
  content: {
    paddingHorizontal: spacing.pageGutter,
  },
  intro: {
    marginBottom: 16,
  },
  introRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  introBubble: {
    width: 50,
    height: 50,
    borderRadius: 16,
    backgroundColor: 'rgba(94,188,255,0.18)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  introTitle: {
    ...typography.cardTitle,
    color: palette.bone,
    fontSize: 16,
  },
  introBody: {
    ...typography.body,
    color: palette.fadedText,
    fontSize: 13,
    marginTop: 2,
  },
});
