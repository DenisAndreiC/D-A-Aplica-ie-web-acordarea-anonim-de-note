const jwt = require('jsonwebtoken');

// Acelasi secret ca in userController
const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_key_student';

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  // Tokenul vine de obicei ca "Bearer <token>"
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Acces interzis. Token lipsa.' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Token invalid sau expirat.' });
    }
    // Salvam userul decodat in request (sa il folosim in controllere)
    req.user = user;
    next();
  });
};

module.exports = authenticateToken;