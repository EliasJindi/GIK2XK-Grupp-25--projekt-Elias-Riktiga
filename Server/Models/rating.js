/* 
 MODELL FÖR BETYG 
Den här filen gör det möjligt för kunder att betygsätta 
produkterna i butiken. Den sparar både poäng (1-5) och 
kommentarer i databasen.
*/
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
  user_id: { 
    type: DataTypes.INTEGER,
    allowNull: false
  },
  score: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: { min: 1, max: 5 }
  },
  comment: { 
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  underscored: true 
});

module.exports = Rating;