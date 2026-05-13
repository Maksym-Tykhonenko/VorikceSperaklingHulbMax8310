import { Rabbit, Snail, Wind } from 'lucide-react-native';

export type SpeedKey = 'slow' | 'medium' | 'fast';

export type SpeedProfile = {
  key: SpeedKey;
  title: string;
  hint: string;
  pxPerSecond: number;
  glyph: typeof Rabbit;
};

export const speedRegistry: SpeedProfile[] = [
  {
    key: 'slow',
    title: 'Slow',
    hint: 'Relaxed pace for beginners',
    pxPerSecond: 18,
    glyph: Snail,
  },
  {
    key: 'medium',
    title: 'Medium',
    hint: 'Balanced natural flow',
    pxPerSecond: 30,
    glyph: Wind,
  },
  {
    key: 'fast',
    title: 'Fast',
    hint: 'Challenge your delivery',
    pxPerSecond: 48,
    glyph: Rabbit,
  },
];

export function speedByKey(key: SpeedKey): SpeedProfile {
  return speedRegistry.find(s => s.key === key) ?? speedRegistry[1];
}
