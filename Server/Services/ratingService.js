const Rating = require('../Models/rating');

/**
 * Sparar ett nytt betyg för en produkt i databasen.
 * Vi använder fältnamnet 'score' för att matcha Rating-modellen.
 */
async function addRating(productId, score) {
  try {
    return await Rating.create({
      product_id: productId,
      score: score
    });
  } catch (error) {
    throw new Error('Kunde inte spara betyg: ' + error.message);
  }
}

/**
 * Hämtar alla enskilda betyg som lämnats för en viss produkt.
 * Bra att ha om du i framtiden vill lista alla recensioner.
 */
async function getByProduct(productId) {
  try {
    return await Rating.findAll({
      where: { product_id: productId }
    });
  } catch (error) {
    throw new Error('Kunde inte hämta betyg för produkten: ' + error.message);
  }
}

module.exports = {
  addRating,
  getByProduct
};