import { Platform } from 'react-native';

const baseFamily = Platform.select({ ios: 'System', android: 'sans-serif' });

export const typography = {
  hero: {
    fontFamily: baseFamily,
    fontWeight: '800' as const,
    fontSize: 36,
    letterSpacing: -0.6,
  },
  title: {
    fontFamily: baseFamily,
    fontWeight: '800' as const,
    fontSize: 28,
    letterSpacing: -0.4,
  },
  sectionTitle: {
    fontFamily: baseFamily,
    fontWeight: '700' as const,
    fontSize: 19,
    letterSpacing: -0.2,
  },
  cardTitle: {
    fontFamily: baseFamily,
    fontWeight: '700' as const,
    fontSize: 16,
  },
  body: {
    fontFamily: baseFamily,
    fontWeight: '500' as const,
    fontSize: 14,
    lineHeight: 20,
  },
  caption: {
    fontFamily: baseFamily,
    fontWeight: '600' as const,
    fontSize: 12,
    letterSpacing: 0.6,
    textTransform: 'uppercase' as const,
  },
  tabLabel: {
    fontFamily: baseFamily,
    fontWeight: '600' as const,
    fontSize: 11,
  },
};
