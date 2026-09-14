import { describe, it, expect } from 'vitest';
import {
  ANIMATION_TIMINGS,
  ANIMATION_EASING,
  ANIMATION_DELAYS,
  GRID_CONFIG,
  SCROLL_TRANSFORMS,
} from '@/lib/constants';

describe('Animation Constants', () => {
  describe('ANIMATION_TIMINGS', () => {
    it('should have valid timing values', () => {
      expect(ANIMATION_TIMINGS.FAST).toBe(0.3);
      expect(ANIMATION_TIMINGS.NORMAL).toBe(0.6);
      expect(ANIMATION_TIMINGS.SLOW).toBe(0.8);
      expect(ANIMATION_TIMINGS.SLOWEST).toBe(1);
    });

    it('should have increasing duration values', () => {
      expect(ANIMATION_TIMINGS.FAST).toBeLessThan(ANIMATION_TIMINGS.NORMAL);
      expect(ANIMATION_TIMINGS.NORMAL).toBeLessThan(ANIMATION_TIMINGS.SLOW);
      expect(ANIMATION_TIMINGS.SLOW).toBeLessThan(ANIMATION_TIMINGS.SLOWEST);
    });
  });

  describe('ANIMATION_EASING', () => {
    it('should have easing functions defined', () => {
      expect(ANIMATION_EASING.POWER_IN).toMatch(/power/);
      expect(ANIMATION_EASING.POWER_OUT).toMatch(/power/);
      expect(ANIMATION_EASING.LINEAR).toBe('linear');
    });
  });

  describe('ANIMATION_DELAYS', () => {
    it('should have stagger delays', () => {
      expect(ANIMATION_DELAYS.STAGGER).toBe(0.08);
      expect(ANIMATION_DELAYS.STAGGER_TITLE).toBe(0.12);
    });

    it('stagger title should be larger than stagger', () => {
      expect(ANIMATION_DELAYS.STAGGER_TITLE).toBeGreaterThan(
        ANIMATION_DELAYS.STAGGER
      );
    });
  });

  describe('GRID_CONFIG', () => {
    it('should have 32 columns', () => {
      expect(GRID_CONFIG.COLUMNS).toBe(32);
    });

    it('should have correct margin and gutter', () => {
      expect(GRID_CONFIG.MARGIN).toBe('40px');
      expect(GRID_CONFIG.GUTTER).toBe('16px');
    });
  });

  describe('SCROLL_TRANSFORMS', () => {
    it('should have numeric transform values', () => {
      expect(typeof SCROLL_TRANSFORMS.ACCENT_BLOCK_Y).toBe('number');
      expect(typeof SCROLL_TRANSFORMS.FLOATING_IMAGE_HEIGHT).toBe('number');
      expect(typeof SCROLL_TRANSFORMS.FLOATING_IMAGE_OPACITY).toBe('number');
    });

    it('accent block should move upward (negative Y)', () => {
      expect(SCROLL_TRANSFORMS.ACCENT_BLOCK_Y).toBeLessThan(0);
    });

    it('opacity should be between 0 and 1', () => {
      expect(SCROLL_TRANSFORMS.FLOATING_IMAGE_OPACITY).toBeGreaterThan(0);
      expect(SCROLL_TRANSFORMS.FLOATING_IMAGE_OPACITY).toBeLessThan(1);
    });
  });
});
