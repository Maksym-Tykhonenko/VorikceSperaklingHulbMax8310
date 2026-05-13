export type SizeKey = 'small' | 'medium' | 'large';

export type SizeProfile = {
  key: SizeKey;
  title: string;
  hint: string;
  fontSize: number;
  lineHeight: number;
  glyph: string;
};

export const sizeRegistry: SizeProfile[] = [
  {
    key: 'small',
    title: 'Small',
    hint: 'Compact full paragraph view',
    fontSize: 17,
    lineHeight: 26,
    glyph: 'Aa',
  },
  {
    key: 'medium',
    title: 'Medium',
    hint: 'Comfortable reading size',
    fontSize: 22,
    lineHeight: 32,
    glyph: 'Aa',
  },
  {
    key: 'large',
    title: 'Large',
    hint: 'Big and easy to follow',
    fontSize: 28,
    lineHeight: 40,
    glyph: 'Aa',
  },
];

export function sizeByKey(key: SizeKey): SizeProfile {
  return sizeRegistry.find(s => s.key === key) ?? sizeRegistry[1];
}
