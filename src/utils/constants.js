// ==========================================
// CONSTANTES GLOBALES - KARTIAN SMART LOGISTIC
// ==========================================

/**
 * Configuration de l'application
 */
export const APP_CONFIG = {
    NAME: 'Kartian Smart Logistic',
    SHORT_NAME: 'KSL',
    VERSION: '1.0.0',
    API_TIMEOUT: 15000, // 15 secondes
    REFRESH_INTERVAL: 30000, // 30 secondes
    NOTIFICATION_DURATION: 4000, // 4 secondes
  };
  
  /**
   * Charte graphique KSL
   */

  export const COLORS = {
    PRIMARY: '#D32F2F',
    PRIMARY_DARK: '#B71C1C',
    PRIMARY_LIGHT: '#EF5350',
    WHITE: '#FFFFFF',
    BLACK: '#000000',
    GRAY: '#757575',
    GRAY_LIGHT: '#BDBDBD',
    GRAY_DARK: '#424242',
    
    // États
    SUCCESS: '#10B981',
    WARNING: '#F59E0B',
    ERROR: '#EF4444',
    INFO: '#3B82F6',
    
    // Mode sombre
    DARK_BG: '#1a1a1a',
    DARK_BG_SECONDARY: '#2d2d2d',
    DARK_BG_TERTIARY: '#404040',
    DARK_TEXT: '#e5e5e5',
    DARK_TEXT_SECONDARY: '#b3b3b3',
  };
  
  /**
   * Rôles des utilisateurs
   */

  export const USER_ROLES = {
    ADMIN: 'admin',
    RELAY_POINT: 'relay_point' || 'agent',
    CLIENT: 'client',
    ENTREPRISE: 'entreprise',
  };
  
  export const USER_ROLE_LABELS = {
    [USER_ROLES.ADMIN]: 'Administrateur',
    [USER_ROLES.RELAY_POINT]: 'Point Relais',
    [USER_ROLES.CLIENT]: 'Client',
    [USER_ROLES.ENTREPRISE]: 'Entreprise',
  };
  
  /**
   * Statuts des utilisateurs
   */

  export const USER_STATUSES = {
    ACTIVE: 'active',
    SUSPENDED: 'suspended',
    PENDING: 'pending',
  };
  
  export const USER_STATUS_LABELS = {
    [USER_STATUSES.ACTIVE]: 'Actif',
    [USER_STATUSES.SUSPENDED]: 'Suspendu',
    [USER_STATUSES.PENDING]: 'En attente',
  };
  
  /**
   * Statuts des colis
   */
  export const PARCEL_STATUSES = {
    PENDING: 'pending',
    IN_TRANSIT: 'in_transit',
    DELIVERED: 'delivered',
    RETURNED: 'returned',
    LOST: 'lost',
    CANCELLED: 'cancelled',
  };
  
  export const PARCEL_STATUS_LABELS = {
    [PARCEL_STATUSES.PENDING]: 'En attente',
    [PARCEL_STATUSES.IN_TRANSIT]: 'En transit',
    [PARCEL_STATUSES.DELIVERED]: 'Livré',
    [PARCEL_STATUSES.RETURNED]: 'Retourné',
    [PARCEL_STATUSES.LOST]: 'Perdu',
    [PARCEL_STATUSES.CANCELLED]: 'Annulé',
  };
  
  /**
   * Types de colis
   */

  export const PARCEL_TYPES = {
    STANDARD: 'standard',
    EXPRESS: 'express',
    FRAGILE: 'fragile',
    COLD: 'cold',
    SECURE: 'secure',
    DANGEROUS: 'dangerous',
  };
  
  export const PARCEL_TYPE_LABELS = {
    [PARCEL_TYPES.STANDARD]: 'Standard',
    [PARCEL_TYPES.EXPRESS]: 'Express',
    [PARCEL_TYPES.FRAGILE]: 'Fragile',
    [PARCEL_TYPES.COLD]: 'Réfrigéré',
    [PARCEL_TYPES.SECURE]: 'Sécurisé',
    [PARCEL_TYPES.DANGEROUS]: 'Matière dangereuse',
  };
  
  /**
   * Transporteurs disponibles
   */

  export const CARRIERS = {
    DHL: 'DHL',
    UPS: 'UPS',
    FEDEX: 'FedEx',
    LA_POSTE_CI: 'La Poste CI',
    KOIRA: 'Koira',
    JUMIA_LOGISTICS: 'Jumia Logistics',
    KAMTAR: 'Kamtar',
    GOZEM: 'Gozem',
    YANGO: 'Yango',
    COLIBA: 'Coliba',
    KARTIAN: 'Kartian',
  };
  
  /**
   * Méthodes de paiement
   */
  export const PAYMENT_METHODS = {
    // Mobile Money
    ORANGE_MONEY: 'orange_money',
    MTN_MONEY: 'mtn_money',
    MOOV_MONEY: 'moov_money',
    WAVE: 'wave',
    
    // Autres
    CASH: 'cash',
    BANK_TRANSFER: 'bank_transfer',
    CREDIT_CARD: 'credit_card',
    COD: 'cash_on_delivery',
  };
  
  export const PAYMENT_METHOD_LABELS = {
    [PAYMENT_METHODS.ORANGE_MONEY]: 'Orange Money',
    [PAYMENT_METHODS.MTN_MONEY]: 'MTN Money',
    [PAYMENT_METHODS.MOOV_MONEY]: 'Moov Money',
    [PAYMENT_METHODS.WAVE]: 'Wave',
    [PAYMENT_METHODS.CASH]: 'Espèces',
    [PAYMENT_METHODS.BANK_TRANSFER]: 'Virement bancaire',
    [PAYMENT_METHODS.CREDIT_CARD]: 'Carte bancaire',
    [PAYMENT_METHODS.COD]: 'Paiement à la livraison',
  };
  
  /**
   * Statuts de paiement
   */
  export const PAYMENT_STATUSES = {
    PENDING: 'pending',
    PROCESSING: 'processing',
    SUCCESS: 'success',
    FAILED: 'failed',
    REFUNDED: 'refunded',
  };
  
  export const PAYMENT_STATUS_LABELS = {
    [PAYMENT_STATUSES.PENDING]: 'En attente',
    [PAYMENT_STATUSES.PROCESSING]: 'En cours',
    [PAYMENT_STATUSES.SUCCESS]: 'Réussi',
    [PAYMENT_STATUSES.FAILED]: 'Échoué',
    [PAYMENT_STATUSES.REFUNDED]: 'Remboursé',
  };
  
  /**
   * Formats d'étiquettes
   */
  export const LABEL_FORMATS = {
    PDF: 'PDF',
    ZPL: 'ZPL',
    PNG: 'PNG',
    JPG: 'JPG',
  };
  
  /**
   * Tailles d'étiquettes
   */
  export const LABEL_SIZES = {
    A6: 'A6',
    A5: 'A5',
    A4: 'A4',
    CUSTOM: 'custom',
  };
  
  /**
   * Pays supportés
   */
  export const COUNTRIES = {
    CI: { code: 'CI', name: 'Côte d\'Ivoire', flag: '🇨🇮' },
    GH: { code: 'GH', name: 'Ghana', flag: '🇬🇭' },
    BF: { code: 'BF', name: 'Burkina Faso', flag: '🇧🇫' },
    ML: { code: 'ML', name: 'Mali', flag: '🇲🇱' },
    SN: { code: 'SN', name: 'Sénégal', flag: '🇸🇳' },
    NG: { code: 'NG', name: 'Nigeria', flag: '🇳🇬' },
  };
  
// 🇨🇮 VILLES DE CÔTE D'IVOIRE - VERSION CORRIGÉE SANS DOUBLONS

/**
 * Liste simplifiée des villes principales pour les selects (CORRECTE)
 */
export const MAIN_CITIES_CI = [
  // 🏙️ DISTRICT AUTONOME D'ABIDJAN
  { value: 'abidjan', label: 'Abidjan', region: 'District Autonome d\'Abidjan' },
  
  // 🏛️ DISTRICT AUTONOME DE YAMOUSSOUKRO
  { value: 'yamoussoukro', label: 'Yamoussoukro', region: 'District Autonome de Yamoussoukro' },
  
  // 🌊 RÉGION LAGUNES
  { value: 'agboville', label: 'Agboville', region: 'Lagunes' },
  { value: 'adzope', label: 'Adzopé', region: 'Lagunes' },
  { value: 'alepe', label: 'Alépé', region: 'Lagunes' },
  { value: 'dabou', label: 'Dabou', region: 'Lagunes' },
  { value: 'grand_lahou', label: 'Grand-Lahou', region: 'Lagunes' },
  { value: 'jacqueville', label: 'Jacqueville', region: 'Lagunes' },
  { value: 'sikensi', label: 'Sikensi', region: 'Lagunes' },
  { value: 'tiassale', label: 'Tiassalé', region: 'Lagunes' },
  
  // 🌲 RÉGION HAUT-SASSANDRA
  { value: 'daloa', label: 'Daloa', region: 'Haut-Sassandra' },
  { value: 'issia', label: 'Issia', region: 'Haut-Sassandra' },
  { value: 'vavoua', label: 'Vavoua', region: 'Haut-Sassandra' },
  { value: 'zuenoula', label: 'Zuénoula', region: 'Haut-Sassandra' },
  
  // 🌾 RÉGION SAVANES
  { value: 'boundiali', label: 'Boundiali', region: 'Savanes' },
  { value: 'ferkessedougou', label: 'Ferkessédougou', region: 'Savanes' },
  { value: 'korhogo', label: 'Korhogo', region: 'Savanes' },
  { value: 'ouangolodougou', label: 'Ouangolodougou', region: 'Savanes' },
  { value: 'sinematiali', label: 'Sinématiali', region: 'Savanes' },
  { value: 'tengrela', label: 'Tengréla', region: 'Savanes' },
  
  // 🏘️ RÉGION VALLÉE DU BANDAMA
  { value: 'bouake', label: 'Bouaké', region: 'Vallée du Bandama' },
  { value: 'beoumi', label: 'Béoumi', region: 'Vallée du Bandama' },
  { value: 'bodokro', label: 'Bodokro', region: 'Vallée du Bandama' },
  { value: 'katiola', label: 'Katiola', region: 'Vallée du Bandama' },
  { value: 'sakassou', label: 'Sakassou', region: 'Vallée du Bandama' },
  
  // 🌳 RÉGION MOYEN-COMOÉ
  { value: 'abengourou', label: 'Abengourou', region: 'Moyen-Comoé' },
  { value: 'agnibilekrou', label: 'Agnibilékrou', region: 'Moyen-Comoé' },
  { value: 'bettie', label: 'Bettié', region: 'Moyen-Comoé' },
  
  // 🏞️ RÉGION MOYEN-CAVALLY
  { value: 'bangolo', label: 'Bangolo', region: 'Moyen-Cavally' },
  { value: 'blolequin', label: 'Blolequin', region: 'Moyen-Cavally' },
  { value: 'duekue', label: 'Duékoué', region: 'Moyen-Cavally' },
  { value: 'guiglo', label: 'Guiglo', region: 'Moyen-Cavally' },
  { value: 'tai', label: 'Taï', region: 'Moyen-Cavally' },
  { value: 'toulepleu', label: 'Toulepleu', region: 'Moyen-Cavally' },
  
  // 🌿 RÉGION GÔH-DJIBOUA
  { value: 'divo', label: 'Divo', region: 'Gôh-Djiboua' },
  { value: 'fresco', label: 'Fresco', region: 'Gôh-Djiboua' },
  { value: 'gagnoa', label: 'Gagnoa', region: 'Gôh-Djiboua' },
  { value: 'guitry', label: 'Guitry', region: 'Gôh-Djiboua' },
  { value: 'hire', label: 'Hiré', region: 'Gôh-Djiboua' },
  { value: 'lakota', label: 'Lakota', region: 'Gôh-Djiboua' },
  { value: 'oume', label: 'Oumé', region: 'Gôh-Djiboua' },
  
  // 🌴 RÉGION LÔH-DJIBOUA
  { value: 'didievi', label: 'Didiévi', region: 'Lôh-Djiboua' },
  { value: 'tiebissou', label: 'Tiébissou', region: 'Lôh-Djiboua' },
  { value: 'toumodi', label: 'Toumodi', region: 'Lôh-Djiboua' },
  
  // 🏛️ RÉGION AGNÉBY-TIASSA
  { value: 'agboville_at', label: 'Agboville', region: 'Agnéby-Tiassa' },
  { value: 'sikensi_at', label: 'Sikensi', region: 'Agnéby-Tiassa' },
  { value: 'taabo', label: 'Taabo', region: 'Agnéby-Tiassa' },
  { value: 'tiassale_at', label: 'Tiassalé', region: 'Agnéby-Tiassa' },
  
  // 🌾 RÉGION MARAHOUÉ
  { value: 'bouafle', label: 'Bouaflé', region: 'Marahoué' },
  { value: 'sinfra', label: 'Sinfra', region: 'Marahoué' },
  { value: 'zuenoula_m', label: 'Zuénoula', region: 'Marahoué' },
  
  // 🏘️ RÉGION HAMBOL
  { value: 'katiola_h', label: 'Katiola', region: 'Hambol' },
  { value: 'niakara', label: 'Niakara', region: 'Hambol' },
  { value: 'niakaramandougou', label: 'Niakaramandougou', region: 'Hambol' },
  
  // 🌾 RÉGION TCHOLOGO
  { value: 'ferke', label: 'Ferkessédougou', region: 'Tchologo' },
  { value: 'kong', label: 'Kong', region: 'Tchologo' },
  { value: 'ouangolo', label: 'Ouangolodougou', region: 'Tchologo' },
  
  // 🏘️ RÉGION PORO
  { value: 'korhogo_p', label: 'Korhogo', region: 'Poro' },
  { value: 'mbengue', label: 'M\'Bengué', region: 'Poro' },
  { value: 'sinema', label: 'Sinématiali', region: 'Poro' },
  
  // 🌾 RÉGION KABADOUGOU
  { value: 'gbeleban', label: 'Gbéléban', region: 'Kabadougou' },
  { value: 'madinani', label: 'Madinani', region: 'Kabadougou' },
  { value: 'odienne', label: 'Odienné', region: 'Kabadougou' },
  { value: 'samatiguila', label: 'Samatiguila', region: 'Kabadougou' },
  { value: 'seguelas', label: 'Séguéla', region: 'Kabadougou' },
  
  // 🏔️ RÉGION BAFING
  { value: 'koro', label: 'Koro', region: 'Bafing' },
  { value: 'ouaninou', label: 'Ouaninou', region: 'Bafing' },
  { value: 'touba', label: 'Touba', region: 'Bafing' },
  
  // 🌾 RÉGION WORODOUGOU
  { value: 'kani', label: 'Kani', region: 'Worodougou' },
  { value: 'mankono', label: 'Mankono', region: 'Worodougou' },
  { value: 'seguela', label: 'Séguéla', region: 'Worodougou' },
  
  // 🌿 RÉGION BÉRÉ
  { value: 'mankono_b', label: 'Mankono', region: 'Béré' },
  
  // 🏛️ RÉGION BÉLIER
  { value: 'attiegouakro', label: 'Attiégouakro', region: 'Bélier' },
  { value: 'toumodi_b', label: 'Toumodi', region: 'Bélier' },
  { value: 'yamoussoukro_b', label: 'Yamoussoukro', region: 'Bélier' },
  
  // 🌳 RÉGION IFFOU
  { value: 'daoukro', label: 'Daoukro', region: 'Iffou' },
  { value: 'mbahiakro', label: 'M\'Bahiakro', region: 'Iffou' },
  { value: 'prikro', label: 'Prikro', region: 'Iffou' },
  
  // 🏘️ RÉGION N'ZI
  { value: 'bocanda', label: 'Bocanda', region: 'N\'Zi' },
  { value: 'dimbokro', label: 'Dimbokro', region: 'N\'Zi' },
  { value: 'kouassi_kouassikro', label: 'Kouassi-Kouassikro', region: 'N\'Zi' },
  
  // 🌳 RÉGION MORONOU
  { value: 'arrah', label: 'Arrah', region: 'Moronou' },
  { value: 'bongouanou', label: 'Bongouanou', region: 'Moronou' },
  { value: 'mbatto', label: 'M\'Batto', region: 'Moronou' },
  
  // 🌴 RÉGION INDÉNIÉ-DJUABLIN
  { value: 'abengourou_id', label: 'Abengourou', region: 'Indénié-Djuablin' },
  { value: 'agnibilekrou_id', label: 'Agnibilékrou', region: 'Indénié-Djuablin' },
  { value: 'bettie_id', label: 'Bettié', region: 'Indénié-Djuablin' },
  { value: 'zaranou', label: 'Zaranou', region: 'Indénié-Djuablin' },
  
  // 🏖️ RÉGION SUD-COMOÉ
  { value: 'aboisso', label: 'Aboisso', region: 'Sud-Comoé' },
  { value: 'adiake', label: 'Adiaké', region: 'Sud-Comoé' },
  { value: 'grand_bassam', label: 'Grand-Bassam', region: 'Sud-Comoé' },
  { value: 'tiapoum', label: 'Tiapoum', region: 'Sud-Comoé' },
  
  // 🏔️ RÉGION TONKPI
  { value: 'biankouma', label: 'Biankouma', region: 'Tonkpi' },
  { value: 'danane', label: 'Danané', region: 'Tonkpi' },
  { value: 'man', label: 'Man', region: 'Tonkpi' },
  { value: 'sipilou', label: 'Sipilou', region: 'Tonkpi' },
  { value: 'zouan_hounien', label: 'Zouan-Hounien', region: 'Tonkpi' },
  
  // 🌊 RÉGION SAN-PÉDRO
  { value: 'grand_bereby', label: 'Grand-Béréby', region: 'San-Pédro' },
  { value: 'san_pedro', label: 'San-Pédro', region: 'San-Pédro' },
  { value: 'sassandra', label: 'Sassandra', region: 'San-Pédro' },
  { value: 'soubre', label: 'Soubré', region: 'San-Pédro' },
  { value: 'tabou', label: 'Tabou', region: 'San-Pédro' },
  
  // 🌊 RÉGION GBÔKLÉ
  { value: 'fresco_g', label: 'Fresco', region: 'Gbôklé' },
  { value: 'grand_zattry', label: 'Grand-Zattry', region: 'Gbôklé' },
  { value: 'sassandra_g', label: 'Sassandra', region: 'Gbôklé' },
  
  // 🌿 RÉGION NAWA
  { value: 'buyo', label: 'Buyo', region: 'Nawa' },
  { value: 'meagui', label: 'Méagui', region: 'Nawa' },
  { value: 'oupoyo', label: 'Oupoyo', region: 'Nawa' },
  { value: 'soubre_n', label: 'Soubré', region: 'Nawa' },
  
  // 🌾 RÉGION BOUNKANI
  { value: 'bouna', label: 'Bouna', region: 'Bounkani' },
  { value: 'doropo', label: 'Doropo', region: 'Bounkani' },
  { value: 'nassian', label: 'Nassian', region: 'Bounkani' },
  { value: 'tehini', label: 'Téhini', region: 'Bounkani' },
  
  // 🌾 RÉGION GONTOUGO
  { value: 'bondoukou', label: 'Bondoukou', region: 'Gontougo' },
  { value: 'sandegue', label: 'Sandégué', region: 'Gontougo' },
  { value: 'tanda', label: 'Tanda', region: 'Gontougo' },
  { value: 'transua', label: 'Transua', region: 'Gontougo' },
];

/**
 * Communes d'Abidjan (pour le select spécialisé)
 */
export const ABIDJAN_COMMUNES = [
  { value: 'abobo', label: 'Abobo' },
  { value: 'adjame', label: 'Adjamé' },
  { value: 'anyama', label: 'Anyama' },
  { value: 'attecoube', label: 'Attécoubé' },
  { value: 'bingerville', label: 'Bingerville' },
  { value: 'cocody', label: 'Cocody' },
  { value: 'koumassi', label: 'Koumassi' },
  { value: 'marcory', label: 'Marcory' },
  { value: 'plateau', label: 'Plateau' },
  { value: 'port_bouet', label: 'Port-Bouët' },
  { value: 'songon', label: 'Songon' },
  { value: 'treichville', label: 'Treichville' },
  { value: 'yopougon', label: 'Yopougon' }
];

/**
 * Villes les plus populaires (pour un accès rapide)
 */
export const POPULAR_CITIES_CI = [
  'abidjan',
  'yamoussoukro', 
  'bouake',
  'daloa',
  'korhogo',
  'san_pedro',
  'man',
  'gagnoa',
  'abengourou',
  'divo',
  'guiglo',
  'agboville',
  'grand_bassam',
  'dabou',
  'soubre',
  'issia',
  'bongouanou',
  'odienne',
  'boundiali',
  'seguela'
];

/**
 * Régions de Côte d'Ivoire (officielles)
 */
export const REGIONS_CI = [
  'District Autonome d\'Abidjan',
  'District Autonome de Yamoussoukro',
  'Lagunes',
  'Haut-Sassandra',
  'Savanes',
  'Vallée du Bandama',
  'Moyen-Comoé',
  'Moyen-Cavally',
  'Gôh-Djiboua',
  'Lôh-Djiboua',
  'Agnéby-Tiassa',
  'Marahoué',
  'Hambol',
  'Tchologo',
  'Poro',
  'Kabadougou',
  'Bafing',
  'Worodougou',
  'Béré',
  'Bélier',
  'Iffou',
  'N\'Zi',
  'Moronou',
  'Indénié-Djuablin',
  'Sud-Comoé',
  'Tonkpi',
  'San-Pédro',
  'Gbôklé',
  'Nawa',
  'Bounkani',
  'Gontougo'
];

/**
 * 🔍 FONCTION DE RECHERCHE VILLE
 */
export const searchCities = (query) => {
  if (!query || query.length < 2) return [];
  
  const lowerQuery = query.toLowerCase();
  
  return MAIN_CITIES_CI.filter(city => 
    city.label.toLowerCase().includes(lowerQuery) ||
    city.region.toLowerCase().includes(lowerQuery) ||
    city.value.toLowerCase().includes(lowerQuery)
  ).slice(0, 15); // Limiter à 15 résultats
};

/**
 * 🗺️ FONCTION POUR GROUPER PAR RÉGION
 */
export const getCitiesByRegion = () => {
  const regions = {};
  
  MAIN_CITIES_CI.forEach(city => {
    if (!regions[city.region]) {
      regions[city.region] = [];
    }
    regions[city.region].push(city);
  });
  
  return regions;
};

/**
 * 🔍 OBTENIR UNE VILLE PAR VALUE
 */
export const getCityByValue = (value) => {
  return MAIN_CITIES_CI.find(city => city.value === value);
};

/**
 * 🔍 OBTENIR UNE COMMUNE D'ABIDJAN PAR VALUE
 */
export const getCommuneByValue = (value) => {
  return ABIDJAN_COMMUNES.find(commune => commune.value === value);
};
  /**
   * Types d'alertes/notifications
   */
  export const NOTIFICATION_TYPES = {
    INFO: 'info',
    SUCCESS: 'success',
    WARNING: 'warning',
    ERROR: 'error',
    PARCEL_UPDATE: 'parcel_update',
    PAYMENT_UPDATE: 'payment_update',
    SYSTEM_ALERT: 'system_alert',
  };
  
  /**
   * Priorités des tickets de support
   */
  
  export const TICKET_PRIORITIES = {
    LOW: 'low',
    NORMAL: 'normal',
    HIGH: 'high',
    URGENT: 'urgent',
    CRITICAL: 'critical',
  };
  
  export const TICKET_PRIORITY_LABELS = {
    [TICKET_PRIORITIES.LOW]: 'Faible',
    [TICKET_PRIORITIES.NORMAL]: 'Normal',
    [TICKET_PRIORITIES.HIGH]: 'Élevé',
    [TICKET_PRIORITIES.URGENT]: 'Urgent',
    [TICKET_PRIORITIES.CRITICAL]: 'Critique',
  };
  
  /**
   * Statuts des tickets de support
   */
  export const TICKET_STATUSES = {
    OPEN: 'open',
    IN_PROGRESS: 'in_progress',
    WAITING: 'waiting_for_customer',
    RESOLVED: 'resolved',
    CLOSED: 'closed',
  };
  
  export const TICKET_STATUS_LABELS = {
    [TICKET_STATUSES.OPEN]: 'Ouvert',
    [TICKET_STATUSES.IN_PROGRESS]: 'En cours',
    [TICKET_STATUSES.WAITING]: 'En attente client',
    [TICKET_STATUSES.RESOLVED]: 'Résolu',
    [TICKET_STATUSES.CLOSED]: 'Fermé',
  };
  
  /**
   * Breakpoints responsive
   */
  
  export const BREAKPOINTS = {
    SM: 640,
    MD: 768,
    LG: 1024,
    XL: 1280,
    '2XL': 1536,
  };
  
  /**
   * Durées d'animation
   */
  export const ANIMATIONS = {
    FAST: 150,
    NORMAL: 300,
    SLOW: 500,
    VERY_SLOW: 1000,
  };
  
  /**
   * Limites et contraintes
   */
  export const LIMITS = {
    MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
    MAX_FILES_UPLOAD: 10,
    MIN_PASSWORD_LENGTH: 8,
    MAX_PASSWORD_LENGTH: 128,
    MAX_DESCRIPTION_LENGTH: 500,
    MAX_COMMENT_LENGTH: 1000,
    ITEMS_PER_PAGE: 10,
    MAX_SEARCH_RESULTS: 100,
  };
  
  /**
   * Formats de date
   */
  export const DATE_FORMATS = {
    SHORT: 'dd/MM/yyyy',
    LONG: 'dd MMMM yyyy',
    WITH_TIME: 'dd/MM/yyyy HH:mm',
    TIME_ONLY: 'HH:mm',
    ISO: 'yyyy-MM-dd',
  };
  
  /**
   * Langues supportées
   */
  export const LANGUAGES = {
    FR: { code: 'fr', name: 'Français', flag: '🇫🇷' },
    EN: { code: 'en', name: 'English', flag: '🇬🇧' },
  };
  
  /**
   * URLs externes
   */
  export const EXTERNAL_URLS = {
    COMPANY_WEBSITE: 'https://kartian.com',
    SUPPORT_EMAIL: 'support@kartian.com',
    SUPPORT_PHONE: '+225 XX XX XX XX XX',
    SUPPORT_WHATSAPP: 'https://wa.me/225XXXXXXXXX',
    DOCUMENTATION: 'https://docs.kartian.com',
    BLOG: 'https://blog.kartian.com',
    FACEBOOK: 'https://facebook.com/kartian',
    TWITTER: 'https://twitter.com/kartian',
    LINKEDIN: 'https://linkedin.com/company/kartian',
  };
  
  /**
   * Messages d'erreur communs
   */
  export const ERROR_MESSAGES = {
    NETWORK_ERROR: 'Erreur de réseau. Vérifiez votre connexion internet.',
    UNAUTHORIZED: 'Vous n\'êtes pas autorisé à effectuer cette action.',
    FORBIDDEN: 'Accès refusé. Permissions insuffisantes.',
    NOT_FOUND: 'Ressource introuvable.',
    INTERNAL_ERROR: 'Erreur interne du serveur. Veuillez réessayer plus tard.',
    VALIDATION_ERROR: 'Données invalides. Veuillez vérifier vos saisies.',
    TIMEOUT_ERROR: 'Délai d\'attente dépassé. Veuillez réessayer.',
  };
  
  /**
   * Messages de succès communs
   */
  export const SUCCESS_MESSAGES = {
    SAVED: 'Enregistré avec succès',
    DELETED: 'Supprimé avec succès',
    UPDATED: 'Mis à jour avec succès',
    CREATED: 'Créé avec succès',
    SENT: 'Envoyé avec succès',
    COPIED: 'Copié dans le presse-papiers',
    EXPORTED: 'Export réalisé avec succès',
  };
  
  /**
   * Expressions régulières utiles
   */
  export const REGEX_PATTERNS = {
    EMAIL: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
    PHONE_CI: /^(\+225|0)[0-9]{8,10}$/,
    TRACKING_NUMBER: /^KSL-\d{4}-\d{6}$/,
    POSTAL_CODE_CI: /^\d{2}$/,
    PASSWORD_STRONG: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  };
  
  /**
   * Clés de stockage local
   */
  export const STORAGE_KEYS = {
    THEME: 'ksl_theme',
    TOKEN: 'ksl_token',
    USER: 'ksl_user',
    LANGUAGE: 'ksl_language',
    PREFERENCES: 'ksl_preferences',
    CART: 'ksl_cart',
    DRAFT: 'ksl_draft_',
  };
  
  /**
   * Événements personnalisés
   */
  export const CUSTOM_EVENTS = {
    THEME_CHANGED: 'ksl:theme-changed',
    USER_LOGGED_IN: 'ksl:user-logged-in',
    USER_LOGGED_OUT: 'ksl:user-logged-out',
    NOTIFICATION_RECEIVED: 'ksl:notification-received',
    PARCEL_UPDATED: 'ksl:parcel-updated',
  };