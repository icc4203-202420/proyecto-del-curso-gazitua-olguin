import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Container, Typography, List, ListItem, ListItemText } from '@mui/material';

function Events() {
  const [events, setEvents] = useState([]);
  const { barId } = useParams();

  useEffect(() => {
    axios.get(`/api/v1/bars/${barId}/events`)
      .then(response => setEvents(response.data.events))
      .catch(error => console.error('Error fetching events:', error));
  }, [barId]);

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

<<<<<<< HEAD
export default Events;
=======
export default Events;
>>>>>>> fa00f38a0d4ea81f3a09ea46e2811f1767a47218
