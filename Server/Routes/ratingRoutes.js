const express = require('express');
const router = express.Router();
const ratingService = require('../Services/ratingService');

/**
 * POST: http://localhost:5000/ratings/:id
 * Sparar ett nytt betyg för en produkt.
 * :id i URL:en motsvarar produktens id i databasen.
 */
router.post('/:id', async (req, res) => {
  try {
    const productId = req.params.id;
    const { score } = req.body; // Vi hämtar 'score' (1-5) som skickas från frontenden
    
    // Anropar ratingService för att spara betyget i MySQL
    const result = await ratingService.addRating(productId, score);
    
    res.json(result);
  } catch (error) {
    // Vid fel skickas status 500 tillbaka till frontenden
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET: http://localhost:5000/ratings/product/:id
 * Hämtar alla enskilda betyg som sparats för en specifik produkt.
 * Använder getByProduct-funktionen vi behöll i din ratingService.
 */
router.get('/product/:id', async (req, res) => {
  try {
    const productId = req.params.id;
    
    const ratings = await ratingService.getByProduct(productId);
    
    res.json(ratings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;