import { describe, expect, it, vi } from 'vitest'

import { jwtSign, jwtVerify } from './helper'
import { JwtPayload } from './types'

describe('jwtSign', () => {
  it('deve gerar um JWT válido', () => {
    const payload: JwtPayload = { userId: 'user123' }
    const token = jwtSign(payload)
    
    expect(token).toBeDefined()
    expect(typeof token).toBe('string')
    expect(token.split('.')).toHaveLength(3) // JWT tem 3 partes separadas por pontos
  })

  it('deve gerar tokens diferentes para payloads diferentes', () => {
    const payload1: JwtPayload = { userId: 'user123' }
    const payload2: JwtPayload = { userId: 'user456' }
    
    const token1 = jwtSign(payload1)
    const token2 = jwtSign(payload2)
    
    expect(token1).not.toBe(token2)
  })

  it('deve retornar string não vazia para qualquer payload', () => {
    const payload: JwtPayload = { userId: 'user123' }
    
    const token = jwtSign(payload)
    
    expect(token).toBeTruthy()
    expect(typeof token).toBe('string')
    expect(token.length).toBeGreaterThan(0)
  })

  it('deve lidar com userId vazio', () => {
    const payload: JwtPayload = { userId: '' }
    const token = jwtSign(payload)
    
    expect(token).toBeDefined()
    expect(typeof token).toBe('string')
  })

  it('deve lidar com userId com caracteres especiais', () => {
    const payload: JwtPayload = { userId: 'user@123!#$%' }
    const token = jwtSign(payload)
    
    expect(token).toBeDefined()
    expect(typeof token).toBe('string')
  })
})

describe('jwtVerify', () => {
  it('deve verificar um JWT válido', () => {
    const payload: JwtPayload = { userId: 'user123' }
    const token = jwtSign(payload)
    
    const decoded = jwtVerify(token)
    
    expect(decoded).toBeDefined()
    expect(decoded?.userId).toBe('user123')
  })

  it('deve rejeitar token inválido', () => {
    const invalidToken = 'token.invalido.aqui'
    
    const decoded = jwtVerify(invalidToken)
    
    expect(decoded).toBeNull()
  })

  it('deve rejeitar token malformado', () => {
    const malformedToken = 'token-sem-pontos'
    
    const decoded = jwtVerify(malformedToken)
    
    expect(decoded).toBeNull()
  })

  it('deve rejeitar string vazia', () => {
    const decoded = jwtVerify('')
    
    expect(decoded).toBeNull()
  })

  it('deve preservar todos os dados do payload', () => {
    const payload: JwtPayload = { userId: 'user123' }
    const token = jwtSign(payload)
    
    const decoded = jwtVerify(token)
    
    expect(decoded).toBeDefined()
    expect(decoded?.userId).toBe(payload.userId)
  })

  it('deve rejeitar token com assinatura incorreta', () => {
    const payload: JwtPayload = { userId: 'user123' }
    const token = jwtSign(payload)
    
    // Modifica o último caractere da assinatura
    const tamperedToken = token.slice(0, -1) + 'X'
    
    const decoded = jwtVerify(tamperedToken)
    
    expect(decoded).toBeNull()
  })

  it('deve lidar com userId com caracteres especiais', () => {
    const payload: JwtPayload = { userId: 'user@123!#$%' }
    const token = jwtSign(payload)
    
    const decoded = jwtVerify(token)
    
    expect(decoded).toBeDefined()
    expect(decoded?.userId).toBe('user@123!#$%')
  })
})