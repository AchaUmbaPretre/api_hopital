const express = require('express');
const cors = require('cors');
const app = express();
const { PORT } = require('./config/server.config');
const authRoutes = require('./routes/auth.routes');
const patientRoutes = require('./routes/patient.routes');
const docteurRoutes = require('./routes/docteur.routes');
const consultantRoutes = require('./routes/consult.routes');
const serviceRoutes = require('./routes/service.routes');
const pharmaRoutes = require('./routes/pharma.routes');
const rdvRoutes = require('./routes/rdv.routes');
const admissionRoutes = require('./routes/rdv.routes');
const factureRoutes = require('./routes/factures.routes');
const traitementRoutes = require('./routes/traitement.routes');
const userRoutes = require('./routes/user.routes');
const paiementRoutes = require('./routes/paiement.routes');



const errorHandler = require('./middleware/error.middleware');

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.use('/api/auth', authRoutes);
app.use('/api/patient', patientRoutes);
app.use('/api/docteur', docteurRoutes);
app.use('/api/consultant', consultantRoutes);
app.use('/api/service', serviceRoutes);
app.use('/api/pharma', pharmaRoutes);
app.use('/api/rendezVous', rdvRoutes);
app.use('/api/admission', admissionRoutes);
app.use('/api/factures', factureRoutes);
app.use('/api/traitement', traitementRoutes);
app.use('/api/user', userRoutes);
app.use('/api/paiement', paiementRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Serveur en écoute sur le port ${PORT}`);
});