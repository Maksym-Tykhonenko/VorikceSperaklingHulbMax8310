import { useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';

type Options = {
  delay?: number;
  travel?: number;
  duration?: number;
  enabled?: boolean;
};

export function useFadeRise(options: Options = {}) {
  const { delay = 0, travel = 18, duration = 460, enabled = true } = options;
  const fade = useRef(new Animated.Value(0)).current;
  const lift = useRef(new Animated.Value(travel)).current;

  useEffect(() => {
    if (!enabled) {
      fade.setValue(1);
      lift.setValue(0);
      return;
    }
    fade.setValue(0);
    lift.setValue(travel);
    Animated.parallel([
      Animated.timing(fade, {
        toValue: 1,
        duration,
        delay,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(lift, {
        toValue: 0,
        duration,
        delay,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, [enabled, delay, duration, travel, fade, lift]);

  return {
    opacity: fade,
    transform: [{ translateY: lift }],
  };
}
