import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Typography, CircularProgress, Divider } from '@mui/material';
import api from '../api';

function EventInfo() {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const response = await api.get(`/events/${eventId}`);
        setEvent(response.data.event);
      } catch (err) {
        console.error('Error fetching event details:', err);
        setError('Error al cargar los detalles del evento');
      }
    };

    fetchEventDetails();
  }, [eventId]);

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  if (!event) {
    return (
      <Container>
        <CircularProgress sx={{ display: 'block', margin: '20px auto' }} />
        <Typography>Cargando los detalles del evento...</Typography>
      </Container>
    );
  }

  return (
    <Container>
      <Typography variant="h4" gutterBottom>{event.name}</Typography>
      <Typography variant="h6" color="textSecondary">
        {new Date(event.date).toLocaleString()}
      </Typography>
      <Divider sx={{ my: 2 }} />
      <Typography variant="body1">{event.description}</Typography>
    </Container>
  );
}

export default EventInfo;
