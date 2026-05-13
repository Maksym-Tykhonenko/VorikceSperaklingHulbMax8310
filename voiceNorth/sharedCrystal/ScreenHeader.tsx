import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { palette } from '../styleCurrent/palette';
import { typography } from '../styleCurrent/typography';
import { spacing } from '../styleCurrent/spacing';

type Props = {
  caption: string;
  title: string;
  leading?: React.ReactNode;
  trailing?: React.ReactNode;
};

export default function ScreenHeader({ caption, title, leading, trailing }: Props) {
  return (
    <View style={styles.shell}>
      {leading ? <View style={styles.leadingRow}>{leading}</View> : null}
      <View style={styles.titleRow}>
        <View style={styles.column}>
          <Text style={styles.caption}>{caption}</Text>
          <Text style={styles.title}>{title}</Text>
        </View>
        {trailing ? <View style={styles.trailing}>{trailing}</View> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  shell: {
    paddingTop: spacing.sm,
    paddingBottom: spacing.lg,
  },
  leadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  column: {
    flex: 1,
    minWidth: 0,
  },
  caption: {
    ...typography.caption,
    color: palette.arcticCyan,
    marginBottom: spacing.xs,
  },
  title: {
    ...typography.title,
    color: palette.bone,
  },
  trailing: {
    marginLeft: spacing.sm,
  },
});
