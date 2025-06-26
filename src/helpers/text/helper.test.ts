import { describe, expect, it } from 'vitest'

import { textCapitalize, textFirstName } from './helper'

describe('textCapitalize', () => {
  it('deve capitalizar a primeira letra de cada palavra', () => {
    expect(textCapitalize('hello world')).toBe('Hello World')
  })

  it('deve capitalizar uma única palavra', () => {
    expect(textCapitalize('hello')).toBe('Hello')
  })

  it('deve capitalizar palavras com diferentes casos', () => {
    expect(textCapitalize('HELLO WORLD')).toBe('Hello World')
    expect(textCapitalize('hELLo WoRLD')).toBe('Hello World')
  })

  it('deve lidar com múltiplos espaços entre palavras', () => {
    expect(textCapitalize('hello  world   test')).toBe('Hello  World   Test')
  })

  it('deve lidar com string vazia', () => {
    expect(textCapitalize('')).toBe('')
  })

  it('deve lidar com string com apenas espaços', () => {
    expect(textCapitalize('   ')).toBe('   ')
  })

  it('deve capitalizar nomes compostos', () => {
    expect(textCapitalize('maria da silva')).toBe('Maria Da Silva')
  })

  it('deve capitalizar texto com caracteres especiais', () => {
    expect(textCapitalize('joão-pedro')).toBe('João-pedro')
  })
})

describe('textFirstName', () => {
  it('deve retornar apenas o primeiro nome', () => {
    expect(textFirstName('João Silva')).toBe('João')
  })

  it('deve retornar o nome quando há apenas um nome', () => {
    expect(textFirstName('João')).toBe('João')
  })

  it('deve retornar o primeiro nome de nomes compostos', () => {
    expect(textFirstName('Maria da Silva Santos')).toBe('Maria')
  })

  it('deve lidar com string vazia', () => {
    expect(textFirstName('')).toBe('')
  })

  it('deve lidar com string com apenas espaços', () => {
    expect(textFirstName('   ')).toBe('')
  })

  it('deve lidar com espaços no início', () => {
    expect(textFirstName(' João Silva')).toBe('')
  })

  it('deve retornar primeiro nome mesmo com múltiplos espaços', () => {
    expect(textFirstName('João  Silva  Santos')).toBe('João')
  })
})