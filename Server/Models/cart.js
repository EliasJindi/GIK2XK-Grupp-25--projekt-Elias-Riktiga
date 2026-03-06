const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Cart = sequelize.define('cart', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  payed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  underscored: true // Matchar din produktmodell
});

module.exports = Cart;