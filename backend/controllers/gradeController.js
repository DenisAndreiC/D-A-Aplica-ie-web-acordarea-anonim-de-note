// doar un jurat desemnat poata da o nota
// nota intre 1 si 10

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.addGrade = async (req, res) => {
  try {
    const { deliverableId, value } = req.body;
    const evaluatorId = req.user.userId;

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
      return res.status(403).json({ error: 'Nu ai dreptul să notezi acest proiect (nu ești jurat).' });
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

// obtine toate notele
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

// calculeaza media notelor pentru un proiect
exports.getProjectAverage = async (req, res) => {
  try {
    const { projectId } = req.params;

    // luam toate notele livrabilelor acestui proiect
    const grades = await prisma.grade.findMany({
      where: {
        deliverable: {
          projectId: parseInt(projectId)
        }
      }
    });

    if (grades.length === 0) {
      return res.json({ average: 0, count: 0 });
    }

    // algoritm olimpic: eliminam min si max daca avem suficiente note (>= 3)
    // daca avem < 3 note, calculam media simpla
    let processingGrades = grades.map(g => g.value);

    if (processingGrades.length >= 3) {
      const min = Math.min(...processingGrades);
      const max = Math.max(...processingGrades);

      // eliminam o singura data minimul si maximul
      let minRemoved = false;
      let maxRemoved = false;

      processingGrades = processingGrades.filter(g => {
        if (!minRemoved && g === min) {
          minRemoved = true;
          return false;
        }
        if (!maxRemoved && g === max) {
          maxRemoved = true;
          return false;
        }
        return true;
      });
    }

    const sum = processingGrades.reduce((acc, val) => acc + val, 0);
    const average = sum / processingGrades.length;

    res.json({ average: parseFloat(average.toFixed(2)), count: grades.length });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Eroare la calculul mediei' });
  }
};