# CTP Real Estate — Diseño del Sitio Web

**Fecha:** 2026-04-29  
**Estado:** Aprobado  
**Stack:** Next.js 15 · TypeScript · Tailwind CSS · Framer Motion · Google Sheets API

---

## 1. Visión General

Sitio web de venta de parcelas rurales en Uruguay para **CTP Real Estate**. El objetivo central es generación de leads cualificados mediante una experiencia visual premium (estética Pure Minimal), SEO focalizado en búsquedas de alta intención, y conversión a través de formulario + WhatsApp.

El sitio opera en **español** exclusivamente.

---

## 2. Stack Tecnológico

| Tecnología | Uso |
|---|---|
| Next.js 15 (App Router) | Framework principal, SSR + SSG |
| TypeScript | Tipado estricto en todo el proyecto |
| Tailwind CSS | Estilos — sin CSS-in-JS |
| Framer Motion | Transiciones de página + animaciones de scroll |
| Lenis | Scroll suave global |
| googleapis | Google Sheets API v4 (Service Account) |
| next/image | Optimización de imágenes (WebP, lazy load) |

**Deployment:** Vercel  
**No se usa:** base de datos, auth de usuarios, CMS externo, Cloudinary

---

## 3. Identidad Visual

### Paleta de colores (Manual de Marca CTP 2025)

| Token | Hex | Uso |
|---|---|---|
| `color-black` | `#0A0A0A` | Fondo dark, texto principal |
| `color-white` | `#FFFFFF` | Fondo light, texto sobre oscuro |
| `color-graphite` | `#2E2E2E` | Textos secundarios |
| `color-gray` | `#D9D9D9` | Bordes, separadores |
| `color-gold` | `#C6A665` | Acentos premium, CTA hover |
| `color-green` | `#2C4A3E` | Acentos naturaleza |

### Tipografía

- **Familia:** Montserrat (Google Fonts)
- **Pesos:** 300 (light), 400 (regular), 600 (semibold), 700 (bold)
- **Estilo:** letra espaciada, sin serifa, alineación a la izquierda por defecto

### Logo

Dos variantes disponibles en `/public/brand/`:
- `logo-negro.png` — para fondos blancos
- `logo-blanco.png` — para fondos oscuros (hero, navbar scrolled)

### Estética

Pure Minimal: mucho espacio en blanco, tipografía grande, imágenes protagonistas, animaciones sutiles. El dorado (`#C6A665`) aparece solo como acento — nunca como color dominante.

---

## 4. Arquitectura del Proyecto

### Rutas

```
/                              → Home
/parcelas-la-martina           → Proyecto La Martina
/parcelas-aires-manantiales    → Proyecto Aires de Manantiales
/parcelas-ama-jose-ignacio     → Proyecto Ama José Ignacio
/parcelas-tierras-del-este     → Proyecto Tierras del Este
/sitemap.xml                   → Generado automáticamente
/robots.txt                    → Permisivo
```

### Estructura de carpetas

```
/app
  layout.tsx                   → Root layout: Lenis + Framer + fuentes
  page.tsx                     → Home
  /parcelas-[slug]
    page.tsx                   → Página dinámica de proyecto
    loading.tsx                → Skeleton de carga

/components
  /ui
    Button.tsx
    Logo.tsx
    Nav.tsx
  /home
    Hero.tsx                   → Video fullscreen + logotipo
    ProjectGrid.tsx            → Grid 2×2 de proyectos
    ProjectCard.tsx            → Card con hover + transición
  /project
    ProjectHero.tsx            → Imagen hero + precio + CTA
    Gallery.tsx                → Grid masonry + lightbox
    Masterplan.tsx             → Plano con zoom
    ValueProps.tsx             → 3 puntos destacados con íconos
    Amenities.tsx              → Lista de amenities
    NearbyPoints.tsx           → Entorno + distancias (SEO)
    MapEmbed.tsx               → Google Maps iframe con coordenadas
    FinancingCalc.tsx          → Calculadora interactiva (Client)
    ContactForm.tsx            → Formulario → Google Sheets (Client)
  /shared
    WhatsAppButton.tsx         → Botón flotante fijo
    StickyContact.tsx          → CTA sticky en scroll
    PageTransition.tsx         → Wrapper Framer Motion

/lib
  sheets.ts                    → Inicialización googleapis + readSheet() + writeLeadToSheet()
  projects.ts                  → getProjects() + getProjectBySlug()
  types.ts                     → Interfaces TypeScript

/public
  /brand
    logo-negro.png
    logo-blanco.png
  /proyectos
    /la-martina
      hero.jpg
      galeria-1.jpg … galeria-8.jpg
      plano.jpg
      video.mp4
    /aires-manantiales
      (misma estructura)
    /ama-jose-ignacio
      (misma estructura)
    /tierras-del-este
      (misma estructura)
```

---

## 5. Fuente de Datos — Google Sheets

**Service Account:** `web-uruguay-sheet@web-uruguay.iam.gserviceaccount.com`  
**Variables de entorno** (en `.env.local`, no versionado):

```
GOOGLE_SERVICE_ACCOUNT_EMAIL=web-uruguay-sheet@web-uruguay.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n..."
GOOGLE_SHEET_ID=<ID del Sheet una vez creado>
```

### Pestaña `proyectos` (columnas A–N)

| Col | Campo | Tipo | Ejemplo |
|---|---|---|---|
| A | `slug` | string | `la-martina` |
| B | `nombre` | string | `La Martina` |
| C | `ubicacion` | string | `José Ignacio, Uruguay` |
| D | `precio_desde` | number | `90000` |
| E | `precio_hasta` | number | `130000` |
| F | `descripcion` | string | Texto largo SEO |
| G | `destacados` | csv | `Frente al mar,Seguridad 24h` |
| H | `amenities` | csv | `Acceso controlado,Caminería interna` |
| I | `puntos_cercanos` | csv | `Playa a 500m,José Ignacio a 8km` |
| J | `coordenadas` | string | `-34.8412,-54.6721` |
| K | `financiamiento_inicial` | number | `40` |
| L | `financiamiento_cuotas` | csv | `12,24,36` |
| M | `financiamiento_tasa` | csv | `0.6,0.7,0.75` |
| N | `activo` | boolean | `TRUE` |

### Pestaña `leads` (escritura desde formulario)

| `timestamp` | `nombre` | `email` | `telefono` | `mensaje` | `proyecto` |

### Pestaña `config`

| Clave | Valor |
|---|---|
| `whatsapp_numero` | `+59899XXXXXX` |
| `whatsapp_mensaje` | `Hola, me interesa información sobre...` |
| `email_contacto` | `info@ctprealestate.com` |

### Caché

- `React.cache()` wrapping `getProjects()` y `getProjectBySlug()`
- `fetch` con `{ next: { revalidate: 30 } }` en llamadas al Sheet
- ISR: páginas de proyectos se regeneran cada 30 segundos en background

---

## 6. Proyectos — Inventario V1

| Proyecto | Slug | Precio desde | Precio hasta |
|---|---|---|---|
| La Martina | `la-martina` | USD $90,000 | USD $130,000 |
| Aires de Manantiales | `aires-manantiales` | USD $70,000 | USD $100,000 |
| Ama José Ignacio | `ama-jose-ignacio` | USD $55,000 | USD $130,000 |
| Tierras del Este | `tierras-del-este` | USD $80,000 | USD $90,000 |

Cada proyecto incluye: 7–9 fotos de galería, video drone, plano del loteo, archivos KMZ.

---

## 7. Páginas

### Home (`/`)

1. **Hero fullscreen** — video de fondo con overlay oscuro, logo centrado en blanco, flecha de scroll animada
2. **Grid de proyectos** — 2×2 desktop / 1 col mobile. Cards con imagen, nombre, ubicación, precio desde. Hover: escala imagen + aparece CTA
3. **Footer** — logo, datos de contacto, redes sociales

Transición al hacer click en proyecto: Framer Motion `AnimatePresence` fade+slideUp antes de navegar.

### Página de Proyecto (`/parcelas-[slug]`)

Secciones en orden:
1. **Hero** — imagen fullscreen + nombre + "Desde USD $XX,000" + botón "Consultar"
2. **Propuesta de valor** — 3 highlights con íconos (desde `destacados` del Sheet)
3. **Galería** — grid masonry, lazy load, lightbox nativo o con Yet Another React Lightbox
4. **Plano maestro** — imagen del plano con capacidad de zoom (react-medium-image-zoom)
5. **Amenities** — lista con íconos desde campo `amenities`
6. **Entorno** — puntos cercanos con distancias desde `puntos_cercanos` (texto enriquecido para SEO local)
7. **Mapa** — Google Maps embed con pin en `coordenadas`
8. **Calculadora de financiamiento** — Client Component (ver sección 8)
9. **Formulario de contacto** — Client Component, escribe en pestaña `leads`
10. **WhatsApp flotante** — fijo esquina inferior derecha en todas las páginas

---

## 8. Calculadora de Financiamiento

**Component:** `FinancingCalc.tsx` (Client Component)

**Inputs:**
- Precio del lote (pre-cargado desde props, editable por el usuario)
- Plazo: selector radio 12 / 24 / 36 cuotas
- Tasa aplicada automáticamente: 0.6% / 0.7% / 0.75% mensual según plazo

**Fórmula:**
```
pie = precio × 0.40
saldo = precio × 0.60
tasa_mensual = tasa / 100
cuota = saldo × tasa_mensual / (1 - (1 + tasa_mensual)^(-n))
```

**Output (animado con framer-motion):**
- Pie inicial: USD $XX,000
- Cuota mensual: USD $X,XXX
- Total del financiamiento: USD $XX,XXX

---

## 9. SEO

### Metadata dinámica (`generateMetadata()`)

```
Título:      "Parcelas en [ubicacion] desde USD $[precio_desde] | [nombre]"
Description: "[nombre] — parcelas en [ubicacion], Uruguay. Desde USD $[precio_desde]
              con financiamiento en [cuotas] cuotas. [primer punto cercano]. Consulta hoy."
OG Image:    /proyectos/[slug]/hero.jpg
OG Type:     website
```

### JSON-LD (Schema.org)

Tipo `Product` por proyecto:
```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Parcelas [nombre]",
  "description": "[descripcion]",
  "offers": {
    "@type": "Offer",
    "priceCurrency": "USD",
    "price": "[precio_desde]",
    "availability": "https://schema.org/InStock"
  },
  "areaServed": {
    "@type": "Place",
    "name": "[ubicacion]"
  }
}
```

### Archivos técnicos

- `sitemap.xml` — generado en `/app/sitemap.ts` con todos los slugs activos
- `robots.txt` — generado en `/app/robots.ts`, permisivo
- URLs semánticas con keywords: `/parcelas-[slug]`

---

## 10. Animaciones

| Elemento | Animación | Librería |
|---|---|---|
| Transición de página | fade + translateY(-20px) → 0 | Framer Motion `AnimatePresence` |
| Cards en home | fadeInUp con stagger al cargar | Framer Motion |
| Secciones en scroll | fadeInUp al entrar viewport | Framer Motion `whileInView` |
| Galería | stagger de imágenes | Framer Motion |
| Calculadora | contador numérico animado | Framer Motion |
| Scroll global | suavizado | Lenis |

---

## 11. Conversión y Leads

- **WhatsApp flotante:** botón fijo, número desde `config` del Sheet, mensaje pre-cargado con nombre del proyecto actual
- **Formulario:** nombre, email, teléfono, mensaje → POST a Server Action → escribe fila en pestaña `leads`
- **CTA sticky:** aparece al hacer scroll pasado el hero, enlaza al formulario

---

## 12. Seguridad y Variables de Entorno

`.env.local` (no versionado, en `.gitignore`):
```
GOOGLE_SERVICE_ACCOUNT_EMAIL=
GOOGLE_PRIVATE_KEY=
GOOGLE_SHEET_ID=
NEXT_PUBLIC_GOOGLE_MAPS_KEY=   # opcional, para embed de mapa
```

La private key se formatea correctamente: `replace(/\\n/g, '\n')` al inicializar el cliente googleapis.

---

## 13. Performance

- `next/image` para todas las imágenes (WebP automático, `sizes` responsivos, `priority` en hero)
- Videos con `autoplay muted loop playsInline` y `preload="none"` en cards, `preload="metadata"` en hero
- Code splitting automático de Next.js
- Fonts: Montserrat via `next/font/google` (sin FOUT)
- Core Web Vitals: LCP < 2.5s (imagen hero con `priority`), CLS = 0 (dimensiones explícitas en imágenes)
