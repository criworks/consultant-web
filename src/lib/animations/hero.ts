import type gsapInstance from 'gsap';
import { ANIMATION_TIMINGS, ANIMATION_EASING, ANIMATION_DELAYS, FLOATING_IMAGE_INITIAL } from '../constants';

export interface HeroAnimationConfig {
  gsap: typeof gsapInstance;
}

/**
 * Creates hero section initial load animation timeline
 * Animates: title lines, subtitle, nav, tagline, contact, CTA
 */
export function createHeroTimeline({ gsap }: HeroAnimationConfig): gsapInstance.core.Timeline {
  const tl = gsap.timeline({ defaults: { ease: ANIMATION_EASING.EASE_OUT_STRONG } });

  tl.from('.hero-title-line', {
    y: 48,
    opacity: 0,
    duration: ANIMATION_TIMINGS.SLOWEST,
    stagger: ANIMATION_DELAYS.STAGGER_TITLE,
  })
    .from(
      '[data-animate="hero-sub"]',
      {
        y: 24,
        opacity: 0,
        duration: ANIMATION_TIMINGS.NORMAL,
      },
      `-=${ANIMATION_TIMINGS.NORMAL * 0.5}`
    )
    .from(
      '[data-animate="hero-nav"], [data-animate="hero-tagline"], [data-animate="hero-contact"]',
      {
        opacity: 0,
        y: 12,
        duration: ANIMATION_TIMINGS.FAST,
        stagger: ANIMATION_DELAYS.STAGGER,
      },
      `-=${ANIMATION_TIMINGS.NORMAL * 0.6}`
    )
    .from(
      '[data-animate="hero-cta"]',
      {
        y: 20,
        opacity: 0,
        duration: ANIMATION_TIMINGS.NORMAL,
      },
      `-=${ANIMATION_TIMINGS.NORMAL * 0.3}`
    );

  return tl;
}

/**
 * Sets initial position of floating image (matches Figma "Hero" state)
 */
export function createHeroInitialAnimation({ gsap }: HeroAnimationConfig): void {
  gsap.set('[data-animate="floating-image"]', {
    xPercent: FLOATING_IMAGE_INITIAL.X_PERCENT,
    x: FLOATING_IMAGE_INITIAL.X,
  });
}
