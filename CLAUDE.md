# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Qué es

Sitio de venta de **chacras rurales en Uruguay** para CTP Real Estate. Generación de leads vía formulario (escribe a Google Sheets) + botón de WhatsApp. Estética "Pure Minimal", solo en **español**. Deploy en Vercel.

Stack: Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · Framer Motion · Lenis · googleapis (Sheets API v4) · Vitest.

> Nota: el dominio del producto pasó de "parcelas" a **"chacras"** y las rutas de proyecto pasaron de `/parcelas-[slug]` a `/chacras/[slug]`. Los docs en `docs/superpowers/` describen el plan original y están **desactualizados** en esos puntos — el código es la fuente de verdad.

## Comandos

```bash
npm run dev              # servidor de desarrollo (localhost:3000)
npm run build            # build de producción
npm run lint             # eslint (eslint-config-next)
npm test                 # vitest run (una vez)
npm run test:watch       # vitest en modo watch
npm run test:coverage    # cobertura v8
npx vitest run __tests__/financing.test.ts   # un solo archivo de test
```

Tests viven en `__tests__/`. Cubren **lógica pura** (`lib/projects.ts` parsing, `lib/financing.ts`, `lib/validation.ts`), no componentes. El alias `@/*` apunta a la raíz del repo (configurado en `tsconfig.json` y replicado en `vitest.config.ts`).

## Arquitectura

**Google Sheets es el CMS.** No hay base de datos. El sitio lee datos de proyectos server-side y escribe leads vía Server Action.

- **`lib/sheets.ts`** — cliente googleapis con Service Account. `readSheet(range)` (envuelto en `React.cache`) y `writeLeadToSheet(values)` que hace append a la pestaña `leads`.
- **`lib/projects.ts`** — capa de datos. `getProyectos()`, `getProyectoBySlug()`, `getSiteConfig()` (todas `cache`d). `parseProyecto(row)` mapea una fila de la pestaña `proyectos` (rango `A2:Q1000`) al tipo `Proyecto`; `parseConfig(rows)` lee la pestaña `config`.
- **`lib/actions.ts`** — `submitLead` Server Action; valida con `lib/validation.ts` y llama a `writeLeadToSheet`.
- **`lib/financing.ts`** — fórmula de amortización de la calculadora (40% pie, 60% financiado, cuota mensual sobre saldo).

**Fallback sin Sheet:** si `GOOGLE_SHEET_ID` falta o es el placeholder, o si la llamada a la Sheet falla/devuelve vacío, `getProyectos()`/`getSiteConfig()` devuelven `MOCK_PROYECTOS` / config hardcodeada (ver `lib/projects.ts`). Esto permite correr el sitio en local sin credenciales. **Cualquier cambio de forma de datos debe replicarse en el mock y en `parseProyecto`** (los índices de columna en `parseProyecto` deben coincidir con el orden real de la Sheet).

**Caching / ISR:** las páginas declaran `export const revalidate = 10`. Para refrescar bajo demanda tras editar la Sheet existe `GET /api/revalidate?secret=<REVALIDATE_SECRET>` (opcionalmente `&path=/chacras/<slug>`); sin `path` revalida home + todos los proyectos.

**Estado del proyecto (columna `O`):** un string parseado por `parseEstado` en `lib/projects.ts` que deriva dos booleanos, `activo` y `proximamente`. Valores (sin distinguir mayúsculas/acentos/espacios):
- `TRUE` / `ACTIVO` → `activo=true`, normal.
- `PROXIMAMENTE` → `activo=true` + `proximamente=true`: navegable igual que un activo, pero con una franja diagonal "Próximamente" (`components/shared/EstadoRibbon.tsx`) en home, página de proyecto, `/proyectos` y `/mapa`. Es **solo visual**, no limita funcionalidad.
- `FALSE` / `SOLD_OUT` (o vacío/desconocido) → `activo=false`: **no** se genera estáticamente, da 404 en su página, se excluye del home y del nav — pero **sí** aparece como "Sold out" en `/proyectos` y `/mapa` (misma `EstadoRibbon`, label "Sold out"). Respetar esta regla al tocar listados.

`EstadoRibbon` recibe `label` y `size` (`'lg'` para heros a pantalla completa —responsive—, `'sm'` para la tarjeta del `/mapa`); el contenedor padre debe ser `relative` + `overflow-hidden`.

### Rutas (`app/`)

| Ruta | Archivo | Notas |
|---|---|---|
| `/` | `app/page.tsx` | Hero video + grid de proyectos activos |
| `/proyectos` | `app/proyectos/page.tsx` | Todos los proyectos (incl. SOLD OUT) |
| `/chacras/[slug]` | `app/chacras/[slug]/page.tsx` | Página de proyecto; `generateMetadata` + JSON-LD; 404 si inactivo |
| `/mapa` | `app/mapa/page.tsx` | Mapa interactivo (`@vis.gl/react-google-maps`) |
| `/api/revalidate` | `app/api/revalidate/route.ts` | Revalidación on-demand |
| `/sitemap.xml`, `/robots.txt` | `app/sitemap.ts`, `app/robots.ts` | Generados |

`app/layout.tsx` envuelve todo con `LenisProvider` (scroll suave), `Nav` (recibe proyectos activos) y `WhatsAppButton` (número desde `config`). Fuente Montserrat vía `next/font`. También define `metadataBase` (de `NEXT_PUBLIC_SITE_URL` o el dominio de producción de Vercel) y la imagen OG por defecto (`/public/og.jpg`, 1200×630) + Twitter card; las páginas de proyecto sobreescriben la imagen OG con su `hero`.

### Assets de imágenes (`public/proyectos/<slug>/`)

El slug **debe coincidir con el nombre de la carpeta** (ej. `aires-de-manantiales`); `parseProyecto` arma las rutas desde el slug, así que un desajuste rompe todas las imágenes. Por proyecto: `hero.jpg`, `intro-vertical.jpg` (retrato, lateral de la intro), `galeria-portada.jpg` (portada de la galería), `galeria-1..6.jpg` y opcional `video.mp4`. Las fotos van como JPG optimizado; `next.config.ts` declara `images.qualities` y los componentes piden `quality={90}`. El video del hero del home es `public/proyectos/home-hero.mp4` (hardcodeado en `components/home/HomeHero.tsx`). La Martina suma tres piezas propias, referenciadas desde `lib/proyecto-tema.ts`: `fondo.jpg` (textura verde salvia), `mapa-ilustrado.jpg` (mapa de ubicación de la introducción) y `plano-lotes.jpg` (plano del barrio). El favicon/ícono se genera en `app/` (`favicon.ico`, `icon.png`, `apple-icon.png`).

### Tema por proyecto (`lib/proyecto-tema.ts`)

`getTema(slug)` devuelve la personalización visual de cada proyecto. Por defecto todas las páginas usan el **tema oscuro** (`#0A0A0A` + dorado `#C6A665`). **La Martina** usa el **tema claro**: fondo verde salvia texturado, acento oliva `#AFA27F`, títulos verde `#475242` — tokens `--color-martina-*` en `app/globals.css`.

El tema también define las piezas que no tienen columna en la Sheet: `fondo` (textura), `mapaIlustrado` (reemplaza la foto vertical de la introducción), `planoLotes` (abre la sección de ubicación), `youtubeId` + `datosVideo` (sección `VideoShowcase`) y `fotoContacto`. Para replicar el look en otro proyecto basta con agregar una entrada en `TEMAS`; los componentes ya reciben `tema` y caen al tema oscuro si no hay entrada.

Dos detalles de contenido que vienen de la Sheet y se parsean en el cliente:
- `descripcion` se convierte en párrafos / subtítulo / lista con `parsearDescripcion` (líneas que empiezan con `•`, `-` o `*` son ítems con icono de pin; una línea suelta terminada en `:` es subtítulo).
- `descripcion_preview` se parte en dos líneas para el claim del hero editorial (`partirClaim`): respeta un salto de línea explícito y, si no lo hay, corta antes del último `" en "`.

### Componentes

Organizados por contexto: `components/home/`, `components/project/`, `components/proyectos/`, `components/mapa/`, `components/ui/` (Nav, Logo), `components/shared/` (Footer, WhatsAppButton, PageTransition, LenisProvider, StickyContact, InteractiveEmbed, EstadoRibbon).

`InteractiveEmbed` es el patrón reutilizable para iframes (mapa Google My Maps, masterplan): muestra un overlay "click para interactuar" que bloquea el scroll-jacking hasta que el usuario hace click, y coopera con Lenis vía `data-lenis-prevent`. Usarlo para cualquier iframe embebido nuevo.

## Estilos

**Tipografías.** Montserrat (`next/font/google`) para el sitio entero. **Meganté** (`app/fonts/megante.ttf`, `next/font/local`) es la display de La Martina: se aplica con la clase `font-marca` a los títulos de esa página (wordmark del hero, claim, h2 de cada sección y el precio "desde"). Los otros proyectos no la usan. Los labels y el texto de cuerpo siguen en Montserrat.

Nota sobre el token: en Tailwind v4 el nombre `--font-display` **no** genera utilidad (choca con el descriptor CSS `font-display`); por eso el token se llama `--font-marca`.

La fuente original no traía **ningún** glifo acentuado. `scripts/parchear-fuente.py` genera los compuestos (á é í ó ú ñ ü + mayúsculas, más una `i` sin punto para la í) a partir de `app/fonts/megante-original.ttf`; el resultado ya está commiteado. Solo hay que volver a correrlo si cambia la fuente base. Meganté tiene **un solo peso y no tiene cursiva** — evitar `font-medium`/`font-bold`/`italic` sobre `font-marca` para que el navegador no sintetice.

⚠️ El archivo es la versión **Personal Use Only** (`Meganté-Personal-Use-Only`, de Zamroni Hamzah). Para producción hace falta la licencia comercial.

Tailwind v4 sin archivo de config JS — los tokens de marca se definen en el bloque `@theme` de `app/globals.css` (`--color-gold #C6A665`, `--color-graphite`, `--color-green`, etc.). Estética minimalista: mucho espacio en blanco, tipografía liviana espaciada, el dorado solo como acento. Logos en `/public/brand/` (`logo-negro.png` para fondos claros, `logo-blanco.png` para oscuros).

## Variables de entorno

`.env.local` (no versionado). El sitio corre sin ellas gracias al fallback mock.

```
GOOGLE_SERVICE_ACCOUNT_EMAIL=
GOOGLE_PRIVATE_KEY=                     # con \n escapados; sheets.ts hace replace(/\\n/g,'\n')
GOOGLE_SHEET_ID=
REVALIDATE_SECRET=                      # para /api/revalidate
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=        # para /mapa
NEXT_PUBLIC_GOOGLE_MAPS_ID=             # mapId para /mapa
NEXT_PUBLIC_SITE_URL=                   # dominio final (metadataBase / imágenes OG al compartir); opcional, default = dominio de Vercel
```

## Estructura de la Google Sheet

- Pestaña **`proyectos`** (`A2:Q...`): slug, nombre, ubicacion, precio_desde, precio_hasta, descripcion, destacados(csv), amenities(csv), puntos_cercanos(csv), coordenadas, financiamiento_inicial, financiamiento_cuotas(csv), financiamiento_tasas(csv), descripcion_preview, activo (estado: `TRUE`/`PROXIMAMENTE`/`SOLD_OUT` — ver `parseEstado`), map_embed, masterplan_embed. Los campos `*_embed` aceptan una URL o un tag `<iframe>` completo (se extrae el `src` — ver `parseEmbedValue`).
- Pestaña **`leads`** (`A:F`): timestamp, nombre, email, telefono, mensaje, proyecto.
- Pestaña **`config`** (`A2:B`): pares clave/valor — `whatsapp_numero`, `whatsapp_mensaje`, `email_contacto`.
