const pool = require('../config/db.config');
const bcrypt = require('bcryptjs');

const getUserByUsername = async (username) => {
  const [rows] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
  return rows[0];
};

const createUser = async (username, password, email, postnom, prenom, phone_number, role, department_id, img) => {
   const hashedPassword = await bcrypt.hash(password, 10);
  const [result] = await pool.query('INSERT INTO users (username, password, email, postnom, prenom, phone_number, role, department_id, img) VALUES (?, ?, ?, ?, ?, ?, ?)', [username,username, hashedPassword, email, postnom, prenom, phone_number, role, department_id, img ]);
  return result;
};

module.exports = {
  getUserByUsername,
  createUser,
};
