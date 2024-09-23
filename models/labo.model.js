const pool = require('../config/db.config');

const getLabo = async () => {
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
      const results = await queryAsync(`SELECT laboratoire.id_laboratoire, laboratoire.date_demande, 
laboratoire.date_analyse, laboratoire.resultats, laboratoire.remarques, 
laboratoire.resultat_transmis,consultation.personnelId, typeconsultation.nomConsultation, patient.nom_patient,patient.id_patient, type_analyse.nom_analyse
FROM laboratoire
INNER JOIN consultation ON laboratoire.id_consultation = consultation.id
INNER JOIN typeconsultation ON consultation.id_typeConsultation = typeconsultation.id_typeConsultation
INNER JOIN patient ON laboratoire.id_patient = patient.id_patient
INNER JOIN type_analyse ON laboratoire.id_type_analyse = type_analyse.id_type_analyse

                                      `);
      return results; 
    } catch (error) {
      console.error('Erreur lors de la récupération des consultation :', error);
      throw error; 
    }
  };

const getTypeAnalyse = async () => {
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
      const results = await queryAsync(`SELECT * FROM type_analyse`);
      return results; 
    } catch (error) {
      console.error('Erreur lors de la récupération des type analyse :', error);
      throw error; 
    }
  };

  const getLaboOne = async (id) => {
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
      const results = await queryAsync(`SELECT * FROM laboratoire WHERE id_laboratoire = ?`, [id]);
      return results; 
    } catch (error) {
      console.error('Erreur lors de la récupération des paiements :', error);
      throw error; 
    }
  };

  const createLabo = async (id_consultation, id_patient, id_type_analyse, date_demande, date_analyse, resultats, status, remarques) => {
  
    const result = await pool.query(
        'INSERT INTO laboratoire (id_consultation, id_patient, id_type_analyse, date_demande, date_analyse, resultats, status, remarques) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [id_consultation, id_patient, id_type_analyse, date_demande, date_analyse, resultats, status, remarques]
      );
  
    return result;
  };

  //getPrescription_laboratoire
  const getPrescription_laboratoire = async () => {
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
      const results = await queryAsync(`SELECT pl.id_prescription, pl.date_prescription, pl.status, ta.nom_analyse, typeconsultation.nomConsultation, patient.nom_patient, users.username AS nom_docteur, consultation.id AS id_consultation, consultation.patientId FROM prescription_laboratoire AS pl
          INNER JOIN type_analyse AS ta ON pl.id_type_analyse = ta.id_type_analyse
          INNER JOIN consultation ON pl.id_consultation = consultation.id
          INNER JOIN typeconsultation ON consultation.id_typeConsultation = typeconsultation.id_typeConsultation
          INNER JOIN patient ON consultation.patientId = patient.id_patient
          INNER JOIN users ON consultation.personnelId = users.id`);
      return results; 
    } catch (error) {
      console.error('Erreur lors de la récupération des prescription laboratoire :', error);
      throw error; 
    }
  };

  const createPrescriptionLabo = async (id_consultation, id_type_analyse, date_prescription, status) => {
  
    const result = await pool.query(
        'INSERT INTO prescription_laboratoire (id_consultation, id_type_analyse, date_prescription, status) VALUES (?, ?, ?, ?)',
        [id_consultation, id_type_analyse,	date_prescription, status]
      );
  
    return result;
  };


//Transmission de resultant
const getTransmission_resultat = async () => {
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
    const results = await queryAsync(`SELECT * transmission_resultat`);
    return results; 
  } catch (error) {
    console.error('Erreur lors de la récupération des prescription laboratoire :', error);
    throw error; 
  }
};

const getTransmission_resultatOne = async (id) => {
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
    const results = await queryAsync(`SELECT * transmission_resultat WHERE transmission_resultat.id_docteur = ?`, [id]);
    return results; 
  } catch (error) {
    console.error('Erreur lors de la récupération des prescription laboratoire :', error);
    throw error; 
  }
};

const createTransmission_resultat = async (id_laboratoire, id_docteur, date_transmission, remarques) => {
  
  const result = await pool.query(
      'INSERT INTO transmission_resultat(id_laboratoire , id_docteur, date_transmission, remarques) VALUES (?, ?, ?, ?)',
      [id_laboratoire, id_docteur, date_transmission, remarques]
    );

  return result;
};

    
  module.exports = {
    getLabo,
    getLaboOne,
    createLabo,
    getTypeAnalyse,
    createPrescriptionLabo,
    getPrescription_laboratoire,
    getTransmission_resultat,
    getTransmission_resultatOne,
    createTransmission_resultat,
  };