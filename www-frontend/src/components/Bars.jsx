import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, TextField, List, ListItem, ListItemText, Typography } from '@mui/material';

const Bars = () => {
  const [bars, setBars] = useState([]);         
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null);


  useEffect(() => {
    axios.get('/api/v1/bars')
      .then(response => {
        setBars(response.data);   
        setLoading(false);        
      })
      .catch(err => {
        setError('Error fetching bars');
        setLoading(false);
        console.error('Error fetching bars:', err);
      });
  }, []);  

  const filteredBars = bars.filter(bar =>
    bar.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleSearch = (event) => {
    setSearch(event.target.value);
  };

  if (error) {
    return <Typography variant="h6" color="error">{error}</Typography>;
  }

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Listado de Bares</Typography>

      <TextField
        label="Buscar Bares"
        variant="outlined"
        fullWidth
        onChange={handleSearch}
        value={search}
        style={{ marginBottom: '20px' }}
      />

      {loading ? (
        <Typography variant="h6">Cargando bares...</Typography>
      ) : (
        <List>
          {filteredBars.length > 0 ? (
            filteredBars.map(bar => (
              <ListItem key={bar.id}>
                <ListItemText primary={bar.name} secondary={bar.address} />
              </ListItem>
            ))
          ) : (
            <Typography variant="h6">No se encontraron bares</Typography>
          )}
        </List>
      )}
    </Container>
  );
};

export default Bars;
