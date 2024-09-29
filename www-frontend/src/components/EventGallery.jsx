import { useState, useEffect } from 'react';
import { ImageList, ImageListItem, Container, Typography } from '@mui/material';
import api from '../api';

function EventGallery({ eventId }) {
  const [images, setImages] = useState([]);

  useEffect(() => {
    const fetchEventPictures = async () => {
      try {
        const response = await api.get(`/api/v1/events/${eventId}/pictures`);
        setImages(response.data.pictures);
      } catch (error) {
        console.error('Error fetching event pictures:', error);
      }
    };

    fetchEventPictures();
  }, [eventId]);

  if (images.length === 0) {
    return (
      <Container>
        <Typography>No hay imágenes disponibles para este evento.</Typography>
      </Container>
    );
  }

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Galería del Evento</Typography>
      <ImageList sx={{ width: '100%', height: 'auto' }} cols={3} rowHeight={200}>
        {images.map((image) => (
          <ImageListItem key={image.id}>
            <img
              src={`${image.url}?w=200&h=200&fit=crop&auto=format`}
              srcSet={`${image.url}?w=200&h=200&fit=crop&auto=format&dpr=2 2x`}
              alt={`Evento Imagen ${image.id}`}
              loading="lazy"
            />
          </ImageListItem>
        ))}
      </ImageList>
    </Container>
  );
}

export default EventGallery;
