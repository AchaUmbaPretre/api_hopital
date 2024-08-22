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


const getSpecialite = async () => {
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
      const results = await queryAsync('SELECT * FROM specialite');
      return results; 
    } catch (error) {
      console.error('Erreur lors de la récupération des docteurs :', error);
      throw error; 
    }
  };


  const getProvince = async () => {
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
      const results = await queryAsync('SELECT * FROM province');
      return results; 
    } catch (error) {
      console.error('Erreur lors de la récupération des provinces :', error);
      throw error; 
    }
  };


  const getDepartement = async () => {
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
      const results = await queryAsync('SELECT * FROM departments');
      return results; 
    } catch (error) {
      console.error('Erreur lors de la récupération des departements :', error);
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
    getSpecialite,
    createDocteur,
    getDepartement,
    getProvince
  };