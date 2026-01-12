const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// adauga un livrabil nou
exports.createDeliverable = async (req, res) => {
  try {
    const { projectId, resourceUrl, description } = req.body;
    const userId = req.user.userId;

    // validare input
    if (!projectId || isNaN(parseInt(projectId))) {
      return res.status(400).json({ error: 'ID-ul proiectului este invalid.' });
    }
    if (!resourceUrl) {
      return res.status(400).json({ error: 'Link-ul resursei este obligatoriu.' });
    }

    // verificare existenta proiect si drepturi (doar proprietarul poate adauga)
    const project = await prisma.project.findUnique({
      where: { id: parseInt(projectId) }
    });

    if (!project) {
      return res.status(404).json({ error: 'Proiectul nu a fost găsit.' });
    }

    if (project.ownerId !== userId) {
      return res.status(403).json({ error: 'Nu ai permisiunea să adaugi livrabile la acest proiect.' });
    }

    const newDeliverable = await prisma.deliverable.create({
      data: {
        projectId: parseInt(projectId),
        resourceUrl,
        description
      }
    });

    res.status(201).json(newDeliverable);
  } catch (error) {
    console.error("Create Deliverable Error:", error);
    // returnam mesajul de eroare real in development pentru debugging
    res.status(500).json({ error: `Eroare server: ${error.message}` });
  }
};

// vizualizare livrabile proiect
exports.getProjectDeliverables = async (req, res) => {
  try {
    const { projectId } = req.params;

    const deliverables = await prisma.deliverable.findMany({
      where: { projectId: parseInt(projectId) }
    });

    res.json(deliverables);
  } catch (error) {
    res.status(500).json({ error: 'Eroare la preluarea livrabilelor' });
  }
};