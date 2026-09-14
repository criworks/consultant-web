# Cri Works

Sitio personal de marca como Product Designer. Construido con Astro, Tailwind CSS v4, GSAP y Lenis.

## Stack

| Herramienta | Uso |
|-------------|-----|
| [Astro](https://astro.build) | Framework — sitio estático, cero JS por defecto |
| [Tailwind CSS v4](https://tailwindcss.com) | Estilos utilitarios con `@theme` |
| [GSAP](https://gsap.com) + ScrollTrigger | Animaciones de entrada y scroll |
| [Lenis](https://lenis.darkroom.engineering) | Smooth scroll (integrado con GSAP ticker) |
| [Lucide](https://lucide.dev) | Iconos SVG vía `@lucide/astro` (tree-shakable, sin JS en runtime) |
| [Vitest](https://vitest.dev) | Tests de constantes y utilidades |

## Desarrollo

```sh
npm install
npm run dev
```

Abre [http://localhost:4321](http://localhost:4321).

## Scripts

| Comando | Acción |
|---------|--------|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build de producción |
| `npm run preview` | Vista previa del build |
| `npm run test` | Tests en watch mode |
| `npm run test:ui` | Tests con UI interactiva |
| `npm run test:coverage` | Reporte de coverage |
| `npm run generate:grid` | Regenera `grid.css` desde `GRID_CONFIG` |

## Estructura

```
src/
├── components/
│   ├── grid/           # SiteGrid — grid de 32 cols con CSS Module
│   ├── header/         # SiteHeader — hero-nav, hero-status, hero-contact
│   ├── hero/           # Hero — sección principal
│   └── intro/          # Intro — primera sección de contenido
├── data/
│   ├── types.ts        # NavItem, SocialLink, HeroContent, SiteConfig
│   └── site.ts         # Objeto agregado tipado con satisfies
├── layouts/
│   ├── BaseLayout.astro
│   ├── PageLayout.astro
│   ├── SectionLayout.astro
│   └── HeroLayout.astro
├── lib/
│   ├── constants.ts    # ANIMATION_*, GRID_CONFIG, SCROLL_TRANSFORMS, FLOATING_IMAGE_INITIAL
│   ├── motion.ts       # shouldAnimateByPreference()
│   ├── gsap.ts         # initGsap() — GSAP + ScrollTrigger
│   ├── lenis.ts        # initLenis() — smooth scroll con GSAP ticker
│   └── animations/
│       ├── hero.ts     # createHeroTimeline(), createHeroInitialAnimation()
│       ├── scroll.ts   # createScrollTimeline()
│       └── __tests__/  # Tests de constantes y motion
├── pages/
│   └── index.astro     # Orquesta splash loader + animaciones GSAP
├── styles/
│   ├── global.css      # Solo @imports
│   ├── base/           # typography.css, reset.css
│   ├── theme/          # colors.css, layout.css
│   ├── components/     # grid.css (32 columnas)
│   └── animations/     # backdrop.css
└── types/
    └── index.ts        # Re-exports globales + DeepReadonly<T>
```

## Grid

**32 columnas** stretch, margin `40px`, gutter `16px`. Definido en `src/lib/constants.ts`:

```typescript
export const GRID_CONFIG = {
  COLUMNS: 32,
  MARGIN: '40px',
  GUTTER: '16px',
} as const
```

Usa `SiteGrid` con hijos directos. Combina siempre `.site-col-start-{n}` + `.site-col-span-{m}`:

```astro
<SiteGrid>
  <div class="site-col-start-4 site-col-span-16">contenido</div>
  <div class="site-col-start-29 site-col-span-4">contacto</div>
</SiteGrid>
```

Para regenerar las utilities CSS al cambiar el número de columnas:

```sh
npm run generate:grid
```

## Animaciones

Los elementos animados llevan `data-animate="nombre"`. La lógica está en `src/lib/animations/` y se orquesta en `src/pages/index.astro`.

**Flujo de animación en `index.astro`:**

1. `runSplash()` — splash loader con progreso animado
2. `runHeroAnimations()` — se ejecuta en el `onComplete` del splash
   - `createHeroInitialAnimation()` — posición inicial de la imagen flotante
   - `createHeroTimeline()` — entrada del hero (título, sub, nav, status, tagline, contact, social, CTA)
   - `createScrollTimeline()` — se crea en el `onComplete` del hero timeline ← importante

> **Por qué `onComplete`:** ScrollTrigger captura el estado del elemento cuando se crea. Crearlo después del hero entry garantiza que captura `opacity:1` como estado inicial para los fade-outs del scroll.

**Constantes disponibles:**

```typescript
import { ANIMATION_TIMINGS, ANIMATION_EASING, ANIMATION_DELAYS } from '@/lib'

ANIMATION_TIMINGS   // FAST: 0.3 | NORMAL: 0.6 | SLOW: 0.8 | SLOWEST: 1
ANIMATION_EASING    // POWER_OUT | EASE_OUT_STRONG | LINEAR | ...
ANIMATION_DELAYS    // STAGGER: 0.08 | STAGGER_TITLE: 0.12
```

**Respeta `prefers-reduced-motion`:**

```typescript
import { shouldAnimateByPreference } from '@/lib'
if (shouldAnimateByPreference()) { /* animaciones */ }
```

**Regla sobre `transition-opacity`:** no usar en elementos que tienen `data-animate` directo (el CSS transition pelea con `immediateRender` de GSAP y causa un flash). Si necesitas hover animado, poner `data-animate` en el wrapper y el hover en el elemento hijo.

## Iconos

```astro
---
import { Mail, ArrowDown } from '@lucide/astro'
---

<Mail size={14} stroke-width={1.5} class="shrink-0" />
```

Lista completa en [lucide.dev/icons](https://lucide.dev/icons).

## Fuentes

Coloca `Switzer-Semibold.woff2` en `public/fonts/`. El `@font-face` está en `src/styles/base/typography.css`.

## Arquitectura DX

Ver [`DX_PRINCIPLES.md`](./DX_PRINCIPLES.md) para el framework completo de 10 fases (todas implementadas). Resumen:

- **Path aliases:** siempre `@/components`, `@/lib`, `@/data`, `@/types`
- **Sin magic numbers:** todo en `src/lib/constants.ts`
- **Barrel exports:** cada directorio tiene su `index.ts`
- **Tipos:** `src/data/types.ts` + `src/types/index.ts`
- **CSS de componente:** CSS Module co-ubicado (`.module.css`)
- **TypeScript strict:** `noUncheckedIndexedAccess` y todas las flags strict activadas
