import React, { useMemo, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable, Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Check, Play } from 'lucide-react-native';
import BackPill from '../sharedCrystal/BackPill';
import FrostedPanel from '../sharedCrystal/FrostedPanel';
import GlowButton from '../sharedCrystal/GlowButton';
import { categoryByKey } from '../dataRelay/categoryRegistry';
import { speedRegistry, SpeedKey } from '../dataRelay/speedRegistry';
import { sizeRegistry, SizeKey } from '../dataRelay/sizeRegistry';
import { LibrarySnapshot, LibraryEntry } from '../dataRelay/libraryProvider';
import { palette } from '../styleCurrent/palette';
import { typography } from '../styleCurrent/typography';
import { spacing } from '../styleCurrent/spacing';
import { usePressShrink } from '../motionLayer/usePressShrink';
import { useFadeRise } from '../motionLayer/useFadeRise';

type Props = {
  categoryKey: string;
  library: LibrarySnapshot;
  onBack: () => void;
  onStart: (config: { entry: LibraryEntry; speed: SpeedKey; size: SizeKey }) => void;
};

export default function SetupPanel({ categoryKey, library, onBack, onStart }: Props) {
  const insets = useSafeAreaInsets();
  const profile = categoryByKey(categoryKey);
  const entries = library.byCategory[categoryKey] ?? [];
  const [selectedId, setSelectedId] = useState<string>(entries[0]?.id ?? '');
  const [speed, setSpeed] = useState<SpeedKey>('medium');
  const [size, setSize] = useState<SizeKey>('medium');

  const selected = useMemo(() => entries.find(item => item.id === selectedId) ?? entries[0], [entries, selectedId]);
  const enter = useFadeRise({ delay: 80 });

  if (!profile) {
    return null;
  }

  const handleStart = () => {
    if (!selected) return;
    onStart({ entry: selected, speed, size });
  };

  return (
    <View style={styles.shell}>
      <View style={[styles.topRow, { paddingTop: insets.top + 8 }]}>
        <BackPill onPress={onBack} label={profile.title} />
      </View>
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: spacing.pageGutter, paddingBottom: 140 }}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={enter}>
          <Text style={styles.heading}>Setup your session</Text>
          <Text style={styles.subheading}>Pick a text, set the pace, and choose your reading size.</Text>

          <Text style={styles.sectionTitle}>Select Text</Text>
          {entries.length === 0 ? (
            <FrostedPanel style={{ marginBottom: 18 }}>
              <Text style={styles.emptyLine}>No texts in this category yet. Add one from the Workshop tab.</Text>
            </FrostedPanel>
          ) : (
            entries.map(entry => (
              <TextOption
                key={entry.id}
                entry={entry}
                accent={profile.accent}
                isActive={selected?.id === entry.id}
                onPress={() => setSelectedId(entry.id)}
              />
            ))
          )}

          <Text style={styles.sectionTitle}>Reading Speed</Text>
          <View style={styles.tripleRow}>
            {speedRegistry.map(opt => {
              const Glyph = opt.glyph;
              return (
                <OptionTile
                  key={opt.key}
                  isActive={speed === opt.key}
                  onPress={() => setSpeed(opt.key)}
                  accent={profile.accent}
                  title={opt.title}
                  hint={opt.hint}
                  badge={<Glyph size={20} color={speed === opt.key ? palette.abyss : profile.accent} strokeWidth={2.4} />}
                />
              );
            })}
          </View>

          <Text style={styles.sectionTitle}>Text Size</Text>
          <View style={styles.tripleRow}>
            {sizeRegistry.map(opt => (
              <OptionTile
                key={opt.key}
                isActive={size === opt.key}
                onPress={() => setSize(opt.key)}
                accent={profile.accent}
                title={opt.title}
                hint={opt.hint}
                badge={<Text style={[styles.sizeGlyph, { color: size === opt.key ? palette.abyss : profile.accent }]}>{opt.glyph}</Text>}
              />
            ))}
          </View>

          <Text style={styles.sectionTitle}>Your Setup</Text>
          <FrostedPanel style={{ marginBottom: 18 }} tone="accent">
            <View style={styles.summaryRow}>
              <SummaryChip label={selected?.title ?? '—'} />
              <SummaryChip label={`${speedLabel(speed)} speed`} />
            </View>
            <View style={styles.summaryRow}>
              <SummaryChip label={`${sizeLabel(size)} text`} />
            </View>
          </FrostedPanel>
        </Animated.View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 14) + 80 }]}>
        <GlowButton
          label="Start Teleprompter"
          onPress={handleStart}
          disabled={!selected}
          iconLeft={<Play size={18} color={palette.abyss} fill={palette.abyss} />}
        />
      </View>
    </View>
  );
}

function speedLabel(key: SpeedKey): string {
  return speedRegistry.find(s => s.key === key)?.title ?? key;
}

function sizeLabel(key: SizeKey): string {
  return sizeRegistry.find(s => s.key === key)?.title ?? key;
}

function SummaryChip({ label }: { label: string }) {
  return (
    <View style={styles.summaryChip}>
      <Text style={styles.summaryChipText} numberOfLines={1}>{label}</Text>
    </View>
  );
}

function TextOption({
  entry,
  accent,
  isActive,
  onPress,
}: {
  entry: LibraryEntry;
  accent: string;
  isActive: boolean;
  onPress: () => void;
}) {
  const press = usePressShrink(0.98);
  return (
    <Animated.View style={press.style}>
      <Pressable onPress={onPress} onPressIn={press.onPressIn} onPressOut={press.onPressOut} style={{ marginBottom: 10 }}>
        <FrostedPanel style={isActive ? { borderColor: accent } : undefined}>
          <View style={styles.optionRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.optionTitle}>{entry.title}</Text>
              <Text style={styles.optionMeta}>{entry.isCustom ? 'Custom · ' : 'Default · '}{wordCount(entry.body)} words</Text>
            </View>
            <View style={[styles.checkBubble, { borderColor: isActive ? accent : palette.panelEdge, backgroundColor: isActive ? accent : 'transparent' }]}>
              {isActive ? <Check size={14} color={palette.abyss} strokeWidth={3} /> : null}
            </View>
          </View>
        </FrostedPanel>
      </Pressable>
    </Animated.View>
  );
}

function OptionTile({
  isActive,
  onPress,
  accent,
  title,
  hint,
  badge,
}: {
  isActive: boolean;
  onPress: () => void;
  accent: string;
  title: string;
  hint: string;
  badge: React.ReactNode;
}) {
  const press = usePressShrink(0.96);
  return (
    <Animated.View style={[press.style, { flex: 1 }]}>
      <Pressable onPress={onPress} onPressIn={press.onPressIn} onPressOut={press.onPressOut} style={styles.tile}>
        <View
          style={[
            styles.tileBody,
            {
              backgroundColor: isActive ? accent : 'rgba(20,38,70,0.65)',
              borderColor: isActive ? accent : palette.panelEdge,
            },
          ]}
        >
          <View style={[styles.tileBadge, { backgroundColor: isActive ? 'rgba(255,255,255,0.18)' : `${accent}26` }]}>
            {badge}
          </View>
          <Text style={[styles.tileTitle, { color: isActive ? palette.abyss : palette.bone }]}>{title}</Text>
          <Text style={[styles.tileHint, { color: isActive ? 'rgba(4,10,26,0.65)' : palette.fadedText }]} numberOfLines={2}>
            {hint}
          </Text>
        </View>
      </Pressable>
    </Animated.View>
  );
}

function wordCount(text: string): number {
  return text.split(/\s+/).filter(Boolean).length;
}

const styles = StyleSheet.create({
  shell: { flex: 1 },
  topRow: {
    paddingHorizontal: spacing.pageGutter,
    paddingBottom: 18,
  },
  heading: {
    ...typography.title,
    color: palette.bone,
    marginBottom: 4,
  },
  subheading: {
    ...typography.body,
    color: palette.fadedText,
    marginBottom: 22,
  },
  sectionTitle: {
    ...typography.caption,
    color: palette.arcticCyan,
    marginTop: 6,
    marginBottom: 12,
  },
  emptyLine: {
    ...typography.body,
    color: palette.fadedText,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  optionTitle: {
    ...typography.cardTitle,
    color: palette.bone,
  },
  optionMeta: {
    ...typography.body,
    color: palette.fadedText,
    fontSize: 12,
  },
  checkBubble: {
    width: 26,
    height: 26,
    borderRadius: 13,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  tripleRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 18,
  },
  tile: {
    flex: 1,
  },
  tileBody: {
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 12,
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    minHeight: 130,
  },
  tileBadge: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  tileTitle: {
    ...typography.cardTitle,
    fontSize: 15,
  },
  tileHint: {
    ...typography.body,
    fontSize: 11,
    textAlign: 'center',
  },
  sizeGlyph: {
    fontSize: 18,
    fontWeight: '800',
  },
  summaryRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 6,
  },
  summaryChip: {
    backgroundColor: 'rgba(94,188,255,0.18)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  summaryChipText: {
    ...typography.cardTitle,
    color: palette.bone,
    fontSize: 13,
  },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: spacing.pageGutter,
  },
});
