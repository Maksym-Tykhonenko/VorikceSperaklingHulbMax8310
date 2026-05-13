import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import FrostedPanel from './FrostedPanel';
import { palette } from '../styleCurrent/palette';
import { typography } from '../styleCurrent/typography';

type Props = {
  glyph: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
};

export default function EmptyHint({ glyph, title, description, action }: Props) {
  return (
    <FrostedPanel style={styles.shell}>
      <View style={styles.inner}>
        <View style={styles.icon}>{glyph}</View>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
        {action ? <View style={styles.action}>{action}</View> : null}
      </View>
    </FrostedPanel>
  );
}

const styles = StyleSheet.create({
  shell: {
    marginBottom: 14,
  },
  inner: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  icon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(94,188,255,0.12)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    ...typography.sectionTitle,
    color: palette.bone,
    marginBottom: 4,
    textAlign: 'center',
  },
  description: {
    ...typography.body,
    color: palette.fadedText,
    textAlign: 'center',
    paddingHorizontal: 12,
  },
  action: {
    marginTop: 14,
    alignSelf: 'stretch',
  },
});
