/* Animation timing and easing constants */
export const ANIMATION_TIMINGS = {
  FAST: 0.3,
  NORMAL: 0.6,
  SLOW: 0.8,
  SLOWEST: 1,
} as const

export const ANIMATION_EASING = {
  POWER_IN: 'power2.in',
  POWER_OUT: 'power2.out',
  POWER_INOUT: 'power2.inOut',
  LINEAR: 'linear',
  EASE_OUT_STRONG: 'power3.out',
  EASE_INOUT_SUBTLE: 'power1.inOut',
} as const

export const ANIMATION_DELAYS = {
  STAGGER: 0.08,
  STAGGER_TITLE: 0.12,
} as const

/* Grid configuration */
export const GRID_CONFIG = {
  COLUMNS: 32,
  MARGIN: '40px',
  GUTTER: '16px',
} as const

/* Scroll animation transforms */
export const SCROLL_TRANSFORMS = {
  ACCENT_BLOCK_Y: -1168,
  FLOATING_IMAGE_HEIGHT: 860,
  FLOATING_IMAGE_X: 60,
  FLOATING_IMAGE_OPACITY: 0.6,
  NAV_XPERCENT: -100,
  NAV_X: -16,
} as const

/* Floating image initial position */
export const FLOATING_IMAGE_INITIAL = {
  X_PERCENT: -50,
  X: 300,
} as const
