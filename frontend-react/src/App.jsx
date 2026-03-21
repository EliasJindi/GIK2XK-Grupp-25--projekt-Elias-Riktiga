import { useState, useEffect } from 'react';
import { 
  Container, Grid, Typography, Box, AppBar, Toolbar, 
  IconButton, Badge, ThemeProvider, createTheme, CssBaseline, Button 
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ProductCard from './components/ProductCard';
import CartDrawer from './components/CartDrawer';
import AdminPanel from './components/AdminPanel';

// Skapar ett anpassat militärtema med Material UI
const militaryTheme = createTheme({
  palette: { mode: 'dark', primary: { main: '#4b5320' }, background: { default: '#0d1109' } },
});

function App() {
  //  STATE-HANTERING 
  const [products, setProducts] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);

  // 1. LADDAR VARUKORGEN FRÅN LOKALT MINNE VID START
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("grupp25_cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // 2. SPARAR VARUKORGEN TILL LOKALT MINNE VARJE GÅNG DEN ÄNDRAS
  useEffect(() => {
    localStorage.setItem("grupp25_cart", JSON.stringify(cart));
  }, [cart]);

  // Hämtar produkter från vår express-server
  useEffect(() => {
    fetch('http://localhost:5000/products')
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.error("Fel vid hämtning:", err));
  }, [showAdmin]);

  // Sparar varan till databasen OCH uppdaterar React state
 const addToCart = async (product, quantity) => {
    await fetch('http://localhost:5000/cart/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: 1, product_id: product.id, amount: quantity })
    }).catch(err => console.error("Kunde inte spara i korgen:", err));

    setCart([...cart, { ...product, quantity }]);
    setIsCartOpen(true);
  };

  const clearCart = () => setCart([]);

  // Vad som händer när kunden slutför köpet
  const handleCheckout = () => {
    alert("ORDER BEKRÄFTAD!\n\nTack för ditt köp. Materielen levereras via C-17 Globemaster till angivna koordinater inom 24 timmar.");
    clearCart();
    setIsCartOpen(false);
  };

  return (
    <ThemeProvider theme={militaryTheme}>
      <CssBaseline />
      <AppBar position="sticky" sx={{ bgcolor: '#0b1306', borderBottom: '2px solid #4b5320' }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            Grupp 25
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            
            {/* ADMIN-KNAPP MED LÖSENORD */}
            <Button 
              onClick={() => {
                if (showAdmin) {
                  setShowAdmin(false);
                } else {
                  const password = window.prompt("BEHÖRIGHET KRÄVS: Ange lösenord för Command Center");
                  if (password === "elias123") {
                    setShowAdmin(true);
                  } else if (password !== null) {
                    alert("ÅTKOMST NEKAD: Felaktigt lösenord.");
                  }
                }
              }} 
              sx={{ color: '#a7bc89', fontWeight: 'bold', border: '1px solid #4b5320' }}
            >
              {showAdmin ? "TILLBAKA TILL BUTIKEN" : "ADMIN PANEL"}
            </Button>

            <IconButton color="inherit" onClick={() => setIsCartOpen(true)}>
              <Badge badgeContent={cart.length} color="error">
                <ShoppingCartIcon />
              </Badge>
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* VISAR ANTINGEN ADMIN-PANELEN ELLER BUTIKEN */}
      {showAdmin ? (
        <AdminPanel />
      ) : (
        <Container sx={{ py: 6 }}>
          <Grid container spacing={4} justifyContent="center">
            {products.map(p => (
              <Grid item key={p.id}>
                <ProductCard product={p} onAddToCart={addToCart} />
              </Grid>
            ))}
          </Grid>
        </Container>
      )}

      {/* CARTDRAWER */}
      <CartDrawer 
        open={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        cartItems={cart} 
        onClearCart={clearCart} 
        onCheckout={handleCheckout} 
      />
    </ThemeProvider>
  );
}

export default App;