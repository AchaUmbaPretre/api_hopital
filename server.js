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
const admissionRoutes = require('./routes/admission.routes');
const factureRoutes = require('./routes/factures.routes');
const traitementRoutes = require('./routes/traitement.routes');
const userRoutes = require('./routes/user.routes');
const paiementRoutes = require('./routes/paiement.routes');
const ordonnanceRoutes = require('./routes/ordonnance.routes');
const laboRoutes = require('./routes/labo.routes');
const triageRoutes = require('./routes/triage.routes');
const mutuelleRoutes = require('./routes/mutuelle.routes');
const { idempotence } = require('./middleware/idempotence.middleware');


const errorHandler = require('./middleware/error.middleware');

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Idempotence (B2 RDC) : dédupe des rejeux offline par X-Idempotence-Key
// (réponse stockée rejouée telle quelle — zéro doublon après coupure).
// Le middleware passe à travers silencieusement si la migration
// 001_rdc_metier.sql n'a pas encore créé la table idempotence_cles.
// Monté UNIQUEMENT sur les routers d'écriture du flux RDC.
const routersMutation = [
  ['/api/patient', patientRoutes],
  ['/api/consultant', consultantRoutes],
  ['/api/factures', factureRoutes],
  ['/api/traitement', traitementRoutes],
  ['/api/paiement', paiementRoutes],
  ['/api/ordonnance', ordonnanceRoutes],
  ['/api/pharma', pharmaRoutes],
  ['/api/triage', triageRoutes],
  ['/api/mutuelle', mutuelleRoutes],
];

app.use('/api/auth', authRoutes);
app.use('/api/docteur', docteurRoutes);
app.use('/api/service', serviceRoutes);
app.use('/api/rendezVous', rdvRoutes);
app.use('/api/admission', admissionRoutes);
app.use('/api/user', userRoutes);
app.use('/api/labo', laboRoutes);
for (const [chemin, router] of routersMutation) {
  app.use(chemin, idempotence, router);
}

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Serveur en écoute sur le port ${PORT}`);
});