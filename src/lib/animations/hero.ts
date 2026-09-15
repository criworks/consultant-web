import type { gsap as GsapType } from 'gsap';
import { ANIMATION_TIMINGS, ANIMATION_EASING, ANIMATION_DELAYS, FLOATING_IMAGE_INITIAL } from '@/lib/constants';

export interface HeroAnimationConfig {
  gsap: typeof GsapType;
  paused?: boolean;
}

/**
 * Creates hero section initial load animation timeline
 * Animates: title lines, subtitle, nav, tagline, contact, CTA
 */
export function createHeroTimeline({ gsap, paused = false }: HeroAnimationConfig): ReturnType<typeof GsapType.timeline> {
  const tl = gsap.timeline({ paused, defaults: { ease: ANIMATION_EASING.EASE_OUT_STRONG } });

  tl.fromTo(
    '.hero-title-line',
    { y: 48, opacity: 0 },
    { y: 0, opacity: 1, duration: ANIMATION_TIMINGS.SLOWEST, stagger: ANIMATION_DELAYS.STAGGER_TITLE }
  )
    .fromTo(
      '[data-animate="hero-sub"]',
      { y: 24, opacity: 0 },
      { y: 0, opacity: 1, duration: ANIMATION_TIMINGS.NORMAL },
      `-=${ANIMATION_TIMINGS.NORMAL * 0.5}`
    )
    .fromTo(
      '[data-animate="hero-nav"], [data-animate="hero-status"], [data-animate="hero-tagline"], [data-animate="hero-contact"], [data-animate="hero-social"]',
      { opacity: 0, y: 12 },
      { opacity: 1, y: 0, duration: ANIMATION_TIMINGS.FAST, stagger: ANIMATION_DELAYS.STAGGER },
      `-=${ANIMATION_TIMINGS.NORMAL * 0.6}`
    )
    .fromTo(
      '[data-animate="hero-cta"]',
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: ANIMATION_TIMINGS.NORMAL },
      `-=${ANIMATION_TIMINGS.NORMAL * 0.3}`
    );

  return tl;
}

/**
 * Sets initial hidden state for all hero elements before entrance animations begin
 */
export function createHeroInitialAnimation({ gsap }: HeroAnimationConfig): void {
  // CSS (hero-initial.css) hides text elements from first paint.
  // Only the floating image needs GSAP positioning — CSS can't set xPercent.
  gsap.set('[data-animate="floating-image"]', {
    xPercent: FLOATING_IMAGE_INITIAL.X_PERCENT,
    x: 0,
  });
}

/**
 * Animates floating image from x:0 to its final x position while fading in
 */
export function createFloatingImageEntrance({ gsap }: HeroAnimationConfig): ReturnType<typeof GsapType.timeline> {
  const tl = gsap.timeline({ defaults: { ease: ANIMATION_EASING.EASE_OUT_STRONG } });

  tl.to('[data-animate="floating-image"]', {
    x: FLOATING_IMAGE_INITIAL.X,
    opacity: 1,
    duration: ANIMATION_TIMINGS.SLOWEST,
  });

  return tl;
}
