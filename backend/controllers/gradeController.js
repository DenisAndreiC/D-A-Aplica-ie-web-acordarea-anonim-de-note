//doar un jurat desemnat poata da o nota
//nota intre 1 si 10

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.addGrade = async (req, res) => {
  try {
    const { evaluatorId, deliverableId, value } = req.body;

    // validare nota in 1 si 10
    if (value < 1 || value > 10) {
      return res.status(400).json({ error: 'Nota trebuie să fie între 1.00 și 10.00' });
    }

    // gasim livrabilul si proiectul asociat
    const deliverable = await prisma.deliverable.findUnique({
      where: { id: parseInt(deliverableId) }
    });

    if (!deliverable) {
      return res.status(404).json({ error: 'Livrabilul nu există' });
    }

    // verificare ca cel care da nota sa fie jurat pentru proiectul acesta
    const isJury = await prisma.juryAssignment.findFirst({
      where: {
        userId: parseInt(evaluatorId),
        projectId: deliverable.projectId
      }
    });

    if (!isJury) {
      return res.status(403).json({ error: 'Nu ai dreptul sa notezi acest proiect (nu eeti jurat).' });
    }

    // daca totul e ok salvam nota
    const newGrade = await prisma.grade.create({
      data: {
        value: parseFloat(value),
        deliverableId: parseInt(deliverableId),
        evaluatorId: parseInt(evaluatorId)
      }
    });

    res.status(201).json(newGrade);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Eroare la acordarea notei' });
  }
};

// Obtine toate notele
exports.getDeliverableGrades = async (req, res) => {
  try {
    const { deliverableId } = req.params;
    const grades = await prisma.grade.findMany({
      where: { deliverableId: parseInt(deliverableId) }
    });
    res.json(grades);
  } catch (error) {
    res.status(500).json({ error: 'Eroare server' });
  }
};