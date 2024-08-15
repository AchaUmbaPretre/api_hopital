const pool = require('../config/db.config');

const getDocteur = async () => {
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
      const results = await queryAsync('SELECT * FROM users WHERE role = 1');
      return results; 
    } catch (error) {
      console.error('Erreur lors de la récupération des docteurs :', error);
      throw error; 
    }
  };
  
  const createDocteur = async (username, password, email, postnom, prenom, phone_number, role, department_id,specialite,adresse, img) => {
  
    const result = await pool.query(
        'INSERT INTO users (username, password, email, postnom, prenom, phone_number, role, department_id,specialite,adresse, img) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?,?,?)',
        [username, password, email, postnom, prenom, phone_number, role, department_id,specialite,adresse, img]
      );
  
    return result;
  };
  
  
  module.exports = {
    getDocteur,
    createDocteur,
  };