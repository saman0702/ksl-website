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
  Globe,
  RefreshCw
} from 'lucide-react';
import { Button, Card, Input, Badge, Alert, Modal, LocationSearch, ProgressBar, Tabs } from '../components/ui';
import { cn } from '../utils/cn';
import { useAuth } from '../contexts/AuthContext';
import { relayAPI, carrierAPI, modepaiementAPI,expeditionAPI } from '../services/api';
import { calculateTariff, getCityZone, searchCities, CITY_ZONE_MAPPING } from '../services/tariffService';
// import printService from '../services/printService';
import toast from 'react-hot-toast';
import PaymentRedirect from '../components/PaymentRedirect';

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
  
  // Récupérer les données d'estimation depuis localStorage
  const getEstimationData = () => {
    try {
      const storedData = localStorage.getItem('ksl_expedition_data');
      if (storedData) {
        const estimationData = JSON.parse(storedData);
        console.log('✅ Données d\'estimation récupérées:', estimationData);
        return estimationData;
      }
      console.log('ℹ️ Aucune donnée d\'estimation trouvée');
      return null;
    } catch (error) {
      console.error('❌ Erreur récupération données d\'estimation:', error);
      return null;
    }
  };
  
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
  const [paymentStep, setPaymentStep] = useState('idle'); // 'idle' | 'initializing' | 'success' | 'error'
  const paymentCheckIntervalRef = React.useRef(null);
  const [paymentPhoneNumber, setPaymentPhoneNumber] = useState('');
  const [paymentCountryCode, setPaymentCountryCode] = useState('+225');
  // Champs invités (utilisateur non authentifié)
  const [guestFirstName, setGuestFirstName] = useState('');
  const [guestLastName, setGuestLastName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [showPaymentRedirect, setShowPaymentRedirect] = useState(false);
  const [paymentFinalStatus, setPaymentFinalStatus] = useState(null); // 'success' | 'pending' | 'failed'
  const [paymentCreatedExpedition, setPaymentCreatedExpedition] = useState(null);
  const [pendingExpeditionData, setPendingExpeditionData] = useState(null);
  const [useMyLocation, setUseMyLocation] = useState(false);
  const [useMyLocationDelivery, setUseMyLocationDelivery] = useState(false);
  const [selectedRelayPoint, setSelectedRelayPoint] = useState(null);
  
  // Authentification simple
  const isAuthenticated = !!user;
  
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
      setCurrentItem(prev => ({
        ...prev,
        weight: '',
        length: '',
        width: '',
        height: ''
      }));
    } else {
      setShowCustomDimensions(false);
      const format = packageFormats.find(f => f.id === formatId);
      if (format) {
        setCurrentItem(prev => ({
          ...prev,
          length: format.dimensions.length.toString(),
          width: format.dimensions.width.toString(),
          height: format.dimensions.height.toString(),
          weight: format.weight.toString()
        }));
      }
    }
  };

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

  // Pré-remplir les données avec celles de l'estimation
  useEffect(() => {
    const estimationData = getEstimationData();
    if (estimationData) {
      console.log('🔄 Pré-remplissage avec les données d\'estimation:', estimationData);
      
      // Mettre à jour les données d'expédition avec celles de l'estimation
      setExpeditionData(prev => ({
        ...prev,
        // Adresses
        from_address: estimationData.pickupLocation?.address || estimationData.pickupLocation || '',
        to_address: estimationData.deliveryLocation?.address || estimationData.deliveryLocation || '',
        
        // Dimensions et poids
        weight: estimationData.weight || 0,
        length: estimationData.dimensions?.length || 0,
        width: estimationData.dimensions?.width || 0,
        height: estimationData.dimensions?.height || 0,
        
        // Mode et service
        mode_expedition: estimationData.deliveryMode === 'relais' ? 'relay_point' : 'home_delivery',
        type_service: estimationData.serviceType || 'standard',
        
        // Valeur déclarée
        declared_value: estimationData.declaredValue || 0,
        
        // Prix estimé
        estimated_price: estimationData.estimatedPrice || 0
      }));
      
      // Nettoyer les données du localStorage après utilisation
      localStorage.removeItem('ksl_expedition_data');
    }
  }, []);

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
    selectedCarrier: '1', // Transporteur ID 1 par défaut
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
      const data = response?.data;
      const carriersList = Array.isArray(data) ? data : (Array.isArray(data?.results) ? data.results : []);
      setCarriers(carriersList);

      // Sélection par défaut par NOM (l'API ne retourne pas d'ID)
      if (carriersList.length > 0) {
        const preferredName = 'EVA LIVRAISON';
        const found = carriersList.find(c => (c?.nom || c?.name || '').toString().trim().toLowerCase() === preferredName.toLowerCase());
        if (found && (found.nom || found.name)) {
          updateExpeditionData('selectedCarrier', found.nom || found.name);
          console.log('✅ Transporteur sélectionné par défaut:', found.nom || found.name);
        } else {
          updateExpeditionData('selectedCarrier', carriersList[0].nom || carriersList[0].name || '');
          console.warn('⚠️ Transporteur préféré non trouvé, sélection du premier disponible');
        }
      }
    } catch (error) {
      console.error('❌ Erreur chargement transporteurs:', error);
      setCarriersError('Erreur lors du chargement des transporteurs');
    } finally {
      setIsLoadingCarriers(false);
    }
  };

  // Fonction pour charger les points relais selon le type de colis
  const loadRelayPoints = async () => {
    setIsLoadingRelayPoints(true);
    setRelayPointsError(null);
    
    try {
      console.log('🏪 [loadRelayPoints] → Chargement de tous les points relais...');
      
      const response = await relayAPI.getAllRelays();
      console.log('✅ Points relais récupérés:', response.data);
      console.log('📊 Nombre de points relais trouvés:', response.data?.length || 0);
      
      // Transformer les données pour correspondre au format attendu
      let transformedRelayPoints = [];
      
      if (response?.data?.results) {
        // Format avec pagination
        transformedRelayPoints = response.data.results.map(relay => ({
          id: relay.id,
          name: relay.nom || relay.name,
          address: relay.adresse || relay.address,
          phone: relay.gerant?.phone || relay.phone || 'N/A',
          acceptedTypes: relay.typeColis || relay.accepted_types || ['standard'],
          city: relay.ville || relay.city,
          village: relay.vilage || relay.village,
          openingHours: relay.horaires_ouverture || relay.opening_hours,
          status: relay.statut || relay.status,
          latitude: relay.latitude,
          longitude: relay.longitude,
          description: relay.description || '',
          capacity: relay.capacite || relay.capacity || 50
        }));
      } else if (response?.data && Array.isArray(response.data)) {
        // Format direct (tableau)
        transformedRelayPoints = response.data.map(relay => ({
          id: relay.id,
          name: relay.nom || relay.name,
          address: relay.adresse || relay.address,
          phone: relay.gerant?.phone || relay.phone || 'N/A',
          acceptedTypes: relay.typeColis || relay.accepted_types || ['standard'],
          city: relay.ville || relay.city,
          village: relay.vilage || relay.village,
          openingHours: relay.horaires_ouverture || relay.opening_hours,
          status: relay.statut || relay.status,
          latitude: relay.latitude,
          longitude: relay.longitude,
          description: relay.description || '',
          capacity: relay.capacite || relay.capacity || 50
        }));
      } else {
        console.warn('⚠️ Format de réponse inattendu pour les points relais:', response);
        transformedRelayPoints = [];
      }
      
      // Filtrer seulement les points relais actifs
      const activeRelayPoints = transformedRelayPoints.filter(relay => 
        relay.status === 'actif' || relay.status === 'active'
      );
      
      setRelayPoints(activeRelayPoints);
      console.log('✅ Points relais actifs chargés:', activeRelayPoints.length);
      
    } catch (error) {
      console.error('❌ Erreur chargement points relais:', error);
      setRelayPointsError('Impossible de charger les points relais');
    } finally {
      setIsLoadingRelayPoints(false);
    }
  };

  // 📍 Gestion des adresses
  const handlePickupLocationSelect = (location) => {
    setExpeditionData(prev => ({
      ...prev,
      from_address: location.address,
      from_latitude: location.latitude?.toString() || '',
      from_longitude: location.longitude?.toString() || ''
    }));
  };

  const handleDeliveryLocationSelect = (location) => {
    setExpeditionData(prev => ({
      ...prev,
      to_address: location.address,
      to_latitude: location.latitude?.toString() || '',
      to_longitude: location.longitude?.toString() || ''
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

  // Charger les points relais au montage
  useEffect(() => {
    loadRelayPoints();
  }, []);

  // Filtrage des points relais selon le type de colis choisi
  const filteredRelayPoints = relayPoints.filter(relay => 
    relay.acceptedTypes && relay.acceptedTypes.includes(expeditionData.packageType || 'standard')
  );

  // Mettre à jour les coordonnées GPS selon le mode d'expédition
  useEffect(() => {
    updateCoordinatesForMode();
  }, [expeditionData.shippingMode, selectedRelayPoint, useMyLocationDelivery]);

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
      // Pré-remplir le téléphone de paiement si disponible
      if (!paymentPhoneNumber && (userData.phone || '').startsWith('+')) {
        const digits = (userData.phone || '').replace(/\D/g, '');
        // suppose +225XXXXXXXX
        if (digits.length >= 11) {
          setPaymentCountryCode('+225');
          setPaymentPhoneNumber(digits.slice(-8));
        }
      }
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

    // Réinitialiser le sélecteur de format de colis
    setSelectedPackageFormat('');
    setShowCustomDimensions(false);

    toast.success('Article ajouté avec succès');
  };

  const removeItem = (index) => {
    setExpeditionData(prev => ({
      ...prev,
      pickup_items: prev.pickup_items.filter((_, i) => i !== index)
    }));
  };

  // Déterminer automatiquement le véhicule selon le poids total des articles
  const getVehicleIdForWeight = (totalWeight) => {
    if (totalWeight == null || isNaN(totalWeight)) return expeditionData.vehicle_type_id;
    // Parcours des types définis
    for (const v of VEHICLE_TYPES) {
      const minW = Number(v.min_weight) || 0;
      const maxW = Number(v.max_weight);
      if (typeof maxW === 'number' && isFinite(maxW)) {
        if (totalWeight >= minW && totalWeight < maxW) return v.id;
      } else {
        // Pas de borne supérieure finie
        if (totalWeight >= minW) return v.id;
      }
    }
    // Fallback sur véhicule actuel si aucun match
    return expeditionData.vehicle_type_id;
  };

  useEffect(() => {
    // Recalcul du poids total à chaque changement d'articles
    const totalWeight = (expeditionData.pickup_items || []).reduce((sum, item) => {
      const w = parseFloat(item?.weight);
      const q = parseInt(item?.quantity) || 1;
      return sum + (isNaN(w) ? 0 : w) * q;
    }, 0);

    const targetVehicleId = getVehicleIdForWeight(totalWeight);
    if (targetVehicleId && targetVehicleId !== expeditionData.vehicle_type_id) {
      updateExpeditionData('vehicle_type_id', targetVehicleId);
    }
  }, [expeditionData.pickup_items]);

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
      setCurrentStep(prev => {
        const next = prev + 1;
        // Auto-chargement des modes de paiement à l'arrivée sur l'étape 4
        if (next === 4 && !isLoadingPaymentMethods) {
          loadPaymentMethods();
        }
        return next;
      });
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
            updateExpeditionData('from_latitude', latitude?.toString() || '');
            updateExpeditionData('from_longitude', longitude?.toString() || '');
            toast.success('Position de ramassage récupérée !');
          } else if (type === 'to') {
            updateExpeditionData('to_latitude', latitude?.toString() || '');
            updateExpeditionData('to_longitude', longitude?.toString() || '');
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

  // Fonction pour mettre à jour les coordonnées GPS selon le mode d'expédition
  const updateCoordinatesForMode = () => {
    if (expeditionData.shippingMode === 'relay_point' && selectedRelayPoint) {
      // Mode point relais : utiliser les coordonnées du point relais sélectionné
      updateExpeditionData('to_latitude', selectedRelayPoint.latitude?.toString() || '');
      updateExpeditionData('to_longitude', selectedRelayPoint.longitude?.toString() || '');
      console.log('📍 Coordonnées GPS mises à jour avec celles du point relais:', selectedRelayPoint.latitude, selectedRelayPoint.longitude);
    } else if (expeditionData.shippingMode === 'home_delivery') {
      // Mode livraison à domicile : utiliser la géolocalisation si disponible
      if (useMyLocationDelivery) {
        getCurrentLocation('to');
      }
    }
  };

  // 🌍 Détection pays via IP (simplifié)
  const detectUserCountry = async () => {
    try {
      const response = await fetch('https://ipapi.co/json/');
      if (response.ok) {
        const data = await response.json();
        const detected = data.country_code;
        const SUPPORTED = ['CI','KE','BF','GN','GA','ML','SN','BJ','CM'];
        return SUPPORTED.includes(detected) ? detected : 'CI';
      }
    } catch (e) {
      // ignore and fallback
    }
    return 'CI';
  };

  // 💳 Charger les modes de paiement (Clapay)
  const getPaymentIcon = (operator) => {
    if (!operator) return '/OM.png';
    const op = operator.toLowerCase();
    if (op.includes('wave')) return '/WAVE.png';
    if (op.includes('orange') || op.includes('om')) return '/OM.png';
    if (op.includes('mtn')) return '/MTN.png';
    if (op.includes('moov')) return '/MOOV.png';
    if (op.includes('free')) return '/WAVE.png';
    if (op.includes('emoney')) return '/WAVE.png';
    if (op.includes('freemoney')) return '/WAVE.png';
    if (op.includes('airtel')) return '/MTN.png';
    if (op.includes('visa')) return '/OM.png';
    if (op.includes('mastercard')) return '/OM.png';
    return '/OM.png';
  };

  const getPaymentType = (operator) => {
    if (!operator) return 'autre';
    const op = operator.toLowerCase();
    if (op.includes('wave') || op.includes('orange') || op.includes('mtn') || op.includes('moov') || op.includes('free') || op.includes('emoney') || op.includes('freemoney') || op.includes('airtel')) return 'mobile_money';
    if (op.includes('visa') || op.includes('mastercard')) return 'card';
    return 'autre';
  };

  // Mapper: indicatif téléphonique -> code pays ISO (CI, CM, BF, ...)
  const mapDialCodeToIso = (dialCode) => {
    switch (dialCode) {
      case '+225': return 'CI';
      case '+237': return 'CM';
      case '+226': return 'BF';
      case '+224': return 'GN';
      case '+241': return 'GA';
      case '+223': return 'ML';
      case '+221': return 'SN';
      case '+229': return 'BJ';
      default: return 'CI';
    }
  };

  // Mapper: nom opérateur -> code opérateur (OM, MOOV, MTN, WAVE)
  const mapOperatorToCode = (name) => {
    if (!name) return 'OM';
    const n = name.toString().toLowerCase();
    if (n.includes('wave')) return 'WAVE';
    if (n.includes('moov')) return 'MOOV';
    if (n.includes('mtn')) return 'MTN';
    if (n.includes('orange') || n.includes('om')) return 'OM';
    return 'OM';
  };

  const loadPaymentMethods = async () => {
    setIsLoadingPaymentMethods(true);
    try {
      const userCountry = await detectUserCountry();
      const countryCode = userCountry; // déjà code ISO
      const clapayUrl = `https://nowallet-api.mpayment.africa/nowallet/api/fees/by/country?country=${countryCode}`;
      const response = await fetch(clapayUrl, {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization: 'Bearer d41c1b19dce70da75aa3701887dff1aa14f2b7e082a700b2aa94e1427d7ec3e01b8e83090e89e41430161d46e2fbbbaa4c048285625d6dbacafbc8c6efaf5cd674d2e0b3df0181a6492abfd3f9e560b0707a89bb98dfe542f0aea0e59908763b',
        },
      });
      if (!response.ok) throw new Error(`Erreur API Clapay: ${response.status}`);
      const clapayData = await response.json();
      if (Array.isArray(clapayData)) {
        const transformed = clapayData.map((method, index) => ({
          id: method.id || index + 1,
          nom: method.operator || method.description || 'Méthode de paiement',
          icone: getPaymentIcon(method.operator),
          description: method.description || `${method.operator} - ${method.currency}`,
          montant_min: 0,
          montant_max: 999999999,
          type: getPaymentType(method.operator),
          clapayData: {
            fee_cashin: method.fee_cashin,
            fee_cashout: method.fee_cashout,
            fee_merchant: method.fee_merchant,
            currency: method.currency,
            country: method.country,
            merchant: method.merchant,
          },
        }));
        setPaymentMethods(transformed);
        if (transformed.length > 0 && !selectedPaymentMethod) setSelectedPaymentMethod(transformed[0]);
        setPaymentMethodsError(null);
      } else {
        throw new Error('Format Clapay invalide');
      }
    } catch (err) {
      setPaymentMethodsError(err.message);
      const fallback = [
        { id: 1, nom: 'Espèces', icone: '💵', description: 'Paiement en espèces à la livraison', type: 'cash' },
        { id: 2, nom: 'Orange Money', icone: '🟠', description: 'Paiement mobile Orange Money', type: 'mobile_money' },
        { id: 3, nom: 'Carte Bancaire', icone: '💳', description: 'Paiement par carte bancaire', type: 'card' },
      ];
      setPaymentMethods(fallback);
      setSelectedPaymentMethod(fallback[0]);
    } finally {
      setIsLoadingPaymentMethods(false);
    }
  };

  const checkPaymentStatus = async (signature) => {
    try {
      const response = await modepaiementAPI.paiementcheckin({ signature });
      const paymentData = response.data;
      if (paymentData.status === 'SUCCESSFUL') {
        if (paymentCheckIntervalRef.current) {
          clearInterval(paymentCheckIntervalRef.current);
          paymentCheckIntervalRef.current = null;
        }
        await createExpeditionAfterPayment(paymentData);
        setPaymentFinalStatus('success');
        setShowPaymentRedirect(true);
      } else if (paymentData.status === 'FAILED' || paymentData.status === 'CLOSED') {
        if (paymentCheckIntervalRef.current) {
          clearInterval(paymentCheckIntervalRef.current);
          paymentCheckIntervalRef.current = null;
        }
        setPaymentStep('error');
        setPaymentFinalStatus('failed');
        setShowPaymentRedirect(true);
      }
    } catch (error) {
      // keep polling
    }
  };

  const createExpeditionAfterPayment = async (paymentData) => {
    try {
      const payload = {
        ...expeditionData,
        mode_paiement: selectedPaymentMethod?.nom,
        payment_status: paymentData.status,
        signature: paymentData.signature,
      };
      const response = await expeditionAPI.createExpedition(payload);
      toast.success('Expédition créée après paiement');
      setPaymentStep('success');
      setCurrentStep(5);
      setPaymentCreatedExpedition(response?.data);
    } catch (e) {
      toast.error("Erreur création d'expédition après paiement");
      setPaymentStep('error');
      setPaymentFinalStatus('failed');
      setShowPaymentRedirect(true);
    }
  };

  const handlePaymentValidation = async () => {
    if (!selectedPaymentMethod) {
      alert('❌ Veuillez sélectionner un mode de paiement');
      return;
    }
    try {
      setPaymentStep('initializing');
      const phoneDigits = (paymentPhoneNumber || '').replace(/\D/g, '');
      const paymentData = {
        amount: Math.max(parseFloat(quoteData?.finalPrice || 0), 1),
        country_code: mapDialCodeToIso(paymentCountryCode),
        operator_code: mapOperatorToCode(selectedPaymentMethod?.nom),
        phone_number: phoneDigits,
        description: 'Paiement expédition',
      };
      // Ajouter info utilisateur si non authentifié
      if (!isAuthenticated) {
        paymentData.email = guestEmail;
        paymentData.last_name = guestLastName;
        paymentData.first_name = guestFirstName;
      }
      if (!paymentData.amount) throw new Error('Montant invalide');
      if (!paymentData.country_code) throw new Error('Code pays manquant');
      if (!paymentData.operator_code) throw new Error('Opérateur manquant');
      if (!paymentData.phone_number) throw new Error('Téléphone manquant');

      const response = await modepaiementAPI.initpaiement(paymentData);
      setPaymentStep('success');
      setExpeditionData(prev => ({ ...prev, mode_paiement: selectedPaymentMethod?.nom }));
      const paymentUrl = response?.data?.payment_url;
      const signature = response?.data?.signature;
      if (!paymentUrl) throw new Error("Lien de paiement manquant");
      if (typeof window !== 'undefined') window.open(paymentUrl, '_blank');
      if (signature) {
        if (paymentCheckIntervalRef.current) clearInterval(paymentCheckIntervalRef.current);
        paymentCheckIntervalRef.current = setInterval(() => {
          checkPaymentStatus(signature);
        }, 5000);
      }
    } catch (err) {
      setPaymentStep('error');
      toast.error("Erreur initialisation paiement");
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
                    
                    {/* Toggle Ma position */}
                    <div className="flex items-center justify-between mt-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                      <div className="flex items-center space-x-3">
                        <LocateFixed className="w-5 h-5 text-ksl-red" />
                        <div>
                          <label htmlFor="useMyLocation" className="text-sm font-medium text-gray-900 dark:text-white">
                            Utiliser ma position GPS
                          </label>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Récupérer automatiquement mes coordonnées
                          </p>
                        </div>
                      </div>
                      
                      {/* Toggle Switch */}
                      <button
                        type="button"
                        onClick={() => {
                          const newValue = !useMyLocation;
                          setUseMyLocation(newValue);
                          if (newValue) {
                            getCurrentLocation('from');
                          }
                        }}
                        className={`
                          relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-ksl-red focus:ring-offset-2
                          ${useMyLocation 
                            ? 'bg-ksl-red' 
                            : 'bg-gray-200 dark:bg-gray-700'
                          }
                        `}
                      >
                        <span
                          className={`
                            inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ease-in-out
                            ${useMyLocation ? 'translate-x-6' : 'translate-x-1'}
                          `}
                        />
                      </button>
                    </div>
                  </div>

                  {/* Coordonnées GPS Expéditeur - CACHÉES MAIS RÉCUPÉRÉES EN ARRIÈRE-PLAN */}
                  <div className="hidden">
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
                </div>

                {/* Séparateur visuel */}
                <div className="hidden border-t border-gray-200 dark:border-gray-700 pt-6">
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
                  {/* <Alert variant="info">
                    <Info className="w-4 h-4" />
                    <div>
                      <p className="font-medium">Zone de livraison: Côte d'Ivoire</p>
                      <p className="text-sm">Livraison disponible sur tout le territoire ivoirien</p>
                    </div>
                  </Alert> */}

                  {/* Transporteur */}
                  <div className="hidden mb-4 sm:mb-6 p-3 sm:p-4 bg-gray-50 dark:bg-gray-800 rounded-lg shadow-md">
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
                      disabled={true}
                    >
                      <option value="">Sélectionnez un transporteur...</option>
                      {carriers.map(carrier => (
                        <option key={(carrier.nom || carrier.name)} value={(carrier.nom || carrier.name)}>
                          {carrier.nom || carrier.name}
                        </option>
                      ))}
                    </select>
                    
                    <p className="text-xs text-gray-500 mt-2">
                      Transporteur ID 1 sélectionné par défaut
                    </p>
                    
                    {carriers.length === 0 && !isLoadingCarriers && (
                      <p className="text-sm text-gray-500 mt-2">
                        Aucun transporteur disponible pour le moment.
                      </p>
                    )}
                  </div>

                  {/* Type de colis */}
                  <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-gray-50 dark:bg-gray-800 rounded-lg shadow-md">
                    <label className="block text-sm font-medium text-white dark:text-white mb-3">
                      📦 Type de colis *
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3">
                      {[
                         { value: 'standard', label: 'Standard', variant: 'default', emoji: '📦' },
                         { value: 'fragile', label: 'Fragile', variant: 'warning', emoji: '🔍' },
                         { value: 'cold', label: 'Froid', variant: 'info', emoji: '❄️' },
                         { value: 'secure', label: 'Sécurisé', variant: 'error', emoji: '🔒' },
                         { value: 'large', label: 'Gros volume', variant: 'success', emoji: '📏' }
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

                  {/* Sélecteur de points relais - affiché seulement si mode relay_point */}
                  {expeditionData.shippingMode === 'relay_point' && (
                    <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg shadow-md border border-blue-200 dark:border-blue-700">
                      <label className="block text-sm font-medium text-blue-900 dark:text-blue-100 mb-3">
                        🏪 Point relais *
                        {isLoadingRelayPoints && <Loader className="w-4 h-4 ml-2 animate-spin inline" />}
                      </label>
                      
                      {relayPointsError && (
                        <Alert variant="error" className="mb-3">
                          <AlertCircle className="w-4 h-4" />
                          {relayPointsError}
                        </Alert>
                      )}
                      
                      <select
                        value={selectedRelayPoint?.id || ''}
                        onChange={(e) => {
                          const selectedId = e.target.value;
                          const relay = filteredRelayPoints.find(r => r.id && r.id.toString() === selectedId);
                          setSelectedRelayPoint(relay);
                          
                          if (relay) {
                            // Mettre à jour l'adresse de livraison avec les infos du point relais
                            updateExpeditionData('to_address', relay.address || relay.adresse);
                            updateExpeditionData('recipient_first_name', relay.name || relay.nom || '');
                            updateExpeditionData('recipient_last_name', 'Point Relais');
                            updateExpeditionData('recipient_phone', relay.phone || relay.telephone || '');
                            
                            // Mettre à jour les coordonnées GPS du point relais
                            updateExpeditionData('to_latitude', relay.latitude?.toString() || '');
                            updateExpeditionData('to_longitude', relay.longitude?.toString() || '');
                            
                            console.log('📍 Point relais sélectionné:', relay);
                            console.log('📍 Coordonnées GPS du point relais:', relay.latitude, relay.longitude);
                          }
                        }}
                        className="block w-full px-4 py-3 border-2 border-blue-300 dark:border-blue-600 rounded-lg text-blue-900 dark:text-blue-100 bg-white dark:bg-dark-bg-secondary focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 shadow-sm hover:shadow-md"
                        disabled={isLoadingRelayPoints}
                      >
                        <option value="">Sélectionnez un point relais... ({filteredRelayPoints.length} compatibles)</option>
                        {filteredRelayPoints.map(relay => (
                          <option key={relay.id || 'unknown'} value={relay.id || ''}>
                            {relay.name || relay.nom} - {relay.address || relay.adresse}
                          </option>
                        ))}
                      </select>
                      
                      {selectedRelayPoint && (
                        <div className="mt-3 p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                          <div className="flex items-start space-x-3">
                            <div className="flex-shrink-0">
                              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                                <span className="text-white text-sm font-bold">🏪</span>
                              </div>
                            </div>
                            <div className="flex-1">
                              <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-100">
                                {selectedRelayPoint.nom || selectedRelayPoint.name}
                              </h4>
                              <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                                {selectedRelayPoint.adresse || selectedRelayPoint.address}
                              </p>
                              {selectedRelayPoint.telephone || selectedRelayPoint.phone && (
                                <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                                  📞 {selectedRelayPoint.telephone || selectedRelayPoint.phone}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                      
                      <p className="text-xs text-blue-600 dark:text-blue-400 mt-2">
                        Points relais compatibles avec le type de colis "{expeditionData.packageType || 'standard'}"
                      </p>
                      
                      {filteredRelayPoints.length === 0 && !isLoadingRelayPoints && (
                        <p className="text-sm text-blue-600 dark:text-blue-400 mt-2">
                          Aucun point relais compatible avec ce type de colis.
                        </p>
                      )}
                    </div>
                  )}

                  {/* Recherche d'adresse de livraison - affiché seulement en mode livraison à domicile */}
                  {expeditionData.shippingMode === 'home_delivery' && (
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
                      
                      {/* Toggle Ma position pour livraison */}
                      <div className="hidden flex items-center justify-between mt-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center space-x-3">
                          <LocateFixed className="w-5 h-5 text-ksl-red" />
                          <div>
                            <label htmlFor="useMyLocationDelivery" className="text-sm font-medium text-gray-900 dark:text-white">
                              Utiliser ma position GPS
                            </label>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              Récupérer automatiquement mes coordonnées
                            </p>
                          </div>
                        </div>
                        
                        {/* Toggle Switch */}
                        <button
                          type="button"
                          onClick={() => {
                            const newValue = !useMyLocationDelivery;
                            setUseMyLocationDelivery(newValue);
                            if (newValue) {
                              getCurrentLocation('to');
                            }
                          }}
                          className={`
                            relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-ksl-red focus:ring-offset-2
                            ${useMyLocationDelivery 
                              ? 'bg-ksl-red' 
                              : 'bg-gray-200 dark:bg-gray-700'
                            }
                          `}
                        >
                          <span
                            className={`
                              inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ease-in-out
                              ${useMyLocationDelivery ? 'translate-x-6' : 'translate-x-1'}
                            `}
                          />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Information pour mode point relais */}
                  {expeditionData.shippingMode === 'relay_point' && (
                    <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-sm font-bold">🏪</span>
                          </div>
                        </div>
                        <div className="flex-1">
                          <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-100">
                            Mode Point Relais
                          </h4>
                          <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                            L'adresse de livraison sera automatiquement celle du point relais sélectionné ci-dessous.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}



                  {/* Coordonnées GPS Destinataire - CACHÉES MAIS RÉCUPÉRÉES EN ARRIÈRE-PLAN */}
                  <div className="hidden">
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
                      label="Numéro de commande"
                      value={expeditionData.order_number || ''}
                      onChange={(e) => {
                        // Permettre jusqu'à 30 caractères alphanumériques
                        const val = e.target.value.replace(/[^a-zA-Z0-9]/g, '').slice(0, 30);
                        updateExpeditionData('order_number', val);
                      }}
                      leftIcon={FileText}
                      placeholder="Ex: CMD2024ABC123"
                      maxLength={30}
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
                    
                    {/* Sélecteur de format de colis */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Format de colis
                      </label>
                      <select
                        value={selectedPackageFormat}
                        onChange={(e) => handlePackageFormatChange(e.target.value)}
                        className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100 bg-white dark:bg-dark-bg-secondary focus:outline-none focus:ring-2 focus:ring-ksl-red focus:border-transparent"
                      >
                        <option value="">Sélectionnez un format</option>
                        {packageFormats.map((format) => (
                          <option key={format.id} value={format.id}>
                            {format.name} - {format.description}
                          </option>
                        ))}
                      </select>
                      {selectedPackageFormat && selectedPackageFormat !== 'xl' && (
                        <div className="mt-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded text-xs">
                          <p className="text-blue-700 dark:text-blue-300">
                            <strong>Format :</strong> {packageFormats.find(f => f.id === selectedPackageFormat)?.name}
                          </p>
                          <p className="text-blue-600 dark:text-blue-400">
                            {packageFormats.find(f => f.id === selectedPackageFormat)?.dimensions.length} × {packageFormats.find(f => f.id === selectedPackageFormat)?.dimensions.width} × {packageFormats.find(f => f.id === selectedPackageFormat)?.dimensions.height} cm, {packageFormats.find(f => f.id === selectedPackageFormat)?.weight} kg
                          </p>
                        </div>
                      )}
                    </div>
                    
                    <Input
                      label="Quantité"
                      type="number"
                      min="1"
                      value={currentItem.quantity}
                      onChange={(e) => setCurrentItem(prev => ({...prev, quantity: e.target.value}))}
                    />
                  </div>

                  {/* Champs de poids et dimensions - affichés seulement pour XL ou si showCustomDimensions est true */}
                  {(showCustomDimensions || selectedPackageFormat === 'xl') && (
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <Input
                        label="Poids (kg)"
                        type="number"
                        step="0.1"
                        value={currentItem.weight}
                        onChange={(e) => setCurrentItem(prev => ({...prev, weight: e.target.value}))}
                        placeholder="0.0"
                      />
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
                  )}

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
                                { value: 'standard', label: 'Standard', variant: 'default', emoji: '📦' },
                                { value: 'fragile', label: 'Fragile', variant: 'warning', emoji: '🔍' },
                                { value: 'cold', label: 'Froid', variant: 'info', emoji: '❄️' },
                                { value: 'secure', label: 'Sécurisé', variant: 'error', emoji: '🔒' },
                                { value: 'large', label: 'Gros volume', variant: 'success', emoji: '📏' }
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
                              {carriers.find(c => c.id && c.id.toString() === expeditionData.selectedCarrier)?.nom || 'Transporteur sélectionné'}
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
                      { key: 'flash', name: 'Flash', icon: '⚡', description: 'Rapide', delais: '2h à 4h', color: 'orange' },
                      { key: 'express', name: 'Express', icon: '🎯', description: 'Simple', delais: '24H - 0-1 JOUR', color: 'red' },
                      { key: 'standard', name: 'Standard', icon: '📦', description: 'Normal', delais: '24h à 48h', color: 'blue' },
                      { key: 'economique', name: 'Économique', icon: '💰', description: 'Éco', delais: '48h à 78h', color: 'green' },
                      { key: 'interurbaine', name: 'Interurbaine', icon: '🌍', description: 'Interurbaine', delais: '86H - 2-4 JOURS', color: 'purple' },
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
                            service.key === 'flash' && 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400',
                            service.key === 'economique' && 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
                            service.key === 'standard' && 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
                            service.key === 'interurbaine' && 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400',
                            service.key === 'express' && 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                          )}>
                            {/* {service.description} */}
                          </span>
                        </div>
                        
                        <div className="space-y-1">
                          <h4 className="font-semibold text-gray-900 dark:text-white text-lg">
                            {service.name}
                          </h4>
                          
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            {service.key === 'flash' && 'Livraison ultra-rapide, priorité maximale'}
                            {service.key === 'standard' && 'Livraison normale, bon rapport qualité/prix'}
                            {service.key === 'economique' && 'Livraison économique, délai plus long'}
                            {service.key === 'interurbaine' && 'Livraison Interurbainee, couverture étendue'}
                            {service.key === 'express' && 'Livraison express, service rapide'}
                          </div>
                          
                          <div className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                            Délai: {service.delais}
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
                    <Alert variant={expeditionData.type_service === 'interurbaine' ? 'warning' : 'info'} className="mt-3">
                      <Info className="w-4 h-4" />
                      <p className="text-sm">
                        <strong>Service {expeditionData.type_service === 'flash' ? 'Flash' : expeditionData.type_service === 'express' ? 'Express' : expeditionData.type_service === 'standard' ? 'Standard' : expeditionData.type_service === 'economique' ? 'Économique' : expeditionData.type_service === 'interurbaine' ? 'Interurbaine' : 'Flash'} sélectionné</strong>
                        {expeditionData.type_service === 'interurbaine' && (
                          <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400">
                            🌍 Automatique
                          </span>
                        )}
                        <br />
                        Délai de livraison estimé: <strong>{expeditionData.delais_livraison}</strong>
                        <br />
                        {expeditionData.type_service === 'flash' && 'Votre colis sera traité en priorité avec un délai de livraison ultra-rapide.'}
                        {expeditionData.type_service === 'standard' && 'Service standard avec un bon équilibre entre prix et délai de livraison.'}
                        {expeditionData.type_service === 'economique' && 'Option économique avec un délai de livraison plus long.'}
                        {expeditionData.type_service === 'interurbaine' && 'Service Interurbaine avec couverture étendue et délai de 2-4 jours. Automatiquement sélectionné car l\'expédition se fait entre des zones différentes.'}
                        {expeditionData.type_service === 'express' && 'Service express avec livraison rapide en 0-1 jour.'}
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

            {/* Étape 4: Paiement (placée en face du récapitulatif, dans la colonne principale) */}
            {currentStep === 4 && (
              <div className="space-y-6 mt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <CreditCard className="w-6 h-6 text-ksl-red" />
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                      💳 Choisir le mode de paiement
                    </h2>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button onClick={loadPaymentMethods} variant="outline" size="sm" disabled={isLoadingPaymentMethods}>
                      <RefreshCw className={cn('w-4 h-4', isLoadingPaymentMethods && 'animate-spin')} />
                      Actualiser
                    </Button>
                  </div>
                </div>

                {/* Sélection du mode de paiement */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-900 dark:text-white">Sélectionnez votre mode de paiement</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Les méthodes disponibles sont chargées dynamiquement selon votre pays détecté automatiquement via IP</p>
                  </div>

                  {isLoadingPaymentMethods ? (
                    <div className="flex items-center justify-center p-8">
                      <Loader className="w-6 h-6 animate-spin text-ksl-red" />
                      <span className="ml-2">Chargement des modes de paiement...</span>
                    </div>
                  ) : paymentMethodsError ? (
                    <Alert variant="error">
                      <AlertCircle className="w-4 h-4" />
                      {paymentMethodsError}
                    </Alert>
                  ) : paymentMethods.length === 0 ? (
                    <Alert variant="warning">
                      <AlertCircle className="w-4 h-4" />
                      Aucun mode de paiement disponible
                    </Alert>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {paymentMethods.map((method) => (
                        <div
                          key={method.id}
                          className={cn(
                            'p-4 border-2 rounded-lg cursor-pointer transition-all',
                            selectedPaymentMethod?.id === method.id
                              ? 'border-ksl-red bg-red-50 dark:bg-red-900/20'
                              : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                          )}
                          onClick={() => setSelectedPaymentMethod(method)}
                        >
                          <div className="flex items-center space-x-3">
                            <div className={cn(
                              'w-4 h-4 rounded-full border-2',
                              selectedPaymentMethod?.id === method.id ? 'border-ksl-red bg-ksl-red' : 'border-gray-300 dark:border-gray-600'
                            )} />
                            <div className="flex-1">
                              <div className="flex items-center space-x-2">
                                <img src={method.icone} alt={method.nom} className="w-8 h-8 object-contain" onError={(e) => { e.target.src = '/OM.png'; }} />
                                <span className="font-medium text-gray-900 dark:text-white">{method.nom}</span>
                                {method.clapayData?.merchant && (
                                  <Badge variant="secondary" className="text-xs">{method.clapayData.merchant}</Badge>
                                )}
                              </div>
                              {method.description && (
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{method.description}</p>
                              )}
                              {method.clapayData && (
                                <div className="mt-2">
                                  <div className="flex items-center justify-between text-xs">
                                    <span className="text-gray-500 dark:text-gray-400">Devise:</span>
                                    <span className="font-medium text-gray-900 dark:text-white">{method.clapayData.currency}</span>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* 📱 Champ numéro de paiement */}
                <div className="space-y-3">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">📱 Numéro de téléphone pour le paiement</label>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Saisissez le numéro de téléphone associé à votre compte de paiement mobile</p>
                  </div>
                  <div className="flex space-x-3">
                    <div className="w-24">
                      <select
                        value={paymentCountryCode}
                        onChange={(e) => setPaymentCountryCode(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-dark-bg-secondary text-gray-900 dark:text-white focus:ring-2 focus:ring-ksl-red focus:border-transparent"
                      >
                        <option value="+225">🇨🇮 +225</option>
                        <option value="+237">🇨🇲 +237</option>
                        <option value="+226">🇧🇫 +226</option>
                        <option value="+224">🇬🇳 +224</option>
                        <option value="+241">🇬🇦 +241</option>
                        <option value="+223">🇲🇱 +223</option>
                        <option value="+221">🇸🇳 +221</option>
                        <option value="+229">🇧🇯 +229</option>
                      </select>
                    </div>
                    <div className="flex-1">
                      <Input
                        type="tel"
                        placeholder="Numéro de téléphone"
                        value={paymentPhoneNumber}
                        onChange={(e) => setPaymentPhoneNumber(e.target.value)}
                        className="w-full"
                        required
                      />
                    </div>
                  </div>
                  {paymentPhoneNumber && (
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Numéro complet : <span className="font-medium text-ksl-red">{paymentCountryCode}{paymentPhoneNumber}</span>
                    </div>
                  )}
                </div>

                {/* Champs invités si non authentifié */}
                {!isAuthenticated && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Prénom</label>
                      <Input value={guestFirstName} onChange={(e) => setGuestFirstName(e.target.value)} placeholder="Votre prénom" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nom</label>
                      <Input value={guestLastName} onChange={(e) => setGuestLastName(e.target.value)} placeholder="Votre nom" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                      <Input type="email" value={guestEmail} onChange={(e) => setGuestEmail(e.target.value)} placeholder="email@exemple.com" />
                    </div>
                  </div>
                )}

                {/* 🚀 Indicateur de statut du paiement */}
                {paymentStep !== 'idle' && (
                  <div className="mt-4 p-4 rounded-lg border">
                    {paymentStep === 'initializing' && (
                      <div className="flex items-center space-x-3 text-blue-600 dark:text-blue-400">
                        <Loader className="w-5 h-5 animate-spin" />
                        <span className="font-medium">Initialisation du paiement en cours...</span>
                      </div>
                    )}
                    {paymentStep === 'success' && (
                      <div className="flex items-center space-x-3 text-green-600 dark:text-green-400">
                        <CheckCircle className="w-5 h-5" />
                        <span className="font-medium">Paiement initialisé avec succès !</span>
                      </div>
                    )}
                    {paymentStep === 'error' && (
                      <div className="flex items-center space-x-3 text-red-600 dark:text-red-400">
                        <AlertCircle className="w-5 h-5" />
                        <span className="font-medium">Erreur lors de l'initialisation du paiement</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Navigation paiement */}
                <div className="flex flex-col sm:flex-row justify-between gap-3">
                  <Button
                    variant="outline"
                    onClick={handlePrevStep}
                    className="w-full sm:w-auto"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Précédent
                  </Button>
                  <Button
                    onClick={handlePaymentValidation}
                    className="w-full sm:w-auto"
                    size="lg"
                    disabled={!selectedPaymentMethod || !paymentPhoneNumber || isProcessingPayment}
                    isLoading={isProcessingPayment}
                  >
                    <CreditCard className="w-5 h-5 mr-2" />
                    {isProcessingPayment ? 'Initialisation du paiement...' : 'Initialiser le paiement'}
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

      {/* Modal de devis amélioré */}
      {showQuoteModal && quoteData && (
        <Modal
          isOpen={showQuoteModal}
          onClose={() => setShowQuoteModal(false)}
          title=""
        >
          <div className="space-y-6">
            {/* Header avec icône et titre */}
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calculator className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Devis calculé avec succès !
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Votre estimation est prête
              </p>
            </div>

            {/* Prix principal avec animation */}
            <div className="text-center bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/10 dark:to-blue-900/10 rounded-xl p-6 border border-green-200 dark:border-green-800">
              <div className="animate-bounce mb-2">
                <span className="text-4xl font-bold text-green-600 dark:text-green-400">
                  {formatPrice(quoteData.finalPrice)}
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                Prix final estimé
              </p>
            </div>

            {/* Détails du calcul */}
            <div className="hidden bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <Calculator className="w-4 h-4 mr-2 text-blue-600" />
                Détails du calcul
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Prix de base</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {formatPrice(quoteData.breakdown?.basePrice || 0)}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Tarif poids</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {formatPrice(quoteData.breakdown?.weightTariff || 0)}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Tarif volume</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {formatPrice(quoteData.breakdown?.volumeTariff || 0)}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Tarif distance</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {formatPrice(quoteData.breakdown?.distanceTariff || 0)}
                  </span>
                </div>
              </div>
            </div>

            {/* Informations supplémentaires */}
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
              <div className="flex items-start space-x-3">
                <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-blue-800 dark:text-blue-200">
                  <p className="font-medium mb-1">ℹ️ Informations importantes :</p>
                  <ul className="space-y-1 text-xs">
                    <li>• Ce prix est une estimation basée sur les informations fournies</li>
                    <li>• Le prix final peut varier selon les conditions de livraison</li>
                    {expeditionData.isInsured ? (
                      <li>• Les frais d'assurance sont inclus dans cette estimation</li>
                    ) : (
                      <li>• Les frais d'assurance ne sont pas inclus dans cette estimation</li>
                    )}
                  </ul>
                </div>
              </div>
            </div>

            {/* Boutons d'action */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setShowQuoteModal(false)}
                className="flex-1 sm:flex-none"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Modifier
              </Button>
              <Button
                onClick={() => {
                  setShowQuoteModal(false);
                  handleNextStep();
                }}
                className="flex-1 sm:flex-none bg-green-600 hover:bg-green-700"
              >
                <ArrowRight className="w-4 h-4 mr-2" />
                Continuer
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Modal de redirection/état de paiement */}
      <PaymentRedirect
        isOpen={showPaymentRedirect}
        onClose={() => setShowPaymentRedirect(false)}
        paymentStatus={paymentFinalStatus || (paymentStep === 'success' ? 'success' : paymentStep === 'initializing' ? 'pending' : 'failed')}
        expeditionData={paymentCreatedExpedition}
        onNewExpedition={() => {
          setShowPaymentRedirect(false);
          setCurrentStep(1);
        }}
        onViewExpeditions={() => {
          setShowPaymentRedirect(false);
          window.location.href = '/';
        }}
        onGoToDashboard={() => {
          setShowPaymentRedirect(false);
          window.location.href = '/';
        }}
      />

      </div>
    </div>
  );
};

export default Expedier; 