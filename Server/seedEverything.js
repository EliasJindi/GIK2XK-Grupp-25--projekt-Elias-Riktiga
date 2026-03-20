const sequelize = require('./config/db');
const User = require('./Models/user');
const Product = require('./Models/product');
const Rating = require('./Models/rating');
const Cart = require('./Models/cart');
const CartRow = require('./Models/cart_row');
const bcrypt = require('bcrypt');

// 1. RELATIONER (Måste matcha app.js för att databasen ska byggas rätt)
User.hasMany(Cart, { foreignKey: 'user_id' });
Cart.belongsTo(User, { foreignKey: 'user_id' });

Product.hasMany(Rating, { foreignKey: 'product_id', onDelete: 'CASCADE' });
Rating.belongsTo(Product, { foreignKey: 'product_id' });

Cart.belongsToMany(Product, { through: CartRow, foreignKey: 'cart_id' });
Product.belongsToMany(Cart, { through: CartRow, foreignKey: 'product_id' });

User.hasMany(Rating, { foreignKey: 'user_id' });
Rating.belongsTo(User, { foreignKey: 'user_id' });

const seed = async () => {
  try {
    console.log("--- STARTAR TOTAL NOLLSTÄLLNING ---");
    
    // sync({ force: true }) raderar tabellerna om de finns och skapar nya
    await sequelize.sync({ force: true });
    console.log("✅ 1. Databasens struktur är helt återställd.");

    // Skapa test-användare (Generalen)
    const hashedPassword = await bcrypt.hash('elias123', 10);
    await User.create({
      username: 'Generalen',
      email: 'generalen@militaren.se',
      password: hashedPassword,
    });
    console.log("✅ 2. Användaren 'Generalen' är skapad.");

    // Skapa militära produkter
    const militaryProducts = [
      { 
        title: "F-35 Lightning II", 
        description: "Världens modernaste stealth-stridsflygplan med avancerad radarstörning.", 
        price: 850000000, 
        image_url: "/images/f35.jpg" 
      },
      { 
        title: "Leopard 2A7", 
        description: "Tungt bepansrad stridsvagn med en kraftfull 120mm slätborrad kanon.", 
        price: 150000000, 
        image_url: "/images/tank.jpg" 
      },
      { 
        title: "B2 Bomber", 
        description: "Stealth bomber som är nästan osynlig för radar.", 
        price: 2000000000, 
        image_url: "/images/B2.jpg" 
      }
    ];
    
    await Product.bulkCreate(militaryProducts);
    console.log("✅ 3. Militärt lager påfyllt med 3 produkter.");

    console.log("\n🚀 ALLT KLART! Databasen är nu redo.");
    process.exit();
  } catch (err) {
    console.error("❌ FEL VID SEEDING:", err);
    process.exit(1);
  }
};

seed();