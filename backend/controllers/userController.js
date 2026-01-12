const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Secretul pentru JWT (ar trebui sa fie in .env)
const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_key_student';

// 1. Inregistrare utilizator nou
exports.register = async (req, res) => {
  try {
    const { fullName, email, password, secretCode } = req.body;
    console.log("REGISTER REQUEST BODY:", req.body); // DEBUG
    console.log("Secret Code extracted:", secretCode); // DEBUG

    // basic validation
    if (!fullName || !email || !password) {
      return res.status(400).json({ error: 'Toate câmpurile sunt obligatorii' });
    }

    // check existing user
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // hash pass
    const hashedPassword = await bcrypt.hash(password, 10);

    // Determine role based on secret code
    let role = 'STUDENT';
    if (secretCode && secretCode.trim().toLowerCase() === 'profesor') {
      role = 'PROFESSOR';
    }
    console.log("Calculated Role:", role); // DEBUG

    // create user
    const newUser = await prisma.user.create({
      data: {
        fullName,
        email,
        password: hashedPassword,
        role: role
      }
    });
    console.log("Created User Role:", newUser.role); // DEBUG

    // Nu trimitem parola inapoi
    const { password: _, ...userWithoutPassword } = newUser;
    res.status(201).json(userWithoutPassword);

  } catch (error) {
    console.error('Register Error:', error);
    res.status(500).json({ error: 'Eroare la inregistrare.' });
  }
};

// 2. Autentificare (Login)
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Cautam userul
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Email sau parola incorecta.' });
    }

    // Verificam parola
    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(401).json({ error: 'Email sau parola incorecta.' });
    }

    // Generam token
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Autentificare reusita!',
      token,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role
      }
    });

  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ error: 'Eroare la autentificare.' });
  }
};

// 3. Obtine toti utilizatorii (pentru Profesor/Debug)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        projects: true
      }
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Eroare la preluarea utilizatorilor' });
  }
};