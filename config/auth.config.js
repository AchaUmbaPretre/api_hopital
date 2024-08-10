require('dotenv').config();

module.exports = {
    JWT_SECRET: process.env.JWT_SECRET || 'votre_clé_secrète',
    JWT_EXPIRES_IN: '1h',
  };
  