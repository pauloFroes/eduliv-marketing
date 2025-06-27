import bcrypt from 'bcrypt'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { cryptApply, verifyCrypt } from './crypt.helper'

// Mock do bcrypt
vi.mock('bcrypt', () => ({
  default: {
    hash: vi.fn(),
    compare: vi.fn(),
  },
}))

// Mock da configuração
vi.mock('@/config/app', () => ({
  appConfig: {
    auth: {
      bcryptCost: 12,
    },
  },
}))

describe('Crypt Helpers', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('cryptApply', () => {
    describe('quando receber senha válida', () => {
      it('deve criptografar a senha quando receber senha simples', async () => {
        // Arrange
        const mockPassword = 'senha123456'
        const expectedHash = '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/HS.iK2'
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ;(bcrypt.hash as any).mockResolvedValue(expectedHash)

        // Act
        const result = await cryptApply(mockPassword)

        // Assert
        expect(result).toBe(expectedHash)
        expect(bcrypt.hash).toHaveBeenCalledTimes(1)
        expect(bcrypt.hash).toHaveBeenCalledWith(mockPassword, 12)
      })

      it('deve criptografar a senha quando receber senha com caracteres especiais', async () => {
        // Arrange
        const mockPassword = 'senha@#$%^&*()_+-=[]{}|;:,.<>?'
        const expectedHash = '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/HS.iK2'
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ;(bcrypt.hash as any).mockResolvedValue(expectedHash)

        // Act
        const result = await cryptApply(mockPassword)

        // Assert
        expect(result).toBe(expectedHash)
        expect(bcrypt.hash).toHaveBeenCalledTimes(1)
        expect(bcrypt.hash).toHaveBeenCalledWith(mockPassword, 12)
      })

      it('deve criptografar a senha quando receber senha com espaços', async () => {
        // Arrange
        const mockPassword = 'senha com espaços'
        const expectedHash = '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/HS.iK2'
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ;(bcrypt.hash as any).mockResolvedValue(expectedHash)

        // Act
        const result = await cryptApply(mockPassword)

        // Assert
        expect(result).toBe(expectedHash)
        expect(bcrypt.hash).toHaveBeenCalledTimes(1)
        expect(bcrypt.hash).toHaveBeenCalledWith(mockPassword, 12)
      })

      it('deve criptografar a senha quando receber senha muito longa', async () => {
        // Arrange
        const mockPassword = 'a'.repeat(1000)
        const expectedHash = '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/HS.iK2'
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ;(bcrypt.hash as any).mockResolvedValue(expectedHash)

        // Act
        const result = await cryptApply(mockPassword)

        // Assert
        expect(result).toBe(expectedHash)
        expect(bcrypt.hash).toHaveBeenCalledTimes(1)
        expect(bcrypt.hash).toHaveBeenCalledWith(mockPassword, 12)
      })
    })

    describe('quando receber entrada inválida', () => {
      it('deve criptografar a senha quando receber senha vazia', async () => {
        // Arrange
        const mockPassword = ''
        const expectedHash = '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/HS.iK2'
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ;(bcrypt.hash as any).mockResolvedValue(expectedHash)

        // Act
        const result = await cryptApply(mockPassword)

        // Assert
        expect(result).toBe(expectedHash)
        expect(bcrypt.hash).toHaveBeenCalledTimes(1)
        expect(bcrypt.hash).toHaveBeenCalledWith(mockPassword, 12)
      })
    })

    describe('quando ocorrer erro na criptografia', () => {
      it('deve propagar erro quando bcrypt.hash falhar', async () => {
        // Arrange
        const mockPassword = 'senha123456'
        const mockError = new Error('Erro de criptografia')
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ;(bcrypt.hash as any).mockRejectedValue(mockError)

        // Act & Assert
        await expect(cryptApply(mockPassword)).rejects.toThrow('Erro de criptografia')
        expect(bcrypt.hash).toHaveBeenCalledTimes(1)
        expect(bcrypt.hash).toHaveBeenCalledWith(mockPassword, 12)
      })
    })

    describe('configuração do bcrypt', () => {
      it('deve usar o cost correto da configuração quando criptografar senha', async () => {
        // Arrange
        const mockPassword = 'senha123456'
        const expectedHash = '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/HS.iK2'
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ;(bcrypt.hash as any).mockResolvedValue(expectedHash)

        // Act
        await cryptApply(mockPassword)

        // Assert
        expect(bcrypt.hash).toHaveBeenCalledWith(mockPassword, 12)
      })
    })
  })

  describe('verifyCrypt', () => {
    describe('quando a senha é válida', () => {
      it('deve retornar true quando receber senha correta e hash válido', async () => {
        // Arrange
        const mockPassword = 'senha123456'
        const mockHash = '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/HS.iK2'
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ;(bcrypt.compare as any).mockResolvedValue(true)

        // Act
        const result = await verifyCrypt(mockPassword, mockHash)

        // Assert
        expect(result).toBe(true)
        expect(bcrypt.compare).toHaveBeenCalledTimes(1)
        expect(bcrypt.compare).toHaveBeenCalledWith(mockPassword, mockHash)
      })

      it('deve retornar true quando receber senha com caracteres especiais e hash válido', async () => {
        // Arrange
        const mockPassword = 'senha@#$%^&*()_+-=[]{}|;:,.<>?'
        const mockHash = '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/HS.iK2'
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ;(bcrypt.compare as any).mockResolvedValue(true)

        // Act
        const result = await verifyCrypt(mockPassword, mockHash)

        // Assert
        expect(result).toBe(true)
        expect(bcrypt.compare).toHaveBeenCalledTimes(1)
        expect(bcrypt.compare).toHaveBeenCalledWith(mockPassword, mockHash)
      })

      it('deve retornar true quando receber senha com espaços e hash válido', async () => {
        // Arrange
        const mockPassword = 'senha com espaços'
        const mockHash = '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/HS.iK2'
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ;(bcrypt.compare as any).mockResolvedValue(true)

        // Act
        const result = await verifyCrypt(mockPassword, mockHash)

        // Assert
        expect(result).toBe(true)
        expect(bcrypt.compare).toHaveBeenCalledTimes(1)
        expect(bcrypt.compare).toHaveBeenCalledWith(mockPassword, mockHash)
      })
    })

    describe('quando a senha é inválida', () => {
      it('deve retornar false quando receber senha incorreta e hash válido', async () => {
        // Arrange
        const mockPassword = 'senhaerrada'
        const mockHash = '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/HS.iK2'
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ;(bcrypt.compare as any).mockResolvedValue(false)

        // Act
        const result = await verifyCrypt(mockPassword, mockHash)

        // Assert
        expect(result).toBe(false)
        expect(bcrypt.compare).toHaveBeenCalledTimes(1)
        expect(bcrypt.compare).toHaveBeenCalledWith(mockPassword, mockHash)
      })

      it('deve retornar false quando receber senha vazia e hash válido', async () => {
        // Arrange
        const mockPassword = ''
        const mockHash = '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/HS.iK2'
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ;(bcrypt.compare as any).mockResolvedValue(false)

        // Act
        const result = await verifyCrypt(mockPassword, mockHash)

        // Assert
        expect(result).toBe(false)
        expect(bcrypt.compare).toHaveBeenCalledTimes(1)
        expect(bcrypt.compare).toHaveBeenCalledWith(mockPassword, mockHash)
      })

      it('deve retornar false quando receber senha muito longa e hash válido', async () => {
        // Arrange
        const mockPassword = 'a'.repeat(1000)
        const mockHash = '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/HS.iK2'
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ;(bcrypt.compare as any).mockResolvedValue(false)

        // Act
        const result = await verifyCrypt(mockPassword, mockHash)

        // Assert
        expect(result).toBe(false)
        expect(bcrypt.compare).toHaveBeenCalledTimes(1)
        expect(bcrypt.compare).toHaveBeenCalledWith(mockPassword, mockHash)
      })
    })

    describe('quando o hash é inválido', () => {
      it('deve retornar false quando receber senha válida e hash vazio', async () => {
        // Arrange
        const mockPassword = 'senha123456'
        const mockHash = ''
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ;(bcrypt.compare as any).mockResolvedValue(false)

        // Act
        const result = await verifyCrypt(mockPassword, mockHash)

        // Assert
        expect(result).toBe(false)
        expect(bcrypt.compare).toHaveBeenCalledTimes(1)
        expect(bcrypt.compare).toHaveBeenCalledWith(mockPassword, mockHash)
      })

      it('deve retornar false quando receber senha válida e hash inválido', async () => {
        // Arrange
        const mockPassword = 'senha123456'
        const mockHash = 'hash-invalido'
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ;(bcrypt.compare as any).mockResolvedValue(false)

        // Act
        const result = await verifyCrypt(mockPassword, mockHash)

        // Assert
        expect(result).toBe(false)
        expect(bcrypt.compare).toHaveBeenCalledTimes(1)
        expect(bcrypt.compare).toHaveBeenCalledWith(mockPassword, mockHash)
      })
    })

    describe('quando ocorrer erro na verificação', () => {
      it('deve propagar erro quando bcrypt.compare falhar', async () => {
        // Arrange
        const mockPassword = 'senha123456'
        const mockHash = '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/HS.iK2'
        const mockError = new Error('Erro de verificação')
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ;(bcrypt.compare as any).mockRejectedValue(mockError)

        // Act & Assert
        await expect(verifyCrypt(mockPassword, mockHash)).rejects.toThrow('Erro de verificação')
        expect(bcrypt.compare).toHaveBeenCalledTimes(1)
        expect(bcrypt.compare).toHaveBeenCalledWith(mockPassword, mockHash)
      })
    })

    describe('integração entre cryptApply e verifyCrypt', () => {
      it('deve verificar senha correta com hash gerado pelo cryptApply', async () => {
        // Arrange
        const originalPassword = 'minhasenha123'
        const generatedHash = '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/HS.iK2'
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ;(bcrypt.compare as any).mockResolvedValue(true)

        // Act
        const result = await verifyCrypt(originalPassword, generatedHash)

        // Assert
        expect(result).toBe(true)
        expect(bcrypt.compare).toHaveBeenCalledTimes(1)
        expect(bcrypt.compare).toHaveBeenCalledWith(originalPassword, generatedHash)
      })

      it('deve rejeitar senha incorreta com hash gerado pelo cryptApply', async () => {
        // Arrange
        const wrongPassword = 'senhaerrada'
        const validHash = '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/HS.iK2'
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ;(bcrypt.compare as any).mockResolvedValue(false)

        // Act
        const result = await verifyCrypt(wrongPassword, validHash)

        // Assert
        expect(result).toBe(false)
        expect(bcrypt.compare).toHaveBeenCalledTimes(1)
        expect(bcrypt.compare).toHaveBeenCalledWith(wrongPassword, validHash)
      })
    })
  })
})
