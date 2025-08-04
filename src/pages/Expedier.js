import React, { useState, useEffect, useMemo } from 'react';
import {
  Package,
  MapPin,
  User,
  Phone,
  Mail,
  Building,
  Truck,
  Calculator,
  CreditCard,
  Clock,
  AlertCircle,
  CheckCircle,
  Plus,
  Minus,
  Info,
  Target,
  LocateFixed,
  Loader,
  FileText,
  ArrowLeft,
  ArrowRight,
  Edit,
  Key,
  AlertTriangle,
  Users,
  Send,
  Database,
  Shield,
  Globe
} from 'lucide-react';
import { Button, Card, Input, Badge, Alert, Modal, LocationSearch, ProgressBar, Tabs } from '../components/ui';
import { cn } from '../utils/cn';
import { useAuth } from '../contexts/AuthContext';
import { relayAPI, carrierAPI, modepaiementAPI } from '../services/api';
import { calculateTariff, getCityZone, searchCities, CITY_ZONE_MAPPING } from '../services/tariffService';
// import printService from '../services/printService';
import toast from 'react-hot-toast';

// Types de véhicules avec spécifications poids et volume exactes
const VEHICLE_TYPES = [
  { 
    id: 2, 
    name: 'Moto', 
    icon: '🏍️',
    min_weight: 0,
    max_weight: 51, 
    min_volume: 0,
    max_volume: 0.160,
    description: 'Moto - Poids < 51kg, Volume < 0.16m³' 
  },
  { 
    id: 1, 
    name: 'Voiture/Van/Tricycle', 
    icon: '🚗',
    min_weight: 51,
    max_weight: 201, 
    min_volume: 0.16,
    max_volume: 0.54,
    description: 'Voiture/Van/Tricycle - Poids 51-201kg, Volume 0.16-0.54m³' 
  },
  { 
    id: 4, 
    name: 'Fourgon', 
    icon: '🚐',
    min_weight: 201,
    max_weight: 2001, 
    min_volume: 0.54,
    max_volume: 19.2,
    description: 'Fourgon - Poids 201-2000kg, Volume 0.54-19.2m³' 
  },
  { 
    id: 7, 
    name: 'Camion', 
    icon: '🚛',
    min_weight: 2001,
    max_weight: 40000, 
    min_volume: 19.2,
    max_volume: 999,
    description: 'Camion - Poids > 2001kg, Volume > 19.2m³' 
  }
];

const Expedier = () => {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  
  // 🚚 FONCTION UTILITAIRE : Récupérer les données utilisateur depuis localStorage
  const getUserData = () => {
    try {
      const storedUser = localStorage.getItem('ksl_user');
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        console.log('✅ Données utilisateur récupérées depuis localStorage:', userData);
        return userData;
      }
      console.log('⚠️ Fallback sur user context');
      return user;
    } catch (error) {
      console.error('❌ Erreur récupération données utilisateur:', error);
      return user;
    }
  };
  
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [quoteData, setQuoteData] = useState(null);
  const [isCalculatingQuote, setIsCalculatingQuote] = useState(false);
  const [evaError, setEvaError] = useState(null);

  // États pour les données dynamiques
  const [relayPoints, setRelayPoints] = useState([]);
  const [carriers, setCarriers] = useState([]);
  const [isLoadingRelayPoints, setIsLoadingRelayPoints] = useState(false);
  const [isLoadingCarriers, setIsLoadingCarriers] = useState(false);
  const [relayPointsError, setRelayPointsError] = useState(null);
  const [carriersError, setCarriersError] = useState(null);

  // 💳 NOUVEAUX ÉTATS POUR LA GESTION DES MODES DE PAIEMENT
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [isLoadingPaymentMethods, setIsLoadingPaymentMethods] = useState(false);
  const [paymentMethodsError, setPaymentMethodsError] = useState(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [pendingExpeditionData, setPendingExpeditionData] = useState(null);

  // 🚚 NOUVEAU : Récupérer le transporteur assigné depuis localStorage (optimisé avec useMemo)
  const assignedCarrier = React.useMemo(() => {
    const userData = getUserData();
    const transporteur = userData?.transporteur;
    console.log('utilisateur', userData);
    if (transporteur) {
      console.log('✅ Transporteur trouvé:', transporteur);
    } else {
      console.log('ℹ️ Aucun transporteur assigné');
    }
    
    return transporteur;
  }, [user]);

  // État pour l'expédition au format EVA (CORRIGÉ)
  const [expeditionData, setExpeditionData] = useState({
    // Informations de base EVA
    ride_type_id: 2, // Par défaut : livraison
    vehicle_type_id: 2, // Motorcycle par défaut
    zone_id: 3, // Côte d'Ivoire selon l'exemple EVA
    business_id: null,

    // Mode d'expédition et service
    mode_expedition: 'home_delivery',
    delais_livraison: '24h à 48h',
    type_service: 'standard',
    // Adresses avec coordonnées GPS (MAINTENANT VISIBLES)
    from_latitude: '',
    from_longitude: '',
    from_address: '',
    to_latitude: '',
    to_longitude: '',
    to_address: '',
    
    // Informations client
    customer_first_name: '',
    customer_last_name: '',
    customer_phone_number: '+225',
    customer_email: '',
    
    // Informations destinataire
    recipient_first_name: '',
    recipient_last_name: '',
    
    // Informations point de retrait
    pickup_company_name: '',
    pickup_phone_number: '+225',
    pickup_email: '',
    pickup_note: '',
    order_note: '',
    
    // Articles à livrer
    pickup_items: [],
    
    // Options de livraison
    tip_amount: 0,
    total_price: 0,
    
    // 🚀 NOUVEAU : Type de service
    type_service: 'standard', // Par défaut : service standard
    delais_livraison: '24h à 48h', // Délai de livraison par défaut
    
    // 🛡️ NOUVEAU : Assurance
    isInsured: false, // Assurance cochable par l'utilisateur
    declared_value: '', // Valeur déclarée du colis
    
    // Point relais (optionnel)
    use_relay_point: false,
    selected_relay_point_id: null,
    order_number: null,
    onsite_timestamp: null,
    packageType: 'standard',
    shippingMode: 'home_delivery',
    selectedRelayPoint: null,
    selectedCarrier: user?.role === 'entreprise' ? 'assigned' : 'default',
  });

  // Articles - état séparé pour faciliter la gestion
  const [currentItem, setCurrentItem] = useState({
    name: '',
    category: 'Général',
    weight: '',
    length: '',
    width: '',
    height: '',
    quantity: 1
  });

  // Mock data pour les catégories et véhicules
  const [categories] = useState([
  'Documents / Imprimés / Enveloppe',
  'Textile & Accessoires',
  'Électronique & Objets connectés',
  'Produits alimentaires',
  'Produits de beauté & Hygiène',
  'Articles pour bébé & Enfants',
  'Pièces détachées & Outils',
  'Maison, Déco & Électroménagers',
  'Santé & Produits médicaux',
  'Fournitures & Accessoires de bureau',
  'Autres / Divers'
]);

  // Gestion des étapes (TON STYLE) - MODIFIÉ : Étapes 1 et 2 combinées
  const steps = [
    { id: 1, title: 'Expéditeur & Destinataire', description: 'Informations complètes' },
    { id: 2, title: 'Articles', description: 'Que livrer ?' },
    { id: 3, title: 'Devis', description: 'Calculer le prix' },
    { id: 4, title: 'Paiement', description: 'Choisir mode paiement' },
    { id: 5, title: 'Confirmation', description: 'Récapitulatif final' }
  ];

  // 🔄 Charger les transporteurs
  const loadCarriers = async () => {
    try {
      setIsLoadingCarriers(true);
      const response = await carrierAPI.getAllCarriers();
      setCarriers(response.data || []);
    } catch (error) {
      console.error('❌ Erreur chargement transporteurs:', error);
      setCarriersError('Erreur lors du chargement des transporteurs');
    } finally {
      setIsLoadingCarriers(false);
    }
  };

  // 📍 Gestion des adresses
  const handlePickupLocationSelect = (location) => {
    setExpeditionData(prev => ({
      ...prev,
      from_address: location.address,
      from_latitude: location.latitude.toString(),
      from_longitude: location.longitude.toString()
    }));
  };

  const handleDeliveryLocationSelect = (location) => {
    setExpeditionData(prev => ({
      ...prev,
      to_address: location.address,
      to_latitude: location.latitude.toString(),
      to_longitude: location.longitude.toString()
    }));
  };

  // 🧮 Calculer l'estimation
  const handleEstimation = async () => {
    if (!expeditionData.from_address || !expeditionData.to_address) {
      toast.error('Veuillez saisir les adresses de ramassage et de livraison');
      return;
    }

    if (expeditionData.pickup_items.length === 0) {
      toast.error('Veuillez ajouter au moins un article');
      return;
    }

    setIsCalculatingQuote(true);

    try {
      // Extraire les noms de villes des adresses
      const pickupCity = expeditionData.from_address.split(',')[0]?.trim() || 'Abidjan';
      const deliveryCity = expeditionData.to_address.split(',')[0]?.trim() || 'Abidjan';
      
      // Calculer la distance
      let distance = 0;
      if (expeditionData.from_latitude && expeditionData.from_longitude && 
          expeditionData.to_latitude && expeditionData.to_longitude) {
        const lat1 = parseFloat(expeditionData.from_latitude);
        const lon1 = parseFloat(expeditionData.from_longitude);
        const lat2 = parseFloat(expeditionData.to_latitude);
        const lon2 = parseFloat(expeditionData.to_longitude);
        
        const R = 6371; // Rayon de la Terre en km
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                  Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                  Math.sin(dLon/2) * Math.sin(dLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        distance = R * c;
      }

      // Calculer le poids total
      const totalWeight = expeditionData.pickup_items.reduce((sum, item) => {
        return sum + (parseFloat(item.weight) * parseInt(item.quantity));
      }, 0);

      // Préparer les données pour le calcul
      const shipmentData = {
        originCity: pickupCity,
        destinationCity: deliveryCity,
        weight: totalWeight,
        length: expeditionData.pickup_items[0]?.length || 0,
        width: expeditionData.pickup_items[0]?.width || 0,
        height: expeditionData.pickup_items[0]?.height || 0,
        volumeCm3: expeditionData.pickup_items.reduce((sum, item) => {
          return sum + ((parseFloat(item.length) || 0) * (parseFloat(item.width) || 0) * (parseFloat(item.height) || 0) * parseInt(item.quantity));
        }, 0),
        distance: distance,
        serviceType: expeditionData.type_service,
        declaredValue: parseFloat(expeditionData.declared_value) || 0,
        isInsured: expeditionData.isInsured,
        isDepotRelayPoint: expeditionData.shippingMode === 'relay_point',
        isPickupRelayPoint: false,
        isHolidayWeekend: false,
        vehicleType: 'voiture',
        carrierId: assignedCarrier?.id || 1
      };

      console.log('🧮 Calcul de tarification avec les données:', shipmentData);
      
      const result = await calculateTariff(shipmentData);
      setQuoteData(result);
      setShowQuoteModal(true);
      
      toast.success('Devis calculé avec succès !');
      
    } catch (error) {
      console.error('Erreur lors du calcul de tarification:', error);
      toast.error('Erreur lors du calcul de tarification. Veuillez réessayer.');
    } finally {
      setIsCalculatingQuote(false);
    }
  };

  // 🔄 Charger les données au montage
  useEffect(() => {
    loadCarriers();
  }, []);

  // Pré-remplissage automatique des infos expéditeur avec l'utilisateur connecté
  useEffect(() => {
    const userData = getUserData();
    if (userData) {
      setExpeditionData(prev => ({
        ...prev,
        customer_first_name: userData.firstName || userData.first_name || '',
        customer_last_name: userData.lastName || userData.last_name || '',
        customer_email: userData.email || '',
        customer_phone_number: userData.phone || '+225'
      }));
    }
  }, [user]);

  // Fonctions utilitaires
  const updateExpeditionData = (field, value) => {
    setExpeditionData(prev => ({ ...prev, [field]: value }));
  };

  const addItem = () => {
    if (!currentItem.name || !currentItem.weight) {
      toast.error('Veuillez saisir au moins le nom et le poids de l\'article');
      return;
    }

    setExpeditionData(prev => ({
      ...prev,
      pickup_items: [...prev.pickup_items, { ...currentItem }]
    }));

    setCurrentItem({
      name: '',
      category: 'Général',
      weight: '',
      length: '',
      width: '',
      height: '',
      quantity: 1
    });

    toast.success('Article ajouté avec succès');
  };

  const removeItem = (index) => {
    setExpeditionData(prev => ({
      ...prev,
      pickup_items: prev.pickup_items.filter((_, i) => i !== index)
    }));
  };

  const validateStep = (step) => {
    switch (step) {
      case 1:
        return expeditionData.customer_first_name && 
               expeditionData.customer_last_name && 
               expeditionData.customer_phone_number &&
               expeditionData.from_address &&
               expeditionData.to_address;
      case 2:
        return expeditionData.pickup_items.length > 0;
      case 3:
        return quoteData !== null;
      case 4:
        return selectedPaymentMethod !== null;
      default:
        return true;
    }
  };

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    } else {
      toast.error('Veuillez remplir tous les champs obligatoires');
    }
  };

  const handlePrevStep = () => {
    setCurrentStep(prev => Math.max(1, prev - 1));
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  // Fonction pour obtenir la position actuelle
  const getCurrentLocation = (type) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          if (type === 'from') {
            updateExpeditionData('from_latitude', latitude.toString());
            updateExpeditionData('from_longitude', longitude.toString());
            toast.success('Position de ramassage récupérée !');
          } else if (type === 'to') {
            updateExpeditionData('to_latitude', latitude.toString());
            updateExpeditionData('to_longitude', longitude.toString());
            toast.success('Position de livraison récupérée !');
          }
        },
        (error) => {
          console.error('Erreur géolocalisation:', error);
          toast.error('Impossible de récupérer votre position');
        }
      );
    } else {
      toast.error('Géolocalisation non supportée par votre navigateur');
    }
  };

    return (
    <div className="container-ksl mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
      <div className="space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-2 sm:space-y-0">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
              Nouvelle expédition 
            </h1>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
              Créez votre livraison
            </p>
          </div>
        </div>

      {/* Stepper amélioré */}
      <div className="bg-white dark:bg-dark-bg-secondary p-4 sm:p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg">
        {/* Version desktop */}
        <div className="hidden md:flex items-center justify-between">
          {steps.map((step, index) => (
            <React.Fragment key={step.id}>
              <div className="flex flex-col items-center">
                <div className={cn(
                  'w-12 h-12 rounded-full flex items-center justify-center text-sm font-medium shadow-md transition-all duration-300 transform hover:scale-110',
                  currentStep === step.id && step.id === steps.length ? 'bg-green-500 text-white shadow-green-500/50' :
                  currentStep === step.id ? 'bg-ksl-red text-white shadow-ksl-red/50' :
                  currentStep > step.id ? 'bg-green-500 text-white shadow-green-500/50' :
                  'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400 shadow-gray-300/50'
                )}>
                  {(currentStep > step.id) || (currentStep === step.id && step.id === steps.length) ? '✓' : step.id}
                </div>
                <span className={cn(
                  'mt-2 text-sm font-medium text-center transition-colors duration-300',
                  currentStep === step.id && step.id === steps.length ? 'text-green-600' :
                  currentStep === step.id ? 'text-ksl-red' :
                  currentStep > step.id ? 'text-green-600' :
                  'text-gray-500'
                )}>
                  {step.title}
                </span>
                <span className="text-xs text-gray-400 mt-1 text-center">
                  {step.description}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div className={cn(
                  'flex-1 h-1 mx-4 rounded-full transition-all duration-300',
                  currentStep > step.id ? 'bg-green-500 shadow-green-500/50' : 'bg-gray-200 dark:bg-gray-700'
                )} />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Version mobile */}
        <div className="md:hidden">
          <div className="flex items-center justify-center mb-4">
            <div className={cn(
              'w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium shadow-md transition-all duration-300',
              currentStep === steps.length ? 'bg-green-500 text-white shadow-green-500/50' :
              currentStep >= 1 ? 'bg-ksl-red text-white shadow-ksl-red/50' :
              'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400 shadow-gray-300/50'
            )}>
              {currentStep === steps.length ? '✓' : currentStep}
            </div>
            <div className="ml-3">
              <div className="text-sm font-medium text-gray-900 dark:text-white">
                {steps.find(s => s.id === currentStep)?.title || 'Étape'}
              </div>
              <div className="text-xs text-gray-500">
                {steps.find(s => s.id === currentStep)?.description || ''}
              </div>
            </div>
          </div>
          
          {/* Barre de progression mobile */}
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div 
              className={cn(
                'h-2 rounded-full transition-all duration-300',
                currentStep === steps.length ? 'bg-green-500' : 'bg-ksl-red'
              )}
              style={{ width: `${(currentStep / steps.length) * 100}%` }}
            />
          </div>
          
          {/* Indicateur d'étapes */}
          <div className="flex justify-center mt-3 space-x-1">
            {steps.map((step) => (
              <div
                key={step.id}
                className={cn(
                  'w-2 h-2 rounded-full transition-all duration-300',
                  currentStep >= step.id ? 'bg-ksl-red' : 'bg-gray-300 dark:bg-gray-600'
                )}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        
        {/* Formulaire principal */}
        <div className="lg:col-span-2">
          <Card className="p-4 sm:p-6 lg:p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            
            {/* Étape 1: Expéditeur ET Destinataire */}
            {currentStep === 1 && (
              <div className="space-y-6 sm:space-y-8">
                {/* Section Expéditeur */}
                <div className="space-y-4 sm:space-y-6">
                  <div className="flex items-center space-x-3">
                    <User className="w-5 h-5 sm:w-6 sm:h-6 text-ksl-red" />
                    <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
                      Informations de ramassage
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                    <Input
                      label="Prénom *"
                      value={expeditionData.customer_first_name}
                      onChange={(e) => updateExpeditionData('customer_first_name', e.target.value)}
                      leftIcon={User}
                    />
                    
                    <Input
                      label="Nom *"
                      value={expeditionData.customer_last_name}
                      onChange={(e) => updateExpeditionData('customer_last_name', e.target.value)}
                      leftIcon={User}
                    />
                    
                    <Input
                      label="Téléphone *"
                      value={expeditionData.customer_phone_number}
                      onChange={(e) => updateExpeditionData('customer_phone_number', e.target.value)}
                      leftIcon={Phone}
                      placeholder="+225 XX XX XX XX XX"
                    />
                    
                    <Input
                      label="Email"
                      type="email"
                      value={expeditionData.customer_email}
                      onChange={(e) => updateExpeditionData('customer_email', e.target.value)}
                      leftIcon={Mail}
                    />
                  </div>

                  {/* Recherche d'adresse de ramassage */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Adresse de ramassage * 
                      <span className="text-xs text-gray-500 ml-1">(avec recherche GPS)</span>
                    </label>
                    <LocationSearch
                      value={expeditionData.from_address}
                      onChange={(address) => updateExpeditionData('from_address', address)}
                      onLocationSelect={handlePickupLocationSelect}
                      placeholder="Rechercher l'adresse de ramassage..."
                      className="w-full"
                    />
                  </div>

                  {/* Coordonnées GPS Expéditeur */}
                  <Card className="p-3 sm:p-4 bg-blue-50 dark:bg-blue-900/20 shadow-md hover:shadow-lg transition-all duration-300">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 space-y-2 sm:space-y-0">
                      <h3 className="font-medium text-gray-900 dark:text-white flex items-center">
                        <Target className="w-4 h-4 mr-2 text-ksl-red" />
                        <span className="text-sm sm:text-base">Coordonnées GPS de ramassage *</span>
                      </h3>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => getCurrentLocation('from')}
                      >
                        <LocateFixed className="w-4 h-4 mr-1" />
                        <span className="text-xs sm:text-sm">Ma position</span>
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      <Input
                        label="Latitude *"
                        type="number"
                        step="any"
                        value={expeditionData.from_latitude}
                        onChange={(e) => updateExpeditionData('from_latitude', e.target.value)}
                        placeholder="5.336987"
                      />
                      <Input
                        label="Longitude *"
                        type="number"
                        step="any"
                        value={expeditionData.from_longitude}
                        onChange={(e) => updateExpeditionData('from_longitude', e.target.value)}
                        placeholder="-4.008215"
                      />
                    </div>
                    
                    {expeditionData.from_latitude && expeditionData.from_longitude && (
                      <Alert variant="success" className="mt-3">
                        <CheckCircle className="w-4 h-4" />
                        Position confirmée: {expeditionData.from_latitude}, {expeditionData.from_longitude}
                      </Alert>
                    )}
                  </Card>
                </div>

                {/* Séparateur visuel */}
                <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                  <div className="flex items-center justify-center mb-6">
                    <div className="bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-full">
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        📦 Configuration de la livraison
                      </span>
                    </div>
                  </div>
                </div>

                {/* Section Destinataire */}
                <div className="space-y-4 sm:space-y-6">
                  <div className="flex items-center space-x-3">
                    <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-ksl-red" />
                    <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
                      Informations de livraison
                    </h2>
                  </div>

                  {/* Zone Côte d'Ivoire FIXE */}
                  <Alert variant="info">
                    <Info className="w-4 h-4" />
                    <div>
                      <p className="font-medium">Zone de livraison: Côte d'Ivoire</p>
                      <p className="text-sm">Livraison disponible sur tout le territoire ivoirien</p>
                    </div>
                  </Alert>

                  {/* Type de colis */}
                  <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-gray-50 dark:bg-gray-800 rounded-lg shadow-md">
                    <label className="block text-sm font-medium text-white dark:text-white mb-3">
                      📦 Type de colis *
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3">
                      {[
                        { value: 'standard', label: 'Standard', emoji: '📦' },
                        { value: 'fragile', label: 'Fragile', emoji: '🔍' },
                        { value: 'cold', label: 'Froid', emoji: '❄️' },
                        { value: 'secured', label: 'Sécurisé', emoji: '🔒' },
                        { value: 'large_volume', label: 'Gros volume', emoji: '📏' }
                      ].map(type => (
                        <button
                          key={type.value}
                          type="button"
                          className={cn(
                            'px-3 sm:px-4 py-2 sm:py-3 rounded-lg border-2 transition-all duration-300 transform hover:scale-105 hover:shadow-md', 
                            expeditionData.packageType === type.value 
                               ? 'border-ksl-red bg-ksl-red/5 dark:bg-ksl-red/10'
                               : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                          )}
                          onClick={() => updateExpeditionData('packageType', type.value)}
                        >
                          <div className="flex flex-col items-center">
                            <span className="text-xl sm:text-2xl mb-1">{type.emoji}</span>
                            <span className="font-medium text-gray-900 dark:text-white text-xs sm:text-sm">{type.label}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Le type de colis détermine les points relais disponibles et les tarifs appliqués
                    </p>
                  </div>

                  {/* Mode d'expédition */}
                  <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-gray-50 dark:bg-gray-800 rounded-lg shadow-md">
                    <label className="block text-sm font-medium text-white dark:text-white mb-3">
                      🚚 Mode d'expédition *
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                                              <button
                          type="button"
                          className={cn(
                            'px-4 sm:px-6 py-3 sm:py-4 rounded-lg border-2 transition-all duration-300 transform hover:scale-105 hover:shadow-md', 
                            expeditionData.shippingMode === 'home_delivery' 
                              ? 'border-ksl-red bg-ksl-red/5 dark:bg-ksl-red/10'
                               : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                          )}
                          onClick={() => updateExpeditionData('shippingMode', 'home_delivery')}
                        >
                          <div className="flex flex-col items-center">
                            <span className="text-xl sm:text-2xl mb-1 sm:mb-2">🏠</span>
                            <span className="font-medium text-gray-900 dark:text-white text-xs sm:text-sm">Livraison à domicile</span>
                          </div>
                        </button>
                        <button
                          type="button"
                          className={cn(
                            'px-4 sm:px-6 py-3 sm:py-4 rounded-lg border-2 transition-all duration-300 transform hover:scale-105 hover:shadow-md', 
                            expeditionData.shippingMode === 'relay_point' 
                              ? 'border-ksl-red bg-ksl-red/5 dark:bg-ksl-red/10'
                               : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                          )}
                          onClick={() => updateExpeditionData('shippingMode', 'relay_point')}
                        >
                          <div className="flex flex-col items-center">
                            <span className="text-xl sm:text-2xl mb-1 sm:mb-2">🏪</span>
                            <span className="font-medium text-gray-900 dark:text-white text-xs sm:text-sm">Dépôt en point relais</span>
                          </div>
                        </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-3 text-center">
                      Choisissez entre livraison directe ou dépôt en point relais
                    </p>
                  </div>

                  {/* Transporteur */}
                  <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-gray-50 dark:bg-gray-800 rounded-lg shadow-md">
                    <label className="block text-sm font-medium text-white dark:text-white mb-3">
                      🚛 Transporteur
                      {isLoadingCarriers && <Loader className="w-4 h-4 ml-2 animate-spin inline" />}
                    </label>
                    
                    {carriersError && (
                      <Alert variant="error" className="mb-3">
                        <AlertCircle className="w-4 h-4" />
                        {carriersError}
                      </Alert>
                    )}
                    
                    <select
                      value={expeditionData.selectedCarrier || ''}
                      onChange={e => updateExpeditionData('selectedCarrier', e.target.value)}
                      className="block w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100 bg-white dark:bg-dark-bg-secondary focus:outline-none focus:ring-2 focus:ring-ksl-red focus:border-ksl-red transition-all duration-300 shadow-sm hover:shadow-md"
                      disabled={user?.role === 'entreprise' || isLoadingCarriers}
                    >
                      <option value="">Sélectionnez un transporteur...</option>
                      {carriers.map(carrier => (
                        <option key={carrier.id} value={carrier.id}>
                          {carrier.nom}
                        </option>
                      ))}
                    </select>
                    
                    <p className="text-xs text-gray-500 mt-2">
                      Transporteur assigné à votre compte
                    </p>
                    
                    {carriers.length === 0 && !isLoadingCarriers && (
                      <p className="text-sm text-gray-500 mt-2">
                        Aucun transporteur disponible pour le moment.
                      </p>
                    )}
                  </div>

                  {/* Recherche d'adresse de livraison */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      📍 Adresse de livraison *
                      <span className="text-xs text-gray-500 ml-1">(avec recherche GPS)</span>
                    </label>
                    <LocationSearch
                      value={expeditionData.to_address}
                      onChange={(address) => updateExpeditionData('to_address', address)}
                      onLocationSelect={handleDeliveryLocationSelect}
                      placeholder="Rechercher l'adresse de livraison..."
                      className="w-full"
                    />
                  </div>



                  {/* Coordonnées GPS Destinataire */}
                  <Card className="p-3 sm:p-4 bg-green-50 dark:bg-green-900/20 shadow-md hover:shadow-lg transition-all duration-300">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 space-y-2 sm:space-y-0">
                      <h3 className="font-medium text-gray-900 dark:text-white flex items-center">
                        <Target className="w-4 h-4 mr-2 text-ksl-red" />
                        <span className="text-sm sm:text-base">Coordonnées GPS de livraison *</span>
                      </h3>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => getCurrentLocation('to')}
                      >
                        <LocateFixed className="w-4 h-4 mr-1" />
                        <span className="text-xs sm:text-sm">Ma position</span>
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      <Input
                        label="Latitude *"
                        type="number"
                        step="any"
                        value={expeditionData.to_latitude}
                        onChange={(e) => updateExpeditionData('to_latitude', e.target.value)}
                        placeholder="5.347500"
                      />
                      <Input
                        label="Longitude *"
                        type="number"
                        step="any"
                        value={expeditionData.to_longitude}
                        onChange={(e) => updateExpeditionData('to_longitude', e.target.value)}
                        placeholder="-4.015400"
                      />
                    </div>
                    
                    {expeditionData.to_latitude && expeditionData.to_longitude && (
                      <Alert variant="success" className="mt-3">
                        <CheckCircle className="w-4 h-4" />
                        Position confirmée: {expeditionData.to_latitude}, {expeditionData.to_longitude}
                      </Alert>
                    )}
                  </Card>

                  {/* Informations destinataire */}
                  <div className="space-y-4">
                    <h3 className="font-medium text-gray-900 dark:text-white flex items-center">
                      <User className="w-4 h-4 mr-2 text-ksl-red" />
                      <span className="text-sm sm:text-base">Informations du destinataire</span>
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                      <Input
                        label="Prénom du destinataire *"
                        value={expeditionData.recipient_first_name}
                        onChange={(e) => updateExpeditionData('recipient_first_name', e.target.value)}
                        leftIcon={User}
                        placeholder="Prénom du destinataire"
                      />
                      <Input
                        label="Nom du destinataire *"
                        value={expeditionData.recipient_last_name}
                        onChange={(e) => updateExpeditionData('recipient_last_name', e.target.value)}
                        leftIcon={User}
                        placeholder="Nom du destinataire"
                      />
                    </div>
                    
                    {/* Numéro de téléphone du destinataire */}
                    <Input
                      label="Numéro de téléphone du destinataire *"
                      value={expeditionData.recipient_phone || ''}
                      onChange={(e) => updateExpeditionData('recipient_phone', e.target.value)}
                      leftIcon={Phone}
                      placeholder="+225 XX XX XX XX XX"
                    />
                    
                    {/* Email du destinataire */}
                    <Input
                      label="Email du destinataire"
                      type="email"
                      value={expeditionData.recipient_email || ''}
                      onChange={(e) => updateExpeditionData('recipient_email', e.target.value)}
                      leftIcon={Mail}
                      placeholder="email@exemple.com"
                    />
                    
                    {/* Numéro de commande */}
                    <Input
                      label="Numéro de commande (5 chiffres)"
                      value={expeditionData.order_number || ''}
                      onChange={(e) => {
                        // Limiter à 5 chiffres numériques
                        const val = e.target.value.replace(/\D/g, '').slice(0, 5);
                        updateExpeditionData('order_number', val);
                      }}
                      leftIcon={FileText}
                      placeholder="Saisir 5 chiffres"
                      maxLength={5}
                      inputMode="numeric"
                    />
                    
                    {/* Notes de livraison */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Notes de livraison
                      </label>
                      <textarea
                        value={expeditionData.order_note || ''}
                        onChange={(e) => updateExpeditionData('order_note', e.target.value)}
                        placeholder="Instructions spéciales pour la livraison..."
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-dark-bg-secondary text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-ksl-red"
                      />
                    </div>
                  </div>
                </div>

                {/* Navigation */}
                <div className="flex flex-col sm:flex-row justify-between pt-6 space-y-3 sm:space-y-0">
                  <Button
                    variant="outline"
                    onClick={handlePrevStep}
                    disabled={currentStep === 1}
                    className="w-full sm:w-auto"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    <span className="text-sm sm:text-base">Précédent</span>
                  </Button>
                  <Button
                    onClick={handleNextStep}
                    disabled={!validateStep(1)}
                    className="w-full sm:w-auto"
                  >
                    <span className="text-sm sm:text-base">Suivant</span>
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            )}

            {/* Étape 2: Articles */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="flex items-center space-x-3">
                  <Package className="w-6 h-6 text-ksl-red" />
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Articles à livrer
                  </h2>
                </div>

                {/* Formulaire d'ajout d'article */}
                <Card className="p-4 bg-gray-50 dark:bg-gray-800">
                  <h3 className="font-medium text-gray-900 dark:text-white mb-4">
                    Ajouter un article
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <Input
                      label="Nom de l'article *"
                      value={currentItem.name}
                      onChange={(e) => setCurrentItem(prev => ({...prev, name: e.target.value}))}
                      placeholder="Ex: Ordinateur portable"
                    />
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Catégorie
                      </label>
                      <select
                        value={currentItem.category}
                        onChange={(e) => setCurrentItem(prev => ({...prev, category: e.target.value}))}
                        className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100 bg-white dark:bg-dark-bg-secondary focus:outline-none focus:ring-2 focus:ring-ksl-red focus:border-transparent"
                      >
                        {categories.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                    
                    <Input
                      label="Poids (kg) *"
                      type="number"
                      step="0.1"
                      value={currentItem.weight}
                      onChange={(e) => setCurrentItem(prev => ({...prev, weight: e.target.value}))}
                      placeholder="0.0"
                    />
                    
                    <Input
                      label="Quantité"
                      type="number"
                      min="1"
                      value={currentItem.quantity}
                      onChange={(e) => setCurrentItem(prev => ({...prev, quantity: e.target.value}))}
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <Input
                      label="Longueur (cm)"
                      type="number"
                      value={currentItem.length}
                      onChange={(e) => setCurrentItem(prev => ({...prev, length: e.target.value}))}
                      placeholder="0"
                    />
                    
                    <Input
                      label="Largeur (cm)"
                      type="number"
                      value={currentItem.width}
                      onChange={(e) => setCurrentItem(prev => ({...prev, width: e.target.value}))}
                      placeholder="0"
                    />
                    
                    <Input
                      label="Hauteur (cm)"
                      type="number"
                      value={currentItem.height}
                      onChange={(e) => setCurrentItem(prev => ({...prev, height: e.target.value}))}
                      placeholder="0"
                    />
                  </div>

                  <Button onClick={addItem} className="w-full">
                    <Plus className="w-4 h-4 mr-2" />
                    Ajouter l'article
                  </Button>
                </Card>

                {/* Liste des articles ajoutés */}
                {expeditionData.pickup_items.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      Articles ajoutés ({expeditionData.pickup_items.length})
                    </h3>
                    
                    {expeditionData.pickup_items.map((item, index) => (
                      <Card key={index} className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900 dark:text-white">
                              {item.name} 
                              <Badge className="ml-2">{item.category}</Badge>
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {item.weight}kg • {item.quantity} unité(s) • 
                              {item.length}×{item.width}×{item.height}cm
                            </p>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeItem(index)}
                          >
                            <Minus className="w-4 h-4" />
                          </Button>
                        </div>
                      </Card>
                    ))}

                    {/* Résumé automatique */}
                    <Alert variant="info">
                      <Info className="w-4 h-4" />
                      <p>
                        <strong>Résumé:</strong> {expeditionData.pickup_items.length} article(s), 
                        Poids total: {expeditionData.pickup_items.reduce((sum, item) => 
                          sum + (item.weight * item.quantity), 0
                        ).toFixed(1)}kg
                      </p>
                    </Alert>
                  </div>
                )}

                {/* Type de véhicule EVA (modifiable) */}
                <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg shadow-md">
                  <label className="block text-sm font-medium text-white dark:text-white mb-3">
                    Type de véhicule EVA (modifiable)
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {[
                      { id: 2, name: 'Moto', icon: '🏍️', min_weight: 0, max_weight: 51, min_volume: 0, max_volume: 0.160, description: 'Moto - Poids < 51kg, Volume < 0.16m³' },
                      { id: 1, name: 'Voiture/Van/Tricycle', icon: '🚗', min_weight: 51, max_weight: 201, min_volume: 0.16, max_volume: 0.54, description: 'Voiture/Van/Tricycle - Poids 51-201kg, Volume 0.16-0.54m³' },
                      { id: 4, name: 'Fourgon', icon: '🚐', min_weight: 201, max_weight: 2001, min_volume: 0.54, max_volume: 19.2, description: 'Fourgon - Poids 201-2000kg, Volume 0.54-19.2m³' },
                      { id: 7, name: 'Camion', icon: '🚛', min_weight: 2001, max_weight: 40000, min_volume: 19.2, max_volume: 999, description: 'Camion - Poids > 2001kg, Volume > 19.2m³' }
                    ].map((vehicle) => (
                      <button
                        key={vehicle.id}
                        type="button"
                        onClick={() => updateExpeditionData('vehicle_type_id', vehicle.id)}
                        className={cn(
                          'relative p-4 border rounded-lg text-left transition-all hover:shadow-md',
                          expeditionData.vehicle_type_id === vehicle.id
                            ? 'border-ksl-red bg-ksl-red/10'
                            : 'border-gray-300 hover:border-gray-400 dark:border-gray-600'
                        )}
                      >
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="text-2xl">{vehicle.icon}</span>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {vehicle.name}
                          </div>
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                          <div>Poids: {vehicle.min_weight}-{vehicle.max_weight}kg</div>
                          <div>Volume: {vehicle.min_volume}-{vehicle.max_volume}m³</div>
                        </div>
                        {expeditionData.vehicle_type_id === vehicle.id && (
                          <div className="absolute top-2 right-2">
                            <CheckCircle className="w-4 h-4 text-ksl-red" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 📋 RÉCAPITULATIF DES CHOIX DE LIVRAISON */}
                <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg shadow-md">
                  <label className="block text-sm font-medium text-white dark:text-white mb-3">
                    📋 Récapitulatif des choix de livraison
                  </label>
                  
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg">
                    <div className="space-y-3">
                      {/* Type de colis */}
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-blue-900 dark:text-blue-100">Type de colis:</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-blue-700 dark:text-blue-300">
                            {(() => {
                              const types = [
                                { value: 'standard', emoji: '📦', label: 'Standard' },
                                { value: 'fragile', emoji: '🔍', label: 'Fragile' },
                                { value: 'cold', emoji: '❄️', label: 'Froid' },
                                { value: 'secured', emoji: '🔒', label: 'Sécurisé' },
                                { value: 'large_volume', emoji: '📏', label: 'Gros volume' }
                              ];
                              const selectedType = types.find(t => t.value === expeditionData.packageType);
                              return selectedType ? selectedType.emoji : '📦';
                            })()}
                          </span>
                          <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
                            {(() => {
                              const types = [
                                { value: 'standard', label: 'Standard' },
                                { value: 'fragile', label: 'Fragile' },
                                { value: 'cold', label: 'Froid' },
                                { value: 'secured', label: 'Sécurisé' },
                                { value: 'large_volume', label: 'Gros volume' }
                              ];
                              const selectedType = types.find(t => t.value === expeditionData.packageType);
                              return selectedType ? selectedType.label : 'Non défini';
                            })()}
                          </span>
                        </div>
                      </div>

                      {/* Mode d'expédition */}
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-blue-900 dark:text-blue-100">Mode d'expédition:</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-blue-700 dark:text-blue-300">
                            {expeditionData.shippingMode === 'relay_point' ? '🏪' : '🚚'}
                          </span>
                          <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
                            {expeditionData.shippingMode === 'relay_point' ? 'Dépôt en point relais' : 'Livraison à domicile'}
                          </span>
                        </div>
                      </div>

                      {/* Transporteur */}
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-blue-900 dark:text-blue-100">Transporteur:</span>
                        <div className="text-right">
                          {expeditionData.selectedCarrier ? (
                            <div className="text-sm text-blue-800 dark:text-blue-200">
                              {carriers.find(c => c.id.toString() === expeditionData.selectedCarrier)?.nom || 'Transporteur sélectionné'}
                            </div>
                          ) : (
                            <span className="text-sm text-orange-600 dark:text-orange-400">À sélectionner</span>
                          )}
                        </div>
                      </div>

                      {/* Adresse de livraison */}
                      <div className="flex items-start justify-between">
                        <span className="text-sm font-medium text-blue-900 dark:text-blue-100">Adresse de livraison:</span>
                        <div className="text-right max-w-xs">
                          {expeditionData.to_address ? (
                            <div className="text-sm text-blue-800 dark:text-blue-200">
                              {expeditionData.to_address}
                              {expeditionData.to_latitude && expeditionData.to_longitude && (
                                <div className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                                  📍 {expeditionData.to_latitude}, {expeditionData.to_longitude}
                                </div>
                              )}
                            </div>
                          ) : (
                            <span className="text-sm text-orange-600 dark:text-orange-400">À saisir</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 🚚 Type de service */}
                <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg shadow-md">
                  <label className="block text-sm font-medium text-white dark:text-white mb-3">
                    🚚 Type de service
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    {[
                      { key: 'express', name: 'Express', icon: '⚡', description: 'Rapide', factor: 1.5, delais: '2h à 4h', color: 'orange' },
                      { key: 'standard', name: 'Standard', icon: '📦', description: 'Normal', factor: 1.0, delais: '24h à 48h', color: 'blue' },
                      { key: 'economique', name: 'Économique', icon: '💰', description: 'Éco', factor: 0.8, delais: '48h à 78h', color: 'green' },
                      { key: 'regional', name: 'Régional', icon: '🌍', description: 'Régional', factor: 0.9, delais: '86H - 2-4 JOURS', color: 'purple' },
                      { key: 'simplicite', name: 'Simplicité', icon: '🎯', description: 'Simple', factor: 1.2, delais: '24H - 0-1 JOUR', color: 'red' }
                    ].map((service) => (
                      <button
                        key={service.key}
                        type="button"
                        onClick={() => {
                          updateExpeditionData('type_service', service.key);
                          updateExpeditionData('delais_livraison', service.delais);
                        }}
                        className={cn(
                          'relative p-4 border-2 rounded-lg text-left transition-all hover:shadow-md',
                          expeditionData.type_service === service.key
                            ? `border-${service.color}-500 bg-${service.color}-50 dark:bg-${service.color}-900/20`
                            : 'border-gray-200 hover:border-gray-300 dark:border-gray-600 dark:hover:border-gray-500'
                        )}
                      >
                        {/* Badge du pourcentage */}
                        <div className="flex items-start justify-between mb-2">
                          <span className="text-2xl">{service.icon}</span>
                          <span className={cn(
                            'text-xs px-2 py-1 rounded-full',
                            service.key === 'express' && 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400',
                            service.key === 'economique' && 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
                            service.key === 'standard' && 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
                            service.key === 'regional' && 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400',
                            service.key === 'simplicite' && 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                          )}>
                            {service.description}
                          </span>
                        </div>
                        
                        <div className="space-y-1">
                          <h4 className="font-semibold text-gray-900 dark:text-white text-lg">
                            {service.name}
                          </h4>
                          
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            {service.key === 'express' && 'Livraison rapide, priorité maximale'}
                            {service.key === 'standard' && 'Livraison normale, bon rapport qualité/prix'}
                            {service.key === 'economique' && 'Livraison économique, délai plus long'}
                            {service.key === 'regional' && 'Livraison régionale, couverture étendue'}
                            {service.key === 'simplicite' && 'Livraison simple, service basique'}
                          </div>
                          
                          <div className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                            Délai: {service.delais}
                          </div>
                          
                          <div className="text-xs text-gray-500 dark:text-gray-500">
                            Facteur de prix: ×{service.factor}
                          </div>
                        </div>
                        
                        {/* Indicateur de sélection */}
                        {expeditionData.type_service === service.key && (
                          <div className="absolute top-2 right-2">
                            <CheckCircle className="w-5 h-5 text-ksl-red" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                  
                  {/* Information supplémentaire sur le service sélectionné */}
                  {expeditionData.type_service && (
                    <Alert variant={expeditionData.type_service === 'regional' ? 'warning' : 'info'} className="mt-3">
                      <Info className="w-4 h-4" />
                      <p className="text-sm">
                        <strong>Service {expeditionData.type_service === 'express' ? 'Express' : expeditionData.type_service === 'standard' ? 'Standard' : expeditionData.type_service === 'economique' ? 'Économique' : expeditionData.type_service === 'regional' ? 'Régional' : 'Simplicité'} sélectionné</strong>
                        {expeditionData.type_service === 'regional' && (
                          <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400">
                            🌍 Automatique
                          </span>
                        )}
                        <br />
                        Délai de livraison estimé: <strong>{expeditionData.delais_livraison}</strong>
                        <br />
                        {expeditionData.type_service === 'express' && 'Votre colis sera traité en priorité avec un délai de livraison réduit (+50% du tarif de base).'}
                        {expeditionData.type_service === 'standard' && 'Service standard avec un bon équilibre entre prix et délai de livraison (tarif de base).'}
                        {expeditionData.type_service === 'economique' && 'Option économique avec un délai de livraison plus long mais un tarif réduit (-20% du tarif de base).'}
                        {expeditionData.type_service === 'regional' && 'Service régional avec couverture étendue et délai de 2-4 jours (-10% du tarif de base). Automatiquement sélectionné car l\'expédition se fait entre des zones différentes.'}
                        {expeditionData.type_service === 'simplicite' && 'Service simple avec livraison basique en 0-1 jour (+20% du tarif de base).'}
                      </p>
                    </Alert>
                  )}
                </div>

                {/* 🛡️ Assurance du colis */}
                <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg shadow-md">
                  <label className="block text-sm font-medium text-white dark:text-white mb-3">
                    🛡️ Assurance du colis
                  </label>
                  
                  {/* Checkbox d'assurance */}
                  <div className="mb-4">
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={expeditionData.isInsured}
                        onChange={(e) => updateExpeditionData('isInsured', e.target.checked)}
                        className="w-4 h-4 text-ksl-red bg-gray-100 border-gray-300 rounded focus:ring-ksl-red focus:ring-2"
                      />
                      <span className="text-sm text-gray-900 dark:text-white">
                        Je souhaite assurer mon colis
                      </span>
                    </label>
                    <p className="text-xs text-gray-500 dark:text-gray-400 ml-7 mt-1">
                      L'assurance couvre la perte ou les dommages du colis (2% de la valeur déclarée)
                    </p>
                  </div>
                  
                  {/* Input valeur déclarée (affiché seulement si assurance cochée) */}
                  {expeditionData.isInsured && (
                    <div className="mb-4">
                      <Input
                        label="Valeur déclarée du colis (FCFA) *"
                        type="number"
                        min="1"
                        value={expeditionData.declared_value}
                        onChange={(e) => updateExpeditionData('declared_value', e.target.value)}
                        placeholder="Ex: 50000"
                      />
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        💡 Frais d'assurance: {expeditionData.declared_value ? 
                          `${formatPrice(Math.max(parseFloat(expeditionData.declared_value) * 0.02, 0))}` : 
                          '0 FCFA'
                        } (2% de la valeur déclarée)
                      </p>
                    </div>
                  )}
                  
                  {/* Information sur l'assurance */}
                  <Alert variant="info" className="mt-3">
                    <Info className="w-4 h-4" />
                    <div className="text-sm">
                      <p className="font-medium mb-1">ℹ️ À propos de l'assurance:</p>
                      <ul className="list-disc list-inside space-y-1 text-xs">
                        <li>Taux d'assurance: 2% de la valeur déclarée</li>
                        <li>Couvre la perte totale ou les dommages du colis</li>
                        <li>Remboursement jusqu'à la valeur déclarée</li>
                        <li>Obligatoire pour les colis de valeur supérieure à 100 000 FCFA</li>
                      </ul>
                    </div>
                  </Alert>
                </div>

                {/* Navigation */}
                <div className="flex justify-between pt-6">
                  <Button
                    variant="outline"
                    onClick={handlePrevStep}
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Précédent
                  </Button>
                  <Button
                    onClick={handleNextStep}
                    disabled={!validateStep(2)}
                  >
                    Suivant
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            )}

            {/* Étape 3: Devis */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="flex items-center space-x-3">
                  <Calculator className="w-6 h-6 text-ksl-red" />
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Calculer le devis
                  </h2>
                </div>

                <div className="text-center py-8">
                  <Button
                    onClick={handleEstimation}
                    disabled={isCalculatingQuote}
                    size="lg"
                  >
                    {isCalculatingQuote ? (
                      <>
                        <Loader className="w-4 h-4 mr-2 animate-spin" />
                        Calcul en cours...
                      </>
                    ) : (
                      <>
                        <Calculator className="w-4 h-4 mr-2" />
                        Calculer le devis
                      </>
                    )}
                  </Button>
                </div>

                {/* Navigation */}
                <div className="flex justify-between pt-6">
                  <Button
                    variant="outline"
                    onClick={handlePrevStep}
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Précédent
                  </Button>
                  <Button
                    onClick={handleNextStep}
                    disabled={!validateStep(3)}
                  >
                    Suivant
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            )}
          </Card>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <Card className="p-4 sm:p-6 shadow-lg hover:shadow-xl transition-all duration-300">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4 text-sm sm:text-base">
              Récapitulatif
            </h3>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Étape actuelle</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {steps.find(s => s.id === currentStep)?.title}
                </p>
              </div>
              
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Articles</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {expeditionData.pickup_items.length} article(s)
                </p>
              </div>
              
              {quoteData && (
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Prix estimé</p>
                  <p className="font-medium text-ksl-red text-lg">
                    {formatPrice(quoteData.finalPrice)}
                  </p>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* Modal de devis */}
      {showQuoteModal && quoteData && (
        <Modal
          isOpen={showQuoteModal}
          onClose={() => setShowQuoteModal(false)}
          title="Devis calculé"
        >
          <div className="space-y-4">
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Détails du calcul</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Prix de base:</span>
                  <span>{quoteData.breakdown.basePrice} FCFA</span>
                </div>
                <div className="flex justify-between">
                  <span>Tarif poids:</span>
                  <span>{quoteData.breakdown.weightTariff} FCFA</span>
                </div>
                <div className="flex justify-between">
                  <span>Tarif volume:</span>
                  <span>{quoteData.breakdown.volumeTariff} FCFA</span>
                </div>
                <div className="flex justify-between">
                  <span>Tarif distance:</span>
                  <span>{quoteData.breakdown.distanceTariff} FCFA</span>
                </div>
              </div>
            </div>
            
            <div className="text-center">
              <p className="text-2xl font-bold text-ksl-red">
                {formatPrice(quoteData.finalPrice)}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Prix final estimé</p>
            </div>
            
            <div className="flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => setShowQuoteModal(false)}
              >
                Fermer
              </Button>
              <Button
                onClick={() => {
                  setShowQuoteModal(false);
                  handleNextStep();
                }}
              >
                Continuer
              </Button>
            </div>
          </div>
        </Modal>
      )}
      </div>
    </div>
  );
};

export default Expedier; 