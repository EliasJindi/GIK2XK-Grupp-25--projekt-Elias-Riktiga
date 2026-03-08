import React from 'react';
import { Drawer, Box, Typography, Button, Divider, List, ListItem } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

function CartDrawer({ open, onClose, cartItems, onClearCart, onCheckout }) {
  // Beräkna totalsumman
  const total = cartItems ? cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0) : 0;

  return (
    <Drawer 
      anchor="right" 
      open={open} 
      onClose={onClose}
      PaperProps={{
        sx: { width: 350, bgcolor: '#0d1109', color: '#f2e8cf', p: 3, borderLeft: '1px solid #4b5320' }
      }}
    >
      <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1, color: '#f2e8cf' }}>
        AKTUELL ORDER
      </Typography>
      <Divider sx={{ bgcolor: '#4b5320', mb: 3 }} />

      <List sx={{ flexGrow: 1, overflowY: 'auto' }}>
        {cartItems && cartItems.length > 0 ? (
          cartItems.map((item, index) => (
            <ListItem key={index} sx={{ px: 0, flexDirection: 'column', alignItems: 'flex-start', mb: 2 }}>
              <Typography sx={{ color: '#a7bc89', fontWeight: 'bold' }}>
                {item.title} (x{item.quantity})
              </Typography>
              <Typography sx={{ color: '#a7bc89', fontSize: '0.9rem' }}>
                {/* MELLANRUM FÖR PRODUKTER I KUNDVAGNEN */}
                {item.price.toLocaleString('sv-SE')} kr
              </Typography>
            </ListItem>
          ))
        ) : (
          <Typography sx={{ color: '#4b5320', fontStyle: 'italic', mt: 2 }}>
            Ingen materiel vald.
          </Typography>
        )}
      </List>

      <Box sx={{ mt: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3, color: '#f2e8cf' }}>
          {/* MELLANRUM FÖR TOTALSUMMAN */}
          TOTALT: {total.toLocaleString('sv-SE')} kr
        </Typography>
        
        <Button 
          variant="outlined" 
          fullWidth 
          startIcon={<DeleteIcon />}
          onClick={onClearCart}
          disabled={cartItems.length === 0}
          sx={{ 
            mb: 2, 
            borderColor: '#ff4400', 
            color: '#ff4400', 
            '&:hover': { bgcolor: 'rgba(255, 68, 0, 0.1)', borderColor: '#ff4400' },
            '&.Mui-disabled': { borderColor: '#4b5320', color: '#4b5320' }
          }}
        >
          TÖM ORDER
        </Button>
        
        <Button 
          variant="contained" 
          fullWidth 
          onClick={onCheckout}
          disabled={cartItems.length === 0}
          sx={{ 
            bgcolor: '#4b5320', 
            fontWeight: 'bold', 
            color: '#f2e8cf', 
            '&:hover': { bgcolor: '#5c6628' },
            '&.Mui-disabled': { bgcolor: '#1b2613', color: '#4b5320' }
          }}
        >
          SLUTFÖR BESTÄLLNING
        </Button>
      </Box>
    </Drawer>
  );
}

export default CartDrawer;