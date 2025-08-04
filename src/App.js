import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import SiteLayout from './components/SiteLayout';
import Home from './pages/Home';
import Expedier from './pages/Expedier';
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
    <AuthProvider>
      <ThemeProvider>
        <Router>
          <SiteLayout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/expedier" element={<Expedier />} />
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
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: '#10B981',
                secondary: '#fff',
              },
            },
            error: {
              duration: 4000,
              iconTheme: {
                primary: '#EF4444',
                secondary: '#fff',
              },
            },
          }}
        />
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
