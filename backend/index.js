const express = require('express');
const cors = require('cors');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Import Rute
const userRoutes = require('./routes/userRoutes');


// Utilizare Rute
app.use('/api/users', userRoutes);

// Ruta de baza (pentru test rapid)
app.get('/', (req, res) => {
  res.send('Api-ul merge');
});

// Pornire Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serverul e pe portul ${PORT}`);
});