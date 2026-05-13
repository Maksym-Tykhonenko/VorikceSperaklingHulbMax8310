import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, Animated } from 'react-native';
import PromptHomeView from './PromptHomeView';
import SetupPanel from './SetupPanel';
import TeleprompterView from './TeleprompterView';
import PracticeResultPanel from './PracticeResultPanel';
import { LibrarySnapshot, LibraryEntry } from '../dataRelay/libraryProvider';
import { RecordedSession } from '../storageBridge/sessionVault';
import { SpeedKey } from '../dataRelay/speedRegistry';
import { SizeKey } from '../dataRelay/sizeRegistry';
import { useCrossFade } from '../motionLayer/useCrossFade';

type Stage =
  | { kind: 'home' }
  | { kind: 'setup'; categoryKey: string }
  | { kind: 'live'; entry: LibraryEntry; speed: SpeedKey; size: SizeKey }
  | { kind: 'result'; entry: LibraryEntry; speed: SpeedKey; size: SizeKey; seconds: number; wordsRead: number };

type Props = {
  library: LibrarySnapshot;
  sessions: RecordedSession[];
  recordSession: (session: RecordedSession) => Promise<void>;
  goToStats: () => void;
  onLiveChange?: (live: boolean) => void;
};

export default function PracticeFlow({ library, sessions, recordSession, goToStats, onLiveChange }: Props) {
  const [stage, setStage] = useState<Stage>({ kind: 'home' });
  const fade = useCrossFade(stage.kind + ('categoryKey' in stage ? stage.categoryKey : ''), 320);

  useEffect(() => {
    onLiveChange?.(stage.kind === 'live');
  }, [stage.kind, onLiveChange]);

  const exitLive = useCallback(() => {
    if (stage.kind === 'live') {
      setStage({ kind: 'setup', categoryKey: stage.entry.categoryKey });
    }
  }, [stage]);

  const finishLive = useCallback(
    async ({ seconds, wordsRead }: { seconds: number; wordsRead: number; auto: boolean }) => {
      if (stage.kind !== 'live') return;
      const session: RecordedSession = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        textId: stage.entry.id,
        textTitle: stage.entry.title,
        categoryKey: stage.entry.categoryKey,
        speedKey: stage.speed,
        sizeKey: stage.size,
        seconds: Math.max(1, seconds),
        wordsRead: Math.max(1, wordsRead),
        finishedAt: Date.now(),
      };
      await recordSession(session);
      setStage({
        kind: 'result',
        entry: stage.entry,
        speed: stage.speed,
        size: stage.size,
        seconds: Math.max(1, seconds),
        wordsRead: Math.max(1, wordsRead),
      });
    },
    [stage, recordSession],
  );

  return (
    <Animated.View style={[styles.shell, fade]}>
      {stage.kind === 'home' && (
        <PromptHomeView
          library={library}
          sessions={sessions}
          onPickCategory={key => setStage({ kind: 'setup', categoryKey: key })}
        />
      )}
      {stage.kind === 'setup' && (
        <SetupPanel
          categoryKey={stage.categoryKey}
          library={library}
          onBack={() => setStage({ kind: 'home' })}
          onStart={config =>
            setStage({ kind: 'live', entry: config.entry, speed: config.speed, size: config.size })
          }
        />
      )}
      {stage.kind === 'live' && (
        <TeleprompterView
          entry={stage.entry}
          speed={stage.speed}
          size={stage.size}
          onExit={exitLive}
          onFinish={finishLive}
        />
      )}
      {stage.kind === 'result' && (
        <PracticeResultPanel
          entry={stage.entry}
          seconds={stage.seconds}
          wordsRead={stage.wordsRead}
          speed={stage.speed}
          size={stage.size}
          onBack={() => setStage({ kind: 'home' })}
          onTryAgain={() => setStage({ kind: 'setup', categoryKey: stage.entry.categoryKey })}
          onViewStats={goToStats}
        />
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  shell: { flex: 1 },
});
