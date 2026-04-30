# CTP Real Estate — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a production-ready Next.js 15 real estate website for CTP Real Estate (Uruguay) with Google Sheets CMS, Framer Motion animations, SEO-optimized project pages, financing calculator, and lead capture.

**Architecture:** Next.js App Router with Server Components by default. Google Sheets (Service Account) serves as the CMS — project data read server-side with 30s ISR cache, leads written via Server Action. Images and videos are served from `/public/proyectos/[slug]/` using `next/image`. Four project pages (`/parcelas-[slug]`) are statically generated at build time and revalidated every 30 seconds.

**Tech Stack:** Next.js 15, TypeScript, Tailwind CSS v4, Framer Motion, Lenis, googleapis (Google Sheets API v4), Vitest (unit tests), yet-another-react-lightbox, react-medium-image-zoom.

---

## File Map

```
app/
  layout.tsx               Root layout — Lenis provider + fonts + WhatsApp
  page.tsx                 Home page — Hero + ProjectGrid
  sitemap.ts               Dynamic sitemap
  robots.ts                robots.txt
  parcelas-[slug]/
    page.tsx               Project page — all sections + metadata + JSON-LD
    loading.tsx            Skeleton

components/
  ui/
    Button.tsx             Reusable CTA button (solid + outline variants)
    Logo.tsx               Logo switcher (negro/blanco by prop)
    Nav.tsx                Fixed nav — transparent→white on scroll
  home/
    HomeHero.tsx           Fullscreen video hero
    ProjectGrid.tsx        2×2 grid of ProjectCards
    ProjectCard.tsx        Card with hover animation + link
  project/
    ProjectHero.tsx        Fullscreen image hero + price + CTA
    ValueProps.tsx         3 highlights with icons
    Gallery.tsx            Masonry grid + lightbox (Client)
    Masterplan.tsx         Plano image with zoom (Client)
    Amenities.tsx          Amenities list with icons
    NearbyPoints.tsx       Nearby locations list (SEO text)
    MapEmbed.tsx           Google Maps iframe
    FinancingCalc.tsx      Interactive calculator (Client)
    ContactForm.tsx        Lead form → Server Action (Client)
    JsonLd.tsx             JSON-LD script tag
  shared/
    WhatsAppButton.tsx     Fixed floating button
    StickyContact.tsx      Sticky CTA bar on scroll (Client)
    PageTransition.tsx     Framer Motion page wrapper (Client)

lib/
  types.ts                 TypeScript interfaces
  sheets.ts                googleapis client + readSheet() + writeLeadToSheet()
  projects.ts              getProjects() + getProjectBySlug()
  actions.ts               Server Action: submitLead()

__tests__/
  projects.test.ts         Unit tests for data parsing
  financing.test.ts        Unit tests for calculator formula
  actions.test.ts          Unit tests for submitLead validation

public/
  brand/
    logo-negro.png
    logo-blanco.png
  proyectos/
    la-martina/            hero.jpg, galeria-1..8.jpg, plano.jpg, video.mp4
    aires-manantiales/     hero.jpg, galeria-1..7.jpg, plano.jpg, video.mp4
    ama-jose-ignacio/      hero.jpg, galeria-1..8.jpg, plano.jpg, video.mp4
    tierras-del-este/      hero.jpg, galeria-1..9.jpg, plano.jpg
```

---

## Task 1: Scaffold Next.js project

**Files:**
- Create: `package.json`, `next.config.ts`, `tsconfig.json`, `tailwind.config.ts`, `.env.local`, `.gitignore`, `postcss.config.mjs`

- [ ] **Step 1: Create Next.js app**

```bash
cd "C:/Users/lukas/Desktop/Claude_Code/web uruguay"
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir=no --import-alias="@/*" --yes
```

Expected: project scaffolded with `app/`, `components/` (empty), `public/`, `package.json`.

- [ ] **Step 2: Install dependencies**

```bash
npm install framer-motion lenis googleapis yet-another-react-lightbox react-medium-image-zoom
npm install -D vitest @vitejs/plugin-react @testing-library/react @testing-library/jest-dom jsdom
```

- [ ] **Step 3: Configure Vitest — create `vitest.config.ts`**

```ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['__tests__/setup.ts'],
    globals: true,
  },
  resolve: {
    alias: { '@': path.resolve(__dirname, '.') },
  },
})
```

- [ ] **Step 4: Create `__tests__/setup.ts`**

```ts
import '@testing-library/jest-dom'
```

- [ ] **Step 5: Add test script to `package.json`**

Add inside `"scripts"`:
```json
"test": "vitest run",
"test:watch": "vitest"
```

- [ ] **Step 6: Create `.env.local`**

```
GOOGLE_SERVICE_ACCOUNT_EMAIL=web-uruguay-sheet@web-uruguay.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDb1OBQhotHpyjd\nA6slhqXEbttvolyXWlDgT8JKYueqhqqjfCKODT0D+2dx2XfJlprpdWXnm3Wk+Ocf\n0ZjwYI+L2+QfMWtYQV+k596QcHQsafLvdukJSHgzpJu/leNY8/bIegFSy0NxsoQ0\n7XJfy9M7Tmg19+PjpCfodSq1n6HISOtC5TcN6sDgr0af0BBr5cu+8MpRFzmlhQXE\n4hJAFjoJNfREy5QMNFyU/Vb1xcQ3x+NV1xicd18KnaIIvBygaUgHt1f9Du0ukLdw\nOBvekOU7mcYU7p4xziJimk79C/3DZnRLg+YQYRRu7Ors7anOxLDFhvZwJop5vUCy\nl2JlJfdvAgMBAAECggEAFSyReKAk/T9YG8W1L/WitON6pmuMoJV18c0s6S5SoyW6\nfOnBiE41INOP2LL6K0Qi4rbInIDoWX4SAQoWwZyDZxTEic6gSM1vMXqWAPKb9gU0\nfaVF9/tvfIXv7Im67r/89r1tsDRc6DAqNNDkMd73lyBLwFsCq9QNdgIHHZxlIF3b\n+HD2RZGPELT8p+Vqx/Z+C6pAeSyXFPS0GkXhUdnXPlJqJ4RbsSEC7HG5lxA5r9nN\njkFdeXNtSlY2hiPXCh4WQi0zUVHkv0yg0489DcUjDYjOQNqA/VLJCddg7YW25MPF\n1ee5Qfq5+XPysnl7xg8SnH/bLwSXSzNn8GZeilC9iQKBgQDzMp3w8xzVmpEGVUpx\nWkfQuDPdS5iNJOBzTcMdKVeeGrCpjb/dZyc25XMohH3I4wd5TMOcf5kECQKl3Yhe\nf1BA8HX7d5TyCYRyLzFPEMbpf7fxbKlKOq47OwLVxMjNGs8SJjhKTJZBgYlh+MP6\nQHKJHb2/teBCwl4EKQHePfYaWQKBgQDnZ18xPPp2ci2wCyxF0DZDIDGyYfoHtSY4\n7ApFVjSt+Mt46MkIkLR+N8bEtJGJkp4rdSL80d37EGMq34h0I7AorfUUJrExdaer\ni4XASt8ZX01UMdIzQ+IQITperk+K1Q10H9afXa1C+NQMFvi0ySbBNkFO8ZmWLWXM\n9bCRh09XBwKBgDwIuLhsKygHmdlIYLIOqT+62QK90JC3E7ki7xFZzUk4KXgRh9Vt\ny15f0cekvTBD6upkqr0NOoamesLbJvi80ODW+yjyYhBFjS5qu+9aot+tKYktW7T5\nO11fudlvVGpdPdSrHqYotcbB5VoMAMTb9+olL1wN16hjNrYsMUvdW80xAoGBAIxa\nUIyG1ctduYRbYoD9psvUDRCLCKIAJ6zCzf/8J3uVuaQeXUDKtA8SOYc5lkSBH1pw\nc8YwbJlI+T0Z06PNuZ0S1eFhDnxXRllwCLH3N5YmDbsRdNMPS2BJJyQiSbCFROG4\nJe8HXH2QetzSWgsdLlpmU/pT47oI0wQbyPqbvW2lAoGASiQup3ZUpdumnXDLkaLP\n41hBhh/94IKXtmQI/4oqO3B/4Tgv4bXgjuxO0tx0KobGv1swAT+uwfUfTgChmZcj\nZ4gE3sPzjAT0jy8JtfCCLkUkP89ZB/M6sCokxeJix86g2Kj8G23PxsOFzclxSKwp\nreA/wfzIRn3EHmKij5RN5to=\n-----END PRIVATE KEY-----\n"
GOOGLE_SHEET_ID=REPLACE_WITH_SHEET_ID_AFTER_CREATION
```

- [ ] **Step 7: Verify `.gitignore` contains `.env.local`**

Open `.gitignore` and confirm it has:
```
.env.local
.env*.local
```

- [ ] **Step 8: Commit**

```bash
git init
git add -A
git commit -m "chore: scaffold Next.js 15 project with dependencies"
```

---

## Task 2: Copy and organize assets

**Files:**
- Create: `public/brand/logo-negro.png`, `public/brand/logo-blanco.png`
- Create: `public/proyectos/la-martina/` (hero + gallery + video)
- Create: `public/proyectos/aires-manantiales/`
- Create: `public/proyectos/ama-jose-ignacio/`
- Create: `public/proyectos/tierras-del-este/`

- [ ] **Step 1: Create directory structure**

```bash
mkdir -p public/brand
mkdir -p "public/proyectos/la-martina"
mkdir -p "public/proyectos/aires-manantiales"
mkdir -p "public/proyectos/ama-jose-ignacio"
mkdir -p "public/proyectos/tierras-del-este"
```

- [ ] **Step 2: Copy brand logos**

```bash
cp "../Brand/Logo CTP RE - Negro - Sin Fondo .png" public/brand/logo-negro.png
cp "../Brand/Logo CTP RE - Blanco - Sin Fondo .png" public/brand/logo-blanco.png
```

- [ ] **Step 3: Copy La Martina assets**

```bash
cp "../Proyectos/LA MARTINA/GALERÍA/DJI_0194.JPG" public/proyectos/la-martina/hero.jpg
cp "../Proyectos/LA MARTINA/GALERÍA/DJI_0199.JPG" public/proyectos/la-martina/galeria-1.jpg
cp "../Proyectos/LA MARTINA/GALERÍA/DJI_0201.JPG" public/proyectos/la-martina/galeria-2.jpg
cp "../Proyectos/LA MARTINA/GALERÍA/DJI_0202.JPG" public/proyectos/la-martina/galeria-3.jpg
cp "../Proyectos/LA MARTINA/GALERÍA/DJI_0208.JPG" public/proyectos/la-martina/galeria-4.jpg
cp "../Proyectos/LA MARTINA/GALERÍA/DJI_0211.JPG" public/proyectos/la-martina/galeria-5.jpg
cp "../Proyectos/LA MARTINA/GALERÍA/DJI_0212.JPG" public/proyectos/la-martina/galeria-6.jpg
cp "../Proyectos/LA MARTINA/GALERÍA/DJI_0217.JPG" public/proyectos/la-martina/galeria-7.jpg
cp "../Proyectos/LA MARTINA/GALERÍA/URU-LM.png"   public/proyectos/la-martina/plano.png
cp "../Proyectos/LA MARTINA/VIDEO/LA MARTINA-.mp4" public/proyectos/la-martina/video.mp4
```

- [ ] **Step 4: Copy Aires de Manantiales assets**

```bash
cp "../Proyectos/AIRES DE MANANTIALES/GALERÍA/AMM1.jpeg" public/proyectos/aires-manantiales/hero.jpg
cp "../Proyectos/AIRES DE MANANTIALES/GALERÍA/AMM2.jpeg" public/proyectos/aires-manantiales/galeria-1.jpg
cp "../Proyectos/AIRES DE MANANTIALES/GALERÍA/AMM3.jpeg" public/proyectos/aires-manantiales/galeria-2.jpg
cp "../Proyectos/AIRES DE MANANTIALES/GALERÍA/AMM4.jpeg" public/proyectos/aires-manantiales/galeria-3.jpg
cp "../Proyectos/AIRES DE MANANTIALES/GALERÍA/AMM5.jpeg" public/proyectos/aires-manantiales/galeria-4.jpg
cp "../Proyectos/AIRES DE MANANTIALES/GALERÍA/AMM6.jpeg" public/proyectos/aires-manantiales/galeria-5.jpg
cp "../Proyectos/AIRES DE MANANTIALES/GALERÍA/AMM7.jpeg" public/proyectos/aires-manantiales/galeria-6.jpg
cp "../Proyectos/AIRES DE MANANTIALES/VIDEO/MANANTIALES.MP4" public/proyectos/aires-manantiales/video.mp4
```

- [ ] **Step 5: Copy Ama José Ignacio assets**

```bash
cp "../Proyectos/AMA JOSE IGNACIO/GALERÍA/AJI.jpeg"  public/proyectos/ama-jose-ignacio/hero.jpg
cp "../Proyectos/AMA JOSE IGNACIO/GALERÍA/AJI2.jpeg" public/proyectos/ama-jose-ignacio/galeria-1.jpg
cp "../Proyectos/AMA JOSE IGNACIO/GALERÍA/AJI3.jpeg" public/proyectos/ama-jose-ignacio/galeria-2.jpg
cp "../Proyectos/AMA JOSE IGNACIO/GALERÍA/AJI4.jpeg" public/proyectos/ama-jose-ignacio/galeria-3.jpg
cp "../Proyectos/AMA JOSE IGNACIO/GALERÍA/AJI5.jpeg" public/proyectos/ama-jose-ignacio/galeria-4.jpg
cp "../Proyectos/AMA JOSE IGNACIO/GALERÍA/AJI6.jpeg" public/proyectos/ama-jose-ignacio/galeria-5.jpg
cp "../Proyectos/AMA JOSE IGNACIO/GALERÍA/AJI7.jpeg" public/proyectos/ama-jose-ignacio/galeria-6.jpg
cp "../Proyectos/AMA JOSE IGNACIO/GALERÍA/AJI8.jpeg" public/proyectos/ama-jose-ignacio/galeria-7.jpg
cp "../Proyectos/AMA JOSE IGNACIO/GALERÍA/URU-AJI.png" public/proyectos/ama-jose-ignacio/plano.png
cp "../Proyectos/AMA JOSE IGNACIO/VIDEO/AMA JOSE IGNACIO.mp4" public/proyectos/ama-jose-ignacio/video.mp4
```

- [ ] **Step 6: Copy Tierras del Este assets**

```bash
cp "../Proyectos/TIERRAS DEL ESTE/GALERÍA/TDE1.jpeg" public/proyectos/tierras-del-este/hero.jpg
cp "../Proyectos/TIERRAS DEL ESTE/GALERÍA/TDE2.jpeg" public/proyectos/tierras-del-este/galeria-1.jpg
cp "../Proyectos/TIERRAS DEL ESTE/GALERÍA/TDE3.jpeg" public/proyectos/tierras-del-este/galeria-2.jpg
cp "../Proyectos/TIERRAS DEL ESTE/GALERÍA/TDE4.jpeg" public/proyectos/tierras-del-este/galeria-3.jpg
cp "../Proyectos/TIERRAS DEL ESTE/GALERÍA/TDE5.jpeg" public/proyectos/tierras-del-este/galeria-4.jpg
cp "../Proyectos/TIERRAS DEL ESTE/GALERÍA/TDE6.jpeg" public/proyectos/tierras-del-este/galeria-5.jpg
cp "../Proyectos/TIERRAS DEL ESTE/GALERÍA/TDE7.jpeg" public/proyectos/tierras-del-este/galeria-6.jpg
cp "../Proyectos/TIERRAS DEL ESTE/GALERÍA/TDE8.jpeg" public/proyectos/tierras-del-este/galeria-7.jpg
cp "../Proyectos/TIERRAS DEL ESTE/GALERÍA/TDE9.jpeg" public/proyectos/tierras-del-este/galeria-8.jpg
```

- [ ] **Step 7: Commit**

```bash
git add public/
git commit -m "chore: add brand and project assets to public/"
```

---

## Task 3: TypeScript types

**Files:**
- Create: `lib/types.ts`
- Test: `__tests__/projects.test.ts` (partial — types validated implicitly)

- [ ] **Step 1: Create `lib/types.ts`**

```ts
export interface Proyecto {
  slug: string
  nombre: string
  ubicacion: string
  precioDesde: number
  precioHasta: number
  descripcion: string
  destacados: string[]
  amenities: string[]
  puntosCercanos: string[]
  coordenadas: string
  financiamientoInicial: number
  financiamientoCuotas: number[]
  financiamientoTasas: number[]
  activo: boolean
  imagenes: {
    hero: string
    galeria: string[]
    plano: string | null
    video: string | null
  }
}

export interface Lead {
  nombre: string
  email: string
  telefono: string
  mensaje: string
  proyecto: string
}

export interface SiteConfig {
  whatsappNumero: string
  whatsappMensaje: string
  emailContacto: string
}
```

- [ ] **Step 2: Commit**

```bash
git add lib/types.ts
git commit -m "feat: add TypeScript types for Proyecto, Lead, SiteConfig"
```

---

## Task 4: Google Sheets data layer (TDD)

**Files:**
- Create: `lib/sheets.ts`
- Create: `lib/projects.ts`
- Create: `__tests__/projects.test.ts`

- [ ] **Step 1: Write failing tests — `__tests__/projects.test.ts`**

```ts
import { describe, it, expect } from 'vitest'
import { parseProyecto, parseConfig } from '@/lib/projects'

const mockRow = [
  'la-martina',
  'La Martina',
  'José Ignacio, Uruguay',
  '90000',
  '130000',
  'Barrio privado con vista al mar en José Ignacio.',
  'Vista al mar,Seguridad 24h,Naturaleza',
  'Portón controlado,Caminería interna,Agua potable',
  'Playa a 500m,José Ignacio a 8km,Montevideo a 180km',
  '-34.8412,-54.6721',
  '40',
  '12,24,36',
  '0.6,0.7,0.75',
  'TRUE',
]

describe('parseProyecto', () => {
  it('parses a raw sheet row into a Proyecto object', () => {
    const result = parseProyecto(mockRow)
    expect(result.slug).toBe('la-martina')
    expect(result.nombre).toBe('La Martina')
    expect(result.precioDesde).toBe(90000)
    expect(result.precioHasta).toBe(130000)
    expect(result.destacados).toEqual(['Vista al mar', 'Seguridad 24h', 'Naturaleza'])
    expect(result.amenities).toEqual(['Portón controlado', 'Caminería interna', 'Agua potable'])
    expect(result.puntosCercanos).toEqual(['Playa a 500m', 'José Ignacio a 8km', 'Montevideo a 180km'])
    expect(result.financiamientoCuotas).toEqual([12, 24, 36])
    expect(result.financiamientoTasas).toEqual([0.6, 0.7, 0.75])
    expect(result.activo).toBe(true)
  })

  it('attaches correct image paths based on slug', () => {
    const result = parseProyecto(mockRow)
    expect(result.imagenes.hero).toBe('/proyectos/la-martina/hero.jpg')
    expect(result.imagenes.galeria[0]).toBe('/proyectos/la-martina/galeria-1.jpg')
    expect(result.imagenes.video).toBe('/proyectos/la-martina/video.mp4')
  })

  it('returns activo=false when column N is not TRUE', () => {
    const inactiveRow = [...mockRow]
    inactiveRow[13] = 'FALSE'
    expect(parseProyecto(inactiveRow).activo).toBe(false)
  })
})

describe('parseConfig', () => {
  it('parses config rows into SiteConfig', () => {
    const rows = [
      ['whatsapp_numero', '+59899123456'],
      ['whatsapp_mensaje', 'Hola, quiero info'],
      ['email_contacto', 'info@ctp.com'],
    ]
    const result = parseConfig(rows)
    expect(result.whatsappNumero).toBe('+59899123456')
    expect(result.whatsappMensaje).toBe('Hola, quiero info')
    expect(result.emailContacto).toBe('info@ctp.com')
  })
})
```

- [ ] **Step 2: Run tests — expect FAIL**

```bash
npm test
```

Expected: `Cannot find module '@/lib/projects'`

- [ ] **Step 3: Create `lib/sheets.ts`**

```ts
import { google } from 'googleapis'
import { cache } from 'react'

const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  },
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
})

const sheets = google.sheets({ version: 'v4', auth })
const SHEET_ID = process.env.GOOGLE_SHEET_ID!

export const readSheet = cache(async (range: string): Promise<string[][]> => {
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range,
  })
  return (res.data.values ?? []) as string[][]
})

export async function writeLeadToSheet(values: string[]): Promise<void> {
  await sheets.spreadsheets.values.append({
    spreadsheetId: SHEET_ID,
    range: 'leads!A:F',
    valueInputOption: 'USER_ENTERED',
    requestBody: { values: [values] },
  })
}
```

- [ ] **Step 4: Create `lib/projects.ts`**

```ts
import { cache } from 'react'
import { readSheet } from './sheets'
import type { Proyecto, SiteConfig } from './types'

const GALLERY_COUNTS: Record<string, number> = {
  'la-martina': 7,
  'aires-manantiales': 6,
  'ama-jose-ignacio': 7,
  'tierras-del-este': 8,
}

export function parseProyecto(row: string[]): Proyecto {
  const slug = row[0]
  const count = GALLERY_COUNTS[slug] ?? 6
  const galeria = Array.from({ length: count }, (_, i) => `/proyectos/${slug}/galeria-${i + 1}.jpg`)

  const hasPlano =
    slug === 'la-martina' ||
    slug === 'ama-jose-ignacio'

  return {
    slug,
    nombre: row[1],
    ubicacion: row[2],
    precioDesde: Number(row[3]),
    precioHasta: Number(row[4]),
    descripcion: row[5],
    destacados: row[6]?.split(',').map((s) => s.trim()).filter(Boolean) ?? [],
    amenities: row[7]?.split(',').map((s) => s.trim()).filter(Boolean) ?? [],
    puntosCercanos: row[8]?.split(',').map((s) => s.trim()).filter(Boolean) ?? [],
    coordenadas: row[9],
    financiamientoInicial: Number(row[10]),
    financiamientoCuotas: row[11]?.split(',').map(Number) ?? [12, 24, 36],
    financiamientoTasas: row[12]?.split(',').map(Number) ?? [0.6, 0.7, 0.75],
    activo: row[13]?.toUpperCase() === 'TRUE',
    imagenes: {
      hero: `/proyectos/${slug}/hero.jpg`,
      galeria,
      plano: hasPlano ? `/proyectos/${slug}/plano.png` : null,
      video: `/proyectos/${slug}/video.mp4`,
    },
  }
}

export function parseConfig(rows: string[][]): SiteConfig {
  const map = Object.fromEntries(rows.map(([k, v]) => [k, v]))
  return {
    whatsappNumero: map['whatsapp_numero'] ?? '',
    whatsappMensaje: map['whatsapp_mensaje'] ?? '',
    emailContacto: map['email_contacto'] ?? '',
  }
}

export const getProyectos = cache(async (): Promise<Proyecto[]> => {
  const rows = await readSheet('proyectos!A2:N1000')
  return rows.map(parseProyecto).filter((p) => p.activo)
})

export const getProyectoBySlug = cache(async (slug: string): Promise<Proyecto | null> => {
  const all = await getProyectos()
  return all.find((p) => p.slug === slug) ?? null
})

export const getSiteConfig = cache(async (): Promise<SiteConfig> => {
  const rows = await readSheet('config!A2:B20')
  return parseConfig(rows)
})
```

- [ ] **Step 5: Run tests — expect PASS**

```bash
npm test
```

Expected: `4 passed`

- [ ] **Step 6: Commit**

```bash
git add lib/ __tests__/
git commit -m "feat: Google Sheets data layer with parseProyecto and parseConfig"
```

---

## Task 5: Financing calculator logic (TDD)

**Files:**
- Create: `lib/financing.ts`
- Create: `__tests__/financing.test.ts`

- [ ] **Step 1: Write failing tests — `__tests__/financing.test.ts`**

```ts
import { describe, it, expect } from 'vitest'
import { calcularFinanciamiento } from '@/lib/financing'

describe('calcularFinanciamiento', () => {
  it('calculates correct monthly payment for 12-month term', () => {
    const result = calcularFinanciamiento(90000, 12, 0.6)
    expect(result.pie).toBe(36000)
    expect(result.saldo).toBe(54000)
    expect(result.cuotaMensual).toBeCloseTo(4677, 0)
    expect(result.totalFinanciado).toBeCloseTo(56124, 0)
  })

  it('calculates correct monthly payment for 24-month term', () => {
    const result = calcularFinanciamiento(90000, 24, 0.7)
    expect(result.pie).toBe(36000)
    expect(result.cuotaMensual).toBeCloseTo(2452, 0)
  })

  it('calculates correct monthly payment for 36-month term', () => {
    const result = calcularFinanciamiento(90000, 36, 0.75)
    expect(result.pie).toBe(36000)
    expect(result.cuotaMensual).toBeCloseTo(1717, 0)
  })
})
```

- [ ] **Step 2: Run tests — expect FAIL**

```bash
npm test __tests__/financing.test.ts
```

Expected: `Cannot find module '@/lib/financing'`

- [ ] **Step 3: Create `lib/financing.ts`**

```ts
export interface FinanciamientoResult {
  pie: number
  saldo: number
  cuotaMensual: number
  totalFinanciado: number
}

export function calcularFinanciamiento(
  precio: number,
  cuotas: number,
  tasaMensualPct: number
): FinanciamientoResult {
  const pie = precio * 0.4
  const saldo = precio * 0.6
  const tasa = tasaMensualPct / 100

  const cuotaMensual =
    tasa === 0
      ? saldo / cuotas
      : (saldo * tasa) / (1 - Math.pow(1 + tasa, -cuotas))

  const totalFinanciado = cuotaMensual * cuotas

  return {
    pie: Math.round(pie),
    saldo: Math.round(saldo),
    cuotaMensual: Math.round(cuotaMensual),
    totalFinanciado: Math.round(totalFinanciado),
  }
}
```

- [ ] **Step 4: Run tests — expect PASS**

```bash
npm test
```

Expected: `7 passed`

- [ ] **Step 5: Commit**

```bash
git add lib/financing.ts __tests__/financing.test.ts
git commit -m "feat: financing calculator with amortization formula"
```

---

## Task 6: Server Action — submitLead (TDD)

**Files:**
- Create: `lib/actions.ts`
- Create: `__tests__/actions.test.ts`

- [ ] **Step 1: Write failing tests — `__tests__/actions.test.ts`**

```ts
import { describe, it, expect, vi } from 'vitest'
import { validateLead } from '@/lib/actions'

describe('validateLead', () => {
  it('returns null when all fields are valid', () => {
    const error = validateLead({
      nombre: 'Juan',
      email: 'juan@mail.com',
      telefono: '+59899123456',
      mensaje: 'Hola',
      proyecto: 'la-martina',
    })
    expect(error).toBeNull()
  })

  it('returns error when nombre is empty', () => {
    const error = validateLead({
      nombre: '',
      email: 'juan@mail.com',
      telefono: '+59899123456',
      mensaje: 'Hola',
      proyecto: 'la-martina',
    })
    expect(error).toBe('El nombre es requerido')
  })

  it('returns error when email is invalid', () => {
    const error = validateLead({
      nombre: 'Juan',
      email: 'not-an-email',
      telefono: '+59899123456',
      mensaje: 'Hola',
      proyecto: 'la-martina',
    })
    expect(error).toBe('Email inválido')
  })
})
```

- [ ] **Step 2: Run tests — expect FAIL**

```bash
npm test __tests__/actions.test.ts
```

Expected: `Cannot find module '@/lib/actions'`

- [ ] **Step 3: Create `lib/actions.ts`**

```ts
'use server'

import { writeLeadToSheet } from './sheets'
import type { Lead } from './types'

export function validateLead(lead: Lead): string | null {
  if (!lead.nombre.trim()) return 'El nombre es requerido'
  if (!lead.email.trim()) return 'El email es requerido'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lead.email)) return 'Email inválido'
  if (!lead.telefono.trim()) return 'El teléfono es requerido'
  return null
}

export async function submitLead(
  _prevState: { success: boolean; error: string | null },
  formData: FormData
): Promise<{ success: boolean; error: string | null }> {
  const lead: Lead = {
    nombre: formData.get('nombre') as string,
    email: formData.get('email') as string,
    telefono: formData.get('telefono') as string,
    mensaje: formData.get('mensaje') as string,
    proyecto: formData.get('proyecto') as string,
  }

  const error = validateLead(lead)
  if (error) return { success: false, error }

  try {
    await writeLeadToSheet([
      new Date().toISOString(),
      lead.nombre,
      lead.email,
      lead.telefono,
      lead.mensaje,
      lead.proyecto,
    ])
    return { success: true, error: null }
  } catch {
    return { success: false, error: 'Error al enviar. Intenta nuevamente.' }
  }
}
```

- [ ] **Step 4: Run tests — expect PASS**

```bash
npm test
```

Expected: `10 passed`

- [ ] **Step 5: Commit**

```bash
git add lib/actions.ts __tests__/actions.test.ts
git commit -m "feat: submitLead server action with validation"
```

---

## Task 7: Tailwind config and global styles

**Files:**
- Modify: `tailwind.config.ts`
- Modify: `app/globals.css`

- [ ] **Step 1: Update `tailwind.config.ts`**

```ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        black: '#0A0A0A',
        graphite: '#2E2E2E',
        gray: {
          DEFAULT: '#D9D9D9',
          light: '#F5F5F5',
        },
        gold: '#C6A665',
        green: '#2C4A3E',
      },
      fontFamily: {
        sans: ['var(--font-montserrat)', 'sans-serif'],
      },
      letterSpacing: {
        wider: '0.08em',
        widest: '0.16em',
      },
    },
  },
  plugins: [],
}

export default config
```

- [ ] **Step 2: Update `app/globals.css`**

```css
@import "tailwindcss";

:root {
  --font-montserrat: 'Montserrat', sans-serif;
}

html {
  scroll-behavior: auto; /* Lenis handles smooth scroll */
}

body {
  background-color: #ffffff;
  color: #0A0A0A;
  font-family: var(--font-montserrat), sans-serif;
  -webkit-font-smoothing: antialiased;
}

::selection {
  background-color: #C6A665;
  color: #ffffff;
}

/* Hide scrollbar during page transitions */
.no-scroll {
  overflow: hidden;
}
```

- [ ] **Step 3: Commit**

```bash
git add tailwind.config.ts app/globals.css
git commit -m "feat: configure Tailwind with CTP brand palette and Montserrat font"
```

---

## Task 8: Root layout with Lenis + fonts + WhatsApp

**Files:**
- Modify: `app/layout.tsx`
- Create: `components/shared/LenisProvider.tsx`
- Create: `components/shared/WhatsAppButton.tsx`

- [ ] **Step 1: Create `components/shared/LenisProvider.tsx`**

```tsx
'use client'

import { useEffect } from 'react'
import Lenis from 'lenis'

export default function LenisProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const lenis = new Lenis({ duration: 1.2, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) })

    function raf(time: number) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)
    return () => lenis.destroy()
  }, [])

  return <>{children}</>
}
```

- [ ] **Step 2: Create `components/shared/WhatsAppButton.tsx`**

```tsx
import Link from 'next/link'

interface Props {
  numero: string
  mensaje?: string
}

export default function WhatsAppButton({ numero, mensaje = '' }: Props) {
  const url = `https://wa.me/${numero.replace(/\D/g, '')}?text=${encodeURIComponent(mensaje)}`

  return (
    <Link
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] shadow-lg transition-transform hover:scale-110"
      aria-label="Consultar por WhatsApp"
    >
      <svg viewBox="0 0 24 24" fill="white" className="h-7 w-7">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
      </svg>
    </Link>
  )
}
```

- [ ] **Step 3: Update `app/layout.tsx`**

```tsx
import type { Metadata } from 'next'
import { Montserrat } from 'next/font/google'
import './globals.css'
import LenisProvider from '@/components/shared/LenisProvider'
import WhatsAppButton from '@/components/shared/WhatsAppButton'
import { getSiteConfig } from '@/lib/projects'

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['300', '400', '600', '700'],
  variable: '--font-montserrat',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'CTP Real Estate | Parcelas en Uruguay',
  description: 'Parcelas rurales en Uruguay. Inversión en naturaleza con financiamiento. CTP Real Estate.',
  openGraph: {
    siteName: 'CTP Real Estate',
    locale: 'es_UY',
    type: 'website',
  },
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const config = await getSiteConfig()

  return (
    <html lang="es" className={montserrat.variable}>
      <body>
        <LenisProvider>
          {children}
          <WhatsAppButton
            numero={config.whatsappNumero}
            mensaje={config.whatsappMensaje}
          />
        </LenisProvider>
      </body>
    </html>
  )
}
```

- [ ] **Step 4: Run dev to verify no errors**

```bash
npm run dev
```

Open http://localhost:3000 — expect blank white page (no content yet), no console errors.

- [ ] **Step 5: Commit**

```bash
git add app/layout.tsx components/shared/
git commit -m "feat: root layout with Lenis, Montserrat, and WhatsApp button"
```

---

## Task 9: Nav component

**Files:**
- Create: `components/ui/Logo.tsx`
- Create: `components/ui/Nav.tsx`

- [ ] **Step 1: Create `components/ui/Logo.tsx`**

```tsx
import Image from 'next/image'
import Link from 'next/link'

interface Props {
  variant?: 'negro' | 'blanco'
  className?: string
}

export default function Logo({ variant = 'negro', className = '' }: Props) {
  return (
    <Link href="/" className={`inline-flex items-center ${className}`}>
      <Image
        src={`/brand/logo-${variant}.png`}
        alt="CTP Real Estate"
        width={140}
        height={50}
        className="h-10 w-auto"
        priority
      />
    </Link>
  )
}
```

- [ ] **Step 2: Create `components/ui/Nav.tsx`**

```tsx
'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Logo from './Logo'

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-6 py-4 transition-all duration-500 md:px-12 ${
        scrolled ? 'bg-white shadow-sm' : 'bg-transparent'
      }`}
    >
      <Logo variant={scrolled ? 'negro' : 'blanco'} />
      <Link
        href="#contacto"
        className={`text-xs font-semibold tracking-widest uppercase transition-colors duration-300 ${
          scrolled ? 'text-black hover:text-gold' : 'text-white hover:text-gold'
        }`}
      >
        Contacto
      </Link>
    </nav>
  )
}
```

- [ ] **Step 3: Verify visually**

Add `<Nav />` temporarily to `app/page.tsx`, run `npm run dev`, confirm nav is transparent over page, and add a tall `<div style={{height:'200vh'}}/>` to test the scroll-to-white transition. Remove the test div after.

- [ ] **Step 4: Commit**

```bash
git add components/ui/
git commit -m "feat: Logo and Nav components with scroll-aware styling"
```

---

## Task 10: Home Hero (fullscreen video)

**Files:**
- Create: `components/home/HomeHero.tsx`

- [ ] **Step 1: Create `components/home/HomeHero.tsx`**

```tsx
'use client'

import { motion } from 'framer-motion'
import Logo from '@/components/ui/Logo'

export default function HomeHero() {
  return (
    <section className="relative flex h-screen w-full items-center justify-center overflow-hidden bg-black">
      <video
        src="/proyectos/la-martina/video.mp4"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        className="absolute inset-0 h-full w-full object-cover opacity-60"
      />

      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/50" />

      <motion.div
        className="relative z-10 flex flex-col items-center gap-6 text-center"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: 'easeOut' }}
      >
        <Logo variant="blanco" className="mb-2" />
        <p className="text-sm font-light tracking-widest text-white/80 uppercase">
          Parcelas en Uruguay
        </p>
      </motion.div>

      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.8 }}
      >
        <span className="text-xs tracking-widest text-white/60 uppercase">Explorar</span>
        <motion.div
          className="h-8 w-px bg-white/40"
          animate={{ scaleY: [0, 1, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
          style={{ originY: 0 }}
        />
      </motion.div>
    </section>
  )
}
```

- [ ] **Step 2: Verify**

Import in `app/page.tsx`:
```tsx
import HomeHero from '@/components/home/HomeHero'
export default function Home() { return <main><HomeHero /></main> }
```

Run `npm run dev`. Open http://localhost:3000. Confirm: video plays full-screen, logo visible, scroll indicator animates.

- [ ] **Step 3: Commit**

```bash
git add components/home/HomeHero.tsx app/page.tsx
git commit -m "feat: fullscreen video hero for home page"
```

---

## Task 11: ProjectCard + ProjectGrid

**Files:**
- Create: `components/home/ProjectCard.tsx`
- Create: `components/home/ProjectGrid.tsx`

- [ ] **Step 1: Create `components/home/ProjectCard.tsx`**

```tsx
'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import type { Proyecto } from '@/lib/types'

interface Props {
  proyecto: Proyecto
  index: number
}

export default function ProjectCard({ proyecto, index }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, delay: index * 0.15, ease: 'easeOut' }}
    >
      <Link href={`/parcelas-${proyecto.slug}`} className="group block overflow-hidden bg-gray-light">
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src={proyecto.imagenes.hero}
            alt={proyecto.nombre}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/20 transition-opacity duration-500 group-hover:bg-black/40" />
          <div className="absolute inset-0 flex flex-col justify-end p-6 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
            <span className="inline-block border border-white px-4 py-2 text-xs font-semibold tracking-widest text-white uppercase">
              Ver proyecto
            </span>
          </div>
        </div>
        <div className="p-6">
          <p className="mb-1 text-xs font-medium tracking-widest text-graphite uppercase">
            {proyecto.ubicacion}
          </p>
          <h3 className="mb-2 text-xl font-light tracking-wider text-black">{proyecto.nombre}</h3>
          <p className="text-sm text-graphite">
            Desde{' '}
            <span className="font-semibold text-black">
              USD ${proyecto.precioDesde.toLocaleString('es-UY')}
            </span>
          </p>
        </div>
      </Link>
    </motion.div>
  )
}
```

- [ ] **Step 2: Create `components/home/ProjectGrid.tsx`**

```tsx
import ProjectCard from './ProjectCard'
import type { Proyecto } from '@/lib/types'

interface Props {
  proyectos: Proyecto[]
}

export default function ProjectGrid({ proyectos }: Props) {
  return (
    <section className="px-6 py-20 md:px-12 lg:px-24">
      <div className="mb-14 max-w-xl">
        <p className="mb-3 text-xs font-semibold tracking-widest text-graphite uppercase">
          Proyectos
        </p>
        <h2 className="text-4xl font-light tracking-wider text-black md:text-5xl">
          Nuestras parcelas
        </h2>
      </div>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {proyectos.map((p, i) => (
          <ProjectCard key={p.slug} proyecto={p} index={i} />
        ))}
      </div>
    </section>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add components/home/
git commit -m "feat: ProjectCard and ProjectGrid with scroll animations"
```

---

## Task 12: Home page + Footer

**Files:**
- Modify: `app/page.tsx`
- Create: `components/shared/Footer.tsx`

- [ ] **Step 1: Create `components/shared/Footer.tsx`**

```tsx
import Logo from '@/components/ui/Logo'

export default function Footer() {
  return (
    <footer className="border-t border-gray bg-white px-6 py-12 md:px-12">
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <Logo variant="negro" />
        <div className="flex flex-col gap-1 text-sm text-graphite">
          <p>Uruguay · Real Estate</p>
          <p>© {new Date().getFullYear()} CTP Real Estate. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  )
}
```

- [ ] **Step 2: Update `app/page.tsx`**

```tsx
import Nav from '@/components/ui/Nav'
import HomeHero from '@/components/home/HomeHero'
import ProjectGrid from '@/components/home/ProjectGrid'
import Footer from '@/components/shared/Footer'
import { getProyectos } from '@/lib/projects'

export default async function Home() {
  const proyectos = await getProyectos()

  return (
    <main>
      <Nav />
      <HomeHero />
      <ProjectGrid proyectos={proyectos} />
      <Footer />
    </main>
  )
}
```

- [ ] **Step 3: Verify**

Run `npm run dev`. Open http://localhost:3000. Confirm: hero video plays, grid shows 4 project cards with images, footer visible. Cards should animate in as you scroll.

> Note: The first run will fail if `GOOGLE_SHEET_ID` is not set. For now, add a temporary fallback in `getProyectos()` that returns mock data if SHEET_ID is missing. See Task 13 note.

- [ ] **Step 4: Commit**

```bash
git add app/page.tsx components/shared/Footer.tsx
git commit -m "feat: home page assembled with Nav, Hero, ProjectGrid, Footer"
```

---

## Task 13: Mock data fallback for development

**Files:**
- Modify: `lib/projects.ts`

- [ ] **Step 1: Add mock data fallback to `lib/projects.ts`**

Add at the top of the file, before `getProyectos`:

```ts
const MOCK_PROYECTOS: Proyecto[] = [
  {
    slug: 'la-martina',
    nombre: 'La Martina',
    ubicacion: 'José Ignacio, Uruguay',
    precioDesde: 90000,
    precioHasta: 130000,
    descripcion: 'Barrio privado con vista al mar en José Ignacio, Uruguay. Parcelas de alto valor con acceso controlado y entorno natural privilegiado.',
    destacados: ['Vista al mar', 'Seguridad 24h', 'Entorno natural'],
    amenities: ['Portón controlado', 'Caminería interna', 'Agua potable', 'Energía eléctrica'],
    puntosCercanos: ['Playa a 500m', 'José Ignacio a 8km', 'Punta del Este a 35km', 'Montevideo a 180km'],
    coordenadas: '-34.8412,-54.6721',
    financiamientoInicial: 40,
    financiamientoCuotas: [12, 24, 36],
    financiamientoTasas: [0.6, 0.7, 0.75],
    activo: true,
    imagenes: {
      hero: '/proyectos/la-martina/hero.jpg',
      galeria: Array.from({ length: 7 }, (_, i) => `/proyectos/la-martina/galeria-${i + 1}.jpg`),
      plano: '/proyectos/la-martina/plano.png',
      video: '/proyectos/la-martina/video.mp4',
    },
  },
  {
    slug: 'aires-manantiales',
    nombre: 'Aires de Manantiales',
    ubicacion: 'Manantiales, Uruguay',
    precioDesde: 70000,
    precioHasta: 100000,
    descripcion: 'Parcelas en Manantiales, rodeadas de naturaleza exuberante. Inversión en uno de los entornos más cotizados del Uruguay.',
    destacados: ['Naturaleza pura', 'Acceso directo', 'Financiamiento'],
    amenities: ['Acceso controlado', 'Caminería interna', 'Agua potable'],
    puntosCercanos: ['José Ignacio a 10km', 'Laguna Garzón a 15km', 'Punta del Este a 45km'],
    coordenadas: '-34.7900,-54.5800',
    financiamientoInicial: 40,
    financiamientoCuotas: [12, 24, 36],
    financiamientoTasas: [0.6, 0.7, 0.75],
    activo: true,
    imagenes: {
      hero: '/proyectos/aires-manantiales/hero.jpg',
      galeria: Array.from({ length: 6 }, (_, i) => `/proyectos/aires-manantiales/galeria-${i + 1}.jpg`),
      plano: null,
      video: '/proyectos/aires-manantiales/video.mp4',
    },
  },
  {
    slug: 'ama-jose-ignacio',
    nombre: 'Ama José Ignacio',
    ubicacion: 'José Ignacio, Uruguay',
    precioDesde: 55000,
    precioHasta: 130000,
    descripcion: 'Parcelas en el corazón de José Ignacio. Vive rodeado de la belleza natural uruguaya con todas las comodidades.',
    destacados: ['Ubicación premium', 'Vistas panorámicas', 'Financiamiento flexible'],
    amenities: ['Portón controlado', 'Caminería pavimentada', 'Agua potable', 'Iluminación'],
    puntosCercanos: ['Centro José Ignacio a 5km', 'Playa a 3km', 'Punta del Este a 30km'],
    coordenadas: '-34.8600,-54.6400',
    financiamientoInicial: 40,
    financiamientoCuotas: [12, 24, 36],
    financiamientoTasas: [0.6, 0.7, 0.75],
    activo: true,
    imagenes: {
      hero: '/proyectos/ama-jose-ignacio/hero.jpg',
      galeria: Array.from({ length: 7 }, (_, i) => `/proyectos/ama-jose-ignacio/galeria-${i + 1}.jpg`),
      plano: '/proyectos/ama-jose-ignacio/plano.png',
      video: '/proyectos/ama-jose-ignacio/video.mp4',
    },
  },
  {
    slug: 'tierras-del-este',
    nombre: 'Tierras del Este',
    ubicacion: 'Rocha, Uruguay',
    precioDesde: 80000,
    precioHasta: 90000,
    descripcion: 'Amplias parcelas en la región este de Uruguay. Tranquilidad, naturaleza y potencial de valorización.',
    destacados: ['Grandes extensiones', 'Precio accesible', 'Alta valorización'],
    amenities: ['Acceso asfaltado', 'Agua potable', 'Electricidad'],
    puntosCercanos: ['Rocha a 20km', 'La Paloma a 35km', 'Montevideo a 220km'],
    coordenadas: '-34.4800,-54.3400',
    financiamientoInicial: 40,
    financiamientoCuotas: [12, 24, 36],
    financiamientoTasas: [0.6, 0.7, 0.75],
    activo: true,
    imagenes: {
      hero: '/proyectos/tierras-del-este/hero.jpg',
      galeria: Array.from({ length: 8 }, (_, i) => `/proyectos/tierras-del-este/galeria-${i + 1}.jpg`),
      plano: null,
      video: null,
    },
  },
]

const IS_DEV_NO_SHEET = !process.env.GOOGLE_SHEET_ID || process.env.GOOGLE_SHEET_ID === 'REPLACE_WITH_SHEET_ID_AFTER_CREATION'
```

Update `getProyectos()`:
```ts
export const getProyectos = cache(async (): Promise<Proyecto[]> => {
  if (IS_DEV_NO_SHEET) return MOCK_PROYECTOS
  const rows = await readSheet('proyectos!A2:N1000')
  return rows.map(parseProyecto).filter((p) => p.activo)
})
```

Update `getSiteConfig()`:
```ts
export const getSiteConfig = cache(async (): Promise<SiteConfig> => {
  if (IS_DEV_NO_SHEET) {
    return { whatsappNumero: '+59899000000', whatsappMensaje: 'Hola, me interesa una parcela', emailContacto: 'info@ctprealestate.com' }
  }
  const rows = await readSheet('config!A2:B20')
  return parseConfig(rows)
})
```

- [ ] **Step 2: Run tests to make sure nothing broke**

```bash
npm test
```

Expected: `10 passed`

- [ ] **Step 3: Verify home page loads with mock data**

```bash
npm run dev
```

Open http://localhost:3000. Four project cards should appear with real images.

- [ ] **Step 4: Commit**

```bash
git add lib/projects.ts
git commit -m "feat: mock data fallback for development without Google Sheet"
```

---

## Task 14: Project page — ProjectHero + ValueProps

**Files:**
- Create: `components/project/ProjectHero.tsx`
- Create: `components/project/ValueProps.tsx`

- [ ] **Step 1: Create `components/project/ProjectHero.tsx`**

```tsx
import Image from 'next/image'
import Link from 'next/link'
import type { Proyecto } from '@/lib/types'

interface Props {
  proyecto: Proyecto
}

export default function ProjectHero({ proyecto }: Props) {
  return (
    <section className="relative flex h-screen w-full items-end overflow-hidden bg-black">
      <Image
        src={proyecto.imagenes.hero}
        alt={proyecto.nombre}
        fill
        priority
        sizes="100vw"
        className="object-cover opacity-70"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30" />

      <div className="relative z-10 w-full px-6 pb-16 md:px-16 md:pb-24">
        <p className="mb-3 text-xs font-medium tracking-widest text-white/60 uppercase">
          {proyecto.ubicacion}
        </p>
        <h1 className="mb-4 text-5xl font-light tracking-wider text-white md:text-7xl">
          {proyecto.nombre}
        </h1>
        <p className="mb-8 text-lg font-light text-white/80">
          Desde{' '}
          <span className="font-semibold text-gold">
            USD ${proyecto.precioDesde.toLocaleString('es-UY')}
          </span>
        </p>
        <Link
          href="#contacto"
          className="inline-block border border-white px-8 py-4 text-xs font-semibold tracking-widest text-white uppercase transition-colors hover:border-gold hover:text-gold"
        >
          Consultar
        </Link>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Create `components/project/ValueProps.tsx`**

```tsx
'use client'

import { motion } from 'framer-motion'

interface Props {
  destacados: string[]
}

const ICONS = ['◈', '◇', '◉']

export default function ValueProps({ destacados }: Props) {
  return (
    <section className="border-b border-gray px-6 py-16 md:px-16">
      <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
        {destacados.slice(0, 3).map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: i * 0.12 }}
            className="flex flex-col gap-3"
          >
            <span className="text-2xl text-gold">{ICONS[i]}</span>
            <p className="text-base font-light tracking-wide text-black">{item}</p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add components/project/ProjectHero.tsx components/project/ValueProps.tsx
git commit -m "feat: ProjectHero and ValueProps sections"
```

---

## Task 15: Gallery + Masterplan

**Files:**
- Create: `components/project/Gallery.tsx`
- Create: `components/project/Masterplan.tsx`

- [ ] **Step 1: Create `components/project/Gallery.tsx`**

```tsx
'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import Lightbox from 'yet-another-react-lightbox'
import 'yet-another-react-lightbox/styles.css'

interface Props {
  imagenes: string[]
}

export default function Gallery({ imagenes }: Props) {
  const [open, setOpen] = useState(false)
  const [index, setIndex] = useState(0)

  return (
    <section className="px-6 py-16 md:px-16">
      <p className="mb-8 text-xs font-semibold tracking-widest text-graphite uppercase">Galería</p>
      <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
        {imagenes.map((src, i) => (
          <motion.div
            key={i}
            className="mb-4 cursor-pointer overflow-hidden"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.06 }}
            onClick={() => { setIndex(i); setOpen(true) }}
          >
            <Image
              src={src}
              alt={`Imagen ${i + 1}`}
              width={800}
              height={600}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="w-full object-cover transition-transform duration-500 hover:scale-105"
            />
          </motion.div>
        ))}
      </div>

      <Lightbox
        open={open}
        close={() => setOpen(false)}
        index={index}
        slides={imagenes.map((src) => ({ src }))}
      />
    </section>
  )
}
```

- [ ] **Step 2: Create `components/project/Masterplan.tsx`**

```tsx
'use client'

import Image from 'next/image'
import Zoom from 'react-medium-image-zoom'
import 'react-medium-image-zoom/dist/styles.css'

interface Props {
  src: string
}

export default function Masterplan({ src }: Props) {
  return (
    <section className="bg-gray-light px-6 py-16 md:px-16">
      <p className="mb-8 text-xs font-semibold tracking-widest text-graphite uppercase">Plano del proyecto</p>
      <Zoom>
        <Image
          src={src}
          alt="Plano maestro"
          width={1200}
          height={800}
          sizes="(max-width: 768px) 100vw, 80vw"
          className="w-full cursor-zoom-in object-contain"
        />
      </Zoom>
      <p className="mt-4 text-xs text-graphite">Haz clic en el plano para ampliar</p>
    </section>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add components/project/Gallery.tsx components/project/Masterplan.tsx
git commit -m "feat: Gallery with lightbox and Masterplan with zoom"
```

---

## Task 16: Amenities + NearbyPoints + MapEmbed

**Files:**
- Create: `components/project/Amenities.tsx`
- Create: `components/project/NearbyPoints.tsx`
- Create: `components/project/MapEmbed.tsx`

- [ ] **Step 1: Create `components/project/Amenities.tsx`**

```tsx
'use client'

import { motion } from 'framer-motion'

interface Props {
  amenities: string[]
}

export default function Amenities({ amenities }: Props) {
  return (
    <section className="border-t border-gray px-6 py-16 md:px-16">
      <p className="mb-8 text-xs font-semibold tracking-widest text-graphite uppercase">Servicios y amenities</p>
      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {amenities.map((item, i) => (
          <motion.li
            key={i}
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.06 }}
            className="flex items-center gap-3 text-sm text-black"
          >
            <span className="h-px w-6 bg-gold flex-shrink-0" />
            {item}
          </motion.li>
        ))}
      </ul>
    </section>
  )
}
```

- [ ] **Step 2: Create `components/project/NearbyPoints.tsx`**

```tsx
'use client'

import { motion } from 'framer-motion'

interface Props {
  puntos: string[]
}

export default function NearbyPoints({ puntos }: Props) {
  return (
    <section className="bg-black px-6 py-16 md:px-16">
      <p className="mb-8 text-xs font-semibold tracking-widest text-white/50 uppercase">Entorno</p>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {puntos.map((punto, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            className="border-b border-white/10 pb-4"
          >
            <p className="text-sm font-light text-white">{punto}</p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
```

- [ ] **Step 3: Create `components/project/MapEmbed.tsx`**

```tsx
interface Props {
  coordenadas: string
  nombre: string
}

export default function MapEmbed({ coordenadas, nombre }: Props) {
  const [lat, lng] = coordenadas.split(',').map(Number)
  const src = `https://maps.google.com/maps?q=${lat},${lng}&z=14&output=embed`

  return (
    <section className="px-6 py-16 md:px-16">
      <p className="mb-8 text-xs font-semibold tracking-widest text-graphite uppercase">Ubicación</p>
      <div className="overflow-hidden border border-gray">
        <iframe
          src={src}
          title={`Ubicación ${nombre}`}
          width="100%"
          height="400"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="block"
        />
      </div>
    </section>
  )
}
```

- [ ] **Step 4: Commit**

```bash
git add components/project/Amenities.tsx components/project/NearbyPoints.tsx components/project/MapEmbed.tsx
git commit -m "feat: Amenities, NearbyPoints, and MapEmbed sections"
```

---

## Task 17: FinancingCalc (Client Component)

**Files:**
- Create: `components/project/FinancingCalc.tsx`

- [ ] **Step 1: Create `components/project/FinancingCalc.tsx`**

```tsx
'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { calcularFinanciamiento } from '@/lib/financing'

interface Props {
  precioBase: number
  cuotas: number[]
  tasas: number[]
}

export default function FinancingCalc({ precioBase, cuotas, tasas }: Props) {
  const [precio, setPrecio] = useState(precioBase)
  const [plazoIdx, setPlazoIdx] = useState(1)

  const result = calcularFinanciamiento(precio, cuotas[plazoIdx], tasas[plazoIdx])

  const fmt = (n: number) =>
    `USD $${n.toLocaleString('es-UY')}`

  return (
    <section id="calculadora" className="border-t border-gray bg-gray-light px-6 py-16 md:px-16">
      <p className="mb-2 text-xs font-semibold tracking-widest text-graphite uppercase">Calculadora de financiamiento</p>
      <p className="mb-10 text-sm text-graphite">40% de pie + cuotas mensuales. Valores orientativos.</p>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        <div className="flex flex-col gap-6">
          <div>
            <label className="mb-2 block text-xs tracking-wider text-graphite uppercase">
              Precio del lote (USD)
            </label>
            <input
              type="number"
              value={precio}
              onChange={(e) => setPrecio(Number(e.target.value))}
              step={5000}
              min={50000}
              max={200000}
              className="w-full border border-gray bg-white px-4 py-3 text-sm text-black outline-none focus:border-black"
            />
          </div>

          <div>
            <label className="mb-3 block text-xs tracking-wider text-graphite uppercase">Plazo</label>
            <div className="flex gap-3">
              {cuotas.map((c, i) => (
                <button
                  key={c}
                  onClick={() => setPlazoIdx(i)}
                  className={`flex-1 border py-3 text-xs font-semibold tracking-widest uppercase transition-colors ${
                    plazoIdx === i
                      ? 'border-black bg-black text-white'
                      : 'border-gray bg-white text-black hover:border-black'
                  }`}
                >
                  {c} cuotas
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-center gap-5">
          {[
            { label: 'Pie inicial (40%)', value: result.pie },
            { label: 'Cuota mensual', value: result.cuotaMensual, highlight: true },
            { label: 'Total financiado', value: result.totalFinanciado },
          ].map(({ label, value, highlight }) => (
            <div key={label} className={`flex items-center justify-between border-b border-gray pb-4 ${highlight ? 'text-black' : 'text-graphite'}`}>
              <span className="text-xs tracking-wider uppercase">{label}</span>
              <AnimatePresence mode="wait">
                <motion.span
                  key={value}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.2 }}
                  className={`font-semibold ${highlight ? 'text-xl text-gold' : 'text-sm'}`}
                >
                  {fmt(value)}
                </motion.span>
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add components/project/FinancingCalc.tsx
git commit -m "feat: interactive financing calculator with animated outputs"
```

---

## Task 18: ContactForm (Client Component + Server Action)

**Files:**
- Create: `components/project/ContactForm.tsx`

- [ ] **Step 1: Create `components/project/ContactForm.tsx`**

```tsx
'use client'

import { useActionState } from 'react'
import { submitLead } from '@/lib/actions'

interface Props {
  proyectoSlug: string
  proyectoNombre: string
}

const initialState = { success: false, error: null }

export default function ContactForm({ proyectoSlug, proyectoNombre }: Props) {
  const [state, action, isPending] = useActionState(submitLead, initialState)

  if (state.success) {
    return (
      <section id="contacto" className="bg-black px-6 py-20 md:px-16">
        <div className="max-w-xl">
          <p className="mb-3 text-xs font-semibold tracking-widest text-white/50 uppercase">Contacto</p>
          <h2 className="mb-6 text-3xl font-light tracking-wider text-white">¡Mensaje recibido!</h2>
          <p className="text-sm font-light text-white/70">
            Nos comunicaremos contigo a la brevedad para brindarte toda la información sobre {proyectoNombre}.
          </p>
        </div>
      </section>
    )
  }

  return (
    <section id="contacto" className="bg-black px-6 py-20 md:px-16">
      <div className="max-w-xl">
        <p className="mb-3 text-xs font-semibold tracking-widest text-white/50 uppercase">Contacto</p>
        <h2 className="mb-10 text-3xl font-light tracking-wider text-white">
          Consulta sobre {proyectoNombre}
        </h2>

        <form action={action} className="flex flex-col gap-5">
          <input type="hidden" name="proyecto" value={proyectoSlug} />

          {[
            { name: 'nombre', label: 'Nombre completo', type: 'text', required: true },
            { name: 'email', label: 'Email', type: 'email', required: true },
            { name: 'telefono', label: 'Teléfono / WhatsApp', type: 'tel', required: true },
          ].map(({ name, label, type, required }) => (
            <div key={name}>
              <label className="mb-2 block text-xs tracking-widest text-white/50 uppercase">
                {label}
              </label>
              <input
                name={name}
                type={type}
                required={required}
                className="w-full border border-white/20 bg-transparent px-4 py-3 text-sm text-white placeholder-white/30 outline-none focus:border-white transition-colors"
              />
            </div>
          ))}

          <div>
            <label className="mb-2 block text-xs tracking-widest text-white/50 uppercase">
              Mensaje (opcional)
            </label>
            <textarea
              name="mensaje"
              rows={4}
              className="w-full border border-white/20 bg-transparent px-4 py-3 text-sm text-white placeholder-white/30 outline-none focus:border-white transition-colors resize-none"
              placeholder="¿En qué lote estás interesado?"
            />
          </div>

          {state.error && (
            <p className="text-xs text-red-400">{state.error}</p>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="mt-2 border border-white px-8 py-4 text-xs font-semibold tracking-widest text-white uppercase transition-colors hover:bg-white hover:text-black disabled:opacity-50"
          >
            {isPending ? 'Enviando...' : 'Enviar consulta'}
          </button>
        </form>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add components/project/ContactForm.tsx
git commit -m "feat: ContactForm with Server Action and success state"
```

---

## Task 19: StickyContact + PageTransition

**Files:**
- Create: `components/shared/StickyContact.tsx`
- Create: `components/shared/PageTransition.tsx`

- [ ] **Step 1: Create `components/shared/StickyContact.tsx`**

```tsx
'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function StickyContact() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.8)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  if (!visible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 flex items-center justify-between bg-black/95 px-6 py-4 backdrop-blur-sm md:px-12">
      <p className="text-xs font-light text-white/70 hidden sm:block">
        ¿Te interesa este proyecto?
      </p>
      <Link
        href="#contacto"
        className="ml-auto border border-white px-6 py-3 text-xs font-semibold tracking-widest text-white uppercase transition-colors hover:bg-white hover:text-black"
      >
        Consultar ahora
      </Link>
    </div>
  )
}
```

- [ ] **Step 2: Create `components/shared/PageTransition.tsx`**

```tsx
'use client'

import { motion } from 'framer-motion'

export default function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add components/shared/StickyContact.tsx components/shared/PageTransition.tsx
git commit -m "feat: StickyContact bar and PageTransition wrapper"
```

---

## Task 20: JSON-LD component + project page assembly

**Files:**
- Create: `components/project/JsonLd.tsx`
- Create: `app/parcelas-[slug]/page.tsx`
- Create: `app/parcelas-[slug]/loading.tsx`

- [ ] **Step 1: Create `components/project/JsonLd.tsx`**

```tsx
import type { Proyecto } from '@/lib/types'

interface Props {
  proyecto: Proyecto
}

export default function JsonLd({ proyecto }: Props) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: `Parcelas ${proyecto.nombre}`,
    description: proyecto.descripcion,
    offers: {
      '@type': 'Offer',
      priceCurrency: 'USD',
      price: proyecto.precioDesde.toString(),
      availability: 'https://schema.org/InStock',
    },
    areaServed: {
      '@type': 'Place',
      name: proyecto.ubicacion,
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
```

- [ ] **Step 2: Create `app/parcelas-[slug]/loading.tsx`**

```tsx
export default function Loading() {
  return (
    <div className="flex h-screen items-center justify-center bg-white">
      <div className="h-px w-24 animate-pulse bg-gray" />
    </div>
  )
}
```

- [ ] **Step 3: Create `app/parcelas-[slug]/page.tsx`**

```tsx
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Nav from '@/components/ui/Nav'
import ProjectHero from '@/components/project/ProjectHero'
import ValueProps from '@/components/project/ValueProps'
import Gallery from '@/components/project/Gallery'
import Masterplan from '@/components/project/Masterplan'
import Amenities from '@/components/project/Amenities'
import NearbyPoints from '@/components/project/NearbyPoints'
import MapEmbed from '@/components/project/MapEmbed'
import FinancingCalc from '@/components/project/FinancingCalc'
import ContactForm from '@/components/project/ContactForm'
import StickyContact from '@/components/shared/StickyContact'
import PageTransition from '@/components/shared/PageTransition'
import Footer from '@/components/shared/Footer'
import JsonLd from '@/components/project/JsonLd'
import { getProyectos, getProyectoBySlug } from '@/lib/projects'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const proyectos = await getProyectos()
  return proyectos.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const proyecto = await getProyectoBySlug(slug)
  if (!proyecto) return {}

  const title = `Parcelas en ${proyecto.ubicacion} desde USD $${proyecto.precioDesde.toLocaleString('es-UY')} | ${proyecto.nombre}`
  const description = `${proyecto.nombre} — parcelas en ${proyecto.ubicacion}. Desde USD $${proyecto.precioDesde.toLocaleString('es-UY')} con financiamiento en ${proyecto.financiamientoCuotas.join(', ')} cuotas. ${proyecto.puntosCercanos[0] ?? ''}. Consulta hoy.`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [{ url: proyecto.imagenes.hero }],
      type: 'website',
    },
  }
}

export const revalidate = 30

export default async function ProyectoPage({ params }: Props) {
  const { slug } = await params
  const proyecto = await getProyectoBySlug(slug)
  if (!proyecto) notFound()

  return (
    <PageTransition>
      <JsonLd proyecto={proyecto} />
      <Nav />
      <ProjectHero proyecto={proyecto} />
      <ValueProps destacados={proyecto.destacados} />
      <Gallery imagenes={proyecto.imagenes.galeria} />
      {proyecto.imagenes.plano && <Masterplan src={proyecto.imagenes.plano} />}
      <Amenities amenities={proyecto.amenities} />
      <NearbyPoints puntos={proyecto.puntosCercanos} />
      <MapEmbed coordenadas={proyecto.coordenadas} nombre={proyecto.nombre} />
      <FinancingCalc
        precioBase={proyecto.precioDesde}
        cuotas={proyecto.financiamientoCuotas}
        tasas={proyecto.financiamientoTasas}
      />
      <ContactForm proyectoSlug={proyecto.slug} proyectoNombre={proyecto.nombre} />
      <StickyContact />
      <Footer />
    </PageTransition>
  )
}
```

- [ ] **Step 4: Verify project pages**

```bash
npm run dev
```

Open http://localhost:3000/parcelas-la-martina. Verify: all sections render, gallery opens lightbox on click, calculator updates in real time, form shows validation, sticky bar appears after scrolling.

- [ ] **Step 5: Run all tests**

```bash
npm test
```

Expected: `10 passed`

- [ ] **Step 6: Commit**

```bash
git add app/parcelas-\[slug\]/ components/project/JsonLd.tsx
git commit -m "feat: project page with all sections, metadata, and JSON-LD"
```

---

## Task 21: Sitemap + robots.txt

**Files:**
- Create: `app/sitemap.ts`
- Create: `app/robots.ts`

- [ ] **Step 1: Create `app/sitemap.ts`**

```ts
import type { MetadataRoute } from 'next'
import { getProyectos } from '@/lib/projects'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const proyectos = await getProyectos()
  const baseUrl = 'https://ctprealestate.com'

  const proyectoUrls = proyectos.map((p) => ({
    url: `${baseUrl}/parcelas-${p.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }))

  return [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    ...proyectoUrls,
  ]
}
```

- [ ] **Step 2: Create `app/robots.ts`**

```ts
import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: 'https://ctprealestate.com/sitemap.xml',
  }
}
```

- [ ] **Step 3: Commit**

```bash
git add app/sitemap.ts app/robots.ts
git commit -m "feat: dynamic sitemap and robots.txt"
```

---

## Task 22: Google Sheet setup

> This task is manual — no code required.

- [ ] **Step 1: Create the Google Sheet**

1. Go to https://sheets.google.com and create a new spreadsheet named **"CTP Real Estate CMS"**
2. Rename the default sheet tab to `proyectos`
3. Add two more tabs: `leads` and `config`

- [ ] **Step 2: Set up `proyectos` tab headers (Row 1)**

```
slug | nombre | ubicacion | precio_desde | precio_hasta | descripcion | destacados | amenities | puntos_cercanos | coordenadas | financiamiento_inicial | financiamiento_cuotas | financiamiento_tasa | activo
```

- [ ] **Step 3: Add the 4 projects as rows 2–5**

Row 2 (La Martina):
```
la-martina | La Martina | José Ignacio, Uruguay | 90000 | 130000 | Barrio privado con vista al mar en José Ignacio, Uruguay. Parcelas de alto valor con acceso controlado y entorno natural privilegiado. Ideal para inversión o construcción de vivienda. | Vista al mar,Seguridad 24h,Entorno natural | Portón controlado,Caminería interna,Agua potable,Energía eléctrica | Playa a 500m,José Ignacio a 8km,Punta del Este a 35km,Montevideo a 180km | -34.8412,-54.6721 | 40 | 12,24,36 | 0.6,0.7,0.75 | TRUE
```

Row 3 (Aires de Manantiales):
```
aires-manantiales | Aires de Manantiales | Manantiales, Uruguay | 70000 | 100000 | Parcelas en Manantiales rodeadas de naturaleza exuberante. Una de las zonas de mayor crecimiento en Uruguay. | Naturaleza pura,Acceso directo,Alta valorización | Acceso controlado,Caminería interna,Agua potable | José Ignacio a 10km,Laguna Garzón a 15km,Punta del Este a 45km | -34.7900,-54.5800 | 40 | 12,24,36 | 0.6,0.7,0.75 | TRUE
```

Row 4 (Ama José Ignacio):
```
ama-jose-ignacio | Ama José Ignacio | José Ignacio, Uruguay | 55000 | 130000 | Parcelas en el corazón de José Ignacio. Vive rodeado de la belleza natural uruguaya con todas las comodidades. | Ubicación premium,Vistas panorámicas,Financiamiento flexible | Portón controlado,Caminería pavimentada,Agua potable,Iluminación | Centro José Ignacio a 5km,Playa a 3km,Punta del Este a 30km | -34.8600,-54.6400 | 40 | 12,24,36 | 0.6,0.7,0.75 | TRUE
```

Row 5 (Tierras del Este):
```
tierras-del-este | Tierras del Este | Rocha, Uruguay | 80000 | 90000 | Amplias parcelas en la región este de Uruguay. Tranquilidad, naturaleza y potencial de valorización excepcional. | Grandes extensiones,Precio accesible,Alta valorización | Acceso asfaltado,Agua potable,Electricidad | Rocha a 20km,La Paloma a 35km,Montevideo a 220km | -34.4800,-54.3400 | 40 | 12,24,36 | 0.6,0.7,0.75 | TRUE
```

- [ ] **Step 4: Set up `config` tab (A2:B4)**

```
whatsapp_numero   | +59899XXXXXX
whatsapp_mensaje  | Hola, me interesa información sobre una de sus parcelas
email_contacto    | info@ctprealestate.com
```

- [ ] **Step 5: Set up `leads` tab headers (Row 1)**

```
timestamp | nombre | email | telefono | mensaje | proyecto
```

- [ ] **Step 6: Share the sheet with the service account**

In the Sheet → Share → add `web-uruguay-sheet@web-uruguay.iam.gserviceaccount.com` with **Editor** role.

- [ ] **Step 7: Copy the Sheet ID from the URL**

URL pattern: `https://docs.google.com/spreadsheets/d/SHEET_ID_HERE/edit`

Copy `SHEET_ID_HERE` and update `.env.local`:
```
GOOGLE_SHEET_ID=SHEET_ID_HERE
```

- [ ] **Step 8: Test the live connection**

```bash
npm run dev
```

Open http://localhost:3000. Confirm project cards load from Google Sheets (not mock data). Check the console — if you see `readSheet` errors, verify the sheet is shared with the service account.

---

## Task 23: next.config.ts — images + security headers

**Files:**
- Modify: `next.config.ts`

- [ ] **Step 1: Update `next.config.ts`**

```ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    formats: ['image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
    ]
  },
}

export default nextConfig
```

- [ ] **Step 2: Commit**

```bash
git add next.config.ts
git commit -m "feat: next.config with WebP images and security headers"
```

---

## Task 24: Production build + Vercel deploy

**Files:**
- Create: `vercel.json` (optional — for env vars reminder)

- [ ] **Step 1: Run production build locally**

```bash
npm run build
```

Expected: build succeeds with no errors. Note: static pages `/parcelas-la-martina`, etc. should appear in the build output.

- [ ] **Step 2: Fix any TypeScript or build errors**

Common issues:
- Missing `alt` props on `<Image>` → add descriptive alt text
- `useActionState` not found → ensure Next.js 15 is installed
- `'use client'` missing on components using hooks → add directive at top of file

- [ ] **Step 3: Run tests one final time**

```bash
npm test
```

Expected: `10 passed`

- [ ] **Step 4: Final commit**

```bash
git add -A
git commit -m "chore: production build verified"
```

- [ ] **Step 5: Deploy to Vercel**

```bash
npx vercel --prod
```

Or connect the repo to Vercel via the dashboard and add these environment variables in Vercel project settings:
```
GOOGLE_SERVICE_ACCOUNT_EMAIL
GOOGLE_PRIVATE_KEY
GOOGLE_SHEET_ID
```

> **Important for `GOOGLE_PRIVATE_KEY` in Vercel:** Paste the key value as-is from `.env.local` (including `\n` characters). Vercel handles the escaping correctly.

- [ ] **Step 6: Verify deployed site**

Open the Vercel URL. Check:
- [ ] Home page loads with video
- [ ] All 4 project cards visible
- [ ] Clicking a project navigates to `/parcelas-[slug]`
- [ ] Gallery lightbox works
- [ ] Calculator updates in real time
- [ ] Contact form submits (check Google Sheets `leads` tab for the new row)
- [ ] WhatsApp button opens correct number
- [ ] `/sitemap.xml` returns XML with all project URLs

---

## Self-Review Checklist

**Spec coverage:**
- ✅ Google Sheets CMS — `lib/sheets.ts`, `lib/projects.ts` (Tasks 4, 13)
- ✅ 4 project pages with semantic URLs — `app/parcelas-[slug]/page.tsx` (Task 20)
- ✅ Home hero with video — `HomeHero.tsx` (Task 10)
- ✅ Project grid — `ProjectGrid.tsx` + `ProjectCard.tsx` (Task 11)
- ✅ Gallery with lightbox — `Gallery.tsx` (Task 15)
- ✅ Masterplan with zoom — `Masterplan.tsx` (Task 15)
- ✅ Amenities, NearbyPoints, MapEmbed — (Task 16)
- ✅ Financing calculator — `FinancingCalc.tsx` (Task 17)
- ✅ Contact form → Google Sheets — `ContactForm.tsx` + `actions.ts` (Tasks 6, 18)
- ✅ WhatsApp floating button — `WhatsAppButton.tsx` (Task 8)
- ✅ Sticky CTA — `StickyContact.tsx` (Task 19)
- ✅ Framer Motion page transitions — `PageTransition.tsx` (Task 19)
- ✅ Lenis smooth scroll — `LenisProvider.tsx` (Task 8)
- ✅ SEO metadata + JSON-LD — (Task 20)
- ✅ sitemap.xml + robots.txt — (Task 21)
- ✅ Brand palette + Montserrat — (Task 7)
- ✅ Nav transparent→white on scroll — `Nav.tsx` (Task 9)
- ✅ Mock data fallback for dev — (Task 13)
- ✅ Assets copied to /public — (Task 2)
- ✅ Vercel deployment — (Task 24)

**Type consistency:**
- `Proyecto` used consistently across all components
- `parseProyecto` → `getProyectos` → `getProyectoBySlug` → page props — chain is correct
- `calcularFinanciamiento` signature matches `FinancingCalc` usage
- `submitLead` / `validateLead` — same `Lead` type throughout
