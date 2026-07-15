import { describe, it, expect, beforeEach, vi } from 'vitest';
import { shouldAnimateByPreference, prefersReducedMotion } from '@/lib/motion';

describe('Motion Utilities', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('shouldAnimateByPreference', () => {
    it('should return true when prefers-reduced-motion is not set', () => {
      const spy = vi.spyOn(window, 'matchMedia').mockReturnValue({
        matches: false,
        media: '',
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      } as MediaQueryList);

      expect(shouldAnimateByPreference()).toBe(true);
      spy.mockRestore();
    });

    it('should return false when prefers-reduced-motion is set', () => {
      const spy = vi.spyOn(window, 'matchMedia').mockReturnValue({
        matches: true,
        media: '',
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      } as MediaQueryList);

      expect(shouldAnimateByPreference()).toBe(false);
      spy.mockRestore();
    });
  });

  describe('prefersReducedMotion', () => {
    it('should return true when prefers-reduced-motion is set', () => {
      const spy = vi.spyOn(window, 'matchMedia').mockReturnValue({
        matches: true,
        media: '',
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      } as MediaQueryList);

      expect(prefersReducedMotion()).toBe(true);
      spy.mockRestore();
    });

    it('should return false when prefers-reduced-motion is not set', () => {
      const spy = vi.spyOn(window, 'matchMedia').mockReturnValue({
        matches: false,
        media: '',
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      } as MediaQueryList);

      expect(prefersReducedMotion()).toBe(false);
      spy.mockRestore();
    });
  });
});
