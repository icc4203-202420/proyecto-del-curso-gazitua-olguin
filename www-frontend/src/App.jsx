import { useState } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css'
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import SearchIcon from '@mui/icons-material/Search';
import Home from './components/Home';
import Beers from './components/Beers';
import Bars from './components/Bars';
import Events from './components/Events';
import SearchUser from './components/SearchUser';
import axios from 'axios';
//import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/beers" element={<Beers />} />
        <Route path="/bars" element={<Bars />} />
        <Route path="/bars/:id/events" element={<Events />} />
        <Route path="/search-users" element={<SearchUser />} />
      </Routes>
    </Router>
  )
}

export default App
