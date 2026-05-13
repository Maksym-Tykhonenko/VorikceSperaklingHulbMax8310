import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable, Animated, Easing } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import { RotateCcw, Play, Pause, Check } from 'lucide-react-native';
import BackPill from '../sharedCrystal/BackPill';
import { categoryByKey, CategoryKey } from '../dataRelay/categoryRegistry';
import { speedByKey, SpeedKey } from '../dataRelay/speedRegistry';
import { sizeByKey, SizeKey } from '../dataRelay/sizeRegistry';
import { LibraryEntry } from '../dataRelay/libraryProvider';
import { palette } from '../styleCurrent/palette';
import { typography } from '../styleCurrent/typography';
import { usePressShrink } from '../motionLayer/usePressShrink';

type Props = {
  entry: LibraryEntry;
  speed: SpeedKey;
  size: SizeKey;
  onExit: () => void;
  onFinish: (result: { seconds: number; wordsRead: number; auto: boolean }) => void;
};

export default function TeleprompterView({ entry, speed, size, onExit, onFinish }: Props) {
  const insets = useSafeAreaInsets();
  const profile = categoryByKey(entry.categoryKey as CategoryKey);
  const speedProfile = speedByKey(speed);
  const sizeProfile = sizeByKey(size);

  const [running, setRunning] = useState(true);
  const [seconds, setSeconds] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const [contentHeight, setContentHeight] = useState(0);
  const [viewportHeight, setViewportHeight] = useState(0);
  const scrollRef = useRef<ScrollView>(null);

  const blink = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(blink, { toValue: 1, duration: 700, useNativeDriver: true }),
        Animated.timing(blink, { toValue: 0.3, duration: 700, useNativeDriver: true }),
      ]),
    ).start();
  }, [blink]);

  useEffect(() => {
    if (!running) return;
    const interval = setInterval(() => setSeconds(s => s + 1), 1000);
    return () => clearInterval(interval);
  }, [running]);

  useEffect(() => {
    if (!running) return;
    let last = Date.now();
    let frameId: number;
    const tick = () => {
      const now = Date.now();
      const elapsed = (now - last) / 1000;
      last = now;
      setScrollY(prev => {
        const next = prev + elapsed * speedProfile.pxPerSecond;
        const max = Math.max(0, contentHeight - viewportHeight);
        const clipped = Math.min(next, max);
        scrollRef.current?.scrollTo({ y: clipped, animated: false });
        if (max > 0 && clipped >= max - 0.5) {
          setRunning(false);
          const wordsRead = entry.body.split(/\s+/).filter(Boolean).length;
          onFinish({ seconds, wordsRead, auto: true });
        }
        return clipped;
      });
      frameId = requestAnimationFrame(tick);
    };
    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [running, speedProfile.pxPerSecond, contentHeight, viewportHeight, entry.body, onFinish, seconds]);

  const restart = useCallback(() => {
    setScrollY(0);
    setSeconds(0);
    setRunning(true);
    scrollRef.current?.scrollTo({ y: 0, animated: true });
  }, []);

  const togglePlay = useCallback(() => setRunning(prev => !prev), []);

  const manualFinish = useCallback(() => {
    const max = Math.max(0, contentHeight - viewportHeight);
    const progress = max > 0 ? Math.min(1, scrollY / max) : 1;
    const wordsTotal = entry.body.split(/\s+/).filter(Boolean).length;
    const wordsRead = Math.max(1, Math.round(wordsTotal * progress));
    setRunning(false);
    onFinish({ seconds, wordsRead, auto: false });
  }, [contentHeight, viewportHeight, scrollY, entry.body, onFinish, seconds]);

  const accent = profile?.accent ?? palette.arcticCyan;
  const elapsed = formatClock(seconds);

  const blinkOpacity = blink;

  return (
    <View style={styles.shell}>
      <LinearGradient colors={[palette.midnightCove, palette.abyss]} style={StyleSheet.absoluteFill} />
      <View style={[styles.topRow, { paddingTop: insets.top + 10 }]}>
        <BackPill onPress={onExit} label="Exit" tone="overlay" />
        <View style={styles.topCenter}>
          <Text style={[styles.topCaption, { color: accent }]}>{(profile?.title ?? 'Practice').toUpperCase()}</Text>
          <Text style={styles.timer}>{elapsed}</Text>
        </View>
        <View style={styles.statusPill}>
          {running ? (
            <>
              <Animated.View style={[styles.statusDot, { opacity: blinkOpacity }]} />
              <Text style={[styles.statusText, { color: '#FF6B7B' }]}>LIVE</Text>
            </>
          ) : (
            <>
              <View style={[styles.statusDot, { backgroundColor: palette.ember }]} />
              <Text style={[styles.statusText, { color: palette.ember }]}>PAUSED</Text>
            </>
          )}
        </View>
      </View>

      <View
        style={styles.readerWrap}
        onLayout={evt => setViewportHeight(evt.nativeEvent.layout.height)}
      >
        <ScrollView
          ref={scrollRef}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.readerContent}
          onContentSizeChange={(_w, h) => setContentHeight(h)}
          scrollEnabled={false}
        >
          <Text
            style={[
              styles.readerText,
              { fontSize: sizeProfile.fontSize, lineHeight: sizeProfile.lineHeight, color: palette.bone },
            ]}
          >
            {entry.body}
          </Text>
        </ScrollView>

        <LinearGradient
          colors={['rgba(4,10,26,0.95)', 'rgba(4,10,26,0)']}
          style={styles.topFade}
          pointerEvents="none"
        />
        <LinearGradient
          colors={['rgba(4,10,26,0)', 'rgba(4,10,26,0.95)']}
          style={styles.bottomFade}
          pointerEvents="none"
        />
      </View>

      <View style={[styles.controls, { paddingBottom: Math.max(insets.bottom, 16) + 28 }]}>
        <CircleControl glyph={<RotateCcw size={22} color={palette.bone} strokeWidth={2.2} />} onPress={restart} />
        <CircleControl
          large
          accent={running ? palette.ember : palette.arcticCyan}
          glyph={
            running ? (
              <Pause size={28} color={palette.abyss} fill={palette.abyss} />
            ) : (
              <Play size={28} color={palette.abyss} fill={palette.abyss} />
            )
          }
          onPress={togglePlay}
        />
        <CircleControl
          glyph={<Check size={22} color={palette.rubyRed} strokeWidth={2.4} />}
          tone="ember"
          onPress={manualFinish}
        />
      </View>
    </View>
  );
}

function CircleControl({
  glyph,
  onPress,
  large,
  accent,
  tone,
}: {
  glyph: React.ReactNode;
  onPress: () => void;
  large?: boolean;
  accent?: string;
  tone?: 'ember';
}) {
  const press = usePressShrink(0.92);
  const dim = large ? 70 : 56;
  return (
    <Animated.View style={press.style}>
      <Pressable
        onPress={onPress}
        onPressIn={press.onPressIn}
        onPressOut={press.onPressOut}
        style={[
          styles.circleControl,
          {
            width: dim,
            height: dim,
            borderRadius: dim / 2,
            backgroundColor: accent ? accent : tone === 'ember' ? 'rgba(255,107,123,0.18)' : 'rgba(20,38,70,0.65)',
            borderColor: accent ? accent : tone === 'ember' ? 'rgba(255,107,123,0.4)' : palette.panelEdge,
          },
        ]}
      >
        {glyph}
      </Pressable>
    </Animated.View>
  );
}

function formatClock(seconds: number): string {
  const m = Math.floor(seconds / 60)
    .toString()
    .padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

const styles = StyleSheet.create({
  shell: {
    flex: 1,
    backgroundColor: palette.abyss,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    justifyContent: 'space-between',
  },
  topCenter: {
    alignItems: 'center',
    flex: 1,
  },
  topCaption: {
    ...typography.caption,
    marginBottom: 2,
    fontSize: 10,
  },
  timer: {
    ...typography.title,
    color: palette.bone,
    fontSize: 22,
    letterSpacing: 1,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: 'rgba(4,10,26,0.65)',
    borderWidth: 1,
    borderColor: palette.panelEdge,
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#FF6B7B',
  },
  statusText: {
    ...typography.caption,
    fontSize: 11,
    letterSpacing: 0.6,
  },
  readerWrap: {
    flex: 1,
    marginTop: 18,
    marginHorizontal: 22,
  },
  readerContent: {
    paddingVertical: 60,
  },
  readerText: {
    fontWeight: '500',
  },
  topFade: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 60,
  },
  bottomFade: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 28,
    paddingTop: 14,
  },
  circleControl: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
});
