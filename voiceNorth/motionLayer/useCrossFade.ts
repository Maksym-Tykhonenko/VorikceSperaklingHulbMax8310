import { useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';

export function useCrossFade(token: string | number, duration: number = 360) {
  const opacity = useRef(new Animated.Value(0)).current;
  const lift = useRef(new Animated.Value(10)).current;

  useEffect(() => {
    opacity.setValue(0);
    lift.setValue(10);
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(lift, {
        toValue: 0,
        duration,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, [token, duration, opacity, lift]);

  return {
    opacity,
    transform: [{ translateY: lift }],
  };
}
