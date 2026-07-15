import type { SiteConfig } from '@/data/types';

export const config = {
  name: 'Cri Works',
  email: 'cri@cri.works',
  tagline: 'Cri Works. Product Designer en Santiago, Chile.',
  isUnderConstruction: false,
} as const satisfies SiteConfig;
