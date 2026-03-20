/* 
API-ROUTES FÖR BETYG 
Den här filen sköter kommunikationen mellan vår hemsida och 
backend när det gäller betyg. Den ser till att kunder både 
kan skicka in nya recensioner och se gamla betyg
*/
const express = require('express');
const router = express.Router();
const ratingService = require('../Services/ratingService');


router.post('/', async (req, res) => {
  try {
    // req.body innehåller  productId, rating, comment, userId  från React
    const result = await ratingService.addRating(req.body);
    res.status(201).json(result);
  } catch (error) {
    console.error("Fel i route:", error);
    res.status(500).json({ error: error.message });
  }
});


router.get('/product/:id', async (req, res) => {
  try {
    const ratings = await ratingService.getByProduct(req.params.id);
    res.json(ratings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;