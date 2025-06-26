import { describe, expect, it } from 'vitest'

import { pwdCrypt, pwdVerify } from './helper'

describe('pwdCrypt', () => {
  it('deve criptografar uma senha', async () => {
    const password = 'minhasenha123'
    const hash = await pwdCrypt(password)
    
    expect(hash).toBeDefined()
    expect(hash).not.toBe(password)
    expect(typeof hash).toBe('string')
    expect(hash.length).toBeGreaterThan(0)
  })

  it('deve gerar hashes diferentes para a mesma senha', async () => {
    const password = 'minhasenha123'
    const hash1 = await pwdCrypt(password)
    const hash2 = await pwdCrypt(password)
    
    expect(hash1).not.toBe(hash2)
  })

  it('deve criptografar senhas vazias', async () => {
    const hash = await pwdCrypt('')
    
    expect(hash).toBeDefined()
    expect(typeof hash).toBe('string')
  })

  it('deve criptografar senhas com caracteres especiais', async () => {
    const password = 'senha@123!#$%'
    const hash = await pwdCrypt(password)
    
    expect(hash).toBeDefined()
    expect(hash).not.toBe(password)
  })

  it('deve criptografar senhas longas', async () => {
    const password = 'a'.repeat(1000)
    const hash = await pwdCrypt(password)
    
    expect(hash).toBeDefined()
    expect(hash).not.toBe(password)
  })
})

describe('pwdVerify', () => {
  it('deve verificar senha correta', async () => {
    const password = 'minhasenha123'
    const hash = await pwdCrypt(password)
    
    const isValid = await pwdVerify(password, hash)
    expect(isValid).toBe(true)
  })

  it('deve rejeitar senha incorreta', async () => {
    const password = 'minhasenha123'
    const wrongPassword = 'senhaerrada456'
    const hash = await pwdCrypt(password)
    
    const isValid = await pwdVerify(wrongPassword, hash)
    expect(isValid).toBe(false)
  })

  it('deve rejeitar senha vazia quando hash não é vazio', async () => {
    const password = 'minhasenha123'
    const hash = await pwdCrypt(password)
    
    const isValid = await pwdVerify('', hash)
    expect(isValid).toBe(false)
  })

  it('deve retornar false para hash inválido', async () => {
    const password = 'minhasenha123'
    const invalidHash = 'hash-invalido'
    
    const result = await pwdVerify(password, invalidHash)
    expect(result).toBe(false)
  })

  it('deve verificar senhas com caracteres especiais', async () => {
    const password = 'senha@123!#$%'
    const hash = await pwdCrypt(password)
    
    const isValid = await pwdVerify(password, hash)
    expect(isValid).toBe(true)
  })

  it('deve ser case sensitive', async () => {
    const password = 'MinHaSenha123'
    const hash = await pwdCrypt(password)
    
    const isValidCorrect = await pwdVerify('MinHaSenha123', hash)
    const isValidWrong = await pwdVerify('minhasenha123', hash)
    
    expect(isValidCorrect).toBe(true)
    expect(isValidWrong).toBe(false)
  })
})