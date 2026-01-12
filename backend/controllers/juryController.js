// validarea ca studentul sa nu fie proprietarul proiectului
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

// vezi proiectele unde eu sunt jurat
exports.getJuryProjects = async (req, res) => {
  try {
    const userId = req.user.userId;
    const assignments = await prisma.juryAssignment.findMany({
      where: { userId: parseInt(userId) },
      include: { project: true }
    });
    // returnam direct proiectele
    const projects = assignments.map(a => a.project);
    res.json(projects);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Eroare la preluarea proiectelor de notat' });
  }
};

// alocare automata juriu (3 studenti random)
exports.autoAssignJury = async (req, res) => {
  try {
    const { projectId } = req.body;
    const project = await prisma.project.findUnique({ where: { id: parseInt(projectId) } });

    if (!project) return res.status(404).json({ error: 'Proiectul nu exista' });

    // luam toti studentii, exclusiv ownerul
    const candidates = await prisma.user.findMany({
      where: {
        role: 'STUDENT',
        NOT: { id: project.ownerId }
      }
    });

    if (candidates.length < 3) {
      return res.status(400).json({ error: 'Nu sunt destui studenti pentru a forma un juriu (minim 3).' });
    }

    // algoritm simplu de randomizare (fisher-yates shuffle ar fi ideal, dar simplificam)
    const shuffled = candidates.sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 3);

    // cream asignarile
    const assignments = await Promise.all(
      selected.map(user =>
        prisma.juryAssignment.create({
          data: {
            userId: user.id,
            projectId: parseInt(projectId)
          }
        }).catch(() => null) // ignoram daca e deja asignat
      )
    );

    res.json({ message: 'Juriu alocat cu succes!', jurors: selected.map(u => u.email) });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Eroare la alocarea juriului.' });
  }
};