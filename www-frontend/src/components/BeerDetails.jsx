import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Typography, Card, CardContent, CardMedia, List, ListItem, ListItemText, Divider } from '@mui/material';
import axios from 'axios';
import Review from './Review';

function BeerDetails() {
  const [beer, setBeer] = useState(null);
  const [error, setError] = useState(null);

  const { id } = useParams();

  useEffect(() => {
    const fetchBeerDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/api/v1/beers/${id}`);
        setBeer(response.data.beer); // Asumiendo que la respuesta tiene una propiedad 'beer'
      } catch (err) {
        console.error('Error fetching beer details:', err);
        setError('Error al cargar los detalles de la cerveza');
      }
    };

    fetchBeerDetails();
  }, [id]);

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  if (!beer) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Container>
      <Card sx={{ mt: 4 }}>
        {beer.image_url && (
          <CardMedia
            component="img"
            height="300"
            image={beer.image_url}
            alt={beer.name}
          />
        )}
        <CardContent>
          <Typography variant="h4" gutterBottom>{beer.name}</Typography>
          <Typography variant="h6" color="textSecondary" gutterBottom>{beer.style}</Typography>
          
          <Typography variant="h6" gutterBottom>Detalles:</Typography>
          <List>
            <ListItem>
              <ListItemText primary="Tipo" secondary={beer.beer_type} />
            </ListItem>
            <ListItem>
              <ListItemText primary="Alcohol" secondary={`${beer.alcohol}%`} />
            </ListItem>
            <ListItem>
              <ListItemText primary="IBU" secondary={beer.ibu} />
            </ListItem>
            <ListItem>
              <ListItemText primary="Lúpulo" secondary={beer.hop} />
            </ListItem>
            <ListItem>
              <ListItemText primary="Levadura" secondary={beer.yeast} />
            </ListItem>
            <ListItem>
              <ListItemText primary="Maltas" secondary={beer.malts} />
            </ListItem>
          </List>

          <Divider sx={{ my: 2 }} />

          <Typography variant="h6" gutterBottom>Marca:</Typography>
          <Typography>{beer.brand?.name || 'No disponible'}</Typography>

          <Divider sx={{ my: 2 }} />

          <Typography variant="h6" gutterBottom>Cervecería:</Typography>
          <Typography>{beer.brewery?.name || 'No disponible'}</Typography>

          <Divider sx={{ my: 2 }} />

          <Typography variant="h6" gutterBottom>Rating promedio:</Typography>
          <Typography>{beer.avg_rating ? `${beer.avg_rating}/5` : 'No disponible'}</Typography>

          <Divider sx={{ my: 2 }} />

          <Typography variant="h6" gutterBottom>Bares que la sirven:</Typography>
          <List>
            {beer.bars?.map(bar => (
              <ListItem key={bar.id}>
                <ListItemText 
                  primary={bar.name} 
                  secondary={`${bar.address?.line1}, ${bar.address?.line2}, ${bar.address?.city}`} 
                />
              </ListItem>
            )) || <ListItem><ListItemText primary="No hay información disponible" /></ListItem>}
          </List>
        </CardContent>
      </Card>
      <Review />
    </Container>
  );
}

export default BeerDetails;