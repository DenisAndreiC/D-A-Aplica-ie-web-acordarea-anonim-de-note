const express = require('express');
const cors = require('cors');
const app = express();

//importurile pt route
const userRoutes = require('./routes/userRoutes');
const projectRoutes = require('./routes/projectRoutes');
const deliverableRoutes= require('./routes/deliverableRoutes');
const juryRoutes= require('./routes/juryRoutes');

// Middleware
app.use(cors());
app.use(express.json());
app.use('/api/users', userRoutes);
app.use('/api/projects', projectRoutes);//pt routes
app.use('/api/deliverables', deliverableRoutes);
app.use('/api/jury', juryRoutes);


//utilizam rute
app.use('/api/users', userRoutes);


// ruta de baza (pt test rapid)
app.get('/', (req, res) => {
  res.send('Api-ul merge');
});

// start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serverul e pe portul ${PORT}`);
});