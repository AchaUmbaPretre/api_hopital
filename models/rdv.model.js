const pool = require('../config/db.config');

const getRdv = async () => {
    const queryAsync = (query, params) => {
      return new Promise((resolve, reject) => {
        pool.query(query, params, (error, results) => {
          if (error) {
            reject(error);
          } else {
            resolve(results);
          }
        });
      });
    };
  
    try {
      const results = await queryAsync(`SELECT 
    rdv.id_rendez_vous,
    rdv.date_rdv, 
    rdv.heure_debut, 
    rdv.heure_fin, 
    rdv.type_rendezvous, 
    rdv.motif_rdv, 
    rdv.statut, 
    rdv.confirmation_docteur,
    docteur.username AS docteur_nom, 
    receptionniste.username AS receptionniste_nom, 
    patient.nom_patient
FROM 
    rendez_vous AS rdv
INNER JOIN 
    users AS docteur ON rdv.id_docteur = docteur.id
INNER JOIN 
    users AS receptionniste ON rdv.id_receptionniste = receptionniste.id
INNER JOIN 
    patient ON rdv.id_patient = patient.id_patient;
`);
      return results; 
    } catch (error) {
      console.error('Erreur lors de la récupération des rendez vous :', error);
      throw error; 
    }
  };


const getRdvOne = async (id) => {
    const queryAsync = (query, params) => {
      return new Promise((resolve, reject) => {
        pool.query(query, params, (error, results) => {
          if (error) {
            reject(error);
          } else {
            resolve(results);
          }
        });
      });
    };
  
    try {
      const results = await queryAsync(`SELECT 
    rdv.id_rendez_vous,
    rdv.date_rdv, 
    rdv.heure_debut, 
    rdv.heure_fin, 
    rdv.type_rendezvous, 
    rdv.motif_rdv, 
    rdv.statut, 
    rdv.confirmation_docteur,
    docteur.username AS docteur_nom, 
    receptionniste.username AS receptionniste_nom, 
    patient.nom_patient
FROM 
    rendez_vous AS rdv
INNER JOIN 
    users AS docteur ON rdv.id_docteur = docteur.id
INNER JOIN 
    users AS receptionniste ON rdv.id_receptionniste = receptionniste.id
INNER JOIN 
    patient ON rdv.id_patient = patient.id_patient;
         WHERE rdv.id_rendez_vous = ?`, [id]);
      return results; 
    } catch (error) {
      console.error('Erreur lors de la récupération des consultation :', error);
      throw error; 
    }
  };


const getRdvOneNotification = async (id) => {
    const queryAsync = (query, params) => {
      return new Promise((resolve, reject) => {
        pool.query(query, params, (error, results) => {
          if (error) {
            reject(error);
          } else {
            resolve(results);
          }
        });
      });
    };
  
    try {
      const results = await queryAsync(`SELECT 
    rdv.id_rendez_vous,
    rdv.date_rdv, 
    rdv.heure_debut, 
    rdv.heure_fin, 
    rdv.type_rendezvous, 
    rdv.motif_rdv, 
    rdv.statut, 
    rdv.confirmation_docteur,
    docteur.username AS docteur_nom, 
    receptionniste.username AS receptionniste_nom, 
    patient.nom_patient
FROM 
    rendez_vous AS rdv
INNER JOIN 
    users AS docteur ON rdv.id_docteur = docteur.id
INNER JOIN 
    users AS receptionniste ON rdv.id_receptionniste = receptionniste.id
INNER JOIN 
    patient ON rdv.id_patient = patient.id_patient;
         WHERE rdv.id_rendez_vous = ? AND confirmation_docteur = 'NON'`, [id]);
      return results; 
    } catch (error) {
      console.error('Erreur lors de la récupération des consultation :', error);
      throw error; 
    }
  };

const getRdvDocteur = async (id) => {
    const queryAsync = (query, params) => {
      return new Promise((resolve, reject) => {
        pool.query(query, params, (error, results) => {
          if (error) {
            reject(error);
          } else {
            resolve(results);
          }
        });
      });
    };
  
    try {
      const results = await queryAsync(`SELECT 
    rdv.id_rendez_vous,
    rdv.date_rdv, 
    rdv.heure_debut, 
    rdv.heure_fin, 
    rdv.type_rendezvous, 
    rdv.motif_rdv, 
    rdv.statut, 
    rdv.confirmation_docteur,
    docteur.username AS docteur_nom, 
    receptionniste.username AS receptionniste_nom, 
    patient.nom_patient
FROM 
    rendez_vous AS rdv
INNER JOIN 
    users AS docteur ON rdv.id_docteur = docteur.id
INNER JOIN 
    users AS receptionniste ON rdv.id_receptionniste = receptionniste.id
INNER JOIN 
    patient ON rdv.id_patient = patient.id_patient
         WHERE rdv.id_docteur = ?`, [id]);
      return results; 
    } catch (error) {
      console.error('Erreur lors de la récupération des consultation :', error);
      throw error; 
    }
  };
  
  const putRdvConfirmation = async (id_rendez_vous) => {
  
    const result = await pool.query(
        `UPDATE rendez_vous SET confirmation_docteur = 'OUI' WHERE id_rendez_vous = ?`,
        [id_rendez_vous]
      );
  
    return result;
  };

  const createRdv = async (id_patient, id_docteur, id_receptionniste, date_rdv, heure_debut, heure_fin, type_rendezvous, motif_rdv, statut) => {
  
    const result = await pool.query(
        'INSERT INTO rendez_vous (id_patient, id_docteur, id_receptionniste, date_rdv, heure_debut, heure_fin, type_rendezvous, motif_rdv, statut) VALUES (?, ?, ?, ?, ?, ?, ?, ?,?)',
        [id_patient, id_docteur, id_receptionniste, date_rdv, heure_debut, heure_fin, type_rendezvous, motif_rdv, statut]
      );
  
    return result;
  };
  
  
  module.exports = {
    getRdv,
    getRdvOne,
    createRdv,
    getRdvDocteur,
    putRdvConfirmation,
    getRdvOneNotification
  };