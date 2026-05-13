import React, { useCallback, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ClipboardEdit } from 'lucide-react-native';
import ScreenHeader from '../sharedCrystal/ScreenHeader';
import FrostedPanel from '../sharedCrystal/FrostedPanel';
import CategoryCard from '../sharedCrystal/CategoryCard';
import ForgeCategoryPanel from './ForgeCategoryPanel';
import { categoryRegistry } from '../dataRelay/categoryRegistry';
import { LibrarySnapshot } from '../dataRelay/libraryProvider';
import { palette } from '../styleCurrent/palette';
import { typography } from '../styleCurrent/typography';
import { spacing } from '../styleCurrent/spacing';
import { useCrossFade } from '../motionLayer/useCrossFade';

type Props = {
  library: LibrarySnapshot;
  onCreate: (data: { title: string; body: string; categoryKey: string }) => Promise<void>;
  onDelete: (id: string, isCustom: boolean) => Promise<void>;
};

export default function ScriptForgeScreen({ library, onCreate, onDelete }: Props) {
  const insets = useSafeAreaInsets();
  const [openCategory, setOpenCategory] = useState<string | null>(null);
  const fade = useCrossFade(openCategory ?? 'list', 300);

  const back = useCallback(() => setOpenCategory(null), []);

  if (openCategory) {
    return (
      <Animated.View style={[styles.shell, fade]}>
        <ForgeCategoryPanel
          categoryKey={openCategory}
          library={library}
          onBack={back}
          onCreate={onCreate}
          onDelete={onDelete}
        />
      </Animated.View>
    );
  }

  return (
    <Animated.View style={[styles.shell, fade]}>
      <ScrollView
        contentContainerStyle={[styles.content, { paddingTop: insets.top + 6, paddingBottom: 140 }]}
        showsVerticalScrollIndicator={false}
      >
        <ScreenHeader caption="Your Library" title="Text Workshop" />

        <FrostedPanel style={{ marginBottom: 16 }} tone="ember">
          <View style={styles.introRow}>
            <View style={styles.introGlyph}>
              <ClipboardEdit size={22} color={palette.ember} strokeWidth={2.2} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.introTitle}>Manage Texts</Text>
              <Text style={styles.introBody}>
                Add your own speeches and scripts. Organize them by category, delete any text.
              </Text>
            </View>
          </View>
        </FrostedPanel>

        <Text style={styles.sectionTitle}>Categories</Text>
        {categoryRegistry.map((profile, index) => {
          const inCategory = library.byCategory[profile.key] ?? [];
          const customCount = inCategory.filter(item => item.isCustom).length;
          return (
            <CategoryCard
              key={profile.key}
              profile={profile}
              primaryLine={`${inCategory.length} ${inCategory.length === 1 ? 'text' : 'texts'}`}
              secondaryLine={`${customCount} custom`}
              onPress={() => setOpenCategory(profile.key)}
              delayIndex={index}
            />
          );
        })}
      </ScrollView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  shell: { flex: 1 },
  content: {
    paddingHorizontal: spacing.pageGutter,
  },
  introRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  introGlyph: {
    width: 50,
    height: 50,
    borderRadius: 16,
    backgroundColor: 'rgba(255,179,71,0.22)',
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
  sectionTitle: {
    ...typography.caption,
    color: palette.fadedText,
    marginBottom: 12,
  },
});
