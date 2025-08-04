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
  Database
} from 'lucide-react';
import { Button, Card, Input, Badge, Alert, Modal, LocationSearch, ProgressBar, Tabs } from '../../components/ui';
import { cn } from '../../utils/cn';
// import { v4 as uuidv4 } from 'uuid';
import { useAuth } from '../../contexts/AuthContext';
import { useParcel } from '../../contexts/ParcelContext';
import { useNotifications } from '../../contexts/NotificationContext';
import { relayAPI, carrierAPI, modepaiementAPI } from '../../services/api';
import { calculateTariff, getCityZone, searchCities, CITY_ZONE_MAPPING } from '../../services/tariffService';
import printService from '../../services/printService';


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



// 🚚 FONCTION GÉNÉRIQUE : Appeler l'API d'un transporteur avec configuration dynamique
async function getCarrierQuote(carrierData, quoteData) {
  if (!carrierData) {
    throw new Error('Données du transporteur manquantes');
  }

  if (!carrierData.api_url_quote) {
    throw new Error(`URL de devis manquante pour le transporteur ${carrierData.nom}`);
  }

  if (!carrierData.api_token) {
    throw new Error(`Token API manquant pour le transporteur ${carrierData.nom}`);
  }

  try {
    const carrierName = carrierData.nom || 'Transporteur';
    
    // 🔍 DEBUG COMPLET DES DONNÉES TRANSPORTEUR
    console.log('🔍 ============ DEBUG TRANSPORTEUR ============');
    console.log('🚚 Nom:', carrierName);
    console.log('🔗 API URL:', carrierData.api_url_quote);
    console.log('🔑 Token complet:', carrierData.api_token);
    console.log('📊 Données transporteur complètes:', carrierData);
    console.log('============================================');
    
    // Préparer les headers - TESTER DIFFÉRENTS FORMATS
    let headers;
    
    // Pour Eva, essayer le format Bearer (standard OAuth/API)
    if (carrierName.toLowerCase().includes('eva') || carrierData.api_url_quote?.includes('goeva.com')) {
      headers = {
        'Content-Type': 'application/json',
        'Authorization': `${carrierData.api_token}`, // Format Bearer standard
        'Accept': 'application/json'
      };
    } else {
      // Format générique pour les autres transporteurs
      headers = {
        'Content-Type': 'application/json',
        'Authorization': carrierData.api_token,
        'Accept': 'application/json'
      };
    }
    
    // Adapter les données selon le transporteur
    const adaptedData = adaptQuoteDataForCarrier(carrierData, quoteData);
    
    // 🔍 DEBUG COMPLET DE LA REQUÊTE
    console.log('🔍 ============ DEBUG REQUÊTE ============');
    console.log('📡 URL:', carrierData.api_url_quote);
    console.log('📋 Headers:', headers);
    console.log('📦 Body:', JSON.stringify(adaptedData, null, 2));
    console.log('=======================================');
    
    const response = await fetch(carrierData.api_url_quote, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(adaptedData),
    });
    
    console.log(`📡 Status de réponse ${carrierName}:`, response.status, response.statusText);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ Erreur ${carrierName} API:`, errorText);
      console.error(`🔍 Headers envoyés:`, headers);
      
      if (response.status === 401) {
        throw new Error(`Erreur d'authentification ${carrierName}. Vérifiez le token API.`);
      } else if (response.status === 403) {
        throw new Error(`Accès refusé par l'API ${carrierName}. Contactez l'administrateur.`);
      } else if (response.status === 400) {
        throw new Error(`Données invalides pour l'API ${carrierName}. Vérifiez les coordonnées GPS.`);
      } else {
        throw new Error(`Erreur API ${carrierName} (${response.status}): ${errorText}`);
      }
    }
    
    const result = await response.json();
    console.log(`✅ Réponse ${carrierName} API:`, result);
    
    // Normaliser la réponse selon le transporteur
    return normalizeCarrierResponse(carrierData, result);
    
  } catch (error) {
    console.error(`💥 Erreur lors de l'appel ${carrierData.nom}:`, error);
    throw error;
  }
}

// 🚚 FONCTION : Adapter les données selon le transporteur
function adaptQuoteDataForCarrier(carrierData, data) {
  const carrierName = carrierData.nom || '';
  
  // Si c'est EVA ou un transporteur qui utilise le format EVA
  if (carrierName.toLowerCase().includes('eva') || carrierData.api_url_quote?.includes('goeva.com')) {
      // Format exact selon l'exemple EVA fourni
      return {
        ride_type_id: data.ride_type_id || 2, // Par défaut: livraison
        vehicle_type_id: data.vehicle_type_id || 1, // Par défaut: Car
        zone_id: data.zone_id || 3, // Selon l'exemple (pas 10)
        from_latitude: parseFloat(data.from_latitude),
        from_longitude: parseFloat(data.from_longitude),
        from_address: data.from_address,
        to_latitude: parseFloat(data.to_latitude),
        to_longitude: parseFloat(data.to_longitude),
        to_address: data.to_address,
        pickup_items: data.pickup_items.map(item => ({
          name: item.name,
          category: item.category,
          weight: parseFloat(item.weight),
          length: parseFloat(item.length) || 0,
          width: parseFloat(item.width) || 0,
          height: parseFloat(item.height) || 0,
          quantity: parseInt(item.quantity)
        }))
      };
  }
      
  // Format générique pour les autres transporteurs
      return {
        pickup: {
          address: data.from_address,
      latitude: parseFloat(data.from_latitude),
      longitude: parseFloat(data.from_longitude),
        },
        delivery: {
          address: data.to_address,
      latitude: parseFloat(data.to_latitude),
      longitude: parseFloat(data.to_longitude),
        },
        package: {
          weight: data.pickup_items.reduce((sum, item) => sum + (item.weight * item.quantity), 0),
      items: data.pickup_items.map(item => ({
        name: item.name,
        category: item.category,
        weight: parseFloat(item.weight),
        dimensions: {
          length: parseFloat(item.length) || 0,
          width: parseFloat(item.width) || 0,
          height: parseFloat(item.height) || 0
        },
        quantity: parseInt(item.quantity)
      }))
        },
        customer: {
      first_name: data.customer_first_name,
      last_name: data.customer_last_name,
          phone: data.customer_phone_number,
          email: data.customer_email
    },
    pickup_company: {
      name: data.pickup_company_name,
      phone: data.pickup_phone_number
    },
    notes: {
      pickup: data.pickup_note,
      order: data.order_note
    }
  };
}

// 🚚 FONCTION : Normaliser la réponse selon le transporteur
function normalizeCarrierResponse(carrierData, response) {
  const carrierName = carrierData.nom || 'Transporteur';
  
  // Si c'est EVA ou un transporteur qui utilise le format EVA
  if (carrierName.toLowerCase().includes('eva') || carrierData.api_url_quote?.includes('goeva.com')) {
      return response; // EVA retourne déjà le bon format
  }
      
  // Format générique pour les autres transporteurs
      return {
    ride_quote_id: response.quote_id || response.id || `quote_${Date.now()}`,
    total_price: response.total_price || response.price?.amount || response.cost?.total || 0,
    currency: response.currency || response.price?.currency || response.cost?.currency || 'XOF',
    estimated_time: response.estimated_time || response.delivery_time || response.transit_time || '2-4 heures',
    carrier: carrierName,
    carrier_id: carrierData.id,
        raw_response: response
      };
}



const packageTypes = [
  { value: 'standard', label: 'Standard', variant: 'default', emoji: '📦' },
  { value: 'fragile', label: 'Fragile', variant: 'warning', emoji: '🔍' },
  { value: 'cold', label: 'Froid', variant: 'info', emoji: '❄️' },
  { value: 'secure', label: 'Sécurisé', variant: 'error', emoji: '🔒' },
  { value: 'large', label: 'Gros volume', variant: 'success', emoji: '📏' }
];


const ClientSendParcel = () => {
  const { user } = useAuth();
  const { createExpedition } = useParcel();
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

  // Calculer automatiquement le type de véhicule selon le poids total et volume
  const calculateVehicleType = () => {
    console.log('🔄 ============ DÉBUT CALCUL VÉHICULE ============');
    console.log('📦 Articles actuels:', expeditionData.pickup_items);
    console.log('📦 Nombre d\'articles:', expeditionData.pickup_items.length);
    
    const totalWeight = expeditionData.pickup_items.reduce((sum, item) => {
      const itemWeight = parseFloat(item.weight) * parseInt(item.quantity);
      console.log(`  📦 ${item.name}: ${item.weight}kg × ${item.quantity} = ${itemWeight}kg`);
      return sum + itemWeight;
    }, 0);

    // Calculer le volume total en m³
    const totalVolume = expeditionData.pickup_items.reduce((sum, item) => {
      const itemVolume = (parseFloat(item.length) || 0) * (parseFloat(item.width) || 0) * (parseFloat(item.height) || 0) * parseInt(item.quantity);
      const volumeInM3 = itemVolume / 1000000; // Convertir cm³ en m³
      console.log(`  📦 ${item.name}: ${item.length}×${item.width}×${item.height}×${item.quantity} = ${volumeInM3.toFixed(3)}m³`);
      return sum + volumeInM3;
    }, 0);

    console.log('🚚 ============ RÉSULTAT CALCUL ============');
    console.log('📦 Nombre d\'articles:', expeditionData.pickup_items.length);
    console.log('⚖️ Poids total:', totalWeight, 'kg');
    console.log('📦 Volume total:', totalVolume.toFixed(3), 'm³');
    console.log('==========================================');

    // LOGIQUE SIMPLIFIÉE : SEULEMENT SELON LE POIDS
    console.log('🔍 ============ SÉLECTION VÉHICULE ============');
    
    // Chercher le véhicule approprié selon le poids
    console.log('🔍 Vérification de chaque véhicule:');
    for (const vehicle of VEHICLE_TYPES) {
      const canCarry = totalWeight >= vehicle.min_weight && totalWeight < vehicle.max_weight;
      console.log(`${vehicle.icon} ${vehicle.name}: ${vehicle.min_weight}-${vehicle.max_weight}kg → ${canCarry ? '✅' : '❌'} (${totalWeight}kg)`);
      
      if (canCarry) {
        console.log(`✅ VÉHICULE SÉLECTIONNÉ: ${vehicle.icon} ${vehicle.name}`);
        console.log(`📊 Poids: ${totalWeight}kg (plage: ${vehicle.min_weight}-${vehicle.max_weight}kg)`);
        console.log(`📦 Volume: ${totalVolume.toFixed(3)}m³ (plage: ${vehicle.min_volume}-${vehicle.max_volume}m³)`);
        console.log('==========================================');
        return vehicle.id;
      }
    }
    
    console.log('❌ Aucun véhicule trouvé dans la logique principale');

    // Si aucun véhicule trouvé selon les spécifications, utiliser la logique de fallback
    console.log('⚠️ Aucun véhicule trouvé selon les spécifications, fallback selon poids...');
    
    if (totalWeight <= 10) {
      console.log('✅ Fallback: Vélo (≤ 10kg)');
      return 3; // Vélo
    }
    if (totalWeight < 51) {
      console.log('✅ Fallback: Moto (< 51kg)');
      return 2; // Moto
    }
    if (totalWeight < 201) {
      console.log('✅ Fallback: Voiture/Van/Tricycle (< 201kg)');
      return 1; // Voiture/Van/Tricycle
    }
    if (totalWeight < 601) {
      console.log('✅ Fallback: Tricycle/Van/Camion (< 601kg)');
      return 5; // Tricycle/Van/Camion
    }
    if (totalWeight < 2001) {
      console.log('✅ Fallback: Van/Camion (< 2001kg)');
      return 4; // Van/Camion
    }
    
    console.log('✅ Fallback: Camion (> 2001kg)');
    return 7; // Camion
  };

  // Mise à jour des données d'expédition
  const updateExpeditionData = (field, value) => {
    setExpeditionData(prev => ({
      ...prev,
      [field]: value,
      // Recalculer le véhicule si les items changent
      ...(field === 'pickup_items' && { vehicle_type_id: calculateVehicleType() })
    }));
  };

  // 🧪 FONCTION DE TEST : Remplir avec les données de l'exemple EVA
  const fillTestData = () => {
    // Données de l'exemple EVA
    updateExpeditionData('from_latitude', '5.3411');
    updateExpeditionData('from_longitude', '-4.0244');
    updateExpeditionData('from_address', 'Rue des Jardins, Cocody, Abidjan');
    updateExpeditionData('to_latitude', '5.3166');
    updateExpeditionData('to_longitude', '-4.0195');
    updateExpeditionData('to_address', 'Plateau, Abidjan');
    updateExpeditionData('customer_first_name', 'Jean');
    updateExpeditionData('customer_last_name', 'Dupont');
    updateExpeditionData('customer_phone_number', '+22507123456');
    updateExpeditionData('customer_email', 'jean.dupont@email.com');
    updateExpeditionData('pickup_company_name', 'Test Company');
    updateExpeditionData('pickup_phone_number', '+22507123456');
    updateExpeditionData('pickup_email', 'contact@testcompany.com');
    
    // Données destinataire
    updateExpeditionData('recipient_first_name', 'Marie');
    updateExpeditionData('recipient_last_name', 'Martin');
    
    // 🆕 Données de test pour transporteur et point relais
    updateExpeditionData('selectedCarrier', 'assigned'); // Utiliser le transporteur assigné
    updateExpeditionData('shippingMode', 'home_delivery'); // Livraison à domicile par défaut
    updateExpeditionData('packageType', 'fragile'); // Type de colis
    
    // Si on veut tester avec un point relais, décommenter ces lignes :
    // updateExpeditionData('shippingMode', 'relay_point');
    // updateExpeditionData('selectedRelayPoint', { id: 2, name: 'Point Relais Test' });
    
    // Articles de l'exemple
    const testItems = [
      {
        name: "Sac de riz",
        category: "Alimentaire",
        weight: 5,
        length: 40,
        width: 30,
        height: 20,
        quantity: 2
      },
      {
        name: "Téléviseur LED",
        category: "Électronique",
        weight: 8.5,
        length: 100,
        width: 60,
        height: 15,
        quantity: 1
      }
    ];
    
    updateExpeditionData('pickup_items', testItems);
    updateExpeditionData('vehicle_type_id', 1); // Car comme dans l'exemple
    
    console.log('🧪 Données de test EVA chargées');
    console.log('📦 Mode d\'expédition:', expeditionData.shippingMode);
    console.log('🚚 Transporteur sélectionné:', expeditionData.selectedCarrier);
    setEvaError(null);
  };

  // 🧪 FONCTION DE TEST : Remplir avec mode point relais
  const fillTestDataWithRelayPoint = () => {
    // D'abord remplir les données de base
    fillTestData();
    
    // Puis configurer pour point relais
    updateExpeditionData('shippingMode', 'relay_point');
    updateExpeditionData('selectedRelayPoint', { id: 2, name: 'Point Relais Test Cocody' });
    
    console.log('🧪 Données de test POINT RELAIS chargées');
    console.log('📦 Mode d\'expédition:', 'relay_point');
    console.log('📍 Point relais sélectionné:', { id: 2, name: 'Point Relais Test Cocody' });
  };

  // NOUVELLE FONCTION : Obtenir ma position GPS
  const getCurrentLocation = (type) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude.toFixed(6);
          const lng = position.coords.longitude.toFixed(6);
          
          if (type === 'from') {
            updateExpeditionData('from_latitude', lat);
            updateExpeditionData('from_longitude', lng);
          } else {
            updateExpeditionData('to_latitude', lat);
            updateExpeditionData('to_longitude', lng);
          }
        },
        (error) => {
          setEvaError('Impossible d\'obtenir votre position GPS');
        }
      );
    } else {
      setEvaError('Géolocalisation non supportée par votre navigateur');
    }
  };

  // Ajouter un article
  const addItem = () => {
    if (!currentItem.name || !currentItem.weight) {
      setEvaError('Veuillez remplir au minimum le nom et le poids de l\'article');
      return;
    }

    const newItem = {
      ...currentItem,
      weight: parseFloat(currentItem.weight),
      length: parseFloat(currentItem.length) || 0,
      width: parseFloat(currentItem.width) || 0,
      height: parseFloat(currentItem.height) || 0,
      quantity: parseInt(currentItem.quantity)
    };

    const updatedItems = [...expeditionData.pickup_items, newItem];
    
    // Calculer le nouveau type de véhicule AVEC les nouveaux items
    const calculateNewVehicleType = () => {
      const totalWeight = updatedItems.reduce((sum, item) => {
        const itemWeight = parseFloat(item.weight) * parseInt(item.quantity);
        return sum + itemWeight;
      }, 0);

      console.log('🔄 ============ CALCUL VÉHICULE AVEC NOUVEAUX ITEMS ============');
      console.log('📦 Nouveaux items:', updatedItems);
      console.log('⚖️ Nouveau poids total:', totalWeight, 'kg');
      
      // Chercher le véhicule approprié selon le poids
      for (const vehicle of VEHICLE_TYPES) {
        const canCarry = totalWeight >= vehicle.min_weight && totalWeight < vehicle.max_weight;
        console.log(`${vehicle.icon} ${vehicle.name}: ${vehicle.min_weight}-${vehicle.max_weight}kg → ${canCarry ? '✅' : '❌'} (${totalWeight}kg)`);
        
        if (canCarry) {
          console.log(`✅ VÉHICULE SÉLECTIONNÉ: ${vehicle.icon} ${vehicle.name}`);
          return vehicle.id;
        }
      }
      
      // Fallback
      if (totalWeight <= 10) return 3;
      if (totalWeight < 51) return 2;
      if (totalWeight < 201) return 1;
      if (totalWeight < 601) return 5;
      if (totalWeight < 2001) return 4;
      return 7;
    };
    
    const newVehicleType = calculateNewVehicleType();
    
    // Mettre à jour les items ET le véhicule en une seule fois
    updateExpeditionData('pickup_items', updatedItems);
    updateExpeditionData('vehicle_type_id', newVehicleType);

    // Reset le formulaire d'article
    setCurrentItem({
      name: '',
      category: 'Général',
      weight: '',
      length: '',
      width: '',
      height: '',
      quantity: 1
    });
    setEvaError(null);
  };

  // Supprimer un article
  const removeItem = (index) => {
    const updatedItems = expeditionData.pickup_items.filter((_, i) => i !== index);
    updateExpeditionData('pickup_items', updatedItems);
  };

  // Validation des étapes - MODIFIÉ pour les nouvelles étapes
  const validateStep = (step) => {
    switch (step) {
      case 1:
        // Étape 1 combinée : Expéditeur ET Destinataire
        const basicValidation = expeditionData.customer_first_name && 
               expeditionData.customer_phone_number && 
               expeditionData.from_address &&
               expeditionData.from_latitude && 
               expeditionData.from_longitude;
        
        // Validation conditionnelle selon le mode d'expédition
        if (expeditionData.shippingMode === 'relay_point') {
          // Pour point relais : pas besoin d'adresse destinataire complète
          return basicValidation && expeditionData.selectedRelayPoint;
        } else {
          // Pour livraison à domicile : besoin de l'adresse destinataire
          return basicValidation && expeditionData.to_address && 
                 expeditionData.to_latitude && expeditionData.to_longitude;
        }
      case 2:
        return expeditionData.pickup_items.length > 0;
      case 3:
        return quoteData && quoteData.ride_quote_id;
      case 4:
        return selectedPaymentMethod !== null;
      case 5:
        return true; // Validation du paiement
      default:
        return false;
    }
  };

  // Générer un order_number unique pour chaque expédition
  useEffect(() => {
    if (!expeditionData.order_number) {
      // Générer un numéro de commande à 5 chiffres aléatoires
      const randomNumber = Math.floor(10000 + Math.random() * 90000); // Génère un nombre entre 10000 et 99999
      updateExpeditionData('order_number', randomNumber.toString());
    }
  }, []);


  const loadRelayPoints = async () => {
    try {
      setIsLoadingRelayPoints(true);
      setRelayPointsError(null);
      
      console.log('📍 Chargement des points relais...');
      
      const response = await relayAPI.getRelayPoints({ 
        // Paramètres pour l'API /relais/
        statut: 'actif',
        limit: 100 
      });
      
      console.log('📍 Réponse API points relais:', response);
      
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
      console.log('✅ Points relais chargés:', activeRelayPoints.length, activeRelayPoints);
      
    } catch (error) {
      console.error('❌ Erreur chargement points relais:', error);
      setRelayPointsError('Impossible de charger les points relais');
      setRelayPoints([]);
    } finally {
      setIsLoadingRelayPoints(false);
    }
  };

  const loadCarriers = async () => {
    try {
      setIsLoadingCarriers(true);
      setCarriersError(null);
      
      console.log('🚚 Chargement du transporteur assigné...');
      
      // 🚚 LOGIQUE SIMPLIFIÉE : Récupérer le transporteur assigné à l'utilisateur
      const userData = getUserData();
      console.log('🔍 Données utilisateur récupérées dans loadCarriers:', userData);
      console.log('🔍 assignedCarrier dans loadCarriers:', assignedCarrier);
      
      if (assignedCarrier) {
        console.log('🚚 Récupération du transporteur assigné ID:', assignedCarrier);
        
        try {
          console.log('🔗 Appel API carrierAPI.getCarrier avec ID:', assignedCarrier);
          
          // Récupérer l'objet transporteur complet depuis l'API
          const carrierResponse = await carrierAPI.getCarrier(assignedCarrier);
          console.log('✅ Réponse API carrierAPI.getCarrier:', carrierResponse);
          const carrierData = carrierResponse.data;
          
          console.log('✅ Transporteur assigné récupéré:', carrierData);
          
          // Normaliser l'objet transporteur
          const normalizedCarrier = {
            id: carrierData.id,
            nom: carrierData.nom,
            description: carrierData.description,
            email: carrierData.email,
            telephone: carrierData.telephone,
            statut: carrierData.statut,
            api_url: carrierData.api_url,
            api_url_quote: carrierData.api_url_quote,
            api_token: carrierData.api_token,
            urllogo: carrierData.urllogo,
            delais: carrierData.delais,
            tarif_base: carrierData.tarif_base,
            isAssigned: true // Marqueur pour indiquer que c'est le transporteur assigné
          };
          
          console.log('✅ Transporteur normalisé:', normalizedCarrier);
          
          setCarriers([normalizedCarrier]);
          console.log('✅ Transporteur assigné prêt:', normalizedCarrier.nom);
          console.log('🔗 API URL:', normalizedCarrier.api_url_quote);
          return;
          
        } catch (error) {
          console.error('❌ Erreur récupération transporteur assigné:', error);
          console.error('❌ Détails erreur:', {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status,
            statusText: error.response?.statusText
          });
          setCarriersError(`Impossible de récupérer le transporteur assigné (ID: ${assignedCarrier}). Erreur: ${error.message}`);
          setCarriers([]);
          return;
        }
      }
      
      // 🚫 Pas de transporteur assigné
      console.warn('⚠️ Aucun transporteur assigné à cet utilisateur');
      setCarriersError('Aucun transporteur assigné à votre compte');
      setCarriers([]);
      
    } catch (error) {
      console.error('❌ Erreur chargement transporteurs:', error);
      setCarriersError('Impossible de charger les transporteurs');
      setCarriers([]);
    } finally {
      setIsLoadingCarriers(false);
    }
  };

  // 💳 NOUVELLE FONCTION : Charger les modes de paiement disponibles
  const loadPaymentMethods = async () => {
    setIsLoadingPaymentMethods(true);
    try {
      console.log('🔍 Chargement des modes de paiement...');
      
      // Utilisation de la bonne fonction API
      const response = await modepaiementAPI.getModepaiements();
      
      if (response && response.data && Array.isArray(response.data)) {
        console.log('✅ Modes de paiement chargés:', response.data);
        
        // Filtrer uniquement les modes actifs et ajouter des icônes par défaut
        const activeMethods = response.data
          .filter(method => method.actif === true)
          .map(method => ({
            id: method.id,
            nom: method.nomMethode,
            icone: method.icone || '💳',
            description: method.description || `Paiement via ${method.nomMethode}`,
            montant_min: method.montant_min || 0,
            montant_max: method.montant_max || 999999999,
            type: method.type || 'autre'
          }));
        
        setPaymentMethods(activeMethods);
        
        // Sélectionner automatiquement le premier mode de paiement s'il n'y en a pas
        if (activeMethods.length > 0 && !selectedPaymentMethod) {
          setSelectedPaymentMethod(activeMethods[0]);
        }
      } else {
        console.error('❌ Réponse API invalide pour les modes de paiement:', response);
        throw new Error('Format de réponse API invalide');
      }
    } catch (error) {
      console.error('❌ Erreur lors du chargement des modes de paiement:', error);
      setPaymentMethodsError(error.message);
      
      // Fallback avec des modes de paiement par défaut
      const defaultMethods = [
        { id: 1, nom: 'Espèces', icone: '💵', description: 'Paiement en espèces à la livraison', type: 'cash' },
        { id: 2, nom: 'Orange Money', icone: '🟠', description: 'Paiement mobile Orange Money', type: 'mobile_money' },
        { id: 3, nom: 'Carte Bancaire', icone: '💳', description: 'Paiement par carte bancaire', type: 'card' }
      ];
      
      setPaymentMethods(defaultMethods);
      setSelectedPaymentMethod(defaultMethods[0]);
    } finally {
      setIsLoadingPaymentMethods(false);
    }
  };

  // 🧮 NOUVELLE FONCTION : Calculer le tarif avec notre système complet (VERSION RELAYDEPOSITS)
  const calculateKartianTariff = async (expeditionData) => {
    try {
      console.log('🧮 ========== CALCUL TARIF KARTIAN ==========');
      console.log('📋 Données d\'entrée:', expeditionData);
      
      // 1️⃣ Extraire les villes depuis les adresses
      const originCity = expeditionData.from_address?.split(',')[0]?.trim() || 'Abidjan';
      const destinationCity = expeditionData.to_address?.split(',')[0]?.trim() || 'Abidjan';
      
      console.log('📍 ÉTAPE 1 - Villes détectées:');
      console.log('   - Ville origine:', originCity);
      console.log('   - Ville destination:', destinationCity);
      
      // 2️⃣ Calculer le poids total et les dimensions (CORRIGÉ AVEC VALIDATION)
      const totalWeight = expeditionData.pickup_items.reduce((sum, item) => {
        const weight = parseFloat(item.weight) || 0;
        const quantity = parseInt(item.quantity) || 1;
        const itemWeight = weight * quantity;
        
        // Validation pour éviter NaN
        if (isNaN(itemWeight)) {
          console.warn(`⚠️ Poids invalide pour ${item.name}: ${item.weight} kg × ${item.quantity}`);
          return sum;
        }
        
        console.log(`   - ${item.name}: ${weight} kg × ${quantity} = ${itemWeight} kg`);
        return sum + itemWeight;
      }, 0);
      
      // Prendre les dimensions du plus gros colis ET calculer le volume total
      let maxLength = 0, maxWidth = 0, maxHeight = 0;
      let totalVolumeCm3 = 0;

      expeditionData.pickup_items.forEach(item => {
        const length = parseFloat(item.length) || 0;
        const width = parseFloat(item.width) || 0;
        const height = parseFloat(item.height) || 0;
        const quantity = parseInt(item.quantity) || 1;
        
        // Validation des dimensions
        if (length < 0 || width < 0 || height < 0 || isNaN(length) || isNaN(width) || isNaN(height)) {
          console.warn(`⚠️ Dimensions invalides pour ${item.name}: ${length}×${width}×${height} cm`);
          return;
        }
        
        // Volume de cet article en cm³
        const itemVolumeCm3 = length * width * height * quantity;
        
        // Validation du volume
        if (isNaN(itemVolumeCm3) || itemVolumeCm3 < 0) {
          console.warn(`⚠️ Volume invalide pour ${item.name}: ${itemVolumeCm3} cm³`);
          return;
        }
        
        if (length > maxLength) maxLength = length;
        if (width > maxWidth) maxWidth = width;
        if (height > maxHeight) maxHeight = height;
        
        totalVolumeCm3 += itemVolumeCm3;
        console.log(`   - ${item.name}: ${length}×${width}×${height} cm × ${quantity} = ${itemVolumeCm3.toFixed(0)} cm³`);
      });
      
      // 🔧 Validation finale des valeurs calculées
      if (isNaN(totalWeight) || totalWeight < 0) {
        console.warn('⚠️ Poids total invalide, utilisation de 1 kg par défaut');
        totalWeight = 1;
      }
      
      if (isNaN(totalVolumeCm3) || totalVolumeCm3 < 0) {
        console.warn('⚠️ Volume total invalide, utilisation de 1000 cm³ par défaut');
        totalVolumeCm3 = 1000;
      }
      
      console.log('📦 ÉTAPE 2 - Calculs poids et volume (CORRIGÉ):');
      console.log('   - Poids total:', totalWeight.toFixed(2), 'kg');
      console.log('   - Volume total:', totalVolumeCm3.toFixed(0), 'cm³ =', (totalVolumeCm3 / 1000).toFixed(2), 'litres');
      console.log('   - Dimensions max:', { 
        maxLength: maxLength.toFixed(1), 
        maxWidth: maxWidth.toFixed(1), 
        maxHeight: maxHeight.toFixed(1) 
      }, 'cm');
      
      // 3️⃣ Utiliser le type de service sélectionné par l'utilisateur
      let serviceType = expeditionData.type_service || 'standard'; // Utiliser la sélection utilisateur
      
      console.log('🚚 ÉTAPE 3 - Type de service:');
      console.log('   - Service sélectionné par l\'utilisateur:', serviceType);
      console.log('   - Délai de livraison:', expeditionData.delais_livraison || '24h à 48h');
      console.log('   - Véhicule ID pour référence:', expeditionData.vehicle_type_id);
      
      // 4️⃣ Gestion du point relais
      let isRelayPoint = expeditionData.shippingMode === 'relay_point';
      let relayPointFee = 0;
      
      if (isRelayPoint) {
        relayPointFee = -100; // Réduction de 100 FCFA
        console.log('🏪 ÉTAPE 4 - Point relais:');
        console.log('   - Mode point relais activé');
        console.log('   - Réduction appliquée:', relayPointFee, 'FCFA');
      }
      
      // 5️⃣ Assurance (selon choix utilisateur)
      const declaredValue = parseFloat(expeditionData.declared_value) || 0;
      const isInsured = expeditionData.isInsured && declaredValue > 0 && !isNaN(declaredValue); // Validation supplémentaire
      
      console.log('🛡️ ÉTAPE 5 - Assurance:');
      console.log('   - Assurance demandée par utilisateur:', expeditionData.isInsured);
      console.log('   - Valeur déclarée:', declaredValue.toFixed(0), 'FCFA');
      console.log('   - Assurance activée (final):', isInsured);
      
      // 6️⃣ Calculer le tarif avec notre service (NOUVELLE VERSION API)
      const shipmentData = {
        originCity,
        destinationCity,
        weight: totalWeight,
        length: maxLength,
        width: maxWidth,
        height: maxHeight,
        volumeCm3: totalVolumeCm3,
        serviceType,
        carrierId: assignedCarrier?.id || expeditionData.carrier_id || expeditionData.carrierId || 7, // Utiliser le transporteur assigné ou un transporteur par défaut (FastGo Express)
        carrierCode: assignedCarrier?.code || 'FASTGO', // Code du transporteur comme fallback
        declaredValue,
        isInsured,
        distance: 0,
        isDepotRelayPoint: expeditionData.shippingMode === 'relay_point',
        isPickupRelayPoint: expeditionData.shippingMode === 'relay_point',
        isHolidayWeekend: false,
        vehicleType: expeditionData.vehicle_type || 'voiture' // Type de véhicule pour le facteur équipement
      };
      
      console.log('📊 ÉTAPE 6 - Appel du service de tarification (API):');
      console.log('   - Transporteur assigné:', assignedCarrier);
      console.log('   - ID du transporteur assigné:', assignedCarrier?.id);
      console.log('   - Données envoyées au service:', shipmentData);
      console.log('   - Transporteur ID final:', shipmentData.carrierId);
      console.log('   - Code transporteur:', shipmentData.carrierCode);
      console.log('🛡️ DEBUG - Assurance dans calculateKartianTariff:');
      console.log('   - isInsured:', isInsured);
      console.log('   - declaredValue:', declaredValue);
      console.log('   - expeditionData.isInsured:', expeditionData.isInsured);
      console.log('   - expeditionData.declared_value:', expeditionData.declared_value);
      
      // 🔧 Validation supplémentaire du transporteur
      if (!shipmentData.carrierId && !shipmentData.carrierCode) {
        throw new Error('Aucun transporteur disponible pour le calcul du tarif');
      }
      
      const tariffResult = await calculateTariff(shipmentData);
      
      console.log('💰 ÉTAPE 7 - Résultat du service de tarification (API):');
      console.log('   - Grille tarifaire:', tariffResult.details?.tariffGrid?.name || 'Non définie');
      console.log('   - Prix de base:', (tariffResult.breakdown?.basePrice || 0).toFixed(0), 'FCFA');
      console.log('   - Tarif poids:', (tariffResult.breakdown?.weightTariff || 0).toFixed(0), 'FCFA');
      console.log('   - Tarif volume:', (tariffResult.breakdown?.volumeTariff || 0).toFixed(0), 'FCFA');
      console.log('   - Tarif distance:', (tariffResult.breakdown?.distanceTariff || 0).toFixed(0), 'FCFA');
      console.log('   - Tarif commune:', (tariffResult.breakdown?.communeTariff || 0).toFixed(0), 'FCFA');
      console.log('   - Tarif zone:', (tariffResult.breakdown?.zoneTariff || 0).toFixed(0), 'FCFA');
      console.log('   - Tarif ville:', (tariffResult.breakdown?.cityTariff || 0).toFixed(0), 'FCFA');
      console.log('   - Tarif principal:', (tariffResult.breakdown?.totalTariff || 0).toFixed(0), 'FCFA');
      console.log('   - Facteurs appliqués:', tariffResult.breakdown?.factors || {});
      console.log('🛡️ DEBUG - Facteurs d\'assurance dans le résultat:');
      console.log('   - insuranceFactor:', tariffResult.breakdown?.factors?.insuranceFactor);
      console.log('   - isInsured dans details:', tariffResult.details?.isInsured);
      console.log('   - declaredValue dans details:', tariffResult.details?.declaredValue);
      console.log('   - Prix final:', (tariffResult.finalPrice || 0).toFixed(0), 'FCFA');
      
      // 7️⃣ Appliquer les ajustements spéciaux
      let finalPrice = tariffResult.finalPrice;
      
      console.log('🎯 ÉTAPE 8 - Ajustements spéciaux:');
      console.log('   - Prix avant ajustements:', finalPrice.toFixed(0), 'FCFA');
      
      // Ajustement point relais
      if (isRelayPoint) {
        finalPrice += relayPointFee;
        console.log('   - Après réduction point relais:', finalPrice.toFixed(0), 'FCFA');
      }
      
      // Frais de weekend/jour férié (optionnel)
      const today = new Date();
      const isWeekend = today.getDay() === 0 || today.getDay() === 6;
      let weekendFee = 0;
      
      if (isWeekend && serviceType === 'express') {
        weekendFee = 200; // Supplément weekend
        finalPrice += weekendFee;
        console.log('   - Supplément weekend ajouté:', weekendFee.toFixed(0), 'FCFA');
        console.log('   - Après supplément weekend:', finalPrice.toFixed(0), 'FCFA');
      }
      
      // Prix minimum
      const finalPriceWithMinimum = Math.max(finalPrice, 500);
      console.log('   - Prix minimum appliqué (500 FCFA):', finalPriceWithMinimum.toFixed(0), 'FCFA');
      
      console.log('🏁 ÉTAPE 9 - CALCUL FINAL:');
      console.log('   ==========================================');
      console.log('   💰 PRIX FINAL:', finalPriceWithMinimum.toFixed(0), 'FCFA');
      console.log('   ==========================================');
      
      // 🔍 RECAP ULTRA-DÉTAILLÉ POUR DEBUG
      console.log('');
      console.log('🔍 ========== RÉCAPITULATIF COMPLET DU CALCUL ==========');
      console.log('📋 DONNÉES D\'ENTRÉE:');
      console.log('   - Villes: ' + originCity + ' → ' + destinationCity);
      console.log('   - Poids total: ' + totalWeight.toFixed(2) + ' kg');
      console.log('   - Volume total: ' + totalVolumeCm3.toFixed(0) + ' cm³ (' + (totalVolumeCm3 / 1000).toFixed(2) + ' litres)');
      console.log('   - Service: ' + serviceType);
      console.log('   - Délai de livraison: ' + (expeditionData.delais_livraison || 'Non défini'));
      console.log('   - Point relais: ' + (isRelayPoint ? 'OUI' : 'NON'));
      console.log('   - Assurance: ' + (isInsured ? 'OUI (' + declaredValue.toFixed(0) + ' FCFA)' : 'NON'));
      console.log('');
      console.log('💰 CALCUL ÉTAPE PAR ÉTAPE (API):');
      console.log('   1️⃣ Grille tarifaire: ' + (tariffResult.details?.tariffGrid?.name || 'Non définie'));
      console.log('   2️⃣ Prix de base: ' + (tariffResult.breakdown?.basePrice?.toFixed(0) || '0') + ' FCFA');
      console.log('   3️⃣ Tarif principal: ' + (tariffResult.breakdown?.totalTariff?.toFixed(0) || '0') + ' FCFA');
      console.log('   4️⃣ Facteurs appliqués: Zone(' + (tariffResult.breakdown?.factors?.zoneFactor?.toFixed(2) || '1.00') + ') × Assurance(' + (tariffResult.breakdown?.factors?.insuranceFactor?.toFixed(2) || '1.00') + ') × Service(' + (tariffResult.breakdown?.factors?.serviceFactor?.toFixed(2) || '1.00') + ') × Équipement(' + (tariffResult.breakdown?.factors?.equipmentFactor?.toFixed(2) || '1.00') + ')');
      console.log('   5️⃣ Frais point relais: ' + (tariffResult.breakdown?.factors?.relayPointFee?.toFixed(0) || '0') + ' FCFA');
      console.log('   6️⃣ Prix après facteurs: ' + (tariffResult.finalPrice?.toFixed(0) || '0') + ' FCFA');
      console.log('   7️⃣ Réduction point relais: ' + relayPointFee.toFixed(0) + ' FCFA');
      console.log('   8️⃣ Supplément weekend: ' + weekendFee.toFixed(0) + ' FCFA');
      console.log('   9️⃣ Prix minimum (500 FCFA): appliqué si nécessaire');
      console.log('');
      console.log('🎯 RÉSULTAT FINAL: ' + finalPriceWithMinimum.toFixed(0) + ' FCFA');
      console.log('========================================================');
      
      // 8️⃣ Construire la réponse détaillée
      const detailedQuote = {
        ...tariffResult,
        finalPrice: finalPriceWithMinimum,
        
        // Détails supplémentaires pour debug
        calculationDetails: {
          step1_cities: { originCity, destinationCity },
          step2_weight_volume: { totalWeight, totalVolume: totalVolumeCm3 },
          step3_service: { serviceType, vehicleType: expeditionData.vehicle_type, vehicleId: expeditionData.vehicle_type_id },
          step4_relay: { isRelayPoint, relayPointFee },
          step5_insurance: { declaredValue, isInsured },
          step6_tariff_service: tariffResult,
          step7_adjustments: { weekendFee, isWeekend },
          step8_final: { finalPrice, finalPriceWithMinimum }
        },
        
        // Détails supplémentaires
        breakdown: {
          ...tariffResult.breakdown,
          relayPointDiscount: relayPointFee,
          weekendSupplement: weekendFee
        },
        
        // Informations sur l'expédition
        shipmentInfo: {
          originCity,
          destinationCity,
          originZone: getCityZone(originCity)?.name,
          destinationZone: getCityZone(destinationCity)?.name,
          totalWeight,
          totalVolumeCm3,
          serviceType,
          isRelayPoint,
          isInsured,
          vehicleType: expeditionData.vehicle_type,
          carrierId: shipmentData.carrierId,
          estimatedDelivery: getEstimatedDelivery(getCityZone(destinationCity)?.id, serviceType)
        },
        
        // Métadonnées
        calculatedAt: new Date().toISOString(),
        currency: 'FCFA'
      };
      
      console.log('✅ DEVIS FINAL DÉTAILLÉ:', detailedQuote);
      console.log('==========================================');
      
      return detailedQuote;
      
    } catch (error) {
      console.error('❌ Erreur calcul tarif Kartian:', error);
      throw error;
    }
  };

  // 🕐 Fonction helper pour calculer le délai de livraison
  const getEstimatedDelivery = (destinationZone, serviceType) => {
    const baseDays = {
      'zone1': 1, // Même jour ou lendemain
      'zone2': 2, // 1-2 jours
      'zone3': 3, // 2-3 jours
      'zone4': 4, // 3-4 jours
      'zone5': 6  // 5-6 jours
    };
    
    let days = baseDays[destinationZone] || 4;
    
    // Ajustement selon le type de service
    if (serviceType === 'express') {
      days = Math.max(1, days - 1); // 1 jour de moins
    } else if (serviceType === 'economique') {
      days += 1; // 1 jour de plus
    }
    
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + days);
    
    return {
      estimatedDays: days,
      estimatedDate: deliveryDate.toLocaleDateString('fr-FR'),
      deliveryWindow: days === 1 ? 'Aujourd\'hui ou demain' : `${days-1}-${days} jours`
    };
  };

  // 🎯 Fonction pour détecter automatiquement le type de service selon les zones
  const detectServiceType = (originAddress, destinationAddress) => {
    if (!originAddress || !destinationAddress) return 'standard';
    
    // 🏙️ Extraire les noms de villes depuis les adresses complètes
    const extractCityFromAddress = (address) => {
      if (!address) return null;
      
      // Convertir en minuscules pour la comparaison
      const lowerAddress = address.toLowerCase();
      
      // Chercher les villes dans notre mapping
      for (const [city, zone] of Object.entries(CITY_ZONE_MAPPING)) {
        if (lowerAddress.includes(city.toLowerCase())) {
          console.log('   🏙️ Ville trouvée dans l\'adresse:', city);
          return city;
        }
      }
      
      // Si aucune ville trouvée, essayer d'extraire le dernier mot (souvent la ville)
      const words = address.split(/[,\s]+/).filter(word => word.length > 2);
      const lastWord = words[words.length - 1];
      console.log('   🏙️ Ville extraite (dernier mot):', lastWord);
      return lastWord;
    };
    
    const originCity = extractCityFromAddress(originAddress);
    const destinationCity = extractCityFromAddress(destinationAddress);
    
    const originZone = getCityZone(originCity)?.id;
    const destinationZone = getCityZone(destinationCity)?.id;
    
    console.log('🎯 Détection automatique du service:');
    console.log('   - Adresse origine:', originAddress);
    console.log('   - Ville origine extraite:', originCity, '→ Zone:', originZone);
    console.log('   - Adresse destination:', destinationAddress);
    console.log('   - Ville destination extraite:', destinationCity, '→ Zone:', destinationZone);
    
    // Si les zones sont différentes, service régional automatique
    if (originZone && destinationZone && originZone !== destinationZone) {
      console.log('   ✅ Zones différentes détectées → Service Régional automatique');
      return 'regional';
    }
    
    // Même zone ou même ville = service standard
    console.log('   ✅ Même zone ou même ville → Service Standard');
    return 'standard';
  };

  // Charger les données au montage du composant
  useEffect(() => {
    console.log('🚀 useEffect - Chargement des données:', { user: user?.id, assignedCarrier });
    
    loadRelayPoints();
    loadCarriers();
    loadPaymentMethods();

    // 🚚 SIMPLIFIÉ : Utiliser automatiquement le transporteur assigné
    if (assignedCarrier) {
      console.log('🚚 Transporteur assigné détecté:', assignedCarrier);
      updateExpeditionData('selectedCarrier', 'assigned');
    }
  }, [assignedCarrier]); // Simplifié les dépendances


  // Filtrage des points relais selon le type de colis choisi
  const filteredRelayPoints = relayPoints.filter(relay => 
    relay.acceptedTypes.includes(expeditionData.packageType)
  );

  // 🚚 SIMPLIFIÉ : Retourner les transporteurs disponibles (transporteur assigné)
  const availableCarriers = carriers;

  // 🎯 DÉTECTION AUTOMATIQUE DU TYPE DE SERVICE QUAND LES ADRESSES CHANGENT
  useEffect(() => {
    if (expeditionData.from_address && expeditionData.to_address) {
      const detectedService = detectServiceType(expeditionData.from_address, expeditionData.to_address);
      if (detectedService !== expeditionData.type_service) {
        console.log('🔄 Service détecté automatiquement lors du changement d\'adresse:', detectedService, '(précédent:', expeditionData.type_service, ')');
        updateExpeditionData('type_service', detectedService);
        
        // Mettre à jour le délai de livraison selon le service détecté
        const serviceDelays = {
          'express': '2h à 4h',
          'standard': '24h à 48h',
          'economique': '48h à 78h',
          'regional': '86H - 2-4 JOURS',
          'simplicite': '24H - 0-1 JOUR'
        };
        updateExpeditionData('delais_livraison', serviceDelays[detectedService] || '24h à 48h');
      }
    }
  }, [expeditionData.from_address, expeditionData.to_address]);

  // 🚚 NOUVELLE FONCTION : Obtenir un devis intelligent multi-transporteurs
  const handleGetQuote = async () => {
    setEvaError(null);
    setIsCalculatingQuote(true);
    
    try {
      // Validation des coordonnées GPS (LOGIQUE ORIGINALE CONSERVÉE)
      if (!expeditionData.from_latitude || !expeditionData.from_longitude) {
        throw new Error('Coordonnées de départ manquantes. Cliquez sur "Ma position" ou saisissez-les manuellement.');
      }
      if (!expeditionData.to_latitude || !expeditionData.to_longitude) {
        throw new Error('Coordonnées de destination manquantes. Cliquez sur "Ma position" ou saisissez-les manuellement.');
      }
      
      // 📍 Gestion du point relais (LOGIQUE ORIGINALE CONSERVÉE)
      let finalToLatitude = expeditionData.to_latitude;
      let finalToLongitude = expeditionData.to_longitude;
      let finalToAddress = expeditionData.to_address;
      
      if (expeditionData.shippingMode === 'relay_point' && expeditionData.selectedRelayPoint) {
        console.log('📍 Mode point relais détecté - recherche des coordonnées du point relais...');
        
        // Trouver le point relais complet depuis la liste
        let selectedRelay = null;
        
        if (typeof expeditionData.selectedRelayPoint === 'object') {
          // Si c'est déjà un objet complet
          selectedRelay = expeditionData.selectedRelayPoint;
        } else {
          // Si c'est juste un ID, chercher dans la liste des points relais
          const relayId = parseInt(expeditionData.selectedRelayPoint);
          selectedRelay = relayPoints.find(relay => relay.id === relayId);
        }
        
        if (selectedRelay && selectedRelay.latitude && selectedRelay.longitude) {
          finalToLatitude = selectedRelay.latitude;
          finalToLongitude = selectedRelay.longitude;
          finalToAddress = selectedRelay.address || selectedRelay.name;
          
          console.log('✅ Coordonnées de destination remplacées par celles du point relais:');
          console.log('📍 Point relais:', selectedRelay.name);
          console.log('📍 Latitude:', finalToLatitude);
          console.log('📍 Longitude:', finalToLongitude);
          console.log('📍 Adresse:', finalToAddress);
        } else {
          console.warn('⚠️ Impossible de récupérer les coordonnées du point relais sélectionné');
          console.log('🔍 Point relais sélectionné:', expeditionData.selectedRelayPoint);
          console.log('🔍 Points relais disponibles:', relayPoints);
        }
      }
      
      // 🎯 DÉTECTION AUTOMATIQUE DU TYPE DE SERVICE
      const detectedService = detectServiceType(expeditionData.from_address, finalToAddress);
      if (detectedService !== expeditionData.type_service) {
        console.log('🔄 Service détecté automatiquement:', detectedService, '(précédent:', expeditionData.type_service, ')');
        updateExpeditionData('type_service', detectedService);
      }
      
      // Préparer les données pour le devis (LOGIQUE ORIGINALE CONSERVÉE)
      const quoteRequestData = {
        ride_type_id: expeditionData.ride_type_id,
        vehicle_type_id: expeditionData.vehicle_type_id,
        zone_id: expeditionData.zone_id,
        business_id: expeditionData.business_id,
        from_latitude: parseFloat(expeditionData.from_latitude),
        from_longitude: parseFloat(expeditionData.from_longitude),
        from_address: expeditionData.from_address,
        to_latitude: parseFloat(finalToLatitude),
        to_longitude: parseFloat(finalToLongitude),
        to_address: finalToAddress,
        customer_first_name: expeditionData.customer_first_name,
        customer_last_name: expeditionData.customer_last_name,
        customer_phone_number: expeditionData.customer_phone_number,
        customer_email: expeditionData.customer_email,
        pickup_company_name: expeditionData.pickup_company_name,
        pickup_phone_number: expeditionData.pickup_phone_number,
        pickup_note: expeditionData.pickup_note,
        order_note: expeditionData.order_note,
        pickup_items: expeditionData.pickup_items.map(item => ({
          name: item.name,
          category: item.category,
          weight: parseFloat(item.weight),
          length: parseFloat(item.length) || 0,
          width: parseFloat(item.width) || 0,
          height: parseFloat(item.height) || 0,
          quantity: parseInt(item.quantity)
        })),
        tip_amount: parseInt(expeditionData.tip_amount) || 0,
        total_price: parseInt(expeditionData.total_price) || 0,
        order_number: expeditionData.order_number,
        onsite_timestamp: expeditionData.onsite_timestamp,
        declared_value: parseFloat(expeditionData.declared_value) || 0
      };
      
      let quote;
      let selectedCarrierInfo = null;
      
      // 🚚 LOGIQUE DE SÉLECTION DU TRANSPORTEUR (VERSION RELAYDEPOSITS)
      console.log('🔍 Debug sélection transporteur:');
      console.log('  - expeditionData.selectedCarrier:', expeditionData.selectedCarrier);
      console.log('  - carriers disponibles:', carriers.map(c => ({ id: c.id, nom: c.nom, isAssigned: c.isAssigned })));
      
      const assignedCarrierObj = carriers.find(carrier => carrier.isAssigned === true);
      console.log('  - assignedCarrierObj:', assignedCarrierObj);
      
      // RÈGLE 1: Si l'utilisateur a un transporteur assigné ET qu'il choisit un autre transporteur → Utiliser le transporteur CHOISI
      // RÈGLE 2: Si l'utilisateur a un transporteur assigné ET qu'il ne sélectionne rien → Utiliser le transporteur ASSIGNÉ
      // RÈGLE 3: Si l'utilisateur n'a pas de transporteur assigné → Utiliser le transporteur qu'il CHOISIT
      
      if (assignedCarrierObj) {
        // L'utilisateur a un transporteur assigné
        if (expeditionData.selectedCarrier && expeditionData.selectedCarrier !== 'assigned' && expeditionData.selectedCarrier !== 'default') {
          // Il a choisi un transporteur différent → Utiliser celui qu'il a choisi
          selectedCarrierInfo = carriers.find(carrier => carrier.id.toString() === expeditionData.selectedCarrier);
          console.log('✅ RÈGLE 1: Transporteur assigné + choix différent → Utilisation du transporteur CHOISI:', selectedCarrierInfo?.nom, 'ID:', selectedCarrierInfo?.id);
        } else {
          // Il n'a rien choisi → Utiliser le transporteur assigné
        selectedCarrierInfo = assignedCarrierObj;
          console.log('✅ RÈGLE 2: Transporteur assigné + pas de choix → Utilisation du transporteur ASSIGNÉ:', selectedCarrierInfo.nom, 'ID:', selectedCarrierInfo.id);
        }
      } else {
        // L'utilisateur n'a pas de transporteur assigné
        if (expeditionData.selectedCarrier && expeditionData.selectedCarrier !== 'assigned' && expeditionData.selectedCarrier !== 'default') {
          // Il a choisi un transporteur → Utiliser celui qu'il a choisi
          selectedCarrierInfo = carriers.find(carrier => carrier.id.toString() === expeditionData.selectedCarrier);
          console.log('✅ RÈGLE 3: Pas de transporteur assigné + choix → Utilisation du transporteur CHOISI:', selectedCarrierInfo?.nom, 'ID:', selectedCarrierInfo?.id);
        } else {
          // Il n'a rien choisi → Utiliser le premier transporteur disponible
          selectedCarrierInfo = carriers[0];
          console.log('⚠️ Fallback: Pas de transporteur assigné + pas de choix → Utilisation du premier disponible:', selectedCarrierInfo?.nom, 'ID:', selectedCarrierInfo?.id);
        }
      }
      
        if (!selectedCarrierInfo) {
          throw new Error('Veuillez sélectionner un transporteur pour obtenir un devis.');
      }
      console.log('🚚 Transporteur utilisé pour le devis:', selectedCarrierInfo?.nom, selectedCarrierInfo);
      
      // 🧮 CALCUL DIRECT AVEC LE TARIFF SERVICE (VERSION RELAYDEPOSITS)
      console.log('🧮 ========== CALCUL DIRECT TARIFF SERVICE ==========');
      
      // Préparer les données pour le tariffService
      const shipmentData = {
        originCity: expeditionData.from_address?.split(',')[0]?.trim() || 'Abidjan',
        destinationCity: finalToAddress?.split(',')[0]?.trim() || 'Abidjan',
        weight: expeditionData.pickup_items.reduce((sum, item) => sum + (parseFloat(item.weight) || 0), 0),
        length: Math.max(...expeditionData.pickup_items.map(item => parseFloat(item.length) || 0)),
        width: Math.max(...expeditionData.pickup_items.map(item => parseFloat(item.width) || 0)),
        height: Math.max(...expeditionData.pickup_items.map(item => parseFloat(item.height) || 0)),
        volumeCm3: expeditionData.pickup_items.reduce((sum, item) => {
          const volume = (parseFloat(item.length) || 0) * (parseFloat(item.width) || 0) * (parseFloat(item.height) || 0) * (parseInt(item.quantity) || 1);
          return sum + volume;
        }, 0),
        serviceType: expeditionData.type_service || 'standard',
        carrierId: selectedCarrierInfo?.id,
        carrierCode: selectedCarrierInfo?.code || 'FASTGO',
        declaredValue: parseFloat(expeditionData.declared_value) || 0,
        isInsured: expeditionData.isInsured || false,
        distance: 0, // Calculé automatiquement par le service
        isDepotRelayPoint: expeditionData.shippingMode === 'relay_point',
        isPickupRelayPoint: expeditionData.shippingMode === 'relay_point',
        isHolidayWeekend: false,
        vehicleType: expeditionData.vehicle_type || 'voiture'
      };
      
      console.log('📋 Données envoyées au tariffService:', shipmentData);
      console.log('🛡️ DEBUG - Données d\'assurance:');
      console.log('   - isInsured:', shipmentData.isInsured);
      console.log('   - declaredValue:', shipmentData.declaredValue);
      console.log('   - expeditionData.isInsured:', expeditionData.isInsured);
      console.log('   - expeditionData.declared_value:', expeditionData.declared_value);
      console.log('🚚 Transporteur sélectionné pour le calcul:', {
        id: selectedCarrierInfo?.id,
        nom: selectedCarrierInfo?.nom,
        code: selectedCarrierInfo?.code,
        isAssigned: selectedCarrierInfo?.isAssigned
      });
      console.log('🔍 Vérification - carrierId envoyé au tariffService:', selectedCarrierInfo?.id);
      console.log('🎯 RÈGLE APPLIQUÉE: Transporteur final =', selectedCarrierInfo?.nom, '(ID:', selectedCarrierInfo?.id, ')');
      
      // Appel direct du tariffService
      const { calculateTariff } = await import('../../services/tariffService');
      const tariffResult = await calculateTariff(shipmentData);
      
      console.log('✅ Résultat du tariffService:', tariffResult);
      console.log('💰 Prix final:', tariffResult.finalPrice);
      console.log('📊 Breakdown complet:', tariffResult.breakdown);
      console.log('🔧 Facteurs appliqués:', tariffResult.breakdown?.factors);
      console.log('===============================================');
      
      // 🔍 DEBUG : Afficher le résultat complet du calcul
      console.log('🔍 ========== RÉSULTAT CALCUL TARIFF SERVICE ==========');
      console.log('📊 TariffResult complet:', tariffResult);
      console.log('💰 Prix final:', tariffResult.finalPrice);
      console.log('📋 Breakdown:', tariffResult.breakdown);
      console.log('📦 ShipmentInfo:', tariffResult.shipmentInfo);
      console.log('===============================================');
      
      // Construire la réponse au format attendu par le reste du code
      quote = {
        // Format compatible avec l'ancien système
        total_price: tariffResult.finalPrice,
        base_price: tariffResult.breakdown?.basePrice || tariffResult.breakdown?.totalTariff || 500,
        ride_quote_id: `KSL-${Date.now()}`,
        
        // NOUVEAU : Ajouter directement les données du breakdown du tariffService
        breakdown: {
          basePrice: tariffResult.breakdown?.basePrice || 0,
          weightTariff: tariffResult.breakdown?.weightTariff || 0,
          volumeTariff: tariffResult.breakdown?.volumeTariff || 0,
          distanceTariff: tariffResult.breakdown?.distanceTariff || 0,
          communeTariff: tariffResult.breakdown?.communeTariff || 0,
          zoneTariff: tariffResult.breakdown?.zoneTariff || 0,
          cityTariff: tariffResult.breakdown?.cityTariff || 0,
          totalTariff: tariffResult.breakdown?.totalTariff || 0,
          factors: tariffResult.breakdown?.factors || {}
        },
        
        // Nouvelles données détaillées
        pricing_breakdown: {
          base_price: tariffResult.breakdown?.basePrice || 500,
          zone_price: tariffResult.breakdown?.zoneTariff || 0,
          weight_supplement: tariffResult.breakdown?.weightTariff || 0,
          volume_supplement: tariffResult.breakdown?.volumeTariff || 0,
          insurance_fee: tariffResult.breakdown?.factors?.insuranceFactor || 0,
          service_factor: tariffResult.breakdown?.factors?.serviceFactor || 1.0,
          relay_point_discount: tariffResult.breakdown?.factors?.relayPointFee || 0,
          weekend_supplement: 0
        },
        
        shipment_details: tariffResult.shipmentInfo,
        estimated_delivery: tariffResult.shipmentInfo?.estimatedDelivery,
        delivery_time: tariffResult.shipmentInfo?.estimatedDelivery?.deliveryWindow,
        
        // Métadonnées
        quote_id: `KSL-${Date.now()}`,
        calculated_at: tariffResult.calculatedAt || new Date().toISOString(),
        currency: 'FCFA',
        quote_type: 'kartian_internal',
        success: true,
        message: 'Devis calculé avec succès'
      };
      
      // Ajouter les informations du transporteur utilisé au devis
      quote.selected_carrier = selectedCarrierInfo;
      
      console.log('✅ Devis final récupéré:', quote);
      setQuoteData(quote);
      setShowQuoteModal(true);
      
    } catch (err) {
      console.error('❌ Erreur lors de la récupération du devis:', err);
      
      // Messages d'erreur spécifiques et améliorés (ORIGINAUX CONSERVÉS)
      let errorMessage = err.message;
      
      if (err.message.includes('401') || err.message.includes('Unauthorized')) {
        errorMessage = 'Erreur d\'authentification avec le transporteur. Vérifiez la configuration des clés API.';
      } else if (err.message.includes('403') || err.message.includes('Forbidden')) {
        errorMessage = 'Accès refusé par le transporteur. Contactez l\'administrateur.';
      } else if (err.message.includes('Network Error')) {
        errorMessage = 'Erreur de connexion. Vérifiez votre connexion internet.';
      } else if (err.message.includes('Transporteur non supporté')) {
        errorMessage = 'Le transporteur sélectionné n\'est pas configuré correctement.';
      }
      
      setEvaError(errorMessage);
    } finally {
      setIsCalculatingQuote(false);
    }
  };

  // 💳 FONCTION MODIFIÉE : Accepter le devis et passer à l'étape de paiement
  const handleAcceptQuote = async () => {
    try {
      // Générer un code de retrait unique
      const generateCodeRetrait = () => {
        const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const numbers = '0123456789';
        let code = '';
        for (let i = 0; i < 2; i++) {
          code += letters.charAt(Math.floor(Math.random() * letters.length));
        }
        for (let i = 0; i < 4; i++) {
          code += numbers.charAt(Math.floor(Math.random() * numbers.length));
        }
        return code;
      };

      // Préparer les données d'expédition (sans la créer encore)
      const expeditionToCreate = {
        ride_type_id: expeditionData.ride_type_id,
        vehicle_type_id: expeditionData.vehicle_type_id,
        zone_id: expeditionData.zone_id,
        order_number: expeditionData.order_number || `CMD-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${String(Math.floor(Math.random() * 999) + 1).padStart(3, '0')}`,
        code_retrait: generateCodeRetrait(),
        statut: "en attente",
        montant: quoteData?.total_price || 0,
        mode_paiement: selectedPaymentMethod?.nom || "espèces", // Utiliser le mode de paiement sélectionné
        type_colis: expeditionData.packageType || "standard",
        statut_colis: "préparé",
        
        // 🔧 CORRECTION : Récupération correcte du point relais
        pointrelais: expeditionData.shippingMode === 'relay_point' && expeditionData.selectedRelayPoint 
          ? (typeof expeditionData.selectedRelayPoint === 'object' ? expeditionData.selectedRelayPoint.id : expeditionData.selectedRelayPoint)
          : null,
        
        // 👤 AJOUTÉ : ID de l'utilisateur connecté
        user: user?.id || user?.user_id,
        
        // 🚚 SIMPLIFIÉ : Utiliser le transporteur assigné
        transporteur: (() => {
          console.log('🔍 Récupération transporteur assigné...');
          console.log('🔍 assignedCarrier ID:', assignedCarrier);
          console.log('🔍 carriers disponibles:', carriers);
          
          // Utiliser le transporteur assigné
          const assignedCarrierObj = carriers.find(carrier => carrier.isAssigned === true);
          
          if (assignedCarrierObj?.id) {
            console.log('✅ Utilisation transporteur assigné:', assignedCarrierObj.id, assignedCarrierObj.nom);
            return assignedCarrierObj.id;
            } else {
            console.error('❌ Aucun transporteur assigné !');
            throw new Error('Aucun transporteur assigné à votre compte');
          }
        })(),
        
        // 🆕 NOUVEAU : Mode d'expédition
        mode_expedition: expeditionData.shippingMode === 'relay_point' ? "Point relais" : "Livraison à domicile",
        
        // 🚚 NOUVEAU : Type de service et délai de livraison
        type_service: expeditionData.type_service || 'standard',
        delais_livraison: expeditionData.delais_livraison || '24h à 48h',
        // Calculer la date de retrait basée sur le délai de livraison
        date_retrait: (() => {
          const delais = expeditionData.delais_livraison || '24h à 48h';
          const now = new Date();
          
          if (delais.includes('2h à 4h')) {
            return new Date(now.getTime() + 3 * 60 * 60 * 1000).toISOString(); // +3h
          } else if (delais.includes('24h à 48h')) {
            return new Date(now.getTime() + 36 * 60 * 60 * 1000).toISOString(); // +36h
          } else if (delais.includes('48h à 78h')) {
            return new Date(now.getTime() + 63 * 60 * 60 * 1000).toISOString(); // +63h
          } else {
            return new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString(); // +24h par défaut
          }
        })(),
        
        pickup_note: expeditionData.pickup_note || "",
        order_note: expeditionData.order_note || "",
        tip_amount: parseInt(expeditionData.tip_amount) || 0,
        
        adresse_expediteur: {
          latitude: parseFloat(expeditionData.from_latitude),
          longitude: parseFloat(expeditionData.from_longitude),
          address: expeditionData.from_address,
          customer_first_name: expeditionData.customer_first_name,
          customer_last_name: expeditionData.customer_last_name,
          customer_phone_number: expeditionData.customer_phone_number,
          customer_email: expeditionData.customer_email || ""
        },
        
        adresse_destinataire: (() => {
          // 📍 MÊME LOGIQUE : Utiliser les coordonnées du point relais si nécessaire
          let finalDestLatitude = expeditionData.to_latitude;
          let finalDestLongitude = expeditionData.to_longitude;
          let finalDestAddress = expeditionData.to_address;
          
          if (expeditionData.shippingMode === 'relay_point' && expeditionData.selectedRelayPoint) {
            let selectedRelay = null;
            
            if (typeof expeditionData.selectedRelayPoint === 'object') {
              selectedRelay = expeditionData.selectedRelayPoint;
            } else {
              const relayId = parseInt(expeditionData.selectedRelayPoint);
              selectedRelay = relayPoints.find(relay => relay.id === relayId);
            }
            
            if (selectedRelay && selectedRelay.latitude && selectedRelay.longitude) {
              finalDestLatitude = selectedRelay.latitude;
              finalDestLongitude = selectedRelay.longitude;
              finalDestAddress = selectedRelay.address || selectedRelay.name;
              
              console.log('✅ Adresse destinataire mise à jour avec point relais:', selectedRelay.name);
            }
          }
          
          return {
            latitude: parseFloat(finalDestLatitude),
            longitude: parseFloat(finalDestLongitude),
            address: finalDestAddress,
            pickup_company_name: expeditionData.pickup_company_name || "",
            pickup_phone_number: expeditionData.pickup_phone_number || "",
            recipient_first_name: expeditionData.recipient_first_name || "",
            recipient_last_name: expeditionData.recipient_last_name || "",
            pickup_email: expeditionData.pickup_email || ""
          };
        })(),
        
        infocolis: expeditionData.pickup_items.map(item => ({
          name: item.name,
          category: item.category,
          weight: parseFloat(item.weight),
          length: parseFloat(item.length) || 0,
          width: parseFloat(item.width) || 0,
          height: parseFloat(item.height) || 0,
          quantity: parseInt(item.quantity)
        }))
      };
      
      console.log('💳 Préparation des données d\'expédition pour paiement:', expeditionToCreate);
      
      // Sauvegarder les données d'expédition en attente
      setPendingExpeditionData(expeditionToCreate);
      
      // 🔧 CORRECTION : Fermer le modal de devis et passer à l'étape 4 (paiement)
      setShowQuoteModal(false);
      setCurrentStep(4);
      
    } catch (err) {
      console.error('❌ Erreur lors de la préparation de l\'expédition:', err);
      
      let errorMessage = 'Erreur lors de la préparation de l\'expédition';
      
      if (err.message) {
        errorMessage = err.message;
      }
      
      alert(`❌ ${errorMessage}`);
    }
  };

  // 💳 NOUVELLE FONCTION : Valider le paiement et créer l'expédition
  const handlePaymentValidation = async () => {
    if (!selectedPaymentMethod) {
      alert('❌ Veuillez sélectionner un mode de paiement');
      return;
    }

    if (!pendingExpeditionData) {
      alert('❌ Aucune expédition en attente. Veuillez recommencer le processus.');
      return;
    }

    if (!user?.id && !user?.user_id) {
      alert('❌ Utilisateur non connecté. Veuillez vous reconnecter.');
      return;
    }

    setIsProcessingPayment(true);

    try {
      console.log('💳 Traitement du paiement...');
      console.log('💳 Mode de paiement sélectionné:', selectedPaymentMethod);
      console.log('💳 Données d\'expédition:', pendingExpeditionData);

      // Mettre à jour le mode de paiement dans les données d'expédition
      const finalExpeditionData = {
        ...pendingExpeditionData,
        mode_paiement: selectedPaymentMethod.nom
      };

      // 🔍 VALIDATION : Vérifier les champs obligatoires
      const requiredFields = [
        'user', 'transporteur', 'adresse_expediteur', 'adresse_destinataire', 
        'infocolis', 'montant', 'mode_paiement', 'mode_expedition'
      ];
      
      const missingFields = requiredFields.filter(field => !finalExpeditionData[field]);
      
      if (missingFields.length > 0) {
        throw new Error(`Champs manquants: ${missingFields.join(', ')}`);
      }

      console.log('📦 Création de l\'expédition avec paiement validé:', finalExpeditionData);
      
      // 🔍 DEBUG : Vérifier les champs spécifiques
      console.log('🔍 VÉRIFICATION DES CHAMPS SPÉCIFIQUES:');
      console.log('   - mode_expedition:', finalExpeditionData.mode_expedition);
      console.log('   - type_service:', finalExpeditionData.type_service);
      console.log('   - delais_livraison:', finalExpeditionData.delais_livraison);
      console.log('   - shippingMode:', expeditionData.shippingMode);
      console.log('   - type_service (expeditionData):', expeditionData.type_service);
      console.log('   - delais_livraison (expeditionData):', expeditionData.delais_livraison);

      // Créer l'expédition
      const response = await createExpedition(finalExpeditionData);
      
      console.log('✅ Expédition créée avec succès:', response.data);
      
      // Message de succès avec les informations importantes
      const successMessage = `
🎉 Expédition créée avec succès !

📋 Numéro de commande: ${finalExpeditionData.order_number}
🔑 Code de retrait: ${finalExpeditionData.code_retrait}
💰 Montant: ${formatPrice(finalExpeditionData.montant)}
💳 Mode de paiement: ${selectedPaymentMethod.nom}
📍 De: ${finalExpeditionData.adresse_expediteur.address}
📍 Vers: ${finalExpeditionData.adresse_destinataire.address}

Votre colis sera traité dans les plus brefs délais !
      `.trim();
      
      // alert(successMessage); // Suppression de l'alerte brute
      setAskPrintLabel(true); // Affiche le modal de confirmation d'impression
      setCurrentStep(5);
      
    } catch (err) {
      console.error('❌ Erreur création expédition:', err);
      
      let errorMessage = 'Erreur lors de la création de l\'expédition';
      
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.response?.data?.error) {
        errorMessage = err.response.data.error;
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      alert(`❌ ${errorMessage}`);
    } finally {
      setIsProcessingPayment(false);
    }
  };

  // Navigation entre étapes
  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 6));
      setEvaError(null);
    } else {
      setEvaError('Veuillez compléter tous les champs obligatoires');
    }
  };

  const handlePrevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
    setEvaError(null);
  };

  // Formatage du prix (TON STYLE)
  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-FR', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price) + ' FCFA';
  };

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

  // [2] Ajouter les états pour le modal d'impression et le nombre d'étiquettes
  const [showPrintLabelModal, setShowPrintLabelModal] = useState(false);
  const [labelCount, setLabelCount] = useState(1);
  const [isPrintingLabel, setIsPrintingLabel] = useState(false);
  const [askPrintLabel, setAskPrintLabel] = useState(false); // nouvel état

  // [3] Fonction pour générer l'étiquette
  const handlePrintLabel = async () => {
    setIsPrintingLabel(true);
    try {
      // Construire l'objet shipment à partir des données de l'expédition en attente
      const shipment = {
        ...pendingExpeditionData,
        // Adapter ici selon le format attendu par printService
        trackingNumber: pendingExpeditionData?.order_number,
        pickupCode: pendingExpeditionData?.code_retrait,
        // Ajouter d'autres champs si besoin
      };
      await printService.generateShippingLabel(shipment, { count: labelCount });
      setShowPrintLabelModal(false);
    } catch (err) {
      alert('Erreur lors de la génération de l\'étiquette : ' + err.message);
    } finally {
      setIsPrintingLabel(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header (TON STYLE) */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Nouvelle expédition 
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Créez votre livraison
          </p>
        </div>
        
        {/* Boutons de test pour remplir les données d'exemple */}
        <div className="hidden sm:flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={fillTestData}
          >
            <Info className="w-4 h-4 mr-2" />
            Test Domicile
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={fillTestDataWithRelayPoint}
          >
            <MapPin className="w-4 h-4 mr-2" />
            Test Point Relais
          </Button>
        </div>
      </div>

      {/* Stepper (TON STYLE) - Responsive pour 6 étapes */}
      <div className="bg-white dark:bg-dark-bg-secondary p-4 rounded-lg border border-gray-200 dark:border-gray-700">
        {/* Version desktop */}
        <div className="hidden md:flex items-center justify-between">
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            <div className="flex flex-col items-center">
              <div className={cn(
                'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium',
                // Si c'est la dernière étape et active, on la met en vert avec ✓
                currentStep === step.id && step.id === steps.length ? 'bg-green-500 text-white' :
                currentStep === step.id ? 'bg-ksl-red text-white' :
                currentStep > step.id ? 'bg-green-500 text-white' :
                'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
              )}>
                {(currentStep > step.id) || (currentStep === step.id && step.id === steps.length) ? '✓' : step.id}
              </div>
              <span className={cn(
                  'mt-1 text-xs font-medium text-center',
                // Même logique pour le texte
                currentStep === step.id && step.id === steps.length ? 'text-green-600' :
                currentStep === step.id ? 'text-ksl-red' :
                currentStep > step.id ? 'text-green-600' :
                'text-gray-500'
              )}>
                {step.title}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div className={cn(
                'flex-1 h-0.5 mx-2',
                currentStep > step.id ? 'bg-green-500' : 'bg-gray-200 dark:bg-gray-700'
              )} />
            )}
          </React.Fragment>
        ))}
        </div>

        {/* Version mobile - Plus compacte */}
        <div className="flex md:hidden items-center justify-between overflow-x-auto">
          {steps.map((step, index) => (
            <React.Fragment key={step.id}>
              <div className="flex flex-col items-center min-w-0 flex-shrink-0">
                <div className={cn(
                  'w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium',
                  currentStep === step.id && step.id === steps.length ? 'bg-green-500 text-white' :
                  currentStep === step.id ? 'bg-ksl-red text-white' :
                  currentStep > step.id ? 'bg-green-500 text-white' :
                  'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                )}>
                  {(currentStep > step.id) || (currentStep === step.id && step.id === steps.length) ? '✓' : step.id}
                </div>
                <span className={cn(
                  'mt-1 text-xs font-medium text-center',
                  currentStep === step.id && step.id === steps.length ? 'text-green-600' :
                  currentStep === step.id ? 'text-ksl-red' :
                  currentStep > step.id ? 'text-green-600' :
                  'text-gray-500'
                )}>
                  {step.title.length > 8 ? step.title.substring(0, 8) + '...' : step.title}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div className={cn(
                  'flex-1 h-0.5 mx-1 min-w-[8px]',
                  currentStep > step.id ? 'bg-green-500' : 'bg-gray-200 dark:bg-gray-700'
                )} />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Contenu principal (TON STYLE) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Formulaire principal */}
        <div className="lg:col-span-2">
          <Card className="p-6">
            
            {/* Étape 1: Expéditeur ET Destinataire (COMBINÉES) */}
            {currentStep === 1 && (
              <div className="space-y-8">
                {/* Section Expéditeur */}
                <div className="space-y-6">
                  <div className="flex items-center space-x-3">
                    <User className="w-6 h-6 text-ksl-red" />
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                      Informations de ramassage
                    </h2>
                  </div>

                  {/* Note explicative avec animation */}
                  {/* <div className="animate-pulse">
                    <Alert variant="info" className="border-2 border-blue-300 dark:border-blue-600 shadow-lg transform hover:scale-105 transition-all duration-300">
                      <div className="flex items-start space-x-3">
                        <div className="animate-bounce">
                          <Info className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div className="flex-1">
                          <p className="font-bold text-blue-900 dark:text-blue-100 text-lg">
                            ℹ️ Informations pré-remplies avec votre profil
                          </p>
                          <p className="text-sm mt-2 text-blue-800 dark:text-blue-200 leading-relaxed">
                            <span className="font-semibold">✨ Les informations ci-dessous sont automatiquement remplies avec vos données de profil.</span>
                            <br />
                            <span className="text-blue-700 dark:text-blue-300">
                              🔄 Si la personne qui doit remettre le colis au livreur est différente de vous, 
                              veuillez modifier ces informations avec les coordonnées de la personne concernée.
                            </span>
                          </p>
                        </div>
                      </div>
                    </Alert>
                  </div> */}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

                  {/* 🗺️ Recherche d'adresse de ramassage avec autocomplétion */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Adresse de ramassage * 
                      <span className="text-xs text-gray-500 ml-1">(avec recherche GPS)</span>
                    </label>
                    <LocationSearch
                      value={expeditionData.from_address}
                      onChange={(address) => updateExpeditionData('from_address', address)}
                      onLocationSelect={(location) => {
                        console.log('📍 Lieu sélectionné pour ramassage:', location);
                        updateExpeditionData('from_address', location.address);
                        updateExpeditionData('from_latitude', location.latitude.toString());
                        updateExpeditionData('from_longitude', location.longitude.toString());
                      }}
                      placeholder="Rechercher l'adresse de ramassage... (ex: Plateau, Abidjan)"
                      className="w-full"
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                      <Target className="w-3 h-3 mr-1" />
                      Tapez au moins 3 caractères pour voir les suggestions. Les coordonnées GPS seront automatiquement remplies.
                    </p>
                  </div>

                  {/* Coordonnées GPS Expéditeur */}
                  <Card className="p-4 bg-blue-50 dark:bg-blue-900/20">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-medium text-gray-900 dark:text-white flex items-center">
                        <Target className="w-4 h-4 mr-2 text-ksl-red" />
                        Coordonnées GPS de ramassage *
                      </h3>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => getCurrentLocation('from')}
                      >
                        <LocateFixed className="w-4 h-4 mr-1" />
                        Ma position
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
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

                    <Input
                    label="Instructions de ramassage"
                    value={expeditionData.pickup_note}
                    onChange={(e) => updateExpeditionData('pickup_note', e.target.value)}
                    placeholder="Instructions spéciales pour le ramassage..."
                  />
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
                <div className="space-y-6">
                  <div className="flex items-center space-x-3">
                    <MapPin className="w-6 h-6 text-ksl-red" />
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                      Informations de livraison
                    </h2>
                  </div>

                  {/* 📦 Configuration de la livraison - RÉORGANISÉE */}
                  <div className="space-y-6">

                    {/* Zone Côte d'Ivoire FIXE */}
                    <Alert variant="info">
                      <Info className="w-4 h-4" />
                      <div>
                        <p className="font-medium">Zone de livraison: Côte d'Ivoire</p>
                        <p className="text-sm">Livraison disponible sur tout le territoire ivoirien</p>
                      </div>
                    </Alert>

                    {/* 1️⃣ CHOIX DU TYPE DE COLIS (PREMIER) */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        📦 Type de colis *
                      </label>
                      <div className="flex gap-2">
                        {packageTypes.map(type => (
                          <button
                            key={type.value}
                            type="button"
                            className={cn('px-3 py-2 rounded border', expeditionData.packageType === type.value ? 'bg-ksl-red text-white' : 'bg-white dark:bg-dark-bg-secondary')}
                            onClick={() => updateExpeditionData('packageType', type.value)}
                          >
                            <span className="mr-1">{type.emoji}</span>{type.label}
                          </button>
                        ))}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Le type de colis détermine les points relais disponibles et les tarifs appliqués
                      </p>
                    </div>

                    {/* 2️⃣ CHOIX DU MODE D'EXPÉDITION (DEUXIÈME) */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        🚚 Mode d'expédition *
                      </label>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          className={cn('px-3 py-2 rounded border', expeditionData.shippingMode === 'home_delivery' ? 'bg-ksl-red text-white' : 'bg-white dark:bg-dark-bg-secondary')}
                          onClick={() => updateExpeditionData('shippingMode', 'home_delivery')}
                        >Livraison à domicile</button>
                        <button
                          type="button"
                          className={cn('px-3 py-2 rounded border', expeditionData.shippingMode === 'relay_point' ? 'bg-ksl-red text-white' : 'bg-white dark:bg-dark-bg-secondary')}
                          onClick={() => updateExpeditionData('shippingMode', 'relay_point')}
                        >Dépôt en point relais</button>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Choisissez entre livraison directe ou dépôt en point relais
                      </p>
                    </div>

                    {/* 3️⃣ CONFIGURATION SELON LE MODE CHOISI (TROISIÈME) */}
                    {expeditionData.shippingMode === 'relay_point' ? (
                      /* Mode Point Relais */
                      <div className="space-y-4">
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            🏪 Choisir un point relais *
                            {isLoadingRelayPoints && <Loader className="w-4 h-4 ml-2 animate-spin inline" />}
                          </label>
                          
                          {relayPointsError && (
                            <Alert variant="error" className="mb-2">
                              <AlertCircle className="w-4 h-4" />
                              {relayPointsError}
                            </Alert>
                          )}
                          
                          <select
                            value={expeditionData.selectedRelayPoint || ''}
                            onChange={e => {
                              const selectedRelayId = e.target.value;
                              updateExpeditionData('selectedRelayPoint', selectedRelayId);
                              
                              // 🆕 NOUVEAU : Mettre à jour automatiquement les coordonnées GPS avec celles du point relais
                              if (selectedRelayId) {
                                const selectedRelay = relayPoints.find(relay => relay.id.toString() === selectedRelayId);
                                if (selectedRelay && selectedRelay.latitude && selectedRelay.longitude) {
                                  console.log('📍 Coordonnées GPS du point relais:', selectedRelay.latitude, selectedRelay.longitude);
                                  updateExpeditionData('to_latitude', selectedRelay.latitude.toString());
                                  updateExpeditionData('to_longitude', selectedRelay.longitude.toString());
                                  updateExpeditionData('to_address', `${selectedRelay.name} - ${selectedRelay.address}`);
                                }
                              }
                            }}
                            className="block w-full px-3 py-2 border rounded-lg"
                            disabled={isLoadingRelayPoints}
                          >
                            <option value="">Sélectionnez un point relais...</option>
                            {filteredRelayPoints.map(relay => (
                              <option key={relay.id} value={relay.id}>
                                {relay.name} - {relay.address} ({relay.phone})
                              </option>
                            ))}
                          </select>
                          
                          {filteredRelayPoints.length === 0 && !isLoadingRelayPoints && (
                            <p className="text-sm text-gray-500 mt-1">
                              Aucun point relais disponible pour ce type de colis dans votre zone.
                            </p>
                          )}
                        </div>

                        {/* Coordonnées GPS du point relais (automatiquement remplies) */}
                        <Card className="p-4 bg-green-50 dark:bg-green-900/20">
                          <div className="flex items-center justify-between mb-3">
                            <h3 className="font-medium text-gray-900 dark:text-white flex items-center">
                              <Target className="w-4 h-4 mr-2 text-ksl-red" />
                              Coordonnées GPS du point relais *
                            </h3>
                            <Badge variant="info" className="text-xs">
                              Auto-remplies
                            </Badge>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <Input
                              label="Latitude *"
                              type="number"
                              step="any"
                              value={expeditionData.to_latitude}
                              onChange={(e) => updateExpeditionData('to_latitude', e.target.value)}
                              placeholder="5.347500"
                              disabled={expeditionData.selectedRelayPoint}
                            />
                            <Input
                              label="Longitude *"
                              type="number"
                              step="any"
                              value={expeditionData.to_longitude}
                              onChange={(e) => updateExpeditionData('to_longitude', e.target.value)}
                              placeholder="-4.015400"
                              disabled={expeditionData.selectedRelayPoint}
                            />
                          </div>
                          
                          {expeditionData.to_latitude && expeditionData.to_longitude && (
                            <Alert variant="success" className="mt-3">
                              <CheckCircle className="w-4 h-4" />
                              Position du point relais: {expeditionData.to_latitude}, {expeditionData.to_longitude}
                            </Alert>
                          )}
                        </Card>
                        {/* Informations de la personne à remettre le colis */}
                        {console.log('🔍 Mode d\'expédition actuel:', expeditionData.shippingMode)}
                        {/* Afficher toujours la section pour le moment */}
                        {true ? (
                          <div className="space-y-4">
                            <h3 className="font-medium text-gray-900 dark:text-white flex items-center">
                              <User className="w-4 h-4 mr-2 text-ksl-red" />
                              Informations de la personne à remettre le colis
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <Input
                                label="Entreprise de ramassage / Nom de la personne à remettre le colis"
                                value={expeditionData.pickup_company_name}
                                onChange={(e) => updateExpeditionData('pickup_company_name', e.target.value)}
                                leftIcon={Building}
                              />
                              <Input
                                label="Téléphone du point de ramassage / Téléphone de la personne à remettre le colis"
                                value={expeditionData.pickup_phone_number}
                                onChange={(e) => updateExpeditionData('pickup_phone_number', e.target.value)}
                                leftIcon={Phone}
                              />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                            <Input
                              label="Email de la personne à remettre le colis"
                              type="email"
                              value={expeditionData.pickup_email}
                              onChange={(e) => updateExpeditionData('pickup_email', e.target.value)}
                              leftIcon={Mail}
                              placeholder="email@exemple.com"
                            />
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
                          </div>
                        ) : null}
                      </div>
                    ) : (
                      /* Mode Livraison à domicile */
                      <div className="space-y-4">
                        {/* Si home_delivery, afficher la liste des transporteurs */}
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            🚛 Transporteur
                            {isLoadingCarriers && <Loader className="w-4 h-4 ml-2 animate-spin inline" />}
                          </label>
                          
                          {carriersError && (
                            <Alert variant="error" className="mb-2">
                              <AlertCircle className="w-4 h-4" />
                              {carriersError}
                            </Alert>
                          )}
                          
                          <select
                            value={expeditionData.selectedCarrier || ''}
                            onChange={e => updateExpeditionData('selectedCarrier', e.target.value)}
                            className="block w-full px-3 py-2 border rounded-lg"
                            disabled={user?.role === 'entreprise' || isLoadingCarriers}
                          >
                            {availableCarriers.map(carrier => (
                              <option key={carrier.id} value={carrier.id}>
                                {carrier.nom}
                              </option>
                            ))}
                          </select>
                          
                          <p className="text-xs text-gray-500 mt-1">
                            Transporteur assigné à votre compte
                          </p>
                          
                          {availableCarriers.length === 0 && !isLoadingCarriers && (
                            <p className="text-sm text-gray-500 mt-1">
                              Aucun transporteur disponible pour le moment.
                            </p>
                          )}
                        </div>



                        {/* 🗺️ Recherche d'adresse de livraison avec autocomplétion */}
                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            📍 Adresse de livraison *
                            <span className="text-xs text-gray-500 ml-1">(avec recherche GPS)</span>
                          </label>
                          <LocationSearch
                            value={expeditionData.to_address}
                            onChange={(address) => updateExpeditionData('to_address', address)}
                            onLocationSelect={(location) => {
                              console.log('📍 Lieu sélectionné pour livraison:', location);
                              updateExpeditionData('to_address', location.address);
                              updateExpeditionData('to_latitude', location.latitude.toString());
                              updateExpeditionData('to_longitude', location.longitude.toString());
                            }}
                            placeholder="Rechercher l'adresse de livraison... (ex: Cocody, Abidjan)"
                            className="w-full"
                          />
                          <p className="text-xs text-blue-600 dark:text-blue-400 flex items-center">
                            <MapPin className="w-3 h-3 mr-1" />
                            Recherchez par quartier, ville ou nom de lieu. Coordonnées GPS automatiques.
                          </p>
                        </div>

                        {/* Coordonnées GPS Destinataire */}
                        <Card className="p-4 bg-green-50 dark:bg-green-900/20">
                          <div className="flex items-center justify-between mb-3">
                            <h3 className="font-medium text-gray-900 dark:text-white flex items-center">
                              <Target className="w-4 h-4 mr-2 text-ksl-red" />
                              Coordonnées GPS de livraison *
                            </h3>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => getCurrentLocation('to')}
                            >
                              <LocateFixed className="w-4 h-4 mr-1" />
                              Ma position
                            </Button>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
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

                        {/* Informations de la personne à remettre le colis */}
                        {console.log('🔍 Mode d\'expédition actuel:', expeditionData.shippingMode)}
                        {/* Afficher toujours la section pour le moment */}
                        {true ? (
                          <div className="space-y-4">
                            <h3 className="font-medium text-gray-900 dark:text-white flex items-center">
                              <User className="w-4 h-4 mr-2 text-ksl-red" />
                              Informations de la personne à remettre le colis
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <Input
                                label="Entreprise de ramassage / Nom de la personne à remettre le colis"
                                value={expeditionData.pickup_company_name}
                                onChange={(e) => updateExpeditionData('pickup_company_name', e.target.value)}
                                leftIcon={Building}
                              />
                              <Input
                                label="Téléphone du point de ramassage / Téléphone de la personne à remettre le colis"
                                value={expeditionData.pickup_phone_number}
                                onChange={(e) => updateExpeditionData('pickup_phone_number', e.target.value)}
                                leftIcon={Phone}
                              />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                            <Input
                              label="Email de la personne à remettre le colis"
                              type="email"
                              value={expeditionData.pickup_email}
                              onChange={(e) => updateExpeditionData('pickup_email', e.target.value)}
                              leftIcon={Mail}
                              placeholder="email@exemple.com"
                            />
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
                          </div>
                        ) : null}
                      </div>
                    )}

                    <Input
                      label="Notes de livraison"
                      value={expeditionData.order_note}
                      onChange={(e) => updateExpeditionData('order_note', e.target.value)}
                      placeholder="Instructions spéciales pour la livraison..."
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Étape 2: Articles (anciennement étape 3) */}
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
                        <br />
                        Volume total: {(expeditionData.pickup_items.reduce((sum, item) => {
                          const itemVolume = (parseFloat(item.length) || 0) * (parseFloat(item.width) || 0) * (parseFloat(item.height) || 0) * parseInt(item.quantity);
                          return sum + (itemVolume / 1000000); // Convertir en m³
                        }, 0)).toFixed(3)}m³
                        <br />
                        <strong>Véhicule recommandé:</strong> {
                          (() => {
                            const vehicle = VEHICLE_TYPES.find(v => v.id === expeditionData.vehicle_type_id);
                            return vehicle ? `${vehicle.icon} ${vehicle.name}` : 'Auto';
                          })()
                        }
                      </p>
                    </Alert>
                  </div>
                )}

                {/* Message informatif pour la sélection du véhicule */}
                <div className="mb-4">
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <span className="text-yellow-600 dark:text-yellow-400 text-lg">💡</span>
                      <div>
                        <p className="font-medium text-yellow-900 dark:text-yellow-100 mb-1">
                          Choisissez votre véhicule selon le poids total de vos articles
                        </p>
                        <p className="text-sm text-yellow-700 dark:text-yellow-300">
                          Basé sur votre poids total de <strong>{expeditionData.pickup_items.reduce((sum, item) => sum + (parseFloat(item.weight) * item.quantity), 0)}kg</strong>, 
                          nous vous recommandons de choisir un véhicule approprié. La sélection automatique peut ne pas être toujours précise.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sélection manuelle du véhicule EVA */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Type de véhicule EVA (modifiable)
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {VEHICLE_TYPES.map((vehicle) => (
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



                {/* 📋 RÉCAPITULATIF DES CHOIX DE LIVRAISON (ÉTAPE 1) */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    📋 Récapitulatif des choix de livraison
                  </label>
                  
                  <Card className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700">
                    <div className="space-y-3">
                      {/* Type de colis */}
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-blue-900 dark:text-blue-100">Type de colis:</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-blue-700 dark:text-blue-300">
                            {packageTypes.find(t => t.value === expeditionData.packageType)?.emoji || '📦'}
                          </span>
                          <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
                            {packageTypes.find(t => t.value === expeditionData.packageType)?.label || 'Non défini'}
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

                      {/* Détails selon le mode */}
                      {expeditionData.shippingMode === 'relay_point' ? (
                        /* Point relais sélectionné */
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-blue-900 dark:text-blue-100">Point relais:</span>
                          <div className="text-right">
                            {expeditionData.selectedRelayPoint ? (
                              <div className="text-sm text-blue-800 dark:text-blue-200">
                                {relayPoints.find(r => r.id.toString() === expeditionData.selectedRelayPoint)?.name || 'Point relais sélectionné'}
                                <div className="text-xs text-blue-600 dark:text-blue-400">
                                  {relayPoints.find(r => r.id.toString() === expeditionData.selectedRelayPoint)?.address}
                                </div>
                              </div>
                            ) : (
                              <span className="text-sm text-orange-600 dark:text-orange-400">À sélectionner</span>
                            )}
                          </div>
                        </div>
                      ) : (
                        /* Transporteur pour livraison domicile */
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-blue-900 dark:text-blue-100">Transporteur:</span>
                          <div className="text-right">
                            {expeditionData.selectedCarrier ? (
                              <div className="text-sm text-blue-800 dark:text-blue-200">
                                {availableCarriers.find(c => c.id.toString() === expeditionData.selectedCarrier)?.nom || 'Transporteur sélectionné'}
                              </div>
                            ) : (
                              <span className="text-sm text-orange-600 dark:text-orange-400">À sélectionner</span>
                            )}
                          </div>
                        </div>
                      )}

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
                            <span className="text-sm text-orange-600 dark:text-orange-400">À définir</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Bouton pour modifier */}
                    <div className="mt-4 pt-3 border-t border-blue-200 dark:border-blue-700">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentStep(1)}
                        className="w-full text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/30"
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Modifier les choix de livraison
                      </Button>
                    </div>
                  </Card>
                </div>

                {/* 🚀 NOUVEAU : Choix du type de service */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
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
                          <Badge 
                            variant={expeditionData.type_service === service.key ? 'default' : 'secondary'}
                            className={cn(
                              'text-xs',
                              service.key === 'express' && 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400',
                              service.key === 'economique' && 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
                              service.key === 'standard' && 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
                              service.key === 'regional' && 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400',
                              service.key === 'simplicite' && 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                            )}
                          >
                            {service.description}
                          </Badge>
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

                {/* 🛡️ NOUVEAU : Section Assurance */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
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
              </div>
            )}

            {/* Étape 3: Devis (anciennement étape 4) */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Calculator className="w-6 h-6 text-ksl-red" />
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                      Calculer le devis EVA
                    </h2>
                  </div>
                  
                  <Button 
                    onClick={handleGetQuote}
                    isLoading={isCalculatingQuote}
                    disabled={!validateStep(2)}
                  >
                    <Calculator className="w-4 h-4 mr-2" />
                    Obtenir un devis
                  </Button>
                </div>

                {/* Résumé de la commande */}
                <Card className="p-4 bg-blue-50 dark:bg-blue-900/20">
                  <h3 className="font-medium text-gray-900 dark:text-white mb-3">
                    Résumé de votre expédition
                  </h3>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>De:</span>
                      <span className="text-right max-w-xs truncate">
                        {expeditionData.from_address || 'Non défini'}
                      </span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span>Vers:</span>
                      <span className="text-right max-w-xs truncate">
                        {expeditionData.to_address || 'Non défini'}
                      </span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span>Articles:</span>
                      <span>{expeditionData.pickup_items.length} article(s)</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span>Poids total:</span>
                      <span>
                        {expeditionData.pickup_items.reduce((sum, item) => 
                          sum + (item.weight * item.quantity), 0
                        ).toFixed(1)}kg
                      </span>
                    </div>
                    
                    <div className="flex justify-between font-medium pt-2 border-t">
                      <span>Véhicule:</span>
                      <span>
                        {VEHICLE_TYPES.find(v => v.id === expeditionData.vehicle_type_id)?.name}
                      </span>
                    </div>
                  </div>
                </Card>

                {/* Affichage du devis */}
                {quoteData && (
                  <Alert variant="success">
                    <CheckCircle className="w-4 h-4" />
                    <div>
                      <p className="font-medium">Devis calculé avec succès !</p>
                      <p className="text-sm mt-1">
                        Prix estimé: <strong>{formatPrice(quoteData.total_price || 5000)}</strong>
                        <br />
                        Durée estimée: {quoteData.duration ? `${quoteData.duration} min` : 'N/A'}
                      </p>
                    </div>
                  </Alert>
                )}

                {/* Champs complémentaires */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Pourboire (FCFA)"
                    type="number"
                    value={expeditionData.tip_amount}
                    onChange={(e) => updateExpeditionData('tip_amount', e.target.value)}
                    placeholder="0"
                  />
                  <Input
                    label="Business ID (optionnel)"
                    value={expeditionData.business_id || ''}
                    onChange={(e) => updateExpeditionData('business_id', e.target.value)}
                    placeholder="ID du business EVA"
                  />
                </div>
              </div>
            )}

            {/* Étape 4: Sélection du mode de paiement */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div className="flex items-center space-x-3">
                  <CreditCard className="w-6 h-6 text-ksl-red" />
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    💳 Choisir le mode de paiement
                  </h2>
                </div>

                {/* Sélection du mode de paiement */}
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    Sélectionnez votre mode de paiement
                  </h4>
                  
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
                    <div className="space-y-3">
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
                              selectedPaymentMethod?.id === method.id
                                ? 'border-ksl-red bg-ksl-red'
                                : 'border-gray-300 dark:border-gray-600'
                            )}>
                              {selectedPaymentMethod?.id === method.id && (
                                <div className="w-full h-full rounded-full bg-white scale-50" />
                              )}
                            </div>
                            
                            <div className="flex-1">
                              <div className="flex items-center space-x-2">
                                <CreditCard className="w-5 h-5 text-ksl-red" />
                                <span className="font-medium text-gray-900 dark:text-white">
                                  {method.nomMethode}
                                </span>
                                {method.fournisseur && (
                                  <span className="text-xs text-gray-500 dark:text-gray-400">
                                    ({method.fournisseur})
                                  </span>
                                )}
                              </div>
                              
                              {method.description && (
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                  {method.description}
                                </p>
                              )}
                              
                              {method.montant_min && method.montant_max && (
                                <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                                  Montant: {formatPrice(parseFloat(method.montant_min))} - {formatPrice(parseFloat(method.montant_max))}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Bouton de validation du paiement */}
                <Button 
                  onClick={handlePaymentValidation}
                  className="w-full"
                  size="lg"
                  disabled={!selectedPaymentMethod || isProcessingPayment}
                  isLoading={isProcessingPayment}
                >
                  <CreditCard className="w-5 h-5 mr-2" />
                  {isProcessingPayment ? 'Traitement du paiement...' : 'Valider le paiement et créer l\'expédition'}
                </Button>
              </div>
            )}

            {/* Étape 5: Confirmation */}
            {currentStep === 5 && (
              <div className="space-y-8">
                {/* Header de succès */}
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    🎉 Expédition créée avec succès !
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    Votre expédition a été créée et sera traitée dans les plus brefs délais.
                  </p>
                </div>

                {/* Récapitulatif complet */}
                {pendingExpeditionData && (
                  <div className="space-y-6">
                    {/* Informations principales */}
                    <Card className="p-6 bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-900/20 dark:to-green-900/20">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Numéro de commande */}
                        <div className="text-center">
                          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                            <Package className="w-6 h-6 text-blue-600" />
                          </div>
                          <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Numéro de commande</h4>
                          <p className="font-mono text-lg text-blue-600 dark:text-blue-400">
                            {pendingExpeditionData.order_number}
                          </p>
                        </div>

                        {/* Code de retrait */}
                        <div className="text-center">
                          <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                            <Key className="w-6 h-6 text-orange-600" />
                          </div>
                          <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Code de retrait</h4>
                          <p className="font-mono text-lg font-bold text-orange-600 dark:text-orange-400">
                            {pendingExpeditionData.code_retrait}
                          </p>
                        </div>

                        {/* Montant total */}
                        <div className="text-center">
                          <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                            <CreditCard className="w-6 h-6 text-green-600" />
                          </div>
                          <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Montant total</h4>
                          <p className="text-lg font-bold text-green-600 dark:text-green-400">
                            {formatPrice(pendingExpeditionData.montant)}
                          </p>
                        </div>
                      </div>
                    </Card>

                    {/* Détails de l'expédition */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Informations expéditeur/destinataire */}
                      <Card className="p-6">
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                          <Users className="w-5 h-5 mr-2 text-ksl-red" />
                          Informations de livraison
                        </h3>
                        
                        <div className="space-y-4">
                          {/* Expéditeur */}
                          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                            <div className="flex items-center mb-2">
                              <User className="w-4 h-4 text-blue-600 mr-2" />
                              <span className="font-medium text-blue-900 dark:text-blue-100">Expéditeur</span>
                            </div>
                            <div className="text-sm text-blue-800 dark:text-blue-200">
                              <p className="font-medium">{pendingExpeditionData.adresse_expediteur.customer_first_name} {pendingExpeditionData.adresse_expediteur.customer_last_name}</p>
                              <p className="text-xs mt-1">{pendingExpeditionData.adresse_expediteur.address}</p>
                              <p className="text-xs">{pendingExpeditionData.adresse_expediteur.customer_phone_number}</p>
                            </div>
                          </div>

                          {/* Destinataire */}
                          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                            <div className="flex items-center mb-2">
                              <MapPin className="w-4 h-4 text-green-600 mr-2" />
                              <span className="font-medium text-green-900 dark:text-green-100">Destinataire</span>
                            </div>
                            <div className="text-sm text-green-800 dark:text-green-200">
                              <p className="font-medium">{pendingExpeditionData.adresse_destinataire.pickup_company_name}</p>
                              <p className="text-xs mt-1">{pendingExpeditionData.adresse_destinataire.address}</p>
                              <p className="text-xs">{pendingExpeditionData.adresse_destinataire.pickup_phone_number}</p>
                            </div>
                          </div>

                          {/* Mode d'expédition */}
                          <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                            <div className="flex items-center mb-2">
                              <Truck className="w-4 h-4 text-purple-600 mr-2" />
                              <span className="font-medium text-purple-900 dark:text-purple-100">Mode d'expédition</span>
                            </div>
                            <div className="text-sm text-purple-800 dark:text-purple-200">
                              <p className="font-medium">
                                {pendingExpeditionData.mode_expedition === 'relay_point' ? '🏪 Dépôt en point relais' : '🚚 Livraison à domicile'}
                              </p>
                              <p className="text-xs mt-1">
                                {pendingExpeditionData.mode_expedition === 'relay_point' ? 'Le destinataire récupérera le colis au point relais' : 'Livraison directe à l\'adresse du destinataire'}
                              </p>
                            </div>
                          </div>
                        </div>
                      </Card>

                      {/* Détails du colis et paiement */}
                      <Card className="p-6">
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                          <Package className="w-5 h-5 mr-2 text-ksl-red" />
                          Détails du colis
                        </h3>
                        
                        <div className="space-y-4">
                          {/* Articles */}
                          <div>
                            <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                              Articles ({pendingExpeditionData.infocolis?.length || 0})
                            </h4>
                            <div className="space-y-2">
                              {pendingExpeditionData.infocolis?.map((item, index) => (
                                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                  <div className="flex items-center space-x-3">
                                    <div className="w-8 h-8 bg-ksl-red/10 rounded-full flex items-center justify-center">
                                      <Package className="w-4 h-4 text-ksl-red" />
                                    </div>
                                    <div>
                                      <p className="font-medium text-gray-900 dark:text-white">{item.name}</p>
                                      <p className="text-xs text-gray-500 dark:text-gray-400">{item.category}</p>
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <p className="font-medium text-gray-900 dark:text-white">{item.quantity}x</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">{item.weight} kg</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Informations de paiement */}
                          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                            <h4 className="font-medium text-gray-900 dark:text-white mb-3">Paiement</h4>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-gray-400">Méthode:</span>
                                <span className="font-medium text-gray-900 dark:text-white">
                                  {selectedPaymentMethod?.nomMethode || 'Non défini'}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-gray-400">Statut:</span>
                                <Badge variant="success">Payé</Badge>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-gray-400">Montant:</span>
                                <span className="font-bold text-ksl-red">
                                  {formatPrice(pendingExpeditionData.montant)}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Card>
                    </div>

                    {/* Instructions importantes */}
                    <Card className="p-6 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700">
                      <h3 className="font-semibold text-yellow-900 dark:text-yellow-100 mb-4 flex items-center">
                        <AlertTriangle className="w-5 h-5 mr-2" />
                        Instructions importantes
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div className="space-y-2">
                          <div className="flex items-start space-x-2">
                            <div className="w-2 h-2 bg-yellow-600 rounded-full mt-2 flex-shrink-0"></div>
                            <p className="text-yellow-800 dark:text-yellow-200">
                              Conservez précieusement votre code de retrait
                            </p>
                          </div>
                          <div className="flex items-start space-x-2">
                            <div className="w-2 h-2 bg-yellow-600 rounded-full mt-2 flex-shrink-0"></div>
                            <p className="text-yellow-800 dark:text-yellow-200">
                              Le destinataire devra présenter ce code pour récupérer le colis
                            </p>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-start space-x-2">
                            <div className="w-2 h-2 bg-yellow-600 rounded-full mt-2 flex-shrink-0"></div>
                            <p className="text-yellow-800 dark:text-yellow-200">
                              Vous recevrez des notifications sur l'état de votre expédition
                            </p>
                          </div>
                          <div className="flex items-start space-x-2">
                            <div className="w-2 h-2 bg-yellow-600 rounded-full mt-2 flex-shrink-0"></div>
                            <p className="text-yellow-800 dark:text-yellow-200">
                              Contactez le support en cas de problème
                            </p>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </div>
                )}

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button 
                    variant="outline" 
                    onClick={() => window.print()} 
                    className="flex-1 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Imprimer le reçu
                  </Button>
                  <Button 
                    onClick={() => {
                      // Réinitialiser pour une nouvelle expédition
                      setCurrentStep(1);
                      setQuoteData(null);
                      setEvaError(null);
                      setPendingExpeditionData(null);
                      setSelectedPaymentMethod(null);
                      setExpeditionData({
                        ...expeditionData,
                        pickup_items: [],
                        pickup_email: '',
                        recipient_first_name: '',
                        recipient_last_name: '',
                        type_service: 'standard',
                        delais_livraison: '24h à 48h',
                        order_number: Math.floor(10000 + Math.random() * 90000).toString()
                      });
                    }}
                    className="flex-1 bg-ksl-red hover:bg-red-700"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Nouvelle expédition
                  </Button>
                </div>
              </div>
            )}

            {/* Messages d'erreur */}
            {evaError && (
              <Alert variant="error" className="mt-4">
                <AlertCircle className="w-4 h-4" />
                {evaError}
              </Alert>
            )}

            {/* Boutons de navigation (TON STYLE) */}
            <div className="flex justify-between pt-6 border-t border-gray-200 dark:border-gray-700">
              <Button
                variant="outline"
                onClick={handlePrevStep}
                disabled={currentStep === 1}
              >
                Précédent
              </Button>
              
              {currentStep < 3 ? (
                <Button
                  onClick={handleNextStep}
                  disabled={!validateStep(currentStep)}
                >
                  Suivant
                </Button>
              ) : currentStep === 3 ? (
                <Button
                  onClick={!quoteData ? handleGetQuote : handleAcceptQuote}
                  disabled={!validateStep(currentStep) || isCalculatingQuote}
                  isLoading={isCalculatingQuote}
                >
                  {!quoteData ? 'Calculer le devis' : 'Accepter le devis'}
                </Button>
              ) : currentStep === 4 ? (
                // Pas de bouton "Suivant" pour l'étape 4, utiliser le bouton de validation du paiement dans la section
                <div></div>
              ) : currentStep === 5 ? (
                // Pas de bouton "Suivant" pour l'étape 5 (confirmation)
                <div></div>
              ) : null}
            </div>
          </Card>
        </div>

        {/* Sidebar de résumé (TON STYLE) */}
        <div className="lg:col-span-1">
          <Card className="p-6 sticky top-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Résumé:
            </h3>
            
            <div className="space-y-4">
              {/* Statut de l'étape */}
              <div className="text-sm">
                <p className="font-medium text-gray-900 dark:text-white">
                  Étape {currentStep}/5: {steps[currentStep - 1]?.title}
                </p>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
                  <div 
                    className="bg-ksl-red h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(currentStep / 5) * 100}%` }}
                  />
                </div>
              </div>

              {/* Type de véhicule */}
              <div className="text-sm">
                <p className="font-medium text-gray-900 dark:text-white">
                  Véhicule:
                </p>
                <div className="flex items-center space-x-2 mt-1 dark:text-white">
                  <span className="text-lg">
                    {VEHICLE_TYPES.find(v => v.id === expeditionData.vehicle_type_id)?.icon || '🚚'}
                  </span>
                  <span>
                    {VEHICLE_TYPES.find(v => v.id === expeditionData.vehicle_type_id)?.name || 'Auto'}
                  </span>
                </div>
              </div>

              {/* Zone */}
              <div className="text-sm">
                <p className="font-medium text-gray-900 dark:text-white">Zone:</p>
                <p className="text-gray-600 dark:text-gray-400">
                  🇨🇮 Côte d'Ivoire
                </p>
              </div>

              {/* Articles */}
              <div className="text-sm">
                <p className="font-medium text-gray-900 dark:text-white">Articles:</p>
                <p className="text-gray-600 dark:text-gray-400">
                  {expeditionData.pickup_items.length} article(s)
                </p>
                {expeditionData.pickup_items.length > 0 && (
                  <p className="text-xs text-gray-500">
                    Poids: {expeditionData.pickup_items.reduce((sum, item) => 
                      sum + (item.weight * item.quantity), 0
                    ).toFixed(1)}kg
                  </p>
                )}
              </div>

              {/* Prix estimé */}
              {quoteData && (
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                  <div className="text-sm">
                    <p className="font-medium text-gray-900 dark:text-white">Prix estimé:</p>
                    <p className="text-lg font-bold text-ksl-red">
                      {formatPrice(quoteData.total_price || 5000)}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* Modal de devis (AMÉLIORÉ AVEC BREAKDOWN DÉTAILLÉ) */}
        {/* Modal de devis (AMÉLIORÉ AVEC BREAKDOWN DÉTAILLÉ) */}
      <Modal isOpen={showQuoteModal} onClose={() => setShowQuoteModal(false)}>
        <div className="p-6 max-w-4xl">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            🧮 Devis de livraison Kartian - Calcul détaillé
          </h3>
          
          {/* NOUVEAU : Section de confirmation du tariffService */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-4 rounded-lg mb-6 border-l-4 border-blue-500">
            <div className="flex items-center space-x-2 mb-3">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-blue-900 dark:text-blue-200">
                  ✅ TariffService appliqué avec succès
                </h4>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Calcul effectué via le service de tarification Kartian
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium">🔧 Service utilisé:</span>
                  <span className="text-blue-600 font-mono">tariffService.calculateTariff()</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">📊 Grille tarifaire:</span>
                  <span className="text-blue-600">{quoteData?.details?.tariffGrid || 'Grille par défaut'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">🚚 Transporteur:</span>
                  <span className="text-blue-600">{quoteData?.selected_carrier?.nom || 'FastGo Express'}</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium">💰 Prix final:</span>
                  <span className="text-green-600 font-bold text-lg">{formatPrice(quoteData?.total_price || 0)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">📅 Calculé le:</span>
                  <span className="text-blue-600">{quoteData?.calculated_at ? new Date(quoteData.calculated_at).toLocaleString('fr-FR') : 'Maintenant'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">🆔 ID Devis:</span>
                  <span className="text-blue-600 font-mono text-xs">{quoteData?.quote_id || 'KSL-' + Date.now()}</span>
                </div>
              </div>
            </div>
          </div>
          
          {quoteData && (
            <div className="space-y-6">
              {/* Résumé principal */}
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                <div className="flex items-center space-x-2 mb-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="font-medium text-green-800 dark:text-green-200">
                    {quoteData.message || 'Devis calculé avec succès'}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>ID Devis:</span>
                      <span className="font-mono text-xs">{quoteData.quote_id || 'KSL-' + Date.now()}</span>
                  </div>
                  
                    {quoteData?.shipment_details && (
                      <>
                  <div className="flex justify-between">
                          <span>🗺️ Zone origine:</span>
                          <span className="capitalize">{quoteData?.shipment_details?.originZone || getCityZone(expeditionData.from_address?.split(',')[0]?.trim())?.id || 'N/A'} ({quoteData?.shipment_details?.originCity || expeditionData.from_address?.split(',')[0]?.trim() || 'N/A'})</span>
                  </div>
                  
                  <div className="flex justify-between">
                          <span>🎯 Zone destination:</span>
                          <span className="capitalize">{quoteData?.shipment_details?.destinationZone || getCityZone(expeditionData.to_address?.split(',')[0]?.trim())?.id || 'N/A'} ({quoteData?.shipment_details?.destinationCity || expeditionData.to_address?.split(',')[0]?.trim() || 'N/A'})</span>
                        </div>
                      </>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    {quoteData?.shipment_details && (
                      <>
                        <div className="flex justify-between">
                          <span>⚖️ Poids total:</span>
                          <span>{quoteData?.shipment_details?.totalWeight || 0} kg</span>
                  </div>
                        
                        <div className="flex justify-between">
                          <span>📦 Volume total:</span>
                          <span>{Math.round(quoteData?.shipment_details?.totalVolumeCm3 || 0).toLocaleString()} cm³</span>
                          {/* <span>{(quoteData.shipment_details.totalVolumeCm3 * 1000000).toFixed(0)} cm³</span> */}
                </div>
                        
                        <div className="flex justify-between">
                          <span>🚚 Type de service:</span>
                          <span className="capitalize">{quoteData?.shipment_details?.serviceType || 'Standard'}</span>
              </div>
                        
                        <div className="flex justify-between">
                          <span>🕐 Délai de livraison:</span>
                          <span>{quoteData?.shipment_details?.delais_livraison || '24h à 48h'}</span>
                        </div>
                        
                        <div className="flex justify-between">
                          <span>🕐 Livraison estimée:</span>
                          <span>{quoteData?.estimated_delivery?.deliveryWindow || 'N/A'}</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* NOUVEAU : Données envoyées au tariffService */}
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg mb-4">
                <h4 className="font-medium text-green-900 dark:text-green-200 mb-3 flex items-center">
                  <Send className="w-4 h-4 mr-2" />
                  Données envoyées au TariffService
                </h4>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>🏙️ Ville origine:</span>
                      <span className="font-mono">{quoteData?.shipment_details?.originCity || expeditionData.from_address?.split(',')[0] || 'Abidjan'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>🗺️ Zone origine:</span>
                      <span className="font-mono capitalize">{quoteData?.shipment_details?.originZone || getCityZone(expeditionData.from_address?.split(',')[0]?.trim())?.id || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>🎯 Ville destination:</span>
                      <span className="font-mono">{quoteData?.shipment_details?.destinationCity || expeditionData.to_address?.split(',')[0] || 'Abidjan'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>🎯 Zone destination:</span>
                      <span className="font-mono capitalize">{quoteData?.shipment_details?.destinationZone || getCityZone(expeditionData.to_address?.split(',')[0]?.trim())?.id || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>⚖️ Poids total:</span>
                      <span>{quoteData?.shipment_details?.totalWeight || 0} kg</span>
                    </div>
                    <div className="flex justify-between">
                      <span>📦 Volume total:</span>
                      <span>{Math.round(quoteData?.shipment_details?.totalVolumeCm3 || 0).toLocaleString()} cm³</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>🚚 Type de service:</span>
                      <span className="capitalize">{quoteData?.shipment_details?.serviceType || 'standard'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>🆔 Transporteur:</span>
                      <span className="font-mono">{quoteData?.selected_carrier?.nom || 'FastGo Express'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>🛡️ Assurance:</span>
                      <span>{quoteData?.shipment_details?.isInsured ? '✅ OUI' : '❌ NON'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>💰 Valeur déclarée:</span>
                      <span>{formatPrice(quoteData?.shipment_details?.declaredValue || 0)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* NOUVEAU : Détail des articles expédiés */}
              {expeditionData.pickup_items && expeditionData.pickup_items.length > 0 && (
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-900 dark:text-blue-200 mb-3 flex items-center">
                    📦 Détail des articles expédiés
                  </h4>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-blue-200 dark:border-blue-700">
                          <th className="text-left py-2">Article</th>
                          <th className="text-right py-2">Qté</th>
                          <th className="text-right py-2">Poids (kg)</th>
                          <th className="text-right py-2">Dimensions (cm)</th>
                          <th className="text-right py-2">Volume (cm³)</th>
                          <th className="text-right py-2">Poids total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {expeditionData.pickup_items.map((item, index) => {
                          const totalWeight = parseFloat(item.weight) * parseInt(item.quantity);
                          const volume = (parseFloat(item.length) || 0) * (parseFloat(item.width) || 0) * (parseFloat(item.height) || 0);
                          return (
                            <tr key={index} className="border-b border-blue-100 dark:border-blue-800">
                              <td className="py-2">{item.name}</td>
                              <td className="text-right py-2">{item.quantity}</td>
                              <td className="text-right py-2">{item.weight} kg</td>
                              <td className="text-right py-2">{item.length}×{item.width}×{item.height}</td>
                              <td className="text-right py-2">{volume.toLocaleString()}</td>
                              <td className="text-right py-2 font-medium">{totalWeight} kg</td>
                            </tr>
                          );
                        })}
                        <tr className="border-t-2 border-blue-300 dark:border-blue-600 font-bold">
                          <td className="py-2" colSpan="5">TOTAUX</td>
                          <td className="text-right py-2">
                            {expeditionData.pickup_items.reduce((sum, item) => 
                              sum + (parseFloat(item.weight) * parseInt(item.quantity)), 0
                            )} kg
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* NOUVEAU : Détail complet des calculs étape par étape */}
              {quoteData.pricing_breakdown && (
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-3 flex items-center">
                    <Calculator className="w-4 h-4 mr-2" />
                    Calcul tarifaire détaillé - Étape par étape
                  </h4>
                  
                  {/* NOUVEAU : Résultats du tariffService */}
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg mb-4 border-l-4 border-yellow-500">
                    <h5 className="font-medium text-yellow-800 dark:text-yellow-200 mb-3 flex items-center">
                      <Database className="w-4 h-4 mr-2" />
                      Résultats du TariffService
                    </h5>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>🏁 Prix final (tariffService):</span>
                          <span className="font-bold text-green-600">{formatPrice(quoteData?.total_price || 0)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>📊 Prix de base:</span>
                          <span>{formatPrice(quoteData?.breakdown?.basePrice || 0)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>🗺️ Tarif zone:</span>
                          <span>{formatPrice(quoteData?.breakdown?.zoneTariff || 0)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>🏙️ Tarif ville:</span>
                          <span>{formatPrice(quoteData?.breakdown?.cityTariff || 0)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>🏘️ Tarif commune:</span>
                          <span>{formatPrice(quoteData?.breakdown?.communeTariff || 0)}</span>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>⚖️ Tarif poids:</span>
                          <span>{formatPrice(quoteData?.breakdown?.weightTariff || 0)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>📦 Tarif volume:</span>
                          <span>{formatPrice(quoteData?.breakdown?.volumeTariff || 0)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>📍 Tarif distance:</span>
                          <span>{formatPrice(quoteData?.breakdown?.distanceTariff || 0)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>💰 Tarif total:</span>
                          <span className="font-medium">{formatPrice(quoteData?.breakdown?.totalTariff || 0)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>🎯 Devise:</span>
                          <span className="font-mono">{quoteData?.currency || 'FCFA'}</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Facteurs appliqués */}
                    {quoteData?.breakdown?.factors && (
                      <div className="mt-4 p-3 bg-white dark:bg-gray-700 rounded border">
                        <h6 className="font-medium text-gray-700 dark:text-gray-300 mb-2">🔧 Facteurs appliqués:</h6>
                        <div className="grid grid-cols-3 gap-2 text-xs">
                          <div className="flex justify-between">
                            <span>Zone:</span>
                            <span className="font-mono">{quoteData.breakdown.factors.zoneFactor || 1.0}×</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Assurance:</span>
                            <span className="font-mono">{quoteData.breakdown.factors.insuranceFactor || 1.0}×</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Temps:</span>
                            <span className="font-mono">{quoteData.breakdown.factors.timeFactor || 1.0}×</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Service:</span>
                            <span className="font-mono">{quoteData.breakdown.factors.serviceFactor || 1.0}×</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Équipement:</span>
                            <span className="font-mono">{quoteData.breakdown.factors.equipmentFactor || 1.0}×</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Point relais:</span>
                            <span className="font-mono">+{formatPrice(quoteData.breakdown.factors.relayPointFee || 0)}</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* NOUVELLE SECTION : Détails du calcul tarifaire */}
                    <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900 dark:to-indigo-900 rounded border border-blue-200 dark:border-blue-700">
                      <h6 className="font-bold text-blue-800 dark:text-blue-200 mb-3">🧮 Détails du calcul tarifaire</h6>
                      
                      {/* Données d'entrée */}
                      <div className="mb-4">
                        <h7 className="font-semibold text-blue-700 dark:text-blue-300 text-sm">📋 Données d'entrée:</h7>
                        <div className="grid grid-cols-2 gap-2 text-xs mt-2">
                          <div className="flex justify-between">
                            <span>Poids:</span>
                            <span className="font-mono">{quoteData.shipment_details?.totalWeight || 0} kg</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Volume:</span>
                            <span className="font-mono">{Math.round((quoteData.shipment_details?.totalVolumeCm3 || 0) / 1000 * 100) / 100} L</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Distance:</span>
                            <span className="font-mono">{quoteData.shipment_details?.distance || 0} km</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Ville origine:</span>
                            <span className="font-mono capitalize">{quoteData.shipment_details?.originCity || 'N/A'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Ville destination:</span>
                            <span className="font-mono capitalize">{quoteData.shipment_details?.destinationCity || 'N/A'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Zone origine:</span>
                            <span className="font-mono capitalize">{quoteData.shipment_details?.originZone || 'N/A'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Zone destination:</span>
                            <span className="font-mono capitalize">{quoteData.shipment_details?.destinationZone || 'N/A'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Transporteur:</span>
                            <span className="font-mono">{quoteData.selected_carrier?.nom || 'N/A'}</span>
                          </div>
                        </div>
                      </div>

                      {/* Tarifs disponibles */}
                      <div className="mb-4">
                        <h7 className="font-semibold text-blue-700 dark:text-blue-300 text-sm">📊 Tarifs disponibles:</h7>
                        <div className="grid grid-cols-3 gap-2 text-xs mt-2">
                          <div className="flex justify-between">
                            <span>TarifPoids:</span>
                            <span className="font-mono">{quoteData.breakdown?.weightTariff > 0 ? '✓' : '✗'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>TarifVolum:</span>
                            <span className="font-mono">{quoteData.breakdown?.volumeTariff > 0 ? '✓' : '✗'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>TarifDistance:</span>
                            <span className="font-mono">{quoteData.breakdown?.distanceTariff > 0 ? '✓' : '✗'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>TarifCommune:</span>
                            <span className="font-mono">{quoteData.breakdown?.communeTariff > 0 ? '✓' : '✗'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>TarifZone:</span>
                            <span className="font-mono">{quoteData.breakdown?.zoneTariff > 0 ? '✓' : '✗'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>TarifVille:</span>
                            <span className="font-mono">{quoteData.breakdown?.cityTariff > 0 ? '✓' : '✗'}</span>
                          </div>
                        </div>
                      </div>

                      {/* Calcul détaillé */}
                      <div>
                        <h7 className="font-semibold text-blue-700 dark:text-blue-300 text-sm">🧮 Calcul détaillé:</h7>
                        <div className="space-y-1 text-xs mt-2 font-mono">
                          <div className="flex justify-between">
                            <span>Prix de base:</span>
                            <span>{formatPrice(quoteData.breakdown?.basePrice || 0)}</span>
                          </div>
                          {quoteData.breakdown?.weightTariff > 0 && (
                            <div className="flex justify-between text-green-600">
                              <span>+ Tarif poids:</span>
                              <span>+{formatPrice(quoteData.breakdown.weightTariff)}</span>
                            </div>
                          )}
                          {quoteData.breakdown?.volumeTariff > 0 && (
                            <div className="flex justify-between text-purple-600">
                              <span>+ Tarif volume:</span>
                              <span>+{formatPrice(quoteData.breakdown.volumeTariff)}</span>
                            </div>
                          )}
                          {quoteData.breakdown?.distanceTariff > 0 && (
                            <div className="flex justify-between text-orange-600">
                              <span>+ Tarif distance:</span>
                              <span>+{formatPrice(quoteData.breakdown.distanceTariff)}</span>
                            </div>
                          )}
                          {quoteData.breakdown?.cityTariff > 0 && (
                            <div className="flex justify-between text-blue-600">
                              <span>+ Tarif ville:</span>
                              <span>+{formatPrice(quoteData.breakdown.cityTariff)}</span>
                            </div>
                          )}
                          {quoteData.breakdown?.communeTariff > 0 && (
                            <div className="flex justify-between text-indigo-600">
                              <span>+ Tarif commune:</span>
                              <span>+{formatPrice(quoteData.breakdown.communeTariff)}</span>
                            </div>
                          )}
                          {quoteData.breakdown?.zoneTariff > 0 && (
                            <div className="flex justify-between text-yellow-600">
                              <span>+ Tarif zone:</span>
                              <span>+{formatPrice(quoteData.breakdown.zoneTariff)}</span>
                            </div>
                          )}
                          <div className="flex justify-between border-t pt-1 font-bold">
                            <span>= Total tarifs:</span>
                            <span>{formatPrice(quoteData.breakdown?.totalTariff || 0)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    {/* Étape 1: Prix de base */}
                    <div className="border-l-4 border-gray-400 pl-4">
                      <h5 className="font-medium text-gray-700 dark:text-gray-300">📋 1. Prix de base</h5>
                      <div className="flex justify-between text-sm mt-1">
                        <span>Prix de base (tariffService):</span>
                        <span className="font-medium">{formatPrice(quoteData.breakdown?.basePrice || 500)}</span>
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                        Prix de base calculé par le service de tarification
                      </p>
                    </div>

                    {/* Étape 2: Tarifs détaillés */}
                    {quoteData.breakdown?.totalTariff > 0 && (
                      <div className="border-l-4 border-blue-400 pl-4">
                        <h5 className="font-medium text-blue-700 dark:text-blue-300">🗺️ 2. Tarifs détaillés (tariffService)</h5>
                        <div className="space-y-1 text-sm">
                          {quoteData.breakdown?.weightTariff > 0 && (
                            <div className="flex justify-between">
                              <span>Tarif poids:</span>
                              <span className="font-medium">{formatPrice(quoteData.breakdown.weightTariff)}</span>
                            </div>
                          )}
                          {quoteData.breakdown?.volumeTariff > 0 && (
                            <div className="flex justify-between">
                              <span>Tarif volume:</span>
                              <span className="font-medium">{formatPrice(quoteData.breakdown.volumeTariff)}</span>
                            </div>
                          )}
                          {quoteData.breakdown?.distanceTariff > 0 && (
                            <div className="flex justify-between">
                              <span>Tarif distance:</span>
                              <span className="font-medium">{formatPrice(quoteData.breakdown.distanceTariff)}</span>
                            </div>
                          )}
                          {quoteData.breakdown?.zoneTariff > 0 && (
                            <div className="flex justify-between">
                              <span>Tarif zone:</span>
                              <span className="font-medium">{formatPrice(quoteData.breakdown.zoneTariff)}</span>
                            </div>
                          )}
                          {quoteData.breakdown?.cityTariff > 0 && (
                            <div className="flex justify-between">
                              <span>Tarif ville:</span>
                              <span className="font-medium">{formatPrice(quoteData.breakdown.cityTariff)}</span>
                            </div>
                          )}
                          {quoteData.breakdown?.communeTariff > 0 && (
                            <div className="flex justify-between">
                              <span>Tarif commune:</span>
                              <span className="font-medium">{formatPrice(quoteData.breakdown.communeTariff)}</span>
                            </div>
                          )}
                          <div className="flex justify-between font-medium border-t pt-1">
                            <span>Total tarifs:</span>
                            <span className="text-blue-600">{formatPrice(quoteData.breakdown.totalTariff)}</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Étape 3: Facteurs appliqués */}
                    {quoteData.breakdown?.factors && (
                      <div className="border-l-4 border-green-400 pl-4">
                        <h5 className="font-medium text-green-700 dark:text-green-300">🔧 3. Facteurs appliqués</h5>
                        <div className="space-y-1 text-sm">
                          {quoteData.breakdown.factors.zoneFactor && (
                            <div className="flex justify-between">
                              <span>Facteur zone:</span>
                              <span className="font-medium">×{quoteData.breakdown.factors.zoneFactor.toFixed(2)}</span>
                            </div>
                          )}
                          {quoteData.breakdown.factors.serviceFactor && (
                            <div className="flex justify-between">
                              <span>Facteur service:</span>
                              <span className="font-medium">×{quoteData.breakdown.factors.serviceFactor.toFixed(2)}</span>
                            </div>
                          )}
                          {quoteData.breakdown.factors.insuranceFactor && (
                            <div className="flex justify-between">
                              <span>Facteur assurance:</span>
                              <span className="font-medium">×{quoteData.breakdown.factors.insuranceFactor.toFixed(2)}</span>
                            </div>
                          )}
                          {quoteData.breakdown.factors.equipmentFactor && (
                            <div className="flex justify-between">
                              <span>Facteur équipement:</span>
                              <span className="font-medium">×{quoteData.breakdown.factors.equipmentFactor.toFixed(2)}</span>
                            </div>
                          )}
                          {quoteData.breakdown.factors.relayPointFee && (
                            <div className="flex justify-between">
                              <span>Frais point relais:</span>
                              <span className="font-medium">{formatPrice(quoteData.breakdown.factors.relayPointFee)}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Étape 3: Supplément poids (NOUVEAU SYSTÈME) */}
                    <div className="border-l-4 border-orange-400 pl-4 hidden">
                      <h5 className="font-medium text-orange-700 dark:text-orange-300">⚖️ 3. Supplément poids (nouveau barème)</h5>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span>Poids total colis:</span>
                          <span className="font-medium">{quoteData.shipment_details?.totalWeight || 0} kg</span>
                        </div>
                        
                        {/* Affichage détaillé selon le nouveau barème */}
                        {(quoteData.shipment_details?.totalWeight || 0) <= 4 ? (
                          <>
                            <div className="flex justify-between">
                              <span>Tranche 1-4kg:</span>
                              <span>{quoteData.shipment_details?.totalWeight || 0} kg × 50 FCFA/kg</span>
                            </div>
                            <div className="flex justify-between font-medium border-t pt-1">
                              <span>Supplément poids:</span>
                              <span className="text-orange-600">+{formatPrice((quoteData.shipment_details?.totalWeight || 0) * 50)}</span>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="flex justify-between">
                              <span>Tranche 1-4kg:</span>
                              <span>4 kg × 50 FCFA/kg = {formatPrice(4 * 50)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Tranche 5kg+:</span>
                              <span>{((quoteData.shipment_details?.totalWeight || 0) - 4)} kg × 30 FCFA/kg = {formatPrice(((quoteData.shipment_details?.totalWeight || 0) - 4) * 30)}</span>
                            </div>
                            <div className="flex justify-between font-medium border-t pt-1">
                              <span>Supplément poids total:</span>
                              <span className="text-orange-600">+{formatPrice((4 * 50) + (((quoteData.shipment_details?.totalWeight || 0) - 4) * 30))}</span>
                            </div>
                          </>
                        )}
                      </div>
                      <p className="text-xs text-orange-600 dark:text-orange-400 mt-1 bg-orange-50 dark:bg-orange-900/20 p-2 rounded">
                        <strong>NOUVEAU BARÈME 2024:</strong><br />
                        • 1-4kg : 50 FCFA/kg<br />
                        • 5kg et plus : 30 FCFA/kg
                      </p>
                    </div>

                    {/* Étape 4: Supplément volume (NOUVEAU SYSTÈME) */}
                    <div className="border-l-4 border-purple-400 pl-4 hidden">
                      <h5 className="font-medium text-purple-700 dark:text-purple-300">📦 4. Supplément volume (nouveau système)</h5>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span>Volume total:</span>
                          <span className="font-medium">{Math.round(quoteData.shipment_details?.totalVolumeCm3 || 0).toLocaleString(3)} cm³</span>
                        </div>
                        
                        {/* Nouveau système : premier cm³ à 25 FCFA, reste à 0,1 FCFA/cm³ */}
                        {(quoteData.details?.volume || 0) <= 1 ? (
                          <>
                            <div className="flex justify-between">
                              <span>Volume ≤ 1 cm³:</span>
                              <span>{Math.round(quoteData.shipment_details?.totalVolumeCm3 || 0).toLocaleString(3)} cm³ × 25 FCFA/cm³</span>
                            </div>
                            <div className="flex justify-between font-medium border-t pt-1">
                              <span>Supplément volume:</span>
                              <span className="text-purple-600">+{formatPrice(Math.round((quoteData.shipment_details?.totalVolumeCm3 || 0) * 0.1))}</span>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="flex justify-between">
                              <span>Premier cm³:</span>
                              <span>1 cm³ × 25 FCFA = {formatPrice(25)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Volume supplémentaire:</span>
                              <span>{Math.round((quoteData.details?.volume || 0) - 1).toLocaleString()} cm³ × 0,1 FCFA/cm³ = {formatPrice(Math.round(((quoteData.details?.volume || 0) - 1) * 0.1))}</span>
                            </div>
                            <div className="flex justify-between font-medium border-t pt-1">
                              <span>Total supplément volume:</span>
                              <span className="text-purple-600">+{formatPrice(25 + Math.round(((quoteData.details?.volume || 0) - 1) * 0.1))}</span>
                            </div>
                          </>
                        )}
                      </div>
                      <p className="text-xs text-purple-600 dark:text-purple-400 mt-1 bg-purple-50 dark:bg-purple-900/20 p-2 rounded">
                        <strong>🆕 NOUVEAU SYSTÈME 2024:</strong><br />
                        • Premier cm³ : 25 FCFA<br />
                        • Volume supplémentaire : 0,1 FCFA/cm³
                      </p>
                    </div>

                    {/* Étape 5: Supplément distance (NOUVEAU) */}
                    {quoteData.details?.distance > 0 && (
                      <div className="border-l-4 border-blue-400 pl-4">
                        <h5 className="font-medium text-blue-700 dark:text-blue-300">📍 5. Supplément distance (nouveau)</h5>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span>Distance totale:</span>
                            <span className="font-medium">{quoteData.details?.distance} km</span>
                          </div>
                          
                          {quoteData.details?.distance <= 10 ? (
                            <>
                              <div className="flex justify-between">
                                <span>Tranche 0-10km:</span>
                                <span>{quoteData.details?.distance} km × 50 FCFA/km</span>
                              </div>
                              <div className="flex justify-between font-medium border-t pt-1">
                                <span>Supplément distance:</span>
                                <span className="text-blue-600">+{formatPrice(quoteData.details?.distance * 50)}</span>
                              </div>
                            </>
                          ) : (
                            <>
                              <div className="flex justify-between">
                                <span>Tranche 0-10km:</span>
                                <span>10 km × 50 FCFA/km = {formatPrice(500)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Tranche &gt;10km:</span>
                                <span>{(quoteData.details?.distance - 10)} km × 10 FCFA/km = {formatPrice((quoteData.details?.distance - 10) * 10)}</span>
                              </div>
                              <div className="flex justify-between font-medium border-t pt-1">
                                <span>Total supplément distance:</span>
                                <span className="text-blue-600">+{formatPrice(500 + ((quoteData.details?.distance - 10) * 10))}</span>
                              </div>
                            </>
                          )}
                        </div>
                        <p className="text-xs text-blue-600 dark:text-blue-400 mt-1 bg-blue-50 dark:bg-blue-900/20 p-2 rounded">
                          <strong>🆕 TARIFICATION DISTANCE:</strong><br />
                          • 0-10km : 50 FCFA/km<br />
                          • &gt;10km : 10 FCFA/km
                        </p>
                      </div>
                    )}

                    {/* Étape 6: Assurance */}
                    {(expeditionData.isInsured || quoteData.pricing_breakdown.insurance_fee > 0) && (
                      <div className="border-l-4 border-green-400 pl-4">
                        <h5 className="font-medium text-green-700 dark:text-green-300">🛡️ 3. Assurance colis</h5>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span>Assurance demandée:</span>
                            <span className={expeditionData.isInsured ? "text-green-600 font-medium" : "text-gray-500"}>
                              {expeditionData.isInsured ? "✅ OUI" : "❌ NON"}
                            </span>
                          </div>
                          {expeditionData.isInsured && expeditionData.declared_value && (
                            <>
                              <div className="flex justify-between">
                                <span>Valeur déclarée:</span>
                                <span className="font-medium">{formatPrice(parseFloat(expeditionData.declared_value) || 0)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Taux d'assurance:</span>
                                <span>2% de la valeur déclarée</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Calcul assurance:</span>
                                <span className="text-xs">{formatPrice(parseFloat(expeditionData.declared_value) * 0.02)} FCFA</span>
                              </div>
                              <div className="flex justify-between font-medium border-t pt-1">
                                <span>Frais d'assurance:</span>
                                <span className="text-green-600">+{formatPrice(quoteData.pricing_breakdown?.insurance_fee || 0)}</span>
                              </div>
                            </>
                          )}
                          {!expeditionData.isInsured && (
                            <div className="text-xs text-gray-500 italic">
                              💡 Vous avez choisi de ne pas assurer votre colis. En cas de perte ou de dommage, aucune indemnisation ne sera possible.
                            </div>
                          )}
                        </div>
                        <div className="text-xs text-green-600 dark:text-green-400 mt-2 bg-green-50 dark:bg-green-900/20 p-2 rounded">
                          {expeditionData.isInsured ? (
                            <>
                              <p className="font-medium">✅ Votre colis est assuré !</p>
                              <p>Formule: max({formatPrice((parseFloat(expeditionData.declared_value) || 0) * 0.02)}, 0 FCFA)</p>
                              <p>• Couverture: perte totale ou dommages</p>
                              <p>• Remboursement: jusqu'à {formatPrice(parseFloat(expeditionData.declared_value) || 0)}</p>
                            </>
                          ) : (
                            <>
                              <p className="font-medium">⚠️ Votre colis n'est pas assuré</p>
                              <p>En cas de problème, aucune indemnisation ne sera versée.</p>
                            </>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Étape 7: Facteur de service */}
                    {quoteData.pricing_breakdown.service_factor !== 1.0 && (
                      <div className="border-l-4 border-cyan-400 pl-4">
                        <h5 className="font-medium text-cyan-700 dark:text-cyan-300">🚚 4. Facteur de service</h5>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span>Type de service:</span>
                            <span className="capitalize">{quoteData.shipment_details?.serviceType || 'standard'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Facteur multiplicateur:</span>
                            <span>{quoteData.pricing_breakdown.service_factor}x</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Sous-total avant facteur:</span>
                            <span>{formatPrice((quoteData.total_price || 0) / quoteData.pricing_breakdown.service_factor)}</span>
                          </div>
                        </div>
                        <p className="text-xs text-cyan-600 dark:text-cyan-400 mt-1">
                          {quoteData.shipment_details?.serviceType === 'express' && 'Service express (+50% pour livraison rapide)'}
                          {quoteData.shipment_details?.serviceType === 'economique' && 'Service économique (-20% pour livraison lente)'}
                          {quoteData.shipment_details?.serviceType === 'regional' && 'Service régional (-10% pour couverture étendue)'}
                          {quoteData.shipment_details?.serviceType === 'simplicite' && 'Service simplicité (+20% pour service basique)'}
                        </p>
                      </div>
                    )}

                    {/* Étape 8: Réductions et suppléments */}
                    {(quoteData.pricing_breakdown.relay_point_discount < 0 || quoteData.pricing_breakdown.weekend_supplement > 0) && (
                      <div className="border-l-4 border-yellow-400 pl-4">
                        <h5 className="font-medium text-yellow-700 dark:text-yellow-300">🎯 8. Ajustements spéciaux</h5>
                        <div className="space-y-1 text-sm">
                          {quoteData.pricing_breakdown.relay_point_discount < 0 && (
                            <div className="flex justify-between text-green-600 dark:text-green-400">
                              <span>🏪 Réduction point relais:</span>
                              <span>{formatPrice(quoteData.pricing_breakdown.relay_point_discount)}</span>
                            </div>
                          )}
                          
                          {quoteData.pricing_breakdown.weekend_supplement > 0 && (
                            <div className="flex justify-between text-orange-600 dark:text-orange-400">
                              <span>📅 Supplément weekend:</span>
                              <span>+{formatPrice(quoteData.pricing_breakdown.weekend_supplement)}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                    
                    {/* Résultat final */}
                    <div className="border-l-4 border-red-500 pl-4 bg-red-50 dark:bg-red-900/20 p-3 rounded-r-lg">
                      <h5 className="font-bold text-red-700 dark:text-red-300">💰 PRIX FINAL</h5>
                      <div className="flex justify-between items-center text-lg font-bold">
                        <span>Total à payer:</span>
                        <span className="text-red-600 dark:text-red-400">{formatPrice(quoteData.total_price || 5000)} {quoteData.currency || 'FCFA'}</span>
                      </div>
                      <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                        Prix minimum garanti: 500 FCFA
                      </p>
                    </div>
                    
                    {/* NOUVEAU : Confirmation de l'utilisation du tariffService */}
                    <div className="border-l-4 border-green-500 pl-4 bg-green-50 dark:bg-green-900/20 p-3 rounded-r-lg">
                      <h5 className="font-bold text-green-700 dark:text-green-300 mb-2">✅ CONFIRMATION TARIFFSERVICE</h5>
                      <div className="text-sm space-y-1">
                        <div className="flex justify-between">
                          <span>🔧 Service utilisé:</span>
                          <span className="font-mono text-green-600">tariffService.calculateTariff()</span>
                        </div>
                        <div className="flex justify-between">
                          <span>📊 Source des données:</span>
                          <span className="text-green-600">API Grilles Tarifaires</span>
                        </div>
                        <div className="flex justify-between">
                          <span>🚚 Transporteur:</span>
                          <span className="text-green-600">{quoteData?.selected_carrier?.nom || 'FastGo Express'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>🆔 Grille tarifaire:</span>
                          <span className="text-green-600">{quoteData?.details?.tariffGrid || 'Grille par défaut'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>⏱️ Calculé le:</span>
                          <span className="text-green-600">{quoteData?.calculated_at ? new Date(quoteData.calculated_at).toLocaleString('fr-FR') : 'Maintenant'}</span>
                        </div>
                      </div>
                      <div className="mt-2 p-2 bg-white dark:bg-gray-700 rounded border">
                        <p className="text-xs text-green-600 dark:text-green-400">
                          <strong>✅ TARIFSERVICE CONFIRMÉ :</strong> Ce devis a été calculé en utilisant le service de tarification Kartian 
                          avec les grilles tarifaires de l'API. Tous les calculs (poids, volume, distance, zones, facteurs) 
                          sont appliqués selon la logique du tariffService.
                        </p>
                      </div>
                    </div>
                    
                    {/* 🔍 SECTION DEBUG : Formule mathématique complète */}
                    <div className="hidden border-l-4 border-ksl-red pl-4 bg-purple-50 dark:bg-purple-900/20 p-3 rounded-r-lg">
                      <h5 className="font-bold text-purple-700 dark:text-purple-300 mb-2">🔍 Formule mathématique complète - Système Kartian 2024</h5>
                      <div className="text-xs font-mono text-purple-600 dark:text-purple-400 space-y-1">
                        <div className="bg-white dark:bg-gray-800 p-2 rounded border">
                          <p><strong>🆕 NOUVEAU SYSTÈME DE CALCUL 2024</strong></p>
                          <hr className="my-2" />
                          
                          <p><strong>Étape 1 :</strong> Prix de base = 500 FCFA (tarif uniforme Kartian)</p>
                          
                          <p><strong>Étape 2 :</strong> Majoration zone = 500 × {
                            quoteData.details?.destinationZone === 'zone1' ? '1.05 (+5%)' :
                            quoteData.details?.destinationZone === 'zone2' ? '1.10 (+10%)' :
                            quoteData.details?.destinationZone === 'zone3' ? '1.15 (+15%)' :
                            quoteData.details?.destinationZone === 'zone4' ? '1.20 (+20%)' : '1.25 (+25%)'
                          } = {formatPrice(Math.round(500 * (
                            quoteData.details?.destinationZone === 'zone1' ? 1.05 :
                            quoteData.details?.destinationZone === 'zone2' ? 1.10 :
                            quoteData.details?.destinationZone === 'zone3' ? 1.15 :
                            quoteData.details?.destinationZone === 'zone4' ? 1.20 : 1.25
                          )))} FCFA</p>
                          
                          <p><strong>Étape 3 :</strong> Poids = {
                            (quoteData.details?.weight || 0) <= 4 
                              ? `${quoteData.details?.weight || 0} kg × 50 FCFA/kg = ${formatPrice((quoteData.details?.weight || 0) * 50)} FCFA`
                              : `(4 kg × 50) + (${((quoteData.details?.weight || 0) - 4).toFixed(1)} kg × 30) = ${formatPrice(200 + Math.round(((quoteData.details?.weight || 0) - 4) * 30))} FCFA`
                          }</p>
                          
                          <p><strong>Étape 4 :</strong> Volume = {
                            (quoteData.details?.volume || 0) <= 1
                              ? `${(quoteData.details?.volume || 0).toFixed(3)} cm³ × 25 FCFA = ${formatPrice((quoteData.details?.volume || 0) * 25)} FCFA`
                              : `(1 cm³ × 25) + (${Math.round((quoteData.details?.volume || 0) - 1).toLocaleString()} cm³ × 0,1) = ${formatPrice(25 + Math.round(((quoteData.details?.volume || 0) - 1) * 0.1))} FCFA`
                          }</p>
                          
                          {quoteData.details?.distance > 0 && (
                            <p><strong>Étape 5 :</strong> Distance = {
                              quoteData.details?.distance <= 10
                                ? `${quoteData.details?.distance} km × 50 FCFA/km = ${formatPrice(quoteData.details?.distance * 50)} FCFA`
                                : `(10 km × 50) + (${quoteData.details?.distance - 10} km × 10) = ${formatPrice(500 + ((quoteData.details?.distance - 10) * 10))} FCFA`
                            }</p>
                          )}
                          
                          {expeditionData.isInsured && expeditionData.declared_value && (
                            <p><strong>Étape 6 :</strong> Assurance = {formatPrice(parseFloat(expeditionData.declared_value))} × 2% = {formatPrice(Math.round((parseFloat(expeditionData.declared_value) || 0) * 0.02))} FCFA</p>
                          )}
                          
                          {quoteData.details?.relayDiscount && (
                            <p><strong>Réduction point relais :</strong> {formatPrice(quoteData.details?.relayDiscount)} FCFA (-5% dépôt + -5% retrait)</p>
                          )}
                          
                          {quoteData.details?.holidaySupplement > 0 && (
                            <p><strong>Supplément weekend/férié :</strong> +{formatPrice(quoteData.details?.holidaySupplement)} FCFA</p>
                          )}
                          
                          <hr className="my-2" />
                          <p className="font-bold text-purple-800 dark:text-purple-200 text-base">
                            <strong>🎯 TOTAL FINAL KARTIAN :</strong> <span className="text-lg text-red-600">{formatPrice(quoteData.finalPrice)} FCFA</span>
                          </p>
                          
                          <div className="mt-2 text-xs text-green-600 dark:text-green-400">
                            <p>✅ Prix minimum garanti : 500 FCFA</p>
                            <p>✅ Système de tarification 2024 appliqué</p>
                            <p>✅ Calcul transparent et détaillé</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Informations sur la livraison */}
              {quoteData.estimated_delivery && (
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-900 dark:text-blue-200 mb-2 flex items-center">
                    <Clock className="w-4 h-4 mr-2" />
                    Informations de livraison
                  </h4>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm text-blue-800 dark:text-blue-300">
                    <div>
                      <div className="flex justify-between">
                        <span>Délai estimé:</span>
                        <span className="font-medium">{quoteData.estimated_delivery.deliveryWindow}</span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span>Date de livraison:</span>
                        <span className="font-medium">{quoteData.estimated_delivery.estimatedDate}</span>
                      </div>
                    </div>
                    
                    <div>
                      {quoteData.shipment_details?.isRelayPoint && (
                        <div className="flex items-center space-x-1">
                          <Target className="w-4 h-4" />
                          <span>🏪 Livraison en point relais</span>
                        </div>
                      )}
                      
                      {quoteData.shipment_details?.isInsured && (
                        <div className="flex items-center space-x-1">
                          <span>🛡️ Colis assuré pour {formatPrice(parseFloat(expeditionData.declared_value) || 0)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              <Alert variant="info">
                <Info className="w-4 h-4" />
                <p className="text-sm">
                  Ce devis est valable pendant 15 minutes. 
                  {quoteData.shipment_details?.serviceType === 'express' && 
                    ' Service express sélectionné pour une livraison rapide.'
                  }
                  {quoteData.shipment_details?.serviceType === 'regional' && 
                    ' Service régional sélectionné pour une couverture étendue.'
                  }
                  {quoteData.shipment_details?.serviceType === 'simplicite' && 
                    ' Service simplicité sélectionné pour un service basique.'
                  }
                  <br />
                  <strong>Calculé le:</strong> {new Date(quoteData.calculated_at).toLocaleString('fr-FR')}
                </p>
              </Alert>

              <div className="flex space-x-3">
                <Button 
                  variant="outline" 
                  onClick={() => setShowQuoteModal(false)}
                  className="flex-1"
                >
                  Modifier
                </Button>
                
                <Button 
                  onClick={handleAcceptQuote}
                  className="flex-1 bg-ksl-red hover:bg-red-700"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Accepter le devis
                </Button>
              </div>
            </div>
          )}
        </div>
      </Modal>


      {/* 💳 NOUVEAU MODAL DE PAIEMENT */}
      <Modal isOpen={showPaymentModal} onClose={() => setShowPaymentModal(false)}>
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            💳 Choisir le mode de paiement
          </h3>
          
          {/* Résumé de la commande */}
          {pendingExpeditionData && (
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg mb-6">
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                Résumé de la commande
              </h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Numéro de commande:</span>
                  <span className="font-mono text-xs">{pendingExpeditionData.order_number}</span>
                </div>
                <div className="flex justify-between">
                  <span>De:</span>
                  <span className="text-right text-xs">{pendingExpeditionData.adresse_expediteur.address}</span>
                </div>
                <div className="flex justify-between">
                  <span>Vers:</span>
                  <span className="text-right text-xs">{pendingExpeditionData.adresse_destinataire.address}</span>
                </div>
                <div className="flex justify-between font-bold text-base border-t pt-2 mt-2">
                  <span>Montant:</span>
                  <span className="text-ksl-red">{formatPrice(pendingExpeditionData.montant)}</span>
                </div>
              </div>
            </div>
          )}

          {/* Sélection du mode de paiement */}
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900 dark:text-white">
              Sélectionnez votre mode de paiement
            </h4>
            
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
              <div className="space-y-3">
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
                        selectedPaymentMethod?.id === method.id
                          ? 'border-ksl-red bg-ksl-red'
                          : 'border-gray-300 dark:border-gray-600'
                      )}>
                        {selectedPaymentMethod?.id === method.id && (
                          <div className="w-full h-full rounded-full bg-white scale-50" />
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <CreditCard className="w-5 h-5 text-ksl-red" />
                          <span className="font-medium text-gray-900 dark:text-white">
                            {method.nomMethode}
                          </span>
                          {method.fournisseur && (
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              ({method.fournisseur})
                            </span>
                          )}
                        </div>
                        
                        {method.description && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {method.description}
                          </p>
                        )}
                        
                        {method.montant_min && method.montant_max && (
                          <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                            Montant: {formatPrice(parseFloat(method.montant_min))} - {formatPrice(parseFloat(method.montant_max))}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Boutons d'action */}
          <div className="flex space-x-3 mt-6">
            <Button 
              variant="outline" 
              onClick={() => setShowPaymentModal(false)}
              className="flex-1"
              disabled={isProcessingPayment}
            >
              Retour
            </Button>
            
            <Button 
              onClick={handlePaymentValidation}
              className="flex-1"
              disabled={!selectedPaymentMethod || isProcessingPayment}
              isLoading={isProcessingPayment}
            >
              <CreditCard className="w-4 h-4 mr-2" />
              {isProcessingPayment ? 'Traitement...' : 'Valider le paiement'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* [5] Ajouter le modal pour saisir le nombre d'étiquettes */}
      <Modal isOpen={showPrintLabelModal} onClose={() => setShowPrintLabelModal(false)}>
        <div className="p-6 max-w-md">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Imprimer l'étiquette d'expédition
          </h3>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Nombre d'étiquettes à générer
            </label>
            <input
              type="number"
              min={1}
              max={20}
              value={labelCount}
              onChange={e => setLabelCount(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-dark-bg-secondary text-gray-900 dark:text-white focus:ring-2 focus:ring-ksl-red focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">Chaque étiquette sera sur une page A6 distincte dans le PDF.</p>
          </div>
          <div className="flex gap-3 mt-6">
            <Button
              variant="outline"
              onClick={() => setShowPrintLabelModal(false)}
              className="flex-1"
              disabled={isPrintingLabel}
            >
              Annuler
            </Button>
            <Button
              onClick={handlePrintLabel}
              className="flex-1 bg-ksl-red hover:bg-red-700"
              isLoading={isPrintingLabel}
              disabled={isPrintingLabel}
            >
              Générer le PDF
            </Button>
          </div>
        </div>
      </Modal>
      {/* Modal de confirmation d'impression */}
      {askPrintLabel && (
        <Modal
          open={askPrintLabel}
          onClose={() => setAskPrintLabel(false)}
          title="Imprimer une étiquette ?"
          description="Voulez-vous imprimer une ou plusieurs étiquettes pour cette expédition ?"
          actions={[
            <Button key="no" variant="outline" onClick={() => setAskPrintLabel(false)}>Non</Button>,
            <Button key="yes" onClick={() => { setAskPrintLabel(false); setShowPrintLabelModal(true); }}>Oui</Button>
          ]}
        />
      )}
      {/* Modal de choix du nombre d'étiquettes et impression */}
      {showPrintLabelModal && (
        <Modal
          open={showPrintLabelModal}
          onClose={() => setShowPrintLabelModal(false)}
          title="Nombre d'étiquettes à imprimer"
          description="Indiquez le nombre d'étiquettes à imprimer pour cette expédition."
          actions={[
            <Button key="cancel" variant="outline" onClick={() => setShowPrintLabelModal(false)}>Annuler</Button>,
            <Button key="print" loading={isPrintingLabel} onClick={handlePrintLabel}>Imprimer</Button>
          ]}
        >
          <Input
            type="number"
            min={1}
            value={labelCount}
            onChange={e => setLabelCount(Number(e.target.value))}
            className="mt-2"
          />
        </Modal>
      )}
    </div>
  );
};

export default ClientSendParcel;