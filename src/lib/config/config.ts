export const config = {
  auth: {
    jwtSecret: process.env.JWT_SECRET || 'test-secret-key',
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '3600',
    bcryptCost: parseInt(process.env.BCRYPT_COST || '1')
  }
}