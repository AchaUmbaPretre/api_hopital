const express = require('express');
const cors = require('cors');
const app = express();
const { PORT } = require('./config/server.config');
const authRoutes = require('./routes/auth.routes');
const errorHandler = require('./middleware/error.middleware');

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.use('/api/auth', authRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Serveur en écoute sur le port ${PORT}`);
});