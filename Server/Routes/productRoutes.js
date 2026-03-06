const express = require('express');
const router = express.Router();
const productService = require('../Services/productService');

/**
 * GET: http://localhost:5000/products
 * Hämtar alla produkter från databasen.
 * Denna använder nu getAllProducts för att inkludera genomsnittsbetyg.
 */
router.get('/', async (req, res) => {
  try {
    // Vi anropar funktionen som räknar ut snittbetyget (AVG)
    const products = await productService.getAllProducts();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET: http://localhost:5000/products/:id
 * Hämtar en specifik produkt baserat på dess ID.
 * (Behålls från din originalkod så att ingen funktionalitet försvinner)
 */
router.get('/:id', async (req, res) => {
  try {
    // Obs: Se till att getById finns i din productService
    const product = await productService.getById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Produkten hittades inte' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST: http://localhost:5000/products
 * Admin-rutt för att skapa en ny produkt i MySQL.
 */
router.post('/', async (req, res) => {
  try {
    // Vi använder createProduct för att spara ner i databasen
    const newProduct = await productService.createProduct(req.body);
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;