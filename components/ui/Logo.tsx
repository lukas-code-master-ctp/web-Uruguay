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
