import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { palette } from '../styleCurrent/palette';
import { typography } from '../styleCurrent/typography';

type Props = {
  label: string;
  tone?: 'cyan' | 'ember' | 'mint' | 'muted';
};

export default function SectionChip({ label, tone = 'cyan' }: Props) {
  const palettePicked =
    tone === 'ember'
      ? { bg: 'rgba(255,179,71,0.18)', fg: palette.ember }
      : tone === 'mint'
      ? { bg: 'rgba(66,214,166,0.18)', fg: palette.fjordGreen }
      : tone === 'muted'
      ? { bg: 'rgba(126,146,182,0.20)', fg: palette.mistText }
      : { bg: 'rgba(94,188,255,0.18)', fg: palette.arcticCyan };
  return (
    <View style={[styles.shell, { backgroundColor: palettePicked.bg }]}>
      <Text style={[styles.text, { color: palettePicked.fg }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  shell: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  text: {
    ...typography.caption,
    fontSize: 11,
    letterSpacing: 0.4,
  },
});
