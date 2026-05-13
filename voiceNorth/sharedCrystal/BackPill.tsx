import React from 'react';
import { Pressable, Text, View, StyleSheet, Animated } from 'react-native';
import { ChevronLeft } from 'lucide-react-native';
import { palette } from '../styleCurrent/palette';
import { typography } from '../styleCurrent/typography';
import { usePressShrink } from '../motionLayer/usePressShrink';

type Props = {
  label?: string;
  onPress: () => void;
  tone?: 'default' | 'overlay';
};

export default function BackPill({ label = 'Back', onPress, tone = 'default' }: Props) {
  const press = usePressShrink(0.94);
  return (
    <Animated.View style={press.style}>
      <Pressable onPress={onPress} onPressIn={press.onPressIn} onPressOut={press.onPressOut} style={styles.shell}>
        <View
          style={[
            styles.bubble,
            tone === 'overlay' && styles.overlay,
          ]}
        >
          <ChevronLeft size={18} color={palette.bone} strokeWidth={2.4} />
          <Text style={styles.text}>{label}</Text>
        </View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  shell: {
    alignSelf: 'flex-start',
  },
  bubble: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
    backgroundColor: 'rgba(20,38,70,0.65)',
    borderWidth: 1,
    borderColor: palette.panelEdge,
    gap: 4,
  },
  overlay: {
    backgroundColor: 'rgba(4,10,26,0.65)',
  },
  text: {
    ...typography.cardTitle,
    color: palette.bone,
    fontSize: 14,
  },
});
