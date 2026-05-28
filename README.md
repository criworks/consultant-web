# Criworks

Sitio personal de marca como Product Designer. Construido con Astro, Tailwind CSS v4 y GSAP.

## Stack

- [Astro](https://astro.build) — sitio estático rápido
- [Tailwind CSS v4](https://tailwindcss.com) — estilos con `@theme` en `src/styles/global.css`
- [GSAP](https://gsap.com) — animaciones (`src/lib/gsap.ts`, ScrollTrigger listo)
- [Lucide](https://lucide.dev) — iconos SVG vía `@lucide/astro` (tree-shakable, sin JS en runtime)

## Desarrollo

```sh
npm install
npm run dev
```

Abre [http://localhost:4321](http://localhost:4321).

## Scripts

| Comando           | Acción              |
| ----------------- | ------------------- |
| `npm run dev`     | Servidor de desarrollo |
| `npm run build`   | Build de producción |
| `npm run preview` | Vista previa del build |

## Estructura

```
src/
├── components/
│   ├── grid/       # SiteGrid (16 cols, margin/gutter 16px)
│   └── hero/       # Sección hero
├── data/           # site.ts — copy y links
├── layouts/        # BaseLayout.astro
├── lib/            # Utilidades (gsap.ts)
├── pages/          # Rutas
└── styles/         # global.css + tokens + grid utilities
```

## Grid (Figma)

16 columnas stretch, margin `16px`, gutter `16px`. Usa `SiteGrid` con hijos directos y **siempre** combina `.site-col-start-{n}` + `.site-col-span-{m}` (ej. `site-col-start-2 site-col-span-10`). Ancho completo: `site-col-start-1 site-col-span-16`.

## Fuentes

Coloca `Switzer-Semibold.woff2` en `public/fonts/` (ver `public/fonts/README.md`).

## Iconos (Lucide)

```astro
---
import { ArrowRight, Mail } from '@lucide/astro';
---

<Mail size={14} stroke-width={1.5} class="text-foreground" />
```

Importa solo los iconos que uses. Lista completa: [lucide.dev/icons](https://lucide.dev/icons).

## Animaciones

Los scripts en las páginas importan `initGsap()` desde `src/lib/gsap.ts`. Usa atributos `data-animate` en el markup y timelines en `<script>` (sin `client:*` — Astro los empaqueta en el cliente).

Respeta `prefers-reduced-motion` en las animaciones de entrada.
