import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Beers from './components/Beers';
import Bars from './components/Bars';
import Events from './components/Events';
import SearchUser from './components/SearchUser';

const theme = createTheme();

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/beers" element={<Beers />} />
          <Route path="/bars" element={<Bars />} />
          <Route path="/bars/:id/events" element={<Events />} />
          <Route path="/search-users" element={<SearchUser />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;