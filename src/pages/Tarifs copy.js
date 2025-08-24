import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  CheckCircle, 
  Star, 
  ArrowRight, 
  Package, 
  Truck, 
  MapPin, 
  CreditCard,
  Users,
  Building,
  ShoppingCart,
  Zap,
  Shield,
  Globe,
  BarChart3,
  Home,
  Volume,
  Target,
  Clock,
  ChevronDown,
  ChevronUp,
  Scale,
  Store
} from 'lucide-react';
import { tariffAPI } from '../services/api';

export default function Tarifs() {
  const [tariffs, setTariffs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedTariffs, setExpandedTariffs] = useState(new Set());

  const toggleTariffExpansion = (tariffId) => {
    const newExpandedTariffs = new Set(expandedTariffs);
    if (newExpandedTariffs.has(tariffId)) {
      newExpandedTariffs.delete(tariffId);
      // Scroll vers le haut lors de la fermeture
      setTimeout(() => {
        const element = document.getElementById(`tariff-${tariffId}`);
        if (element) {
          element.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start',
            inline: 'nearest'
          });
        }
      }, 100);
    } else {
      newExpandedTariffs.add(tariffId);
      // Scroll vers les détails après un court délai pour laisser l'animation commencer
      setTimeout(() => {
        const element = document.getElementById(`tariff-${tariffId}`);
        if (element) {
          element.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'nearest',
            inline: 'nearest'
          });
        }
      }, 300);
    }
    setExpandedTariffs(newExpandedTariffs);
  };

  useEffect(() => {
    loadTariffs();
  }, []);

  const loadTariffs = async () => {
    try {
      setIsLoading(true);
      setError('');
      
      // Appel de l'API
      const response = await tariffAPI.getTariffs({ is_active: true });
      
      // Si l'API retourne des données, on filtre pour ne garder que les actifs
      if (response.data && response.data.length > 0) {
        console.log('✅ Données API reçues:', response.data);
        const activeTariffs = response.data.filter(tariff => tariff.is_active === true);
        setTariffs(activeTariffs);
      } else {
        // Sinon on utilise les données de démonstration
        console.log('⚠️ API retourne des données vides, utilisation des données de démonstration');
        const demoData = getDemoTariffs();
        console.log('📊 Données de démonstration:', demoData);
        setTariffs(demoData);
      }
    } catch (error) {
      console.error('❌ Erreur chargement tarifs:', error);
      setError('Impossible de charger les tarifs depuis l\'API. Affichage des données de démonstration.');
      
      // En cas d'erreur, on utilise les données de démonstration
      console.log('🔄 Chargement des données de démonstration suite à l\'erreur');
      const demoData = getDemoTariffs();
      console.log('📊 Données de démonstration:', demoData);
      setTariffs(demoData);
    } finally {
      setIsLoading(false);
    }
  };

  const getDemoTariffs = () => {
    return [
      {
        id: 1,
        name: "Tarif Standard",
        description: "Tarification standard pour la plupart des livraisons",
        type: "Standard",
        base_fee: "15000.00",
        is_active: true,
        priority: 1,
        TarifPoids: [
          { Tarif: 15, Min: "0kg", Max: "10kg" },
          { Tarif: 10, Min: "10kg", Max: "20kg" },
          { Tarif: 5, Min: "20kg", Max: "100kg" }
        ],
        TarifVolum: [
          { Tarif: 30, Min: "0L", Max: "100L" },
          { Tarif: 20, Min: "100L", Max: "2000L" }
        ],
        TarifDistance: [
          { Tarif: 40, Min: "0km", Max: "50km" },
          { Tarif: 20, Min: "50km", Max: "100km" }
        ],
        TarifTypeService: {
          economique: 5.5,
          standard: 4.5,
          express: 2.8
        },
        TarifZoneFact: {
          "Zone Difficile": 5.8
        },
        TarifAssurenceFact: {
          basic: 4
        },
        TarifTempsLiv: {
          weekend: 1.3,
          holiday: 1.5,
          express: 2
        },
        TarifPointRelais: {
          deposit: 10,
          pickup: 10
        },
        TarifZone: [
          { OrigineZone: "Zone A", DestinationZone: "Zone B", Tarif: 1000 },
          { OrigineZone: "Zone B", DestinationZone: "Zone C", Tarif: 1500 }
        ],
        TarifCommune: [
          { OrigineCommune: "Commune X", DestinationCommune: "Commune Y", Tarif: 500 },
          { OrigineCommune: "Commune Y", DestinationCommune: "Commune Z", Tarif: 700 }
        ],
        TarifVille: [
          { OrigineVille: "Ville 1", DestinationVille: "Ville 2", Tarif: 200 },
          { OrigineVille: "Ville 2", DestinationVille: "Ville 3", Tarif: 300 }
        ],
        TarifTypeEquip: {
          camion: 1.2,
          voiture: 1.0,
          moto: 0.8
        },
        created_at: "2025-01-01T00:00:00.000Z",
        updated_at: "2025-01-01T00:00:00.000Z"
      },
      {
        id: 2,
        name: "Tarif Express",
        description: "Tarification pour livraisons express",
        type: "Express",
        base_fee: "20000.00",
        is_active: true,
        priority: 2,
        TarifPoids: [
          { Tarif: 20, Min: "0kg", Max: "10kg" },
          { Tarif: 15, Min: "10kg", Max: "20kg" },
          { Tarif: 10, Min: "20kg", Max: "100kg" }
        ],
        TarifVolum: [
          { Tarif: 40, Min: "0L", Max: "100L" },
          { Tarif: 30, Min: "100L", Max: "2000L" }
        ],
        TarifDistance: [
          { Tarif: 50, Min: "0km", Max: "50km" },
          { Tarif: 30, Min: "50km", Max: "100km" }
        ],
        TarifTypeService: {
          economique: 6.0,
          standard: 5.0,
          express: 3.0
        },
        TarifZoneFact: {
          "Zone Difficile": 6.0
        },
        TarifAssurenceFact: {
          basic: 5
        },
        TarifTempsLiv: {
          weekend: 1.5,
          holiday: 1.8,
          express: 2.5
        },
        TarifPointRelais: {
          deposit: 15,
          pickup: 15
        },
        TarifZone: [
          { OrigineZone: "Zone D", DestinationZone: "Zone E", Tarif: 1200 },
          { OrigineZone: "Zone E", DestinationZone: "Zone F", Tarif: 1800 }
        ],
        TarifCommune: [
          { OrigineCommune: "Commune A", DestinationCommune: "Commune B", Tarif: 600 },
          { OrigineCommune: "Commune B", DestinationCommune: "Commune C", Tarif: 800 }
        ],
        TarifVille: [
          { OrigineVille: "Ville 4", DestinationVille: "Ville 5", Tarif: 250 },
          { OrigineVille: "Ville 5", DestinationVille: "Ville 6", Tarif: 350 }
        ],
        TarifTypeEquip: {
          camion: 1.3,
          voiture: 1.1,
          moto: 0.9
        },
        created_at: "2025-01-01T00:00:00.000Z",
        updated_at: "2025-01-01T00:00:00.000Z"
      }
    ];
  };

  const renderTariffCard = (tariff, index) => {
    const isExpanded = expandedTariffs.has(tariff.id);
    
        return (
      <div key={index} id={`tariff-${tariff.id}`} className="bg-white dark:bg-dark-bg-secondary rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700 overflow-hidden group">
        {/* Header cliquable */}
        <button
          onClick={() => toggleTariffExpansion(tariff.id)}
          className="w-full p-3 sm:p-4 md:p-6 text-left transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-ksl-red focus:ring-opacity-50 group-hover:bg-gray-50 dark:group-hover:bg-gray-800"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-gradient-to-br from-ksl-red to-ksl-red-dark rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                <Package className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 dark:text-white truncate">
                  {tariff.name || `Tarif ${index + 1}`}
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                  {tariff.description || 'Description du tarif'}
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between sm:justify-end space-x-3 sm:space-x-4">
              <div className="text-right">
                <div className="text-sm sm:text-base font-semibold text-ksl-red">{tariff.base_fee} FCFA</div>
                {/* <div className="text-xs text-gray-500 dark:text-gray-400 truncate">{tariff.type}</div> */}
              </div>
              <div className={`transform transition-transform duration-300 flex-shrink-0 ${isExpanded ? 'rotate-180' : ''}`}>
                {isExpanded ? (
                  <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
                ) : (
                  <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
                )}
              </div>
            </div>
          </div>
        </button>

        {/* Contenu déroulable */}
        <div className={`transition-all duration-500 ease-in-out overflow-hidden ${
          isExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <div className="p-3 sm:p-4 md:p-6 pt-0 border-t border-gray-200 dark:border-gray-700 space-y-4 sm:space-y-6 max-h-[40vh] sm:max-h-[50vh] md:max-h-[60vh] lg:max-h-[70vh] overflow-y-auto">
            
            {/* Informations de base */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              <div className="flex items-center justify-between p-2 sm:p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Frais de base</span>
                <span className="text-sm sm:text-base font-semibold text-ksl-red">{tariff.base_fee} FCFA</span>
              </div>
              <div className="flex items-center justify-between p-2 sm:p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Type</span>
                <span className="text-sm sm:text-base font-medium text-gray-900 dark:text-white">{tariff.type}</span>
              </div>
              <div className="flex items-center justify-between p-2 sm:p-3 bg-gray-50 dark:bg-gray-800 rounded-lg sm:col-span-2 lg:col-span-1">
                <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Description</span>
                <span className="text-sm sm:text-base text-gray-900 dark:text-white truncate max-w-[120px] sm:max-w-[150px]">{tariff.description}</span>
              </div>
            </div>

            {/* Tarification par poids */}
            {tariff.TarifPoids && tariff.TarifPoids.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
                  <Scale className="w-4 h-4 sm:w-5 sm:h-5 text-ksl-red" />
                  <span>Tarification par poids</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-3">
                  {tariff.TarifPoids.map((poids, idx) => (
                    <div key={idx} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-2 sm:p-3">
                      <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-1">Poids: {poids.Min} - {poids.Max} kg</div>
                      <div className="text-sm sm:text-base font-semibold text-ksl-red">{poids.Tarif} FCFA</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tarification par volume */}
            {tariff.TarifVolum && tariff.TarifVolum.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
                  <Package className="w-4 h-4 sm:w-5 sm:h-5 text-ksl-red" />
                  <span>Tarification par volume</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-3">
                  {tariff.TarifVolum.map((volume, idx) => (
                    <div key={idx} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-2 sm:p-3">
                      <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-1">Volume: {volume.Min} - {volume.Max} m³</div>
                      <div className="text-sm sm:text-base font-semibold text-ksl-red">{volume.Tarif} FCFA</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tarification par distance */}
            {tariff.TarifDistance && tariff.TarifDistance.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
                  <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-ksl-red" />
                  <span>Tarification par distance</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-3">
                  {tariff.TarifDistance.map((distance, idx) => (
                    <div key={idx} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-2 sm:p-3">
                      <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-1">Distance: {distance.Min} - {distance.Max} km</div>
                      <div className="text-sm sm:text-base font-semibold text-ksl-red">{distance.Tarif} FCFA</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tarification par zone */}
            {tariff.TarifZone && tariff.TarifZone.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
                  <Globe className="w-4 h-4 sm:w-5 sm:h-5 text-ksl-red" />
                  <span>Tarification par zone</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-3">
                  {tariff.TarifZone.map((zone, idx) => (
                    <div key={idx} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-2 sm:p-3">
                      <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-1">Zone: {zone.OrigineZone} → {zone.DestinationZone}</div>
                      <div className="text-sm sm:text-base font-semibold text-ksl-red">{zone.Tarif} FCFA</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tarification par commune */}
            {tariff.TarifCommune && tariff.TarifCommune.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
                  <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-ksl-red" />
                  <span>Tarification par commune</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-3">
                  {tariff.TarifCommune.map((commune, idx) => (
                    <div key={idx} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-2 sm:p-3">
                      <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-1">Commune: {commune.OrigineCommune} → {commune.DestinationCommune}</div>
                      <div className="text-sm sm:text-base font-semibold text-ksl-red">{commune.Tarif} FCFA</div>
                    </div>
                  ))}
                </div>
          </div>
            )}

            {/* Tarification par ville */}
            {tariff.TarifVille && tariff.TarifVille.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
                  <Building className="w-4 h-4 sm:w-5 sm:h-5 text-ksl-red" />
                  <span>Tarification par ville</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-3">
                  {tariff.TarifVille.map((ville, idx) => (
                    <div key={idx} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-2 sm:p-3">
                      <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-1">Ville: {ville.OrigineVille} → {ville.DestinationVille}</div>
                      <div className="text-sm sm:text-base font-semibold text-ksl-red">{ville.Tarif} FCFA</div>
                    </div>
                  ))}
            </div>
              </div>
            )}

            {/* Facteurs de temps */}
            {tariff.TarifTempsLiv && tariff.TarifTempsLiv.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
                  <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-ksl-red" />
                  <span>Facteurs de temps</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
                  {tariff.TarifTempsLiv.map((temps, idx) => (
                    <div key={idx} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-2 sm:p-3">
                      <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-1">Type: {temps.TypeTemps}</div>
                      <div className="text-sm sm:text-base font-semibold text-ksl-red">{temps.Facteur}x</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Frais point relais */}
            {tariff.TarifPointRelais && tariff.TarifPointRelais.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
                  <Store className="w-4 h-4 sm:w-5 sm:h-5 text-ksl-red" />
                  <span>Frais point relais</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-3">
                  {tariff.TarifPointRelais.map((relais, idx) => (
                    <div key={idx} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-2 sm:p-3">
                      <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-1">Point relais: {relais.TypePointRelais}</div>
                      <div className="text-sm sm:text-base font-semibold text-ksl-red">{relais.Frais} FCFA</div>
                    </div>
                  ))}
            </div>
          </div>
            )}

            {tariff.TarifTypeEquip && Object.keys(tariff.TarifTypeEquip).length > 0 && (
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center">
                  <Truck className="w-4 h-4 mr-2" />
                  Facteurs par type d'équipement
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                  {Object.entries(tariff.TarifTypeEquip).map(([equipment, factor]) => (
                    <div key={equipment} className="bg-white dark:bg-gray-700 rounded-lg p-3 border border-gray-200 dark:border-gray-600">
                      <div className="text-xs text-gray-500 dark:text-gray-400 mb-1 capitalize">{equipment}</div>
                      <div className="font-semibold text-ksl-red">{factor}x</div>
                    </div>
                  ))}
            </div>
          </div>
            )}

            {/* Date de modification */}
            <div className="pt-3 sm:pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 text-center sm:text-left">
                Dernière modification : {new Date(tariff.updated_at).toLocaleDateString('fr-FR')}
              </div>
            </div>
          </div>
        </div>
          </div>
        );
  };

    return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-dark-bg dark:to-dark-bg-secondary">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-ksl-red via-ksl-red-dark to-ksl-black text-white py-12 sm:py-16 md:py-20">
        <div className="container-ksl text-center px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold mb-4 sm:mb-6">
            Nos Tarifs
          </h1>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-ksl-gray-light mb-6 sm:mb-8 max-w-3xl mx-auto px-4">
            Découvrez nos différents types de tarification adaptés à vos besoins
          </p>
        </div>
      </section>

      {/* Tariff Types Section */}
      <section className="py-12 sm:py-16 md:py-20">
        <div className="container-ksl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Nos Tarifs
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Découvrez nos différents tarifs et leurs détails. Cliquez sur chaque tarif pour voir les informations complètes.
            </p>
          </div>

          {/* Selected Type Details */}
          <div className="bg-white dark:bg-dark-bg-secondary rounded-3xl p-4 sm:p-6 md:p-8 lg:p-12 mb-12 sm:mb-16">
            {isLoading ? (
              <div className="text-center py-8 sm:py-12">
                <div className="w-6 h-6 sm:w-8 sm:h-8 border-4 border-ksl-red border-t-transparent rounded-full animate-spin mx-auto mb-3 sm:mb-4"></div>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">Chargement des tarifs...</p>
              </div>
            ) : (
              <>
      {error && (
                  <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-3 sm:px-4 py-2 sm:py-3 rounded-lg text-center mb-6 sm:mb-8 text-sm sm:text-base">
          {error}
        </div>
      )}
                <div className="space-y-4 sm:space-y-6">
                  {tariffs.map((tariff, index) => renderTariffCard(tariff, index))}
                </div>
              </>
            )}
          </div>

          {/* Info Section */}
          <div className="bg-gradient-to-br from-ksl-red to-ksl-red-dark rounded-3xl p-4 sm:p-6 md:p-8 lg:p-12 text-white">
            <div className="text-center mb-6 sm:mb-8">
              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-4">
                Informations importantes
              </h3>
              <p className="text-sm sm:text-base md:text-lg text-ksl-gray-light">
                Tout ce que vous devez savoir sur nos tarifs
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
              <div>
                <h4 className="font-semibold mb-2 sm:mb-3 text-sm sm:text-base">Comment sont calculés nos tarifs ?</h4>
                <p className="text-ksl-gray-light text-sm sm:text-base">Nos tarifs sont calculés selon plusieurs facteurs : distance, poids, type de service et zone géographique. Nous nous efforçons d'offrir les meilleurs prix du marché.</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2 sm:mb-3 text-sm sm:text-base">Y a-t-il des frais cachés ?</h4>
                <p className="text-ksl-gray-light text-sm sm:text-base">Non, tous nos tarifs sont transparents. Les prix affichés incluent la livraison de base. Seules les options additionnelles (assurance, express) s'ajoutent.</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2 sm:mb-3 text-sm sm:text-base">Puis-je négocier les tarifs ?</h4>
                <p className="text-ksl-gray-light text-sm sm:text-base">Pour les gros volumes (plus de 100 envois/mois), nous proposons des tarifs personnalisés. Contactez-nous pour un devis sur mesure.</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2 sm:mb-3 text-sm sm:text-base">Les tarifs changent-ils souvent ?</h4>
                <p className="text-ksl-gray-light text-sm sm:text-base">Nos tarifs sont stables et n'évoluent qu'en cas de changement significatif des coûts de transport ou de la réglementation.</p>
              </div>
            </div>
          </div>
      </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-br from-gray-900 to-ksl-black text-white py-12 sm:py-16 md:py-20">
        <div className="container-ksl text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6">
            Besoin d'un devis personnalisé ?
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-300 mb-6 sm:mb-8 max-w-2xl mx-auto">
            Pour les gros volumes ou les besoins spécifiques, nous proposons des tarifs sur mesure
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <Link
              to="/contact"
              className="px-4 sm:px-6 md:px-8 py-3 sm:py-4 bg-ksl-red text-white rounded-xl hover:bg-ksl-red-dark transition-all duration-300 font-medium text-sm sm:text-base md:text-lg flex items-center justify-center space-x-2"
            >
              <span>Demander un devis</span>
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </Link>
            <Link
              to="/register"
              className="px-4 sm:px-6 md:px-8 py-3 sm:py-4 bg-white text-ksl-red rounded-xl hover:bg-gray-100 transition-all duration-300 font-medium text-sm sm:text-base md:text-lg"
            >
              Commencer maintenant
            </Link>
          </div>
      </div>
    </section>
    </div>
  );
} 