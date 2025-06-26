import { describe, it, expect, vi, beforeEach } from 'vitest';
import jwt from 'jsonwebtoken';
import { jwtSign, jwtVerify } from './jwt';

// Mock do jsonwebtoken
vi.mock('jsonwebtoken', () => ({
  default: {
    sign: vi.fn(),
    verify: vi.fn(),
  },
}));

describe('jwt.ts', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('jwtSign', () => {
    it('deve assinar um token JWT com payload válido', () => {
      // Arrange
      const payload = { userId: 'user123' };
      const expectedToken = 'mock.jwt.token';
      (jwt.sign as any).mockReturnValue(expectedToken);

      // Act
      const result = jwtSign(payload);

      // Assert
      expect(jwt.sign).toHaveBeenCalledWith(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: Number(process.env.JWT_EXPIRES_IN) }
      );
      expect(result).toBe(expectedToken);
    });

    it('deve lidar com diferentes userIds', () => {
      // Arrange
      const payload = { userId: 'different-user-id' };
      const expectedToken = 'different.jwt.token';
      (jwt.sign as any).mockReturnValue(expectedToken);

      // Act
      const result = jwtSign(payload);

      // Assert
      expect(jwt.sign).toHaveBeenCalledWith(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: Number(process.env.JWT_EXPIRES_IN) }
      );
      expect(result).toBe(expectedToken);
    });

    it('deve usar as configurações de ambiente corretas', () => {
      // Arrange
      const payload = { userId: 'user123' };
      const expectedToken = 'test.token';
      (jwt.sign as any).mockReturnValue(expectedToken);

      // Act
      jwtSign(payload);

      // Assert
      expect(jwt.sign).toHaveBeenCalledWith(
        payload,
        'test-secret-key', // Do setup.ts
        { expiresIn: 3600 } // Do setup.ts
      );
    });
  });

  describe('jwtVerify', () => {
    it('deve verificar e retornar payload válido', () => {
      // Arrange
      const token = 'valid.jwt.token';
      const expectedPayload = { userId: 'user123' };
      (jwt.verify as any).mockReturnValue(expectedPayload);

      // Act
      const result = jwtVerify(token);

      // Assert
      expect(jwt.verify).toHaveBeenCalledWith(token, process.env.JWT_SECRET);
      expect(result).toEqual(expectedPayload);
    });

    it('deve retornar null para token inválido', () => {
      // Arrange
      const token = 'invalid.jwt.token';
      (jwt.verify as any).mockImplementation(() => {
        throw new Error('Invalid token');
      });

      // Act
      const result = jwtVerify(token);

      // Assert
      expect(jwt.verify).toHaveBeenCalledWith(token, process.env.JWT_SECRET);
      expect(result).toBeNull();
    });

    it('deve retornar null para token expirado', () => {
      // Arrange
      const token = 'expired.jwt.token';
      (jwt.verify as any).mockImplementation(() => {
        throw new Error('Token expired');
      });

      // Act
      const result = jwtVerify(token);

      // Assert
      expect(jwt.verify).toHaveBeenCalledWith(token, process.env.JWT_SECRET);
      expect(result).toBeNull();
    });

    it('deve retornar null para token malformado', () => {
      // Arrange
      const token = 'malformed-token';
      (jwt.verify as any).mockImplementation(() => {
        throw new Error('Malformed token');
      });

      // Act
      const result = jwtVerify(token);

      // Assert
      expect(jwt.verify).toHaveBeenCalledWith(token, process.env.JWT_SECRET);
      expect(result).toBeNull();
    });

    it('deve lidar com string vazia', () => {
      // Arrange
      const token = '';
      (jwt.verify as any).mockImplementation(() => {
        throw new Error('Empty token');
      });

      // Act
      const result = jwtVerify(token);

      // Assert
      expect(jwt.verify).toHaveBeenCalledWith(token, process.env.JWT_SECRET);
      expect(result).toBeNull();
    });

    it('deve retornar payload com diferentes tipos de userId', () => {
      // Arrange
      const token = 'valid.jwt.token';
      const expectedPayload = { userId: '999' };
      (jwt.verify as any).mockReturnValue(expectedPayload);

      // Act
      const result = jwtVerify(token);

      // Assert
      expect(result).toEqual(expectedPayload);
    });
  });
});