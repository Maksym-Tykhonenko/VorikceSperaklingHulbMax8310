import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import FrostedPanel from '../sharedCrystal/FrostedPanel';
import { CategoryProfile } from '../dataRelay/categoryRegistry';
import { RecordedSession } from '../storageBridge/sessionVault';
import { palette } from '../styleCurrent/palette';
import { typography } from '../styleCurrent/typography';
import { speedRegistry } from '../dataRelay/speedRegistry';
import { sizeRegistry } from '../dataRelay/sizeRegistry';
import { useFadeRise } from '../motionLayer/useFadeRise';

type Props = {
  profile: CategoryProfile;
  sessions: RecordedSession[];
  globalMax: number;
  delayIndex: number;
};

export default function CategoryBreakdownTile({ profile, sessions, globalMax, delayIndex }: Props) {
  const enter = useFadeRise({ delay: delayIndex * 100 });
  const Glyph = profile.glyph;
  const inCategory = sessions.filter(s => s.categoryKey === profile.key);
  const count = inCategory.length;
  const pct = globalMax === 0 ? 0 : Math.round((count / globalMax) * 100);

  const speedTitle = mostFrequent(inCategory.map(s => s.speedKey)) ?? 'medium';
  const sizeTitle = mostFrequent(inCategory.map(s => s.sizeKey)) ?? 'medium';
  const avgSeconds = inCategory.length ? Math.round(inCategory.reduce((a, b) => a + b.seconds, 0) / inCategory.length) : 0;

  const progress = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(progress, {
      toValue: pct / 100,
      duration: 620,
      delay: delayIndex * 100,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [pct, progress, delayIndex]);

  const widthInterpolated = progress.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] });

  const speedLabel = speedRegistry.find(s => s.key === speedTitle)?.title.toLowerCase() ?? 'medium';
  const sizeLabel = sizeRegistry.find(s => s.key === sizeTitle)?.title.toLowerCase() ?? 'medium';

  return (
    <Animated.View style={[enter, { marginBottom: 14 }]}>
      <FrostedPanel>
        <View style={styles.header}>
          <View style={[styles.glyph, { backgroundColor: `${profile.accent}26` }]}>
            <Glyph size={20} color={profile.accent} strokeWidth={2.2} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>{profile.title}</Text>
            <Text style={styles.subtitle}>{count} {count === 1 ? 'session' : 'sessions'}</Text>
          </View>
          <Text style={[styles.pct, { color: profile.accent }]}>{pct}%</Text>
        </View>
        <View style={styles.track}>
          <Animated.View style={[styles.fill, { backgroundColor: profile.accent, width: widthInterpolated }]} />
        </View>

        {count > 0 ? (
          <View style={styles.detailRow}>
            <Mini stat={speedLabel} caption="Fav Speed" accent={profile.accent} />
            <Mini stat={sizeLabel} caption="Fav Size" accent={profile.accent} />
            <Mini stat={`${avgSeconds}s`} caption="Avg Time" accent={profile.accent} />
          </View>
        ) : (
          <Text style={styles.emptyLine}>No sessions in this category yet</Text>
        )}
      </FrostedPanel>
    </Animated.View>
  );
}

function Mini({ stat, caption, accent }: { stat: string; caption: string; accent: string }) {
  return (
    <View style={styles.mini}>
      <Text style={[styles.miniStat, { color: accent }]} numberOfLines={1}>{stat}</Text>
      <Text style={styles.miniCaption}>{caption}</Text>
    </View>
  );
}

function mostFrequent<T extends string>(items: T[]): T | undefined {
  if (items.length === 0) return undefined;
  const counts = items.reduce<Record<string, number>>((acc, item) => {
    acc[item] = (acc[item] ?? 0) + 1;
    return acc;
  }, {});
  let best: T | undefined;
  let bestCount = 0;
  for (const [key, c] of Object.entries(counts)) {
    if (c > bestCount) {
      best = key as T;
      bestCount = c;
    }
  }
  return best;
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  glyph: {
    width: 40,
    height: 40,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    ...typography.cardTitle,
    color: palette.bone,
  },
  subtitle: {
    ...typography.body,
    color: palette.fadedText,
    fontSize: 12,
  },
  pct: {
    ...typography.title,
    fontSize: 20,
  },
  track: {
    height: 4,
    backgroundColor: 'rgba(94,188,255,0.12)',
    borderRadius: 4,
    marginTop: 12,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 4,
  },
  detailRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 14,
  },
  mini: {
    flex: 1,
    backgroundColor: 'rgba(20,38,70,0.65)',
    borderRadius: 12,
    padding: 10,
    alignItems: 'center',
  },
  miniStat: {
    ...typography.cardTitle,
    fontSize: 13,
    textTransform: 'capitalize',
  },
  miniCaption: {
    ...typography.caption,
    color: palette.fadedText,
    fontSize: 10,
    marginTop: 4,
  },
  emptyLine: {
    ...typography.body,
    color: palette.fadedText,
    marginTop: 10,
    fontSize: 12,
    textAlign: 'center',
  },
});
