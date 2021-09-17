const jwt = require('jsonwebtoken')

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.token

  if (authHeader) {
    const token = authHeader.split(' ')[1]
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
      if (err) res.status(403).json('You are not authenticated')
      req.user = user
      next()
    })
  } else {
    return res.status(401).json('You are not authenticated')
  }
}

const verifyTokenAuth = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.id === req.params.id || req.user.isAdmin) {

    } else {
      res.status(500).json('You are not allowed')
    }
  })
}

const verifyTokenAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.isAdmin) {

    } else {
      res.status(500).json('You are not allowed')
    }
  })
}

module.exports = { verifyToken, verifyTokenAuth, verifyTokenAdmin }
