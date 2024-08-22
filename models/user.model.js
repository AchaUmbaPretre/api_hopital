const pool = require('../config/db.config');
const bcrypt = require('bcryptjs');

const getUserByUsername = async (email) => {
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
    const results = await queryAsync('SELECT * FROM users WHERE email = ?', [email]);
    return results[0]; 
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'utilisateur :', error);
    throw error; 
  }
};

const getUserByUsernameOne = async (id) => {
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
    const results = await queryAsync('SELECT * FROM users WHERE id = ?', [id]);
    return results[0]; 
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'utilisateur :', error);
    throw error; 
  }
};

const createUser = async (username, password, email, postnom, prenom, phone_number, role, department_id, img) => {
  const hashedPassword = await bcrypt.hash(password, 10);

  if(!role){
    console.log('Role est indefi')
  }

  const result = await pool.query(
    'INSERT INTO users (username, password, email, postnom, prenom, phone_number, role, department_id, img) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [username, hashedPassword, email, postnom, prenom, phone_number, role, department_id, img]
  );

  return result;
};


module.exports = {
  getUserByUsername,
  createUser,
  getUserByUsernameOne
};
