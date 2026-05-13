import React, { useCallback, useMemo, useState } from 'react';
import { Text, ScrollView, StyleSheet, Animated, Share } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BookmarkPlus } from 'lucide-react-native';
import ScreenHeader from '../sharedCrystal/ScreenHeader';
import EmptyHint from '../sharedCrystal/EmptyHint';
import GlowButton from '../sharedCrystal/GlowButton';
import ArticleCard from './ArticleCard';
import ArticleReader from './ArticleReader';
import { BlogEntry, blogCatalog } from '../dataRelay/blogProvider';
import { palette } from '../styleCurrent/palette';
import { typography } from '../styleCurrent/typography';
import { spacing } from '../styleCurrent/spacing';
import { useCrossFade } from '../motionLayer/useCrossFade';

export type ArticleMode = 'all' | 'saved';

type Props = {
  mode?: ArticleMode;
  favoriteIds: number[];
  onToggleFavorite: (id: number) => void;
  onBrowseAll?: () => void;
};

export default function ArticleNestScreen({ mode = 'all', favoriteIds, onToggleFavorite, onBrowseAll }: Props) {
  const insets = useSafeAreaInsets();
  const articles = useMemo(() => blogCatalog(), []);
  const [openId, setOpenId] = useState<number | null>(null);
  const fade = useCrossFade(`${mode}-${openId ?? 'list'}`, 320);

  const sortedAll = useMemo(() => {
    const fav = articles.filter(a => favoriteIds.includes(a.id));
    const others = articles.filter(a => !favoriteIds.includes(a.id));
    return [...fav, ...others];
  }, [articles, favoriteIds]);

  const savedList = useMemo(
    () => articles.filter(a => favoriteIds.includes(a.id)),
    [articles, favoriteIds],
  );

  const shareEntry = useCallback(async (entry: BlogEntry) => {
    try {
      await Share.share({ message: `${entry.title}\n\n${entry.content}` });
    } catch {
      // ignore
    }
  }, []);

  if (openId !== null) {
    const found = articles.find(a => a.id === openId);
    if (found) {
      return (
        <Animated.View style={[styles.shell, fade]}>
          <ArticleReader
            entry={found}
            isFavorite={favoriteIds.includes(found.id)}
            onBack={() => setOpenId(null)}
            onToggleFavorite={() => onToggleFavorite(found.id)}
          />
        </Animated.View>
      );
    }
  }

  const isSavedMode = mode === 'saved';
  const featured = !isSavedMode && sortedAll.length > 0 ? sortedAll[0] : null;
  const listForRender = isSavedMode ? savedList : sortedAll.filter(a => a.id !== featured?.id);

  return (
    <Animated.View style={[styles.shell, fade]}>
      <ScrollView
        contentContainerStyle={[styles.content, { paddingTop: insets.top + 6, paddingBottom: 140 }]}
        showsVerticalScrollIndicator={false}
      >
        <ScreenHeader
          caption={isSavedMode ? 'Your Library' : 'Knowledge Hub'}
          title={isSavedMode ? 'Saved Articles' : 'Blog'}
        />

        {isSavedMode && savedList.length === 0 ? (
          <EmptyHint
            glyph={<BookmarkPlus size={32} color={palette.arcticCyan} strokeWidth={2.2} />}
            title="No saved articles yet"
            description="Tap the heart on any article you'd like to revisit. They will appear here for quick access."
            action={
              onBrowseAll ? <GlowButton label="Browse Articles" onPress={onBrowseAll} /> : undefined
            }
          />
        ) : null}

        {featured ? (
          <ArticleCard
            entry={featured}
            delayIndex={0}
            isFavorite={favoriteIds.includes(featured.id)}
            onOpen={() => setOpenId(featured.id)}
            onShare={() => shareEntry(featured)}
            onToggleFavorite={() => onToggleFavorite(featured.id)}
            variant="featured"
          />
        ) : null}

        {listForRender.length > 0 ? (
          <Text style={styles.sectionTitle}>
            {isSavedMode ? `${savedList.length} saved` : 'All Articles'}
          </Text>
        ) : null}

        {listForRender.map((entry, index) => (
          <ArticleCard
            key={entry.id}
            entry={entry}
            delayIndex={featured ? index + 1 : index}
            isFavorite={favoriteIds.includes(entry.id)}
            onOpen={() => setOpenId(entry.id)}
            onShare={() => shareEntry(entry)}
            onToggleFavorite={() => onToggleFavorite(entry.id)}
          />
        ))}
      </ScrollView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  shell: { flex: 1 },
  content: {
    paddingHorizontal: spacing.pageGutter,
  },
  sectionTitle: {
    ...typography.caption,
    color: palette.fadedText,
    marginTop: 14,
    marginBottom: 12,
  },
});
