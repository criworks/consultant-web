export const site = {
  name: 'Cri Works',
  email: 'cri@cri.works',
  tagline: 'Cri Works. Product Designer en Santiago, Chile.',
  isUnderConstruction: false, // Temporal flag for the launch
  hero: {
    title: 'Cri Works',
    subtitle: 'Diseño productos que dan claridad y criterio a startups tecnológicas',
    ctaPrimary: 'Trabajemos juntos',
    ctaSecondary: 'Ver trabajo reciente',
  },
  nav: [
    { label: 'Intro', href: '#intro', active: true },
    { label: 'Portfolio', href: '#work', active: false },
    { label: 'Perfil', href: '#bio', active: false },
  ] as const,
  social: [
    { label: 'Instagram', href: 'https://instagram.com/cri.works' },
    { label: 'Github', href: 'https://github.com/criworks' },
    { label: 'Linkedin', href: 'https://linkedin.com/in/criworks' },
  ] as const,
} as const
