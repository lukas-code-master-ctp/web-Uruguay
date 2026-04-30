import { describe, it, expect } from 'vitest'
import { validateLead } from '@/lib/actions'

describe('validateLead', () => {
  it('returns null when all fields are valid', () => {
    const error = validateLead({
      nombre: 'Juan',
      email: 'juan@mail.com',
      telefono: '+59899123456',
      mensaje: 'Hola',
      proyecto: 'la-martina',
    })
    expect(error).toBeNull()
  })

  it('returns error when nombre is empty', () => {
    const error = validateLead({
      nombre: '',
      email: 'juan@mail.com',
      telefono: '+59899123456',
      mensaje: 'Hola',
      proyecto: 'la-martina',
    })
    expect(error).toBe('El nombre es requerido')
  })

  it('returns error when email is invalid', () => {
    const error = validateLead({
      nombre: 'Juan',
      email: 'not-an-email',
      telefono: '+59899123456',
      mensaje: 'Hola',
      proyecto: 'la-martina',
    })
    expect(error).toBe('Email inválido')
  })
})
