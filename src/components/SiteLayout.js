import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { Sun, Moon, Menu, X, MapPin, Phone, Mail, Facebook, Instagram, Twitter, Linkedin, MessageCircle, ChevronDown } from 'lucide-react';

const navItems = [
  { 
    label: 'Solutions', 
    to: '/solutions',
    hasSubmenu: true,
    submenu: [
      { label: 'E-commerce', section: 'ecommerce', description: 'Solutions pour boutiques en ligne' },
      { label: 'Logistique B2B', section: 'b2b', description: 'Gestion logistique entreprise' },
      { label: 'Points Relais', section: 'points-relais', description: 'Réseau de points de retrait' },
      { label: 'Livraison Express', section: 'express', description: 'Livraison rapide et sécurisée' },
      { label: 'Tracking Avancé', section: 'tracking', description: 'Suivi en temps réel' }
    ]
  },
  { label: 'Fonctionnalités', to: '/fonctionnalites' },
  { label: 'Pour qui ?', to: '/pour-qui' },
  { label: 'Tarifs', to: '/tarifs' },
  { label: 'Devenir Point Relais', to: '/devenir-relais' },
  { label: 'Partenaires', to: '/partenaires' },
  { label: 'À propos', to: '/a-propos' },
  { label: 'Support & Aide', to: '/support' },
  { label: 'Contact', to: '/contact' },
];

export default function SiteLayout({ children }) {
  const { isDark, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [solutionsSubmenuOpen, setSolutionsSubmenuOpen] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState('');

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    // Logique pour l'inscription à la newsletter
    console.log('Newsletter subscription:', newsletterEmail);
    setNewsletterEmail('');
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
          <nav className="hidden lg:flex items-center space-x-0.5">
            {navItems.map((item) => (
              <div key={item.to} className="relative">
                {item.hasSubmenu ? (
                  <div className="relative">
                    <button
                      onClick={() => setSolutionsSubmenuOpen(!solutionsSubmenuOpen)}
                      onMouseEnter={() => setSolutionsSubmenuOpen(true)}
                      className={`px-2 py-2 text-sm font-bold rounded-lg transition-colors duration-200 whitespace-nowrap flex items-center space-x-1 ${
                        window.location.pathname.startsWith('/solutions')
                          ? 'bg-ksl-red text-white' 
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-bg-tertiary hover:text-gray-900 dark:hover:text-white'
                      }`}
                    >
                      <span>{item.label}</span>
                      <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${solutionsSubmenuOpen ? 'rotate-180' : ''}`} />
                    </button>
                    
                    {/* Sous-menu Solutions */}
                    {solutionsSubmenuOpen && (
                      <div 
                        className="absolute top-full left-0 mt-1 w-80 bg-white dark:bg-dark-bg-secondary border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl z-50"
                        onMouseLeave={() => setSolutionsSubmenuOpen(false)}
                      >
                        <div className="p-4">
                          <div className="mb-4">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Nos Solutions</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Découvrez nos solutions adaptées à vos besoins</p>
                          </div>
                          <div className="space-y-2">
                            {item.submenu.map((subItem) => (
                              <Link
                                key={subItem.section}
                                to={`/solutions?section=${subItem.section}`}
                                className="block p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-bg-tertiary transition-colors duration-200 group"
                                onClick={() => setSolutionsSubmenuOpen(false)}
                              >
                                <div className="flex items-start justify-between">
                                  <div className="flex-1">
                                    <h4 className="font-semibold text-gray-900 dark:text-white group-hover:text-ksl-red transition-colors duration-200">
                                      {subItem.label}
                                    </h4>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                      {subItem.description}
                                    </p>
                                  </div>
                                  <div className="w-2 h-2 bg-ksl-red rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                                </div>
                              </Link>
                            ))}
                          </div>
                          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                            <Link
                              to="/solutions"
                              className="block w-full text-center px-4 py-2 bg-ksl-red text-white rounded-lg hover:bg-ksl-red-dark transition-colors duration-200 font-medium"
                              onClick={() => setSolutionsSubmenuOpen(false)}
                            >
                              Voir toutes nos solutions
                            </Link>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                      `px-2 py-2 text-sm font-bold rounded-lg transition-colors duration-200 whitespace-nowrap ${
                        isActive 
                          ? 'bg-ksl-red text-white' 
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-bg-tertiary hover:text-gray-900 dark:hover:text-white'
                      }`
                }
              >
                {item.label}
              </NavLink>
                )}
              </div>
            ))}
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
                href="https://business.katianlogistique.com/login" 
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
            <div className="container-ksl py-4 space-y-2">
              {navItems.map((item) => (
                <div key={item.to} className="relative">
                  {item.hasSubmenu ? (
                    <div className="relative">
                      <button
                        onClick={() => {
                          setSolutionsSubmenuOpen(!solutionsSubmenuOpen);
                          setMobileMenuOpen(false);
                        }}
                        onMouseEnter={() => setSolutionsSubmenuOpen(true)}
                        className={`block px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                          window.location.pathname.startsWith('/solutions')
                            ? 'bg-ksl-red text-white' 
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-bg-tertiary'
                        }`}
                      >
                        <span>{item.label}</span>
                        <ChevronDown className={`w-4 h-4 inline-block ml-2 transition-transform duration-200 ${solutionsSubmenuOpen ? 'rotate-180' : ''}`} />
                      </button>
                      
                      {/* Sous-menu Solutions mobile */}
                      {solutionsSubmenuOpen && (
                        <div 
                          className="absolute top-full left-0 mt-1 w-full bg-white dark:bg-dark-bg-secondary border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl z-50"
                          onMouseLeave={() => setSolutionsSubmenuOpen(false)}
                        >
                          <div className="p-3">
                            <div className="mb-3">
                              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Nos Solutions</h3>
                              <p className="text-sm text-gray-600 dark:text-gray-400">Découvrez nos solutions adaptées à vos besoins</p>
                            </div>
                            <div className="space-y-2">
                              {item.submenu.map((subItem) => (
                                <Link
                                  key={subItem.section}
                                  to={`/solutions?section=${subItem.section}`}
                                  className="block p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-bg-tertiary transition-colors duration-200 group"
                                  onClick={() => setSolutionsSubmenuOpen(false)}
                                >
                                  <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                      <h4 className="font-semibold text-gray-900 dark:text-white group-hover:text-ksl-red transition-colors duration-200">
                                        {subItem.label}
                                      </h4>
                                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                        {subItem.description}
                                      </p>
                                    </div>
                                    <div className="w-2 h-2 bg-ksl-red rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                                  </div>
                                </Link>
                              ))}
                            </div>
                            <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                              <Link
                                to="/solutions"
                                className="block w-full text-center px-4 py-2 bg-ksl-red text-white rounded-lg hover:bg-ksl-red-dark transition-colors duration-200 font-medium"
                                onClick={() => setSolutionsSubmenuOpen(false)}
                              >
                                Voir toutes nos solutions
                              </Link>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <NavLink
                      to={item.to}
                      className={({ isActive }) =>
                        `block px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                          isActive 
                            ? 'bg-ksl-red text-white' 
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-bg-tertiary'
                        }`
                      }
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.label}
                    </NavLink>
                  )}
                </div>
              ))}
              <div className="pt-4 space-y-3">
                <a 
                  href="https://business.katianlogistique.com/login" 
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
                    123 Rue de l'Innovation, Dakar, Sénégal
                  </span>
                </div>
                <div className="flex items-center space-x-4 group">
                  <div className="w-8 h-8 bg-gradient-to-br from-ksl-gray to-ksl-gray-dark rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                    <Phone className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-ksl-gray-light text-sm group-hover:text-white transition-colors duration-300">
                    +221 XX XXX XX XX
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