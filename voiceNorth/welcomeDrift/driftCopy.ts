import { Mic, Tv, BarChart3, BookOpen, ClipboardEdit } from 'lucide-react-native';

export type DriftEntry = {
  badge: string;
  title: string;
  description: string;
  glyph: typeof Mic;
  cta: string;
  accent: 'cyan' | 'cyanBright' | 'mint' | 'ember' | 'emberDeep';
};

export const driftSequence: DriftEntry[] = [
  {
    badge: 'Welcome',
    title: 'Master Your Voice',
    description: 'Practice clear speech, pacing, and confidence with guided reading sessions.',
    glyph: Mic,
    cta: 'Continue',
    accent: 'cyan',
  },
  {
    badge: 'Read & Speak Better',
    title: 'Smart Teleprompter',
    description: 'Choose curated texts across speaking, expression, and diction categories.',
    glyph: Tv,
    cta: 'Continue',
    accent: 'cyanBright',
  },
  {
    badge: 'Detailed Statistics',
    title: 'Track Your Growth',
    description: 'Review completed sessions, practice time, category progress, and reading preferences.',
    glyph: BarChart3,
    cta: 'Continue',
    accent: 'mint',
  },
  {
    badge: 'Blog & Tips',
    title: 'Learn from Experts',
    description: 'Read educational articles and practical speaking tips to support better presentation habits.',
    glyph: BookOpen,
    cta: 'Continue',
    accent: 'ember',
  },
  {
    badge: 'Custom Library',
    title: 'Your Text Workshop',
    description: 'Add your own speeches and scripts, organize them by category, and practice anytime.',
    glyph: ClipboardEdit,
    cta: 'Get Started',
    accent: 'emberDeep',
  },
];
