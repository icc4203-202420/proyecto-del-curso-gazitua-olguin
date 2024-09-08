import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Beer App
        </Typography>
        <Button color="inherit" component={Link} to="/">Home</Button>
        <Button color="inherit" component={Link} to="/beers">Beers</Button>
        <Button color="inherit" component={Link} to="/bars">Bars</Button>
        <Button color="inherit" component={Link} to="/search-users">Search Users</Button>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;