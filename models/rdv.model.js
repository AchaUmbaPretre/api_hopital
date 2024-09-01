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
      const results = await queryAsync(`SELECT rdv.id_rdv,rdv.date_rdv, rdv.heure_debut, rdv.heure_fin, rdv.type_rendezvous, rdv.motif_rdv, rdv.statut, users.username, patient.nom_patient FROM rdv
                                          INNER JOIN users ON rdv.id_utilisateur = users.id
                                          INNER JOIN patient ON rdv.id_patient = patient.id_patient`);
      return results; 
    } catch (error) {
      console.error('Erreur lors de la récupération des consultation :', error);
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
      const results = await queryAsync(`SELECT rdv.id_rdv,rdv.date_rdv, rdv.heure_debut, rdv.heure_fin, rdv.type_rendezvous, rdv.motif_rdv, rdv.statut, users.username, patient.nom_patient FROM rdv
INNER JOIN users ON rdv.id_utilisateur = users.id
INNER JOIN patient ON rdv.id_patient = patient.id_patient WHERE rdv.id_rdv = ?`, [id]);
      return results; 
    } catch (error) {
      console.error('Erreur lors de la récupération des consultation :', error);
      throw error; 
    }
  };
  
  const createRdv = async (id_patient, id_utilisateur, date_rdv, heure_debut, heure_fin, type_rendezvous, motif_rdv, statut) => {
  
    const result = await pool.query(
        'INSERT INTO rdv (id_patient, id_utilisateur, date_rdv, heure_debut, heure_fin, type_rendezvous, motif_rdv, statut) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [id_patient  , id_utilisateur, date_rdv, heure_debut, heure_fin, type_rendezvous, motif_rdv, statut]
      );
  
    return result;
  };
  
  
  module.exports = {
    getRdv,
    getRdvOne,
    createRdv,
  };