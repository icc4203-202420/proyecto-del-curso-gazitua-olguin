import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Container, Box, Typography } from '@mui/material';

const Home = () => {
  return (
    <Container maxWidth="md">
      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Bienvenido a BeerApp
        </Typography>
        <Typography variant="h6" component="p" gutterBottom>
          Explora las mejores cervezas y bares cercanos. Participa en eventos y busca usuarios.
        </Typography>

        {/* Botones para la navegación */}
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

        <Box sx={{ mt: 2 }}>
          <Button
            component={Link}
            to="/search-users"
            variant="outlined"
            color="primary"
          >
            Buscar Usuario
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default Home;

