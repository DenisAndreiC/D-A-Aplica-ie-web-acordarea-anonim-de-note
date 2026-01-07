const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// adauga un livrabil nou
exports.createDeliverable = async (req, res) => {
  try {
    const { projectId, resourceUrl, description } = req.body;

    // verificare existenta proiect deja
    const project = await prisma.project.findUnique({
      where: { id: parseInt(projectId) }
    });

    if (!project) {
      return res.status(404).json({ error: 'Proiectul nu a fost gasit' });
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
    console.error(error);
    res.status(500).json({ error: 'Eroare la adaugarea livrabilului' });
  }
};

// pentru a vedea livrabilele unui proiect
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