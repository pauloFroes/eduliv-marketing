import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Mock das variáveis de ambiente para testes
Object.assign(process.env, {
  BCRYPT_COST: '1',
  JWT_SECRET: 'test-secret-key',
  JWT_EXPIRES_IN: '3600',
})

// Mock das dependências do Next.js
vi.mock('next/headers', () => ({
  cookies: vi.fn(),
}))