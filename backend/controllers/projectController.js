const { PrismaClient } = require('@prisma/client');
const axios = require('axios');
const prisma = new PrismaClient();

// creare proiect cu verificare github
exports.createProject = async (req, res) => {
  try {
    const { title, description, githubRepo } = req.body;
    // preluare id proprietar din token
    const ownerId = req.user.userId;

    // daca utilizatorul trimite un repo, verificam daca exista
    let externalData = null;
    if (githubRepo) {
      try {
        const response = await axios.get(`https://api.github.com/repos/${githubRepo}`);
        externalData = {
          stars: response.data.stargazers_count,
          language: response.data.language
        };
      } catch (err) {
        // repo nu a fost gasit
      }
    }

    // salvare in baza de date
    const newProject = await prisma.project.create({
      data: {
        title,
        description: externalData
          ? `${description} | GitHub Stars: ${externalData.stars} (${externalData.language})`
          : description,
        ownerId: parseInt(ownerId)
      }
    });

    res.status(201).json(newProject);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Eroare la crearea proiectului' });
  }
};

// vizualizare toate proiectele (admin/profesor)
exports.getAllProjects = async (req, res) => {
  try {
    const projects = await prisma.project.findMany({
      include: { owner: true }
    });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: 'Eroare server' });
  }
};

// proiectele mele (student)
exports.getMyProjects = async (req, res) => {
  try {
    const userId = req.user.userId;
    const projects = await prisma.project.findMany({
      where: { ownerId: parseInt(userId) },
      include: {
        deliverables: true,  // ce am incarcat
        jury: true           // cine ma noteaza
      }
    });
    res.json(projects);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Eroare la preluarea proiectelor' });
  }
};

// 4. Detalii proiect (pentru owner check)
exports.getProjectById = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await prisma.project.findUnique({
      where: { id: parseInt(id) },
      include: { owner: true }
    });
    if (!project) return res.status(404).json({ error: 'Proiect inexistent' });
    res.json(project);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Eroare server' });
  }
};