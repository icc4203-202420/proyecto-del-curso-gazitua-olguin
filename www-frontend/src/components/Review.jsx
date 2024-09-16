import { useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Container, TextField, Button, Typography, Box } from '@mui/material';

function Review() {
  const { beerId } = useParams();
  const [rating, setRating] = useState('');
  const [text, setText] = useState('');
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (rating < 1 || rating > 5) {
      setError('El rating debe estar entre 1 y 5.');
      return;
    }

    if (text.split(' ').length < 15) {
      setError('La evaluación debe tener al menos 15 palabras.');
      return;
    }

    try {
      const response = await axios.post(`/api/v1/beers/${beerId}/reviews`, {
        review: { rating, text }
      });
      setSuccessMessage('Evaluación enviada correctamente.');
      setRating('');
      setText('');
    } catch (error) {
      setError(error.response?.data?.errors || 'Error al enviar la evaluación');
    }
  };

  return (
    <Container>
      <Typography variant="h5" gutterBottom>Añadir Evaluación</Typography>
      {error && <Typography color="error">{error}</Typography>}
      {successMessage && <Typography color="primary">{successMessage}</Typography>}
      <form onSubmit={handleSubmit}>
        <TextField
          label="Rating"
          type="number"
          value={rating}
          onChange={(e) => setRating(e.target.value)}
          inputProps={{ min: 1, max: 5, step: 0.1 }}
          fullWidth
          required
          margin="normal"
        />
        <TextField
          label="Texto de la Evaluación"
          value={text}
          onChange={(e) => setText(e.target.value)}
          multiline
          rows={4}
          fullWidth
          required
          margin="normal"
        />
        <Box mt={2}>
          <Button variant="contained" color="primary" type="submit">
            Enviar
          </Button>
        </Box>
      </form>
    </Container>
  );
}

export default Review;
