import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { categoryRegistry } from '../dataRelay/categoryRegistry';
import { palette } from '../styleCurrent/palette';
import { typography } from '../styleCurrent/typography';
import { RecordedSession } from '../storageBridge/sessionVault';

type Props = {
  sessions: RecordedSession[];
};

const BAR_LABELS = ['Public', 'Emotional', 'Diction'];

export default function SessionChart({ sessions }: Props) {
  const counts = categoryRegistry.map(c => sessions.filter(s => s.categoryKey === c.key).length);
  const max = Math.max(1, ...counts);
  const animated = useRef(counts.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    Animated.stagger(
      120,
      animated.map((value, idx) =>
        Animated.timing(value, {
          toValue: counts[idx] / max,
          duration: 540,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: false,
        }),
      ),
    ).start();
  }, [animated, counts, max]);

  return (
    <View style={styles.shell}>
      <View style={styles.yAxis}>
        {[max, Math.ceil(max * 0.66), Math.ceil(max * 0.33), 0].map((value, idx) => (
          <Text key={idx} style={styles.tick}>{value}</Text>
        ))}
      </View>
      <View style={styles.bars}>
        {categoryRegistry.map((profile, idx) => {
          const heightStyle = animated[idx].interpolate({
            inputRange: [0, 1],
            outputRange: ['4%', '100%'],
          });
          return (
            <View key={profile.key} style={styles.barCol}>
              <View style={styles.barWrap}>
                <Animated.View style={[styles.bar, { backgroundColor: profile.accent, height: heightStyle }]} />
              </View>
              <Text style={styles.barLabel}>{BAR_LABELS[idx]}</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  shell: {
    height: 180,
    flexDirection: 'row',
    paddingHorizontal: 4,
  },
  yAxis: {
    justifyContent: 'space-between',
    paddingVertical: 4,
    paddingRight: 8,
    height: '85%',
  },
  tick: {
    ...typography.body,
    color: palette.fadedText,
    fontSize: 12,
  },
  bars: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
  },
  barCol: {
    flex: 1,
    alignItems: 'center',
    height: '100%',
    justifyContent: 'flex-end',
  },
  barWrap: {
    flex: 1,
    width: 32,
    justifyContent: 'flex-end',
    marginBottom: 6,
  },
  bar: {
    width: '100%',
    borderRadius: 8,
  },
  barLabel: {
    ...typography.caption,
    color: palette.fadedText,
    fontSize: 10,
  },
});
