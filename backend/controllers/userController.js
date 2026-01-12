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

    // Validari de baza
    if (!fullName || !email || !password) {
      return res.status(400).json({ error: 'Toate câmpurile (Nume, Email, Parolă) sunt obligatorii.' });
    }

    if (password.length < 6) {
        return res.status(400).json({ error: 'Parola trebuie să aibă cel puțin 6 caractere.' });
    }

    // Verificam daca userul exista deja
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Există deja un cont cu acest email.' });
    }

    // Hash parola
    const hashedPassword = await bcrypt.hash(password, 10);

    // Determinam rolul pe baza codului secret
    let role = 'STUDENT';
    if (secretCode && secretCode.trim().toLowerCase() === 'profesor') {
      role = 'PROFESSOR';
    }

    // Creare user
    const newUser = await prisma.user.create({
      data: {
        fullName,
        email,
        password: hashedPassword,
        role: role
      }
    });

    // Nu trimitem parola inapoi
    const { password: _, ...userWithoutPassword } = newUser;
    res.status(201).json(userWithoutPassword);

  } catch (error) {
    console.error('Eroare la inregistrare:', error);
    res.status(500).json({ error: 'A apărut o eroare la înregistrare. Încearcă din nou.' });
  }
};

// 2. Autentificare (Login)
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email-ul și parola sunt obligatorii.' });
    }

    // Cautam userul
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Email sau parolă incorectă.' });
    }

    // Verificam parola
    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(401).json({ error: 'Email sau parolă incorectă.' });
    }

    // Generam token
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Autentificare reușită!',
      token,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role
      }
    });

  } catch (error) {
    console.error('Eroare la login:', error);
    res.status(500).json({ error: 'A apărut o eroare la autentificare.' });
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
        // Nu includem proiectele momentan pentru a nu incarca raspunsul
      }
    });
    res.json(users);
  } catch (error) {
    console.error('Eroare la preluarea utilizatorilor:', error);
    res.status(500).json({ error: 'Eroare la preluarea listei de utilizatori.' });
  }
};