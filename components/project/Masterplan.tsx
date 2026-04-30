'use client'

import Image from 'next/image'
import Zoom from 'react-medium-image-zoom'
import 'react-medium-image-zoom/dist/styles.css'

interface Props {
  src: string
}

export default function Masterplan({ src }: Props) {
  return (
    <section className="bg-[#f5f5f5] px-6 py-16 md:px-16">
      <p className="mb-8 text-xs font-semibold tracking-widest text-[#2E2E2E] uppercase">Plano del proyecto</p>
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
      <p className="mt-4 text-xs text-[#2E2E2E]">Haz clic en el plano para ampliar</p>
    </section>
  )
}
