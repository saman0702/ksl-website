import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  MapPin, 
  Building,
  Package, 
  Volume, 
  Route, 
  Target, 
  Shield, 
  Clock, 
  Store, 
  Zap,
  ArrowRight,
  Users,
  Calculator,
  Ruler,
  Package as PackageIcon
} from 'lucide-react';
import LocationSearch from '../components/ui/LocationSearch';
import { calculateTariff } from '../services/tariffService';

export default function Tarifs() {
  const navigate = useNavigate();
  
  // États pour l'estimation
  const [showEstimationForm, setShowEstimationForm] = useState(false);
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
  const [showEstimationModal, setShowEstimationModal] = useState(false);
  const [showSimulation, setShowSimulation] = useState(false);
  
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

  const tariffTypes = [
    { 
      id: 1,
      title: "Par zone géographique",
      description: "Tarification optimisée selon les 5 zones e-commerce CI",
      icon: MapPin, 
      iconColor: "text-green-500",
      bgColor: "bg-green-50",
      borderColor: "border-green-200"
    },
    {
      id: 2,
      title: "Par commune",
      description: "Tarif fixe entre communes (ex: Yop - Cocody)",
      icon: Building,
      iconColor: "text-blue-500",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200"
    },
    {
      id: 3,
      title: "Par ville",
      description: "Tarif fixe entre villes (ex: Abidjan - Bouaké)",
      icon: Building, 
      iconColor: "text-green-500",
      bgColor: "bg-green-50",
      borderColor: "border-green-200"
    },
    { 
      id: 4,
      title: "Par poids",
      description: "Coût calculé selon le poids (tranches ou par kg)",
      icon: Package, 
      iconColor: "text-purple-500",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200"
    },
    { 
      id: 5,
      title: "Par volume",
      description: "Coût basé sur le volume (cm³ ou m³)",
      icon: Volume, 
      iconColor: "text-orange-500",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200"
    },
    {
      id: 6,
      title: "Par distance",
      description: "Coût basé sur la distance réelle en km",
      icon: Route,
      iconColor: "text-red-500",
      bgColor: "bg-red-50",
      borderColor: "border-red-200"
    },

    {
      id: 7,
      title: "Facteur assurance",
      description: "Pourcentage appliqué sur la valeur déclarée",
      icon: Shield, 
      iconColor: "text-blue-500",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200"
    },
    { 
      id: 8,
      title: "Temps de livraison",
      description: "Facteur livraison jours fériés et weekend",
      icon: Clock, 
      iconColor: "text-pink-500",
      bgColor: "bg-pink-50",
      borderColor: "border-pink-200"
    },
    {
      id: 9,
      title: "Point relais",
      description: "Reduction spécifique livraison/retrait en point relais",
      icon: Store,
      iconColor: "text-teal-500",
      bgColor: "bg-teal-50",
      borderColor: "border-teal-200",
      highlighted: true
    }
  ];

  const additionalTypes = [
    {
      id: 9,
      title: "Type de service",
      description: "Tarification selon le niveau de service (Économique/Standard/Express)",
      icon: Zap, 
      iconColor: "text-purple-500",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
      services: [
        {
          name: "Livraison Flash",
          delay: "2-4h"
        },
        {
          name: "Livraison Express", 
          delay: "24h (0-1 jour)"
        },
        {
          name: "Livraison Standard",
          delay: "24-48h"
        },
        {
          name: "Livraison Éco",
          delay: "48-72h"
        },
        {
          name: "Livraison Régionale",
          delay: "86h (2-4 jours)"
        }
      ]
    }
  ];

  // Fonctions pour l'estimation
  const handlePickupLocationSelect = (location) => {
    setPickupLocation(location);
    console.log('📍 [handlePickupLocationSelect] → Location sélectionnée:', location);
  };

  const handleDeliveryLocationSelect = (location) => {
    setDeliveryLocation(location);
    console.log('📍 [handleDeliveryLocationSelect] → Location sélectionnée:', location);
  };

  const handleEstimation = async (e) => {
    e.preventDefault();
    
    if (!pickupLocation || !deliveryLocation || !selectedPackageFormat) {
      alert('Veuillez sélectionner un format de colis et remplir les adresses');
      return;
    }

    if (selectedPackageFormat === 'xl' && (!length || !width || !height || !weight)) {
      alert('Pour le format XL, veuillez saisir toutes les dimensions et le poids');
      return;
    }

    try {
      setIsEstimationLoading(true);
      setShowSimulation(true);

      // Fonction helper pour extraire le nom de la ville
      const getCityName = (location) => {
        if (!location) return '';
        if (typeof location === 'string') return location;
        if (typeof location === 'object') {
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

      console.log('📦 [handleEstimation] → Données d\'expédition:', shipmentData);

      // Calculer le tarif avec fallback sur transporteur ID 4 si ID 1 échoue
      let result;
      try {
        result = await calculateTariff(shipmentData);
      } catch (error) {
        console.log('⚠️ Transporteur ID 1 échoué, essai avec ID 4...');
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
        error: error.message || 'Erreur lors du calcul du tarif'
      });
      setShowEstimationModal(true);
    } finally {
      setIsEstimationLoading(false);
      setShowSimulation(false);
    }
  };

  const handleCommander = () => {
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
    localStorage.setItem('ksl_expedition_data', JSON.stringify(expeditionData));
    navigate('/expedier');
  };

    return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-dark-bg dark:to-dark-bg-secondary">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-ksl-red via-ksl-red-dark to-ksl-black text-white py-12 sm:py-16 md:py-20">
        <div className="container-ksl text-center px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold mb-4 sm:mb-6">
            Types de Tarification
          </h1>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-ksl-gray-light mb-6 sm:mb-8 max-w-3xl mx-auto px-4">
            Choisissez le type de tarification qui correspond à vos besoins
          </p>
        </div>
      </section>

      {/* Tariff Types Section */}
      <section className="py-12 sm:py-16 md:py-20">
        <div className="container-ksl px-4 sm:px-6 lg:px-8">
          {/* Main Grid - 3x3 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
            {tariffTypes.map((type) => (
              <div 
                key={type.id}
                className={`relative ${type.bgColor} dark:bg-gray-800 rounded-xl p-4 sm:p-6 border-2 ${type.borderColor} dark:border-gray-700 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${
                  type.crossedOut ? 'opacity-60' : ''
                }`}
              >
                {/* Crossed out overlay */}
                {type.crossedOut && (
                  <div className="absolute inset-0 flex items-center justify-center z-10">
                    <div className="w-full h-0.5 bg-red-500 transform rotate-45"></div>
                  </div>
                )}
                
                <div className="text-center">
                  <div className={`w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 flex items-center justify-center ${type.iconColor}`}>
                    <type.icon className="w-6 h-6 sm:w-8 sm:h-8" />
                </div>
                  <h3 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white mb-2">
                    {type.title}
                </h3>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                  {type.description}
                </p>
                </div>
              </div>
            ))}
          </div>

          {/* Additional Types - 2 cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-8">
            {additionalTypes.map((type) => (
              <div 
                key={type.id}
                className={`relative ${type.bgColor} dark:bg-gray-800 rounded-xl p-4 sm:p-6 border-2 ${
                  type.highlighted 
                    ? 'border-red-500 dark:border-red-400 shadow-lg' 
                    : `${type.borderColor} dark:border-gray-700`
                } shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}
              >
                <div className="text-center">
                  <div className={`w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 flex items-center justify-center ${type.iconColor}`}>
                    <type.icon className="w-6 h-6 sm:w-8 sm:h-8" />
                  </div>
                  <h3 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white mb-2">
                    {type.title}
              </h3>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-3">
                    {type.description}
                  </p>
                  
                  {/* Services list for Type de service */}
                  {type.services && (
                    <div className="space-y-1 mt-3">
                      {type.services.map((service, index) => (
                        <div key={index} className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
                          <div className="flex items-center">
                            <div className="w-1.5 h-1.5 bg-purple-400 rounded-full mr-2 flex-shrink-0"></div>
                            <span>{typeof service === 'string' ? service : service.name}</span>
                          </div>
                          {typeof service === 'object' && service.delay && (
                            <span className="text-xs text-purple-600 dark:text-purple-400 font-medium">
                              {service.delay}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Price Simulator Note */}
          <div className="hidden bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 rounded-xl p-4 sm:p-6 text-center">
            <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 font-medium">
              Ajouter le simulateur de prix
            </p>
          </div>
        </div>
      </section>

          {/* Info Section */}
      <section className="bg-gradient-to-br from-ksl-red to-ksl-red-dark rounded-3xl mx-4 sm:mx-6 lg:mx-8 p-4 sm:p-6 md:p-8 lg:p-12 text-white mb-12">
            <div className="text-center mb-6 sm:mb-8">
              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-4">
            Comment fonctionne notre tarification ?
              </h3>
              <p className="text-sm sm:text-base md:text-lg text-ksl-gray-light">
            Découvrez les différents facteurs qui influencent le coût de vos livraisons
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
              <div>
            <h4 className="font-semibold mb-2 sm:mb-3 text-sm sm:text-base">Facteurs géographiques</h4>
            <p className="text-ksl-gray-light text-sm sm:text-base">La distance et la zone géographique sont les principaux facteurs. Les zones éloignées ou difficiles d'accès peuvent avoir des majorations.</p>
              </div>
              <div>
            <h4 className="font-semibold mb-2 sm:mb-3 text-sm sm:text-base">Facteurs physiques</h4>
            <p className="text-ksl-gray-light text-sm sm:text-base">Le poids et le volume de votre colis déterminent une partie importante du coût. Plus le colis est lourd ou volumineux, plus le tarif augmente.</p>
              </div>
              <div>
            <h4 className="font-semibold mb-2 sm:mb-3 text-sm sm:text-base">Facteurs temporels</h4>
            <p className="text-ksl-gray-light text-sm sm:text-base">Les livraisons express, les weekends et jours fériés peuvent avoir des majorations spécifiques.</p>
              </div>
              <div>
            <h4 className="font-semibold mb-2 sm:mb-3 text-sm sm:text-base">Options additionnelles</h4>
            <p className="text-ksl-gray-light text-sm sm:text-base">L'assurance, les points relais et les services spéciaux s'ajoutent au tarif de base selon vos besoins.</p>
          </div>
      </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-br from-gray-900 to-ksl-black text-white py-12 sm:py-16 md:py-20">
        <div className="container-ksl text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6">
            Prêt à expédier ?
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-300 mb-6 sm:mb-8 max-w-2xl mx-auto">
            Utilisez notre calculateur de tarifs pour obtenir un devis précis
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <button
              onClick={() => setShowEstimationForm(!showEstimationForm)}
              className="px-4 sm:px-6 md:px-8 py-3 sm:py-4 bg-ksl-red text-white rounded-xl hover:bg-ksl-red-dark transition-all duration-300 font-medium text-sm sm:text-base md:text-lg flex items-center justify-center space-x-2"
            >
              <Calculator className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>Simuler un tarif</span>
            </button>
            <Link
              to="/register"
              className="px-4 sm:px-6 md:px-8 py-3 sm:py-4 bg-white text-ksl-red rounded-xl hover:bg-gray-100 transition-all duration-300 font-medium text-sm sm:text-base md:text-lg"
            >
              Créer un compte
            </Link>
          </div>
      </div>
    </section>

      {/* Section d'estimation rapide */}
      {showEstimationForm && (
        <section className="py-12 sm:py-16 bg-gray-50 dark:bg-gray-900">
          <div className="container-ksl px-4 sm:px-6 lg:px-8">
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
                          if (typeof value === 'string') {
                            setPickupLocation(value);
                          } else if (typeof value === 'object') {
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
                          if (typeof value === 'string') {
                            setDeliveryLocation(value);
                          } else if (typeof value === 'object') {
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
                            <PackageIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
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
                            <div className="w-8 h-8 flex items-center justify-center">
                              <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                              </svg>
                            </div>
                            <span className="text-xs font-medium text-gray-900 dark:text-white">
                              Livraison à domicile
                            </span>
                          </div>
                          
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
                            <div className="relative w-8 h-8 flex items-center justify-center">
                              <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                              </svg>
                              <div className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-orange-500 rounded-full flex items-center justify-center">
                                <span className="text-xs font-bold text-white">24</span>
                              </div>
                            </div>
                            <span className="text-xs font-medium text-gray-900 dark:text-white">
                              Dépôt en point relais
                            </span>
                          </div>

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
                            <div className="w-6 h-6 flex items-center justify-center">
                              <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M13 10V3L4 14h7v7l9-11h-7z"/>
                              </svg>
                            </div>
                            <span className="text-xs font-medium text-gray-900 dark:text-white">
                              Livraison Flash
                            </span>
                          </div>
                          
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
                            <div className="w-6 h-6 flex items-center justify-center">
                              <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                              </svg>
                            </div>
                            <span className="text-xs font-medium text-gray-900 dark:text-white">
                              Livraison Express
                            </span>
                          </div>

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
                            <div className="w-6 h-6 flex items-center justify-center">
                              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                              </svg>
                            </div>
                            <span className="text-xs font-medium text-gray-900 dark:text-white">
                              Livraison Standard
                            </span>
                          </div>

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
                            <div className="w-6 h-6 flex items-center justify-center">
                              <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                              </svg>
                            </div>
                            <span className="text-xs font-medium text-gray-900 dark:text-white">
                              Livraison Éco
                            </span>
                          </div>

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
                            <div className="w-6 h-6 flex items-center justify-center">
                              <svg className="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                              </svg>
                            </div>
                            <span className="text-xs font-medium text-gray-900 dark:text-white">
                              Livraison Régionale
                            </span>
                          </div>

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
            </div>
          </div>
        </section>
      )}

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
                onClick={() => window.location.reload()}
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
    </div>
  );
} 