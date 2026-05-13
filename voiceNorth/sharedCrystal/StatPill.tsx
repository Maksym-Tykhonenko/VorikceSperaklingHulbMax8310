import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import FrostedPanel from './FrostedPanel';
import { palette } from '../styleCurrent/palette';
import { typography } from '../styleCurrent/typography';

type Props = {
  value: string;
  label: string;
  accent?: string;
  glyph?: React.ReactNode;
};

export default function StatPill({ value, label, accent = palette.arcticCyan, glyph }: Props) {
  return (
    <FrostedPanel style={styles.shell}>
      <View style={styles.inner}>
        {glyph ? <View style={[styles.icon, { backgroundColor: 'rgba(94,188,255,0.14)' }]}>{glyph}</View> : null}
        <Text style={[styles.value, { color: accent }]} numberOfLines={1} adjustsFontSizeToFit>
          {value}
        </Text>
        <Text style={styles.label} numberOfLines={1}>{label}</Text>
      </View>
    </FrostedPanel>
  );
}

const styles = StyleSheet.create({
  shell: {
    flex: 1,
  },
  inner: {
    alignItems: 'center',
    gap: 6,
  },
  icon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 2,
  },
  value: {
    ...typography.title,
    fontSize: 22,
  },
  label: {
    ...typography.body,
    color: palette.fadedText,
    fontSize: 12,
  },
});
