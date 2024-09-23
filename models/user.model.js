const pool = require('../config/db.config');
const bcrypt = require('bcryptjs');

const getUserAll = async () => {
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
    const results = await queryAsync(`SELECT users.username, users.email, users.postnom, users.prenom, users.phone_number,users.specialite, r.nom_role AS role FROM users
                                        INNER JOIN role r ON users.role = r.id_role`);
    return results; 
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'utilisateur :', error);
    throw error; 
  }
};

const getUserByUsername = async (email) => {
  if (!email) {
    throw new Error("L'email est requis et ne peut pas être undefined ou null.");
  }

  const queryAsync = (query, params) => {
    return new Promise((resolve, reject) => {
      try {
        pool.query(query, params, (error, results) => {
          if (error) {
            console.error("Erreur dans pool.query : ", error);
            reject(error);
          } else {
            resolve(results);
          }
        });
      } catch (err) {
        console.error("Erreur inattendue dans queryAsync :", err);
        reject(err);
      }
    });
  };

  try {
    const results = await queryAsync(
      `SELECT users.id, users.username, users.email,users.password, users.postnom, users.prenom, users.phone_number, users.specialite, r.nom_role AS role
      FROM users
      INNER JOIN role r ON users.role = r.id_role
      WHERE users.email = ?`,
      [email]
    );
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

const logouts = async () => {
  
}

module.exports = {
  getUserByUsername,
  createUser,
  getUserByUsernameOne,
  logouts,
  getUserAll
};
