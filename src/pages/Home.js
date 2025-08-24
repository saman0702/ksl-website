import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Badge } from '../components/ui';
import { ArrowRight, Star, Users, Package, Truck, Box, Building, DollarSign, RotateCcw, Search, Rocket, Printer, ArrowLeftRight, BarChart3, CreditCard, TrendingUp, Smartphone, User, ShoppingCart, MapPin, Banknote, Bike, Battery, Ruler, Calculator } from 'lucide-react';
import LocationSearch from '../components/ui/LocationSearch';
import { expeditionAPI, carrierAPI, relayAPI } from '../services/api';
import { calculateTariff } from '../services/tariffServiceSimulateur';

export default function Home() {
  const navigate = useNavigate();
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
  const [declaredValue, setDeclaredValue] = useState('');
  const [deliveryMode, setDeliveryMode] = useState('domicile');
  const [serviceType, setServiceType] = useState('standard');
  const [isEstimationLoading, setIsEstimationLoading] = useState(false);
  const [estimationResult, setEstimationResult] = useState(null);
  const [carrierName, setCarrierName] = useState('');
  const [relayName, setRelayName] = useState('');
  const [showSimulation, setShowSimulation] = useState(false);
  const [showEstimationForm, setShowEstimationForm] = useState(false);
  const [showEstimationModal, setShowEstimationModal] = useState(false);
  
  // États pour les formats de colis
  const [selectedPackageFormat, setSelectedPackageFormat] = useState('');
  const [showCustomDimensions, setShowCustomDimensions] = useState(false);

  // Formats de colis prédéfinis
  const packageFormats = [
    {
      id: 'xs',
      name: 'XS – Petit Colis',
      description: 'Documents, accessoires, petits appareils',
      dimensions: { length: 25, width: 20, height: 10 },
      weight: 2,
      volume: 5000,
      examples: 'Documents, accessoires, petits appareils'
    },
    {
      id: 's',
      name: 'S – Colis Moyen',
      description: 'Vêtements, petite électronique, articles ménagers',
      dimensions: { length: 40, width: 25, height: 20 },
      weight: 5,
      volume: 20000,
      examples: 'Vêtements, petite électronique, articles ménagers'
    },
    {
      id: 'm',
      name: 'M – Colis Standard',
      description: 'Électroménager compact, produits alimentaires',
      dimensions: { length: 50, width: 30, height: 30 },
      weight: 15,
      volume: 50000,
      examples: 'Électroménager compact, produits alimentaires'
    },
    {
      id: 'l',
      name: 'L – Grand Colis',
      description: 'Matériel professionnel, gros équipements',
      dimensions: { length: 60, width: 40, height: 50 },
      weight: 25,
      volume: 120000,
      examples: 'Matériel professionnel, gros équipements'
    },
    {
      id: 'xl',
      name: 'XL – Colis Spécial / Hors Gabarit',
      description: 'Format personnalisé - saisie manuelle requise',
      dimensions: { length: 0, width: 0, height: 0 },
      weight: 0,
      volume: 0,
      examples: 'Format personnalisé - saisie manuelle requise'
    }
  ];

  // Fonction pour gérer le changement de format de colis
  const handlePackageFormatChange = (formatId) => {
    setSelectedPackageFormat(formatId);
    
    if (formatId === 'xl') {
      setShowCustomDimensions(true);
      setLength('');
      setWidth('');
      setHeight('');
      setWeight('');
    } else {
      setShowCustomDimensions(false);
      const format = packageFormats.find(f => f.id === formatId);
      if (format) {
        setLength(format.dimensions.length.toString());
        setWidth(format.dimensions.width.toString());
        setHeight(format.dimensions.height.toString());
        setWeight(format.weight.toString());
      }
    }
  };

  const getCarrierName = async (carrierId) => {
    try {
      const response = await carrierAPI.getAllCarriers();
    //   console.log('📦 [getCarrierName] → Réponse complète:', response.data);
    //   console.log('📦 [getCarrierName] → ID recherché:', carrierId);
      const carrier = response.data.find(c => c.id === carrierId);
      console.log('📦 [getCarrierName] → Transporteur trouvé:', carrier);
      return carrier ? carrier.nom : `Transporteur ${carrierId}`;
    } catch (error) {
      console.error('Erreur récupération transporteur:', error);
      return `Transporteur ${carrierId}`;
    }
  };

  const getRelayName = async (relayId) => {
    try {
      const response = await relayAPI.getAllRelays();
    //   console.log('🏪 [getRelayName] → Réponse complète:', response.data);
    //   console.log('🏪 [getRelayName] → ID recherché:', relayId);
      const relay = response.data.find(r => r.id === relayId);
    //   console.log('🏪 [getRelayName] → Point relais trouvé:', relay);
      return relay ? relay.nom : `Point relais ${relayId}`;
    } catch (error) {
      console.error('Erreur récupération point relais:', error);
      return `Point relais ${relayId}`;
    }
  };

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
        
        // Log pour déboguer la structure des données
        console.log('📦 [handleTracking] → Structure complète:', response.data);
        console.log('📦 [handleTracking] → Adresse expéditeur:', response.data.adresse_expediteur);
        console.log('📦 [handleTracking] → Adresse destinataire:', response.data.adresse_destinataire);
        console.log('📦 [handleTracking] → Type adresse expéditeur:', typeof response.data.adresse_expediteur);
        console.log('📦 [handleTracking] → Type adresse destinataire:', typeof response.data.adresse_destinataire);
        
        // Récupérer les noms du transporteur et point relais
        try {
          const [carrierNameResult, relayNameResult] = await Promise.all([
            getCarrierName(response.data.transporteur),
            getRelayName(response.data.pointrelais)
          ]);
          setCarrierName(carrierNameResult);
          setRelayName(relayNameResult);
        } catch (error) {
          console.error('Erreur récupération noms:', error);
          setCarrierName(`Transporteur ${response.data.transporteur}`);
          setRelayName(`Point relais ${response.data.pointrelais}`);
        }
        
        setShowTrackingModal(true);
      } else {
        setTrackingError('Aucun colis trouvé avec ce numéro');
      }
    } catch (error) {
      console.error('Erreur lors du suivi:', error);
      if (error.response?.status === 404) {
        setTrackingError('Aucun colis trouvé avec ce numéro');
      } else if (error.response?.status === 400) {
        // setTrackingError('Numéro de suivi invalide');
        setTrackingError('Aucun colis trouvé avec se numero ou erreur réseau');
        toast.error('Numéro de suivi invalide');
      } else {
        setTrackingError('Erreur de connexion. Veuillez réessayer.');
      }
    } finally {
      setIsTrackingLoading(false);
    }
  };


  const handleEstimation = async (e) => {
    e.preventDefault();
    setIsEstimationLoading(true);
    setEstimationResult(null);
    setShowSimulation(true);

    try {
      // Validation des données
      if (!pickupLocation || !deliveryLocation || !selectedPackageFormat) {
        throw new Error('Veuillez sélectionner un format de colis et remplir les adresses');
      }

      if (selectedPackageFormat === 'xl' && (!length || !width || !height || !weight)) {
        throw new Error('Pour le format XL, veuillez saisir toutes les dimensions et le poids');
      }

      // Extraire les noms des villes des objets LocationSearch
      const getCityName = (location) => {
        if (!location) return '';
        if (typeof location === 'string') return location;
        if (typeof location === 'object') {
          // Pour LocationSearch, utiliser address qui contient l'adresse complète
          return location.address || location.name || location.label || location.value || location.city || '';
        }
        return '';
      };

      // Préparer les données pour le calcul de tarif
      const shipmentData = {
        originCity: getCityName(pickupLocation),
        destinationCity: getCityName(deliveryLocation),
        weight: parseFloat(weight),
        length: parseFloat(length),
        width: parseFloat(width),
        height: parseFloat(height),
        volumeCm3: parseFloat(length) * parseFloat(width) * parseFloat(height),
        carrierId: 1, // Transporteur ID 1 par défaut
        serviceType: serviceType,
        isInsured: declaredValue > 0,
        declaredValue: parseFloat(declaredValue) || 0,
        distance: 0, // Sera calculé automatiquement si nécessaire
        isDepotRelayPoint: deliveryMode === 'relais',
        isPickupRelayPoint: deliveryMode === 'relais',
        isHolidayWeekend: false,
        vehicleType: 'voiture'
      };

      // console.log('📦 [handleEstimation] → Données d\'expédition:', shipmentData);
      // console.log('📦 [handleEstimation] → pickupLocation type:', typeof pickupLocation, 'value:', pickupLocation);
      // console.log('📦 [handleEstimation] → deliveryLocation type:', typeof deliveryLocation, 'value:', deliveryLocation);
      // console.log('📦 [handleEstimation] → originCity extrait:', shipmentData.originCity);
      // console.log('📦 [handleEstimation] → destinationCity extrait:', shipmentData.destinationCity);
      // console.log('📦 [handleEstimation] → pickupLocation.address:', pickupLocation?.address);
      // console.log('📦 [handleEstimation] → deliveryLocation.address:', deliveryLocation?.address);
      // console.log('📦 [handleEstimation] → declaredValue:', declaredValue);
      // console.log('📦 [handleEstimation] → deliveryMode:', deliveryMode);
      // console.log('📦 [handleEstimation] → serviceType:', serviceType);

      // Calculer le tarif avec le transporteur ID 1
      let result = await calculateTariff(shipmentData);
      
      // Si le transporteur ID 1 n'a pas de tarification, essayer avec ID 4
      if (!result.success) {
        console.log('🔄 [handleEstimation] → Transporteur ID 1 échoué, essai avec ID 4');
        shipmentData.carrierId = 4;
        result = await calculateTariff(shipmentData);
      }

      if (result.success) {
        setEstimationResult({
          success: true,
          price: result.finalPrice,
          currency: result.currency,
          details: {
            weight: shipmentData.weight,
            volume: shipmentData.volumeCm3 / 1000000, // en m³
            basePrice: result.breakdown.basePrice,
            weightPrice: result.breakdown.weightTariff,
            volumePrice: result.breakdown.volumeTariff,
            zonePrice: result.breakdown.zoneTariff,
            cityPrice: result.breakdown.cityTariff,
            factors: result.breakdown.factors,
            tariffGrid: result.details.tariffGrid,
            originCity: result.details.originCity,
            destinationCity: result.details.destinationCity
          }
        });
        setShowEstimationModal(true);
      } else {
        throw new Error('Impossible de calculer le tarif avec les transporteurs disponibles');
      }
    } catch (error) {
      console.error('❌ [handleEstimation] → Erreur estimation:', error);
      setEstimationResult({
        success: false,
        error: error.message
      });
    } finally {
      setIsEstimationLoading(false);
      setShowSimulation(false);
    }
  };

  const handlePickupLocationSelect = (location) => {
    // Stocker l'objet complet pour le calcul
    setPickupLocation(location);
    // Mais afficher seulement l'adresse dans le champ
    console.log('📍 [handlePickupLocationSelect] → Location sélectionnée:', location);
  };

  const handleDeliveryLocationSelect = (location) => {
    // Stocker l'objet complet pour le calcul
    setDeliveryLocation(location);
    // Mais afficher seulement l'adresse dans le champ
    console.log('📍 [handleDeliveryLocationSelect] → Location sélectionnée:', location);
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
      case 'livre':
        return 'bg-green-500';
      case 'en route':
      case 'in transit':
      case 'en transit':
        return 'bg-blue-500';
      case 'préparé':
      case 'prepared':
      case 'preparé':
        return 'bg-yellow-500';
      case 'en attente':
      case 'pending':
        return 'bg-yellow-500';
      case 'annulé':
      case 'cancelled':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  // Fonction pour extraire les informations d'adresse
  const extractAddressInfo = (addressObj) => {
    if (!addressObj) return { name: 'Non renseigné', phone: 'Non renseigné', email: 'Non renseigné', address: 'Non renseigné' };
    
    // Si c'est une chaîne, la retourner directement
    if (typeof addressObj === 'string') {
      return { name: addressObj, phone: 'Non renseigné', email: 'Non renseigné', address: addressObj };
    }
    
    // Si c'est un objet, extraire les propriétés
    if (typeof addressObj === 'object') {
      return {
        name: `${addressObj.customer_first_name || ''} ${addressObj.customer_last_name || ''}`.trim() || 
              `${addressObj.recipient_first_name || ''} ${addressObj.recipient_last_name || ''}`.trim() ||
              addressObj.name || 'Non renseigné',
        phone: addressObj.customer_phone_number || addressObj.pickup_phone_number || 'Non renseigné',
        email: addressObj.customer_email || addressObj.email || addressObj.recipient_email || addressObj.pickup_email || 'Non renseigné',
        address: addressObj.address || addressObj.full_address || 'Non renseigné',
        company: addressObj.pickup_company_name || addressObj.company_name || ''
      };
    }
    
    return { name: 'Non renseigné', phone: 'Non renseigné', email: 'Non renseigné', address: 'Non renseigné' };
  };

  const handleCommander = () => {
    // Préparer les données pour la page Expedier
    const expeditionData = {
      pickupLocation: pickupLocation,
      deliveryLocation: deliveryLocation,
      dimensions: {
        length: parseFloat(length),
        width: parseFloat(width),
        height: parseFloat(height)
      },
      weight: parseFloat(weight),
      declaredValue: parseFloat(declaredValue) || 0,
      deliveryMode: deliveryMode,
      serviceType: serviceType,
      estimatedPrice: estimationResult?.price || 0,
      estimationDetails: estimationResult?.details || {}
    };

    // Stocker les données dans localStorage pour les récupérer dans Expedier
    localStorage.setItem('ksl_expedition_data', JSON.stringify(expeditionData));
    
    // Naviguer vers la page Expedier
    navigate('/expedier');
  };

  return (
    <>
            {/* Hero Section */}
      <section className="py-7 md:py-15 bg-cover bg-center bg-no-repeat relative" style={{ backgroundImage: 'url(/hero.jpg)' }}>
        <div className="absolute inset-0 bg-black bg-opacity-40 backdrop-blur-sm"></div>
        <div className="relative z-10">
          <div className="container-ksl">
            <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white dark:text-white mb-4 sm:mb-6 md:mb-8">
                Simplifiez Votre Livraison
              </h1>

            {/* Section de suivi de colis */}
            <div className="bg-white dark:bg-dark-bg-secondary rounded-xl shadow-xl p-6 mb-8 border border-gray-200 dark:border-gray-700">
              {/* Bouton Expédition en mode responsive - visible seulement sur mobile */}
              <div className="block sm:hidden mb-4">
                <button
                  onClick={handleCommander}
                  className="w-full px-4 py-3 bg-ksl-red text-white font-medium rounded-lg hover:bg-ksl-red-dark transition-colors duration-200 border border-ksl-red flex items-center justify-center gap-2"
                >
                  <Package className="w-4 h-4" />
                  Expédition
                </button>
              </div>
              
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Suivez votre colis
              </h2>
                <form onSubmit={handleTracking} className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <input
                  type="text"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  placeholder="Ex: ABC00000000123456789"
                    className="flex-1 px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-dark-bg-secondary text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-ksl-red"
                />
                <button
                  type="submit"
                  disabled={isTrackingLoading}
                    className="px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors duration-200 border border-green-600 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isTrackingLoading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <Search className="w-4 h-4" />
                  )}
                  {isTrackingLoading ? 'Recherche...' : 'Suivre'}
                </button>
              </form>
              {trackingError && (
                <div className="mt-3 text-sm text-red-600 dark:text-red-400">
                  {trackingError}
                </div>
              )}
            </div>

              <p className="text-sm sm:text-base md:text-lg text-white/90 dark:text-gray-300 mb-4 sm:mb-6 md:mb-8 max-w-3xl mx-auto px-2 sm:px-4">
                Une solution complète pour gérer vos expéditions, points de relais, et paiements à la livraison en toute simplicité.
              </p>

            {/* Section d'estimation rapide */}
              <div className="bg-white dark:bg-dark-bg-secondary rounded-xl shadow-xl p-3 sm:p-4 md:p-6 border border-gray-200 dark:border-gray-700">
                
                {/* Simulation animée */}
                {showSimulation && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in">
                    <div className="bg-white dark:bg-dark-bg-secondary rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl animate-slide-up">
                      <div className="text-center space-y-6">
                        {/* Icône de calcul animée */}
                        <div className="relative">
                          <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto animate-pulse">
                            <Calculator className="w-10 h-10 text-white" />
                          </div>
                          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-ping opacity-20"></div>
                        </div>
                        
                        {/* Titre */}
                        <div>
                          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                            Calcul en cours...
                          </h3>
                          <p className="text-gray-600 dark:text-gray-300">
                            Simulation de votre tarif de livraison
                          </p>
                        </div>
                        
                        {/* Barre de progression */}
                        <div className="space-y-3">
                          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
                            <span>Analyse des données</span>
                            <span className="animate-pulse">✓</span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full animate-pulse" style={{width: '60%'}}></div>
                          </div>
                          
                          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
                            <span>Calcul du tarif</span>
                            <span className="animate-pulse">⏳</span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div className="bg-gradient-to-r from-purple-500 to-pink-600 h-2 rounded-full animate-pulse" style={{width: '80%'}}></div>
                          </div>
                          
                          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
                            <span>Finalisation</span>
                            <span className="animate-pulse">⏳</span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div className="bg-gradient-to-r from-pink-500 to-red-600 h-2 rounded-full animate-pulse" style={{width: '40%'}}></div>
                          </div>
                        </div>
                        
                        {/* Messages de statut */}
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            <span>Vérification des dimensions...</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                            <span>Calcul du volume et poids...</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                            <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                            <span>Application des tarifs...</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Header avec bouton toggle */}
                <div className="flex items-center justify-between mb-3 sm:mb-4 md:mb-6">
                  <h2 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900 dark:text-white animate-fade-in">
                Estimation Rapide
              </h2>
                  <button
                    onClick={() => setShowEstimationForm(!showEstimationForm)}
                    className="flex items-center gap-2 px-4 py-2 bg-ksl-red text-white rounded-lg hover:bg-ksl-red-dark transition-all duration-300 transform hover:scale-105 active:scale-95 text-sm font-medium shadow-md hover:shadow-lg"
                  >
                    {showEstimationForm ? (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                        </svg>
                        Masquer
                      </>
                    ) : (
                      <>
                        <Calculator className="w-4 h-4" />
                        Afficher l'estimation
                      </>
                    )}
                  </button>
                </div>
                                {showEstimationForm && (
                  <div className="animate-slide-down">
                    <form onSubmit={handleEstimation} className="space-y-3 sm:space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                          <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">
                      Lieu de ramassage
                    </label>
                    <LocationSearch
                          value={typeof pickupLocation === 'object' ? pickupLocation?.address || '' : pickupLocation}
                          onChange={(value) => {
                            // Si c'est une chaîne (saisie manuelle), on la stocke directement
                            if (typeof value === 'string') {
                              setPickupLocation(value);
                            }
                            // Si c'est un objet (sélection depuis la liste), on le stocke
                            else if (typeof value === 'object') {
                              setPickupLocation(value);
                            }
                          }}
                      onLocationSelect={handlePickupLocationSelect}
                      placeholder="Adresse de ramassage"
                    />
                  </div>
                  <div>
                          <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">
                      Lieu de Livraison
                    </label>
                    <LocationSearch
                          value={typeof deliveryLocation === 'object' ? deliveryLocation?.address || '' : deliveryLocation}
                          onChange={(value) => {
                            // Si c'est une chaîne (saisie manuelle), on la stocke directement
                            if (typeof value === 'string') {
                              setDeliveryLocation(value);
                            }
                            // Si c'est un objet (sélection depuis la liste), on le stocke
                            else if (typeof value === 'object') {
                              setDeliveryLocation(value);
                            }
                          }}
                      onLocationSelect={handleDeliveryLocationSelect}
                      placeholder="Adresse de livraison"
                    />
              </div>
            </div>

                {/* Sélecteur de format de colis */}
                <div className="mb-4">
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">
                    Format de colis *
                  </label>
                  <select
                    value={selectedPackageFormat}
                    onChange={(e) => handlePackageFormatChange(e.target.value)}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-dark-bg-secondary text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-ksl-red"
                  >
                    <option value="">Sélectionnez un format</option>
                    {packageFormats.map((format) => (
                      <option key={format.id} value={format.id}>
                        {format.name} - {format.description}
                      </option>
                    ))}
                  </select>
                  {selectedPackageFormat && selectedPackageFormat !== 'xl' && (
                    <div className="mt-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <p className="text-xs text-blue-700 dark:text-blue-300">
                        <strong>Format sélectionné :</strong> {packageFormats.find(f => f.id === selectedPackageFormat)?.name}
                      </p>
                      <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                        Dimensions : {packageFormats.find(f => f.id === selectedPackageFormat)?.dimensions.length} × {packageFormats.find(f => f.id === selectedPackageFormat)?.dimensions.width} × {packageFormats.find(f => f.id === selectedPackageFormat)?.dimensions.height} cm
                      </p>
                      <p className="text-xs text-blue-600 dark:text-blue-400">
                        Poids : {packageFormats.find(f => f.id === selectedPackageFormat)?.weight} kg
                      </p>
                    </div>
                  )}
                </div>

                {/* Champs de dimensions - affichés seulement pour XL ou si showCustomDimensions est true */}
                {(showCustomDimensions || selectedPackageFormat === 'xl') && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                      <div>
                          <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">
                        Longueur (L) en cm
                      </label>
                  <div className="relative">
                            <Ruler className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                        <input
                          type="number"
                          step="0.1"
                          min="0"
                          value={length}
                          onChange={(e) => setLength(e.target.value)}
                            className="w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-dark-bg-secondary text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-ksl-red"
                            placeholder="0.0"
                    />
                  </div>
                      </div>
                      <div>
                          <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">
                        Largeur (l) en cm
                      </label>
                      <div className="relative">
                          <Ruler className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                        <input
                          type="number"
                          step="0.1"
                          min="0"
                          value={width}
                          onChange={(e) => setWidth(e.target.value)}
                            className="w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-dark-bg-secondary text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-ksl-red"
                            placeholder="0.0"
                        />
                      </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                      <div>
                          <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">
                        Hauteur (h) en cm
                      </label>
                      <div className="relative">
                          <Ruler className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                        <input
                          type="number"
                          step="0.1"
                          min="0"
                          value={height}
                          onChange={(e) => setHeight(e.target.value)}
                            className="w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-dark-bg-secondary text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-ksl-red"
                            placeholder="0.0"
                        />
                      </div>
                      </div>
                      <div>
                          <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">
                        Poids en kg
                      </label>
                      <div className="relative">
                          <Package className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                        <input
                          type="number"
                          step="0.1"
                          min="0"
                          value={weight}
                          onChange={(e) => setWeight(e.target.value)}
                            className="w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-dark-bg-secondary text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-ksl-red"
                            placeholder="0.0"
                        />
                      </div>
                      </div>
                    </div>
                  </>
                )}
                
                  {/* Nouveaux champs */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">
                        Valeur déclarée (FCFA)
                      </label>
                      <div className="relative">
                        <Calculator className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                        <input
                          type="number"
                          step="1000"
                          min="0"
                          value={declaredValue}
                          onChange={(e) => setDeclaredValue(e.target.value)}
                          className="w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-dark-bg-secondary text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-ksl-red"
                          placeholder="0"
                        />
                </div>
            </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-2 flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Mode d'expédition *
                      </label>
                      
                      <div className="grid grid-cols-2 gap-2">
                        {/* Carte Livraison à domicile */}
                        <div 
                          className={`relative cursor-pointer rounded-lg border-2 p-2 transition-all duration-200 ${
                            deliveryMode === 'domicile' 
                              ? 'border-ksl-red bg-ksl-red/5 dark:bg-ksl-red/10' 
                              : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-bg-secondary hover:border-ksl-red/50'
                          }`}
                          onClick={() => setDeliveryMode('domicile')}
                        >
                          <div className="flex flex-col items-center text-center space-y-1">
                            {/* Icône maison */}
                            <div className="w-8 h-8 flex items-center justify-center">
                              <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                              </svg>
          </div>
                            <span className="text-xs font-medium text-gray-900 dark:text-white">
                              Livraison à domicile
                            </span>
        </div>
                          
                          {/* Indicateur de sélection */}
                          {deliveryMode === 'domicile' && (
                            <div className="absolute top-1 right-1 w-3 h-3 bg-ksl-red rounded-full flex items-center justify-center">
                              <svg className="w-1.5 h-1.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
        </div>
                          )}
                        </div>

                        {/* Carte Dépôt en point relais */}
                        <div 
                          className={`relative cursor-pointer rounded-lg border-2 p-2 transition-all duration-200 ${
                            deliveryMode === 'relais' 
                              ? 'border-ksl-red bg-ksl-red/5 dark:bg-ksl-red/10' 
                              : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-bg-secondary hover:border-ksl-red/50'
                          }`}
                          onClick={() => setDeliveryMode('relais')}
                        >
                          <div className="flex flex-col items-center text-center space-y-1">
                            {/* Icône magasin avec badge */}
                            <div className="relative w-8 h-8 flex items-center justify-center">
                              <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                              </svg>
                              {/* Badge 24h */}
                              <div className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-orange-500 rounded-full flex items-center justify-center">
                                <span className="text-xs font-bold text-white">24</span>
                              </div>
                            </div>
                            <span className="text-xs font-medium text-gray-900 dark:text-white">
                              Dépôt en point relais
                            </span>
            </div>

                          {/* Indicateur de sélection */}
                          {deliveryMode === 'relais' && (
                            <div className="absolute top-1 right-1 w-3 h-3 bg-ksl-red rounded-full flex items-center justify-center">
                              <svg className="w-1.5 h-1.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
                        Choisissez entre livraison directe ou dépôt en point relais
                    </p>
                  </div>
                  </div>

                  <div className="grid grid-cols-1 gap-3 sm:gap-4">
                  <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-2 flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        Type de service *
                      </label>
                      
                      <div className="grid grid-cols-3 gap-2">
                        {/* Carte Livraison Flash */}
                        <div 
                          className={`relative cursor-pointer rounded-lg border-2 p-2 transition-all duration-200 ${
                            serviceType === 'flash' 
                              ? 'border-ksl-red bg-ksl-red/5 dark:bg-ksl-red/10' 
                              : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-bg-secondary hover:border-ksl-red/50'
                          }`}
                          onClick={() => setServiceType('flash')}
                        >
                          <div className="flex flex-col items-center text-center space-y-1">
                            {/* Icône éclair */}
                            <div className="w-6 h-6 flex items-center justify-center">
                              <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M13 10V3L4 14h7v7l9-11h-7z"/>
                              </svg>
                            </div>
                            <span className="text-xs font-medium text-gray-900 dark:text-white">
                              Livraison Flash
                      </span>
                    </div>
                          
                          {/* Indicateur de sélection */}
                          {serviceType === 'flash' && (
                            <div className="absolute top-1 right-1 w-3 h-3 bg-ksl-red rounded-full flex items-center justify-center">
                              <svg className="w-1.5 h-1.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                  </div>
                          )}
                </div>

                        {/* Carte Livraison Express */}
                        <div 
                          className={`relative cursor-pointer rounded-lg border-2 p-2 transition-all duration-200 ${
                            serviceType === 'express' 
                              ? 'border-ksl-red bg-ksl-red/5 dark:bg-ksl-red/10' 
                              : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-bg-secondary hover:border-ksl-red/50'
                          }`}
                          onClick={() => setServiceType('express')}
                        >
                          <div className="flex flex-col items-center text-center space-y-1">
                            {/* Icône express */}
                            <div className="w-6 h-6 flex items-center justify-center">
                              <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                              </svg>
                            </div>
                            <span className="text-xs font-medium text-gray-900 dark:text-white">
                              Livraison Express
                            </span>
              </div>

                          {/* Indicateur de sélection */}
                          {serviceType === 'express' && (
                            <div className="absolute top-1 right-1 w-3 h-3 bg-ksl-red rounded-full flex items-center justify-center">
                              <svg className="w-1.5 h-1.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                    </div>
                          )}
                    </div>

                        {/* Carte Livraison Standard */}
                        <div 
                          className={`relative cursor-pointer rounded-lg border-2 p-2 transition-all duration-200 ${
                            serviceType === 'standard' 
                              ? 'border-ksl-red bg-ksl-red/5 dark:bg-ksl-red/10' 
                              : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-bg-secondary hover:border-ksl-red/50'
                          }`}
                          onClick={() => setServiceType('standard')}
                        >
                          <div className="flex flex-col items-center text-center space-y-1">
                            {/* Icône standard */}
                            <div className="w-6 h-6 flex items-center justify-center">
                              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                              </svg>
                            </div>
                            <span className="text-xs font-medium text-gray-900 dark:text-white">
                              Livraison Standard
                            </span>
                  </div>

                          {/* Indicateur de sélection */}
                          {serviceType === 'standard' && (
                            <div className="absolute top-1 right-1 w-3 h-3 bg-ksl-red rounded-full flex items-center justify-center">
                              <svg className="w-1.5 h-1.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </div>
                      )}
                    </div>

                        {/* Carte Livraison Éco */}
                        <div 
                          className={`relative cursor-pointer rounded-lg border-2 p-2 transition-all duration-200 ${
                            serviceType === 'eco' 
                              ? 'border-ksl-red bg-ksl-red/5 dark:bg-ksl-red/10' 
                              : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-bg-secondary hover:border-ksl-red/50'
                          }`}
                          onClick={() => setServiceType('eco')}
                        >
                          <div className="flex flex-col items-center text-center space-y-1">
                            {/* Icône éco */}
                            <div className="w-6 h-6 flex items-center justify-center">
                              <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                              </svg>
                    </div>
                            <span className="text-xs font-medium text-gray-900 dark:text-white">
                              Livraison Éco
                            </span>
                  </div>

                          {/* Indicateur de sélection */}
                          {serviceType === 'eco' && (
                            <div className="absolute top-1 right-1 w-3 h-3 bg-ksl-red rounded-full flex items-center justify-center">
                              <svg className="w-1.5 h-1.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </div>
                      )}
                    </div>

                        {/* Carte Livraison Régionale */}
                        <div 
                          className={`relative cursor-pointer rounded-lg border-2 p-2 transition-all duration-200 ${
                            serviceType === 'regionale' 
                              ? 'border-ksl-red bg-ksl-red/5 dark:bg-ksl-red/10' 
                              : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-bg-secondary hover:border-ksl-red/50'
                          }`}
                          onClick={() => setServiceType('regionale')}
                        >
                          <div className="flex flex-col items-center text-center space-y-1">
                            {/* Icône régionale */}
                            <div className="w-6 h-6 flex items-center justify-center">
                              <svg className="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                              </svg>
                    </div>
                            <span className="text-xs font-medium text-gray-900 dark:text-white">
                              Livraison Régionale
                            </span>
                  </div>

                          {/* Indicateur de sélection */}
                          {serviceType === 'regionale' && (
                            <div className="absolute top-1 right-1 w-3 h-3 bg-ksl-red rounded-full flex items-center justify-center">
                              <svg className="w-1.5 h-1.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </div>
                      )}
                    </div>
                      </div>
                      
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
                        Sélectionnez le type de service de livraison adapté à vos besoins
                      </p>
                    </div>
                  </div>
                
                <div className="text-center">
                  <button
                    type="submit"
                      disabled={isEstimationLoading}
                      className="px-6 sm:px-8 py-2 sm:py-3 text-sm sm:text-base bg-ksl-red text-white font-medium rounded-lg hover:bg-ksl-red-dark transition-colors duration-200 border border-ksl-red flex items-center justify-center gap-2 mx-auto disabled:opacity-50"
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
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modal d'estimation */}
      {showEstimationModal && estimationResult && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4 animate-fade-in">
          <div className="bg-white dark:bg-dark-bg-secondary rounded-2xl shadow-2xl max-w-4xl w-full max-h-[95vh] overflow-y-auto animate-slide-up">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center animate-pulse">
                  <Calculator className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Estimation de coût
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Calcul terminé avec succès
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowEstimationModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-2"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              {estimationResult.success ? (
                <div className="space-y-6">
                  {/* Prix principal */}
                  <div className="text-center bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-8 border-2 border-green-200 dark:border-green-700">
                    <div className="text-4xl font-bold text-green-900 dark:text-green-100 animate-bounce mb-2">
                      {estimationResult.price.toLocaleString()} {estimationResult.currency}
                    </div>
                    <div className="text-lg text-green-700 dark:text-green-300">
                      Prix total estimé
                    </div>
                  </div>

                  {/* Détails en grille */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Informations de base */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
                        📦 Détails du colis
                      </h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                          <span className="text-gray-600 dark:text-gray-300">Poids</span>
                          <span className="font-semibold text-gray-900 dark:text-white">{estimationResult.details.weight} kg</span>
                        </div>
                        <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                          <span className="text-gray-600 dark:text-gray-300">Volume</span>
                          <span className="font-semibold text-gray-900 dark:text-white">{estimationResult.details.volume.toFixed(3)} m³</span>
                        </div>
                        <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                          <span className="text-gray-600 dark:text-gray-300">Service</span>
                          <span className="font-semibold text-gray-900 dark:text-white capitalize">{serviceType}</span>
                        </div>
                        <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                          <span className="text-gray-600 dark:text-gray-300">Mode de livraison</span>
                          <span className="font-semibold text-gray-900 dark:text-white">{deliveryMode === 'domicile' ? 'À domicile' : 'Point relais'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Informations tarifaires */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
                        💰 Détails tarifaires
                      </h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                          <span className="text-gray-600 dark:text-gray-300">Trajet</span>
                          <span className="font-semibold text-gray-900 dark:text-white text-sm">
                            {estimationResult.details.originCity} → {estimationResult.details.destinationCity}
                          </span>
                        </div>
                        <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                          <span className="text-gray-600 dark:text-gray-300">Grille tarifaire</span>
                          <span className="font-semibold text-gray-900 dark:text-white">{estimationResult.details.tariffGrid}</span>
                        </div>
                        <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                          <span className="text-gray-600 dark:text-gray-300">Prix de base</span>
                          <span className="font-semibold text-gray-900 dark:text-white">{estimationResult.details.basePrice} FCFA</span>
                        </div>
                        <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                          <span className="text-gray-600 dark:text-gray-300">Tarif poids</span>
                          <span className="font-semibold text-gray-900 dark:text-white">{estimationResult.details.weightPrice} FCFA</span>
                        </div>
                        {declaredValue > 0 && (
                          <div className="flex justify-between items-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-700">
                            <span className="text-green-700 dark:text-green-300">Valeur déclarée</span>
                            <span className="font-semibold text-green-900 dark:text-green-100">{parseFloat(declaredValue).toLocaleString()} FCFA</span>
                </div>
              )}
                        {declaredValue > 0 && (
                          <div className="flex justify-between items-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-700">
                            <span className="text-green-700 dark:text-green-300">Assurance</span>
                            <span className="font-semibold text-green-900 dark:text-green-100 flex items-center gap-1">
                              ✓ Incluse
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
            </div>

                  {/* Boutons d'action */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
              <button
                      onClick={handleCommander}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Commander maintenant
                    </button>
                                        <button 
                      onClick={() => window.location.reload()}
                      className="flex-1 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      Actualiser
              </button>
                  </div>
                </div>
              ) : (
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto">
                    <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-red-900 dark:text-red-100">
                    Erreur d'estimation
                  </h3>
                  <p className="text-red-600 dark:text-red-400">
                    {estimationResult.error}
                  </p>
                  <button 
                    onClick={() => window.location.reload()}
                    className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200"
                  >
                    Actualiser
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal de suivi */}
      {showTrackingModal && trackingResult && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4 animate-fade-in">
          <div className="bg-white dark:bg-dark-bg-secondary rounded-xl shadow-2xl max-w-4xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto animate-slide-up">
            {/* Header */}
            <div className="flex items-center justify-between p-3 sm:p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-base sm:text-xl font-bold text-gray-900 dark:text-white">
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
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
              NOS SERVICES DE LIVRAISONS
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto px-2 sm:px-0">
              Trouvez la formule qui correspond à vos besoins professionnels ou personnels.
            </p>
          </div>

          <div className="space-y-8">
            {/* Première ligne - 2 cartes centrées */}
            <div className="flex justify-center">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 max-w-4xl">
                <div className="bg-white dark:bg-dark-bg rounded-xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-2 border-red-500">
                  <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg mb-3 sm:mb-4">
                    <Bike className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-3">
                    Livraison Flash
                  </h3>
                  <div className="space-y-2">
                    <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
                      Idéale pour les livraisons très urgentes
                    </p>
                    <div className="flex justify-between text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                      <span>Zone: Locale</span>
                      <span>Délai: 0 à 2h</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-dark-bg rounded-xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-2 border-red-500">
                  <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg mb-3 sm:mb-4">
                    <Bike className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-3">
                    Livraison Express
                  </h3>
                  <div className="space-y-2">
                    <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
                      Idéale pour les livraisons urgentes
                    </p>
                    <div className="flex justify-between text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                      <span>Zone: Locale</span>
                      <span>Délai: en 24h</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Deuxième ligne - 3 cartes */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              <div className="bg-white dark:bg-dark-bg rounded-xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-200 dark:border-gray-700">
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