/* 
API-ROUTES FÖR ANVÄNDARE 
Den här filen bestämmer hur hemsidan får prata med backend 
när det gäller användare. Den sköter både inloggning och 
att skapa nya konton
*/
const express = require('express');
const router = express.Router();
const userService = require('../Services/userService');
const User = require('../Models/user');

//Hämta alla användare
router.get('/', async (req, res) => {
  try {
    const users = await userService.getAll();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Registrera ny användar
router.post('/', async (req, res) => {
  try {
    const newUser = await userService.create(req.body);
    res.status(201).json(newUser);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// PUT: http://localhost:5000/users/:id (Uppdatera användare)
router.put('/:id', async (req, res) => {
  try {
    const updated = await User.update(req.body, { where: { id: req.params.id } });
    if (updated[0] === 1) {
      res.json({ message: "Användare uppdaterad" });
    } else {
      res.status(404).json({ message: "Användaren hittades inte" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE: http://localhost:5000/users/:id (Radera användare)
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await User.destroy({ where: { id: req.params.id } });
    if (deleted) {
      res.json({ message: "Användare raderad" });
    } else {
      res.status(404).json({ message: "Användaren hittades inte" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router; // Denna rad är livsviktig!
