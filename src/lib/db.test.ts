import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PrismaClient } from '../../prisma/generated';

// Mock do PrismaClient
vi.mock('../../prisma/generated', () => ({
  PrismaClient: vi.fn(),
}));

describe('db.ts', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Limpa o globalThis.prisma para cada teste
    (globalThis as any).prisma = undefined;
    // Limpa o cache do módulo
    vi.resetModules();
  });

  it('deve criar uma nova instância do PrismaClient quando não existe uma instância global', async () => {
    // Arrange
    const mockPrismaInstance = {} as PrismaClient;
    (PrismaClient as any).mockImplementation(() => mockPrismaInstance);

    // Act
    const { db } = await import('./db');

    // Assert
    expect(PrismaClient).toHaveBeenCalledTimes(1);
    expect(db).toBe(mockPrismaInstance);
  });

  it('deve reutilizar a instância global do PrismaClient quando ela existe', async () => {
    // Arrange
    const existingPrismaInstance = {} as PrismaClient;
    (globalThis as any).prisma = existingPrismaInstance;

    // Act
    const { db } = await import('./db');

    // Assert
    expect(db).toBe(existingPrismaInstance);
  });

  it('deve definir a instância global quando NODE_ENV não é production', async () => {
    // Arrange
    const originalNodeEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';
    const mockPrismaInstance = {} as PrismaClient;
    (PrismaClient as any).mockImplementation(() => mockPrismaInstance);

    // Act
    const { db } = await import('./db');

    // Assert
    expect((globalThis as any).prisma).toBe(mockPrismaInstance);
    expect(db).toBe(mockPrismaInstance);
    
    // Cleanup
    process.env.NODE_ENV = originalNodeEnv;
  });

  it('não deve definir a instância global quando NODE_ENV é production', async () => {
    // Arrange
    const originalNodeEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';
    const mockPrismaInstance = {} as PrismaClient;
    (PrismaClient as any).mockImplementation(() => mockPrismaInstance);

    // Act
    const { db } = await import('./db');

    // Assert
    expect(db).toBe(mockPrismaInstance);
    
    // Cleanup
    process.env.NODE_ENV = originalNodeEnv;
  });
});