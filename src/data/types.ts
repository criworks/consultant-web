export interface NavItem {
  readonly label: string
  readonly href: string
  readonly active: boolean
}

export interface ProfileItem {
  readonly label: string
  readonly href: string
  readonly active: boolean
}

export interface SocialLink {
  readonly label: string
  readonly href: string
}

export interface HeroContent {
  readonly title: string
  readonly subtitle: string
  readonly ctaPrimary: string
  readonly ctaSecondary: string
}

export interface SiteConfig {
  readonly name: string
  readonly email: string
  readonly tagline: string
  readonly isUnderConstruction: boolean
}
