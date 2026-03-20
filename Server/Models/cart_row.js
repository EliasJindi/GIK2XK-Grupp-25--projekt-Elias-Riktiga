//  Hämtar verktyg från Sequelize för att kunna bestämma datatyper
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

// Vi skapar modellen 'cart_row'. Denna behövs för att koppla samman en varukorg (cart)
//  med produkter (products). Det kallas för ett "många-till-många-förhållande".
 
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
  underscored: true 
});

module.exports = CartRow;