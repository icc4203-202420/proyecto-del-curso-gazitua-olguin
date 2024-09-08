import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Container, Typography, List, ListItem, ListItemText } from '@mui/material';

function Events() {
  const [events, setEvents] = useState([]);
  const { id } = useParams();

  useEffect(() => {
    axios.get(`/api/v1/bars/${id}/events`)
      .then(response => setEvents(response.data.events))
      .catch(error => console.error('Error fetching events:', error));
  }, [id]);

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Events</Typography>
      <List>
        {events.map(event => (
          <ListItem key={event.id}>
            <ListItemText
              primary={event.name}
              secondary={new Date(event.date).toLocaleDateString()}
            />
          </ListItem>
        ))}
      </List>
    </Container>
  );
}

export default Events;