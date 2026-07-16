import {
  ANIMATION_DELAYS,
  ANIMATION_EASING,
  ANIMATION_TIMINGS,
  SCROLL_TRANSFORMS,
} from '@/lib/constants'
import type { gsap as GsapType } from 'gsap'

export interface ScrollAnimationConfig {
  gsap: typeof GsapType
  trigger: Element
}

/**
 * Creates main scroll animation timeline for hero-to-intro transition
 * Handles: gradient block, floating image, nav, backdrops, and element fade-outs
 */
export function createScrollTimeline({
  gsap,
  trigger,
}: ScrollAnimationConfig): ReturnType<typeof GsapType.timeline> {
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger,
      start: 'top bottom',
      end: 'top top',
      scrub: 1,
    },
  })

  // Accent Gradient Block: Moves upward on scroll
  tl.to(
    '[data-animate="accent-gradient-block"]',
    {
      y: SCROLL_TRANSFORMS.ACCENT_BLOCK_Y,
      duration: ANIMATION_TIMINGS.SLOWEST,
      ease: ANIMATION_EASING.POWER_OUT,
    },
    0
  )

  // Image Animation: from right hemisphere (hero) to center (intro)
  // Phase 1: Fast blur activation (0 → 15px)
  tl.to(
    '[data-animate="floating-image"]',
    {
      height: SCROLL_TRANSFORMS.FLOATING_IMAGE_HEIGHT,
      x: SCROLL_TRANSFORMS.FLOATING_IMAGE_X,
      opacity: SCROLL_TRANSFORMS.FLOATING_IMAGE_OPACITY,
      filter: 'blur(15px)',
      duration: ANIMATION_TIMINGS.SLOWEST,
      ease: ANIMATION_EASING.POWER_OUT,
    },
    0
  )

  // Phase 2: Smooth blur completion (15px → 25px)
  tl.to(
    '[data-animate="floating-image"]',
    {
      filter: 'blur(25px)',
      duration: ANIMATION_TIMINGS.SLOWEST,
      ease: ANIMATION_EASING.LINEAR,
    },
    ANIMATION_TIMINGS.SLOWEST * 0.35
  )


  // Hero Backdrop: blur over the gradient, fades out toward intro
  tl.to(
    '[data-animate="hero-backdrop"]',
    {
      opacity: 0,
      duration: ANIMATION_TIMINGS.SLOWEST,
      ease: ANIMATION_EASING.LINEAR,
    },
    0
  )

  // Intro Backdrop Phase 1: Fast blur activation (0 → 25px blur, 0 → 0.6 opacity)
  tl.to(
    '[data-animate="intro-backdrop"]',
    {
      opacity: 0.6,
      filter: 'blur(25px)',
      duration: ANIMATION_TIMINGS.SLOWEST * 0.35,
      ease: ANIMATION_EASING.POWER_OUT,
    },
    0
  )

  // Intro Backdrop Phase 2: Smooth completion (25px → 40px blur, 0.6 → 1 opacity)
  tl.to(
    '[data-animate="intro-backdrop"]',
    {
      opacity: 1,
      filter: 'blur(40px)',
      duration: ANIMATION_TIMINGS.SLOWEST * 0.65,
      ease: ANIMATION_EASING.LINEAR,
    },
    ANIMATION_TIMINGS.SLOWEST * 0.35
  )

  // Fade out Hero elements sequentially (bottom to top)
  tl.to(
    '[data-animate="hero-cta"]',
    { opacity: 0, duration: ANIMATION_TIMINGS.FAST, ease: 'none' },
    0
  )
  tl.to(
    '.hero-title-line, [data-animate="hero-sub"]',
    { opacity: 0, duration: ANIMATION_TIMINGS.FAST, ease: 'none' },
    ANIMATION_TIMINGS.FAST * 0.67
  )
  tl.to(
    '[data-animate="hero-tagline"], [data-animate="hero-contact"]',
    { opacity: 0, duration: ANIMATION_TIMINGS.FAST, ease: 'none' },
    ANIMATION_TIMINGS.FAST * 1.33
  )

  // Fade in Intro elements from bottom
  tl.fromTo(
    '[data-animate="intro-text"]',
    { y: 50, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      stagger: ANIMATION_DELAYS.STAGGER,
      duration: ANIMATION_TIMINGS.NORMAL,
      ease: ANIMATION_EASING.POWER_OUT,
    },
    ANIMATION_TIMINGS.FAST * 1.33
  )

  return tl
}
