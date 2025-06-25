import jwt from 'jsonwebtoken'

type JwtPayload = {
  userId: string
}

const JWT_SECRET = process.env.JWT_SECRET
if (!JWT_SECRET) throw new Error('JWT_SECRET is not set')

const JWT_EXPIRES_IN = Number(process.env.JWT_EXPIRES_IN)
if (!JWT_EXPIRES_IN) throw new Error('JWT_EXPIRES_IN is not set')

export const jwtSign = (payload: JwtPayload): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })
}

export const jwtVerify = (token: string): JwtPayload | null => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload
    return decoded
  } catch {
    return null
  }
}
