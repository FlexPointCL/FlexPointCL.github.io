# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Carpeta central de FlexPoint — contiene la landing page, la calculadora ROI y el sitio de cotizaciones.

| Subcarpeta | Qué es | URL en producción |
|------------|--------|-------------------|
| `index.html` | Landing page principal (single-file HTML) | `flexpoint.cl` |
| `roi/` | Calculadora ROI — Next.js, repo propio (`flexroi.git`) | `flexpoint.cl/roi` |
| `requerimientos/web/` | Sitio interno de cotizaciones — Next.js | (local / por desplegar) |
| `robots.txt` | Control de crawlers — desplegado en GitHub Pages | `flexpoint.cl/robots.txt` |
| `llms.txt` | AI Search Readiness para Anthropic/OpenAI | `flexpoint.cl/llms.txt` |

La landing (`index.html`) no tiene build system — todo CSS y JS es inline.

## Development

Open `index.html` directly in a browser — no server needed. For live reload during editing, use any static server:

```bash
python3 -m http.server 8080
```

## Deployment

**CI/CD automático via Cloudflare Pages** — cada push al repo `FlexPointCL/FlexPointCL.github.io` despliega automáticamente a `flexpoint.cl`. No requiere purgar caché manualmente.

### Deploy landing (único paso)
```bash
cd /tmp && git clone https://github.com/FlexPointCL/FlexPointCL.github.io.git
cp "/Users/jorgecorvalanf/Documents/Claude/PROYECTOS/FlexPoint Landing/index.html" /tmp/FlexPointCL.github.io/
cp "/Users/jorgecorvalanf/Documents/Claude/PROYECTOS/FlexPoint Landing/robots.txt" /tmp/FlexPointCL.github.io/
cp "/Users/jorgecorvalanf/Documents/Claude/PROYECTOS/FlexPoint Landing/llms.txt" /tmp/FlexPointCL.github.io/
cd /tmp/FlexPointCL.github.io && git add index.html robots.txt llms.txt && git commit -m "descripción" && git push
```

### Deploy calculadora ROI (`flexpoint.cl/roi`)
```bash
cd "/Users/jorgecorvalanf/Documents/Claude/PROYECTOS/FlexPoint Landing/roi"
npm run build          # genera /out estático
# Copiar /out al repo GitHub Pages bajo /roi
cd /tmp/FlexPointCL.github.io && git add roi/ && git commit -m "update roi" && git push
```
El repo propio de ROI: `https://github.com/FlexPointCL/flexroi.git`

### Sincronizar monorepo CLAUDE (source of truth)
```bash
cd /Users/jorgecorvalanf/Documents/Claude
git add "PROYECTOS/FlexPoint Landing/"
git commit -m "update FlexPoint Landing"
git push
```

**Infraestructura:** Cloudflare Pages → `flexpointcl-github-io.pages.dev` → dominio custom `flexpoint.cl`. SSL automático. Analytics via Cloudflare Web Analytics (sin script, configuración automática).

## Design System

CSS custom properties in `:root` (actual current values):

| Variable | Value | Usage |
|----------|-------|-------|
| `--verde` | `#4f8bff` | Brand blue, accents, CTAs |
| `--fondo` | `#090912` | Page background |
| `--card` | `#0f0f1c` | Card backgrounds |
| `--borde` | `#1a1a30` | Borders, dividers |
| `--texto` | `#eaeaf5` | Primary text |
| `--suave` | `#7878a8` | Secondary/muted text |

Modo claro activado con clase `body.light-mode` — sobreescribe todas las variables. Toggle via `toggleTheme()`.

Fonts: Inter (body) + Space Grotesk (headings/CTAs), both from Google Fonts.

## Page Sections

HTML sections in order: `nav` → `#hero` → `#productos` → `#servicios` → `#porque` → stats → testimonios → `#faq` → `#contacto` → `footer`

## Nav Structure

- Izquierda: controles `.nav-controls` — 🌙 (tema), A- / A+ (fuente), ES/EN (idioma)
- Derecha: Servicios · Por qué FlexPoint · Contacto · **Hablar con un asesor** (CTA)
- Mobile: links ocultos excepto CTA via `li:not(:last-child) { display: none }`
- Sin logo, sin dropdown Apps en el nav

## Hero CTAs

Botones del hero (y sección `#contacto`) en este orden y layout:
1. **📊 Calcular mi ahorro automatizando** — fila completa (`btn-secondary btn-full`), enlaza a `https://flexpointcl.github.io/roi`
2. **📅 Agendar reunión** + **Hablar por WhatsApp** — fila inferior lado a lado (`.hero-actions-row`)

Clases de layout: `.hero-actions` (columna, centrado), `.hero-actions-row` (fila, flex), `.btn-full` (ancho 100%).
No hay botón de email en ninguna sección.

## Apps / Productos

Sección `#productos` con 3 cards en target="_blank":
- **FLEXIA** → `https://flexia.flexpoint.cl/` — IA que llama prospectos con voz humana (María)
- **FLEXWA MASIVO** → `https://flexwamasivo.flexpoint.cl/` — WhatsApp masivo sin Meta
- **FLEXWACHAT** → `https://flexwachat.flexpoint.cl/` — Bot WhatsApp inbound

Al agregar nuevas apps: solo añadir card en `#productos`.

## JavaScript Modules (all in single `<script>` block)

1. **Constellation particles** — `<canvas id="trailCanvas">` fixed full-screen (`z-index:0`, `pointer-events:none`). Key constants: `PCOUNT=100` (desktop), `LINK_DIST=180px`. Particles attract toward cursor (fuerza 0.09, radio 300px, velocidad máx 5). O(n²)/2 — no subir `PCOUNT` sobre 100 o el canvas se traba.

2. **Google Calendar** — `openCalendly()` abre `https://calendar.app.google/fqu3U8FbReQNwwWR6` en nueva pestaña. Sin iframe.

3. **Button effects** — hover/active/touch via clases JS `.btn-hover` / `.btn-press`.

4. **Counter animation** — `.stat-num[data-target]` cuenta al entrar en viewport vía `IntersectionObserver`.

5. **Scroll reveal** — `.service-card`, `.why-item`, `.stat-card`, `.testimonio-card`, `.producto-card` fade+slide al entrar en viewport.

6. **Typewriter secciones** — elementos con clase `tw-section` y atributo `data-tw="texto"` se escriben al entrar en viewport.

7. **Typewriter hero** — IIFE al final del script. Escribe `LINE1` y `LINE2` en `.hero-headline` a 52ms/char.

8. **Tema claro/oscuro** — `toggleTheme()` toggle clase `body.light-mode`, persiste en `localStorage`.

9. **Tamaño fuente** — `changeFontSize(delta)` ajusta `html` font-size entre 13px–22px, persiste en `localStorage`.

10. **Idioma ES/EN** — `toggleLang()` cambia elementos con atributos `data-es` / `data-en`, persiste en `localStorage`.

## SEO

- Schema.org `Organization` + `FAQPage` en `<head>` como JSON-LD
- `sitemap.xml` y `robots.txt` en el repo
- Google Search Console verificado, sitemap enviado
- Cloudflare Web Analytics activo (sin script adicional)

## Contact Info

- WhatsApp: `56985835922`
- Email: `hola@flexpoint.cl`
- Google Calendar: `https://calendar.app.google/fqu3U8FbReQNwwWR6`

## Images

- `logo-azul.png` / `logo-azul.webp` — disponibles pero no referenciadas en el nav actual
