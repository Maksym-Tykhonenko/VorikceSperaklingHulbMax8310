import React from 'react';
import { Pressable, View, Text, StyleSheet, Animated } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import FrostedPanel from './FrostedPanel';
import { palette } from '../styleCurrent/palette';
import { typography } from '../styleCurrent/typography';
import { CategoryProfile } from '../dataRelay/categoryRegistry';
import { usePressShrink } from '../motionLayer/usePressShrink';
import { useFadeRise } from '../motionLayer/useFadeRise';

type Props = {
  profile: CategoryProfile;
  primaryLine: string;
  secondaryLine?: string;
  onPress: () => void;
  delayIndex?: number;
};

export default function CategoryCard({ profile, primaryLine, secondaryLine, onPress, delayIndex = 0 }: Props) {
  const press = usePressShrink(0.97);
  const enter = useFadeRise({ delay: delayIndex * 90 });
  const Glyph = profile.glyph;
  return (
    <Animated.View style={[press.style, enter]}>
      <Pressable onPress={onPress} onPressIn={press.onPressIn} onPressOut={press.onPressOut}>
        <FrostedPanel style={styles.shell}>
          <View style={styles.row}>
            <View style={[styles.glyph, { backgroundColor: `${profile.accent}26` }]}>
              <Glyph size={22} color={profile.accent} strokeWidth={2.2} />
            </View>
            <View style={styles.body}>
              <Text style={styles.title}>{profile.title}</Text>
              <Text style={styles.subtitle} numberOfLines={2}>{profile.description}</Text>
              <View style={styles.metaRow}>
                <Text style={[styles.meta, { color: profile.accent }]}>{primaryLine}</Text>
                {secondaryLine ? (
                  <>
                    <View style={styles.dot} />
                    <Text style={styles.meta}>{secondaryLine}</Text>
                  </>
                ) : null}
              </View>
            </View>
            <ChevronRight size={22} color={palette.fadedText} strokeWidth={2} />
          </View>
        </FrostedPanel>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  shell: {
    marginBottom: 14,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  glyph: {
    width: 50,
    height: 50,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  body: {
    flex: 1,
    gap: 4,
  },
  title: {
    ...typography.cardTitle,
    color: palette.bone,
    fontSize: 17,
  },
  subtitle: {
    ...typography.body,
    color: palette.fadedText,
    fontSize: 13,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 8,
  },
  meta: {
    ...typography.caption,
    color: palette.fadedText,
    letterSpacing: 0.4,
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 2,
    backgroundColor: palette.fadedText,
  },
});
