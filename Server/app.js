/* 
   HUVUDSERVERN (app.js) - motorn i vårt system

Den här filen startar upp hela vår Node.js-miljö med Express. 
Den ser till att databasen är synkad och att alla delar av 
webbshoppen kan prata med varandr.
*/
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const sequelize = require('./config/db');

//  IMPORTERA MODELLER
// Vi hämtar in alla ritningar för hur vår data ska se ut.
const User = require('./Models/user'); 
const Product = require('./Models/product');
const Rating = require('./Models/rating');
const Cart = require('./Models/cart');
const CartRow = require('./Models/cart_row');

// RELATIONER 
// Här skapar vi kopplingarna exakt enligt projektets UML-diagram.
User.hasMany(Cart, { foreignKey: 'user_id' });
Cart.belongsTo(User, { foreignKey: 'user_id' });

// En produkt har många betyg. Om produkten tas bort, försvinner betygen också
Product.hasMany(Rating, { foreignKey: 'product_id', onDelete: 'CASCADE' });
Rating.belongsTo(Product, { foreignKey: 'product_id' });

// Många-till-många: En korg kan ha många produkter, och en produkt kan finnas i många korgar.
Cart.belongsToMany(Product, { through: CartRow, foreignKey: 'cart_id' });
Product.belongsToMany(Cart, { through: CartRow, foreignKey: 'product_id' });

// Koppla ihop Rating med User så vi kan se vem som skrev kommentaren
User.hasMany(Rating, { foreignKey: 'user_id' });
Rating.belongsTo(User, { foreignKey: 'user_id' });

// EXPRESS SETUP
const app = express();
app.use(cors()); // Tillåter React på port 5173 att prata med Backend på port 5000
app.use(express.json()); // Detta behövs för att ta emot JSON-data från frontend

// 4. ROUTES
const productRoutes = require('./Routes/productRoutes');
const userRoutes = require('./Routes/userRoutes');
const cartRoutes = require('./Routes/cartRoutes');
const ratingRoutes = require('./Routes/ratingRoutes');

// Här kopplar vi in de olika filerna som sköter trafiken för produkter, användare
app.use('/products', productRoutes);
app.use('/users', userRoutes);
app.use('/cart', cartRoutes);
app.use('/ratings', ratingRoutes);

app.get('/', (req, res) => res.send('Backend är 100% redo och synkad!'));

// 5. SYNKA OCH STARTA
const PORT = process.env.PORT || 5000;

// sequelize.sync() ser till att tabellerna faktiskt skapas i MySQL-databasen
sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Servern körs på port ${PORT}`);
    console.log('MySQL-databasen är synkad!');
  });
}).catch(err => {
  console.error('Kunde inte synka databasen:', err);
});