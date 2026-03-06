const Cart = require('../Models/cart');
const CartRow = require('../Models/cart_row');
const Product = require('../Models/product');

/**
 * Lägger till en vara eller ändrar antal (+1 eller -1).
 */
async function addProductToCart(userId, productId, change) {
  try {
    // 1. Hitta eller skapa en aktiv korg för användaren
    let [cart] = await Cart.findOrCreate({ 
      where: { user_id: userId, payed: false } 
    });
    
    // 2. Kolla om produkten redan finns i denna korg
    let cartRow = await CartRow.findOne({ 
      where: { cart_id: cart.id, product_id: productId } 
    });

    if (cartRow) {
      // Uppdatera antal om raden redan finns
      cartRow.amount += parseFloat(change);

      if (cartRow.amount <= 0) {
        // Radera raden helt om antalet blir 0 eller mindre
        await cartRow.destroy();
        return { message: "Varan raderad från korgen" };
      }
      await cartRow.save();
      return cartRow;
    } else if (change > 0) {
      // Skapa en helt ny rad om varan inte fanns
      return await CartRow.create({ 
        cart_id: cart.id, 
        product_id: productId, 
        amount: change 
      });
    }
  } catch (error) {
    throw new Error('Fel i cartService: ' + error.message);
  }
}

/**
 * Hämtar den aktiva korgen inkl. produkter.
 */
async function getCartByUser(userId) {
  try {
    return await Cart.findOne({
      where: { user_id: userId, payed: false },
      include: [{ 
        model: Product, 
        through: { attributes: ['amount'] } 
      }]
    });
  } catch (error) {
    throw new Error('Kunde inte hämta korgen: ' + error.message);
  }
}

/**
 * Tömmer hela varukorgen (raderar alla rader).
 */
async function clearCart(userId) {
  try {
    const cart = await Cart.findOne({ where: { user_id: userId, payed: false } });
    if (cart) {
      return await CartRow.destroy({ where: { cart_id: cart.id } });
    }
  } catch (error) {
    throw new Error('Kunde inte tömma korgen: ' + error.message);
  }
}

/**
 * Sätter korgen som betald (Checkout).
 */
async function checkout(userId) {
  try {
    const cart = await Cart.findOne({ where: { user_id: userId, payed: false } });
    if (cart) {
      cart.payed = true;
      return await cart.save();
    }
  } catch (error) {
    throw new Error('Köp kunde inte genomföras: ' + error.message);
  }
}

module.exports = { addProductToCart, getCartByUser, clearCart, checkout };