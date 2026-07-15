/**
 * Global type definitions and shared types across the application
 */

// Re-export all data types
export type { SiteConfig, NavItem, SocialLink, HeroContent } from '@/data/types';

// Animation types
export type { ScrollAnimationConfig, HeroAnimationConfig } from '@/lib/animations';

// Utility types
export type Readonly<T> = {
  readonly [K in keyof T]: T[K];
};

export type DeepReadonly<T> = {
  readonly [K in keyof T]: T[K] extends object ? DeepReadonly<T[K]> : T[K];
};
