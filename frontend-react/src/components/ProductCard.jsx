import { useState } from 'react';
import { 
  Card, CardContent, CardMedia, Typography, Rating, 
  Button, Box, IconButton, Dialog, DialogTitle, 
  DialogContent, List, ListItem, ListItemText, Divider, TextField 
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import CommentIcon from '@mui/icons-material/Comment';

function ProductCard({ product, onAddToCart }) {
  // State-hantering för antal i kundvagn samt recensions-fönstret
  const [quantity, setQuantity] = useState(1);
  const [openComments, setOpenComments] = useState(false);
  
  // State-hantering för formuläret när en användare skapar en ny recension
  const [userName, setUserName] = useState(""); 
  const [userRating, setUserRating] = useState(5);
  const [userComment, setUserComment] = useState("");

  // Funktion för att öka/minska antal i varukorgen (kan inte understiga 1)
  const adjustQty = (val) => {
    if (quantity + val >= 1) setQuantity(quantity + val);
  };

  // Funktion för att skicka recension till backend (POST)
  const handleReviewSubmit = () => {
    const finalComment = userName.trim() !== "" 
      ? `[${userName}] rapporterar: ${userComment}` 
      : userComment || "Ingen kommentar angiven.";

    const safeRating = userRating || 5;

    fetch('http://localhost:5000/ratings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        productId: product.id, 
        rating: safeRating,
        score: safeRating,
        comment: finalComment, 
        userId: 1 // Hårdkodat ID då inloggning ej är ett krav
      })
    })
    .then(res => res.json())
    .then(data => {
      if (data.error) {
        alert("Ett fel uppstod: " + data.error);
        return;
      }
      alert("Fältrapport skickad!");
      setUserName("");     
      setUserComment("");  
      setOpenComments(false);
      window.location.reload(); 
    })
    .catch(err => console.error("Kunde inte skicka recension:", err));
  };

  const reviewCount = product.Ratings ? product.Ratings.length : 0;

  return (
    <>
      <Card sx={{ 
        maxWidth: 320, 
        m: 2, 
        bgcolor: 'rgba(13, 17, 9, 0.85)', 
        backdropFilter: 'blur(8px)', 
        color: '#f2e8cf', 
        border: '1px solid #4b5320', 
        boxShadow: '0 12px 30px rgba(0,0,0,0.8)',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: '0 20px 40px rgba(0,0,0,0.95)',
          border: '1px solid #a7bc89'
        }
      }}>
        <CardMedia 
          component="img" 
          height="180" 
          image={product.image_url || 'https://via.placeholder.com/400x200?text=MATERIEL+SAKNAS'} 
          alt={product.title} 
        />
        <CardContent>
          <Typography variant="h5" sx={{ fontWeight: 'bold', textTransform: 'uppercase' }}>
            {product.title}
          </Typography>
          
          {/* NYTT: Beskrivningen av produkten visas här! */}
          <Typography variant="body2" sx={{ color: '#a7bc89', mt: 1, mb: 1, fontStyle: 'italic', minHeight: '40px' }}>
            {product.description || "Ingen information tillgänglig."}
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', my: 1 }}>
            <Rating value={product.averageRating || 0} precision={0.5} readOnly size="small" sx={{ color: '#ff4400' }} />
            
            <Button 
              size="small" 
              startIcon={<CommentIcon />}
              onClick={() => setOpenComments(true)}
              sx={{ ml: 1, color: '#a7bc89', fontSize: '0.7rem', textTransform: 'none' }}
            >
              {reviewCount} Utlåtanden
            </Button>
          </Box>

          {/* Formaterar priset med svenska mellanrum */}
          <Typography variant="h5" sx={{ color: '#ff4400', fontWeight: 'bold', mb: 2 }}>
            {product.price ? product.price.toLocaleString('sv-SE') : 0} kr
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2, bgcolor: 'rgba(0,0,0,0.6)', p: 0.5, borderRadius: 1, border: '1px solid #4b5320' }}>
            <IconButton onClick={() => adjustQty(-1)} sx={{ color: '#f2e8cf' }}><RemoveIcon /></IconButton>
            <Typography sx={{ fontWeight: 'bold', fontSize: '1.2rem' }}>{quantity}</Typography>
            <IconButton onClick={() => adjustQty(1)} sx={{ color: '#f2e8cf' }}><AddIcon /></IconButton>
          </Box>

          <Button variant="contained" fullWidth onClick={() => onAddToCart(product, quantity)} sx={{ bgcolor: '#4b5320', fontWeight: 'bold', '&:hover': { bgcolor: '#5c6628' } }}>
            LÄGG TILL I ORDER
          </Button>
        </CardContent>
      </Card>

      {/* MODAL FÖR RECENSIONER / FÄLTRAPPORTER */}
      <Dialog open={openComments} onClose={() => setOpenComments(false)} PaperProps={{ sx: { bgcolor: 'rgba(13, 17, 9, 0.95)', backdropFilter: 'blur(10px)', color: '#f2e8cf', minWidth: '350px', border: '1px solid #4b5320', boxShadow: '0 20px 50px rgba(0,0,0,0.9)' } }}>
        <DialogTitle sx={{ borderBottom: '1px solid #4b5320', fontWeight: 'bold' }}>FÄLTRAPPORTER: {product.title}</DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <List>
            {product.Ratings && product.Ratings.length > 0 ? (
              product.Ratings.map((rev, i) => (
                <ListItem key={i} alignItems="flex-start" sx={{ px: 0, borderBottom: '1px solid rgba(75, 83, 32, 0.5)' }}>
                  <ListItemText 
                    primary={
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography sx={{ fontWeight: 'bold', color: '#a7bc89' }}>
                          {rev.User?.username || 'Soldat / Verifierad'}
                        </Typography>
                        <Rating value={rev.score || rev.rating} size="small" readOnly sx={{ color: '#ff4400' }} />
                      </Box>
                    }
                    secondary={<Typography sx={{ color: '#f2e8cf', fontStyle: 'italic', mt: 0.5 }}>"{rev.comment}"</Typography>}
                  />
                </ListItem>
              ))
            ) : (
              <Typography sx={{ py: 2, fontStyle: 'italic', color: '#a7bc89' }}>Inga rapporter inkomna.</Typography>
            )}
          </List>
          <Divider sx={{ bgcolor: '#4b5320', my: 3 }} />
          <Typography variant="h6" sx={{ mb: 2, color: '#a7bc89', fontWeight: 'bold' }}>LÄMNA EN FÄLTRAPPORT</Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography>Betyg:</Typography>
              <Rating value={userRating} onChange={(e, n) => setUserRating(n)} sx={{ color: '#ff4400' }} />
            </Box>
            <TextField label="Ditt Namn / Rang" fullWidth variant="filled" value={userName} onChange={(e) => setUserName(e.target.value)} sx={{ bgcolor: 'rgba(0,0,0,0.5)', '& .MuiInputBase-root': { color: 'white' }, '& .MuiFormLabel-root': { color: '#a7bc89' } }} />
            <TextField label="Din kommentar" multiline rows={3} fullWidth variant="filled" value={userComment} onChange={(e) => setUserComment(e.target.value)} sx={{ bgcolor: 'rgba(0,0,0,0.5)', '& .MuiInputBase-root': { color: 'white' }, '& .MuiFormLabel-root': { color: '#a7bc89' } }} />
            <Button variant="contained" onClick={handleReviewSubmit} sx={{ bgcolor: '#ff4400', fontWeight: 'bold', '&:hover': { bgcolor: '#e63d00' } }}>SKICKA RAPPORT</Button>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default ProductCard;