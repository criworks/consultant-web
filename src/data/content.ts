import type { HeroContent } from '@/data/types';

export const heroContent = {
  title: 'Cri Works',
  subtitle: 'Diseño productos que dan claridad y criterio a startups tecnológicas',
  ctaPrimary: 'Trabajemos juntos',
  ctaSecondary: 'Ver trabajo reciente',
} as const satisfies HeroContent;
