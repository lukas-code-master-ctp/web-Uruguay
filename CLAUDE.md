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

**Activo vs SOLD OUT:** el campo `activo` (columna `N`/booleano) controla visibilidad. Proyectos inactivos: **no** se generan estáticamente, dan 404 en su página, y se excluyen del home y del nav — pero **sí** aparecen en `/proyectos` y `/mapa`. Respetar esta regla al tocar listados.

### Rutas (`app/`)

| Ruta | Archivo | Notas |
|---|---|---|
| `/` | `app/page.tsx` | Hero video + grid de proyectos activos |
| `/proyectos` | `app/proyectos/page.tsx` | Todos los proyectos (incl. SOLD OUT) |
| `/chacras/[slug]` | `app/chacras/[slug]/page.tsx` | Página de proyecto; `generateMetadata` + JSON-LD; 404 si inactivo |
| `/mapa` | `app/mapa/page.tsx` | Mapa interactivo (`@vis.gl/react-google-maps`) |
| `/api/revalidate` | `app/api/revalidate/route.ts` | Revalidación on-demand |
| `/sitemap.xml`, `/robots.txt` | `app/sitemap.ts`, `app/robots.ts` | Generados |

`app/layout.tsx` envuelve todo con `LenisProvider` (scroll suave), `Nav` (recibe proyectos activos) y `WhatsAppButton` (número desde `config`). Fuente Montserrat vía `next/font`.

### Componentes

Organizados por contexto: `components/home/`, `components/project/`, `components/proyectos/`, `components/mapa/`, `components/ui/` (Nav, Logo), `components/shared/` (Footer, WhatsAppButton, PageTransition, LenisProvider, StickyContact, InteractiveEmbed).

`InteractiveEmbed` es el patrón reutilizable para iframes (mapa Google My Maps, masterplan): muestra un overlay "click para interactuar" que bloquea el scroll-jacking hasta que el usuario hace click, y coopera con Lenis vía `data-lenis-prevent`. Usarlo para cualquier iframe embebido nuevo.

## Estilos

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
```

## Estructura de la Google Sheet

- Pestaña **`proyectos`** (`A2:Q...`): slug, nombre, ubicacion, precio_desde, precio_hasta, descripcion, destacados(csv), amenities(csv), puntos_cercanos(csv), coordenadas, financiamiento_inicial, financiamiento_cuotas(csv), financiamiento_tasas(csv), descripcion_preview, activo(TRUE/FALSE), map_embed, masterplan_embed. Los campos `*_embed` aceptan una URL o un tag `<iframe>` completo (se extrae el `src` — ver `parseEmbedValue`).
- Pestaña **`leads`** (`A:F`): timestamp, nombre, email, telefono, mensaje, proyecto.
- Pestaña **`config`** (`A2:B`): pares clave/valor — `whatsapp_numero`, `whatsapp_mensaje`, `email_contacto`.
