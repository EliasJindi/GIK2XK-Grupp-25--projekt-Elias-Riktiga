const express = require('express');
const router = express.Router();
const cartService = require('../Services/cartService');

/**
 * POST: http://localhost:5000/cart/add
 * Används för att lägga till en vara eller ändra antal (+1 eller -1).
 * Tar emot user_id, product_id och amount i req.body.
 */
router.post('/add', async (req, res) => {
  try {
    const { user_id, product_id, amount } = req.body;
    
    // Vi anropar servicen som sköter logiken för att hitta/skapa korgrader
    const result = await cartService.addProductToCart(user_id, product_id, amount);
    
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET: http://localhost:5000/cart/:userId
 * Hämtar den aktuella (obetalda) varukorgen för en specifik användare.
 */
router.get('/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    
    // Hämtar korgen inkl. alla produkter och deras antal
    const cart = await cartService.getCartByUser(userId);
    
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * DELETE: http://localhost:5000/cart/clear/:userId
 * Tömmer hela varukorgen genom att radera alla dess rader i databasen.
 */
router.delete('/clear/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    
    const result = await cartService.clearCart(userId);
    
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * PUT: http://localhost:5000/cart/checkout/:userId
 * Genomför köpet genom att sätta korgens status till 'payed: true'.
 */
router.put('/checkout/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    
    const result = await cartService.checkout(userId);
    
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;