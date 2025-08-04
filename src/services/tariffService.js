// ===================================================================
// SERVICE DE TARIFICATION KARTIAN SMART LOGISTIC - VERSION API
// Implémentation complète de la logique de calcul des tarifs d'expédition
// Utilise les grilles tarifaires de l'API
// ===================================================================

import { tariffAPI } from './api';

// 🗺️ CONSTANTES DES ZONES GÉOGRAPHIQUES CÔTE D'IVOIRE
const GEOGRAPHIC_ZONES = {
  'zone1': { name: 'Zone 1 - Abidjan Centre', factor: 1.0 },
  'zone2': { name: 'Zone 2 - Abidjan Périphérie', factor: 1.2 },
  'zone3': { name: 'Zone 3 - Grands Centres Urbains', factor: 1.5 },
  'zone4': { name: 'Zone 4 - Villes Moyennes', factor: 2.0 },
  'zone5': { name: 'Zone 5 - Zones Rurales', factor: 3.0 }
};

// 🏙️ MAPPING VILLES → ZONES (DONNÉES COMPLÈTES DE L'IMAGE)
export const CITY_ZONE_MAPPING = {
  // ========================================
  // ZONE 1 - ABIDJAN CENTRE
  // ========================================
  'Abobo': 'zone1',
  'Adjamé': 'zone1',
  'Attecoubé': 'zone1',
  'Cocody': 'zone1',
  'Koumassi': 'zone1',
  'Marcory': 'zone1',
  'Plateau': 'zone1',
  'Port-Bouët': 'zone1',
  'Treichville': 'zone1',
  'Yopougon': 'zone1',
  'Dabakala': 'zone1',
  'Katiola': 'zone1',
  'Tafire': 'zone1',
  'Sakassou': 'zone1',
  'Toumoudi': 'zone1',
  'Divo': 'zone1',
  'Guittry': 'zone1',
  'Gagnoa': 'zone1',
  'Oume': 'zone1',
  'Yamoussoukro': 'zone1',
  'Didievi': 'zone1',
  'Djekanou': 'zone1',
  'Grand-Zattry': 'zone1',
  'Bocanda': 'zone1',
  'Bonon': 'zone1',
  
  // ========================================
  // ZONE 2 - ABIDJAN PÉRIPHÉRIE
  // ========================================
  'Anyama': 'zone2',
  'Bingerville': 'zone2',
  'Songon': 'zone2',
  'Alépé': 'zone2',
  'Oghwyapo': 'zone2',
  'Dabou': 'zone2',
  'Sikensi': 'zone2',
  'Grand-Lahou': 'zone2',
  'Jacqueville': 'zone2',
  'Aboisso': 'zone2',
  'Ayame': 'zone2',
  'Bianouan': 'zone2',
  'Mafere': 'zone2',
  'Tiapoum': 'zone2',
  'Adiake': 'zone2',
  'Assinie-mafia': 'zone2',
  'Brufout': 'zone2',
  'Grand-Bassam': 'zone2',
  'Bonoua': 'zone2',
  
  // ========================================
  // ZONE 3 - GRANDS CENTRES URBAINS
  // ========================================
  'Tiassalé': 'zone3',
  'Korhogo': 'zone3',
  'Daloa': 'zone3',
  'Agboville': 'zone3',
  'Azaguie': 'zone3',
  'Cechi': 'zone3',
  'Grand-Morie': 'zone3',
  'Gress-Krobou': 'zone3',
  'Rubino': 'zone3',
  'Adrope': 'zone3',
  'Agou': 'zone3',
  'Affery': 'zone3',
  'Becedi-Brignon': 'zone3',
  'Akoupe': 'zone3',
  'Assikoi': 'zone3',
  'Yakasse-Attobrou': 'zone3',
  'Adzopé': 'zone3',
  'Abengourou': 'zone3',
  'Bouake': 'zone3',
  'Vavoua': 'zone3',
  'San-Pédro': 'zone3',
  'Daoukro': 'zone3',
  'Assuefry': 'zone3',
  'Zouan-Hounien': 'zone3',
  'Toumodi': 'zone3',
  'Guiglo': 'zone3',
  'Tabou': 'zone3',
  
  // ========================================
  // ZONE 4 - VILLES MOYENNES
  // ========================================
  'Boundiali': 'zone4',
  'Kouto': 'zone4',
  'Ferkessedougou': 'zone4',
  'Kong': 'zone4',
  'Tobia': 'zone4',
  'Cainua': 'zone4',
  'Beoumi': 'zone4',
  'Man': 'zone4',
  'Bondoukou': 'zone4',
  'Agnibilikrou': 'zone4',
  'Dimbokro': 'zone4',
  'Lakota': 'zone4',
  'Duékoué': 'zone4',
  'Rondoukou': 'zone4',
  'Rouna': 'zone4',
  'Tanda': 'zone4',
  'Grand-Béréby': 'zone4',
  'Meagui': 'zone4',
  'Zuenoula': 'zone4',
  'Mankono': 'zone4',
  'Kani': 'zone4',
  'Seguela': 'zone4',
  'Odienne': 'zone4',
  
  // ========================================
  // ZONE 5 - ZONES RURALES
  // ========================================
  'Komborodougou': 'zone5',
  'M\'Bengue': 'zone5',
  'Napieledougou': 'zone5',
  'Niofoin': 'zone5',
  'Tioronaradougou': 'zone5',
  'Sinematiali': 'zone5',
  'Sirasso': 'zone5',
  'Olon': 'zone5',
  'Kassere': 'zone5',
  'Kolia': 'zone5',
  'Diawala': 'zone5',
  'Ferkessedougou': 'zone5',
  'Koumbala': 'zone5',
  'Nielle': 'zone5',
  'Ouangolo-dougou': 'zone5',
  'Kapokoro': 'zone5',
  'Tengrela': 'zone5',
  'Bediala': 'zone5',
  'Gadouan': 'zone5',
  'Guehouo': 'zone5',
  'Gongue': 'zone5',
  'Zaibo': 'zone5',
  'Zoukougbei': 'zone5',
  'Rogoudia': 'zone5',
  'Iboguhé': 'zone5',
  'Dania': 'zone5',
  'Ouragahio': 'zone5',
  'Sinfra': 'zone5',
  'Diabo': 'zone5',
  'Brobo': 'zone5',
  'Botro': 'zone5',
  'Langui-Bonou': 'zone5',
  'Bodokro': 'zone5',
  'Ando-Kekrenou': 'zone5',
  'Kondrobo': 'zone5',
  'Banaoua': 'zone5',
  'Koniere-dougou': 'zone5',
  'Foumbolo': 'zone5',
  'Satama-Sokoro': 'zone5',
  'Satama-Sokoura': 'zone5',
  'Pronan': 'zone5',
  'Nakaraman-dougou': 'zone5',
  'Tortiya': 'zone5',
  'Timbe': 'zone5',
  'Facobly': 'zone5',
  'Kouibly': 'zone5',
  'Logouale': 'zone5',
  'Sangouane': 'zone5',
  'Semien': 'zone5',
  'Niadrou': 'zone5',
  'Tetedrou': 'zone5',
  'Kouangin': 'zone5',
  'Bin-Houye': 'zone5',
  'Zeo': 'zone5',
  'Zou': 'zone5',
  'Riankouma': 'zone5',
  'Dianne': 'zone5',
  'Sipilou': 'zone5',
  'Danane': 'zone5',
  'Mahapleu': 'zone5',
  'Arrah': 'zone5',
  'Hiré': 'zone5',
  'N\'Ziamzaria': 'zone5',
  'Bayota': 'zone5',
  'Gnagbodougnoa': 'zone5',
  'Gueyo': 'zone5',
  'Guepahio': 'zone5',
  'Attingue-krou': 'zone5',
  'Ti-N\'Diékro': 'zone5',
  'Angoda': 'zone5',
  'Kouatba': 'zone5',
  'Kokoumbo': 'zone5',
  'Bagohouo': 'zone5',
  'Guezon': 'zone5',
  'Orapieu': 'zone5',
  'Taï': 'zone5',
  'Toulepleu': 'zone5',
  'Bakoubly': 'zone5',
  'Neka': 'zone5',
  'Tiobily': 'zone5',
  'Gouméré': 'zone5',
  'Tabagne': 'zone5',
  'Tanuah': 'zone5',
  'Kouassi-Datékro': 'zone5',
  'Sapi': 'zone5',
  'Sandigue': 'zone5',
  'Dompo': 'zone5',
  'Nassian': 'zone5',
  'Tehini': 'zone5',
  'Transua': 'zone5',
  'Tankesse': 'zone5',
  'Booko': 'zone5',
  'Borotou': 'zone5',
  'Guintouga': 'zone5',
  'Koonan': 'zone5',
  'Koro': 'zone5',
  'Ouaninou': 'zone5',
  'Touba': 'zone5',
  'Pounoumesso': 'zone5',
  'Sassandra': 'zone5',
  'Sago': 'zone5',
  'Buyo': 'zone5',
  'Okrouyo': 'zone5',
  'Soubre': 'zone5',
  'Anoumaba': 'zone5',
  'Bongouanou': 'zone5',
  'Mbatto': 'zone5',
  'Tiémélékro': 'zone5',
  'Ettrokro': 'zone5',
  'Kouassi-Kouassikro': 'zone5',
  'Ouellé': 'zone5',
  'M\'Bahiakro': 'zone5',
  'Bonguera': 'zone5',
  'Koffi-Amankro': 'zone5',
  'Bouaflé': 'zone5',
  'Kouetinfla': 'zone5',
  'Bazre': 'zone5',
  'Konefla': 'zone5',
  'Gohitafla': 'zone5',
  'Dianra': 'zone5',
  'Kongasso': 'zone5',
  'Kounahiri': 'zone5',
  'Marandallah': 'zone5',
  'Sarhala': 'zone5',
  'Tieningboue': 'zone5',
  'Djibrosso': 'zone5',
  'Duala': 'zone5',
  'Massala': 'zone5',
  'Morondo': 'zone5',
  'Sife': 'zone5',
  'Worofla': 'zone5',
  'Bako': 'zone5',
  'Dioulatedougou': 'zone5',
  'Gbeleban': 'zone5',
  'Goulia': 'zone5',
  'Kaniasso': 'zone5',
  'Madinani': 'zone5',
  'Minignan': 'zone5',
  'Samatiguila': 'zone5',
  'Seguelon': 'zone5',
  'Seydougou': 'zone5',
  'Tiemé': 'zone5',
  'Tienko': 'zone5',
};

// 🆕 FONCTION POUR RÉCUPÉRER LA GRILLE TARIFAIRE D'UN TRANSPORTEUR
const getTariffGrid = async (carrierId) => {
  try {
    console.log('🔍 Récupération de la grille tarifaire pour le transporteur:', carrierId);
    
    // D'abord, récupérer toutes les grilles tarifaires pour debug
    console.log('🔍 Tentative de récupération de toutes les grilles tarifaires...');
    const allResponse = await tariffAPI.getTariffs();
    const allTariffs = allResponse.data?.results || allResponse.data || [];
    console.log('📊 Toutes les grilles tarifaires disponibles:', allTariffs.map(t => ({
      id: t.id,
      name: t.name,
      transporteur: t.transporteur,
      base_fee: t.base_fee,
      is_active: t.is_active
    })));
    
    // Maintenant filtrer côté client pour s'assurer qu'on a la bonne grille
    const tariffsForCarrier = allTariffs.filter(tariff => 
      tariff.transporteur === carrierId && tariff.is_active === true
    );
    
    console.log('📊 Grilles tarifaires trouvées pour ce transporteur:', tariffsForCarrier.length);
    console.log('🔍 Grilles filtrées:', tariffsForCarrier.map(t => ({
      id: t.id,
      name: t.name,
      transporteur: t.transporteur,
      base_fee: t.base_fee
    })));
    
    if (tariffsForCarrier.length === 0) {
      console.error(`❌ AUCUNE GRILLE TARIFAIRE TROUVÉE pour le transporteur ${carrierId}`);
      console.log('🔍 Grilles disponibles par transporteur:');
      const tariffsByCarrier = {};
      allTariffs.forEach(t => {
        if (!tariffsByCarrier[t.transporteur]) {
          tariffsByCarrier[t.transporteur] = [];
        }
        tariffsByCarrier[t.transporteur].push({
          id: t.id,
          name: t.name,
          base_fee: t.base_fee,
          is_active: t.is_active
        });
      });
      console.log('📊 Répartition par transporteur:', tariffsByCarrier);
      
      throw new Error(`Aucune grille tarifaire active trouvée pour le transporteur ${carrierId}. Veuillez créer une grille tarifaire pour ce transporteur.`);
    }
    
    // Prendre la première grille active pour ce transporteur
    const tariffGrid = tariffsForCarrier[0];
    console.log('✅ Grille tarifaire trouvée:', tariffGrid.name);
    console.log('🚚 Transporteur associé:', tariffGrid.transporteur);
    console.log('📊 Base fee:', tariffGrid.base_fee);
    console.log('🔧 Tarifs disponibles:', {
      poids: tariffGrid.TarifPoids?.length || 0,
      volume: tariffGrid.TarifVolum?.length || 0,
      distance: tariffGrid.TarifDistance?.length || 0,
      commune: tariffGrid.TarifCommune?.length || 0,
      zone: tariffGrid.TarifZone?.length || 0,
      ville: tariffGrid.TarifVille?.length || 0
    });
    
    // Vérification finale
    if (tariffGrid.transporteur !== carrierId) {
      console.error(`❌ ERREUR CRITIQUE: La grille tarifaire ${tariffGrid.name} appartient au transporteur ${tariffGrid.transporteur} mais on cherche le transporteur ${carrierId}`);
      throw new Error(`Grille tarifaire incorrecte: attendue pour transporteur ${carrierId}, trouvée pour transporteur ${tariffGrid.transporteur}`);
    }
    
    console.log('✅ Vérification OK: Grille tarifaire correspond au bon transporteur');
    return tariffGrid;
  } catch (error) {
    console.error('❌ Erreur lors de la récupération de la grille tarifaire:', error);
    throw error;
  }
};

// 🆕 FONCTION POUR CALCULER LE TARIF PAR POIDS
const calculateWeightTariff = (weight, tariffPoids) => {
  if (!weight || !tariffPoids) return 0;
  
  // Gérer les deux formats possibles : objet avec clés dynamiques ou tableau
  if (Array.isArray(tariffPoids)) {
    for (const range of tariffPoids) {
      const min = parseFloat(range.Min?.replace('kg', ''));
      const max = parseFloat(range.Max?.replace('kg', ''));
      if (weight >= min && weight <= max) {
        console.log(`   - Plage poids trouvée: ${min}-${max}kg = ${range.Tarif} FCFA`);
        return parseFloat(range.Tarif);
      }
    }
  } else if (typeof tariffPoids === 'object') {
    // Format objet avec clés comme "0-1kg"
    for (const [range, price] of Object.entries(tariffPoids)) {
      const [min, max] = range.replace('kg', '').split('-').map(Number);
      if (weight >= min && weight <= max) {
        console.log(`   - Plage poids trouvée: ${range} = ${price} FCFA`);
        return parseFloat(price);
      }
    }
  }
  
  return 0;
};

// 🆕 FONCTION POUR CALCULER LE TARIF PAR VOLUME
const calculateVolumeTariff = (volumeLiters, tariffVolum) => {
  if (!volumeLiters || !tariffVolum) return 0;
  
  // Gérer les deux formats possibles : objet avec clés dynamiques ou tableau
  if (Array.isArray(tariffVolum)) {
    for (const range of tariffVolum) {
      const min = parseFloat(range.Min?.replace('L', ''));
      const max = parseFloat(range.Max?.replace('L', ''));
      if (volumeLiters >= min && volumeLiters <= max) {
        console.log(`   - Plage volume trouvée: ${min}-${max}L = ${range.Tarif} FCFA`);
        return parseFloat(range.Tarif);
      }
    }
  } else if (typeof tariffVolum === 'object') {
    // Format objet avec clés comme "0-10L"
    for (const [range, price] of Object.entries(tariffVolum)) {
      const [min, max] = range.replace('L', '').split('-').map(Number);
      if (volumeLiters >= min && volumeLiters <= max) {
        console.log(`   - Plage volume trouvée: ${range} = ${price} FCFA`);
        return parseFloat(price);
      }
    }
  }
  
  return 0;
};

// 🆕 FONCTION POUR CALCULER LE TARIF PAR DISTANCE
const calculateDistanceTariff = (distance, tariffDistance) => {
  if (!distance || !tariffDistance) return 0;
  
  // Gérer les deux formats possibles : objet avec clés dynamiques ou tableau
  if (Array.isArray(tariffDistance)) {
    for (const range of tariffDistance) {
      const min = parseFloat(range.Min?.replace('km', ''));
      const max = parseFloat(range.Max?.replace('km', ''));
      if (distance >= min && distance <= max) {
        console.log(`   - Plage distance trouvée: ${min}-${max}km = ${range.Tarif} FCFA`);
        return parseFloat(range.Tarif);
      }
    }
  } else if (typeof tariffDistance === 'object' && Object.keys(tariffDistance).length > 0) {
    // Format objet avec clés comme "0-5km"
    for (const [range, price] of Object.entries(tariffDistance)) {
      const [min, max] = range.replace('km', '').split('-').map(Number);
      if (distance >= min && distance <= max) {
        console.log(`   - Plage distance trouvée: ${range} = ${price} FCFA`);
        return parseFloat(price);
      }
    }
  }
  
  console.log(`   - Aucune plage distance trouvée pour: ${distance}km`);
  return 0;
};

// 🆕 FONCTION POUR CALCULER LE TARIF PAR COMMUNE
const calculateCommuneTariff = (originCity, destinationCity, tariffCommune) => {
  if (!originCity || !destinationCity || !tariffCommune) return 0;
  
  // Gérer les deux formats : tableau ou objet
  if (Array.isArray(tariffCommune)) {
    for (const route of tariffCommune) {
      if (route.OrigineCommune === originCity && route.DestinationCommune === destinationCity) {
        console.log(`   - Route commune trouvée: ${originCity} → ${destinationCity} = ${route.Tarif} FCFA`);
        return parseFloat(route.Tarif);
      }
    }
  } else if (typeof tariffCommune === 'object' && Object.keys(tariffCommune).length > 0) {
    // Format objet avec clés comme "Cocody-Marcory"
    const key = `${originCity}-${destinationCity}`;
    if (tariffCommune[key]) {
      console.log(`   - Route commune trouvée: ${key} = ${tariffCommune[key]} FCFA`);
      return parseFloat(tariffCommune[key]);
    }
  }
  
  console.log(`   - Aucune route commune trouvée pour: ${originCity} → ${destinationCity}`);
  return 0;
};

// 🆕 FONCTION POUR CALCULER LE TARIF PAR ZONE
const calculateZoneTariff = (originZone, destinationZone, tariffZone) => {
  if (!originZone || !destinationZone || !tariffZone) return 0;
  
  // Gérer les deux formats : tableau ou objet
  if (Array.isArray(tariffZone)) {
    for (const route of tariffZone) {
      if (route.OrigineZone === originZone && route.DestinationZone === destinationZone) {
        console.log(`   - Route zone trouvée: ${originZone} → ${destinationZone} = ${route.Tarif} FCFA`);
        return parseFloat(route.Tarif);
      }
    }
  } else if (typeof tariffZone === 'object' && Object.keys(tariffZone).length > 0) {
    // Format objet avec clés comme "zone1-zone2"
    const key = `${originZone}-${destinationZone}`;
    if (tariffZone[key]) {
      console.log(`   - Route zone trouvée: ${key} = ${tariffZone[key]} FCFA`);
      return parseFloat(tariffZone[key]);
    }
  }
  
  console.log(`   - Aucune route zone trouvée pour: ${originZone} → ${destinationZone}`);
  return 0;
};

// 🆕 FONCTION POUR CALCULER LE TARIF PAR VILLE
const calculateCityTariff = (originCity, destinationCity, tariffVille) => {
  if (!originCity || !destinationCity || !tariffVille) return 0;
  
  // Gérer les deux formats : tableau ou objet
  if (Array.isArray(tariffVille)) {
    for (const route of tariffVille) {
      if (route.OrigineVille === originCity && route.DestinationVille === destinationCity) {
        console.log(`   - Route ville trouvée: ${originCity} → ${destinationCity} = ${route.Tarif} FCFA`);
        return parseFloat(route.Tarif);
      }
    }
  } else if (typeof tariffVille === 'object' && Object.keys(tariffVille).length > 0) {
    // Format objet avec clés comme "Abidjan-Bouaké"
    const key = `${originCity}-${destinationCity}`;
    if (tariffVille[key]) {
      console.log(`   - Route ville trouvée: ${key} = ${tariffVille[key]} FCFA`);
      return parseFloat(tariffVille[key]);
    }
  }
  
  console.log(`   - Aucune route ville trouvée pour: ${originCity} → ${destinationCity}`);
  return 0;
};

// 🆕 FONCTION POUR CALCULER LES FACTEURS
const calculateFactors = (tariffGrid, shipmentData) => {
  const factors = {
    zoneFactor: 1,
    insuranceFactor: 1,
    timeFactor: 1,
    serviceFactor: 1,
    equipmentFactor: 1,
    relayPointFee: 0
  };
  
  // Facteur de zone
  if (tariffGrid.TarifZoneFact) {
    const zoneFactors = tariffGrid.TarifZoneFact;
    // Appliquer le facteur de zone selon la zone de destination
    const destinationZone = getCityZone(shipmentData.destinationCity);
    if (destinationZone && zoneFactors[destinationZone.id]) {
      factors.zoneFactor = parseFloat(zoneFactors[destinationZone.id]);
      console.log(`   - Facteur zone appliqué: ${destinationZone.id} = ${factors.zoneFactor}`);
    }
  }
  
  // Facteur d'assurance
  console.log('🛡️ DEBUG - Facteur d\'assurance:');
  console.log('   - isInsured:', shipmentData.isInsured);
  console.log('   - declaredValue:', shipmentData.declaredValue);
  console.log('   - TarifAssurenceFact disponible:', !!tariffGrid.TarifAssurenceFact);
  
  if (tariffGrid.TarifAssurenceFact) {
    const insuranceFactors = tariffGrid.TarifAssurenceFact;
    console.log('   - Facteurs d\'assurance disponibles:', insuranceFactors);
    
    if (shipmentData.isInsured && shipmentData.declaredValue > 0) {
      // Logique d'assurance basée sur la valeur déclarée
      if (insuranceFactors.basic) {
        factors.insuranceFactor = parseFloat(insuranceFactors.basic);
        console.log('   ✅ Facteur assurance basic appliqué:', factors.insuranceFactor);
      } else if (insuranceFactors.premium && shipmentData.declaredValue > 100000) {
        factors.insuranceFactor = parseFloat(insuranceFactors.premium);
        console.log('   ✅ Facteur assurance premium appliqué:', factors.insuranceFactor);
      } else if (insuranceFactors.standard && shipmentData.declaredValue > 50000) {
        factors.insuranceFactor = parseFloat(insuranceFactors.standard);
        console.log('   ✅ Facteur assurance standard appliqué:', factors.insuranceFactor);
      } else {
        // Facteur par défaut si aucune correspondance
        factors.insuranceFactor = 1.02; // 2% par défaut
        console.log('   ⚠️ Facteur assurance par défaut appliqué:', factors.insuranceFactor);
      }
    } else {
      console.log('   ❌ Assurance non activée ou valeur déclarée insuffisante');
    }
  } else {
    console.log('   ⚠️ Aucun facteur d\'assurance configuré dans la grille tarifaire');
  }
  
  // Facteur temps de livraison
  if (tariffGrid.TarifTempsLiv) {
    const timeFactors = tariffGrid.TarifTempsLiv;
    if (shipmentData.isHolidayWeekend && timeFactors.holiday) {
      factors.timeFactor = parseFloat(timeFactors.holiday);
    } else if (shipmentData.isWeekend && timeFactors.weekend) {
      factors.timeFactor = parseFloat(timeFactors.weekend);
    }
  }
  
  // Facteur type de service
  if (tariffGrid.TarifTypeService) {
    const serviceFactors = tariffGrid.TarifTypeService;
    const serviceType = shipmentData.serviceType || 'standard';
    if (serviceFactors[serviceType]) {
      factors.serviceFactor = parseFloat(serviceFactors[serviceType]);
    }
  }
  
  // Facteur type d'équipement
  if (tariffGrid.TarifTypeEquip) {
    const equipmentFactors = tariffGrid.TarifTypeEquip;
    const vehicleType = shipmentData.vehicleType || 'voiture';
    if (equipmentFactors[vehicleType]) {
      factors.equipmentFactor = parseFloat(equipmentFactors[vehicleType]);
    }
  }
  
  // Frais point relais
  if (tariffGrid.TarifPointRelais) {
    const relayFactors = tariffGrid.TarifPointRelais;
    if (shipmentData.isDepotRelayPoint && relayFactors.deposit) {
      factors.relayPointFee += parseFloat(relayFactors.deposit);
    }
    if (shipmentData.isPickupRelayPoint && relayFactors.pickup) {
      factors.relayPointFee += parseFloat(relayFactors.pickup);
    }
  }
  
  return factors;
};

// 🗺️ FONCTION POUR DÉTERMINER LA ZONE D'UNE VILLE
export const getCityZone = (cityName) => {
  if (!cityName) return null;
  
  // Normaliser le nom de la ville
  const normalizedCity = cityName.trim().toLowerCase();
  
  console.log('🔍 Recherche de zone pour:', cityName, '(normalisé:', normalizedCity, ')');
  
  // Chercher une correspondance exacte d'abord
  for (const [city, zone] of Object.entries(CITY_ZONE_MAPPING)) {
    if (normalizedCity === city.toLowerCase()) {
      console.log('✅ Correspondance exacte trouvée:', city, '→', zone);
    return {
        id: zone,
        name: GEOGRAPHIC_ZONES[zone].name,
        factor: GEOGRAPHIC_ZONES[zone].factor
      };
    }
  }
  
  // Chercher une correspondance partielle
  for (const [city, zone] of Object.entries(CITY_ZONE_MAPPING)) {
    if (normalizedCity.includes(city.toLowerCase()) || city.toLowerCase().includes(normalizedCity)) {
      console.log('✅ Correspondance partielle trouvée:', city, '→', zone);
    return {
        id: zone,
        name: GEOGRAPHIC_ZONES[zone].name,
        factor: GEOGRAPHIC_ZONES[zone].factor
      };
    }
  }
  
  // Zone par défaut si non trouvée
  console.log('⚠️ Aucune correspondance trouvée, utilisation de la zone par défaut (zone3)');
  return {
    id: 'zone3',
    name: 'Zone 3 - Grands Centres Urbains',
    factor: 1.5
  };
};

// ✅ FONCTION DE VALIDATION DES DONNÉES D'EXPÉDITION
export const validateShipmentData = (shipmentData) => {
  const errors = [];
  
  if (!shipmentData.originCity) {
    errors.push('Ville d\'origine manquante');
  }
  
  if (!shipmentData.destinationCity) {
    errors.push('Ville de destination manquante');
  }
  
  if (!shipmentData.carrierId && !shipmentData.carrierCode) {
    errors.push('Transporteur non spécifié');
  }
  
  const weight = parseFloat(shipmentData.weight);
  if (isNaN(weight) || weight < 0) {
    errors.push('Poids invalide');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// 🧮 FONCTION PRINCIPALE DE CALCUL DE TARIF
export const calculateTariff = async (shipmentData) => {
  const {
    originCity,
    destinationCity,
    weight = 0,
    length = 0,
    width = 0,
    height = 0,
    volumeCm3 = null,
    serviceType = 'standard',
    declaredValue = 0,
    isInsured = false,
    distance = 0,
    isDepotRelayPoint = false,
    isPickupRelayPoint = false,
    isHolidayWeekend = false,
    carrierId = null,
    vehicleType = 'voiture'
  } = shipmentData;

  try {
    console.log('🧮 ========== CALCUL TARIF KARTIAN (API) ==========');
    console.log('📋 Données d\'entrée:', shipmentData);
    
    // 🔧 VALIDATION DES DONNÉES D'ENTRÉE
    const validation = validateShipmentData(shipmentData);
    if (!validation.isValid) {
      throw new Error(`Données invalides: ${validation.errors.join(', ')}`);
    }
    
    // 1️⃣ RÉCUPÉRER LA GRILLE TARIFAIRE
    const carrierIdToUse = carrierId || shipmentData.carrierCode;
    console.log('🚚 Transporteur utilisé pour la grille tarifaire:', carrierIdToUse);
    console.log('🔍 Type de carrierId:', typeof carrierIdToUse, 'Valeur:', carrierIdToUse);
    const tariffGrid = await getTariffGrid(carrierIdToUse);
    
    console.log('📊 ÉTAPE 1 - Grille tarifaire récupérée:', tariffGrid.name);
    console.log('   - Prix de base:', tariffGrid.base_fee, 'FCFA');
    console.log('   - Transporteur associé:', tariffGrid.transporteur);
    console.log('   - ID de la grille:', tariffGrid.id);
    console.log('   - Grille active:', tariffGrid.is_active);
    
    // 2️⃣ CALCULER LES TARIFS PAR TYPE
    const volumeLiters = volumeCm3 ? volumeCm3 / 1000 : (length * width * height) / 1000;
    
    console.log('📍 ÉTAPE 2 - Villes détectées:', originCity, '→', destinationCity);
    
    // Calculer les différents tarifs
    const weightTariff = calculateWeightTariff(weight, tariffGrid.TarifPoids);
    const volumeTariff = calculateVolumeTariff(volumeLiters, tariffGrid.TarifVolum);
    const distanceTariff = calculateDistanceTariff(distance, tariffGrid.TarifDistance);
    const communeTariff = calculateCommuneTariff(originCity, destinationCity, tariffGrid.TarifCommune);
    const zoneTariff = calculateZoneTariff(
      getCityZone(originCity)?.id, 
      getCityZone(destinationCity)?.id, 
      tariffGrid.TarifZone
    );
    const cityTariff = calculateCityTariff(originCity, destinationCity, tariffGrid.TarifVille);
    
    console.log('💰 ÉTAPE 3 - Tarifs calculés:');
    console.log('   - Tarif poids:', weightTariff, 'FCFA');
    console.log('   - Tarif volume:', volumeTariff, 'FCFA');
    console.log('   - Tarif distance:', distanceTariff, 'FCFA');
    console.log('   - Tarif commune:', communeTariff, 'FCFA');
    console.log('   - Tarif zone:', zoneTariff, 'FCFA');
    console.log('   - Tarif ville:', cityTariff, 'FCFA');
    
    // 🔍 DEBUG : Afficher les données utilisées pour le calcul
    console.log('🔍 DEBUG - Données utilisées:');
    console.log('   - Poids:', weight, 'kg');
    console.log('   - Volume:', volumeLiters, 'L');
    console.log('   - Distance:', distance, 'km');
    console.log('   - Ville origine:', originCity);
    console.log('   - Ville destination:', destinationCity);
    console.log('   - Zone origine:', getCityZone(originCity)?.id);
    console.log('   - Zone destination:', getCityZone(destinationCity)?.id);
    console.log('   - Grille tarifaire:', tariffGrid.name);
    console.log('   - TarifPoids disponible:', tariffGrid.TarifPoids?.length || 0, 'plages');
    console.log('   - TarifVolum disponible:', tariffGrid.TarifVolum?.length || 0, 'plages');
    console.log('   - TarifDistance disponible:', tariffGrid.TarifDistance?.length || 0, 'plages');
    console.log('   - TarifCommune disponible:', tariffGrid.TarifCommune?.length || 0, 'routes');
    console.log('   - TarifZone disponible:', tariffGrid.TarifZone?.length || 0, 'routes');
    console.log('   - TarifVille disponible:', tariffGrid.TarifVille?.length || 0, 'routes');
    
    // 3️⃣ CALCULER LES FACTEURS
    const factors = calculateFactors(tariffGrid, shipmentData);
    
    console.log('🎯 ÉTAPE 4 - Facteurs appliqués:');
    console.log('   - Facteur zone:', factors.zoneFactor);
    console.log('   - Facteur assurance:', factors.insuranceFactor);
    console.log('   - Facteur temps:', factors.timeFactor);
    console.log('   - Facteur service:', factors.serviceFactor);
    console.log('   - Facteur équipement:', factors.equipmentFactor);
    console.log('   - Frais point relais:', factors.relayPointFee, 'FCFA');
    
    // 4️⃣ CALCULER LE PRIX FINAL (LOGIQUE ADDITIVE)
    const basePrice = parseFloat(tariffGrid.base_fee) || 0;
    
    // CALCUL ADDITIF : Prix de base + tous les tarifs + tous les facteurs
    let totalTariff = basePrice;
    
    console.log('🧮 CALCUL ADDITIF - Étape par étape:');
    console.log('   - Prix de base:', basePrice, 'FCFA');
    
    // Ajouter tous les tarifs spécifiques
    if (weightTariff > 0) {
      totalTariff += weightTariff;
      console.log('   + Tarif poids:', weightTariff, 'FCFA → Total:', totalTariff, 'FCFA');
    }
    
    if (volumeTariff > 0) {
      totalTariff += volumeTariff;
      console.log('   + Tarif volume:', volumeTariff, 'FCFA → Total:', totalTariff, 'FCFA');
    }
    
    if (distanceTariff > 0) {
      totalTariff += distanceTariff;
      console.log('   + Tarif distance:', distanceTariff, 'FCFA → Total:', totalTariff, 'FCFA');
    }
    
    if (cityTariff > 0) {
      totalTariff += cityTariff;
      console.log('   + Tarif ville:', cityTariff, 'FCFA → Total:', totalTariff, 'FCFA');
    }
    
    if (communeTariff > 0) {
      totalTariff += communeTariff;
      console.log('   + Tarif commune:', communeTariff, 'FCFA → Total:', totalTariff, 'FCFA');
    }
    
    if (zoneTariff > 0) {
      totalTariff += zoneTariff;
      console.log('   + Tarif zone:', zoneTariff, 'FCFA → Total:', totalTariff, 'FCFA');
    }
    
    console.log('   = Tarif de base + tarifs spécifiques:', totalTariff, 'FCFA');
    
    // Le tarif principal est maintenant la somme de tous les tarifs
    let finalPrice = totalTariff;
    
    console.log('🎯 APPLICATION DES FACTEURS:');
    console.log('   - Tarif avant facteurs:', finalPrice, 'FCFA');
    
    // Appliquer les facteurs multiplicatifs
    if (factors.zoneFactor !== 1) {
      finalPrice *= factors.zoneFactor;
      console.log('   × Facteur zone:', factors.zoneFactor, '→', finalPrice.toFixed(0), 'FCFA');
    }
    
    if (factors.insuranceFactor !== 1) {
      const priceBeforeInsurance = finalPrice;
      finalPrice *= factors.insuranceFactor;
      const insuranceCost = finalPrice - priceBeforeInsurance;
      console.log('   × Facteur assurance:', factors.insuranceFactor, '(+', insuranceCost.toFixed(0), 'FCFA) →', finalPrice.toFixed(0), 'FCFA');
    } else {
      console.log('   - Facteur assurance: 1.0 (aucun supplément)');
    }
    
    if (factors.timeFactor !== 1) {
      finalPrice *= factors.timeFactor;
      console.log('   × Facteur temps:', factors.timeFactor, '→', finalPrice.toFixed(0), 'FCFA');
    }
    
    if (factors.serviceFactor !== 1) {
      finalPrice *= factors.serviceFactor;
      console.log('   × Facteur service:', factors.serviceFactor, '→', finalPrice.toFixed(0), 'FCFA');
    }
    
    if (factors.equipmentFactor !== 1) {
      finalPrice *= factors.equipmentFactor;
      console.log('   × Facteur équipement:', factors.equipmentFactor, '→', finalPrice.toFixed(0), 'FCFA');
    }
    
    // Ajouter les frais point relais (additif)
    if (factors.relayPointFee !== 0) {
      finalPrice += factors.relayPointFee;
      console.log('   + Frais point relais:', factors.relayPointFee, 'FCFA →', finalPrice.toFixed(0), 'FCFA');
    }
    
    // Prix minimum
    const minimumPrice = 500;
    if (finalPrice < minimumPrice) {
      console.log('   ⚠️ Prix minimum appliqué:', minimumPrice, 'FCFA (au lieu de', finalPrice.toFixed(0), 'FCFA)');
      finalPrice = minimumPrice;
    }
    
    console.log('🏁 ÉTAPE 5 - CALCUL FINAL:');
    console.log('   - Prix de base:', basePrice, 'FCFA');
    console.log('   - Tarif total (base + spécifiques):', totalTariff, 'FCFA');
    console.log('   - Prix final après facteurs:', finalPrice.toFixed(0), 'FCFA');
    
    // 5️⃣ RÉSULTAT FINAL
    const result = {
      success: true,
      finalPrice: finalPrice,
      currency: 'FCFA',
      breakdown: {
        basePrice,
        weightTariff,
        volumeTariff,
        distanceTariff,
        communeTariff,
        zoneTariff,
        cityTariff,
        totalTariff,
        factors,
        finalPrice
      },
      details: {
        tariffGrid: tariffGrid.name,
        originCity,
        destinationCity,
        weight,
        volume: volumeLiters,
        distance,
        serviceType,
        isInsured,
        declaredValue
      }
    };
    
    console.log('🏁 ========== RÉSULTAT FINAL ==========');
    console.log('💰 Prix final:', result.finalPrice, 'FCFA');
    console.log('📋 Détails:', result.details);
    
    return result;
    
  } catch (error) {
    console.error('❌ Erreur lors du calcul du tarif:', error);
    throw error;
  }
};

// 🔍 FONCTION POUR RECHERCHER DES VILLES
export const searchCities = (searchTerm) => {
  if (!searchTerm || searchTerm.length < 2) return [];
  
  const normalizedSearch = searchTerm.toLowerCase();
  const cities = Object.keys(CITY_ZONE_MAPPING);
  
  return cities.filter(city => 
    city.toLowerCase().includes(normalizedSearch)
  ).slice(0, 10);
};

// 📋 FONCTION POUR AFFICHER TOUTES LES VILLES PAR ZONE
export const getAllCitiesByZone = () => {
  const citiesByZone = {
    zone1: [],
    zone2: [],
    zone3: [],
    zone4: [],
    zone5: []
  };
  
  for (const [city, zone] of Object.entries(CITY_ZONE_MAPPING)) {
    citiesByZone[zone].push(city);
  }
  
  console.log('🗺️ ========== VILLES PAR ZONE ==========');
  for (const [zone, cities] of Object.entries(citiesByZone)) {
    console.log(`📍 ${GEOGRAPHIC_ZONES[zone].name}:`);
    console.log(`   ${cities.join(', ')}`);
    console.log(`   Total: ${cities.length} villes`);
    console.log('');
  }
  
  return citiesByZone;
};

// 📊 FONCTION POUR OBTENIR LES STATISTIQUES DE TARIFICATION
export const getTariffStats = async (filters = {}) => {
  try {
    const response = await tariffAPI.getTariffs(filters);
    const tariffs = response.data?.results || response.data || [];
    
    return {
      totalTariffs: tariffs.length,
      activeTariffs: tariffs.filter(t => t.is_active).length,
      averageBaseFee: tariffs.reduce((sum, t) => sum + parseFloat(t.base_fee || 0), 0) / tariffs.length || 0
    };
  } catch (error) {
    console.error('❌ Erreur lors de la récupération des statistiques:', error);
    return {
      totalTariffs: 0,
      activeTariffs: 0,
      averageBaseFee: 0
    };
  }
};

// 🧪 FONCTION DE TEST SUPPRIMÉE - Utilise maintenant les vraies données de la base de données