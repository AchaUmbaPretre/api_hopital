const pool = require('../config/db.config');

const getFactures = async () => {
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
      const results = await queryAsync(`SELECT factures.*, patient.nom_patient FROM factures
INNER JOIN patient ON factures.patient_id = patient.id_patient`);
      return results; 
    } catch (error) {
      console.error('Erreur lors de la récupération des factures :', error);
      throw error; 
    }
  };

const getFacturesOne = async (id) => {
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
  facture_details.montant, facture_details.service_type, factures.date_emission, factures.date_limite, factures.montant_total, factures.status, factures.id_facture, factures.montant_total,
  CASE 
    WHEN facture_details.service_type = 'Medicament' THEN medicament.nomMedicament
    WHEN facture_details.service_type = 'Consultation' THEN typeconsultation.nomConsultation
    ELSE 'Unknown Service'
  END AS Type
FROM facture_details
INNER JOIN factures ON factures.id_facture = facture_details.facture_id
LEFT JOIN medicament ON facture_details.service_id = medicament.id
LEFT JOIN consultation ON facture_details.service_id = consultation.id
LEFT JOIN typeconsultation ON typeconsultation.id_typeConsultation = consultation.id_typeConsultation
WHERE facture_details.facture_id = ?

;
`, [id]);
      return results; 
    } catch (error) {
      console.error('Erreur lors de la récupération des factures :', error);
      throw error; 
    }
  };

const getFactureService = async (type) => {
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
  
    let results;
  
    try {
      if (type === 'Consultation') {
        results = await queryAsync(`SELECT consultation.id, consultation.diagnostic, typeconsultation.prixConsultation AS montant, typeconsultation.nomConsultation AS description FROM Consultation
                                      INNER JOIN typeconsultation ON consultation.id_typeConsultation = typeconsultation.id_typeConsultation`);
      } else if (type === 'Médicament') {
        results = await queryAsync(`SELECT id, medicament.nomMedicament AS nom_medicament, montant FROM Medicament`);
      } else if (type === 'Hospitalisation') {
        results = await queryAsync(`SELECT id, date_admission FROM admission`);
      }
      return results; 
    } catch (error) {
      console.error('Erreur lors de la récupération des données :', error);
      throw error; 
    }
  };

  const createFactures = async (patient_id, date_emission, date_limite, montant_total, status) => {
    return new Promise((resolve, reject) => {
      pool.query(
        'INSERT INTO Factures (patient_id, date_emission, date_limite, montant_total, status) VALUES (?, ?, ?, ?, ?)',
        [patient_id, date_emission, date_limite, montant_total, status],
        (error, results) => {
          if (error) {
            console.error('Erreur lors de la création de la facture:', error);
            return reject(error);
          }
          
          // Assurez-vous que result.insertId est disponible
          const factureId = results.insertId;
          console.log('factureId:', factureId);
          
          resolve(factureId);
        }
      );
    });
  };
  const insertFactureDetails = async (factureId, serviceDetails) => {
    try {
      console.log('Id _facture:', factureId); // Ajoutez ce log pour déboguer
  
      // Préparer les données pour l'insertion
      if (!Array.isArray(serviceDetails)) {
        throw new Error('Les détails des services doivent être un tableau.');
      }
  
      const details = serviceDetails.map(detail => [
        factureId,
        detail.service_type,
        detail.service_id,
        detail.montant
      ]);
  
      // Insérer les détails de la facture
      await pool.query(
        'INSERT INTO Facture_Details (facture_id, service_type, service_id, montant) VALUES ?',
        [details]
      );
    } catch (error) {
      console.error('Erreur lors de l\'insertion des détails de la facture:', error);
      throw error;
    }
  };
  
    
  
  
  module.exports = {
    getFactureService,
    getFactures,
    getFacturesOne,
    createFactures,
    insertFactureDetails
  };