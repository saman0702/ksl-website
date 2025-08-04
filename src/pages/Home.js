import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '../components/ui';
import { ArrowRight, Star, Users, Package, Truck, Box, Building, DollarSign, RotateCcw, Search, Rocket, Printer, ArrowLeftRight, BarChart3, CreditCard, TrendingUp, Smartphone, User, ShoppingCart, MapPin, Banknote, Bike, Battery, Ruler, Calculator } from 'lucide-react';
import LocationSearch from '../components/ui/LocationSearch';
import { expeditionAPI } from '../services/api';

export default function Home() {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [isTrackingLoading, setIsTrackingLoading] = useState(false);
  const [trackingError, setTrackingError] = useState('');
  const [trackingResult, setTrackingResult] = useState(null);
  const [showTrackingModal, setShowTrackingModal] = useState(false);

  // Estimation states
  const [pickupLocation, setPickupLocation] = useState('');
  const [deliveryLocation, setDeliveryLocation] = useState('');
  const [length, setLength] = useState('');
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [isEstimationLoading, setIsEstimationLoading] = useState(false);
  const [estimationResult, setEstimationResult] = useState(null);

  const handleTracking = async (e) => {
    e.preventDefault();
    
    if (!trackingNumber.trim()) {
      setTrackingError('Veuillez saisir un numéro de suivi');
      return;
    }

    if (trackingNumber.length < 5) {
      setTrackingError('Le numéro de suivi doit contenir au moins 5 caractères');
      return;
    }

    setIsTrackingLoading(true);
    setTrackingError('');

    try {
      const response = await expeditionAPI.trackExpedition(trackingNumber);
      
      if (response && response.data) {
        setTrackingResult(response.data);
        setShowTrackingModal(true);
      } else {
        setTrackingError('Aucun colis trouvé avec ce numéro');
      }
    } catch (error) {
      console.error('Erreur lors du suivi:', error);
      if (error.response?.status === 404) {
        setTrackingError('Aucun colis trouvé avec ce numéro');
      } else if (error.response?.status === 400) {
        setTrackingError('Numéro de suivi invalide');
      } else {
        setTrackingError('Erreur de connexion. Veuillez réessayer.');
      }
    } finally {
      setIsTrackingLoading(false);
    }
  };

  const handleEstimation = async (e) => {
    e.preventDefault();
    
    if (!pickupLocation || !deliveryLocation || !length || !width || !height || !weight) {
      alert('Veuillez remplir tous les champs');
      return;
    }

    setIsEstimationLoading(true);

    try {
      const response = await expeditionAPI.calculateShipping({
        pickup_location: pickupLocation,
        delivery_location: deliveryLocation,
        dimensions: {
          length: parseFloat(length),
          width: parseFloat(width),
          height: parseFloat(height)
        },
        weight: parseFloat(weight)
      });
      
      setEstimationResult(response.data);
    } catch (error) {
      console.error('Erreur lors de l\'estimation:', error);
      alert('Erreur lors de l\'estimation. Veuillez réessayer.');
    } finally {
      setIsEstimationLoading(false);
    }
  };

  const handlePickupLocationSelect = (location) => {
    setPickupLocation(location);
  };

  const handleDeliveryLocationSelect = (location) => {
    setDeliveryLocation(location);
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'livré':
      case 'delivered':
        return <Package className="w-4 h-4 text-green-600" />;
      case 'en route':
      case 'in transit':
        return <Bike className="w-4 h-4 text-blue-600" />;
      case 'préparé':
      case 'prepared':
        return <Package className="w-4 h-4 text-yellow-600" />;
      default:
        return <Package className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'livré':
      case 'delivered':
        return 'bg-green-500';
      case 'en route':
      case 'in transit':
        return 'bg-blue-500';
      case 'préparé':
      case 'prepared':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <>
      {/* Hero Section */}
      <section className="py-7 md:py-15 bg-cover bg-center bg-no-repeat relative" style={{ backgroundImage: 'url(/hero.jpg)' }}>
        <div className="absolute inset-0 bg-black bg-opacity-40 backdrop-blur-sm"></div>
        <div className="relative z-10">
          <div className="container-ksl">
            <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white dark:text-white mb-6 sm:mb-8">
                Simplifiez Votre Livraison
              </h1>

              {/* Section de suivi de colis */}
              <div className="bg-white dark:bg-dark-bg-secondary rounded-xl shadow-xl p-6 mb-8 border border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Suivez votre colis
                </h2>
                <form onSubmit={handleTracking} className="flex flex-col sm:flex-row gap-4">
                  <input
                    type="text"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    placeholder="Ex: ABC00000000123456789"
                    className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-dark-bg-secondary text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-ksl-red"
                  />
                  <button
                    type="submit"
                    disabled={isTrackingLoading}
                    className="px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors duration-200 border border-green-600 flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isTrackingLoading ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <Search className="w-4 h-4" />
                    )}
                    {isTrackingLoading ? 'Recherche...' : 'Suivi'}
                  </button>
                </form>
                {trackingError && (
                  <div className="mt-3 text-sm text-red-600 dark:text-red-400">
                    {trackingError}
                  </div>
                )}
              </div>

              <p className="text-base sm:text-lg text-white/90 dark:text-gray-300 mb-6 sm:mb-8 max-w-3xl mx-auto px-4">
                Une solution complète pour gérer vos expéditions, points de relais, et paiements à la livraison en toute simplicité.
              </p>

              {/* Section d'estimation rapide */}
              <div className="bg-white dark:bg-dark-bg-secondary rounded-xl shadow-xl p-4 sm:p-6 border border-gray-200 dark:border-gray-700">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-4 sm:mb-6">
                  Estimation Rapide
                </h2>
                <form onSubmit={handleEstimation} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Lieu de ramassage
                      </label>
                      <LocationSearch
                        value={pickupLocation}
                        onChange={setPickupLocation}
                        onLocationSelect={handlePickupLocationSelect}
                        placeholder="Adresse de ramassage"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Lieu de Livraison
                      </label>
                      <LocationSearch
                        value={deliveryLocation}
                        onChange={setDeliveryLocation}
                        onLocationSelect={handleDeliveryLocationSelect}
                        placeholder="Adresse de livraison"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Longueur (L) en cm
                      </label>
                      <div className="relative">
                        <Ruler className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="number"
                          step="0.1"
                          min="0"
                          value={length}
                          onChange={(e) => setLength(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-dark-bg-secondary text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-ksl-red"
                          placeholder="0.0"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Largeur (l) en cm
                      </label>
                      <div className="relative">
                        <Ruler className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="number"
                          step="0.1"
                          min="0"
                          value={width}
                          onChange={(e) => setWidth(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-dark-bg-secondary text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-ksl-red"
                          placeholder="0.0"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Hauteur (h) en cm
                      </label>
                      <div className="relative">
                        <Ruler className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="number"
                          step="0.1"
                          min="0"
                          value={height}
                          onChange={(e) => setHeight(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-dark-bg-secondary text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-ksl-red"
                          placeholder="0.0"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Poids en kg
                      </label>
                      <div className="relative">
                        <Package className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="number"
                          step="0.1"
                          min="0"
                          value={weight}
                          onChange={(e) => setWeight(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-dark-bg-secondary text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-ksl-red"
                          placeholder="0.0"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="text-center">
                    <button
                      type="submit"
                      disabled={isEstimationLoading}
                      className="px-8 py-3 bg-ksl-red text-white font-medium rounded-lg hover:bg-ksl-red-dark transition-colors duration-200 border border-ksl-red flex items-center justify-center gap-2 mx-auto disabled:opacity-50"
                    >
                      {isEstimationLoading ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <Calculator className="w-4 h-4" />
                      )}
                      {isEstimationLoading ? 'Calcul...' : 'Estimer le coût'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modal de suivi */}
      {showTrackingModal && trackingResult && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white dark:bg-dark-bg-secondary rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-slide-up">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Suivi de Colis - {trackingResult.expedition_number}
              </h2>
              <button
                onClick={() => setShowTrackingModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Informations principales */}
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                      Code de retrait
                    </p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                      {trackingResult.code_retrait}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                      Statut
                    </p>
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${getStatusColor(trackingResult.statut)}`}></div>
                      <span className="text-lg font-semibold text-gray-900 dark:text-white">
                        {trackingResult.statut}
                      </span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                      Mode d'expédition
                    </p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                      {trackingResult.mode_expedition}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                      Transporteur
                    </p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                      {trackingResult.transporteur}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                      Point relais
                    </p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                      {trackingResult.pointrelais}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                      Adresse expéditeur
                    </p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                      {trackingResult.adresse_expediteur}
                    </p>
                  </div>
                </div>
              </div>

              {/* Timeline de progression */}
              <div className="relative">
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700"></div>
                
                <div className="space-y-8">
                  {/* Étape 1: Commande créée */}
                  <div className="relative flex items-start animate-fade-in" style={{ animationDelay: '0.1s' }}>
                    <div className="flex-shrink-0 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center z-10 relative">
                      <Package className="w-4 h-4 text-white" />
                    </div>
                    <div className="ml-6 flex-1">
                      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-300">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold text-gray-900 dark:text-white">Commande créée</h3>
                          <span className="text-sm text-green-600 dark:text-green-400">Terminé</span>
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
                          <p>Numéro de commande: {trackingResult.order_number}</p>
                          <p>Informations colis: {trackingResult.infocolis}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Étape 2: Colis préparé */}
                  <div className="relative flex items-start animate-fade-in" style={{ animationDelay: '0.2s' }}>
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center z-10 relative ${
                      trackingResult.statut === 'En préparation' ? 'bg-yellow-500' : 'bg-gray-300'
                    }`}>
                      <Package className="w-4 h-4 text-white" />
                    </div>
                    <div className="ml-6 flex-1">
                      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-300">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold text-gray-900 dark:text-white">Colis préparé</h3>
                          <span className={`text-sm ${
                            trackingResult.statut === 'En préparation' ? 'text-yellow-600 dark:text-yellow-400' : 'text-gray-400'
                          }`}>
                            {trackingResult.statut === 'En préparation' ? 'En cours' : 'En attente'}
                          </span>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                          <div className="space-y-1">
                            <p className="text-xs text-gray-600 dark:text-gray-300">Détails de préparation:</p>
                            <div key={0} className="flex items-center justify-between text-xs">
                              <span>Poids: {trackingResult.weight} kg</span>
                              <span>Dimensions: {trackingResult.dimensions}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Étape 3: En route */}
                  <div className="relative flex items-start animate-fade-in" style={{ animationDelay: '0.3s' }}>
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center z-10 relative ${
                      trackingResult.statut === 'En route' ? 'bg-blue-500' : 'bg-gray-300'
                    }`}>
                      <Bike className="w-4 h-4 text-white" />
                    </div>
                    <div className="ml-6 flex-1">
                      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-300">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold text-gray-900 dark:text-white">En route</h3>
                          <span className={`text-sm ${
                            trackingResult.statut === 'En route' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400'
                          }`}>
                            {trackingResult.statut === 'En route' ? 'En cours' : 'En attente'}
                          </span>
                        </div>
                        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
                          <div className="flex items-center gap-2">
                            <Bike className="w-4 h-4 text-blue-600" />
                            <div className="text-xs text-blue-700 dark:text-blue-300">
                              <p>Transporteur: {trackingResult.transporteur}</p>
                              <p>Délai de livraison: {trackingResult.delais_livraison}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Étape 4: Livré */}
                  <div className="relative flex items-start animate-fade-in" style={{ animationDelay: '0.4s' }}>
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center z-10 relative ${
                      trackingResult.statut === 'Livré' ? 'bg-green-500' : 'bg-gray-300'
                    }`}>
                      <Package className="w-4 h-4 text-white" />
                    </div>
                    <div className="ml-6 flex-1">
                      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-300">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold text-gray-900 dark:text-white">Livré</h3>
                          <span className={`text-sm ${
                            trackingResult.statut === 'Livré' ? 'text-green-600 dark:text-green-400' : 'text-gray-400'
                          }`}>
                            {trackingResult.statut === 'Livré' ? 'Terminé' : 'En attente'}
                          </span>
                        </div>
                        <div className="mt-3 bg-green-50 dark:bg-green-900/20 rounded-lg p-3">
                          <div className="flex items-center gap-2">
                            <Package className="w-4 h-4 text-green-600" />
                            <div className="text-xs text-green-700 dark:text-green-300">
                              <p>Point de livraison: {trackingResult.pointrelais}</p>
                              <p>Adresse: {trackingResult.adresse_destinataire}</p>
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
                onClick={() => setShowTrackingModal(false)}
                className="px-6 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Chiffres clés */}
      <section className="hidden py-16 bg-gray-50 dark:bg-dark-bg-secondary">
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
      <section className="hidden py-16 md:py-20 bg-white dark:bg-dark-bg">
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

      {/* Services de livraison */}
      <section className="py-16 md:py-20 bg-gradient-to-br from-gray-50 to-white dark:from-dark-bg-secondary dark:to-dark-bg">
        <div className="container-ksl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              NOS SERVICES DE LIVRAISONS
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Trouvez la formule qui correspond à vos besoins professionnels ou personnels.
            </p>
          </div>

          <div className="space-y-8">
            {/* Première ligne - 2 cartes centrées */}
            <div className="flex justify-center">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
                <div className="bg-white dark:bg-dark-bg rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-2 border-red-500">
                  <div className="flex items-center justify-center w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg mb-4">
                    <Bike className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                    Livraison Flash
                  </h3>
                  <div className="space-y-2">
                    <p className="text-gray-600 dark:text-gray-300">
                      Idéale pour les livraisons très urgentes
                    </p>
                    <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
                      <span>Zone: Locale</span>
                      <span>Délai: 0 à 2h</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-dark-bg rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-2 border-red-500">
                  <div className="flex items-center justify-center w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg mb-4">
                    <Bike className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                    Livraison Express
                  </h3>
                  <div className="space-y-2">
                    <p className="text-gray-600 dark:text-gray-300">
                      Idéale pour les livraisons urgentes
                    </p>
                    <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
                      <span>Zone: Locale</span>
                      <span>Délai: en 24h</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Deuxième ligne - 3 cartes */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white dark:bg-dark-bg rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-center w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg mb-4">
                  <Bike className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  Livraison Standard
                </h3>
                <div className="space-y-2">
                  <p className="text-gray-600 dark:text-gray-300">
                    Un bon compromis entre rapidité et coût
                  </p>
                  <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
                    <span>Zone: Locale</span>
                    <span>Délai: 1 à 2 jours ouvrés</span>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-dark-bg rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-center w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg mb-4">
                  <Bike className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  Livraison Éco
                </h3>
                <div className="space-y-2">
                  <p className="text-gray-600 dark:text-gray-300">
                    Pour vos envois non urgents, à petit prix
                  </p>
                  <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
                    <span>Zone: Locale</span>
                    <span>Délai: 2 à 3 jours ouvrés</span>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-dark-bg rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-center w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg mb-4">
                  <Bike className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  Livraison Régionale
                </h3>
                <div className="space-y-2">
                  <p className="text-gray-600 dark:text-gray-300">
                    Pour les envois entre villes ou à l'intérieur du pays
                  </p>
                  <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
                    <span>Zone: Régionale / Interurbaine</span>
                    <span>Délai: 2 à 7 jours</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section Pour qui? */}
      <section className="py-16 md:py-20 bg-white dark:bg-dark-bg">
        <div className="container-ksl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Pour qui?
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Des solutions adaptées à différents profils d'utilisateurs et secteurs d'activité
            </p>
          </div>

          <div className="space-y-8">
            {/* Première ligne - 2 cartes */}
            <div className="flex justify-center">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
                <div className="bg-white dark:bg-dark-bg rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-red-500">
                  <div className="flex items-center justify-center w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg mb-4">
                    <User className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                    Particuliers
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Envoyez et recevez des colis facilement, sans tracas administratifs.
                  </p>
                </div>

                <div className="bg-white dark:bg-dark-bg rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-red-500">
                  <div className="flex items-center justify-center w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg mb-4">
                    <Building className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                    Entreprises
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Optimisez votre chaîne logistique et réduisez vos coûts d'expédition.
                  </p>
                </div>
              </div>
            </div>

            {/* Deuxième ligne - 3 cartes */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white dark:bg-dark-bg rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-red-500">
                <div className="flex items-center justify-center w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg mb-4">
                  <ShoppingCart className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  E-commerçants
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Améliorez votre service client avec des livraisons rapides et fiables.
                </p>
              </div>

              <div className="bg-white dark:bg-dark-bg rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-red-500">
                <div className="flex items-center justify-center w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-lg mb-4">
                  <MapPin className="w-6 h-6 text-red-600 dark:text-red-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  Points de relais
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Générez des revenus supplémentaires en devenant un point de collecte et livraison.
                </p>
              </div>

              <div className="bg-white dark:bg-dark-bg rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-red-500">
                <div className="flex items-center justify-center w-12 h-12 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg mb-4">
                  <Truck className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  Transporteurs
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Augmentez votre volume d'affaires en rejoignant notre réseau de transport.
                </p>
              </div>
            </div>
          </div>

          {/* Bouton d'action */}
          <div className="text-center mt-12">
            <Link 
              to="/pour-qui" 
              className="inline-flex items-center justify-center px-8 py-3 bg-ksl-red text-white font-medium rounded-lg hover:bg-ksl-red-dark transition-all duration-200 group shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Découvrir pour qui
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* Section Fonctionnalités */}
      <section className="hidden py-16 md:py-20 bg-gray-50 dark:bg-dark-bg-secondary">
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
      <section className="hidden py-16 md:py-20 bg-gray-50 dark:bg-dark-bg-secondary">
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