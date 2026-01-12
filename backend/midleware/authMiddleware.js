const jwt = require('jsonwebtoken');

// secretul trebuie sa fie acelasi cu cel din userController
const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_key_student';

const authenticateToken = (req, res, next) => {
    // luam header-ul de autorizare (ex: "Bearer <token>")
    const authHeader = req.headers['authorization'];

    // extragem token-ul
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Acces interzis. Token lipsa.' });
    }

    // verificam token-ul
    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Token invalid sau expirat.' });
        }

        //daca e ok, atasam user-ul la request pentru a fi folosit in controllere
        req.user = user;
        next();
    });
};

module.exports = authenticateToken;
