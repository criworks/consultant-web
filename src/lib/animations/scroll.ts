import type gsapInstance from 'gsap';
import { ANIMATION_TIMINGS, ANIMATION_EASING, SCROLL_TRANSFORMS } from '@/lib/constants';

export interface ScrollAnimationConfig {
  gsap: typeof gsapInstance;
  trigger: Element;
}

/**
 * Creates main scroll animation timeline for hero-to-intro transition
 * Handles: gradient block, floating image, nav, backdrops, and element fade-outs
 */
export function createScrollTimeline({
  gsap,
  trigger,
}: ScrollAnimationConfig): gsapInstance.core.Timeline {
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger,
      start: 'top bottom',
      end: 'top top',
      scrub: 1,
    },
  });

  // Accent Gradient Block: Moves upward on scroll
  tl.to(
    '[data-animate="accent-gradient-block"]',
    {
      y: SCROLL_TRANSFORMS.ACCENT_BLOCK_Y,
      duration: ANIMATION_TIMINGS.SLOWEST,
      ease: ANIMATION_EASING.POWER_OUT,
    },
    0
  );

  // Image Animation: from right hemisphere (hero) to center (intro)
  tl.to(
    '[data-animate="floating-image"]',
    {
      height: SCROLL_TRANSFORMS.FLOATING_IMAGE_HEIGHT,
      x: SCROLL_TRANSFORMS.FLOATING_IMAGE_X,
      opacity: SCROLL_TRANSFORMS.FLOATING_IMAGE_OPACITY,
      duration: ANIMATION_TIMINGS.SLOWEST,
      ease: ANIMATION_EASING.EASE_INOUT_SUBTLE,
    },
    0
  );

  // Nav Animation: from col-start-2 to col-start-1
  tl.to(
    '[data-animate="nav-container"]',
    {
      xPercent: SCROLL_TRANSFORMS.NAV_XPERCENT,
      x: SCROLL_TRANSFORMS.NAV_X,
      duration: ANIMATION_TIMINGS.SLOWEST,
      ease: ANIMATION_EASING.EASE_INOUT_SUBTLE,
    },
    0
  );

  // Hero Backdrop: blur over the gradient, fades out toward intro
  tl.to(
    '[data-animate="hero-backdrop"]',
    {
      opacity: 0,
      duration: ANIMATION_TIMINGS.SLOWEST,
      ease: ANIMATION_EASING.LINEAR,
    },
    0
  );

  // Intro Backdrop: blur over the image, fades in toward intro
  tl.to(
    '[data-animate="intro-backdrop"]',
    {
      opacity: 1,
      duration: ANIMATION_TIMINGS.SLOWEST,
      ease: ANIMATION_EASING.LINEAR,
    },
    0
  );

  // Fade out Hero elements sequentially (bottom to top)
  tl.to('[data-animate="hero-cta"]', { opacity: 0, duration: ANIMATION_TIMINGS.FAST, ease: 'none' }, 0);
  tl.to(
    '.hero-title-line, [data-animate="hero-sub"]',
    { opacity: 0, duration: ANIMATION_TIMINGS.FAST, ease: 'none' },
    ANIMATION_TIMINGS.FAST * 0.67
  );
  tl.to(
    '[data-animate="hero-tagline"], [data-animate="hero-contact"]',
    { opacity: 0, duration: ANIMATION_TIMINGS.FAST, ease: 'none' },
    ANIMATION_TIMINGS.FAST * 1.33
  );

  // Fade in Intro elements from bottom
  tl.fromTo(
    '[data-animate="intro-text"]',
    { y: 50, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      stagger: ANIMATION_TIMINGS.STAGGER,
      duration: ANIMATION_TIMINGS.NORMAL,
      ease: ANIMATION_EASING.POWER_OUT,
    },
    ANIMATION_TIMINGS.FAST * 1.33
  );

  return tl;
}
