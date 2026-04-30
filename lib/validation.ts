import type { Lead } from './types'

export function validateLead(lead: Lead): string | null {
  if (!lead.nombre.trim()) return 'El nombre es requerido'
  if (!lead.email.trim()) return 'El email es requerido'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lead.email)) return 'Email inválido'
  if (!lead.telefono.trim()) return 'El teléfono es requerido'
  return null
}
