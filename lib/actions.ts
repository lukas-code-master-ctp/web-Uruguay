'use server'

import { writeLeadToSheet } from './sheets'
import type { Lead } from './types'
import { validateLead } from './validation'

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
  } catch (err) {
    console.error('[submitLead] Error writing to Google Sheets:', err)
    return { success: false, error: 'Error al enviar. Intenta nuevamente.' }
  }
}
