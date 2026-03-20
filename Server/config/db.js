const { Sequelize } = require('sequelize');
require('dotenv').config();

// Skapar anslutningen till MySQL 
const sequelize = new Sequelize(
  process.env.DB_NAME || 'webshop_db',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || '',
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'mysql',
    logging: false // Gör terminalen renare
  }
);

module.exports = sequelize;