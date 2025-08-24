import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { Sun, Moon, Menu, X, MapPin, Phone, Mail, Facebook, Instagram, Twitter, Linkedin, MessageCircle, Package, Building, Rocket, Search, Box, Truck } from 'lucide-react';

const navItems = [
  { label: 'Expédier un colis', to: '/expedier',  icon: Package },
  { label: 'Devenir Point Relais', to: '/devenir-relais',  icon: Building },
  { 
    label: 'Solutions Pro', 
    to: '/solutions',
    icon: Rocket
  },
  { label: 'Fonctionnalités', to: '/fonctionnalites', hidden: true },
  { label: 'Pour qui ?', to: '/pour-qui', hidden: true },
  { label: 'Tarifs', to: '/tarifs', hidden: true },
  { label: 'Partenaires', to: '/partenaires', hidden: true },
  { label: 'À propos', to: '/a-propos', hidden: true },
  { label: 'Support & Aide', to: '/support', hidden: true },
  { label: 'Contact', to: '/contact', hidden: true },
];

export default function SiteLayout({ children }) {
  const { isDark, toggleTheme } = useTheme();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  // const [solutionsSubmenuOpen, setSolutionsSubmenuOpen] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState('');

  // Tracking modal state
  const [showTracking, setShowTracking] = useState(false);
  const [trackingNumber, setTrackingNumber] = useState('');
  const [isTrackingLoading, setIsTrackingLoading] = useState(false);
  const [trackingError, setTrackingError] = useState('');
  const [trackingResult, setTrackingResult] = useState(null);
  // Aliases pour compatibilité avec le modal collé depuis Home.js
  const showTrackingModal = showTracking;
  const setShowTrackingModal = setShowTracking;
  const relayName = (trackingResult?.relay_name 
    || trackingResult?.point_relais?.name 
    || trackingResult?.point_relais_nom 
    || (trackingResult?.pointrelais != null ? String(trackingResult?.pointrelais) : '—'));
  const carrierName = (trackingResult?.carrier_name 
    || trackingResult?.transporteur?.nom 
    || trackingResult?.transporteur_nom 
    || (trackingResult?.transporteur != null ? String(trackingResult?.transporteur) : '—'));

  const isHome = location.pathname === '/';

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    // Logique pour l'inscription à la newsletter
    console.log('Newsletter subscription:', newsletterEmail);
    setNewsletterEmail('');
  };

  // Helpers inspirés de Home.js
  const getStatusColor = (status) => {
    const s = (status || '').toString().toLowerCase();
    if (s.includes('livr')) return 'bg-green-500';
    if (s.includes('transit')) return 'bg-blue-500';
    if (s.includes('attente')) return 'bg-orange-500';
    if (s.includes('prépar')) return 'bg-yellow-500';
    if (s.includes('annul')) return 'bg-red-500';
    return 'bg-gray-400';
  };

  const extractAddressInfo = (addr) => {
    try {
      const value = typeof addr === 'string' ? JSON.parse(addr) : addr;
      if (!value || typeof value !== 'object') return { name: '—', phone: '—', email: '—', address: '—', company: '' };
      return {
        name: value.customer_name || value.name || `${value.customer_first_name || ''} ${value.customer_last_name || ''}`.trim() || '—',
        phone: value.customer_phone_number || value.phone || '—',
        email: value.customer_email || value.email || '—',
        address: value.address || `${value.street || ''} ${value.city || ''}`.trim() || '—',
        company: value.pickup_company_name || value.company || ''
      };
    } catch {
      return { name: '—', phone: '—', email: '—', address: '—', company: '' };
    }
  };

  // Submit tracking using existing API endpoint already used on Home
  const handleTrackingSubmit = async (e) => {
    e.preventDefault();
    setTrackingError('');
    setTrackingResult(null);
    if (!trackingNumber.trim()) {
      setTrackingError('Veuillez saisir un numéro de suivi');
      toast.error('Numéro de suivi invalide');
      return;
    }
    try {
      setIsTrackingLoading(true);
      // Appel direct de l'endpoint backend
      const resp = await fetch(`https://backend.katianlogistique.com/api/client/expedition/${encodeURIComponent(trackingNumber.trim())}/`, {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
        credentials: 'omit'
      });
      if (!resp.ok) {
        // toast.error('Numéro de suivi invalide');
        throw new Error('Not OK');
      }
      const data = await resp.json();
      setTrackingResult(data);
    } catch (err) {
      setTrackingError('Aucun colis trouvé avec se numero ou erreur réseau.');
      toast.error('Numéro de suivi invalide');
    } finally {
      setIsTrackingLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-dark-bg transition-colors duration-300">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/95 dark:bg-dark-bg/95 shadow-sm border-b border-gray-100 dark:border-gray-800 backdrop-blur supports-[backdrop-filter]:bg-white/90 transition-colors">
        <div className="container-ksl flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <img src="/katian-logo.png" alt="Katian" className="h-8 w-auto" />
          </Link>

          {/* Navigation Desktop */}
          <nav className="hidden lg:flex items-center space-x-4">
            {navItems.filter(item => !item.hidden).map((item) => (
              <div key={item.to} className="relative">
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                        `px-4 py-2 text-sm font-bold rounded-lg transition-colors duration-200 whitespace-nowrap flex items-center space-x-3 ${
                        isActive 
                          ? 'bg-ksl-red text-white' 
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-bg-tertiary hover:text-gray-900 dark:hover:text-white'
                      }`
                }
              >
                  <item.icon className="w-4 h-4" />
                {item.label}
              </NavLink>
              </div>
            ))}
            {!isHome && (
              <button
                onClick={() => setShowTracking(true)}
                className="px-4 py-2 text-sm font-bold rounded-lg transition-colors duration-200 whitespace-nowrap flex items-center space-x-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-bg-tertiary hover:text-gray-900 dark:hover:text-white"
              >
                <Search className="w-4 h-4" />
                Suivre un colis
              </button>
            )}
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-bg-tertiary transition-colors"
              title={isDark ? 'Passer en mode clair' : 'Passer en mode sombre'}
            >
              {isDark ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-gray-700" />}
            </button>
            
            {/* Boutons d'action */}
            <div className="hidden md:flex items-center space-x-2">
              <a 
                href="https://business.katianlogistique.com" 
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-bg-tertiary transition-colors duration-200 whitespace-nowrap min-w-[100px] text-center"
              >
                Se connecter
              </a>
              <Link 
                to="/register" 
                className="px-3 py-2 text-sm font-medium bg-ksl-red text-white rounded-lg hover:bg-ksl-red-dark transition-colors duration-200 shadow-sm whitespace-nowrap min-w-[120px] text-center"
              >
                Créer un compte
              </Link>
            </div>

            {/* Menu mobile */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-bg-tertiary transition-colors"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Menu mobile */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-dark-bg">
            <div className="container-ksl py-4 space-y-3">
              {navItems.filter(item => !item.hidden).map((item) => (
                <div key={item.to} className="relative">
                    <NavLink
                      to={item.to}
                      className={({ isActive }) =>
                      `block w-full px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200 flex items-center space-x-3 ${
                          isActive 
                            ? 'bg-ksl-red text-white' 
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-bg-tertiary'
                        }`
                      }
                      onClick={() => setMobileMenuOpen(false)}
                    >
                    <item.icon className="w-5 h-5" />
                      {item.label}
                    </NavLink>
                </div>
              ))}
              {!isHome && (
                <button
                  onClick={() => { setShowTracking(true); setMobileMenuOpen(false); }}
                  className="block w-full px-4 py-3 text-left text-sm font-medium rounded-lg transition-colors duration-200 flex items-center space-x-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-bg-tertiary"
                >
                  <Search className="w-5 h-5" />
                  Suivre un colis
                </button>
              )}
              <div className="pt-4 space-y-3">
                <a 
                  href="https://business.katianlogistique.com" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-bg-tertiary transition-colors duration-200 text-center whitespace-nowrap"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Se connecter
                </a>
                <Link 
                  to="/register" 
                  className="block w-full px-4 py-2 text-sm font-medium bg-ksl-red text-white rounded-lg hover:bg-ksl-red-dark transition-colors duration-200 text-center shadow-sm whitespace-nowrap"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Créer un compte
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Contenu */}
      <main className="flex-1">{children}</main>

      {/* Modal de suivi colis simple */}
      {showTracking && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 p-4" onClick={() => { setShowTracking(false); setTrackingResult(null); setTrackingError(''); }}>
          <div className="bg-white dark:bg-dark-bg-secondary rounded-xl shadow-xl w-full max-w-4xl p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Suivre un colis {trackingResult?.expedition_number ? `- ${trackingResult?.expedition_number}` : ''}</h3>
              <button onClick={() => { setShowTracking(false); setTrackingResult(null); setTrackingNumber(''); setTrackingError(''); }} className="p-2 rounded hover:bg-gray-100 dark:hover:bg-dark-bg-tertiary">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleTrackingSubmit} className="space-y-3">
              <input
                type="text"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                placeholder="Ex: ABC00000000123456789"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-dark-bg-secondary text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-ksl-red"
              />
              {trackingError && <div className="text-sm text-red-600">{trackingError}</div>}
              <div className="flex justify-end">
                <button type="submit" disabled={isTrackingLoading} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center gap-2">
                  {isTrackingLoading ? (
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin inline-block" />
                  ) : (
                    <Search className="w-4 h-4" />
                  )}
                  {isTrackingLoading ? 'Recherche...' : 'Suivre'}
                </button>
              </div>
            </form>
            {/* Résultat détaillé (intégré dans le même modal) */}
      {showTrackingModal && trackingResult && (
        <div className="mt-4 animate-fade-in">
          <div className="bg-white dark:bg-dark-bg-secondary rounded-xl shadow-2xl w-full max-h-[70vh] overflow-y-auto animate-slide-up">
            {/* Header */}
            <div className="flex items-center justify-between p-3 sm:p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-base sm:text-xl font-bold text-gray-900 dark:text-white">
                Suivi de Colis - {trackingResult.expedition_number}
            </h2>
              <button
                onClick={() => { setShowTrackingModal(false); setTrackingResult(null); setTrackingNumber(''); setTrackingError(''); }}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
          </div>

            {/* Content */}
            <div className="p-3 sm:p-6 space-y-4 sm:space-y-6">
              {/* Informations principales */}
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 sm:p-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                      Code de retrait
                    </p>
                    <p className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                      {trackingResult.code_retrait}
                    </p>
              </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                      Statut
                    </p>
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${getStatusColor(trackingResult.statut)}`}></div>
                      <span className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                        {trackingResult.statut}
                      </span>
        </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                      Mode d'expédition
                    </p>
                    <p className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                      {trackingResult.mode_expedition}
                </p>
              </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                      Type de service
                    </p>
                    <p className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                      {trackingResult.type_service}
                    </p>
            </div>
              <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                      Montant
                    </p>
                    <p className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                      {trackingResult.montant} FCFA
                    </p>
              </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                      Mode de paiement
                    </p>
                    <p className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                      {trackingResult.mode_paiement}
                </p>
              </div>
            </div>
              </div>

              {/* Détails des adresses */}
              <div className="hidden grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-3 flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Adresse d'expédition
              </h3>
                  <div className="space-y-2 text-sm">
                    {(() => {
                      const expediteur = extractAddressInfo(trackingResult.adresse_expediteur);
                      return (
                        <>
                          <p className="text-gray-700 dark:text-gray-300">
                            <span className="font-medium">Nom:</span> {expediteur.name}
                          </p>
                          <p className="text-gray-700 dark:text-gray-300">
                            <span className="font-medium">Téléphone:</span> {expediteur.phone}
                          </p>
                          <p className="text-gray-700 dark:text-gray-300">
                            <span className="font-medium">Email:</span> {expediteur.email}
                          </p>
                          <p className="text-gray-700 dark:text-gray-300">
                            <span className="font-medium">Adresse:</span> {expediteur.address}
                          </p>
                        </>
                      );
                    })()}
              </div>
            </div>

                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                  <h3 className="font-semibold text-green-900 dark:text-green-100 mb-3 flex items-center gap-2">
                    <Package className="w-4 h-4" />
                    Adresse de livraison
              </h3>
                  <div className="space-y-2 text-sm">
                    {(() => {
                      const destinataire = extractAddressInfo(trackingResult.adresse_destinataire);
                      return (
                        <>
                          {destinataire.company && (
                            <p className="text-gray-700 dark:text-gray-300">
                              <span className="font-medium">Entreprise:</span> {destinataire.company}
                            </p>
                          )}
                          <p className="text-gray-700 dark:text-gray-300">
                            <span className="font-medium">Contact:</span> {destinataire.name}
                          </p>
                          <p className="text-gray-700 dark:text-gray-300">
                            <span className="font-medium">Téléphone:</span> {destinataire.phone}
                          </p>
                          <p className="text-gray-700 dark:text-gray-300">
                            <span className="font-medium">Email:</span> {destinataire.email}
                          </p>
                          <p className="text-gray-700 dark:text-gray-300">
                            <span className="font-medium">Adresse:</span> {destinataire.address}
                          </p>
                        </>
                      );
                    })()}
                  </div>
              </div>
            </div>

              {/* Détails des colis */}
              <div className="hidden bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4">
                <h3 className="font-semibold text-yellow-900 dark:text-yellow-100 mb-3 flex items-center gap-2">
                  <Package className="w-4 h-4" />
                  Détails des colis
                </h3>
                <div className="space-y-3">
                  {trackingResult.infocolis.map((colis, index) => (
                    <div key={index} className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-yellow-200 dark:border-yellow-700">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-gray-900 dark:text-white">{colis.name}</h4>
                        <span className="text-xs bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 px-2 py-1 rounded">
                          {colis.category}
                        </span>
              </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs text-gray-600 dark:text-gray-400">
                        <div>Poids: {colis.weight} kg</div>
                        <div>Quantité: {colis.quantity}</div>
                        <div>Dimensions: {colis.length}x{colis.width}x{colis.height} cm</div>
                        <div>Volume: {(colis.length * colis.width * colis.height / 1000000).toFixed(2)} m³</div>
            </div>
            </div>
                  ))}
          </div>
        </div>

              {/* Schéma de suivi complet et intuitif */}
              <div className="relative">
                {/* Ligne de progression animée */}
                <div className="absolute left-6 top-0 bottom-0 w-1 bg-gradient-to-b from-green-500 via-blue-500 to-green-500 animate-pulse"></div>
                
                <div className="space-y-6">
                  {/* Étape 1: Commande créée */}
                  <div className="relative flex items-start group animate-fade-in" style={{ animationDelay: '0.1s' }}>
                    <div className="flex-shrink-0 w-12 h-12 bg-green-500 rounded-full flex items-center justify-center z-10 relative shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <Package className="w-6 h-6 text-white" />
                      <div className="absolute inset-0 bg-green-400 rounded-full animate-ping opacity-20"></div>
              </div>
                    <div className="ml-8 flex-1">
                      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border-2 border-green-200 dark:border-green-700 shadow-lg hover:shadow-xl transition-all duration-500 transform hover:-translate-y-1">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <span className="w-6 h-6 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center text-green-600 dark:text-green-400 text-sm font-bold">1</span>
                            Commande créée
              </h3>
                          <span className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full text-sm font-medium animate-pulse">
                            ✓ Terminé
                          </span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div className="space-y-2">
                            <p className="text-gray-600 dark:text-gray-300">
                              <span className="font-semibold text-gray-900 dark:text-white">Numéro:</span> {trackingResult.order_number}
                            </p>
                            <p className="text-gray-600 dark:text-gray-300">
                              <span className="font-semibold text-gray-900 dark:text-white">Date:</span> {new Date(trackingResult.date_creation).toLocaleDateString('fr-FR', { 
                                year: 'numeric', 
                                month: 'long', 
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                          </div>
              <div className="space-y-2">
                            <p className="text-gray-600 dark:text-gray-300">
                              <span className="font-semibold text-gray-900 dark:text-white">Type:</span> {trackingResult.type_colis}
                </p>
                            <p className="text-gray-600 dark:text-gray-300">
                              <span className="font-semibold text-gray-900 dark:text-white">Service:</span> {trackingResult.type_service}
                </p>
                          </div>
                        </div>
                      </div>
              </div>
            </div>

                  {/* Étape 2: Préparation */}
                  <div className="relative flex items-start group animate-fade-in" style={{ animationDelay: '0.2s' }}>
                    <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center z-10 relative shadow-lg group-hover:scale-110 transition-transform duration-300 ${
                      trackingResult.statut_colis === 'préparé' ? 'bg-yellow-500' : 'bg-gray-300'
                    }`}>
                      <Box className="w-6 h-6 text-white" />
                      {trackingResult.statut_colis === 'préparé' && (
                        <div className="absolute inset-0 bg-yellow-400 rounded-full animate-ping opacity-20"></div>
                      )}
              </div>
                    <div className="ml-8 flex-1">
                      <div className={`rounded-xl p-6 border-2 shadow-lg hover:shadow-xl transition-all duration-500 transform hover:-translate-y-1 ${
                        trackingResult.statut_colis === 'préparé' 
                          ? 'bg-white dark:bg-gray-800 border-yellow-200 dark:border-yellow-700' 
                          : 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600'
                      }`}>
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold ${
                              trackingResult.statut_colis === 'préparé' 
                                ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-400' 
                                : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                            }`}>2</span>
                            Préparation du colis
              </h3>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            trackingResult.statut_colis === 'préparé' 
                              ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 animate-pulse' 
                              : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                          }`}>
                            {trackingResult.statut_colis === 'préparé' ? '✓ Terminé' : '⏳ En attente'}
                          </span>
                        </div>
                        <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4">
                          <h4 className="font-semibold text-yellow-900 dark:text-yellow-100 mb-3">Détails des colis:</h4>
                          <div className="space-y-3">
                            {trackingResult.infocolis.map((colis, index) => (
                              <div key={index} className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-yellow-200 dark:border-yellow-700">
                                <div className="flex justify-between items-start mb-2">
                                  <h5 className="font-medium text-gray-900 dark:text-white">{colis.name}</h5>
                                  <span className="text-xs bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 px-2 py-1 rounded">
                                    {colis.category}
                                  </span>
                                </div>
                                <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 dark:text-gray-400">
                                  <div>Poids: {colis.weight} kg</div>
                                  <div>Quantité: {colis.quantity}</div>
                                  <div>Dimensions: {colis.length}×{colis.width}×{colis.height} cm</div>
                                  <div>Volume: {(colis.length * colis.width * colis.height / 1000000).toFixed(2)} m³</div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
              </div>
              </div>
          
                  {/* Étape 3: Ramassage */}
                  <div className="relative flex items-start group animate-fade-in" style={{ animationDelay: '0.3s' }}>
                    <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center z-10 relative shadow-lg group-hover:scale-110 transition-transform duration-300 ${
                      trackingResult.statut === 'en attente' ? 'bg-orange-500' : 'bg-gray-300'
                    }`}>
                      <MapPin className="w-6 h-6 text-white" />
                      {trackingResult.statut === 'en attente' && (
                        <div className="absolute inset-0 bg-orange-400 rounded-full animate-ping opacity-20"></div>
                      )}
              </div>
                    <div className="ml-8 flex-1">
                      <div className={`rounded-xl p-6 border-2 shadow-lg hover:shadow-xl transition-all duration-500 transform hover:-translate-y-1 ${
                        trackingResult.statut === 'en attente' 
                          ? 'bg-white dark:bg-gray-800 border-orange-200 dark:border-orange-700' 
                          : 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600'
                      }`}>
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold ${
                              trackingResult.statut === 'en attente' 
                                ? 'bg-orange-100 dark:bg-orange-900 text-orange-600 dark:text-orange-400' 
                                : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                            }`}>3</span>
                            Ramassage
              </h3>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            trackingResult.statut === 'en attente' 
                              ? 'bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200 animate-pulse' 
                              : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                          }`}>
                            {trackingResult.statut === 'en attente' ? '🔄 En cours' : '⏳ En attente'}
                          </span>
                        </div>
                        <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4">
                          <div className="space-y-3">
                            <div>
                              <h4 className="font-semibold text-orange-900 dark:text-orange-100 mb-2">📍 Adresse de ramassage</h4>
                              <p className="text-sm text-orange-700 dark:text-orange-300">{trackingResult.adresse_expediteur.address}</p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              <div>
                                <p className="text-xs font-medium text-orange-900 dark:text-orange-100">Contact</p>
                                <p className="text-sm text-orange-700 dark:text-orange-300">
                                  {trackingResult.adresse_expediteur.customer_first_name} {trackingResult.adresse_expediteur.customer_last_name}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs font-medium text-orange-900 dark:text-orange-100">Téléphone</p>
                                <p className="text-sm text-orange-700 dark:text-orange-300">{trackingResult.adresse_expediteur.customer_phone_number}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
              </div>
            </div>

                  {/* Étape 4: En transit */}
                  <div className="relative flex items-start group animate-fade-in" style={{ animationDelay: '0.4s' }}>
                    <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center z-10 relative shadow-lg group-hover:scale-110 transition-transform duration-300 ${
                      trackingResult.statut === 'en transit' ? 'bg-blue-500' : 'bg-gray-300'
                    }`}>
                      <Truck className="w-6 h-6 text-white" />
                      {trackingResult.statut === 'en transit' && (
                        <div className="absolute inset-0 bg-blue-400 rounded-full animate-ping opacity-20"></div>
                      )}
              </div>
                    <div className="ml-8 flex-1">
                      <div className={`rounded-xl p-6 border-2 shadow-lg hover:shadow-xl transition-all duration-500 transform hover:-translate-y-1 ${
                        trackingResult.statut === 'en transit' 
                          ? 'bg-white dark:bg-gray-800 border-blue-200 dark:border-blue-700' 
                          : 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600'
                      }`}>
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold ${
                              trackingResult.statut === 'en transit' 
                                ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400' 
                                : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                            }`}>4</span>
                            En transit
              </h3>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            trackingResult.statut === 'en transit' 
                              ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 animate-pulse' 
                              : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                          }`}>
                            {trackingResult.statut === 'en transit' ? '🚚 En cours' : '⏳ En attente'}
                          </span>
              </div>
                        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="text-center">
                              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                                {trackingResult.dataApi?.merged_est_dist_km || '--'}
            </div>
                              <div className="text-xs text-blue-700 dark:text-blue-300">km</div>
                            </div>
                            <div className="text-center">
                              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                                {trackingResult.dataApi?.merged_est_minutes || '--'}
                              </div>
                              <div className="text-xs text-blue-700 dark:text-blue-300">min</div>
                            </div>
                            <div className="text-center">
                              <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                                {trackingResult.delais_livraison || '--'}
                              </div>
                              <div className="text-xs text-blue-700 dark:text-blue-300">délai</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
              </div>
          
                  {/* Étape 5: Livraison */}
                  <div className="relative flex items-start group animate-fade-in" style={{ animationDelay: '0.5s' }}>
                    <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center z-10 relative shadow-lg group-hover:scale-110 transition-transform duration-300 ${
                      trackingResult.statut === 'livré' ? 'bg-green-500' : 'bg-gray-300'
                    }`}>
                      <Package className="w-6 h-6 text-white" />
                      {trackingResult.statut === 'livré' && (
                        <div className="absolute inset-0 bg-green-400 rounded-full animate-ping opacity-20"></div>
                      )}
                    </div>
                    <div className="ml-8 flex-1">
                      <div className={`rounded-xl p-6 border-2 shadow-lg hover:shadow-xl transition-all duration-500 transform hover:-translate-y-1 ${
                        trackingResult.statut === 'livré' 
                          ? 'bg-white dark:bg-gray-800 border-green-200 dark:border-green-700' 
                          : 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600'
                      }`}>
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold ${
                              trackingResult.statut === 'livré' 
                                ? 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400' 
                                : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                            }`}>5</span>
                            Livraison
              </h3>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            trackingResult.statut === 'livré' 
                              ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 animate-pulse' 
                              : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                          }`}>
                            {trackingResult.statut === 'livré' ? '✅ Terminé' : '⏳ En attente'}
                          </span>
                        </div>
                        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                          <div className="space-y-3">
                            <div>
                              <h4 className="font-semibold text-green-900 dark:text-green-100 mb-2">📍 Adresse de livraison</h4>
                              <p className="text-sm text-green-700 dark:text-green-300">{trackingResult.adresse_destinataire.address}</p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              <div>
                                <p className="text-xs font-medium text-green-900 dark:text-green-100">Entreprise</p>
                                <p className="text-sm text-green-700 dark:text-green-300">{trackingResult.adresse_destinataire.pickup_company_name}</p>
                              </div>
                              <div>
                                <p className="text-xs font-medium text-green-900 dark:text-green-100">Contact</p>
                                <p className="text-sm text-green-700 dark:text-green-300">
                                  {trackingResult.adresse_destinataire.recipient_first_name} {trackingResult.adresse_destinataire.recipient_last_name}
                </p>
              </div>
            </div>
          </div>
        </div>
                      </div>
              </div>
            </div>

                  {/* Statut global */}
                  <div className="relative flex items-start group animate-fade-in" style={{ animationDelay: '0.6s' }}>
                    <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center z-10 relative shadow-lg group-hover:scale-110 transition-transform duration-300 ${getStatusColor(trackingResult.statut)}`}>
                      <Package className="w-6 h-6 text-white" />
                      <div className={`absolute inset-0 rounded-full animate-ping opacity-20 ${getStatusColor(trackingResult.statut).replace('bg-', 'bg-')}`}></div>
              </div>
                    <div className="ml-8 flex-1">
                      <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-6 border-2 border-purple-200 dark:border-purple-700 shadow-lg hover:shadow-xl transition-all duration-500 transform hover:-translate-y-1">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <span className="w-6 h-6 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center text-purple-600 dark:text-purple-400 text-sm font-bold">📊</span>
                            Statut global
              </h3>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(trackingResult.statut).replace('bg-', 'text-')}`}>
                            {trackingResult.statut}
                          </span>
              </div>
                        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-purple-200 dark:border-purple-700">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div>
                              <p className="font-medium text-gray-900 dark:text-white">Statut du colis</p>
                              <p className="text-gray-600 dark:text-gray-300">{trackingResult.statut_colis}</p>
            </div>
                                                         <div>
                               <p className="font-medium text-gray-900 dark:text-white">Point relais</p>
                               <p className="text-gray-600 dark:text-gray-300">{relayName}</p>
          </div>
                             <div>
                               <p className="font-medium text-gray-900 dark:text-white">Transporteur</p>
                               <p className="text-gray-600 dark:text-gray-300">{carrierName}</p>
        </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end p-6 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => { setShowTrackingModal(false); setTrackingResult(null); setTrackingNumber(''); setTrackingError(''); }}
                className="px-6 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-gradient-to-br from-ksl-gray-dark via-gray-800 to-ksl-black text-white relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>

        <div className="container-ksl py-16 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {/* LMS Katian */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-white to-ksl-gray-light bg-clip-text text-transparent">
                LMS Katian
              </h3>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-ksl-red to-ksl-red-dark rounded-full flex items-center justify-center border-2 border-white shadow-lg transform hover:scale-110 transition-transform duration-300">
                  <span className="text-white font-bold text-lg">K</span>
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-white to-ksl-gray-light bg-clip-text text-transparent">
                  KATIAN
                </span>
              </div>
              <p className="text-ksl-gray-light text-sm leading-relaxed">
                La solution logistique innovante pour une gestion simplifiée de vos expéditions.
              </p>
              <div className="flex space-x-4">
                <div className="w-2 h-2 bg-ksl-red rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-ksl-red rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                <div className="w-2 h-2 bg-ksl-red rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
              </div>
            </div>

            {/* Liens Rapides */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-white to-ksl-gray-light bg-clip-text text-transparent">
                Liens Rapides
              </h3>
              <ul className="space-y-3">
                {[
                  { to: '/solutions', label: 'Solutions' },
                  { to: '/fonctionnalites', label: 'Fonctionnalités' },
                  { to: '/tarifs', label: 'Tarifs' },
                  { to: '/devenir-relais', label: 'Devenir Point Relais' },
                  { to: '/support', label: 'Support & Aide' },
                  { to: '/a-propos', label: 'À propos' }
                ].map((link, index) => (
                  <li key={link.to}>
                    <Link 
                      to={link.to} 
                      className="text-ksl-gray-light hover:text-white transition-all duration-300 text-sm group flex items-center"
                    >
                      <span className="w-0 h-0.5 bg-ksl-red group-hover:w-4 transition-all duration-300 mr-2"></span>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Nous Contacter */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-white to-ksl-gray-light bg-clip-text text-transparent">
                Nous Contacter
              </h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-4 group">
                  <div className="w-8 h-8 bg-gradient-to-br from-ksl-red to-ksl-red-dark rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                    <MapPin className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-ksl-gray-light text-sm group-hover:text-white transition-colors duration-300">
                    Immeuble Palladium, Bel Air, Abidjan
                  </span>
                </div>
                <div className="flex items-center space-x-4 group">
                  <div className="w-8 h-8 bg-gradient-to-br from-ksl-gray to-ksl-gray-dark rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                    <Phone className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-ksl-gray-light text-sm group-hover:text-white transition-colors duration-300">
                    +225 01 60 00 55 55
                  </span>
                </div>
                <div className="flex items-center space-x-4 group">
                  <div className="w-8 h-8 bg-gradient-to-br from-ksl-gray to-ksl-gray-dark rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                    <Phone className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-ksl-gray-light text-sm group-hover:text-white transition-colors duration-300">
                    +225 05 66 03 02 02
                  </span>
                </div>
                <div className="flex items-center space-x-4 group">
                  <div className="w-8 h-8 bg-gradient-to-br from-ksl-red to-ksl-red-dark rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                    <Mail className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-ksl-gray-light text-sm group-hover:text-white transition-colors duration-300">
                    contact@katian.com
                  </span>
                </div>
                <div className="pt-2">
                  <Link 
                    to="/contact" 
                    className="inline-flex items-center text-ksl-red hover:text-ksl-red-light transition-all duration-300 text-sm group"
                  >
                    <span className="underline group-hover:no-underline">Formulaire de contact</span>
                    <span className="ml-1 group-hover:ml-2 transition-all duration-300">→</span>
                  </Link>
                </div>
              </div>

              {/* Schéma de suivi complet et intuitif */}
              <div className="hidden relative mt-6">
                <div className="space-y-6">
                  {/* Étape 1: Commande créée */}
                  <div className="relative flex items-start">
                    <div className="flex-shrink-0 w-12 h-12 bg-green-500 rounded-full flex items-center justify-center z-10 relative shadow-lg">
                      <Package className="w-6 h-6 text-white" />
                    </div>
                    <div className="ml-8 flex-1">
                      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border-2 border-green-200 dark:border-green-700 shadow-lg">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <span className="w-6 h-6 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center text-green-600 dark:text-green-400 text-sm font-bold">1</span>
                            Commande créée
                          </h3>
                          <span className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full text-sm font-medium">✓ Terminé</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div className="space-y-2">
                            <p className="text-gray-600 dark:text-gray-300"><span className="font-semibold">Numéro:</span> {trackingResult?.order_number || trackingResult?.expedition_number || '—'}</p>
                            <p className="text-gray-600 dark:text-gray-300"><span className="font-semibold">Date:</span> {trackingResult?.date_creation ? new Date(trackingResult?.date_creation).toLocaleString('fr-FR') : '—'}</p>
                          </div>
                          <div className="space-y-2">
                            <p className="text-gray-600 dark:text-gray-300"><span className="font-semibold">Type:</span> {trackingResult?.type_colis || trackingResult?.infocolis?.[0]?.category || '—'}</p>
                            <p className="text-gray-600 dark:text-gray-300"><span className="font-semibold">Service:</span> {trackingResult?.type_service || '—'}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Étape 2: Préparation */}
                  <div className="relative flex items-start">
                    <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center z-10 relative shadow-lg ${trackingResult?.statut_colis === 'préparé' ? 'bg-yellow-500' : 'bg-gray-300'}`}>
                      <Box className="w-6 h-6 text-white" />
                    </div>
                    <div className="ml-8 flex-1">
                      <div className={`rounded-xl p-6 border-2 shadow-lg ${trackingResult?.statut_colis === 'préparé' ? 'bg-white dark:bg-gray-800 border-yellow-200 dark:border-yellow-700' : 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600'}`}>
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold ${trackingResult?.statut_colis === 'préparé' ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-400' : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'}`}>2</span>
                            Préparation du colis
                          </h3>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${trackingResult?.statut_colis === 'préparé' ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200' : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'}`}>
                            {trackingResult?.statut_colis === 'préparé' ? '✓ Terminé' : '⏳ En attente'}
                          </span>
                        </div>
                        {Array.isArray(trackingResult?.infocolis) && trackingResult?.infocolis.length > 0 && (
                          <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4">
                            <h4 className="font-semibold text-yellow-900 dark:text-yellow-100 mb-3">Détails des colis:</h4>
                            <div className="space-y-3">
                              {trackingResult?.infocolis.map((colis, index) => (
                                <div key={index} className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-yellow-200 dark:border-yellow-700">
                                  <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 dark:text-gray-400">
                                    <div>Poids: {colis.weight} kg</div>
                                    <div>Quantité: {colis.quantity}</div>
                                    <div>Dimensions: {colis.length}×{colis.width}×{colis.height} cm</div>
                                    <div>Volume: {colis.length && colis.width && colis.height ? (colis.length * colis.width * colis.height / 1000000).toFixed(2) : '--'} m³</div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Étape 3: Ramassage */}
                  <div className="relative flex items-start">
                    <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center z-10 relative shadow-lg ${trackingResult?.statut === 'en attente' ? 'bg-orange-500' : 'bg-gray-300'}`}>
                      <MapPin className="w-6 h-6 text-white" />
                    </div>
                    <div className="ml-8 flex-1">
                      <div className={`rounded-xl p-6 border-2 shadow-lg ${trackingResult?.statut === 'en attente' ? 'bg-white dark:bg-gray-800 border-orange-200 dark:border-orange-700' : 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600'}`}>
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold ${trackingResult?.statut === 'en attente' ? 'bg-orange-100 dark:bg-orange-900 text-orange-600 dark:text-orange-400' : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'}`}>3</span>
                            Ramassage
                          </h3>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${trackingResult?.statut === 'en attente' ? 'bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200' : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'}`}>
                            {trackingResult?.statut === 'en attente' ? '🔄 En cours' : '⏳ En attente'}
                          </span>
                        </div>
                        {trackingResult?.adresse_expediteur && (
                          <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4">
                            <div className="space-y-3">
                              <div>
                                <h4 className="font-semibold text-orange-900 dark:text-orange-100 mb-2">📍 Adresse de ramassage</h4>
                                <p className="text-sm text-orange-700 dark:text-orange-300">{trackingResult?.adresse_expediteur?.address || '—'}</p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Étape 4: En transit */}
                  <div className="relative flex items-start">
                    <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center z-10 relative shadow-lg ${trackingResult?.statut === 'en transit' ? 'bg-blue-500' : 'bg-gray-300'}`}>
                      <Truck className="w-6 h-6 text-white" />
                    </div>
                    <div className="ml-8 flex-1">
                      <div className={`rounded-xl p-6 border-2 shadow-lg ${trackingResult?.statut === 'en transit' ? 'bg-white dark:bg-gray-800 border-blue-200 dark:border-blue-700' : 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600'}`}>
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold ${trackingResult?.statut === 'en transit' ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400' : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'}`}>4</span>
                            En transit
                          </h3>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${trackingResult?.statut === 'en transit' ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200' : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'}`}>
                            {trackingResult?.statut === 'en transit' ? '🚚 En cours' : '⏳ En attente'}
                          </span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{trackingResult?.dataApi?.merged_est_dist_km || '--'}</div>
                            <div className="text-xs text-blue-700 dark:text-blue-300">km</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{trackingResult?.dataApi?.merged_est_minutes || '--'}</div>
                            <div className="text-xs text-blue-700 dark:text-blue-300">min</div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-bold text-blue-600 dark:text-blue-400">{trackingResult?.delais_livraison || '--'}</div>
                            <div className="text-xs text-blue-700 dark:text-blue-300">délai</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Étape 5: Livraison */}
                  <div className="relative flex items-start">
                    <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center z-10 relative shadow-lg ${trackingResult?.statut === 'livré' ? 'bg-green-500' : 'bg-gray-300'}`}>
                      <Package className="w-6 h-6 text-white" />
                    </div>
                    <div className="ml-8 flex-1">
                      <div className={`rounded-xl p-6 border-2 shadow-lg ${trackingResult?.statut === 'livré' ? 'bg-white dark:bg-gray-800 border-green-200 dark:border-green-700' : 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600'}`}>
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold ${trackingResult?.statut === 'livré' ? 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400' : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'}`}>5</span>
                            Livraison
                          </h3>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${trackingResult?.statut === 'livré' ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'}`}>
                            {trackingResult?.statut === 'livré' ? '✅ Terminé' : '⏳ En attente'}
                          </span>
                        </div>
                        {trackingResult?.adresse_destinataire && (
                          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                            <div className="space-y-3">
                              <div>
                                <h4 className="font-semibold text-green-900 dark:text-green-100 mb-2">📍 Adresse de livraison</h4>
                                <p className="text-sm text-green-700 dark:text-green-300">{trackingResult?.adresse_destinataire?.address || '—'}</p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Statut global */}
                  <div className="relative flex items-start">
                    <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center z-10 relative shadow-lg ${getStatusColor(trackingResult?.statut)}`}>
                      <Package className="w-6 h-6 text-white" />
                    </div>
                    <div className="ml-8 flex-1">
                      <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-6 border-2 border-purple-200 dark:border-purple-700 shadow-lg">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <span className="w-6 h-6 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center text-purple-600 dark:text-purple-400 text-sm font-bold">📊</span>
                            Statut global
                          </h3>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(trackingResult?.statut).replace('bg-', 'text-')}`}>
                            {trackingResult?.statut || '—'}
                          </span>
                        </div>
                        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-purple-200 dark:border-purple-700">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div>
                              <p className="font-medium text-gray-900 dark:text-white">Statut du colis</p>
                              <p className="text-gray-600 dark:text-gray-300">{trackingResult?.statut_colis || '—'}</p>
                            </div>
                            <div>
                              <p className="font-medium text-gray-900 dark:text-white">Point relais</p>
                              <p className="text-gray-600 dark:text-gray-300">{trackingResult?.relay_name || trackingResult?.point_relais?.name || trackingResult?.point_relais_nom || (trackingResult?.pointrelais != null ? String(trackingResult?.pointrelais) : '—')}</p>
                            </div>
                            <div>
                              <p className="font-medium text-gray-900 dark:text-white">Transporteur</p>
                              <p className="text-gray-600 dark:text-gray-300">{trackingResult?.carrier_name || trackingResult?.transporteur?.nom || trackingResult?.transporteur_nom || (trackingResult?.transporteur != null ? String(trackingResult?.transporteur) : '—')}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Suivez-nous & Newsletter */}
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-white to-ksl-gray-light bg-clip-text text-transparent mb-6">
                  Suivez-nous
                </h3>
                <div className="flex space-x-4">
                  {[
                    { icon: Facebook, color: 'from-blue-600 to-blue-700', href: '#' },
                    { icon: Instagram, color: 'from-pink-500 to-purple-600', href: '#' },
                    { icon: Twitter, color: 'from-blue-400 to-blue-500', href: '#' },
                    { icon: Linkedin, color: 'from-blue-700 to-blue-800', href: '#' },
                    { icon: MessageCircle, color: 'from-ksl-red to-ksl-red-dark', href: '#' }
                  ].map((social, index) => (
                    <a 
                      key={index}
                      href={social.href} 
                      className={`w-12 h-12 bg-gradient-to-br ${social.color} rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300 group`}
                    >
                      <social.icon className="w-5 h-5 text-white group-hover:rotate-12 transition-transform duration-300" />
                    </a>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-white to-ksl-gray-light bg-clip-text text-transparent mb-6">
                  Newsletter
                </h3>
                <form onSubmit={handleNewsletterSubmit} className="space-y-4">
                  <div className="relative">
                    <input
                      type="email"
                      placeholder="Votre email"
                      value={newsletterEmail}
                      onChange={(e) => setNewsletterEmail(e.target.value)}
                      className="w-full px-4 py-3 bg-ksl-gray-dark/50 backdrop-blur-sm border border-ksl-gray rounded-xl text-white placeholder-ksl-gray-light focus:outline-none focus:ring-2 focus:ring-ksl-red focus:border-transparent transition-all duration-300"
                      required
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent rounded-xl pointer-events-none"></div>
                  </div>
                  <button
                    type="submit"
                    className="w-full px-6 py-3 bg-gradient-to-r from-ksl-red to-ksl-red-dark text-white rounded-xl hover:from-ksl-red-dark hover:to-ksl-black transition-all duration-300 font-medium shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
                  >
                    S'inscrire
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-ksl-gray/30 py-8 relative z-10">
          <div className="container-ksl text-center">
            <p className="text-ksl-gray-light text-sm">
              © 2025 LMS Katian. Tous droits réservés.
            </p>
            <div className="mt-4 flex justify-center space-x-6 text-xs text-ksl-gray">
              <a href="#" className="hover:text-ksl-gray-light transition-colors duration-300">Mentions légales</a>
              <a href="#" className="hover:text-ksl-gray-light transition-colors duration-300">Politique de confidentialité</a>
              <a href="#" className="hover:text-ksl-gray-light transition-colors duration-300">CGU</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
} 