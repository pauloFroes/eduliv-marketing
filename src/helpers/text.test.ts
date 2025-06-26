import { describe, it, expect } from 'vitest';
import { textCapitalize, textFirstName } from './text';

describe('text.ts', () => {
  describe('textCapitalize', () => {
    it('deve capitalizar a primeira letra de cada palavra', () => {
      // Arrange
      const input = 'hello world';
      const expected = 'Hello World';

      // Act
      const result = textCapitalize(input);

      // Assert
      expect(result).toBe(expected);
    });

    it('deve lidar com texto já capitalizado', () => {
      // Arrange
      const input = 'Hello World';
      const expected = 'Hello World';

      // Act
      const result = textCapitalize(input);

      // Assert
      expect(result).toBe(expected);
    });

    it('deve lidar com texto em maiúsculas', () => {
      // Arrange
      const input = 'HELLO WORLD';
      const expected = 'Hello World';

      // Act
      const result = textCapitalize(input);

      // Assert
      expect(result).toBe(expected);
    });

    it('deve lidar com uma única palavra', () => {
      // Arrange
      const input = 'hello';
      const expected = 'Hello';

      // Act
      const result = textCapitalize(input);

      // Assert
      expect(result).toBe(expected);
    });

    it('deve lidar com string vazia', () => {
      // Arrange
      const input = '';
      const expected = '';

      // Act
      const result = textCapitalize(input);

      // Assert
      expect(result).toBe(expected);
    });

    it('deve lidar com espaços múltiplos', () => {
      // Arrange
      const input = 'hello  world   test';
      const expected = 'Hello  World   Test';

      // Act
      const result = textCapitalize(input);

      // Assert
      expect(result).toBe(expected);
    });

    it('deve lidar com caracteres especiais', () => {
      // Arrange
      const input = 'hello-world test_case';
      const expected = 'Hello-world Test_case';

      // Act
      const result = textCapitalize(input);

      // Assert
      expect(result).toBe(expected);
    });

    it('deve lidar com números', () => {
      // Arrange
      const input = 'hello 123 world';
      const expected = 'Hello 123 World';

      // Act
      const result = textCapitalize(input);

      // Assert
      expect(result).toBe(expected);
    });

    it('deve lidar com acentos', () => {
      // Arrange
      const input = 'olá mundo';
      const expected = 'Olá Mundo';

      // Act
      const result = textCapitalize(input);

      // Assert
      expect(result).toBe(expected);
    });

    it('deve lidar com espaços no início e fim', () => {
      // Arrange
      const input = ' hello world ';
      const expected = ' Hello World ';

      // Act
      const result = textCapitalize(input);

      // Assert
      expect(result).toBe(expected);
    });
  });

  describe('textFirstName', () => {
    it('deve retornar o primeiro nome de um nome completo', () => {
      // Arrange
      const input = 'João Silva Santos';
      const expected = 'João';

      // Act
      const result = textFirstName(input);

      // Assert
      expect(result).toBe(expected);
    });

    it('deve retornar o nome quando há apenas um nome', () => {
      // Arrange
      const input = 'João';
      const expected = 'João';

      // Act
      const result = textFirstName(input);

      // Assert
      expect(result).toBe(expected);
    });

    it('deve lidar com string vazia', () => {
      // Arrange
      const input = '';
      const expected = '';

      // Act
      const result = textFirstName(input);

      // Assert
      expect(result).toBe(expected);
    });

    it('deve lidar com dois nomes', () => {
      // Arrange
      const input = 'Maria José';
      const expected = 'Maria';

      // Act
      const result = textFirstName(input);

      // Assert
      expect(result).toBe(expected);
    });

    it('deve lidar com nomes com espaços extras', () => {
      // Arrange
      const input = ' João  Silva Santos ';
      const expected = '';

      // Act
      const result = textFirstName(input);

      // Assert
      expect(result).toBe(expected);
    });

    it('deve lidar com múltiplos espaços entre nomes', () => {
      // Arrange
      const input = 'João   Silva   Santos';
      const expected = 'João';

      // Act
      const result = textFirstName(input);

      // Assert
      expect(result).toBe(expected);
    });

    it('deve lidar com caracteres especiais no nome', () => {
      // Arrange
      const input = 'João-Pedro Silva';
      const expected = 'João-Pedro';

      // Act
      const result = textFirstName(input);

      // Assert
      expect(result).toBe(expected);
    });

    it('deve lidar com acentos', () => {
      // Arrange
      const input = 'José António Silva';
      const expected = 'José';

      // Act
      const result = textFirstName(input);

      // Assert
      expect(result).toBe(expected);
    });

    it('deve lidar com nomes compostos separados por espaço', () => {
      // Arrange
      const input = 'Ana Maria Santos';
      const expected = 'Ana';

      // Act
      const result = textFirstName(input);

      // Assert
      expect(result).toBe(expected);
    });

    it('deve lidar com apenas espaços', () => {
      // Arrange
      const input = '   ';
      const expected = '';

      // Act
      const result = textFirstName(input);

      // Assert
      expect(result).toBe(expected);
    });
  });
});