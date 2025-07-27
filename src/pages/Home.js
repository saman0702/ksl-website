import React from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '../components/ui';
import { ArrowRight, Star, Users, Package, Truck, Box, Building, DollarSign, RotateCcw, Search, Rocket, Printer, ArrowLeftRight, BarChart3, CreditCard, TrendingUp, Smartphone, User, ShoppingCart, MapPin, Banknote, Bike, Battery } from 'lucide-react';

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-white to-gray-50 dark:from-dark-bg dark:to-dark-bg-secondary">
        <div className="container-ksl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Contenu à gauche */}
            <div className="space-y-8">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight">
                Simplifiez votre logistique avec{' '}
                <span className="text-ksl-red">LMS</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
                Une solution complète pour gérer vos expéditions, points de relais, et paiements à la livraison en toute simplicité.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  to="/solutions" 
                  className="inline-flex items-center justify-center px-6 py-3 bg-ksl-red text-white font-medium rounded-lg hover:bg-ksl-red-dark transition-all duration-200 group shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  Découvrir LMS Katian
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link 
                  to="/contact" 
                  className="inline-flex items-center justify-center px-6 py-3 border-2 border-ksl-red text-ksl-red font-medium rounded-lg hover:bg-ksl-red hover:text-white transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-1"
                >
                  Nous contacter
                </Link>
              </div>
            </div>

            {/* Logo à droite */}
            <div className="flex justify-center lg:justify-end">
              <div className="relative">
                <div className="w-80 h-80 md:w-96 md:h-96 lg:w-[500px] lg:h-[500px] bg-white/10 backdrop-blur-sm rounded-3xl p-4 flex items-center justify-center">
                  <img 
                    src="/katian-logo.png" 
                    alt="Katian" 
                    className="w-full h-full object-contain rounded-2xl"
                  />
                </div>
                {/* Effet de brillance */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent rounded-3xl animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Chiffres clés */}
      <section className="py-16 bg-gray-50 dark:bg-dark-bg-secondary">
        <div className="container-ksl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-dark-bg rounded-xl p-8 text-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 dark:border-gray-700">
              <div className="w-16 h-16 bg-ksl-red/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="w-8 h-8 text-ksl-red" />
              </div>
              <div className="text-4xl font-bold text-ksl-red mb-2">1000+</div>
              <div className="text-gray-600 dark:text-gray-300 font-medium">Colis livrés chaque mois</div>
            </div>
            <div className="bg-white dark:bg-dark-bg rounded-xl p-8 text-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 dark:border-gray-700">
              <div className="w-16 h-16 bg-ksl-red/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="w-8 h-8 text-ksl-red" />
              </div>
              <div className="text-4xl font-bold text-ksl-red mb-2">50+</div>
              <div className="text-gray-600 dark:text-gray-300 font-medium">Points de relais connectés</div>
            </div>
            <div className="bg-white dark:bg-dark-bg rounded-xl p-8 text-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 dark:border-gray-700">
              <div className="w-16 h-16 bg-ksl-red/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-ksl-red" />
              </div>
              <div className="text-4xl font-bold text-ksl-red mb-2">95%</div>
              <div className="text-gray-600 dark:text-gray-300 font-medium">Clients satisfaits</div>
            </div>
          </div>
        </div>
      </section>

      {/* Section Nos Solutions */}
      <section className="py-16 md:py-20 bg-white dark:bg-dark-bg">
        <div className="container-ksl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Nos Solutions
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Des solutions adaptées à vos besoins spécifiques en matière de logistique
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Expédition Facile */}
            <div className="bg-white dark:bg-dark-bg-secondary rounded-lg p-6 border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 relative overflow-hidden">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-ksl-red"></div>
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900/20 rounded-full flex items-center justify-center mb-4">
                  <Box className="w-8 h-8 text-amber-600 dark:text-amber-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  Expédition Facile
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                  Créez des étiquettes d'expédition et choisissez le meilleur transporteur en quelques clics.
                </p>
                <Link to="/solutions/expedition" className="text-ksl-red font-medium hover:text-ksl-red-dark transition-colors">
                  En savoir plus →
                </Link>
              </div>
            </div>

            {/* Points de Relais Connectés */}
            <div className="bg-white dark:bg-dark-bg-secondary rounded-lg p-6 border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 relative overflow-hidden">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-ksl-red"></div>
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mb-4">
                  <Building className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  Points de Relais Connectés
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                  Dépôt, retrait et gestion de stock en temps réel dans notre réseau de points relais.
                </p>
                <Link to="/solutions/relais" className="text-ksl-red font-medium hover:text-ksl-red-dark transition-colors">
                  En savoir plus →
                </Link>
              </div>
            </div>

            {/* Cash on Delivery */}
            <div className="bg-white dark:bg-dark-bg-secondary rounded-lg p-6 border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 relative overflow-hidden">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-ksl-red"></div>
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-yellow-100 dark:bg-yellow-900/20 rounded-full flex items-center justify-center mb-4">
                  <DollarSign className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  Cash on Delivery
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                  Solution de paiement sécurisée à la livraison pour plus de confiance.
                </p>
                <Link to="/solutions/paiement" className="text-ksl-red font-medium hover:text-ksl-red-dark transition-colors">
                  En savoir plus →
                </Link>
              </div>
            </div>

            {/* Gestion des Retours */}
            <div className="bg-white dark:bg-dark-bg-secondary rounded-lg p-6 border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 relative overflow-hidden">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-ksl-red"></div>
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-cyan-100 dark:bg-cyan-900/20 rounded-full flex items-center justify-center mb-4">
                  <RotateCcw className="w-8 h-8 text-cyan-600 dark:text-cyan-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  Gestion des Retours
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                  Simplifiez la gestion des retours pour vos clients et votre entreprise.
                </p>
                <Link to="/solutions/retours" className="text-ksl-red font-medium hover:text-ksl-red-dark transition-colors">
                  En savoir plus →
                </Link>
              </div>
            </div>

            {/* Suivi et Traçabilité */}
            <div className="bg-white dark:bg-dark-bg-secondary rounded-lg p-6 border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 relative overflow-hidden">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-ksl-red"></div>
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mb-4">
                  <Search className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  Suivi et Traçabilité
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                  Suivez vos colis en temps réel et informez vos clients à chaque étape.
                </p>
                <Link to="/solutions/suivi" className="text-ksl-red font-medium hover:text-ksl-red-dark transition-colors">
                  En savoir plus →
                </Link>
              </div>
            </div>

            {/* Marketplace Logistique */}
            <div className="bg-white dark:bg-dark-bg-secondary rounded-lg p-6 border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 relative overflow-hidden">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-ksl-red"></div>
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-ksl-red to-ksl-red-dark rounded-full flex items-center justify-center mb-4">
                  <Rocket className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  Marketplace Logistique
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                  Bientôt disponible : Une place de marché pour tous vos besoins logistiques.
                </p>
                <span className="text-ksl-red font-medium">
                  Bientôt disponible →
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section Fonctionnalités */}
      <section className="py-16 md:py-20 bg-gray-50 dark:bg-dark-bg-secondary">
        <div className="container-ksl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Fonctionnalités
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Des outils puissants pour optimiser et simplifier votre gestion logistique
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {/* Impression d'étiquettes d'expédition */}
            <div className="bg-white dark:bg-dark-bg rounded-lg p-6 text-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-pink-100 dark:bg-pink-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Printer className="w-8 h-8 text-pink-600 dark:text-pink-400" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
                Impression d'étiquettes d'expédition
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Générez et imprimez facilement vos étiquettes d'expédition personnalisées.
              </p>
            </div>

            {/* Intégration API complète */}
            <div className="bg-white dark:bg-dark-bg rounded-lg p-6 text-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <ArrowLeftRight className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
                Intégration API complète
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Connectez votre système e-commerce avec notre API pour automatiser vos processus.
              </p>
            </div>

            {/* Tableaux de bord personnalisés */}
            <div className="bg-white dark:bg-dark-bg rounded-lg p-6 text-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-pink-100 dark:bg-pink-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-8 h-8 text-pink-600 dark:text-pink-400" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
                Tableaux de bord personnalisés
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Suivez toutes vos activités logistiques grâce à nos tableaux de bord client et relais.
              </p>
            </div>

            {/* Module de paiement intégré */}
            <div className="bg-white dark:bg-dark-bg rounded-lg p-6 text-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-yellow-100 dark:bg-yellow-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <CreditCard className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
                Module de paiement intégré
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Solution de paiement sécurisée pour vos transactions cash on delivery.
              </p>
            </div>

            {/* Statistiques en temps réel */}
            <div className="bg-white dark:bg-dark-bg rounded-lg p-6 text-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-pink-100 dark:bg-pink-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-pink-600 dark:text-pink-400" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
                Statistiques en temps réel
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Analysez votre performance logistique avec des rapports détaillés.
              </p>
            </div>

            {/* Application Mobile */}
            <div className="bg-white dark:bg-dark-bg rounded-lg p-6 text-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Smartphone className="w-8 h-8 text-amber-600 dark:text-amber-400" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
                Application Mobile
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Prochainement : Gérez vos expéditions depuis votre smartphone.
              </p>
            </div>
          </div>

          {/* Bouton d'action */}
          <div className="text-center">
            <Link 
              to="/fonctionnalites" 
              className="inline-flex items-center justify-center px-8 py-3 bg-ksl-red text-white font-medium rounded-lg hover:bg-ksl-red-dark transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Découvrir toutes nos fonctionnalités
            </Link>
          </div>
        </div>
      </section>

      {/* Section Pour qui ? */}
      <section className="py-16 md:py-20 bg-white dark:bg-dark-bg">
        <div className="container-ksl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Pour qui ?
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Des solutions adaptées à différents profils d'utilisateurs et secteurs d'activité
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Particuliers */}
            <div className="bg-white dark:bg-dark-bg-secondary rounded-lg p-6 border border-ksl-red shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mb-4">
                  <User className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  Particuliers
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                  Envoyez et recevez des colis facilement, sans tracas administratifs.
                </p>
                <Link to="/pour-qui/particuliers" className="text-ksl-red font-medium hover:text-ksl-red-dark transition-colors">
                  En savoir plus →
                </Link>
              </div>
            </div>

            {/* Entreprises */}
            <div className="bg-white dark:bg-dark-bg-secondary rounded-lg p-6 border border-ksl-red shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mb-4">
                  <Building className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  Entreprises
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                  Optimisez votre chaîne logistique et réduisez vos coûts d'expédition.
                </p>
                <Link to="/pour-qui/entreprises" className="text-ksl-red font-medium hover:text-ksl-red-dark transition-colors">
                  En savoir plus →
                </Link>
              </div>
            </div>

            {/* E-commerçants */}
            <div className="bg-white dark:bg-dark-bg-secondary rounded-lg p-6 border border-ksl-red shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mb-4">
                  <ShoppingCart className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  E-commerçants
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                  Améliorez votre service client avec des livraisons rapides et fiables.
                </p>
                <Link to="/pour-qui/e-commercants" className="text-ksl-red font-medium hover:text-ksl-red-dark transition-colors">
                  En savoir plus →
                </Link>
              </div>
            </div>

            {/* Points de relais */}
            <div className="bg-white dark:bg-dark-bg-secondary rounded-lg p-6 border border-ksl-red shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-4">
                  <MapPin className="w-8 h-8 text-red-600 dark:text-red-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  Points de relais
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                  Générez des revenus supplémentaires en devenant un point de collecte et livraison.
                </p>
                <Link to="/pour-qui/points-relais" className="text-ksl-red font-medium hover:text-ksl-red-dark transition-colors">
                  En savoir plus →
                </Link>
              </div>
            </div>

            {/* Banques & Microfinances */}
            <div className="bg-white dark:bg-dark-bg-secondary rounded-lg p-6 border border-ksl-red shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mb-4">
                  <Banknote className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  Banques & Microfinances
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                  Sécurisez les paiements à la livraison avec nos solutions intégrées.
                </p>
                <Link to="/pour-qui/banques" className="text-ksl-red font-medium hover:text-ksl-red-dark transition-colors">
                  En savoir plus →
                </Link>
              </div>
            </div>

            {/* Transporteurs */}
            <div className="bg-white dark:bg-dark-bg-secondary rounded-lg p-6 border border-ksl-red shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-yellow-100 dark:bg-yellow-900/20 rounded-full flex items-center justify-center mb-4">
                  <Truck className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  Transporteurs
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                  Augmentez votre volume d'affaires en rejoignant notre réseau de transport.
                </p>
                <Link to="/pour-qui/transporteurs" className="text-ksl-red font-medium hover:text-ksl-red-dark transition-colors">
                  En savoir plus →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bannière CTA */}
      <section className="py-16 md:py-20 bg-ksl-red">
        <div className="container-ksl">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Prêt à simplifier votre logistique ?
            </h2>
            <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
              Rejoignez LMS Katian et transformez votre manière de gérer les expéditions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/contact" 
                className="inline-flex items-center justify-center px-8 py-3 bg-white text-ksl-red font-medium rounded-lg hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Contactez-nous
              </Link>
              <Link 
                to="/tarifs" 
                className="inline-flex items-center justify-center px-8 py-3 bg-ksl-red text-white font-medium rounded-lg border-2 border-white hover:bg-white hover:text-ksl-red transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Voir les tarifs
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Section Nos Partenaires */}
      <section className="py-16 md:py-20 bg-gray-50 dark:bg-dark-bg-secondary">
        <div className="container-ksl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Nos Partenaires
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Nous collaborons avec les meilleurs transporteurs et constructeurs pour vous offrir un service de qualité
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {/* Transport Express */}
            <div className="bg-white dark:bg-dark-bg rounded-lg p-6 text-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="w-8 h-8 text-orange-600 dark:text-orange-400" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                Transport Express
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Transporteur
              </p>
            </div>

            {/* Fast Delivery */}
            <div className="bg-white dark:bg-dark-bg rounded-lg p-6 text-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-yellow-100 dark:bg-yellow-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Bike className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                Fast Delivery
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Transporteur
              </p>
            </div>

            {/* EcoMobility */}
            <div className="bg-white dark:bg-dark-bg rounded-lg p-6 text-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Bike className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                EcoMobility
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Constructeur
              </p>
            </div>

            {/* Green Logistics */}
            <div className="bg-white dark:bg-dark-bg rounded-lg p-6 text-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Bike className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                Green Logistics
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Transporteur
              </p>
            </div>

            {/* Electric Vehicles */}
            <div className="bg-white dark:bg-dark-bg rounded-lg p-6 text-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Battery className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                Electric Vehicles
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Constructeur
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Témoignages */}
      <section className="py-16 md:py-20 bg-gradient-to-br from-gray-50 to-white dark:from-dark-bg-secondary dark:to-dark-bg">
        <div className="container-ksl">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">
            Ils nous font confiance
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Marie Koné",
                company: "E-commerce Plus",
                testimonial: "Super service, simple et efficace ! La livraison est rapide et le suivi en temps réel est génial."
              },
              {
                name: "Ahmed Diallo",
                company: "Tech Solutions",
                testimonial: "Katian a révolutionné notre logistique. Interface intuitive et support client exceptionnel."
              },
              {
                name: "Fatou Traoré",
                company: "Boutique Moderne",
                testimonial: "Depuis que nous utilisons Katian, nos clients sont plus satisfaits. Service de qualité !"
              }
            ].map((testimonial, i) => (
              <div key={i} className="bg-white dark:bg-dark-bg-secondary rounded-xl shadow-lg hover:shadow-xl p-6 flex flex-col items-center border border-gray-100 dark:border-gray-700 transition-all duration-300 transform hover:-translate-y-2">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-ksl-red to-ksl-red-dark flex items-center justify-center mb-4 shadow-md">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <p className="text-gray-700 dark:text-gray-200 mb-4 italic text-center leading-relaxed">
                  "{testimonial.testimonial}"
                </p>
                <div className="font-semibold text-ksl-red mb-2">{testimonial.name}</div>
                <Badge variant="info" className="shadow-sm">{testimonial.company}</Badge>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
} 