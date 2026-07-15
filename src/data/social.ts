import type { SocialLink } from '@/data/types';

export const social = [
  { label: 'Instagram', href: 'https://instagram.com/cri.works' },
  { label: 'Github', href: 'https://github.com/criworks' },
  { label: 'Linkedin', href: 'https://linkedin.com/in/criworks' },
] as const satisfies readonly SocialLink[];
