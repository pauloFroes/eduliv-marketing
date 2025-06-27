type AuthConfig = {
  tokenCookieName: string
  jwtSecret: string
  jwtExpiresIn: number
  bcryptCost: number
}

type DatabaseConfig = {
  url: string | undefined
}

type AppConfig = {
  auth: AuthConfig
  database: DatabaseConfig
}

export type { AppConfig, AuthConfig, DatabaseConfig }
