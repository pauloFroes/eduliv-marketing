import { describe, it, expect } from 'vitest'
import { textCapitalize, textFirstName } from './text'

describe('Text Helper Functions', () => {
  describe('textCapitalize', () => {
    it('should capitalize first letter of each word in a sentence', () => {
      const input = 'hello world'
      const expected = 'Hello World'
      
      const result = textCapitalize(input)
      
      expect(result).toBe(expected)
    })

    it('should handle single word', () => {
      const input = 'javascript'
      const expected = 'Javascript'
      
      const result = textCapitalize(input)
      
      expect(result).toBe(expected)
    })

    it('should handle already capitalized text', () => {
      const input = 'Already Capitalized Text'
      const expected = 'Already Capitalized Text'
      
      const result = textCapitalize(input)
      
      expect(result).toBe(expected)
    })

    it('should handle mixed case text', () => {
      const input = 'mIxEd CaSe TeXt'
      const expected = 'Mixed Case Text'
      
      const result = textCapitalize(input)
      
      expect(result).toBe(expected)
    })

    it('should handle all uppercase text', () => {
      const input = 'ALL UPPERCASE TEXT'
      const expected = 'All Uppercase Text'
      
      const result = textCapitalize(input)
      
      expect(result).toBe(expected)
    })

    it('should handle empty string', () => {
      const input = ''
      const expected = ''
      
      const result = textCapitalize(input)
      
      expect(result).toBe(expected)
    })

    it('should handle single character', () => {
      const input = 'a'
      const expected = 'A'
      
      const result = textCapitalize(input)
      
      expect(result).toBe(expected)
    })

    it('should handle multiple spaces between words', () => {
      const input = 'multiple   spaces    between'
      const expected = 'Multiple   Spaces    Between'
      
      const result = textCapitalize(input)
      
      expect(result).toBe(expected)
    })

    it('should handle leading and trailing spaces', () => {
      const input = '  leading and trailing  '
      const expected = '  Leading And Trailing  '
      
      const result = textCapitalize(input)
      
      expect(result).toBe(expected)
    })

    it('should handle text with numbers', () => {
      const input = 'text with 123 numbers'
      const expected = 'Text With 123 Numbers'
      
      const result = textCapitalize(input)
      
      expect(result).toBe(expected)
    })

    it('should handle text with special characters', () => {
      const input = 'text-with@special#characters'
      const expected = 'Text-with@special#characters'
      
      const result = textCapitalize(input)
      
      expect(result).toBe(expected)
    })

    it('should handle text with punctuation', () => {
      const input = 'hello, world! how are you?'
      const expected = 'Hello, World! How Are You?'
      
      const result = textCapitalize(input)
      
      expect(result).toBe(expected)
    })

    it('should handle unicode characters', () => {
      const input = 'café résumé naïve'
      const expected = 'Café Résumé Naïve'
      
      const result = textCapitalize(input)
      
      expect(result).toBe(expected)
    })

    it('should handle text with accented characters', () => {
      const input = 'joão silva andré'
      const expected = 'João Silva André'
      
      const result = textCapitalize(input)
      
      expect(result).toBe(expected)
    })

    it('should handle only spaces', () => {
      const input = '   '
      const expected = '   '
      
      const result = textCapitalize(input)
      
      expect(result).toBe(expected)
    })
  })

  describe('textFirstName', () => {
    it('should return first name from full name', () => {
      const input = 'João Silva Santos'
      const expected = 'João'
      
      const result = textFirstName(input)
      
      expect(result).toBe(expected)
    })

    it('should return single name unchanged', () => {
      const input = 'Maria'
      const expected = 'Maria'
      
      const result = textFirstName(input)
      
      expect(result).toBe(expected)
    })

    it('should handle two names', () => {
      const input = 'Ana Paula'
      const expected = 'Ana'
      
      const result = textFirstName(input)
      
      expect(result).toBe(expected)
    })

    it('should handle many names', () => {
      const input = 'José da Silva Santos Oliveira'
      const expected = 'José'
      
      const result = textFirstName(input)
      
      expect(result).toBe(expected)
    })

    it('should handle empty string', () => {
      const input = ''
      const expected = ''
      
      const result = textFirstName(input)
      
      expect(result).toBe(expected)
    })

    it('should handle single character name', () => {
      const input = 'A'
      const expected = 'A'
      
      const result = textFirstName(input)
      
      expect(result).toBe(expected)
    })

    it('should handle name with leading spaces', () => {
      const input = '  João Silva'
      const expected = ''
      
      const result = textFirstName(input)
      
      expect(result).toBe(expected)
    })

    it('should handle name with trailing spaces', () => {
      const input = 'João Silva  '
      const expected = 'João'
      
      const result = textFirstName(input)
      
      expect(result).toBe(expected)
    })

    it('should handle multiple spaces between names', () => {
      const input = 'João   Silva   Santos'
      const expected = 'João'
      
      const result = textFirstName(input)
      
      expect(result).toBe(expected)
    })

    it('should handle name with numbers', () => {
      const input = 'João123 Silva456'
      const expected = 'João123'
      
      const result = textFirstName(input)
      
      expect(result).toBe(expected)
    })

    it('should handle name with special characters', () => {
      const input = 'João-Carlos Silva'
      const expected = 'João-Carlos'
      
      const result = textFirstName(input)
      
      expect(result).toBe(expected)
    })

    it('should handle unicode names', () => {
      const input = 'José André'
      const expected = 'José'
      
      const result = textFirstName(input)
      
      expect(result).toBe(expected)
    })

    it('should handle only spaces', () => {
      const input = '   '
      const expected = ''
      
      const result = textFirstName(input)
      
      expect(result).toBe(expected)
    })

    it('should handle single space', () => {
      const input = ' '
      const expected = ''
      
      const result = textFirstName(input)
      
      expect(result).toBe(expected)
    })

    it('should handle mixed case names', () => {
      const input = 'jOãO sILvA'
      const expected = 'jOãO'
      
      const result = textFirstName(input)
      
      expect(result).toBe(expected)
    })
  })
})