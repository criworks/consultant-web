import type { NavItem } from '@/data/types';

export const navigation = [
  { label: 'Intro', href: '#intro', active: true },
  { label: 'Portfolio', href: '#work', active: false },
  { label: 'Perfil', href: '#bio', active: false },
] as const satisfies readonly NavItem[];
