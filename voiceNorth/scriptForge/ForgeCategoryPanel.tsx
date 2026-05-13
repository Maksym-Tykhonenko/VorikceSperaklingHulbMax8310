import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable, Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Plus, Sparkles } from 'lucide-react-native';
import BackPill from '../sharedCrystal/BackPill';
import FrostedPanel from '../sharedCrystal/FrostedPanel';
import StatPill from '../sharedCrystal/StatPill';
import EmptyHint from '../sharedCrystal/EmptyHint';
import GlowButton from '../sharedCrystal/GlowButton';
import TextRow from './TextRow';
import ForgeAddSheet from './ForgeAddSheet';
import { categoryByKey } from '../dataRelay/categoryRegistry';
import { LibrarySnapshot } from '../dataRelay/libraryProvider';
import { palette } from '../styleCurrent/palette';
import { typography } from '../styleCurrent/typography';
import { spacing } from '../styleCurrent/spacing';
import { usePressShrink } from '../motionLayer/usePressShrink';

type Props = {
  categoryKey: string;
  library: LibrarySnapshot;
  onBack: () => void;
  onCreate: (data: { title: string; body: string; categoryKey: string }) => Promise<void>;
  onDelete: (id: string, isCustom: boolean) => Promise<void>;
};

export default function ForgeCategoryPanel({ categoryKey, library, onBack, onCreate, onDelete }: Props) {
  const insets = useSafeAreaInsets();
  const profile = categoryByKey(categoryKey);
  const entries = library.byCategory[categoryKey] ?? [];
  const customCount = entries.filter(item => item.isCustom).length;
  const defaultCount = entries.length - customCount;
  const [sheetOpen, setSheetOpen] = useState(false);
  const addPress = usePressShrink(0.94);

  if (!profile) return null;

  return (
    <View style={styles.shell}>
      <View style={[styles.topRow, { paddingTop: insets.top + 8 }]}>
        <BackPill onPress={onBack} label="Workshop" />
        <Animated.View style={addPress.style}>
          <Pressable
            onPress={() => setSheetOpen(true)}
            onPressIn={addPress.onPressIn}
            onPressOut={addPress.onPressOut}
            style={styles.addBubble}
          >
            <Plus size={16} color={palette.abyss} strokeWidth={2.8} />
            <Text style={styles.addText}>Add Text</Text>
          </Pressable>
        </Animated.View>
      </View>
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 120 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.titleRow}>
          <View style={[styles.glyph, { backgroundColor: `${profile.accent}26` }]}>
            <Sparkles size={18} color={profile.accent} strokeWidth={2.4} />
          </View>
          <Text style={styles.title}>{profile.title}</Text>
        </View>
        <Text style={styles.subtitle}>{profile.description}</Text>

        <View style={styles.statsRow}>
          <StatPill value={String(entries.length)} label="Total Texts" />
          <StatPill value={String(defaultCount)} label="Default" accent={palette.fjordGreen} />
          <StatPill value={String(customCount)} label="Custom" accent={palette.ember} />
        </View>

        {entries.length === 0 ? (
          <EmptyHint
            glyph={<Plus size={28} color={palette.arcticCyan} strokeWidth={2.2} />}
            title="No texts here yet"
            description="Add a new script to start practicing inside this category."
            action={<GlowButton label="Add Text" onPress={() => setSheetOpen(true)} iconLeft={<Plus size={18} color={palette.abyss} strokeWidth={2.6} />} />}
          />
        ) : (
          entries.map((entry, index) => (
            <TextRow
              key={entry.id}
              entry={entry}
              index={index}
              onDelete={() => onDelete(entry.id, entry.isCustom)}
            />
          ))
        )}

        {entries.length > 0 ? (
          <FrostedPanel style={{ marginTop: 4 }} tone="accent">
            <Text style={styles.summaryTitle}>Library Tip</Text>
            <Text style={styles.summaryBody}>
              Removed default texts stay hidden across sessions. Add a custom script for personalised practice.
            </Text>
          </FrostedPanel>
        ) : null}
      </ScrollView>

      {sheetOpen ? (
        <ForgeAddSheet
          onCancel={() => setSheetOpen(false)}
          onSave={async ({ title, body }) => {
            await onCreate({ title, body, categoryKey });
            setSheetOpen(false);
          }}
        />
      ) : null}
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
  addBubble: {
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: palette.arcticCyan,
  },
  addText: {
    ...typography.cardTitle,
    color: palette.abyss,
    fontSize: 13,
  },
  content: {
    paddingHorizontal: spacing.pageGutter,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 4,
  },
  glyph: {
    width: 36,
    height: 36,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    ...typography.title,
    color: palette.bone,
  },
  subtitle: {
    ...typography.body,
    color: palette.fadedText,
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 18,
  },
  summaryTitle: {
    ...typography.caption,
    color: palette.arcticCyan,
    marginBottom: 6,
  },
  summaryBody: {
    ...typography.body,
    color: palette.mistText,
    fontSize: 13,
  },
});
