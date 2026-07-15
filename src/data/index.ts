// Main site object (backwards compatible)
export { site } from '@/data/site';

// Individual exports for granular imports
export { config } from '@/data/config';
export { navigation } from '@/data/navigation';
export { social } from '@/data/social';
export { heroContent } from '@/data/content';

// Type exports
export type { SiteConfig, NavItem, SocialLink, HeroContent } from '@/data/types';
