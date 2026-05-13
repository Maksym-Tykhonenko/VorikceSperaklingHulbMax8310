import blogSource from '../../danekinspek/blokg';

export type BlogTone = 'Technique' | 'Foundation' | 'Voice' | 'Mindset' | 'Practice';

export type BlogEntry = {
  id: number;
  title: string;
  content: string;
  tone: BlogTone;
  excerpt: string;
  minutes: number;
  publishedLabel: string;
  featured?: boolean;
};

const tones: BlogTone[] = ['Foundation', 'Mindset', 'Technique', 'Voice', 'Practice'];

const publishedLabels: string[] = [
  'May 8, 2026',
  'May 3, 2026',
  'Apr 27, 2026',
  'Apr 21, 2026',
  'Apr 14, 2026',
  'Apr 6, 2026',
  'Mar 30, 2026',
];

export function blogCatalog(): BlogEntry[] {
  return (blogSource as { id: number; title: string; content: string }[]).map((entry, index) => {
    const wordCount = entry.content.split(/\s+/).filter(Boolean).length;
    const minutes = Math.max(2, Math.round(wordCount / 230));
    const tone = tones[index % tones.length];
    const cleanFirstLine = entry.content.split('\n').find(line => line.trim().length > 0) ?? '';
    const excerpt = cleanFirstLine.length > 132 ? `${cleanFirstLine.slice(0, 132).trim()}…` : cleanFirstLine.trim();
    return {
      id: entry.id,
      title: entry.title,
      content: entry.content,
      tone,
      excerpt,
      minutes,
      publishedLabel: publishedLabels[index % publishedLabels.length],
      featured: index === 0,
    };
  });
}
