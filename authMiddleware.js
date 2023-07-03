const jwt = require('jsonwebtoken');

function authMiddleware(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];  // get the token part of the header

  console.log('Token received in server:', token);
  
  if (!token) {
    return res.status(401).json({ error: 'Access denied. Token not provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
    console.log('Decoded token:', decoded);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token.' });
  }
}

module.exports = authMiddleware;
