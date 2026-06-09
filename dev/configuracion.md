# Configuración — FlexPoint Landing Hub

Documento central que explica qué hace cada cosa, cómo se despliega y qué sincroniza con GitHub.

---

## Estructura de carpetas

```
FlexPoint Landing/
├── index.html              ← Landing page principal (todo inline: CSS + JS)
├── robots.txt              ← Control de crawlers de Google e IA
├── llms.txt                ← Ficha para que modelos IA citen a FlexPoint
├── logo-azul.png / .webp   ← Logo oficial (PNG + WebP)
├── .gitignore              ← Qué NO sube al monorepo CLAUDE
├── CLAUDE.md               ← Instrucciones para Claude Code
├── configuracion.md        ← Este archivo
│
├── roi/                    ← Calculadora ROI (repo Git propio)
│   └── ...Next.js app...
│
├── requerimientos/         ← Sitio de cotizaciones (sin repo propio)
│   └── web/...Next.js app...
│
└── propuesta/              ← (legacy, no activo)
```

---

## Repositorios Git

| Repo | URL | Qué sube | Se despliega en |
|------|-----|----------|-----------------|
| `FlexPointCL/CLAUDE` | github.com/FlexPointCL/CLAUDE | Monorepo de conocimiento — solo archivos de texto, sin node_modules | Solo backup/consulta |
| `FlexPointCL/FlexPointCL.github.io` | github.com/FlexPointCL/FlexPointCL.github.io | `index.html`, `robots.txt`, `llms.txt` | **flexpoint.cl** via Cloudflare Pages |
| `FlexPointCL/flexroi` | github.com/FlexPointCL/flexroi | Código Next.js de la calculadora | flexpoint.cl/roi |

> **Importante:** La carpeta `roi/` tiene su propio `.git` apuntando a `flexroi.git`. Está excluida del monorepo CLAUDE con `.gitignore` para evitar conflictos de submodules.

---

## Infraestructura de producción

```
Usuario
  └── flexpoint.cl (dominio custom)
        └── Cloudflare Pages
              └── github.com/FlexPointCL/FlexPointCL.github.io (rama main)
                    ├── index.html      → flexpoint.cl/
                    ├── robots.txt      → flexpoint.cl/robots.txt
                    ├── llms.txt        → flexpoint.cl/llms.txt
                    └── roi/            → flexpoint.cl/roi (build estático de Next.js)
```

**SSL:** Automático via Cloudflare.  
**CDN / Caché:** Cloudflare global (no usar meta Cache-Control — no funciona en CDN).  
**Analytics:** Cloudflare Web Analytics (sin script adicional, configurado en el dashboard).

---

## Cómo hacer deploy

### Landing page (index.html, robots.txt, llms.txt)

```bash
cd /tmp && git clone https://github.com/FlexPointCL/FlexPointCL.github.io.git
LANDING="/Users/jorgecorvalanf/Documents/Claude/PROYECTOS/FlexPoint Landing"
cp "$LANDING/index.html" /tmp/FlexPointCL.github.io/
cp "$LANDING/robots.txt" /tmp/FlexPointCL.github.io/
cp "$LANDING/llms.txt"   /tmp/FlexPointCL.github.io/
cd /tmp/FlexPointCL.github.io
git add index.html robots.txt llms.txt
git commit -m "descripción del cambio"
git push
```

El push dispara Cloudflare Pages automáticamente. En ~30 segundos está en producción.

### Calculadora ROI (flexpoint.cl/roi)

```bash
cd "/Users/jorgecorvalanf/Documents/Claude/PROYECTOS/FlexPoint Landing/roi"
npm run build          # genera carpeta /out (export estático)

# Copiar /out al repo GitHub Pages bajo /roi
cd /tmp/FlexPointCL.github.io
rm -rf roi/ && cp -r ".../roi/out" roi/
git add roi/ && git commit -m "update roi" && git push
```

También se puede hacer push directo al repo `flexroi.git`:

```bash
cd ".../roi" && git add -A && git commit -m "cambios" && git push
```

### Sitio de cotizaciones (requerimientos/)

Actualmente solo corre en local. Para desplegar:
1. Definir dominio (ej: `cotizaciones.flexpoint.cl`)
2. Hacer build: `cd requerimientos/web && npm run build`
3. Subir a Vercel, Cloudflare Pages o donde corresponda.

---

## Archivos importantes explicados

### `index.html`
Landing page single-file. Todo el CSS está dentro de `<style>` y todo el JS dentro de `<script>`. Sin framework, sin build. Se abre directo en el browser.

**Para previsualizar en local:**
```bash
cd "/Users/jorgecorvalanf/Documents/Claude/PROYECTOS/FlexPoint Landing"
python3 -m http.server 8080
# Abrir: http://localhost:8080
```

### `robots.txt`
Controla qué crawlers de Google/IA pueden indexar el sitio.

| Crawler | Estado | Por qué |
|---------|--------|---------|
| Googlebot | ✅ Permitido | Indexación en Google Search |
| Google-Extended | ✅ Permitido | AI Overviews de Google (Gemini) |
| ClaudeBot | ✅ Permitido | Permite que Claude cite FlexPoint |
| GPTBot | ❌ Bloqueado | No queremos ser training data de OpenAI |
| CCBot | ❌ Bloqueado | Crawler de Common Crawl (training data) |
| Bytespider | ❌ Bloqueado | TikTok/ByteDance |
| meta-externalagent | ❌ Bloqueado | Meta AI |

### `llms.txt`
Archivo estándar emergente para decirle a modelos de IA qué es FlexPoint, qué hace y cómo contactar. Equivalente a un `robots.txt` pero para LLMs. Accesible en `flexpoint.cl/llms.txt`.

### `logo-azul.png / logo-azul.webp`
Logo oficial de FlexPoint en color azul sobre fondo transparente. El HTML usa `<picture>` con WebP como fuente primaria y PNG como fallback.

---

## SEO — Configuración actual

**Objetivo:** Rankear para "inteligencia artificial Chile", "automatización empresas Chile".

| Elemento | Valor |
|----------|-------|
| Title | `Inteligencia Artificial para Empresas en Chile \| FlexPoint` |
| H1 | `Inteligencia Artificial para tu Empresa` |
| Canonical | `https://flexpoint.cl` |
| Schema.org | `Organization` + `LocalBusiness` + `FAQPage` |
| OG Image | `https://flexpoint.cl/logo-azul.png` |
| Sitemap | `https://flexpoint.cl/sitemap.xml` |

**Técnico:** Los H1 y H2 usan `opacity:0` (no `visibility:hidden`) para que Googlebot los lea en el DOM estático aunque el typewriter JS los anime después.

---

## Qué NO sube a GitHub (`.gitignore`)

| Carpeta/archivo | Por qué se excluye |
|-----------------|-------------------|
| `roi/` | Tiene su propio repo git (`flexroi.git`). Subirlo al monorepo generaría un submodule no registrado |
| `requerimientos/web/node_modules/` | 358 paquetes — no tiene sentido versionar |
| `requerimientos/web/.next/` | Build local, se regenera |
| `.claude/skills/` | Skills locales instalados — grandes y no son código del proyecto |
| `.env*` | Secretos — NUNCA se suben |

---

## Skills instalados (solo esta carpeta)

Ubicados en `.claude/skills/` — disponibles cuando abres Claude Code desde esta carpeta.

| Skill | Para qué sirve |
|-------|----------------|
| `seo-audit` | Auditoría SEO completa del sitio con subagentes paralelos |
| `ui-ux-pro-max` | Revisión y mejoras de diseño UX/UI |
| `frontend-design` | Generar componentes y páginas con alto estándar de diseño |
| `playwright-dev` | Testing automatizado del sitio |

---

## Contacto y accesos

| Recurso | Valor |
|---------|-------|
| WhatsApp | +56985835922 |
| Email | hola@flexpoint.cl |
| Google Calendar | https://calendar.app.google/fqu3U8FbReQNwwWR6 |
| Calculadora ROI | https://flexpointcl.github.io/roi |
| GitHub org | https://github.com/FlexPointCL |
| Cloudflare Pages | Panel → flexpointcl-github-io.pages.dev |
