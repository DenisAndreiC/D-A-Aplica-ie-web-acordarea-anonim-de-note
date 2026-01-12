const jwt = require('jsonwebtoken');

// Secretul trebuie sa fie acelasi cu cel din userController
const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_key_student';

const authenticateToken = (req, res, next) => {
    // 1. Luam header-ul de autorizare (ex: "Bearer <token>")
    const authHeader = req.headers['authorization'];

    // 2. Extragem token-ul
    // 3. Verificam token-ul
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Acces interzis. Token lipsa.' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Token invalid sau expirat.' });
        }

        // 4. Daca e ok, atasam user-ul la request pentru a fi folosit in controllere
        req.user = user;
        next();
    });
};

module.exports = authenticateToken;
