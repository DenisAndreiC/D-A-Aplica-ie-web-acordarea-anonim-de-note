const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// 1. Obtine toți utilizatorii
exports.getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      include: { projects: true } // Vedem si ce proiecte au
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Eroare la preluarea utilizatorilor' });
  }
};

// 2. Creeaza un utilizator nou
exports.createUser = async (req, res) => {
  try {
    const { email, password, fullName, role } = req.body;
    const newUser = await prisma.user.create({
      data: {
        email,
        password, //parola nu e criptata,
        fullName,
        role: role || 'STUDENT'
      }
    });
    res.status(201).json(newUser);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Utilizatorul nu a putut fi creat (probabil email duplicat)' });
  }
};