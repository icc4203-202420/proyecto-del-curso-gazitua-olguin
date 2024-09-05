import React from 'react';
import { Container, Typography, Box, Button } from '@mui/material';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <Container maxWidth="md">
      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Bienvenido a BeerApp
        </Typography>
        <Typography variant="h6" component="p" gutterBottom>
          Explora las mejores cervezas y bares cercanos. Participa en eventos y haz nuevas amistades.
        </Typography>
        
        <Box sx={{ mt: 4 }}>
          <Button
            component={Link}
            to="/beers"
            variant="contained"
            color="primary"
            sx={{ mr: 2 }}
          >
            Ver Cervezas
          </Button>
          <Button
            component={Link}
            to="/bars"
            variant="contained"
            color="secondary"
          >
            Ver Bares
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default Home;
