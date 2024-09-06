import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, TextField, List, ListItem, ListItemText, Typography } from '@mui/material';

const Beers = () => {
  const [beers, setBeers] = useState([]);       
  const [search, setSearch] = useState('');     
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null);     

  useEffect(() => {
    axios.get('/api/v1/beers')
      .then(response => {
        setBeers(response.data);  
        setLoading(false);        
      })
      .catch(err => {
        setError('Error fetching beers');
        setLoading(false);
        console.error('Error fetching beers:', err);
      });
  }, []);  

  const filteredBeers = beers.filter(beer =>
    beer.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleSearch = (event) => {
    setSearch(event.target.value);
  };

  if (error) {
    return <Typography variant="h6" color="error">{error}</Typography>;
  }

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Listado de Cervezas</Typography>

      <TextField
        label="Buscar Cervezas"
        variant="outlined"
        fullWidth
        onChange={handleSearch}
        value={search}
        style={{ marginBottom: '20px' }}
      />

      {loading ? (
        <Typography variant="h6">Cargando cervezas...</Typography>
      ) : (
        <List>
          {filteredBeers.length > 0 ? (
            filteredBeers.map(beer => (
              <ListItem key={beer.id}>
                <ListItemText primary={beer.name} secondary={beer.description} />
              </ListItem>
            ))
          ) : (
            <Typography variant="h6">No se encontraron cervezas</Typography>
          )}
        </List>
      )}
    </Container>
  );
};

export default Beers;
