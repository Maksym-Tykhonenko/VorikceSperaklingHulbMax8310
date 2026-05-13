import { useRef } from 'react';
import { Animated, Easing } from 'react-native';

export function usePressShrink(intensity: number = 0.96) {
  const scale = useRef(new Animated.Value(1)).current;

  const onPressIn = () => {
    Animated.timing(scale, {
      toValue: intensity,
      duration: 120,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start();
  };

  const onPressOut = () => {
    Animated.timing(scale, {
      toValue: 1,
      duration: 180,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  };

  return {
    style: { transform: [{ scale }] },
    onPressIn,
    onPressOut,
  };
}
