const express = require('express');
const router = express.Router();
const productService = require('../Services/productService');
const Product = require('../Models/product'); // Importerar modellen för PUT och DELETE

/**
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
 * Hämtar en specifik produkt baserat på dess ID.
 */
router.get('/:id', async (req, res) => {
  try {
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
 * Admin-rutt för att skapa en ny produkt i MySQL.
 */
router.post('/', async (req, res) => {
  try {
    const newProduct = await productService.createProduct(req.body);
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * Admin-rutt för att uppdatera (EDIT) en produkt.
 */
router.put('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    // Sequelize update returnerar en array. Om första elementet är 1 så lyckades det.
    const updated = await Product.update(req.body, {
      where: { id: id }
    });
    
    if (updated[0] === 1) {
      res.json({ message: "Materiel uppdaterad!" });
    } else {
      res.status(404).json({ message: "Hittade inte materielen." });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Admin-rutt för att radera en produkt.
 */
router.delete('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const deleted = await Product.destroy({
      where: { id: id }
    });

    if (deleted) {
      res.json({ message: "Materiel raderad från systemet!" });
    } else {
      res.status(404).json({ message: "Hittade inte materielen." });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;