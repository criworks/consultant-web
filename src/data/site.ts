import { config } from '@/data/config';
import { navigation } from '@/data/navigation';
import { social } from '@/data/social';
import { heroContent } from '@/data/content';

export const site = {
  ...config,
  hero: heroContent,
  nav: navigation,
  social: social,
} as const;
