import React, { useState } from 'react';
import { Container, TextField, Button, Typography } from '@mui/material';

const SearchUser = () => {
  const [handle, setHandle] = useState('');  
  const [submittedHandle, setSubmittedHandle] = useState('');  

  const handleSearch = () => {
    setSubmittedHandle(handle);  
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Buscar Usuario por Handle</Typography>

      <TextField
        label="Ingresar Handle"
        variant="outlined"
        fullWidth
        value={handle}
        onChange={(e) => setHandle(e.target.value)}  
        style={{ marginBottom: '20px' }}
      />

      <Button 
        variant="contained" 
        color="primary" 
        onClick={handleSearch} 
        disabled={!handle}  
      >
        Buscar
      </Button>

      {submittedHandle && (
        <Typography variant="h6" style={{ marginTop: '20px' }}>
          Resultado de búsqueda: {submittedHandle}
        </Typography>
      )}
    </Container>
  );
};

export default SearchUser;
