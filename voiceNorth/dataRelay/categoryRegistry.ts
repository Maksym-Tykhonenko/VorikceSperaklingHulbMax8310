import { Mic, Heart, Sparkles } from 'lucide-react-native';
import { accentByCategory } from '../styleCurrent/palette';

export type CategoryKey = 'speaking' | 'emotional' | 'diction';

export type CategoryProfile = {
  key: CategoryKey;
  title: string;
  description: string;
  glyph: typeof Mic;
  accent: string;
};

export const categoryRegistry: CategoryProfile[] = [
  {
    key: 'speaking',
    title: 'Public Speaking',
    description: 'Motivational speeches, presentations and confident delivery.',
    glyph: Mic,
    accent: accentByCategory.speaking,
  },
  {
    key: 'emotional',
    title: 'Emotional Expression',
    description: 'Texts with varied emotions, intonations and vocal dynamics.',
    glyph: Heart,
    accent: accentByCategory.emotional,
  },
  {
    key: 'diction',
    title: 'Diction Challenges',
    description: 'Tongue twisters, hard sounds and articulation drills.',
    glyph: Sparkles,
    accent: accentByCategory.diction,
  },
];

export function categoryByKey(key: string): CategoryProfile | undefined {
  return categoryRegistry.find(item => item.key === key);
}
