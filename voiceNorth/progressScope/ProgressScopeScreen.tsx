import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Mic, Timer, CheckCircle2, BarChart3 } from 'lucide-react-native';
import ScreenHeader from '../sharedCrystal/ScreenHeader';
import StatPill from '../sharedCrystal/StatPill';
import FrostedPanel from '../sharedCrystal/FrostedPanel';
import EmptyHint from '../sharedCrystal/EmptyHint';
import GlowButton from '../sharedCrystal/GlowButton';
import SessionChart from './SessionChart';
import CategoryBreakdownTile from './CategoryBreakdownTile';
import { categoryRegistry } from '../dataRelay/categoryRegistry';
import { RecordedSession } from '../storageBridge/sessionVault';
import { palette } from '../styleCurrent/palette';
import { typography } from '../styleCurrent/typography';
import { spacing } from '../styleCurrent/spacing';

type Props = {
  sessions: RecordedSession[];
  goToPractice: () => void;
};

export default function ProgressScopeScreen({ sessions, goToPractice }: Props) {
  const insets = useSafeAreaInsets();
  const totalSessions = sessions.length;
  const totalTimeSeconds = sessions.reduce((a, b) => a + b.seconds, 0);
  const totalCompleted = sessions.length;

  const globalMax = Math.max(0, ...categoryRegistry.map(c => sessions.filter(s => s.categoryKey === c.key).length));

  return (
    <ScrollView
      style={styles.shell}
      contentContainerStyle={[styles.content, { paddingTop: insets.top + 6, paddingBottom: 140 }]}
      showsVerticalScrollIndicator={false}
    >
      <ScreenHeader caption="Your Progress" title="Statistics" />

      <View style={styles.row}>
        <StatPill value={String(totalSessions)} label="Sessions" glyph={<Mic size={18} color={palette.arcticCyan} />} />
        <StatPill
          value={formatDurationCompact(totalTimeSeconds)}
          label="Time"
          accent={palette.ember}
          glyph={<Timer size={18} color={palette.ember} />}
        />
        <StatPill
          value={String(totalCompleted)}
          label="Completed"
          accent={palette.fjordGreen}
          glyph={<CheckCircle2 size={18} color={palette.fjordGreen} />}
        />
      </View>

      {totalSessions === 0 ? (
        <EmptyHint
          glyph={<BarChart3 size={32} color={palette.arcticCyan} strokeWidth={2.2} />}
          title="No sessions yet"
          description="Finish a teleprompter session to start tracking your progress here."
          action={<GlowButton label="Start Practicing" onPress={goToPractice} />}
        />
      ) : (
        <>
          <Text style={styles.sectionTitle}>Sessions by Category</Text>
          <FrostedPanel style={{ marginBottom: 22 }}>
            <SessionChart sessions={sessions} />
          </FrostedPanel>
        </>
      )}

      <Text style={styles.sectionTitle}>Category Breakdown</Text>
      {categoryRegistry.map((profile, index) => (
        <CategoryBreakdownTile
          key={profile.key}
          profile={profile}
          sessions={sessions}
          globalMax={globalMax}
          delayIndex={index}
        />
      ))}
    </ScrollView>
  );
}

function formatDurationCompact(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  if (m < 60) return `${m}m ${s.toString().padStart(2, '0')}s`;
  const h = Math.floor(m / 60);
  const mm = m % 60;
  return `${h}h ${mm}m`;
}

const styles = StyleSheet.create({
  shell: { flex: 1 },
  content: {
    paddingHorizontal: spacing.pageGutter,
  },
  row: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 22,
  },
  sectionTitle: {
    ...typography.caption,
    color: palette.fadedText,
    marginBottom: 12,
    marginTop: 4,
  },
});
