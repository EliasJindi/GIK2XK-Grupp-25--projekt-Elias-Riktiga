import { useState, useEffect } from 'react';
import { 
  Container, Grid, Typography, Box, AppBar, Toolbar, 
  IconButton, Badge, ThemeProvider, createTheme, CssBaseline, Button 
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ProductCard from './components/ProductCard';
import CartDrawer from './components/CartDrawer';
import AdminPanel from './components/AdminPanel'; // Importerad AdminPanel

const militaryTheme = createTheme({
  palette: { mode: 'dark', primary: { main: '#4b5320' }, background: { default: '#0d1109' } },
});

function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false); // State för att visa admin

  // Hämtar produkter
  useEffect(() => {
    fetch('http://localhost:5000/products')
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.error("Fel vid hämtning:", err));
  }, [showAdmin]); // Uppdaterar listan ifall du lagt till/tagit bort något i admin!

  const addToCart = (product, quantity) => {
    setCart([...cart, { ...product, quantity }]);
    setIsCartOpen(true); 
  };

  const clearCart = () => setCart([]);

  // NY FUNKTION: Vad som händer när kunden slutför köpet
  const handleCheckout = () => {
    alert("ORDER BEKRÄFTAD!\n\nTack för ditt köp. Materielen levereras via C-17 Globemaster till angivna koordinater inom 24 timmar.");
    clearCart(); // Tömmer korgen efter köp
    setIsCartOpen(false); // Stänger sidofönstret
  };

  return (
    <ThemeProvider theme={militaryTheme}>
      <CssBaseline />
      <AppBar position="sticky" sx={{ bgcolor: '#0b1306', borderBottom: '2px solid #4b5320' }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            ELIAS MILITARY COMMAND
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            
            {/* ADMIN-KNAPP MED LÖSENORD */}
            <Button 
              onClick={() => {
                if (showAdmin) {
                  setShowAdmin(false); // Gå tillbaka till butiken utan lösenord
                } else {
                  // Promtar efter lösenord när man vill in i admin
                  const password = window.prompt("BEHÖRIGHET KRÄVS: Ange lösenord för Command Center");
                  if (password === "elias123") { // Ditt lösenord
                    setShowAdmin(true);
                  } else if (password !== null) { // Om de inte tryckte "Avbryt"
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

      {/* HÄR ÄR UPPDATERINGEN FÖR CARTDRAWER */}
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