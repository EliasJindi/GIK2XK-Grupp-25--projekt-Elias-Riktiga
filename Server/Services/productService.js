const Product = require('../Models/product');
const Rating = require('../Models/rating');
const { fn, col } = require('sequelize');

/**
 * Hämtar alla produkter och inkluderar både genomsnittsbetyg (AVG) 
 * och totalt antal röster (COUNT).
 */
async function getAllProducts() {
  try {
    return await Product.findAll({
      attributes: {
        include: [
          // Räknar ut genomsnittet av alla 'score' i rating-tabellen
          [fn('AVG', col('ratings.score')), 'avgRating'],
          // Räknar ut totalt antal rader (id) i rating-tabellen för produkten
          [fn('COUNT', col('ratings.id')), 'ratingCount']
        ]
      },
      include: [{ 
        model: Rating, 
        attributes: [] // Vi vill bara ha uträkningarna, inte alla enskilda betyg rader
      }],
      group: ['product.id'] // Grupperar resultatet så vi får unika rader per produkt
    });
  } catch (error) {
    throw new Error('Kunde inte hämta produkter med betyg: ' + error.message);
  }
}

/**
 * Hämtar en specifik produkt baserat på ID (från din tidigare kod).
 */
async function getById(id) {
  try {
    return await Product.findByPk(id);
  } catch (error) {
    throw new Error('Kunde inte hitta produkten: ' + error.message);
  }
}

/**
 * Admin-funktion: Skapa en ny produkt i databasen.
 */
async function createProduct(data) {
  try {
    return await Product.create(data);
  } catch (error) {
    throw new Error('Kunde inte skapa produkten: ' + error.message);
  }
}

module.exports = { 
  getAllProducts, 
  getById,
  createProduct 
};