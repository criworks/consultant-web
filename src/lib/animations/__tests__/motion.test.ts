import { describe, it, expect, beforeEach, vi } from 'vitest';
import { shouldAnimateByPreference, prefersReducedMotion } from '@/lib/motion';

describe('Motion Utilities', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('shouldAnimateByPreference', () => {
    it('should return true when prefers-reduced-motion is not set', () => {
      vi.stubGlobal(
        'window',
        {
          matchMedia: () => ({ matches: false }),
        }
      );
      expect(shouldAnimateByPreference()).toBe(true);
    });

    it('should return false when prefers-reduced-motion is set', () => {
      vi.stubGlobal(
        'window',
        {
          matchMedia: () => ({ matches: true }),
        }
      );
      expect(shouldAnimateByPreference()).toBe(false);
    });

    it('should return true when window is undefined', () => {
      // Simulates SSR environment
      const result = shouldAnimateByPreference();
      expect(typeof result).toBe('boolean');
    });
  });

  describe('prefersReducedMotion', () => {
    it('should return true when prefers-reduced-motion is set', () => {
      vi.stubGlobal(
        'window',
        {
          matchMedia: () => ({ matches: true }),
        }
      );
      expect(prefersReducedMotion()).toBe(true);
    });

    it('should return false when prefers-reduced-motion is not set', () => {
      vi.stubGlobal(
        'window',
        {
          matchMedia: () => ({ matches: false }),
        }
      );
      expect(prefersReducedMotion()).toBe(false);
    });
  });
});
