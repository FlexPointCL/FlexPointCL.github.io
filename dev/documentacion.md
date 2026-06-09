# Documentación — FlexPoint Landing Hub

Documento técnico y operativo completo del ecosistema FlexPoint.  
Última actualización: Mayo 2026

---

## Índice

1. [Estructura del proyecto](#1-estructura-del-proyecto)
2. [Repositorios GitHub](#2-repositorios-github)
3. [Landing Page (flexpoint.cl)](#3-landing-page-flexpointcl)
4. [Calculadora ROI (flexpoint.cl/roi)](#4-calculadora-roi-flexpointclroi)
5. [Sistema de Requerimientos (cotizaciones)](#5-sistema-de-requerimientos-cotizaciones)
6. [Infraestructura y deploy](#6-infraestructura-y-deploy)
7. [SEO y visibilidad en Google](#7-seo-y-visibilidad-en-google)
8. [Variables de entorno](#8-variables-de-entorno)
9. [Skills instalados](#9-skills-instalados)

---

## 1. Estructura del proyecto

Todo el trabajo de FlexPoint está centralizado en una sola carpeta en el Mac:

```
/Documents/Claude/PROYECTOS/FlexPoint Landing/
│
├── index.html              ← Landing page principal
├── robots.txt              ← Control de crawlers
├── llms.txt                ← Ficha para modelos de IA
├── logo-azul.png           ← Logo oficial PNG
├── logo-azul.webp          ← Logo oficial WebP (más liviano)
├── CLAUDE.md               ← Instrucciones para Claude Code
├── configuracion.md        ← Resumen técnico de repos y deploy
├── documentacion.md        ← Este archivo
├── .gitignore              ← Qué no sube a GitHub
│
│   (carpeta propuesta/ eliminada en Mayo 2026 — era versión legacy del sistema de requerimientos)
│
├── roi/                    ← Calculadora ROI (Next.js)
│   ├── src/
│   ├── public/
│   ├── next.config.ts      (basePath: /roi)
│   └── package.json
│
└── requerimientos/         ← Sistema de cotizaciones
    ├── web/                ← App Next.js
    │   ├── app/
    │   │   ├── page.tsx            ← Formulario principal
    │   │   ├── audio/page.tsx      ← Subida de grabaciones
    │   │   └── api/
    │   │       ├── analizar/       ← Claude analiza si faltan datos
    │   │       ├── generar/        ← Claude genera propuesta + Word + Email
    │   │       └── audio/          ← Transcripción de grabaciones
    │   ├── components/
    │   ├── lib/
    │   │   ├── claude.ts           ← Cliente Anthropic SDK
    │   │   ├── generarWord.ts      ← Genera archivo .docx
    │   │   └── enviarEmail.ts      ← Envía email con Resend
    │   └── .env.local              ← API keys (NO subir a GitHub)
    ├── FORMULARIO_REQUERIMIENTOS.docx
    └── PROPUESTA_TEMPLATE.md
```

---

## 2. Repositorios GitHub

| Repo | URL | Contenido | Se despliega en |
|------|-----|-----------|-----------------|
| `flexpoint-landing` | github.com/FlexPointCL/flexpoint-landing | Landing + ROI + requerimientos (código fuente) | Solo backup |
| `FlexPointCL.github.io` | github.com/FlexPointCL/FlexPointCL.github.io | index.html, robots.txt, llms.txt (producción) | **flexpoint.cl** |
| `CLAUDE` | github.com/FlexPointCL/CLAUDE | Backup general de otros proyectos | Solo backup |

> Los repos `flexroi` y `roi` fueron eliminados en Mayo 2026 — su contenido está ahora en `flexpoint-landing/roi/`.

---

## 3. Landing Page (flexpoint.cl)

**Archivo:** `index.html`  
**Tecnología:** HTML/CSS/JS puro, todo inline, sin framework ni build system.  
**Ver en local:** abrir `index.html` directo en el browser, o:

```bash
cd "/Users/jorgecorvalanf/Documents/Claude/PROYECTOS/FlexPoint Landing"
python3 -m http.server 8080
# Abrir http://localhost:8080
```

### Secciones de la página (en orden)

| Sección | ID | Descripción |
|---------|----|-------------|
| Nav | `nav` | Controles (tema, fuente, idioma) + links + CTA WhatsApp |
| Hero | `#hero` | Logo, H1, subtítulo, 3 botones CTA |
| Productos | `#productos` | Cards FLEXIA, FLEXWA MASIVO, FLEXWACHAT |
| Servicios | `#servicios` | 6 cards de servicios a medida |
| Por qué FlexPoint | `#porque` | 4 razones diferenciadoras |
| Stats | `#stats` | Métricas animadas (+40%, 24/7, +3x, 100%) |
| Testimonios | `#testimonios` | 3 cards de clientes |
| FAQ | `#faq` | 10 preguntas frecuentes (7 base + 3 SEO) |
| Contacto | `#contacto` | CTA final + botones Agendar/WhatsApp |
| Footer | `footer` | Links, copyright |

### CTAs del Hero

1. `📊 Calcular mi ahorro automatizando` → `flexpointcl.github.io/roi`
2. `📅 Agendar reunión gratis` → Google Calendar
3. `WhatsApp` → wa.me/56985835922

### Sistema de Design

| Variable CSS | Valor | Uso |
|-------------|-------|-----|
| `--verde` | `#4f8bff` | Azul marca, acentos, CTAs |
| `--fondo` | `#090912` | Fondo oscuro |
| `--card` | `#0f0f1c` | Fondo de cards |
| `--borde` | `#1a1a30` | Bordes |
| `--texto` | `#eaeaf5` | Texto principal |
| `--suave` | `#7878a8` | Texto secundario |

Modo claro activado con clase `body.light-mode`.  
Fuentes: **Inter** (cuerpo) + **Space Grotesk** (títulos/CTAs) — Google Fonts.

### JavaScript (módulos inline)

| Módulo | Función |
|--------|---------|
| Constellation particles | Canvas animado de partículas que siguen el cursor |
| Typewriter hero | Escribe el H1 letra por letra al cargar |
| Typewriter secciones | Escribe H2 de cada sección al entrar en viewport |
| Scroll reveal | Fade+slide de cards al entrar en viewport |
| Counter animation | Números de stats cuentan desde 0 al entrar en viewport |
| Tema claro/oscuro | Toggle + localStorage |
| Tamaño fuente | A- / A+ con localStorage |
| Idioma ES/EN | Toggle `data-es` / `data-en` + `data-tw-en` + localStorage. Cubre toda la página: nav, hero, productos, servicios, por qué, stats, testimonios, FAQ, contacto, footer. Los elementos typewriter cambian al vuelo si ya fueron animados. |
| openCalendly() | Abre Google Calendar en nueva pestaña |

### Deploy landing

```bash
cd /tmp && git clone https://github.com/FlexPointCL/FlexPointCL.github.io.git
LANDING="/Users/jorgecorvalanf/Documents/Claude/PROYECTOS/FlexPoint Landing"
cp "$LANDING/index.html"  /tmp/FlexPointCL.github.io/
cp "$LANDING/robots.txt"  /tmp/FlexPointCL.github.io/
cp "$LANDING/llms.txt"    /tmp/FlexPointCL.github.io/
cd /tmp/FlexPointCL.github.io
git add index.html robots.txt llms.txt
git commit -m "descripción"
git push
# Cloudflare Pages despliega automático en ~30 segundos
```

---

## 4. Calculadora ROI (flexpoint.cl/roi)

**Carpeta:** `roi/`  
**Tecnología:** Next.js 15, TypeScript, Tailwind CSS  
**URL producción:** `flexpoint.cl/roi`  
**Repo de backup:** `flexpoint-landing` (carpeta `roi/`)

### Arquitectura

```
CalculatorContext (estado global + paso actual)
  └── Calculator.tsx (shell: header, progress bar, paso activo, footer)
        ├── Step1 – Step7 (cada paso lee/escribe via useCalculator())
        └── Flexpointcito (widget flotante de chat, lee contexto)
```

- Sin backend, sin API, sin base de datos
- Estado 100% en memoria (se pierde al cerrar el browser)
- `localStorage`: tema (`flexroi_theme`) e idioma (`flexroi_lang`: es/en/pt)

### Desarrollo local

```bash
cd "/Users/jorgecorvalanf/Documents/Claude/PROYECTOS/FlexPoint Landing/roi"
node_modules/.bin/next dev --webpack --port 5010
# IMPORTANTE: usar --webpack (Turbopack crashea con PostCSS + Tailwind v4)
# Abrir: http://localhost:5010/roi/
```

### Build y deploy

```bash
cd ".../roi"
npm run build          # genera /out (export estático, basePath: /roi)
# Copiar /out al repo FlexPointCL.github.io bajo /roi
cd /tmp/FlexPointCL.github.io
rm -rf roi/ && cp -r ".../roi/out" roi/
git add roi/ && git commit -m "update roi" && git push
```

---

## 4b. Backup de propuestas (requerimientos)

El sistema guarda **siempre** una copia local de cada propuesta generada, incluso si el email falla.

- **Carpeta:** `requerimientos/web/propuestas-backup/`
- **Archivos por propuesta:** `FECHA_NombreEmpresa.docx` + `FECHA_NombreEmpresa.json`
- **Comportamiento:** si Resend falla, el email no llega pero el `.docx` y el `.json` quedan en disco. La app igual muestra éxito al cliente.
- **La respuesta de la API incluye:** `{ ok: true, emailEnviado: true/false }` — permite detectar fallo sin mostrar error.

---

## 5. Sistema de Requerimientos (cotizaciones)

**Carpeta:** `requerimientos/web/`  
**Tecnología:** Next.js, TypeScript, Tailwind CSS  
**Estado:** Solo local — no tiene dominio de producción asignado aún  
**Propósito:** Cliente completa un formulario de requerimientos → Claude genera propuesta → se envía por email como archivo Word

### Flujo completo

```
Cliente llena formulario (21 campos)
    ↓
POST /api/analizar
    → Claude revisa si falta información crítica
    → Si faltan datos: muestra hasta 5 preguntas adicionales
    ↓
Cliente responde preguntas adicionales (opcional)
    ↓
POST /api/generar
    → Claude genera JSON con: módulos, cronograma, horas, precios
    → generarWord.ts convierte JSON → archivo .docx
    → enviarEmail.ts envía email a corvalan.jorge@gmail.com
        con el .docx adjunto y resumen HTML
    ↓
Pantalla de éxito
```

### Opción alternativa: subida de audio

```
Cliente sube grabación de reunión (MP3/WAV/M4A, máx 10MB)
    ↓
POST /api/audio
    → OpenAI Whisper transcribe el audio
    → Claude extrae los requerimientos del transcript
    → Continúa con el mismo flujo de generar/enviar
```

### Tarifa hardcodeada en el sistema

| Concepto | Valor |
|----------|-------|
| Valor hora desarrollo | $65.000 CLP |
| Mensualidad base (hasta 5 usuarios) | $149.900 CLP |
| Usuario adicional | $15.000 CLP/mes |
| Mínimo soporte | 6 meses |
| Pago | 50% al firmar / 50% entrega |

### Email de destino

Todas las propuestas llegan a: **corvalan.jorge@gmail.com**  
Remitente configurado: `propuestas@flexpoint.cl` (via Resend)

### Desarrollo local

```bash
cd "/Users/jorgecorvalanf/Documents/Claude/PROYECTOS/FlexPoint Landing/requerimientos/web"
npm install     # primera vez
npm run dev     # http://localhost:3000
```

### Por qué no funcionó el lunes

El archivo `.env.local` tenía las claves API vacías. Sin `ANTHROPIC_API_KEY`, Claude no puede analizar ni generar la propuesta. Sin `RESEND_API_KEY`, el email no se envía. El formulario se completó pero la app murió al intentar procesar.

**Los datos del lunes no se pueden recuperar** — la app no tiene base de datos. Si el email no llegó a `corvalan.jorge@gmail.com`, se perdió.

---

## 6. Infraestructura y deploy

### Producción (flexpoint.cl)

```
Dominio: flexpoint.cl (Cloudflare DNS)
  └── Cloudflare Pages
        └── github.com/FlexPointCL/FlexPointCL.github.io (rama main)
              → Cada push despliega automático en ~30 seg
              → SSL automático
              → CDN global Cloudflare
              → Analytics: Cloudflare Web Analytics (sin script)
```

### Apps de productos

| App | URL | Deploy |
|-----|-----|--------|
| FLEXIA | flexia.flexpoint.cl | Repo `flexia` |
| FLEXWA MASIVO | flexwamasivo.flexpoint.cl | Repo `flexwamasivo` |
| FLEXWACHAT | flexwachat.flexpoint.cl | Repo `flexchat-web` |

---

## 7. SEO y visibilidad en Google

### Objetivo

Rankear para: **"inteligencia artificial Chile"**, "automatización empresas Chile", "agente IA ventas Chile".

### Configuración actual

| Elemento | Valor |
|----------|-------|
| Title | `Inteligencia Artificial para Empresas en Chile \| FlexPoint` |
| H1 | `Inteligencia Artificial para tu Empresa` |
| Canonical | `https://flexpoint.cl` |
| Schema | `Organization` + `LocalBusiness` + `FAQPage` |
| robots meta | `index, follow` |

### Por qué H1/H2 usan `opacity:0` (no `visibility:hidden`)

Con `visibility:hidden`, Googlebot no puede leer el texto en el crawl estático inicial. Con `opacity:0`, el elemento existe en el DOM y Google lo indexa aunque visualmente no se vea. El typewriter JS lo hace visible con animación después.

### robots.txt — qué está permitido

| Crawler | Estado | Razón |
|---------|--------|-------|
| Googlebot | ✅ Permitido | Indexación normal |
| Google-Extended | ✅ Permitido | AI Overviews de Google (Gemini) |
| ClaudeBot | ✅ Permitido | Claude puede citar flexpoint.cl |
| GPTBot | ❌ Bloqueado | No queremos ser training data OpenAI |
| CCBot | ❌ Bloqueado | Common Crawl (training data) |
| Bytespider | ❌ Bloqueado | TikTok/ByteDance |
| meta-externalagent | ❌ Bloqueado | Meta AI |

### llms.txt

Archivo en `flexpoint.cl/llms.txt` — estándar emergente para que modelos de IA entiendan qué es FlexPoint, qué hace y cómo contactar. Equivale a un README para LLMs.

---

## 8. Variables de entorno

### requerimientos/web/.env.local

```
ANTHROPIC_API_KEY=sk-ant-...    ← API de Claude (Anthropic Console)
RESEND_API_KEY=re_...           ← API de Resend (para enviar emails)
OPENAI_API_KEY=sk-...           ← API de OpenAI (Whisper, transcripción audio)
```

**Dónde conseguirlas:**
- Anthropic: console.anthropic.com → API Keys
- Resend: resend.com → API Keys
- OpenAI: platform.openai.com → API Keys

> ⚠️ Estas claves NUNCA se suben a GitHub. El `.gitignore` ya las excluye.

### roi/ — sin variables de entorno

La calculadora ROI no tiene backend — no necesita API keys.

---

## 9. Skills instalados

Ubicados en `.claude/skills/` — disponibles en Claude Code al abrir esta carpeta.

| Skill | Cuándo usarlo |
|-------|---------------|
| `seo-audit` | `/seo-audit https://flexpoint.cl` — auditoría SEO completa |
| `ui-ux-pro-max` | Revisión y mejoras de diseño UX/UI |
| `frontend-design` | Construir componentes y páginas con alto estándar visual |
| `playwright-dev` | Testing automatizado del sitio |

---

## 10. Email @flexpoint.cl (pendiente de configurar)

Dos opciones evaluadas — aún no implementado:

| Opción | Costo | Capacidad | Estado |
|--------|-------|-----------|--------|
| **Cloudflare Email Routing** | Gratis | Solo recibir, reenvía a Gmail | Pendiente |
| **Google Workspace** | USD $6/mes/usuario | Enviar y recibir desde @flexpoint.cl | Pendiente |

**Recomendación:** Empezar con Cloudflare Email Routing (5 min, gratis).  
Panel Cloudflare → flexpoint.cl → **Email** → **Email Routing** → crear regla de reenvío a `corvalan.jorge@gmail.com`.

> Nota: Resend ya envía desde `propuestas@flexpoint.cl` para el sistema de requerimientos — eso ya funciona sin esta configuración.

---

## Contacto y accesos rápidos

| Recurso | Valor |
|---------|-------|
| WhatsApp FlexPoint | +56985835922 |
| Email | hola@flexpoint.cl |
| Email Jorge | corvalan.jorge@gmail.com |
| Google Calendar | calendar.app.google/fqu3U8FbReQNwwWR6 |
| Cloudflare Pages | Panel → flexpointcl-github-io.pages.dev |
| GitHub org | github.com/FlexPointCL |
