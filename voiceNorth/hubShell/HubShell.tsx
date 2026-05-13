import React, { useCallback, useEffect, useState } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import ScreenCanvas from '../sharedCrystal/ScreenCanvas';
import BottomCurrent, { HubTabKey } from './BottomCurrent';
import PracticeFlow from '../promptPractice/PracticeFlow';
import ProgressScopeScreen from '../progressScope/ProgressScopeScreen';
import ArticleNestScreen from '../articleNest/ArticleNestScreen';
import GuidanceCardsScreen from '../guidanceCards/GuidanceCardsScreen';
import ScriptForgeScreen from '../scriptForge/ScriptForgeScreen';
import { LibrarySnapshot, loadLibrarySnapshot } from '../dataRelay/libraryProvider';
import { RecordedSession, appendSession, loadSessions } from '../storageBridge/sessionVault';
import { loadFavoriteArticleIds, toggleFavoriteArticle } from '../storageBridge/favoritesVault';
import { appendCustomEntry, LibraryRecord, markDefaultRemoved, removeCustomEntry } from '../storageBridge/libraryVault';
import { useCrossFade } from '../motionLayer/useCrossFade';

export default function HubShell() {
  const [active, setActive] = useState<HubTabKey>('practice');
  const [library, setLibrary] = useState<LibrarySnapshot>({ all: [], byCategory: {}, customCount: 0, defaultCount: 0 });
  const [sessions, setSessions] = useState<RecordedSession[]>([]);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [practiceLive, setPracticeLive] = useState(false);
  const tabFade = useCrossFade(active, 300);

  useEffect(() => {
    let mounted = true;
    Promise.all([loadLibrarySnapshot(), loadSessions(), loadFavoriteArticleIds()]).then(
      ([lib, recorded, favs]) => {
        if (!mounted) return;
        setLibrary(lib);
        setSessions(recorded);
        setFavorites(favs);
      },
    );
    return () => {
      mounted = false;
    };
  }, []);

  const refreshLibrary = useCallback(async () => {
    const next = await loadLibrarySnapshot();
    setLibrary(next);
  }, []);

  const recordSession = useCallback(async (session: RecordedSession) => {
    const next = await appendSession(session);
    setSessions(next);
  }, []);

  const handleToggleFavorite = useCallback(async (id: number) => {
    const next = await toggleFavoriteArticle(id);
    setFavorites(next);
  }, []);

  const handleCreateText = useCallback(
    async ({ title, body, categoryKey }: { title: string; body: string; categoryKey: string }) => {
      const record: LibraryRecord = {
        id: `custom-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        categoryKey,
        title,
        excerpt: body.slice(0, 120),
        body,
        isCustom: true,
        createdAt: Date.now(),
      };
      await appendCustomEntry(record);
      await refreshLibrary();
    },
    [refreshLibrary],
  );

  const handleDelete = useCallback(
    async (id: string, isCustom: boolean) => {
      if (isCustom) {
        await removeCustomEntry(id);
      } else {
        await markDefaultRemoved(id);
      }
      await refreshLibrary();
    },
    [refreshLibrary],
  );

  return (
    <ScreenCanvas>
      <View style={styles.shell}>
        <Animated.View style={[styles.content, tabFade]}>
          {active === 'practice' && (
            <PracticeFlow
              library={library}
              sessions={sessions}
              recordSession={recordSession}
              goToStats={() => setActive('stats')}
              onLiveChange={setPracticeLive}
            />
          )}
          {active === 'stats' && (
            <ProgressScopeScreen
              sessions={sessions}
              goToPractice={() => setActive('practice')}
            />
          )}
          {active === 'blog' && (
            <ArticleNestScreen
              mode="all"
              favoriteIds={favorites}
              onToggleFavorite={handleToggleFavorite}
            />
          )}
          {active === 'saved' && (
            <ArticleNestScreen
              mode="saved"
              favoriteIds={favorites}
              onToggleFavorite={handleToggleFavorite}
              onBrowseAll={() => setActive('blog')}
            />
          )}
          {active === 'tips' && <GuidanceCardsScreen />}
          {active === 'workshop' && (
            <ScriptForgeScreen
              library={library}
              onCreate={handleCreateText}
              onDelete={handleDelete}
            />
          )}
        </Animated.View>
        <BottomCurrent
          active={active}
          onSelect={setActive}
          hidden={active === 'practice' && practiceLive}
        />
      </View>
    </ScreenCanvas>
  );
}

const styles = StyleSheet.create({
  shell: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
});
