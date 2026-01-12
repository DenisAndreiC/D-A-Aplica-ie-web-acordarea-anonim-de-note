//validarea ca studentul sa nu fie proprietarul proiectului
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// selecteaza un student ca jurat pentru un proiect
exports.assignJury = async (req, res) => {
  try {
    const { userId, projectId } = req.body;

    // verificam proiectul pentru a vedea cine e proprietarul
    const project = await prisma.project.findUnique({
      where: { id: parseInt(projectId) }
    });

    if (!project) {
      return res.status(404).json({ error: 'Proiectul nu există' });
    }

    // proprietarul nu poate fi jurat la propriul proiect
    if (project.ownerId === parseInt(userId)) {
      return res.status(400).json({ error: 'Conflict de interese: Proprietarul nu poate fi jurat.' });
    }

    // check daca e deja jurat
    const existingAssignment = await prisma.juryAssignment.findFirst({
      where: {
        userId: parseInt(userId),
        projectId: parseInt(projectId)
      }
    });

    if (existingAssignment) {
      return res.status(400).json({ error: 'Utilizatorul este deja jurat la acest proiect.' });
    }

    // cream asignarea
    const assignment = await prisma.juryAssignment.create({
      data: {
        userId: parseInt(userId),
        projectId: parseInt(projectId)
      }
    });

    res.status(201).json(assignment);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Eroare la asignarea juriului' });
  }
};

// vezi juriul unui proiect
exports.getProjectJury = async (req, res) => {
  try {
    const { projectId } = req.params;
    const jury = await prisma.juryAssignment.findMany({
      where: { projectId: parseInt(projectId) },
      include: { user: true } // vedem numele juratilor
    });
    res.json(jury);
  } catch (error) {
    res.status(500).json({ error: 'Eroare server' });
  }
};

// Vezi proiectele unde eu sunt jurat
exports.getJuryProjects = async (req, res) => {
  try {
    const userId = req.user.userId;
    const assignments = await prisma.juryAssignment.findMany({
      where: { userId: parseInt(userId) },
      include: { project: true }
    });
    // Returnam direct proiectele
    const projects = assignments.map(a => a.project);
    res.json(projects);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Eroare la preluarea proiectelor de notat' });
  }
};