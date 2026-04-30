'use server'

import { writeLeadToSheet } from './sheets'
import type { Lead } from './types'
import { validateLead } from './validation'

export async function submitLead(
  _prevState: { success: boolean; error: string | null },
  formData: FormData
): Promise<{ success: boolean; error: string | null }> {
  const str = (key: string) => {
    const v = formData.get(key)
    return typeof v === 'string' ? v : ''
  }

  const lead: Lead = {
    nombre: str('nombre'),
    email: str('email'),
    telefono: str('telefono'),
    mensaje: str('mensaje'),
    proyecto: str('proyecto'),
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
  } catch (err) {
    console.error('[submitLead] Error writing to Google Sheets:', err)
    return { success: false, error: 'Error al enviar. Intenta nuevamente.' }
  }
}
