import Logo from '@/components/ui/Logo'

export default function Footer() {
  return (
    <footer className="border-t border-[#D9D9D9] bg-white px-6 py-12 md:px-12">
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <Logo variant="negro" />
        <div className="flex flex-col gap-1 text-sm text-[#2E2E2E]">
          <p>Uruguay · Real Estate</p>
          <p>© {new Date().getFullYear()} CTP Real Estate. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  )
}
