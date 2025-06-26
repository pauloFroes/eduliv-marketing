import { describe, it, expect, vi, beforeEach } from 'vitest';
import bcrypt from 'bcrypt';
import { pwdCrypt, pwdVerify } from './pwd';

// Mock do bcrypt
vi.mock('bcrypt', () => ({
  default: {
    hash: vi.fn(),
    compare: vi.fn(),
  },
}));

describe('pwd.ts', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('pwdCrypt', () => {
    it('deve criptografar uma senha usando bcrypt', async () => {
      // Arrange
      const password = 'mySecretPassword';
      const expectedHash = '$2b$01$hashedPassword';
      (bcrypt.hash as any).mockResolvedValue(expectedHash);

      // Act
      const result = await pwdCrypt(password);

      // Assert
      expect(bcrypt.hash).toHaveBeenCalledWith(password, Number(process.env.BCRYPT_COST));
      expect(result).toBe(expectedHash);
    });

    it('deve usar o custo correto definido nas variáveis de ambiente', async () => {
      // Arrange
      const password = 'testPassword';
      const expectedHash = '$2b$01$anotherHash';
      (bcrypt.hash as any).mockResolvedValue(expectedHash);

      // Act
      await pwdCrypt(password);

      // Assert
      expect(bcrypt.hash).toHaveBeenCalledWith(password, 1); // Do setup.ts
    });

    it('deve lidar com senhas vazias', async () => {
      // Arrange
      const password = '';
      const expectedHash = '$2b$01$emptyPasswordHash';
      (bcrypt.hash as any).mockResolvedValue(expectedHash);

      // Act
      const result = await pwdCrypt(password);

      // Assert
      expect(bcrypt.hash).toHaveBeenCalledWith(password, 1);
      expect(result).toBe(expectedHash);
    });

    it('deve lidar com senhas longas', async () => {
      // Arrange
      const password = 'a'.repeat(200);
      const expectedHash = '$2b$01$longPasswordHash';
      (bcrypt.hash as any).mockResolvedValue(expectedHash);

      // Act
      const result = await pwdCrypt(password);

      // Assert
      expect(bcrypt.hash).toHaveBeenCalledWith(password, 1);
      expect(result).toBe(expectedHash);
    });

    it('deve lidar com senhas com caracteres especiais', async () => {
      // Arrange
      const password = '!@#$%^&*()_+-=[]{}|;:,.<>?';
      const expectedHash = '$2b$01$specialCharsHash';
      (bcrypt.hash as any).mockResolvedValue(expectedHash);

      // Act
      const result = await pwdCrypt(password);

      // Assert
      expect(bcrypt.hash).toHaveBeenCalledWith(password, 1);
      expect(result).toBe(expectedHash);
    });
  });

  describe('pwdVerify', () => {
    it('deve retornar true para senha correta', async () => {
      // Arrange
      const password = 'mySecretPassword';
      const hash = '$2b$01$hashedPassword';
      (bcrypt.compare as any).mockResolvedValue(true);

      // Act
      const result = await pwdVerify(password, hash);

      // Assert
      expect(bcrypt.compare).toHaveBeenCalledWith(password, hash);
      expect(result).toBe(true);
    });

    it('deve retornar false para senha incorreta', async () => {
      // Arrange
      const password = 'wrongPassword';
      const hash = '$2b$01$hashedPassword';
      (bcrypt.compare as any).mockResolvedValue(false);

      // Act
      const result = await pwdVerify(password, hash);

      // Assert
      expect(bcrypt.compare).toHaveBeenCalledWith(password, hash);
      expect(result).toBe(false);
    });

    it('deve lidar com senha vazia', async () => {
      // Arrange
      const password = '';
      const hash = '$2b$01$hashedPassword';
      (bcrypt.compare as any).mockResolvedValue(false);

      // Act
      const result = await pwdVerify(password, hash);

      // Assert
      expect(bcrypt.compare).toHaveBeenCalledWith(password, hash);
      expect(result).toBe(false);
    });

    it('deve lidar com hash vazio', async () => {
      // Arrange
      const password = 'myPassword';
      const hash = '';
      (bcrypt.compare as any).mockResolvedValue(false);

      // Act
      const result = await pwdVerify(password, hash);

      // Assert
      expect(bcrypt.compare).toHaveBeenCalledWith(password, hash);
      expect(result).toBe(false);
    });

    it('deve lidar com hash inválido', async () => {
      // Arrange
      const password = 'myPassword';
      const hash = 'invalidHash';
      (bcrypt.compare as any).mockResolvedValue(false);

      // Act
      const result = await pwdVerify(password, hash);

      // Assert
      expect(bcrypt.compare).toHaveBeenCalledWith(password, hash);
      expect(result).toBe(false);
    });

    it('deve verificar senhas com caracteres especiais', async () => {
      // Arrange
      const password = '!@#$%^&*()_+-=[]{}|;:,.<>?';
      const hash = '$2b$01$specialCharsHash';
      (bcrypt.compare as any).mockResolvedValue(true);

      // Act
      const result = await pwdVerify(password, hash);

      // Assert
      expect(bcrypt.compare).toHaveBeenCalledWith(password, hash);
      expect(result).toBe(true);
    });

    it('deve verificar senhas longas', async () => {
      // Arrange
      const password = 'a'.repeat(200);
      const hash = '$2b$01$longPasswordHash';
      (bcrypt.compare as any).mockResolvedValue(true);

      // Act
      const result = await pwdVerify(password, hash);

      // Assert
      expect(bcrypt.compare).toHaveBeenCalledWith(password, hash);
      expect(result).toBe(true);
    });
  });
});