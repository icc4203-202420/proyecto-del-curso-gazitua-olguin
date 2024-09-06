import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Container, List, ListItem, ListItemText, Typography } from '@mui/material';

const BarEvents = () => {
  const { id } = useParams();            
  const [events, setEvents] = useState([]);  
  const [loading, setLoading] = useState(true);  
  const [error, setError] = useState(null);  

  useEffect(() => {
    axios.get(`/api/v1/bar/${id}/events`)
      .then(response => {
        setEvents(response.data);  
        setLoading(false);         
      })
      .catch(err => {
        setError('Error fetching events');
        setLoading(false);
        console.error('Error fetching events:', err);
      });
  }, [id]);  

  if (error) {
    return <Typography variant="h6" color="error">{error}</Typography>;
  }

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Eventos del Bar</Typography>

      {loading ? (
        <Typography variant="h6">Cargando eventos...</Typography>
      ) : (
        <List>
          {events.length > 0 ? (
            events.map(event => (
              <ListItem key={event.id}>
                <ListItemText 
                  primary={event.name} 
                  secondary={`Fecha: ${event.date} - Hora: ${event.time}`} 
                />
              </ListItem>
            ))
          ) : (
            <Typography variant="h6">No se encontraron eventos para este bar</Typography>
          )}
        </List>
      )}
    </Container>
  );
};

export default BarEvents;
