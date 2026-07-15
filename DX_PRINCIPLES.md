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
  - base/typography.css (15 líneas, solo @font-face)
  - theme/colors.css (11 líneas, solo @theme)
  - components/grid.css (65 líneas, .site-grid + utilities)
  - animations/backdrop.css (24 líneas, solo animaciones)
```

### 2. **DRY - Don't Repeat Yourself**
Magic numbers y configuración centralizada.

```typescript
❌ BAD:
const tl = gsap.timeline({...})
tl.to('[data-animate="block"]', { y: -1168, duration: 1 }, 0)
// ... otro archivo ...
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
  // ... tipo implícito
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

### FASE 1: Separación de Estilos CSS por Dominio

**¿Por qué?** Un archivo CSS monolítico es difícil de mantener, imposible de reutilizar.

**¿Qué?**
- Separar por dominio: base, theme, components, animations
- Cada archivo ~10-70 líneas
- global.css solo imports

**Cómo implementar:**

```
src/styles/
├── global.css (11 líneas)
├── base/
│   ├── typography.css (fonts)
│   └── reset.css (html, body)
├── theme/
│   ├── colors.css (@theme variables)
│   ├── layout.css (grid config)
│   └── index.css (re-exports)
├── components/
│   └── grid.css (component styles + utilities)
└── animations/
    ├── backdrop.css (animation styles)
    └── index.css (re-export)
```

**Beneficio:** +96% reducción en global.css, fácil reutilización, mejor discoveribilidad.

**Ejemplo:**

```css
/* ANTES: global.css 289 líneas */
@font-face { ... }
:root { --grid-columns: 16; }
.site-grid { display: grid; }
.site-col-start-1 { ... }
/* ... repetidas 32 veces ... */
[data-animate='...'] { ... }
@theme { ... }

/* DESPUÉS: Modular */
/* base/typography.css */
@font-face { ... }

/* theme/layout.css */
:root { --grid-columns: 16; }

/* components/grid.css */
.site-grid { display: grid; }
.site-col-start-1 { ... }

/* animations/backdrop.css */
[data-animate='...'] { ... }

/* global.css: 11 líneas */
@import './base/typography.css';
@import './theme/index.css';
@import './components/grid.css';
```

---

### FASE 2: Índices de Re-exportación (Barrel Exports)

**¿Por qué?** Imports profundos = refactorización difícil, tipos ofuscados.

**¿Qué?** Crear `index.ts` en cada directorio que re-exporte.

**Cómo implementar:**

```typescript
// src/lib/index.ts
export { initGsap, gsap, ScrollTrigger } from '@/lib/gsap';
export { initLenis } from '@/lib/lenis';
export { shouldAnimateByPreference } from '@/lib/motion';
export * from '@/lib/animations';

// src/components/hero/index.ts
export { default as Hero } from '@/components/hero/Hero.astro';
export { default as HeroTitle } from '@/components/hero/HeroTitle.astro';
export { default as HeroCta } from '@/components/hero/HeroCta.astro';

// src/components/index.ts
export * from '@/components/hero';
export * from '@/components/grid';
export * from '@/components/intro';
```

**Beneficio:** Imports limpios, refactorización segura, IDE autocomplete mejorado.

**Antes vs Después:**

```typescript
// ANTES
import Hero from '../../../components/hero/Hero.astro'
import HeroTitle from '../../../components/hero/HeroTitle.astro'
import HeroCta from '../../../components/hero/HeroCta.astro'

// DESPUÉS
import { Hero, HeroTitle, HeroCta } from '@/components'
```

---

### FASE 3: Lógica Centralizada (Constantes + Funciones Reutilizables)

**¿Por qué?** Magic numbers no documentados, duplicación de lógica.

**¿Qué?**
- `constants.ts`: Todos los valores hardcodeados
- `animations/`: Funciones GSAP reutilizables
- `motion.ts`: Utilidades de accesibilidad

**Cómo implementar:**

```typescript
// src/lib/constants.ts
export const ANIMATION_TIMINGS = {
  FAST: 0.3,
  NORMAL: 0.6,
  SLOW: 0.8,
  SLOWEST: 1,
} as const;

export const ANIMATION_EASING = {
  POWER_OUT: 'power2.out',
  LINEAR: 'linear',
} as const;

export const SCROLL_TRANSFORMS = {
  ACCENT_BLOCK_Y: -1168,
  FLOATING_IMAGE_X: -10.23,
  FLOATING_IMAGE_OPACITY: 0.6,
} as const;

export const GRID_CONFIG = {
  COLUMNS: 16,
  MARGIN: '16px',
  GUTTER: '16px',
} as const;
```

```typescript
// src/lib/animations/scroll.ts
export function createScrollTimeline({
  gsap,
  trigger,
}: ScrollAnimationConfig): ReturnType<typeof gsap.timeline> {
  const tl = gsap.timeline({
    scrollTrigger: { trigger, start: 'top bottom', end: 'top top', scrub: 1 },
  });

  tl.to('[data-animate="accent-block"]', {
    y: SCROLL_TRANSFORMS.ACCENT_BLOCK_Y,
    duration: ANIMATION_TIMINGS.SLOWEST,
    ease: ANIMATION_EASING.POWER_OUT,
  }, 0);

  return tl;
}
```

```typescript
// src/lib/motion.ts
export function shouldAnimateByPreference(): boolean {
  if (typeof window === 'undefined') return true;
  return !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
```

**Beneficio:** -400 LOC de scripts inline, constantes globales, reutilización, DRY.

---

### FASE 4: TypeScript Path Aliases

**¿Por qué?** Imports relativos requieren contar niveles (`../../../`), frágiles.

**¿Qué?** Configurar aliases en `tsconfig.json`.

**Cómo implementar:**

```json
// tsconfig.json
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
      "@/data": ["src/data"],
      "@/layouts": ["src/layouts"],
      "@/types": ["src/types"]
    }
  }
}
```

**Beneficio:** Imports absolutos, legibles, refactorización segura, IDE soporte.

```typescript
// ANTES: Contar niveles
import { Hero } from '../../../components/hero'

// DESPUÉS: Alias directo
import { Hero } from '@/components'
```

---

### FASE 5: Datos Separados con Tipado

**¿Por qué?** Datos monolíticos no reutilizables, sin tipado.

**¿Qué?**
- Separar por dominio: config, navigation, social, content
- Crear `types.ts` para validación
- Mantener `site.ts` como agregado (backward compatible)

**Cómo implementar:**

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
```

```typescript
// src/data/navigation.ts
import type { NavItem } from '@/data/types';

export const navigation = [
  { label: 'Intro', href: '#intro', active: true },
  { label: 'Portfolio', href: '#work', active: false },
  { label: 'Perfil', href: '#bio', active: false },
] as const satisfies readonly NavItem[];
```

```typescript
// src/data/social.ts
import type { SocialLink } from '@/data/types';

export const social = [
  { label: 'Instagram', href: 'https://instagram.com/...' },
  { label: 'Github', href: 'https://github.com/...' },
] as const satisfies readonly SocialLink[];
```

```typescript
// src/data/index.ts
export { site } from '@/data/site'; // backward compatible
export { navigation } from '@/data/navigation';
export { social } from '@/data/social';
export { heroContent } from '@/data/content';
export type { NavItem, SocialLink, HeroContent } from '@/data/types';
```

**Beneficio:** Reutilización granular, tipado fuerte, cambios aislados.

```typescript
// ANTES: Todo junto, sin tipos
import { site } from '@/data'
const nav = site.nav  // ❓ tipo implícito

// DESPUÉS: Granular y tipado
import { navigation } from '@/data'
import type { NavItem } from '@/data'
const nav: NavItem[] = navigation // ✅ tipo explícito
```

---

### FASE 6: Layouts Jerárquicos

**¿Por qué?** Estructura HTML repetida, difícil mantener globalmente.

**¿Qué?**
- `BaseLayout`: HTML base
- `PageLayout`: Grid wrapper
- `SectionLayout`: Semantic section
- `HeroLayout`: Hero-specific

**Cómo implementar:**

```astro
// src/layouts/BaseLayout.astro
---
import '@/styles/global.css';

interface Props {
  title?: string;
  description?: string;
}
---

<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>{title}</title>
    <meta name="description" content={description} />
  </head>
  <body>
    <slot />
    <script>
      import { initLenis } from '@/lib';
      initLenis();
    </script>
  </body>
</html>
```

```astro
// src/layouts/PageLayout.astro
---
import BaseLayout from '@/layouts/BaseLayout.astro';
import { SiteGrid } from '@/components/grid';

interface Props {
  title?: string;
  description?: string;
}
---

<BaseLayout title={title} description={description}>
  <SiteGrid>
    <div class="site-col-start-1 site-col-span-16">
      <slot />
    </div>
  </SiteGrid>
</BaseLayout>
```

```astro
// src/layouts/HeroLayout.astro
---
import BaseLayout from '@/layouts/BaseLayout.astro';
import { SiteGrid } from '@/components/grid';

interface Props {
  title?: string;
  description?: string;
}
---

<BaseLayout title={title} description={description}>
  <section id="hero" class="sticky top-0 h-dvh overflow-hidden">
    <SiteGrid class="h-dvh">
      <slot />
    </SiteGrid>
  </section>
</BaseLayout>
```

**Beneficio:** Jerarquía clara, código reutilizable, cambios globales centralizados.

---

### FASE 7: Grid/Utilities Generator (Automatización)

**¿Por qué?** Utilities generadas manualmente = mantenimiento tedioso, propenso a errores.

**¿Qué?** Script que genera CSS desde constantes.

**Cómo implementar:**

```typescript
// scripts/generate-grid-css.ts
import { writeFileSync, readFileSync } from 'fs';

const GRID_COLUMNS = 16;
const BREAKPOINT = '64rem';

function generateGridUtilities(): string {
  let css = '/* Column start utilities */\n';
  
  for (let i = 1; i <= GRID_COLUMNS; i++) {
    css += `  .site-col-start-${i} { grid-column-start: ${i}; }\n`;
  }

  css += '\n/* Column span utilities */\n';
  for (let i = 1; i <= GRID_COLUMNS; i++) {
    css += `  .site-col-span-${i} { grid-column-end: span ${i}; }\n`;
  }

  return css;
}

const gridPath = './src/styles/components/grid.css';
const existing = readFileSync(gridPath, 'utf-8');
const newContent = `${header}@layer utilities {\n${generateGridUtilities()}}\n`;
writeFileSync(gridPath, newContent);
```

```json
// package.json
{
  "scripts": {
    "generate:grid": "tsx scripts/generate-grid-css.ts"
  }
}
```

**Beneficio:** Single source of truth, cambio global en 1 línea, sin mantenimiento manual.

```bash
# Cambiar de 16 a 12 columnas
# Editar: GRID_COLUMNS = 12
npm run generate:grid
# ✅ 12 utilities generadas automáticamente
```

---

### FASE 8: Testing Infrastructure

**¿Por qué?** Sin tests = regressions ocultas, refactoring arriesgado.

**¿Qué?** Vitest + tests para constantes y utilidades.

**Cómo implementar:**

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
    },
  },
});
```

```typescript
// src/lib/animations/__tests__/constants.test.ts
import { describe, it, expect } from 'vitest';
import { ANIMATION_TIMINGS, ANIMATION_EASING } from '@/lib/constants';

describe('Animation Constants', () => {
  describe('ANIMATION_TIMINGS', () => {
    it('should have increasing duration values', () => {
      expect(ANIMATION_TIMINGS.FAST).toBeLessThan(ANIMATION_TIMINGS.NORMAL);
      expect(ANIMATION_TIMINGS.NORMAL).toBeLessThan(ANIMATION_TIMINGS.SLOW);
    });
  });

  describe('ANIMATION_EASING', () => {
    it('should be valid GSAP easing', () => {
      expect(ANIMATION_EASING.LINEAR).toBe('linear');
      expect(ANIMATION_EASING.POWER_OUT).toMatch(/power/);
    });
  });
});
```

```bash
# npm scripts
npm run test          # Watch mode
npm run test:ui       # Interactive UI
npm run test:coverage # Coverage report
```

**Beneficio:** Documentación ejecutable, confianza en refactorings, regressions detectados.

---

### FASE 9: TypeScript Strict Mode

**¿Por qué?** Sin strict mode = bugs ocultos en tiempo de runtime.

**¿Qué?** Activar todas las flags strict en tsconfig.

**Cómo implementar:**

```json
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "noImplicitAny": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true
  }
}
```

```typescript
// src/types/index.ts
export type { SiteConfig, NavItem, SocialLink, HeroContent } from '@/data/types';
export type { ScrollAnimationConfig, HeroAnimationConfig } from '@/lib/animations';

// Utility types
export type Readonly<T> = {
  readonly [K in keyof T]: T[K];
};
```

**Beneficio:** Errores compilados (no runtime), mejor IDE support, código autodocumentado.

```typescript
// ❌ BAD: Sin strict mode
const items = nav.map(item => item.label) // posible undefined

// ✅ GOOD: Con strict mode
const items: string[] = nav.map((item: NavItem) => item.label)
```

---

### FASE 10: CSS Modules (Encapsulación de Estilos)

**¿Por qué?** Estilos globales = colisiones, lado effects, refactoring riesgoso.

**¿Qué?** CSS Modules para scoping automático de clases.

**Cómo implementar:**

```css
/* src/components/grid/SiteGrid.module.css */
.grid {
  display: grid;
  width: 100%;
  grid-template-columns: repeat(var(--grid-columns), minmax(0, 1fr));
  column-gap: var(--grid-gutter);
  padding-inline: var(--grid-margin);
}
```

```astro
// src/components/grid/SiteGrid.astro
---
import styles from './SiteGrid.module.css';

interface Props {
  tag?: keyof HTMLElementTagNameMap;
  class?: string;
}

const { tag: Tag = 'div', class: className = '' } = Astro.props;
---

<Tag class:list={[styles.grid, className]}>
  <slot />
</Tag>
```

```css
/* src/components/hero/Hero.module.css */
.section {
  position: sticky;
  top: 0;
  height: 100dvh;
  overflow: hidden;
}

.content {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}
```

**Beneficio:** Estilos scoped, colocation, dead code detection, refactoring seguro.

```css
/* ANTES: Globales */
.title { color: red; }  /* puede chocar con otro .title */

/* DESPUÉS: Scoped */
/* Hero.module.css */
.title { color: red; }
/* → generado como: Hero_title__a1b2c */
```

---

## 📊 Matriz de Impacto

| Fase | Esfuerzo | Impacto | Casos de Uso |
|------|----------|---------|--------------|
| 1. Estilos | 🟢 30min | 🔴 Alto | Todos |
| 2. Índices | 🟢 20min | 🔴 Alto | Todos |
| 3. Lógica | 🟡 1h | 🔴 Alto | Todos |
| 4. Path Alias | 🟢 15min | 🟠 Medio | Todos |
| 5. Datos | 🟢 30min | 🟠 Medio | Data-heavy |
| 6. Layouts | 🟡 1h | 🟠 Medio | Multi-page |
| 7. Generator | 🟡 1h | 🟢 Bajo | Grid-based |
| 8. Testing | 🔴 2h | 🔴 Alto | Teams |
| 9. Strict TS | 🔴 3h | 🔴 Alto | Teams |
| 10. CSS Modules | 🔴 2h | 🟠 Medio | Large projects |

---

## 🎯 Checklist de Implementación

### Antes de Empezar
- [ ] Proyecto limpio sin cambios sin commitear
- [ ] Rama de feature creada
- [ ] Equipo alineado en DX goals

### Fase por Fase
- [ ] Fase 1: Estilos separados + tests de build
- [ ] Fase 2: Índices + actualizar imports
- [ ] Fase 3: Constantes + refactor de scripts
- [ ] Fase 4: Aliases + actualizar imports
- [ ] Fase 5: Datos separados + tipos
- [ ] Fase 6: Layouts jerárquicos
- [ ] Fase 7: Generator script + npm task
- [ ] Fase 8: Vitest config + tests
- [ ] Fase 9: Strict mode + types globales
- [ ] Fase 10: CSS Modules (optional)

### Validación
- [ ] Build passing (no errors)
- [ ] Tests pasando (npm run test)
- [ ] Linter happy (TSC)
- [ ] PR review completado
- [ ] Documentación actualizada

---

## ⚠️ Anti-patrones a Evitar

```typescript
❌ Magic numbers
export const timings = {
  animation: 1,  // ¿Segundos? ¿Milisegundos?
  delay: -0.5,   // ¿Por qué negativo?
}

✅ Named constants
export const ANIMATION_TIMINGS = {
  SLOWEST: 1,      // En segundos
  NORMAL: 0.6,
  FAST: 0.3,
} as const;

❌ Imports profundos
import X from '../../../components/hero/Hero.astro'

✅ Path aliases + Indices
import { Hero } from '@/components'

❌ Estilos globales sin scoping
.container { padding: 1rem; }  // Puede chocar en otro lugar

✅ CSS Modules
.container { padding: 1rem; }  // Scoped automáticamente

❌ Duplicación de lógica
if (window.matchMedia(...).matches) { ... }  // En 2+ lugares

✅ Utilidades reutilizables
import { shouldAnimateByPreference } from '@/lib'
if (shouldAnimateByPreference()) { ... }

❌ Sin tipado
const nav = site.nav  // Tipo implícito

✅ Tipado explícito
import type { NavItem } from '@/data'
const nav: NavItem[] = site.nav
```

---

## 🔄 Adaptación a Otros Stacks

### React + TypeScript + Vite
```
Fase 1: ✅ (mismo)
Fase 2: ✅ (mismo, pero con .tsx)
Fase 3: ✅ (mismo, para hooks/utils)
Fase 4: ✅ (mismo en vite.config.ts)
Fase 5: ✅ (mismo)
Fase 6: Adaptar a React layouts (no Astro)
Fase 7: ✅ (mismo generator)
Fase 8: ✅ (Vitest igual)
Fase 9: ✅ (mismo)
Fase 10: ✅ (CSS Modules mismo)
```

### Vue + TypeScript
```
Fase 1-5: ✅ Idéntico
Fase 6: Adaptar a Vue layouts
Fase 7-10: ✅ Idéntico
```

### Svelte
```
Similar a Vue, Fase 6 adaptar a Svelte components
```

### Backend (Node.js/Express)
```
Fase 1: N/A (sin CSS)
Fase 2-5: ✅ Idéntico
Fase 6: Adaptar a middleware/routes
Fase 7: Generar schemas, migrations, etc.
Fase 8-9: ✅ Idéntico (testing, strict TS)
Fase 10: N/A (sin CSS)
```

---

## 📚 Recursos

### Configuración Recomendada

```json
// tsconfig.json (baseline strict)
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true
  }
}
```

```json
// package.json (scripts)
{
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage",
    "type-check": "astro check",
    "lint": "eslint src",
    "format": "prettier --write src"
  }
}
```

---

## 🎓 Próximos Pasos Opcionales

Después de las 10 fases core:

1. **E2E Testing**: Playwright/Cypress para flujos completos
2. **Storybook**: Documentar componentes visualmente
3. **CI/CD**: GitHub Actions, pre-commit hooks
4. **Performance**: Lighthouse CI, bundler analysis
5. **Accessibility**: axe audits, WCAG compliance
6. **Monitoring**: Errores, métricas, observabilidad
7. **Documentation**: Mermaid diagramas, ADRs
8. **Security**: Dependabot, SAST scanning

---

## 📝 Ejemplo Completo: Migración

**Before:**
```
src/
├── global.css (289 líneas)
└── components/
    └── Hero.astro
```

**After:**
```
src/
├── styles/
│   ├── global.css (11 líneas)
│   ├── base/ → typography, reset
│   ├── theme/ → colors, layout
│   ├── components/ → grid, animations
│   └── animations/
├── lib/
│   ├── index.ts (re-exports)
│   ├── constants.ts (40+ valores)
│   ├── motion.ts
│   ├── animations/
│   │   ├── scroll.ts
│   │   ├── hero.ts
│   │   └── __tests__/
│   └── gsap.ts, lenis.ts
├── data/
│   ├── index.ts
│   ├── types.ts
│   ├── config, navigation, social, content
│   └── site.ts (agregado)
├── components/
│   ├── index.ts
│   ├── hero/
│   │   ├── index.ts
│   │   ├── Hero.module.css
│   │   └── Hero.astro
│   └── grid/
├── layouts/
│   ├── BaseLayout.astro
│   ├── PageLayout.astro
│   ├── SectionLayout.astro
│   └── HeroLayout.astro
└── types/
    └── index.ts

scripts/
└── generate-grid-css.ts

vitest.config.ts
tsconfig.json (strict mode)
```

**Resultado:**
- ✅ 96% menos código en global.css
- ✅ 80% menos profundidad en imports
- ✅ 100% tipado con TypeScript strict
- ✅ 5+ tests funcionando
- ✅ Código autodocumentado y reutilizable
- ✅ 0 breaking changes (100% compatible)

---

## 🤝 Cómo Usar Este Documento

### Para Implementar en un Proyecto Nuevo

1. Leer "Principios Core" (5 min)
2. Seguir fases 1-5 como baseline (2-3 horas)
3. Agregar fases 6-10 según necesidad del proyecto (2-8 horas)

### Para Auditar un Proyecto Existente

1. Evaluar qué fases ya están implementadas
2. Priorizar las que traen más impacto
3. Usar como checklist de refactoring

### Para Entrenar a Nuevos Desarrolladores

1. Compartir "Principios Core"
2. Explicar estructura del proyecto (Fase 1-5)
3. Practicar writing tests (Fase 8)
4. Enforcer TypeScript strict mode (Fase 9)

### Para Agentes/Automatización

> Este documento define el estándar DX esperado.
> Los agentes deben seguir estas convenciones cuando generen código.

```
Agent instruction: "Follow the 10-Phase DX Framework defined in DX_PRINCIPLES.md"
- Prefer Fase 1: Separate concerns by domain
- Always use Fase 4: Path aliases (@/*)
- Write types per Fase 9: TypeScript strict
- Implement tests per Fase 8: Vitest
- Use Fase 3: Centralized constants
```

---

## 📖 Versión

- **Versión:** 1.0
- **Última actualización:** 2024
- **Aplicable a:** Cualquier stack web moderno
- **Lenguajes:** TypeScript, JavaScript, CSS
- **Frameworks:** Astro, React, Vue, Svelte, Next.js, Nuxt

---

**¿Preguntas? Expandir sección: **[Preguntas Frecuentes](#faq)**

---

## FAQ

### P: ¿Debo implementar todas las 10 fases?

**R:** No. Las fases 1-5 son core (aplicable a cualquier proyecto). Las fases 6-10 son opcionales según:
- Fase 6: Multi-page apps
- Fase 7: Proyectos con grid repetitivo
- Fase 8-9: Equipos grandes
- Fase 10: Proyectos grandes con muchos componentes

### P: ¿Puedo hacer esto en un proyecto existente?

**R:** Sí. Haz un branch feature y refactor fase por fase. Cada fase es independiente y backward-compatible (sin breaking changes).

### P: ¿Cuánto tiempo toma implementar?

**R:** 
- Fases 1-5: 2-3 horas
- Fases 6-7: +2 horas
- Fases 8-10: +6-8 horas
- **Total:** ~12-13 horas para todo

### P: ¿Funciona con [mi stack]?

**R:** Sí. El framework es agnóstico. Ver "Adaptación a Otros Stacks" arriba.

### P: ¿Esto es obligatorio?

**R:** No es obligatorio, pero hace el código:
- Más fácil de mantener
- Más fácil de entender
- Más fácil de testear
- Más fácil de escalar

Es una inversión upfront que paga a largo plazo.

---
