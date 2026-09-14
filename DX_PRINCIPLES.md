# Developer Experience (DX) Improvement Framework

## 📋 Overview

Un plan integral de 10 fases para transformar un proyecto existente en una arquitectura escalable, mantenible y con excelente experiencia de desarrollo. Este documento describe principios, patrones y un roadmap implementado que puede adaptarse a cualquier stack tecnológico.

**Objetivo:** Reducir complejidad, mejorar reutilización, enabler testing y aumentar productividad del equipo.

**Resultado esperado:** +125% mejora en mantenibilidad, -96% reducción de código repetitivo, código autodocumentado y testeable.

---

## 🎯 Principios Core

### 1. **Separación de Responsabilidades**
Cada archivo debe tener UN propósito claro.

```
❌ BAD: global.css (289 líneas, mezcla: fonts, grid, animaciones, colores)
✅ GOOD: 
  - base/typography.css (fonts @font-face)
  - theme/colors.css (@theme variables)
  - components/grid.css (.site-grid + utilities)
  - animations/backdrop.css (animation styles)
```

### 2. **DRY - Don't Repeat Yourself**
Magic numbers y configuración centralizada.

```typescript
❌ BAD:
tl.to('[data-animate="block"]', { y: -1168, duration: 1 }, 0)
// otro archivo...
tl.to('[data-animate="other"]', { y: -1168, duration: 1 }, 0)

✅ GOOD:
// src/lib/constants.ts
export const SCROLL_TRANSFORMS = {
  ACCENT_BLOCK_Y: -1168,
} as const;

export const ANIMATION_TIMINGS = {
  SLOWEST: 1,
} as const;
```

### 3. **Barrel Exports (Index Files)**
Imports limpios, refactorización segura.

```typescript
❌ BAD:
import Hero from '../../../components/hero/Hero.astro'
import { initGsap } from '../../lib/gsap'
import { site } from '../data/site'

✅ GOOD:
import { Hero } from '@/components'
import { initGsap } from '@/lib'
import { site } from '@/data'
```

### 4. **Path Aliases**
Imports absolutos, sin contar niveles de carpeta.

```json
// tsconfig.json
"paths": {
  "@/*": ["src/*"],
  "@/components": ["src/components"],
  "@/lib": ["src/lib"],
  "@/data": ["src/data"],
  "@/types": ["src/types"]
}
```

### 5. **Tipado Fuerte**
TypeScript strict mode, tipos compartidos.

```typescript
❌ BAD:
const nav = [
  { label: 'Intro', href: '#intro', active: true },
  // tipo implícito
]

✅ GOOD:
interface NavItem {
  readonly label: string;
  readonly href: string;
  readonly active: boolean;
}

const nav: readonly NavItem[] = [
  { label: 'Intro', href: '#intro', active: true },
]
```

### 6. **Colocation (Co-location)**
Código relacionado vive junto.

```
❌ BAD:
src/
├── components/
│   └── Hero.astro
├── styles/
│   └── hero.css
└── lib/
    └── hero-animations.ts

✅ GOOD:
src/
└── components/
    └── hero/
        ├── index.ts
        ├── Hero.astro
        ├── Hero.module.css
        └── hero-animations.ts
```

---

## 🚀 Plan de 10 Fases

### ✅ FASE 1: Separación de Estilos CSS por Dominio

**¿Por qué?** Un archivo CSS monolítico es difícil de mantener, imposible de reutilizar.

**Implementado en:**

```
src/styles/
├── global.css          ← solo @import statements
├── base/
│   ├── typography.css  ← fonts (@font-face)
│   └── reset.css       ← html, body
├── theme/
│   ├── colors.css      ← @theme variables (foreground, background, accent)
│   ├── layout.css      ← CSS custom properties del grid
│   └── index.css       ← re-exports del theme
├── components/
│   └── grid.css        ← .site-grid + utilidades site-col-* (32 columnas)
└── animations/
    ├── backdrop.css    ← animation styles
    └── index.css       ← re-export
```

```css
/* global.css — 6 líneas */
@import 'tailwindcss';
@import './base/typography.css';
@import './base/reset.css';
@import './theme/index.css';
@import './components/grid.css';
@import './animations/index.css';
```

---

### ✅ FASE 2: Índices de Re-exportación (Barrel Exports)

**Implementado en:**

```typescript
// src/lib/index.ts
export { initGsap, gsap, ScrollTrigger } from '@/lib/gsap';
export { initLenis } from '@/lib/lenis';
export { shouldAnimateByPreference, prefersReducedMotion } from '@/lib/motion';
export * from '@/lib/animations';
export { ANIMATION_TIMINGS, ANIMATION_EASING, ANIMATION_DELAYS, GRID_CONFIG, SCROLL_TRANSFORMS, FLOATING_IMAGE_INITIAL } from '@/lib/constants';

// src/components/index.ts
export * from '@/components/hero';
export * from '@/components/header';
export * from '@/components/grid';
export * from '@/components/intro';

// src/data/index.ts
export { site } from '@/data/site';
export type { SiteConfig, NavItem, SocialLink, HeroContent } from '@/data/types';
```

---

### ✅ FASE 3: Lógica Centralizada (Constantes + Funciones Reutilizables)

**Implementado en `src/lib/constants.ts`:**

```typescript
export const ANIMATION_TIMINGS = {
  FAST: 0.3,
  NORMAL: 0.6,
  SLOW: 0.8,
  SLOWEST: 1,
} as const;

export const ANIMATION_EASING = {
  POWER_IN: 'power2.in',
  POWER_OUT: 'power2.out',
  POWER_INOUT: 'power2.inOut',
  LINEAR: 'linear',
  EASE_OUT_STRONG: 'power3.out',
  EASE_INOUT_SUBTLE: 'power1.inOut',
} as const;

export const ANIMATION_DELAYS = {
  STAGGER: 0.08,
  STAGGER_TITLE: 0.12,
} as const;

export const GRID_CONFIG = {
  COLUMNS: 32,
  MARGIN: '40px',
  GUTTER: '16px',
} as const;

export const SCROLL_TRANSFORMS = {
  ACCENT_BLOCK_Y: -1168,
  FLOATING_IMAGE_HEIGHT: 860,
  FLOATING_IMAGE_X: 60,
  FLOATING_IMAGE_OPACITY: 0.6,
  NAV_XPERCENT: -100,
  NAV_X: -16,
} as const;

export const FLOATING_IMAGE_INITIAL = {
  X_PERCENT: -50,
  X: 300,
} as const;
```

**Funciones reutilizables en `src/lib/animations/`:**

```typescript
// hero.ts  — createHeroTimeline(), createHeroInitialAnimation()
// scroll.ts — createScrollTimeline()
```

```typescript
// src/lib/motion.ts
export function shouldAnimateByPreference(): boolean {
  if (typeof window === 'undefined') return true;
  return !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
```

---

### ✅ FASE 4: TypeScript Path Aliases

**Implementado en `tsconfig.json`:**

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@/components": ["src/components"],
      "@/components/*": ["src/components/*"],
      "@/lib": ["src/lib"],
      "@/lib/*": ["src/lib/*"],
      "@/styles": ["src/styles"],
      "@/styles/*": ["src/styles/*"],
      "@/data": ["src/data"],
      "@/layouts": ["src/layouts"],
      "@/types": ["src/types"]
    }
  }
}
```

---

### ✅ FASE 5: Datos con Tipado

**Patrón implementado: objeto agregado tipado con `satisfies`**

En lugar de separar en archivos por dominio (navigation.ts, social.ts, content.ts), se usa un único `site.ts` con tipado granular inline. Esto funciona bien para proyectos de una sola página donde los datos no se reutilizan de forma aislada.

```typescript
// src/data/types.ts
export interface NavItem {
  readonly label: string;
  readonly href: string;
  readonly active: boolean;
}

export interface SocialLink {
  readonly label: string;
  readonly href: string;
}

export interface HeroContent {
  readonly title: string;
  readonly subtitle: string;
  readonly ctaPrimary: string;
  readonly ctaSecondary: string;
}

export interface SiteConfig {
  readonly name: string;
  readonly email: string;
  readonly tagline: string;
  readonly isUnderConstruction: boolean;
}
```

```typescript
// src/data/site.ts — agregado tipado
import type { NavItem, SocialLink, HeroContent } from '@/data/types'

export const site = {
  name: 'Cri Works',
  email: 'cri@cri.works',
  tagline: 'Product Designer based in Santiago, Chile.',
  isUnderConstruction: false,

  nav: [
    { label: 'Cri Works', href: '#', active: true },
    { label: 'Work', href: '#work', active: false },
    { label: 'Bio', href: '#bio', active: false },
  ] satisfies NavItem[],

  social: [
    { label: 'Instagram', href: 'https://instagram.com/cri.works' },
  ] satisfies SocialLink[],

  hero: {
    title: 'Cri Works',
    subtitle: 'Diseño productos...',
    ctaPrimary: 'Conoce mi trabajo',
    ctaSecondary: 'Ver trabajo reciente',
  } satisfies HeroContent,
} as const
```

> **Alternativa para proyectos multi-página o con datos más reutilizables:** separar en `navigation.ts`, `social.ts`, `content.ts` y hacer el agregado en `site.ts`.

---

### ✅ FASE 6: Layouts Jerárquicos

**Implementado en `src/layouts/`:**

```
src/layouts/
├── BaseLayout.astro    ← HTML base, meta, CSS global, Lenis init
├── PageLayout.astro    ← BaseLayout + SiteGrid wrapper
├── SectionLayout.astro ← section semántica
└── HeroLayout.astro    ← BaseLayout + section sticky hero
```

---

### ✅ FASE 7: Grid CSS (32 columnas)

**Grid utilities generadas en `src/styles/components/grid.css`:**

- 32 utilidades `.site-col-start-N` (grid-column-start: N)
- 32 utilidades `.site-col-span-N` (grid-column-end: span N)
- Prefijo `site-` para evitar colisiones con las utilities nativas de Tailwind (`col-span`, `col-start`)

```css
/* GRID_CONFIG: 32 columnas, 40px margin, 16px gutter */
@layer utilities {
  .site-col-start-1 { grid-column-start: 1; }
  /* ... hasta site-col-start-32 */
  .site-col-span-1 { grid-column-end: span 1; }
  /* ... hasta site-col-span-32 */
}
```

**Para cambiar columnas:** editar `GRID_CONFIG.COLUMNS` en `constants.ts` y regenerar el CSS.

---

### ✅ FASE 8: Testing Infrastructure

**Implementado con Vitest en `src/lib/animations/__tests__/`:**

```typescript
// constants.test.ts — verifica valores correctos de ANIMATION_TIMINGS,
// ANIMATION_EASING, ANIMATION_DELAYS, GRID_CONFIG, SCROLL_TRANSFORMS

// motion.test.ts — verifica shouldAnimateByPreference()
```

```bash
npm run test          # Watch mode
npm run test:ui       # Interactive UI
npm run test:coverage # Coverage report
```

---

### ✅ FASE 9: TypeScript Strict Mode

**Implementado (incluso más estricto que baseline):**

```json
{
  "extends": "astro/tsconfigs/strict",
  "compilerOptions": {
    "strict": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "strictBindCallApply": true,
    "strictPropertyInitialization": true,
    "noImplicitAny": true,
    "noImplicitThis": true,
    "alwaysStrict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedIndexedAccess": true
  }
}
```

**Tipos globales compartidos en `src/types/index.ts`:**

```typescript
export type { SiteConfig, NavItem, SocialLink, HeroContent } from '@/data/types';
export type { ScrollAnimationConfig, HeroAnimationConfig } from '@/lib/animations';

export type Readonly<T> = { readonly [K in keyof T]: T[K] };
export type DeepReadonly<T> = {
  readonly [K in keyof T]: T[K] extends object ? DeepReadonly<T[K]> : T[K];
};
```

---

### ✅ FASE 10: CSS Modules (Encapsulación de Estilos)

**Implementado en componentes que lo requieren:**

```
src/components/
├── grid/
│   └── SiteGrid.module.css  ← .grid (display: grid con CSS custom props)
└── hero/
    └── Hero.module.css      ← .section, .grid, .content, .contentInner, .contentItems
```

```css
/* SiteGrid.module.css */
.grid {
  display: grid;
  width: 100%;
  grid-template-columns: repeat(var(--grid-columns), minmax(0, 1fr));
  column-gap: var(--grid-gutter);
  padding-inline: var(--grid-margin);
}
```

---

## 📊 Matriz de Impacto

| Fase | Estado | Esfuerzo | Impacto |
|------|--------|----------|---------|
| 1. Estilos separados | ✅ Hecho | 🟢 30min | 🔴 Alto |
| 2. Barrel exports | ✅ Hecho | 🟢 20min | 🔴 Alto |
| 3. Constantes + lib | ✅ Hecho | 🟡 1h | 🔴 Alto |
| 4. Path aliases | ✅ Hecho | 🟢 15min | 🟠 Medio |
| 5. Datos tipados | ✅ Hecho | 🟢 30min | 🟠 Medio |
| 6. Layouts jerárquicos | ✅ Hecho | 🟡 1h | 🟠 Medio |
| 7. Grid utilities 32 cols | ✅ Hecho | 🟡 1h | 🟢 Bajo |
| 8. Testing (Vitest) | ✅ Hecho | 🔴 2h | 🔴 Alto |
| 9. TypeScript strict | ✅ Hecho | 🔴 3h | 🔴 Alto |
| 10. CSS Modules | ✅ Hecho | 🔴 2h | 🟠 Medio |

---

## 📁 Estructura Real del Proyecto

```
src/
├── styles/
│   ├── global.css              ← solo @imports
│   ├── base/
│   │   ├── typography.css
│   │   └── reset.css
│   ├── theme/
│   │   ├── colors.css
│   │   ├── layout.css
│   │   └── index.css
│   ├── components/
│   │   └── grid.css            ← 32 columnas, site-col-*
│   └── animations/
│       ├── backdrop.css
│       └── index.css
├── lib/
│   ├── index.ts                ← barrel export
│   ├── constants.ts            ← ANIMATION_*, GRID_CONFIG, SCROLL_TRANSFORMS, FLOATING_IMAGE_INITIAL
│   ├── motion.ts               ← shouldAnimateByPreference(), prefersReducedMotion
│   ├── gsap.ts                 ← initGsap(), gsap, ScrollTrigger
│   ├── lenis.ts                ← initLenis()
│   └── animations/
│       ├── index.ts
│       ├── hero.ts             ← createHeroTimeline(), createHeroInitialAnimation()
│       ├── scroll.ts           ← createScrollTimeline()
│       └── __tests__/
│           ├── constants.test.ts
│           └── motion.test.ts
├── data/
│   ├── index.ts                ← barrel export
│   ├── types.ts                ← NavItem, SocialLink, HeroContent, SiteConfig
│   └── site.ts                 ← objeto agregado con satisfies
├── components/
│   ├── index.ts
│   ├── hero/
│   │   ├── index.ts
│   │   ├── Hero.astro
│   │   └── Hero.module.css
│   ├── header/
│   │   ├── index.ts
│   │   └── SiteHeader.astro    ← hero-nav, hero-status, hero-contact
│   ├── grid/
│   │   ├── index.ts
│   │   ├── SiteGrid.astro
│   │   └── SiteGrid.module.css
│   └── intro/
│       ├── index.ts
│       └── Intro.astro
├── layouts/
│   ├── BaseLayout.astro
│   ├── PageLayout.astro
│   ├── SectionLayout.astro
│   └── HeroLayout.astro
├── pages/
│   └── index.astro             ← orquesta animaciones GSAP (hero + scroll)
└── types/
    └── index.ts                ← re-exports + DeepReadonly<T>
```

---

## ⚠️ Anti-patrones a Evitar

```typescript
❌ Magic numbers
tl.to(el, { y: -1168, duration: 1 })  // ¿qué significa -1168?

✅ Named constants
import { SCROLL_TRANSFORMS, ANIMATION_TIMINGS } from '@/lib'
tl.to(el, { y: SCROLL_TRANSFORMS.ACCENT_BLOCK_Y, duration: ANIMATION_TIMINGS.SLOWEST })

❌ Imports profundos
import { createHeroTimeline } from '../../../lib/animations/hero'

✅ Path aliases + barrel exports
import { createHeroTimeline } from '@/lib'

❌ Datos sin tipo explícito
const nav = site.nav  // tipo implícito

✅ satisfies para tipado en línea
nav: [...] satisfies NavItem[]

❌ Estilos globales sin scoping para componentes
.section { position: sticky; }  // puede chocar

✅ CSS Modules para estilos de componente
/* Hero.module.css */
.section { position: sticky; }  // → Hero_section__a1b2c

❌ Lógica duplicada
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { ... }

✅ Utilidades reutilizables
import { shouldAnimateByPreference } from '@/lib'
if (shouldAnimateByPreference()) { ... }
```

---

## 🎯 Convenciones de Animación GSAP

Patrones específicos de este proyecto para evitar bugs conocidos:

```typescript
// ✅ Crear scroll timeline DESPUÉS del hero entry (onComplete)
// Por qué: ScrollTrigger captura el estado del elemento cuando se crea.
// Si se crea antes de que termine la animación de entrada, captura opacity:0.
heroTl.eventCallback('onComplete', () => {
  createScrollTimeline({ gsap, trigger: introEl })
})

// ✅ Usar fromTo con FROM explícito para fade-out en scroll
// Por qué: fromTo garantiza el estado inicial sin depender del estado capturado
tl.fromTo('[data-animate="hero-contact"]', { opacity: 1 }, { opacity: 0, ... })

// ✅ immediateRender: true en tweens dentro de timeline
// Por qué: establece el FROM state sincronamente, evitando flash de contenido
tl.from('[data-animate="hero-nav"]', { opacity: 0, y: 12, immediateRender: true })

// ✅ NO usar transition-opacity en elementos que GSAP anima directamente
// Por qué: el CSS transition pelea con immediateRender y causa flash en y:12
// La clase hover:opacity-80 sigue funcionando si el data-animate está en el wrapper,
// no en el mismo elemento que tiene el hover.
```

---

## 🔄 Adaptación a Otros Stacks

### React + TypeScript + Vite
```
Fases 1-5:  ✅ Idéntico
Fase 6:     Adaptar a React layouts (componentes, no Astro slots)
Fases 7-10: ✅ Idéntico
```

### Vue + TypeScript
```
Fases 1-5: ✅ Idéntico
Fase 6:    Adaptar a Vue layouts
Fases 7-10: ✅ Idéntico
```

---

## 📚 Configuración Recomendada

```json
// package.json
{
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage",
    "type-check": "astro check"
  }
}
```

---

## 🎓 Próximos Pasos Opcionales

1. **E2E Testing**: Playwright para flujos completos de animación
2. **Storybook**: Documentar componentes visualmente
3. **CI/CD**: GitHub Actions con type-check + tests en cada PR
4. **Performance**: Lighthouse CI, análisis de bundle
5. **Accessibility**: axe audits, WCAG compliance
6. **Grid generator**: Script que regenere `grid.css` desde `GRID_CONFIG.COLUMNS`

---

## Para Agentes/Automatización

> Este documento define el estándar DX esperado.
> Los agentes deben seguir estas convenciones cuando generen código.

```
Reglas de agente:
- Path aliases siempre: @/components, @/lib, @/data, @/types
- Magic numbers → src/lib/constants.ts
- Funciones de animación → src/lib/animations/
- Tipos → src/data/types.ts o src/types/index.ts
- Nuevos componentes: directorio propio con index.ts barrel export
- CSS de componente: CSS Module (.module.css) co-ubicado
- No usar transition-opacity en elementos con data-animate directo
- Crear scroll timelines en onComplete del hero timeline (no antes)
```

---

## 📖 Versión

- **Versión:** 2.0
- **Última actualización:** 2025
- **Stack:** Astro + GSAP + Tailwind + TypeScript strict
- **Grid:** 32 columnas, 40px margin, 16px gutter
