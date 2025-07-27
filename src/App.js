import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import SiteLayout from './components/SiteLayout';
import Home from './pages/Home';
import Solutions from './pages/Solutions';
import Fonctionnalites from './pages/Fonctionnalites';
import PourQui from './pages/PourQui';
import Tarifs from './pages/Tarifs';
import DevenirRelais from './pages/DevenirRelais';
import Partenaires from './pages/Partenaires';
import APropos from './pages/APropos';
import Support from './pages/Support';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <SiteLayout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/solutions" element={<Solutions />} />
            <Route path="/fonctionnalites" element={<Fonctionnalites />} />
            <Route path="/pour-qui" element={<PourQui />} />
            <Route path="/tarifs" element={<Tarifs />} />
            <Route path="/devenir-relais" element={<DevenirRelais />} />
            <Route path="/partenaires" element={<Partenaires />} />
            <Route path="/a-propos" element={<APropos />} />
            <Route path="/support" element={<Support />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </SiteLayout>
      </Router>
    </ThemeProvider>
  );
}

export default App;
