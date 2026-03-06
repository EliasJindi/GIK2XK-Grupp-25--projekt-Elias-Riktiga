const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Product = sequelize.define('product', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT // TEXT rymmer längre beskrivningar
  },
  price: {
    type: DataTypes.DOUBLE, // Double enligt kravet i diagrammet
    allowNull: false
  },
  image_url: {
    type: DataTypes.STRING // Sparar länken till produktbilden
  }
}, {
  underscored: true // Använder t.ex. created_at och product_id
});

module.exports = Product;