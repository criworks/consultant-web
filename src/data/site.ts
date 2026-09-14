import type { HeroContent, NavItem, ProfileItem, SocialLink } from '@/data/types'

export const site = {
  name: 'Cri Works',
  email: 'cri@cri.works',
  tagline: 'Product Designer en Santiago, Chile.',
  isUnderConstruction: false,

  nav: [
    { label: 'Cri Works', href: '#', active: true },
    { label: 'Work (soon)', href: '#work', active: false },
    { label: 'Bio (soon)', href: '#bio', active: false },
  ] satisfies NavItem[],

  profile: [
    { label: 'Freelance', href: '#', active: true },
    { label: 'Contractor (soon)', href: '#work', active: false },
  ] satisfies ProfileItem[],

  social: [
    { label: 'Instagram', href: 'https://instagram.com/cri.works' },
    { label: 'Github', href: 'https://github.com/criworks' },
    { label: 'Linkedin', href: 'https://linkedin.com/in/criworks' },
  ] satisfies SocialLink[],

  hero: {
    title: 'Cri Works',
    subtitle: 'Diseño productos que dan claridad a startups tecnológicas',
    ctaPrimary: 'Conoce mi trabajo',
    ctaSecondary: 'Ver trabajo reciente',
  } satisfies HeroContent,
} as const
