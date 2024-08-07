const pool = require('../config/db.config');

const getAllUsers = (callback) => {
  pool.query('SELECT * FROM users', (err, results) => {
    if (err) {
      return callback(err);
    }
    callback(null, results);
  });
};

module.exports = {
  getAllUsers,
};
