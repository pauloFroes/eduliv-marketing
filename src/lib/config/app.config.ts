import { AppConfig } from './config.types'

export const appConfig: AppConfig = {
  auth: {
    tokenCookieName: process.env.TOKEN_COOKIE_NAME || '_edu_token',
    jwtSecret: process.env.JWT_SECRET || '',
    jwtExpiresIn: Number(process.env.JWT_EXPIRES_IN) || 24,
    bcryptCost: Number(process.env.BCRYPT_COST) || 12,
  },
  database: { url: process.env.DATABASE_URL },
} as const

// Validações de configuração obrigatória
if (!appConfig.auth.jwtSecret) throw new Error('JWT_SECRET is not set')
if (!appConfig.auth.jwtExpiresIn) throw new Error('JWT_EXPIRES_IN is not set')
if (!appConfig.auth.bcryptCost) throw new Error('BCRYPT_COST is not set')
