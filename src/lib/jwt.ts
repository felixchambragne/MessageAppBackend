import jwt from 'jsonwebtoken'

export function generateJWT(userId: String) {
  const payload = {
    userId: userId,
  }
  const token = jwt.sign(payload, process.env.JWT_SECRET as string, {
    expiresIn: '1y',
  })
  return token
}
