import { useState, useEffect } from 'react';
import { 
  Box, Typography, Button, Card, IconButton, 
  Dialog, DialogTitle, DialogContent, TextField 
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';

function AdminPanel() {
  const [products, setProducts] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  // State för formuläret
  const [formData, setFormData] = useState({ id: null, title: '', description: '', price: '', image_url: '' });

  // Hämta produkterna när panelen laddas
  const fetchProducts = () => {
    fetch('http://localhost:5000/products')
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.error("Kunde inte hämta produkter", err));
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleOpenNew = () => {
    setFormData({ id: null, title: '', description: '', price: '', image_url: '/images/nybild.jpg' });
    setIsEditing(false);
    setOpenModal(true);
  };

  const handleOpenEdit = (product) => {
    setFormData(product);
    setIsEditing(true);
    setOpenModal(true);
  };

  const handleDelete = (id) => {
    if(window.confirm("Är du säker på att du vill radera denna materiel?")) {
      fetch(`http://localhost:5000/products/${id}`, { method: 'DELETE' })
        .then(() => fetchProducts()) // Uppdatera listan
        .catch(err => console.error(err));
    }
  };

  const handleSave = () => {
    const method = isEditing ? 'PUT' : 'POST';
    const url = isEditing 
      ? `http://localhost:5000/products/${formData.id}` 
      : 'http://localhost:5000/products';

    fetch(url, {
      method: method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    })
    .then(res => res.json())
    .then(() => {
      setOpenModal(false);
      fetchProducts(); // Uppdatera listan
    })
    .catch(err => console.error("Kunde inte spara", err));
  };

  return (
    <Box sx={{ p: 4, color: '#f2e8cf', bgcolor: 'rgba(13, 17, 9, 0.9)', minHeight: '100vh' }}>
      <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 4, color: '#a7bc89', borderBottom: '2px solid #4b5320', pb: 1 }}>
        COMMAND CENTER (ADMIN)
      </Typography>

      <Button 
        variant="contained" 
        startIcon={<AddIcon />} 
        onClick={handleOpenNew}
        sx={{ bgcolor: '#ff4400', mb: 3, fontWeight: 'bold', '&:hover': { bgcolor: '#e63d00' } }}
      >
        REGISTRERA NY MATERIEL
      </Button>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {products.map(product => (
          <Card key={product.id} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, bgcolor: '#1b2613', border: '1px solid #4b5320', color: '#f2e8cf' }}>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{product.title}</Typography>
              <Typography sx={{ color: '#a7bc89' }}>{product.price.toLocaleString('sv-SE')} kr</Typography>
            </Box>
            <Box>
              <IconButton onClick={() => handleOpenEdit(product)} sx={{ color: '#a7bc89' }}><EditIcon /></IconButton>
              <IconButton onClick={() => handleDelete(product.id)} sx={{ color: '#ff4400' }}><DeleteIcon /></IconButton>
            </Box>
          </Card>
        ))}
      </Box>

      {/* MODAL FÖR ATT LÄGGA TILL / REDIGERA */}
      <Dialog open={openModal} onClose={() => setOpenModal(false)} PaperProps={{ sx: { bgcolor: '#0d1109', color: '#f2e8cf', border: '1px solid #4b5320', minWidth: '400px' } }}>
        <DialogTitle sx={{ fontWeight: 'bold', color: '#a7bc89', borderBottom: '1px solid #4b5320' }}>
          {isEditing ? 'UPPDATERA MATERIEL' : 'NY MATERIEL'}
        </DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
          <TextField 
            label="Titel" variant="filled" fullWidth
            value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})}
            sx={{ bgcolor: 'rgba(255,255,255,0.05)', '& .MuiInputBase-root': { color: 'white' }, '& .MuiFormLabel-root': { color: '#a7bc89' } }}
          />
          <TextField 
            label="Beskrivning" variant="filled" fullWidth multiline rows={3}
            value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}
            sx={{ bgcolor: 'rgba(255,255,255,0.05)', '& .MuiInputBase-root': { color: 'white' }, '& .MuiFormLabel-root': { color: '#a7bc89' } }}
          />
          <TextField 
            label="Pris (kr)" variant="filled" fullWidth type="number"
            value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})}
            sx={{ bgcolor: 'rgba(255,255,255,0.05)', '& .MuiInputBase-root': { color: 'white' }, '& .MuiFormLabel-root': { color: '#a7bc89' } }}
          />
          <TextField 
            label="Bildlänk (t.ex. /images/tank.jpg)" variant="filled" fullWidth
            value={formData.image_url} onChange={e => setFormData({...formData, image_url: e.target.value})}
            sx={{ bgcolor: 'rgba(255,255,255,0.05)', '& .MuiInputBase-root': { color: 'white' }, '& .MuiFormLabel-root': { color: '#a7bc89' } }}
          />
          <Button variant="contained" onClick={handleSave} sx={{ bgcolor: '#4b5320', mt: 2, fontWeight: 'bold' }}>
            SPARA I DATABASEN
          </Button>
        </DialogContent>
      </Dialog>
    </Box>
  );
}

export default AdminPanel;