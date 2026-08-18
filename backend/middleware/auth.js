import jwt from 'jsonwebtoken'

export const verifyAdmin = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]

    if (!token) {
      return res.status(401).json({ error: 'No token provided. Admin authentication required.' })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.admin = decoded
    next()
  } catch (error) {
    console.error('JWT verification error:', error.message)
    return res.status(401).json({
      error: 'Invalid or expired token',
      details: error.message
    })
  }
}

export const generateToken = (adminId, username) => {
  return jwt.sign(
    {
      id: adminId,
      username: username,
      iat: Date.now()
    },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  )
}

export default verifyAdmin
