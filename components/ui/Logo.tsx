import Image from 'next/image'
import Link from 'next/link'

interface Props {
  variant?: 'negro' | 'blanco'
  className?: string
}

export default function Logo({ variant = 'negro', className = 'h-10 w-auto' }: Props) {
  return (
    <Link href="/" className="inline-flex items-center">
      <Image
        src={`/brand/logo-${variant}.png`}
        alt="CTP Real Estate"
        width={140}
        height={50}
        className={`w-auto ${className}`}
        priority
      />
    </Link>
  )
}
