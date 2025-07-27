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
  Clock
} from 'lucide-react';
import { tariffAPI } from '../services/api';

export default function Tarifs() {
  const [selectedType, setSelectedType] = useState('zone');
  const [tariffs, setTariffs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const tariffTypes = [
    { 
      value: 'zone', 
      label: 'Par zone géographique', 
      icon: MapPin, 
      description: 'Tarification optimisée selon les 5 zones e-commerce CI', 
      color: 'from-emerald-500 to-emerald-600' 
    },
    { 
      value: 'commune', 
      label: 'Par commune', 
      icon: Home, 
      description: 'Tarif fixe entre communes (ex: Yop → Cocody)', 
      color: 'from-blue-500 to-blue-600' 
    },
    { 
      value: 'city', 
      label: 'Par ville', 
      icon: Building, 
      description: 'Tarif fixe entre villes (ex: Abidjan → Bouaké)', 
      color: 'from-green-500 to-green-600' 
    },
    { 
      value: 'weight', 
      label: 'Par poids', 
      icon: Package, 
      description: 'Coût calculé selon le poids (tranches ou par kg)', 
      color: 'from-purple-500 to-purple-600' 
    },
    { 
      value: 'volume', 
      label: 'Par volume', 
      icon: Volume, 
      description: 'Coût basé sur le volume (cm³ ou m³)', 
      color: 'from-orange-500 to-orange-600' 
    },
    { 
      value: 'distance', 
      label: 'Par distance', 
      icon: MapPin, 
      description: 'Coût basé sur la distance réelle en km', 
      color: 'from-red-500 to-red-600' 
    },
    { 
      value: 'zone_factor', 
      label: 'Facteur zone', 
      icon: Target, 
      description: 'Majoration selon la zone (difficile, éloignée...)', 
      color: 'from-yellow-500 to-yellow-600' 
    },
    { 
      value: 'insurance', 
      label: 'Facteur assurance', 
      icon: Shield, 
      description: 'Pourcentage appliqué sur la valeur déclarée', 
      color: 'from-indigo-500 to-indigo-600' 
    },
    { 
      value: 'delivery_time', 
      label: 'Temps de livraison', 
      icon: Clock, 
      description: 'Facteur livraison jours fériés et weekend', 
      color: 'from-pink-500 to-pink-600' 
    },
    { 
      value: 'relay_point', 
      label: 'Point relais', 
      icon: Users, 
      description: 'Frais spécifique livraison/retrait en point relais', 
      color: 'from-teal-500 to-teal-600' 
    },
    { 
      value: 'service_type', 
      label: 'Type de service', 
      icon: Zap, 
      description: 'Tarification selon le niveau de service (Économique/Standard/Express)', 
      color: 'from-violet-500 to-violet-600' 
    }
  ];

  useEffect(() => {
    loadTariffs();
  }, [selectedType]);

  const loadTariffs = async () => {
    try {
      setIsLoading(true);
      setError('');
      
      // Appel de l'API
      const response = await tariffAPI.getTariffs({ type: selectedType });
      
      // Si l'API retourne des données, on les utilise
      if (response.data && response.data.length > 0) {
        console.log('✅ Données API reçues:', response.data);
        setTariffs(response.data);
      } else {
        // Sinon on utilise les données de démonstration
        console.log('⚠️ API retourne des données vides, utilisation des données de démonstration');
        const demoData = getDemoTariffs(selectedType);
        console.log('📊 Données de démonstration:', demoData);
        setTariffs(demoData);
      }
    } catch (error) {
      console.error('❌ Erreur chargement tarifs:', error);
      setError('Impossible de charger les tarifs depuis l\'API. Affichage des données de démonstration.');
      
      // En cas d'erreur, on utilise les données de démonstration
      console.log('🔄 Chargement des données de démonstration suite à l\'erreur');
      const demoData = getDemoTariffs(selectedType);
      console.log('📊 Données de démonstration:', demoData);
      setTariffs(demoData);
    } finally {
      setIsLoading(false);
    }
  };

  const getDemoTariffs = (type) => {
    const demoData = {
      zone: [
        { zone: 'Zone 1 - Abidjan', base_price: 1500, express_price: 2500, description: 'Centre-ville et communes limitrophes' },
        { zone: 'Zone 2 - Grand Abidjan', base_price: 2000, express_price: 3000, description: 'Périphérie d\'Abidjan' },
        { zone: 'Zone 3 - Autres villes', base_price: 3000, express_price: 4500, description: 'Bouaké, San-Pédro, etc.' },
        { zone: 'Zone 4 - Villes moyennes', base_price: 4000, express_price: 6000, description: 'Korhogo, Man, etc.' },
        { zone: 'Zone 5 - Villes éloignées', base_price: 5000, express_price: 7500, description: 'Zones rurales et éloignées' }
      ],
      weight: [
        { weight_range: '0-1 kg', price: 1500, description: 'Petits colis et documents' },
        { weight_range: '1-3 kg', price: 2500, description: 'Colis moyens' },
        { weight_range: '3-5 kg', price: 3500, description: 'Colis lourds' },
        { weight_range: '5-10 kg', price: 5000, description: 'Gros colis' },
        { weight_range: '10+ kg', price: 'Sur devis', description: 'Très gros colis' }
      ],
      service_type: [
        { service: 'Économique', price: 1500, delivery_time: '3-5 jours', description: 'Livraison standard' },
        { service: 'Standard', price: 2500, delivery_time: '1-2 jours', description: 'Livraison rapide' },
        { service: 'Express', price: 4000, delivery_time: '24h', description: 'Livraison express' }
      ],
      commune: [
        { from: 'Yopougon', to: 'Cocody', price: 1500, description: 'Trajet urbain' },
        { from: 'Abobo', to: 'Treichville', price: 2000, description: 'Trajet urbain' },
        { from: 'Marcory', to: 'Plateau', price: 1200, description: 'Trajet urbain' }
      ],
      city: [
        { from: 'Abidjan', to: 'Bouaké', price: 5000, description: 'Trajet inter-villes' },
        { from: 'Abidjan', to: 'San-Pédro', price: 6000, description: 'Trajet inter-villes' },
        { from: 'Abidjan', to: 'Korhogo', price: 8000, description: 'Trajet inter-villes' }
      ]
    };
    
    return demoData[type] || [];
  };

  const renderTariffCard = (tariff, index) => {
    const currentType = tariffTypes.find(t => t.value === selectedType);
    
    switch (selectedType) {
      case 'zone':
        return (
          <div key={index} className="bg-white dark:bg-dark-bg-secondary rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700">
            <div className={`w-12 h-12 bg-gradient-to-br ${currentType.color} rounded-xl flex items-center justify-center mb-4`}>
              <currentType.icon className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{tariff.zone}</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">{tariff.description}</p>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Standard :</span>
                <span className="font-semibold text-gray-900 dark:text-white">{tariff.base_price} FCFA</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Express :</span>
                <span className="font-semibold text-ksl-red">{tariff.express_price} FCFA</span>
              </div>
            </div>
          </div>
        );
      
      case 'weight':
        return (
          <div key={index} className="bg-white dark:bg-dark-bg-secondary rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700">
            <div className={`w-12 h-12 bg-gradient-to-br ${currentType.color} rounded-xl flex items-center justify-center mb-4`}>
              <currentType.icon className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{tariff.weight_range}</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">{tariff.description}</p>
            <div className="text-2xl font-bold text-ksl-red">{tariff.price} FCFA</div>
          </div>
        );
      
      case 'service_type':
        return (
          <div key={index} className="bg-white dark:bg-dark-bg-secondary rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700">
            <div className={`w-12 h-12 bg-gradient-to-br ${currentType.color} rounded-xl flex items-center justify-center mb-4`}>
              <currentType.icon className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{tariff.service}</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">{tariff.description}</p>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Prix :</span>
                <span className="font-semibold text-ksl-red">{tariff.price} FCFA</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Délai :</span>
                <span className="font-semibold text-gray-900 dark:text-white">{tariff.delivery_time}</span>
              </div>
            </div>
          </div>
        );
      
      case 'commune':
      case 'city':
        return (
          <div key={index} className="bg-white dark:bg-dark-bg-secondary rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700">
            <div className={`w-12 h-12 bg-gradient-to-br ${currentType.color} rounded-xl flex items-center justify-center mb-4`}>
              <currentType.icon className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{tariff.from} → {tariff.to}</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">{tariff.description}</p>
            <div className="text-2xl font-bold text-ksl-red">{tariff.price} FCFA</div>
          </div>
        );
      
      default:
        return (
          <div key={index} className="bg-white dark:bg-dark-bg-secondary rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700">
            <div className={`w-12 h-12 bg-gradient-to-br ${currentType.color} rounded-xl flex items-center justify-center mb-4`}>
              <currentType.icon className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Tarif {selectedType}</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">Tarification en cours de configuration</p>
          </div>
        );
    }
  };

    return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-dark-bg dark:to-dark-bg-secondary">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-ksl-red via-ksl-red-dark to-ksl-black text-white py-20">
        <div className="container-ksl text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Nos Tarifs
          </h1>
          <p className="text-xl md:text-2xl text-ksl-gray-light mb-8 max-w-3xl mx-auto">
            Découvrez nos différents types de tarification adaptés à vos besoins
          </p>
        </div>
      </section>

      {/* Tariff Types Section */}
      <section className="py-20">
        <div className="container-ksl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Types de Tarification
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Choisissez le type de tarification qui correspond à vos besoins
            </p>
          </div>

          {/* Tariff Types Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {tariffTypes.map((type) => (
              <button
                key={type.value}
                onClick={() => setSelectedType(type.value)}
                className={`p-6 rounded-2xl text-left transition-all duration-300 ${
                  selectedType === type.value
                    ? 'bg-white dark:bg-dark-bg-secondary shadow-lg ring-2 ring-ksl-red'
                    : 'bg-white/50 dark:bg-dark-bg-secondary/50 hover:bg-white dark:hover:bg-dark-bg-secondary'
                }`}
              >
                <div className={`w-12 h-12 bg-gradient-to-br ${type.color} rounded-xl flex items-center justify-center mb-4`}>
                  <type.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                  {type.label}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {type.description}
                </p>
              </button>
            ))}
          </div>

          {/* Selected Type Details */}
          <div className="bg-white dark:bg-dark-bg-secondary rounded-3xl p-8 md:p-12 mb-16">
            <div className="text-center mb-12">
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                {tariffTypes.find(t => t.value === selectedType)?.label}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {tariffTypes.find(t => t.value === selectedType)?.description}
              </p>
            </div>

            {isLoading ? (
              <div className="text-center py-12">
                <div className="w-8 h-8 border-4 border-ksl-red border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600 dark:text-gray-300">Chargement des tarifs...</p>
              </div>
            ) : (
              <>
      {error && (
                  <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg text-center mb-8">
          {error}
        </div>
      )}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {tariffs.map((tariff, index) => renderTariffCard(tariff, index))}
                </div>
              </>
            )}
          </div>

          {/* Info Section */}
          <div className="bg-gradient-to-br from-ksl-red to-ksl-red-dark rounded-3xl p-8 md:p-12 text-white">
            <div className="text-center mb-8">
              <h3 className="text-2xl md:text-3xl font-bold mb-4">
                Informations importantes
              </h3>
              <p className="text-ksl-gray-light text-lg">
                Tout ce que vous devez savoir sur nos tarifs
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-semibold mb-3">Comment sont calculés nos tarifs ?</h4>
                <p className="text-ksl-gray-light">Nos tarifs sont calculés selon plusieurs facteurs : distance, poids, type de service et zone géographique. Nous nous efforçons d'offrir les meilleurs prix du marché.</p>
              </div>
              <div>
                <h4 className="font-semibold mb-3">Y a-t-il des frais cachés ?</h4>
                <p className="text-ksl-gray-light">Non, tous nos tarifs sont transparents. Les prix affichés incluent la livraison de base. Seules les options additionnelles (assurance, express) s'ajoutent.</p>
              </div>
              <div>
                <h4 className="font-semibold mb-3">Puis-je négocier les tarifs ?</h4>
                <p className="text-ksl-gray-light">Pour les gros volumes (plus de 100 envois/mois), nous proposons des tarifs personnalisés. Contactez-nous pour un devis sur mesure.</p>
              </div>
              <div>
                <h4 className="font-semibold mb-3">Les tarifs changent-ils souvent ?</h4>
                <p className="text-ksl-gray-light">Nos tarifs sont stables et n'évoluent qu'en cas de changement significatif des coûts de transport ou de la réglementation.</p>
              </div>
            </div>
          </div>
      </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-br from-gray-900 to-ksl-black text-white py-20">
        <div className="container-ksl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Besoin d'un devis personnalisé ?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Pour les gros volumes ou les besoins spécifiques, nous proposons des tarifs sur mesure
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/contact"
              className="px-8 py-4 bg-ksl-red text-white rounded-xl hover:bg-ksl-red-dark transition-all duration-300 font-medium text-lg flex items-center justify-center space-x-2"
            >
              <span>Demander un devis</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/register"
              className="px-8 py-4 bg-white text-ksl-red rounded-xl hover:bg-gray-100 transition-all duration-300 font-medium text-lg"
            >
              Commencer maintenant
            </Link>
          </div>
      </div>
    </section>
    </div>
  );
} 