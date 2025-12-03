const { PrismaClient } = require('@prisma/client');
const axios = require('axios'); 
const prisma = new PrismaClient();

// 1. Creem un proiect (cu verificare github )
exports.createProject = async (req, res) => {
  try {
    const { title, description, ownerId, githubRepo } = req.body;

    // Daca utilizatorul trimite un repo, verificam daca exista
    let externalData = null;
    if (githubRepo) {
      try {
        const response = await axios.get(`https://api.github.com/repos/${githubRepo}`);
        externalData = {
            stars: response.data.stargazers_count,
            language: response.data.language
        };
        console.log("Date de pe GitHub:", externalData);
      } catch (err) {
        console.log("Repo-ul GitHub nu a fost gasit sau eroare API");
      }
    }
    //
    //
    // Salvam în baza noastra (inclusiv descrierea poate contine info de la GitHub)
    const newProject = await prisma.project.create({
      data: {
        title,
        description: externalData 
          ? `${description} | GitHub Stars: ${externalData.stars} (${externalData.language})` 
          : description,
        ownerId: parseInt(ownerId) //trebuie sa fie numar
      }
    });

    res.status(201).json(newProject);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Eroare la crearea proiectului' });
  }
};

// 2. pt a vedea toate proiectele
exports.getAllProjects = async (req, res) => {
  try {
    const projects = await prisma.project.findMany({
      include: { owner: true }//pt adus detaliile stud care a facut proiectul
    });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: 'Eroare server' });
  }
};