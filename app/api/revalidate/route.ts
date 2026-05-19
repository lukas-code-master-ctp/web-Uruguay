import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { getProyectos } from '@/lib/projects'

/**
 * On-demand revalidation endpoint.
 *
 * Llamar después de editar la Google Sheet para refrescar el sitio sin esperar al ISR.
 *
 * Uso:
 *   GET  /api/revalidate?secret=<REVALIDATE_SECRET>
 *   GET  /api/revalidate?secret=<REVALIDATE_SECRET>&path=/chacras/la-martina
 *
 * Sin parámetro `path` → revalida home + todas las páginas de proyectos.
 * Con `path` → revalida solo esa ruta específica.
 */
export async function GET(req: NextRequest): Promise<NextResponse> {
  const secret = req.nextUrl.searchParams.get('secret')
  const expectedSecret = process.env.REVALIDATE_SECRET

  if (!expectedSecret) {
    return NextResponse.json(
      { ok: false, error: 'REVALIDATE_SECRET no configurado en el servidor' },
      { status: 500 },
    )
  }

  if (secret !== expectedSecret) {
    return NextResponse.json(
      { ok: false, error: 'Secret inválido' },
      { status: 401 },
    )
  }

  const path = req.nextUrl.searchParams.get('path')

  try {
    const revalidated: string[] = []

    if (path) {
      revalidatePath(path)
      revalidated.push(path)
    } else {
      // Revalidar home + todas las páginas de proyectos
      revalidatePath('/')
      revalidated.push('/')

      const proyectos = await getProyectos()
      for (const p of proyectos) {
        const projectPath = `/chacras/${p.slug}`
        revalidatePath(projectPath)
        revalidated.push(projectPath)
      }
    }

    return NextResponse.json({
      ok: true,
      revalidated,
      timestamp: new Date().toISOString(),
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error inesperado'
    return NextResponse.json({ ok: false, error: message }, { status: 500 })
  }
}
