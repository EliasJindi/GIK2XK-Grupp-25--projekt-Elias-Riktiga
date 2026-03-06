const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const CartRow = sequelize.define('cart_row', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  amount: {
    type: DataTypes.INTEGER,
    defaultValue: 1
  }
}, {
  underscored: true // Matchar din produktmodell
});

module.exports = CartRow;