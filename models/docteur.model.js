const pool = require('../config/db.config');

const getDocteurCount = async () => {
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
    const results = await queryAsync('SELECT COUNT(id) AS nbre_docteur FROM users WHERE role = 1');
    return results; 
  } catch (error) {
    console.error('Erreur lors de la récupération des docteurs :', error);
    throw error; 
  }
};


const getDocteur = async () => {
  // Encapsuler pool.query dans une promesse
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
    // Requête SQL corrigée
    const results = await queryAsync(`
      SELECT 
        users.id,
        users.username, 
        users.postnom, 
        users.prenom, 
        users.phone_number,
        users.adresse,
        users.email,
        specialite.nom_specialite 
      FROM users
      INNER JOIN specialite ON users.specialite = specialite.id_specialite
      WHERE role = 1
    `);

    return results;
  } catch (error) {
    console.error('Erreur lors de la récupération des docteurs :', error);
    throw new Error('Erreur lors de la récupération des docteurs. Veuillez réessayer plus tard.');
  }
};

const getDocteurOne = async (id_docteur) => {
  // Encapsuler pool.query dans une promesse
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
    // Requête SQL corrigée
    const results = await queryAsync(`
      SELECT 
        users.username, 
        users.postnom, 
        users.prenom, 
        users.phone_number,
        users.adresse,
        users.email,
        specialite.nom_specialite 
      FROM users
      INNER JOIN specialite ON users.specialite = specialite.id_specialite
      WHERE role = 1 AND users.id = ?
    `, [id_docteur]);

    return results;
  } catch (error) {
    console.error('Erreur lors de la récupération des docteurs :', error);
    throw new Error('Erreur lors de la récupération des docteurs. Veuillez réessayer plus tard.');
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
    getDocteurOne,
    getDocteurCount,
    getDocteur,
    getSpecialite,
    createDocteur,
    getDepartement,
    getProvince
  };