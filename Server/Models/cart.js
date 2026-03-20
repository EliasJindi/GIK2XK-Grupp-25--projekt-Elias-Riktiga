/* 
   MODELL FÖR VARUKORG (Cart)
Den här filen bestämmer hur "själva varukorgen" ska se ut i databasen. 
Enligt projektets regler ska en användare kunna ha en varukorg för att 
genomföra ett köp.
*/
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
  underscored: true 
});

module.exports = Cart;