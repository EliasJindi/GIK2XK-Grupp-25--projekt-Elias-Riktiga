// Konfiguration: Adresser till din Backend
const PRODUCTS_URL = "http://localhost:5000/products";
const CART_URL = "http://localhost:5000/cart";
const RATINGS_URL = "http://localhost:5000/ratings"; 
const USER_ID = 1; // Alias som användare

/**
 * HÄMTA PRODUKTER: Laddar produkter, snittbetyg och antal röster.
 */
async function getProducts() {
    const container = document.getElementById('product-container');
    if (!container) return; // Körs bara på index.html

    try {
        const response = await fetch(PRODUCTS_URL);
        const products = await response.json();
        container.innerHTML = ""; 

        products.forEach(p => {
            // Hämta värden från backend (snitt och antal röster)
            const avg = p.avgRating ? parseFloat(p.avgRating).toFixed(1) : "0.0";
            const count = p.ratingCount ? p.ratingCount : 0; // Antal röster

            const card = document.createElement('div');
            card.className = 'product-card';
            card.innerHTML = `
                <img src="${p.image_url || 'https://via.placeholder.com/200'}" alt="${p.title}">
                <div style="padding:15px">
                    <h3>${p.title}</h3>
                    <p class="rating-display">⭐ ${avg}/5 (${count} ${count === 1 ? 'röst' : 'röster'})</p>
                    <p>${p.description}</p>
                    <p class="price">${p.price} kr</p>

                    <div class="rate-container">
                        Betygsätt:
                        <span class="rate-star" onclick="sendRating(${p.id}, 1)">1</span>
                        <span class="rate-star" onclick="sendRating(${p.id}, 2)">2</span>
                        <span class="rate-star" onclick="sendRating(${p.id}, 3)">3</span>
                        <span class="rate-star" onclick="sendRating(${p.id}, 4)">4</span>
                        <span class="rate-star" onclick="sendRating(${p.id}, 5)">5</span>
                    </div>
                </div>
                <div class="cart-controls">
                    <button class="btn-minus" onclick="changeQuantity(${p.id}, -1)">−</button>
                    <button class="btn-add" onclick="changeQuantity(${p.id}, 1)">Lägg till / +</button>
                </div>
            `;
            container.appendChild(card);
        });
    } catch (error) {
        console.error("Fel vid hämtning av produkter:", error);
    }
}

/**
 * SKICKA BETYG: Sparar användarens betyg i databasen.
 */
async function sendRating(productId, score) {
    try {
        const response = await fetch(`${RATINGS_URL}/${productId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ score: score })
        });

        if (response.ok) {
            alert("Tack för ditt betyg!");
            getProducts(); // Ladda om för att se uppdaterat snitt och antal direkt
        }
    } catch (error) {
        console.error("Fel vid röstning:", error);
    }
}

/**
 * VARUKORG: Hanterar antal (+/-).
 */
async function changeQuantity(productId, amount) {
    try {
        await fetch(`${CART_URL}/add`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                user_id: USER_ID, 
                product_id: productId, 
                amount: amount 
            })
        });
        updateCartCount(); 
    } catch (error) {
        console.error("Fel i varukorg:", error);
    }
}

/**
 * UPPDATERA VARUKORG: Visar totalsumma och varulista.
 */
async function updateCartCount() {
    const countElement = document.getElementById('cart-count');
    const itemsList = document.getElementById('cart-items-list');
    const totalDisplay = document.getElementById('total-price-display');

    if (!countElement) return;

    try {
        const response = await fetch(`${CART_URL}/${USER_ID}`);
        const cart = await response.json();

        if (cart && cart.products && cart.products.length > 0) {
            const totalQty = cart.products.reduce((sum, p) => sum + p.cart_row.amount, 0);
            countElement.innerText = totalQty;

            if (itemsList && totalDisplay) {
                let totalPrice = 0;
                itemsList.innerHTML = ""; 

                cart.products.forEach(p => {
                    const itemTotal = p.price * p.cart_row.amount;
                    totalPrice += itemTotal;

                    const div = document.createElement('div');
                    div.className = 'cart-summary-item';
                    div.innerHTML = `
                        <span><strong>${p.title}</strong> (${p.cart_row.amount} st)</span>
                        <span>${itemTotal.toFixed(2)} kr</span>
                    `;
                    itemsList.appendChild(div);
                });
                totalDisplay.innerText = totalPrice.toFixed(2);
            }
        } else {
            countElement.innerText = "0";
            if (itemsList) itemsList.innerHTML = "<p>Varukorgen är tom.</p>";
            if (totalDisplay) totalDisplay.innerText = "0.00";
        }
    } catch (error) {
        countElement.innerText = "0";
    }
}

/**
 * TÖM OCH BETALA: Hanterar radering och checkout.
 */
async function emptyCart() {
    if (confirm("Vill du tömma varukorgen?")) {
        await fetch(`${CART_URL}/clear/${USER_ID}`, { method: 'DELETE' });
        updateCartCount();
    }
}

async function checkout() {
    if (confirm("Vill du slutföra köpet?")) {
        const response = await fetch(`${CART_URL}/checkout/${USER_ID}`, { method: 'PUT' });
        if (response.ok) {
            alert("Köp genomfört!");
            updateCartCount();
        }
    }
}

/**
 * ADMIN: Skapa ny produkt (Körs på admin.html).
 */
const productForm = document.getElementById('product-form');
if (productForm) {
    productForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const newProduct = {
            title: document.getElementById('title').value,
            description: document.getElementById('description').value,
            price: document.getElementById('price').value,
            image_url: document.getElementById('image_url').value
        };

        try {
            const response = await fetch(PRODUCTS_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newProduct)
            });

            if (response.ok) {
                alert("Produkten har sparats i databasen!");
                productForm.reset();
            }
        } catch (error) {
            console.error("Kunde inte spara produkt:", error);
        }
    });
}

// Starta funktionerna vid laddning
getProducts();
updateCartCount();