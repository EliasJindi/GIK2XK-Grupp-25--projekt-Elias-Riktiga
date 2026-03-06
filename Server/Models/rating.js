const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Rating = sequelize.define('rating', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  product_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  score: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: { min: 1, max: 5 }
  }
}, {
  underscored: true // Matchar din produktmodell
});

module.exports = Rating;