import { describe, it, expect, vi, beforeEach } from 'vitest';
import { cookieSet, cookieDelete, cookieGet } from './cookie';

// Mock do next/headers
const mockCookieStore = {
  set: vi.fn(),
  delete: vi.fn(),
  get: vi.fn(),
};

vi.mock('next/headers', () => ({
  cookies: vi.fn(() => Promise.resolve(mockCookieStore)),
}));

describe('cookie.ts', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('cookieSet', () => {
    it('deve definir um cookie com configurações corretas em produção', async () => {
      // Arrange
      const originalNodeEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';
      const name = 'testCookie';
      const value = 'testValue';

      // Act
      await cookieSet(name, value);

      // Assert
      expect(mockCookieStore.set).toHaveBeenCalledWith(name, value, {
        secure: true,
        maxAge: 60 * 60 * 24 * 30,
        path: '/',
        httpOnly: true,
      });

      // Cleanup
      process.env.NODE_ENV = originalNodeEnv;
    });

    it('deve definir um cookie com secure false em desenvolvimento', async () => {
      // Arrange
      const originalNodeEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';
      const name = 'testCookie';
      const value = 'testValue';

      // Act
      await cookieSet(name, value);

      // Assert
      expect(mockCookieStore.set).toHaveBeenCalledWith(name, value, {
        secure: false,
        maxAge: 60 * 60 * 24 * 30,
        path: '/',
        httpOnly: true,
      });

      // Cleanup
      process.env.NODE_ENV = originalNodeEnv;
    });

    it('deve lidar com strings vazias', async () => {
      // Arrange
      const name = '';
      const value = '';

      // Act
      await cookieSet(name, value);

      // Assert
      expect(mockCookieStore.set).toHaveBeenCalledWith(name, value, expect.any(Object));
    });
  });

  describe('cookieDelete', () => {
    it('deve deletar um cookie pelo nome', async () => {
      // Arrange
      const name = 'testCookie';

      // Act
      await cookieDelete(name);

      // Assert
      expect(mockCookieStore.delete).toHaveBeenCalledWith(name);
    });

    it('deve lidar com nomes de cookie vazios', async () => {
      // Arrange
      const name = '';

      // Act
      await cookieDelete(name);

      // Assert
      expect(mockCookieStore.delete).toHaveBeenCalledWith(name);
    });
  });

  describe('cookieGet', () => {
    it('deve retornar o valor do cookie quando existe', async () => {
      // Arrange
      const name = 'testCookie';
      const expectedValue = 'testValue';
      mockCookieStore.get.mockReturnValue({ value: expectedValue });

      // Act
      const result = await cookieGet(name);

      // Assert
      expect(mockCookieStore.get).toHaveBeenCalledWith(name);
      expect(result).toBe(expectedValue);
    });

    it('deve retornar undefined quando o cookie não existe', async () => {
      // Arrange
      const name = 'nonExistentCookie';
      mockCookieStore.get.mockReturnValue(undefined);

      // Act
      const result = await cookieGet(name);

      // Assert
      expect(mockCookieStore.get).toHaveBeenCalledWith(name);
      expect(result).toBeUndefined();
    });

    it('deve retornar undefined quando o cookie existe mas não tem valor', async () => {
      // Arrange
      const name = 'testCookie';
      mockCookieStore.get.mockReturnValue({});

      // Act
      const result = await cookieGet(name);

      // Assert
      expect(mockCookieStore.get).toHaveBeenCalledWith(name);
      expect(result).toBeUndefined();
    });

    it('deve lidar com nomes de cookie vazios', async () => {
      // Arrange
      const name = '';
      mockCookieStore.get.mockReturnValue(undefined);

      // Act
      const result = await cookieGet(name);

      // Assert
      expect(mockCookieStore.get).toHaveBeenCalledWith(name);
      expect(result).toBeUndefined();
    });
  });
});