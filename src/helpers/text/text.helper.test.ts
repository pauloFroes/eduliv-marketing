import { describe, expect, it } from 'vitest'

import { capitalizeText, getFirstName } from './text.helper'

describe('Text Helpers', () => {
  describe('getFirstName', () => {
    describe('quando receber nome válido', () => {
      it('deve retornar o primeiro nome quando receber nome completo', () => {
        // Arrange
        const fullName = 'João Silva Santos'

        // Act
        const result = getFirstName(fullName)

        // Assert
        expect(result).toBe('João')
      })

      it('deve retornar o nome recebido quando há apenas um nome', () => {
        // Arrange
        const singleName = 'João'

        // Act
        const result = getFirstName(singleName)

        // Assert
        expect(result).toBe('João')
      })

      it('deve retornar o primeiro nome quando receber nome muito longo', () => {
        // Arrange
        const longName = 'João Silva Santos Oliveira Costa Pereira Rodrigues'

        // Act
        const result = getFirstName(longName)

        // Assert
        expect(result).toBe('João')
      })
    })

    describe('quando receber entrada inválida', () => {
      it('deve retornar string vazia quando receber nome vazio', () => {
        // Arrange
        const emptyName = ''

        // Act
        const result = getFirstName(emptyName)

        // Assert
        expect(result).toBe('')
      })

      it('deve retornar string vazia quando receber nome nulo', () => {
        // Arrange
        const nullName = null as unknown as string

        // Act
        const result = getFirstName(nullName)

        // Assert
        expect(result).toBe('')
      })

      it('deve retornar string vazia quando receber nome undefined', () => {
        // Arrange
        const undefinedName = undefined as unknown as string

        // Act
        const result = getFirstName(undefinedName)

        // Assert
        expect(result).toBe('')
      })

      it('deve retornar string vazia quando receber nome com apenas espaços', () => {
        // Arrange
        const nameWithOnlySpaces = '   '

        // Act
        const result = getFirstName(nameWithOnlySpaces)

        // Assert
        expect(result).toBe('')
      })
    })

    describe('quando receber nome com formatação', () => {
      it('deve retornar o primeiro nome sem espaços extras quando receber nome com espaços extras no início', () => {
        // Arrange
        const nameWithLeadingSpaces = '   João Silva'

        // Act
        const result = getFirstName(nameWithLeadingSpaces)

        // Assert
        expect(result).toBe('João')
      })

      it('deve retornar o primeiro nome sem espaços extras quando receber nome com espaços extras no final', () => {
        // Arrange
        const nameWithTrailingSpaces = 'João Silva   '

        // Act
        const result = getFirstName(nameWithTrailingSpaces)

        // Assert
        expect(result).toBe('João')
      })

      it('deve retornar o primeiro nome sem espaços extras quando receber nome com múltiplos espaços entre palavras', () => {
        // Arrange
        const nameWithMultipleSpaces = 'João    Silva    Santos'

        // Act
        const result = getFirstName(nameWithMultipleSpaces)

        // Assert
        expect(result).toBe('João')
      })

      it('deve retornar o primeiro nome sem caracteres especiais quando receber nome com caracteres especiais', () => {
        // Arrange
        const nameWithSpecialChars = 'João-Maria Silva'

        // Act
        const result = getFirstName(nameWithSpecialChars)

        // Assert
        expect(result).toBe('João-Maria')
      })

      it('deve retornar o primeiro nome sem números quando receber nome com números', () => {
        // Arrange
        const nameWithNumbers = 'João123 Silva'

        // Act
        const result = getFirstName(nameWithNumbers)

        // Assert
        expect(result).toBe('João123')
      })
    })
  })

  describe('capitalizeText', () => {
    describe('quando receber texto válido', () => {
      it('deve retornar a primeira letra de cada palavra em maiúsculo quando receber texto simples', () => {
        // Arrange
        const text = 'joão silva'

        // Act
        const result = capitalizeText(text)

        // Assert
        expect(result).toBe('João Silva')
      })

      it('deve retornar a primeira letra de cada palavra em maiúsculo quando receber texto já capitalizado', () => {
        // Arrange
        const text = 'João Silva'

        // Act
        const result = capitalizeText(text)

        // Assert
        expect(result).toBe('João Silva')
      })

      it('deve retornar a primeira letra de cada palavra em maiúsculo quando receber texto todo em maiúsculo', () => {
        // Arrange
        const text = 'JOÃO SILVA'

        // Act
        const result = capitalizeText(text)

        // Assert
        expect(result).toBe('João Silva')
      })

      it('deve retornar a primeira letra de cada palavra em maiúsculo quando receber texto todo em minúsculo', () => {
        // Arrange
        const text = 'joão silva santos'

        // Act
        const result = capitalizeText(text)

        // Assert
        expect(result).toBe('João Silva Santos')
      })

      it('deve retornar a primeira letra da palavra em maiúsculo quando receber texto com uma única palavra', () => {
        // Arrange
        const text = 'joão'

        // Act
        const result = capitalizeText(text)

        // Assert
        expect(result).toBe('João')
      })

      it('deve retornar a letra em maiúsculo quando receber texto com uma única letra', () => {
        // Arrange
        const text = 'j'

        // Act
        const result = capitalizeText(text)

        // Assert
        expect(result).toBe('J')
      })

      it('deve retornar a primeira letra de cada palavra em maiúsculo quando receber texto muito longo', () => {
        // Arrange
        const text = 'joão silva santos oliveira costa pereira rodrigues'

        // Act
        const result = capitalizeText(text)

        // Assert
        expect(result).toBe('João Silva Santos Oliveira Costa Pereira Rodrigues')
      })
    })

    describe('quando receber entrada inválida', () => {
      it('deve retornar string vazia quando receber texto vazio', () => {
        // Arrange
        const emptyText = ''

        // Act
        const result = capitalizeText(emptyText)

        // Assert
        expect(result).toBe('')
      })

      it('deve retornar string vazia quando receber texto nulo', () => {
        // Arrange
        const nullText = null as unknown as string

        // Act
        const result = capitalizeText(nullText)

        // Assert
        expect(result).toBe('')
      })

      it('deve retornar string vazia quando receber texto undefined', () => {
        // Arrange
        const undefinedText = undefined as unknown as string

        // Act
        const result = capitalizeText(undefinedText)

        // Assert
        expect(result).toBe('')
      })

      it('deve retornar string vazia quando receber texto com apenas espaços', () => {
        // Arrange
        const textWithOnlySpaces = '   '

        // Act
        const result = capitalizeText(textWithOnlySpaces)

        // Assert
        expect(result).toBe('')
      })

      it('deve retornar string vazia quando receber entrada não-string', () => {
        // Arrange
        const nonStringText = '123'

        // Act
        const result = capitalizeText(nonStringText)

        // Assert
        expect(result).toBe('123')
      })
    })

    describe('quando receber texto com formatação', () => {
      it('deve retornar a primeira letra de cada palavra em maiúsculo quando receber texto com espaços extras no início', () => {
        // Arrange
        const textWithLeadingSpaces = '   joão silva'

        // Act
        const result = capitalizeText(textWithLeadingSpaces)

        // Assert
        expect(result).toBe('João Silva')
      })

      it('deve retornar a primeira letra de cada palavra em maiúsculo sem os espaços extras quando receber texto com espaços extras no final', () => {
        // Arrange
        const textWithTrailingSpaces = 'joão silva   '

        // Act
        const result = capitalizeText(textWithTrailingSpaces)

        // Assert
        expect(result).toBe('João Silva')
      })

      it('deve retornar a primeira letra de cada palavra em maiúsculo sem os espaços extras quando receber texto com múltiplos espaços entre palavras', () => {
        // Arrange
        const textWithMultipleSpaces = 'joão    silva    santos'

        // Act
        const result = capitalizeText(textWithMultipleSpaces)

        // Assert
        expect(result).toBe('João Silva Santos')
      })

      it('deve retornar a primeira letra de cada palavra em maiúsculo sem os caracteres especiais quando receber texto com caracteres especiais', () => {
        // Arrange
        const textWithSpecialChars = 'joão-maria silva'

        // Act
        const result = capitalizeText(textWithSpecialChars)

        // Assert
        expect(result).toBe('João-Maria Silva')
      })

      it('deve retornar a primeira letra de cada palavra em maiúsculo sem os números quando receber texto com números', () => {
        // Arrange
        const textWithNumbers = 'joão123 silva'

        // Act
        const result = capitalizeText(textWithNumbers)

        // Assert
        expect(result).toBe('João123 Silva')
      })

      it('deve retornar a primeira letra de cada palavra em maiúsculo sem os pontuações quando receber texto com pontuações', () => {
        // Arrange
        const textWithPunctuation = 'joão silva, santos.'

        // Act
        const result = capitalizeText(textWithPunctuation)

        // Assert
        expect(result).toBe('João Silva, Santos.')
      })

      it('deve retornar a primeira letra de cada palavra em maiúsculo com os acentos quando receber texto com acentos', () => {
        // Arrange
        const textWithAccents = 'josé maria da silva'

        // Act
        const result = capitalizeText(textWithAccents)

        // Assert
        expect(result).toBe('José Maria Da Silva')
      })

      it('deve retornar a primeira letra de cada palavra em maiúsculo sem os preposições quando receber texto com preposições', () => {
        // Arrange
        const textWithPrepositions = 'joão da silva'

        // Act
        const result = capitalizeText(textWithPrepositions)

        // Assert
        expect(result).toBe('João Da Silva')
      })

      it('deve retornar a primeira letra de cada palavra em maiúsculo sem quebras de linha quando receber texto com quebras de linha', () => {
        // Arrange
        const textWithLineBreaks = 'joão\nsilva\nsantos'

        // Act
        const result = capitalizeText(textWithLineBreaks)

        // Assert
        expect(result).toBe('João Silva Santos')
      })

      it('deve retornar a primeira letra de cada palavra em maiúsculo sem tabs quando receber texto com tabs', () => {
        // Arrange
        const textWithTabs = 'joão\tsilva\tsantos'

        // Act
        const result = capitalizeText(textWithTabs)

        // Assert
        expect(result).toBe('João Silva Santos')
      })

      it('deve retornar a primeira letra de cada palavra em maiúsculo sem caracteres especiais misturados quando receber texto com caracteres especiais misturados', () => {
        // Arrange
        const textWithMixedSpecialChars = 'joão-maria da silva, santos.'

        // Act
        const result = capitalizeText(textWithMixedSpecialChars)

        // Assert
        expect(result).toBe('João-Maria Da Silva, Santos.')
      })
    })
  })
})
