import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Mock das variáveis de ambiente para testes
Object.assign(process.env, {
  BCRYPT_COST: '1',
  JWT_SECRET: 'test-secret-key',
  JWT_EXPIRES_IN: '3600',
  TOKEN_COOKIE_NAME: 'token',
})

// Mock das dependências do Next.js
vi.mock('next/headers', () => ({
  cookies: vi.fn(),
}))

// Mock do next/navigation
vi.mock('next/navigation', () => ({
  useRouter: vi.fn(() => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
  })),
}))

// Mock da configuração centralizada para testes
vi.mock('@/lib/config', () => ({
  config: {
    auth: {
      tokenCookieName: 'token',
      jwtSecret: 'test-secret-key',
      jwtExpiresIn: 3600,
      bcryptCost: 1,
    },
    database: {
      url: 'test-database-url',
    },
  },
}))
