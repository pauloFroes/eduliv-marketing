import { z } from 'zod'

import { textCapitalize } from '@/helpers/text/text'

export const schemaUserEmail = z
  .string()
  .refine(email => {
    const cleanEmail = email.toLowerCase().trim()
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)
  }, 'Email inválido')
  .transform(email => email.toLowerCase().trim())

export const schemaUserPassword = z
  .string()
  .min(8, 'Senha deve ter no mínimo 8 caracteres')
  .transform(password => password.trim())

export const schemaUserFullName = z
  .string()
  .min(3, 'Nome deve ter no mínimo 3 caracteres')
  .regex(/^[a-zA-ZÀ-ÿ\s]+$/, 'Nome deve conter apenas letras')
  .refine(name => name.trim().split(/\s+/).length > 1, 'Digite o nome completo')
  .transform(name => textCapitalize(name.trim()))

export const schemaUserPhone = z
  .string()
  .regex(/^\d+$/, 'Telefone deve conter apenas números')
  .min(11, 'Telefone deve ter no mínimo 11 dígitos')
  .max(11, 'Telefone deve ter no máximo 11 dígitos')
  .transform(phone => phone.trim())
