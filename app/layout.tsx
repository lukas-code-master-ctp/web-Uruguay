import type { Metadata } from 'next'
import { Montserrat } from 'next/font/google'
import './globals.css'
import LenisProvider from '@/components/shared/LenisProvider'
import WhatsAppButton from '@/components/shared/WhatsAppButton'
import Nav from '@/components/ui/Nav'
import { getSiteConfig, getProyectos } from '@/lib/projects'

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['300', '400', '600', '700'],
  variable: '--font-montserrat',
  display: 'swap',
})

// URL base para resolver imágenes OG a URLs absolutas (necesario para que
// WhatsApp/Facebook/Google las lean). Toma el dominio de producción de Vercel
// automáticamente; se puede forzar con NEXT_PUBLIC_SITE_URL (dominio final).
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : 'http://localhost:3000')

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'CTP Real Estate | Chacras en Uruguay',
  description: 'Chacras rurales en Uruguay. Inversión en naturaleza con financiamiento. CTP Real Estate.',
  openGraph: {
    siteName: 'CTP Real Estate',
    locale: 'es_UY',
    type: 'website',
    images: [
      { url: '/og.jpg', width: 1200, height: 630, alt: 'CTP Real Estate — Chacras en Uruguay' },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CTP Real Estate | Chacras en Uruguay',
    description: 'Chacras rurales en Uruguay. Inversión en naturaleza con financiamiento.',
    images: ['/og.jpg'],
  },
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [config, proyectos] = await Promise.all([getSiteConfig(), getProyectos()])

  // Solo proyectos activos aparecen en el nav — los SOLD OUT no son linkeables.
  const navProyectos = proyectos
    .filter((p) => p.activo)
    .map((p) => ({ slug: p.slug, nombre: p.nombre }))

  return (
    <html lang="es" className={montserrat.variable}>
      <body>
        <LenisProvider>
          <Nav proyectos={navProyectos} />
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
