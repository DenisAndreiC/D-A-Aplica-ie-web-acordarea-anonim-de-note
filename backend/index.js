const express = require('express');
const cors = require('cors');
const app = express();

// importuri rute
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const projectRoutes = require('./routes/projectRoutes');
const deliverableRoutes = require('./routes/deliverableRoutes');
const juryRoutes = require('./routes/juryRoutes');
const gradeRoutes = require('./routes/gradeRoutes');

// middleware
app.use(cors());
app.use(express.json());

// rute
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/deliverables', deliverableRoutes);
app.use('/api/jury', juryRoutes);
app.use('/api/grades', gradeRoutes);


// ruta de baza (test rapid)
app.get('/', (req, res) => {
  res.send('Api-ul merge');
});

// pornire server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serverul e pe portul ${PORT}`);
});