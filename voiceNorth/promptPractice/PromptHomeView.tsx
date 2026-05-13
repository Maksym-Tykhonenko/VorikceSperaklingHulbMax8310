import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Sparkles, Flame, ClipboardList } from 'lucide-react-native';
import ScreenHeader from '../sharedCrystal/ScreenHeader';
import StatPill from '../sharedCrystal/StatPill';
import CategoryCard from '../sharedCrystal/CategoryCard';
import { categoryRegistry } from '../dataRelay/categoryRegistry';
import { LibrarySnapshot } from '../dataRelay/libraryProvider';
import { RecordedSession } from '../storageBridge/sessionVault';
import { palette } from '../styleCurrent/palette';
import { typography } from '../styleCurrent/typography';
import { spacing } from '../styleCurrent/spacing';

type Props = {
  library: LibrarySnapshot;
  sessions: RecordedSession[];
  onPickCategory: (key: string) => void;
};

export default function PromptHomeView({ library, sessions, onPickCategory }: Props) {
  const insets = useSafeAreaInsets();
  const totalSessions = sessions.length;
  const categoriesUsed = new Set(sessions.map(s => s.categoryKey)).size;
  const practicedTexts = new Set(sessions.map(s => s.textId)).size;

  return (
    <ScrollView
      style={styles.shell}
      contentContainerStyle={[styles.content, { paddingTop: insets.top + 6, paddingBottom: 120 }]}
      showsVerticalScrollIndicator={false}
    >
      <ScreenHeader caption={greetingCaption()} title="Teleprompter" />

      <View style={styles.streakRow}>
        <StatPill
          value={String(totalSessions)}
          label="Total Sessions"
          glyph={<ClipboardList size={18} color={palette.arcticCyan} />}
        />
        <StatPill
          value={String(categoriesUsed)}
          label="Categories"
          glyph={<Sparkles size={18} color={palette.fjordGreen} />}
          accent={palette.fjordGreen}
        />
        <StatPill
          value={String(practicedTexts)}
          label="Practiced Texts"
          glyph={<Flame size={18} color={palette.ember} />}
          accent={palette.ember}
        />
      </View>

      <Text style={styles.sectionTitle}>Choose a Category</Text>

      {categoryRegistry.map((profile, index) => {
        const inCategory = library.byCategory[profile.key] ?? [];
        const customCount = inCategory.filter(item => item.isCustom).length;
        const totalForCategory = inCategory.length;
        const completedInCategory = sessions.filter(s => s.categoryKey === profile.key).length;
        return (
          <CategoryCard
            key={profile.key}
            profile={profile}
            primaryLine={`${totalForCategory} ${totalForCategory === 1 ? 'text' : 'texts'}`}
            secondaryLine={completedInCategory > 0 ? `${completedInCategory} done` : customCount > 0 ? `${customCount} custom` : 'Ready to read'}
            onPress={() => onPickCategory(profile.key)}
            delayIndex={index}
          />
        );
      })}
    </ScrollView>
  );
}

function greetingCaption(): string {
  const hour = new Date().getHours();
  if (hour < 5) return 'Calm late night, Speaker';
  if (hour < 12) return 'Good morning, Speaker';
  if (hour < 17) return 'Good afternoon, Speaker';
  if (hour < 22) return 'Good evening, Speaker';
  return 'Calm late night, Speaker';
}

const styles = StyleSheet.create({
  shell: {
    flex: 1,
  },
  content: {
    paddingHorizontal: spacing.pageGutter,
  },
  streakRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 22,
    marginTop: 4,
    paddingHorizontal: 0,
  },
  sectionTitle: {
    ...typography.caption,
    color: palette.fadedText,
    marginBottom: 12,
    marginTop: 4,
  },
});
