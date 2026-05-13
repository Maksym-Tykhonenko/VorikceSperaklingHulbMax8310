import tipsSource from '../../danekinspek/advices';
import { Mic, Wind, PauseCircle, Activity, Smile, Headphones, BookOpen, MessageCircle, ShieldCheck, Heart } from 'lucide-react-native';

export type TipBadge = 'Pacing' | 'Habit' | 'Technique' | 'Breath' | 'Articulation' | 'Self-Awareness' | 'Clarity' | 'Diction' | 'Posture' | 'Expression';

export type TipEntry = {
  id: number;
  title: string;
  content: string;
  tone: TipBadge;
  glyph: typeof Mic;
};

const decorations: { tone: TipBadge; glyph: typeof Mic }[] = [
  { tone: 'Pacing', glyph: Wind },
  { tone: 'Habit', glyph: Activity },
  { tone: 'Technique', glyph: PauseCircle },
  { tone: 'Breath', glyph: Wind },
  { tone: 'Articulation', glyph: Mic },
  { tone: 'Self-Awareness', glyph: Headphones },
  { tone: 'Clarity', glyph: BookOpen },
  { tone: 'Diction', glyph: MessageCircle },
  { tone: 'Posture', glyph: ShieldCheck },
  { tone: 'Expression', glyph: Heart },
];

export function tipsCatalog(): TipEntry[] {
  return (tipsSource as { id: number; title: string; content: string }[]).map((entry, index) => {
    const decoration = decorations[index % decorations.length];
    return {
      id: entry.id,
      title: entry.title,
      content: entry.content,
      tone: decoration.tone,
      glyph: decoration.glyph,
    };
  });
}
