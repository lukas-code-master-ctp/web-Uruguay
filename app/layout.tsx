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
