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

export const metadata: Metadata = {
  title: 'CTP Real Estate | Chacras en Uruguay',
  description: 'Chacras rurales en Uruguay. Inversión en naturaleza con financiamiento. CTP Real Estate.',
  openGraph: {
    siteName: 'CTP Real Estate',
    locale: 'es_UY',
    type: 'website',
  },
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [config, proyectos] = await Promise.all([getSiteConfig(), getProyectos()])

  const navProyectos = proyectos.map((p) => ({ slug: p.slug, nombre: p.nombre }))

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
