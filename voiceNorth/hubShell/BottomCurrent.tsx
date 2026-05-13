import React, { useEffect, useRef } from 'react';
import { View, Text, Pressable, StyleSheet, Animated, Easing } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import { Mic, BarChart3, BookOpen, Bookmark, Lightbulb, ClipboardEdit } from 'lucide-react-native';
import { palette } from '../styleCurrent/palette';
import { typography } from '../styleCurrent/typography';

export type HubTabKey = 'practice' | 'stats' | 'blog' | 'saved' | 'tips' | 'workshop';

type Tab = {
  key: HubTabKey;
  label: string;
  glyph: typeof Mic;
};

const tabs: Tab[] = [
  { key: 'practice', label: 'Practice', glyph: Mic },
  { key: 'stats', label: 'Stats', glyph: BarChart3 },
  { key: 'blog', label: 'Blog', glyph: BookOpen },
  { key: 'saved', label: 'Saved', glyph: Bookmark },
  { key: 'tips', label: 'Tips', glyph: Lightbulb },
  { key: 'workshop', label: 'Workshop', glyph: ClipboardEdit },
];

type Props = {
  active: HubTabKey;
  onSelect: (key: HubTabKey) => void;
  hidden?: boolean;
};

export default function BottomCurrent({ active, onSelect, hidden = false }: Props) {
  const insets = useSafeAreaInsets();
  const reveal = useRef(new Animated.Value(hidden ? 0 : 1)).current;
  const [interactive, setInteractive] = React.useState(!hidden);

  useEffect(() => {
    if (!hidden) {
      setInteractive(true);
    }
    Animated.timing(reveal, {
      toValue: hidden ? 0 : 1,
      duration: hidden ? 320 : 360,
      easing: hidden ? Easing.in(Easing.cubic) : Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished && hidden) {
        setInteractive(false);
      }
    });
  }, [hidden, reveal]);

  const translateY = reveal.interpolate({ inputRange: [0, 1], outputRange: [120, 0] });
  const opacity = reveal.interpolate({ inputRange: [0, 1], outputRange: [0, 1] });

  return (
    <Animated.View
      pointerEvents={interactive ? 'box-none' : 'none'}
      style={[
        styles.shell,
        { paddingBottom: Math.max(insets.bottom, 10), opacity, transform: [{ translateY }] },
      ]}
    >
      <LinearGradient
        colors={['rgba(4,10,26,0)', 'rgba(4,10,26,0.95)']}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.bar}>
        {tabs.map(tab => (
          <NavBlock
            key={tab.key}
            tab={tab}
            active={active === tab.key}
            onPress={() => onSelect(tab.key)}
          />
        ))}
      </View>
    </Animated.View>
  );
}

function NavBlock({ tab, active, onPress }: { tab: Tab; active: boolean; onPress: () => void }) {
  const value = useRef(new Animated.Value(active ? 1 : 0)).current;
  useEffect(() => {
    Animated.timing(value, {
      toValue: active ? 1 : 0,
      duration: 260,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [active, value]);

  const indicatorWidth = value.interpolate({ inputRange: [0, 1], outputRange: [0, 22] });
  const iconColor = active ? palette.arcticCyan : palette.fadedText;
  const labelColor = active ? palette.arcticCyan : palette.fadedText;
  const Glyph = tab.glyph;

  return (
    <Pressable onPress={onPress} style={styles.block} hitSlop={6}>
      <Animated.View style={[styles.indicator, { width: indicatorWidth }]} />
      <Glyph size={20} color={iconColor} strokeWidth={active ? 2.6 : 2} />
      <Text
        style={[styles.label, { color: labelColor, opacity: active ? 1 : 0.85 }]}
        numberOfLines={1}
      >
        {tab.label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  shell: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingTop: 6,
  },
  bar: {
    flexDirection: 'row',
    paddingHorizontal: 2,
    paddingTop: 4,
  },
  block: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 2,
    gap: 3,
  },
  indicator: {
    height: 3,
    borderRadius: 3,
    backgroundColor: palette.arcticCyan,
    marginBottom: 4,
  },
  label: {
    ...typography.tabLabel,
    fontSize: 10,
  },
});
