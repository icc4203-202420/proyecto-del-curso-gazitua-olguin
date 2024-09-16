import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import AuthenticatedLayout from './components/AuthenticatedLayout';
import Home from './components/Home';
import Beers from './components/Beers';
import Bars from './components/Bars';
import Events from './components/Events';
import SearchUser from './components/SearchUser';
import BeerDetails from './components/BeerDetails';
import api from './api';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
  const token = localStorage.getItem('token');

  if (token) {
    api.get('/users/current', {
      headers: {
        Authorization: `Bearer ${token}` // Asegurarse de que el token se pase en los encabezados
      }
    })
      .then(() => setIsAuthenticated(true))
      .catch(() => {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
      });
  }
}, []);

  return (
    <Router>
      <Routes>
        <Route path="/signin" element={<SignIn setIsAuthenticated={setIsAuthenticated} />} />
        <Route path="/signup" element={<SignUp />} />
        <Route
          element={
            isAuthenticated ? (
              <AuthenticatedLayout setIsAuthenticated={setIsAuthenticated} />
            ) : (
              <Navigate to="/signin" replace />
            )
          }
        >
          <Route path="/" element={<Home />} />
          <Route path="/beers" element={<Beers />} />
          <Route path="/beers/:id" element={<BeerDetails />} />
          <Route path="/bars" element={<Bars />} />
          <Route path="/bars/:barId/events" element={<Events />} />
          <Route path="/search-users" element={<SearchUser />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;