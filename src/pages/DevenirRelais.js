import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Store,
  Users,
  DollarSign,
  MapPin,
  Clock,
  Shield,
  CheckCircle,
  ArrowRight,
  Star,
  TrendingUp,
  Award,
  Phone,
  Mail,
  Building,
  Package,
  Truck,
  BarChart3,
  Heart,
  Zap,
  Target,
  User
} from 'lucide-react';
import LocationSearch from '../components/ui/LocationSearch';

export default function DevenirRelais() {
  const [formData, setFormData] = useState({
    // Informations du gérant
    first_name: '',
    last_name: '',
    username: '',
    phone: '',
    email: '',
    address: '',
    business_type: '',
    
    // Informations du point relais
    business_name: '',
    opening_hours: '',
    ville: 'Abidjan',
    vilage: '',
    pays: 'Côte d\'Ivoire',
    address_relay: '',
    latitude: '',
    longitude: '',
    typeColis: ['standard', 'fragile'] // Types de colis par défaut
  });
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLocationSelect = (location) => {
    setFormData({
      ...formData,
      address_relay: location.address,
      latitude: parseFloat(location.latitude).toFixed(6), // Limiter à 6 décimales
      longitude: parseFloat(location.longitude).toFixed(6), // Limiter à 6 décimales
      ville: location.city || formData.ville
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation des champs obligatoires
    const requiredFields = {
      'Prénom': formData.first_name,
      'Nom': formData.last_name,
      'Nom d\'utilisateur': formData.username,
      'Téléphone': formData.phone,
      'Email': formData.email,
      'Type de commerce': formData.business_type,
      'Adresse du gérant': formData.address,
      'Nom du commerce': formData.business_name,
      'Horaires d\'ouverture': formData.opening_hours,
      'Ville': formData.ville,
      'Village/Quartier': formData.vilage,
      'Pays': formData.pays,
      'Adresse du point relais': formData.address_relay
    };

    const missingFields = Object.entries(requiredFields)
      .filter(([_, value]) => !value || value.trim() === '')
      .map(([field]) => field);

    if (missingFields.length > 0) {
      setError(`Veuillez remplir tous les champs obligatoires : ${missingFields.join(', ')}`);
      return;
    }

    // Validation des types de colis
    if (formData.typeColis.length === 0) {
      setError('Veuillez sélectionner au moins un type de colis');
      return;
    }

    // Validation des coordonnées GPS
    if (!formData.latitude || !formData.longitude) {
      setError('Veuillez sélectionner une adresse valide pour récupérer les coordonnées GPS');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Préparation des données selon la structure de l'API
      const candidatureData = {
        gerant: {
          username: formData.username,
          first_name: formData.first_name,
          last_name: formData.last_name,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          business_type: formData.business_type,
          role: "relay_point",
          is_active: false,
          statut: "inactif"
        },
        nom: formData.business_name,
        adresse: formData.address_relay,
        ville: formData.ville,
        vilage: formData.vilage,
        pays: formData.pays,
        montantMax: "100000.000000",
        Caution: "5000.000000",
        commission: "200.000000",
        tauxcommission: "5.000000",
        latitude: parseFloat(formData.latitude).toFixed(6),
        longitude: parseFloat(formData.longitude).toFixed(6),
        horaires_ouverture: formData.opening_hours,
        disponible: true,
        typeColis: formData.typeColis,
        statut: "inactif"
      };

      console.log('📍 Coordonnées GPS:', { latitude: formData.latitude, longitude: formData.longitude });

      console.log('📤 Envoi candidature:', candidatureData);

      // Appel API réel
      const response = await fetch('https://backend.katianlogistique.com/api/client/relais/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(candidatureData)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('❌ Détails de l\'erreur API:', errorData);
        console.error('📤 Données envoyées:', candidatureData);
        throw new Error(errorData.message || errorData.detail || `Erreur ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      console.log('✅ Candidature envoyée avec succès:', result);
      
      setSuccess(true);
      setIsLoading(false);

    } catch (error) {
      console.error('❌ Erreur envoi candidature:', error);
      setIsLoading(false);
      setError(error.message || 'Une erreur est survenue lors de l\'envoi de la candidature');
    }
  };

  const benefits = [
    {
      icon: DollarSign,
      title: 'Revenus Supplémentaires',
      description: 'Gagnez jusqu\'à 500 000 FCFA par mois en commissions sur les retraits et dépôts',
      color: 'from-green-500 to-green-600'
    },
    {
      icon: Users,
      title: 'Trafic Client',
      description: 'Augmentez votre visibilité et attirez de nouveaux clients dans votre commerce',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: TrendingUp,
      title: 'Croissance Business',
      description: 'Développez votre activité avec des services logistiques innovants',
      color: 'from-purple-500 to-purple-600'
    },
    {
      icon: Award,
      title: 'Formation Gratuite',
      description: 'Bénéficiez d\'une formation complète et d\'un support technique dédié',
      color: 'from-orange-500 to-orange-600'
    }
  ];

  const requirements = [
    {
      icon: Store,
      title: 'Local Commercial',
      description: 'Un espace de stockage sécurisé de minimum 10m²',
      color: 'from-red-500 to-red-600'
    },
    {
      icon: Clock,
      title: 'Horaires Étendus',
      description: 'Ouverture minimum 6 jours sur 7, 8h par jour',
      color: 'from-indigo-500 to-indigo-600'
    },
    {
      icon: Shield,
      title: 'Engagement Qualité',
      description: 'Respect des procédures KSL et engagement de service client',
      color: 'from-teal-500 to-teal-600'
    },
    {
      icon: MapPin,
      title: 'Localisation Stratégique',
      description: 'Emplacement accessible et bien desservi par les transports',
      color: 'from-pink-500 to-pink-600'
    }
  ];

  const process = [
    {
      step: 1,
      title: 'Candidature',
      description: 'Remplissez le formulaire de candidature en ligne',
      icon: Package
    },
    {
      step: 2,
      title: 'Évaluation',
      description: 'Notre équipe étudie votre dossier sous 48h',
      icon: BarChart3
    },
    {
      step: 3,
      title: 'Formation',
      description: 'Formation gratuite de 2 jours sur nos procédures',
      icon: Target
    },
    {
      step: 4,
      title: 'Lancement',
      description: 'Intégration au réseau et début d\'activité',
      icon: Zap
    }
  ];

  const testimonials = [
    {
      name: 'Mariam Koné',
      business: 'Pharmacie du Centre',
      location: 'Abidjan, Cocody',
      text: 'Devenir point relais KSL a transformé mon business. J\'ai augmenté mes revenus de 40% et mes clients sont fidélisés.',
      rating: 5
    },
    {
      name: 'Kouassi Jean',
      business: 'Boutique Express',
      location: 'Bouaké, Centre',
      text: 'L\'équipe KSL est très professionnelle. La formation était excellente et le support technique est réactif.',
      rating: 5
    }
  ];

  // Données des villes par pays
  const citiesByCountry = {
    "Côte d'Ivoire": [
      "Abidjan", "Bouaké", "San-Pédro", "Korhogo", "Yamoussoukro", 
      "Gagnoa", "Man", "Divo", "Daloa", "Anyama", "Bingerville", 
      "Grand-Bassam", "Assinie", "Tiassalé", "Agboville", "Adzopé"
    ],
    "Bénin": [
      "Cotonou", "Porto-Novo", "Parakou", "Djougou", "Bohicon", 
      "Abomey", "Natitingou", "Lokossa", "Ouidah", "Malanville"
    ],
    "Burkina Faso": [
      "Ouagadougou", "Bobo-Dioulasso", "Koudougou", "Ouahigouya", 
      "Banfora", "Dédougou", "Kaya", "Tenkodogo", "Fada N'Gourma", "Dori"
    ],
    "Cap-Vert": [
      "Praia", "Mindelo", "Santa Maria", "Assomada", "Pedra Badejo", 
      "Porto Novo", "Calheta", "Ribeira Grande", "Tarrafal", "Vila do Maio"
    ],
    "Gambie": [
      "Banjul", "Serekunda", "Brikama", "Bakau", "Farafenni", 
      "Lamin", "Sukuta", "Basse Santa Su", "Gunjur", "Brufut"
    ],
    "Ghana": [
      "Accra", "Kumasi", "Tamale", "Sekondi-Takoradi", "Ashaiman", 
      "Sunyani", "Cape Coast", "Obuasi", "Teshie", "Tema"
    ],
    "Guinée": [
      "Conakry", "Nzérékoré", "Kankan", "Kindia", "Labé", 
      "Kissidougou", "Gueckedou", "Boké", "Mamou", "Faranah"
    ],
    "Guinée-Bissau": [
      "Bissau", "Bafatá", "Gabú", "Bissorã", "Bolama", 
      "Cacheu", "Bubaque", "Catió", "Mansôa", "Buba"
    ],
    "Libéria": [
      "Monrovia", "Gbarnga", "Kakata", "Bensonville", "Harper", 
      "Voinjama", "Buchanan", "Zwedru", "New Yekepa", "Greenville"
    ],
    "Mali": [
      "Bamako", "Sikasso", "Mopti", "Koutiala", "Ségou", 
      "Kayes", "San", "Tombouctou", "Gao", "Kidal"
    ],
    "Mauritanie": [
      "Nouakchott", "Nouadhibou", "Rosso", "Adel Bagrou", "Kiffa", 
      "Zouérat", "Atar", "Néma", "Kaédi", "Sélibaby"
    ],
    "Niger": [
      "Niamey", "Zinder", "Maradi", "Agadez", "Tahoua", 
      "Arlit", "Dosso", "Birni-N'Konni", "Tessaoua", "Gaya"
    ],
    "Nigeria": [
      "Lagos", "Kano", "Ibadan", "Kaduna", "Port Harcourt", 
      "Benin City", "Maiduguri", "Zaria", "Aba", "Jos"
    ],
    "Sénégal": [
      "Dakar", "Touba", "Thiès", "Rufisque", "Kaolack", 
      "Mbour", "Ziguinchor", "Saint-Louis", "Diourbel", "Louga"
    ],
    "Sierra Leone": [
      "Freetown", "Bo", "Kenema", "Makeni", "Koidu", 
      "Lunsar", "Port Loko", "Waterloo", "Kabala", "Magburaka"
    ],
    "Togo": [
      "Lomé", "Sokodé", "Kara", "Kpalimé", "Atakpamé", 
      "Bassar", "Tsévié", "Aného", "Mango", "Dapaong"
    ]
  };

  const handleCountryChange = (e) => {
    const selectedCountry = e.target.value;
    setFormData({
      ...formData,
      pays: selectedCountry,
      ville: citiesByCountry[selectedCountry]?.[0] || '', // Première ville du pays
      vilage: '' // Reset du village/quartier
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-dark-bg dark:to-dark-bg-secondary">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-ksl-red via-ksl-red-dark to-ksl-black text-white py-12 sm:py-16 md:py-20">
        <div className="container-ksl text-center px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold mb-4 sm:mb-6">
            Devenez Point Relais KSL
          </h1>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-ksl-gray-light mb-6 sm:mb-8 max-w-3xl mx-auto px-4">
            Rejoignez notre réseau de plus de 500 points relais et développez votre activité avec des revenus supplémentaires
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <button
              onClick={() => document.getElementById('candidature').scrollIntoView({ behavior: 'smooth' })}
              className="px-4 sm:px-6 md:px-8 py-3 sm:py-4 bg-white text-ksl-red rounded-xl hover:bg-gray-100 transition-all duration-300 font-medium text-sm sm:text-base md:text-lg flex items-center justify-center space-x-2"
            >
              <span>Postuler maintenant</span>
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <Link
              to="/contact"
              className="px-4 sm:px-6 md:px-8 py-3 sm:py-4 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-all duration-300 font-medium text-sm sm:text-base md:text-lg"
            >
              Nous contacter
            </Link>
          </div>
        </div>
      </section>

      {/* Avantages Section */}
      <section className="py-12 sm:py-16 md:py-20">
        <div className="container-ksl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Pourquoi devenir Point Relais ?
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Découvrez tous les avantages de rejoindre notre réseau de points relais
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="bg-white dark:bg-dark-bg-secondary rounded-2xl p-4 sm:p-6 md:p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-200 dark:border-gray-700"
              >
                <div className={`w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br ${benefit.color} rounded-2xl flex items-center justify-center mb-4 sm:mb-6`}>
                  <benefit.icon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
                  {benefit.title}
                </h3>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Conditions Section */}
      <section className="bg-white dark:bg-dark-bg-secondary py-12 sm:py-16 md:py-20">
        <div className="container-ksl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Conditions d'adhésion
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Les critères essentiels pour rejoindre notre réseau
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
            {requirements.map((requirement, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-dark-bg dark:to-dark-bg-tertiary rounded-2xl p-4 sm:p-6 md:p-8 border border-gray-200 dark:border-gray-700"
              >
                <div className={`w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br ${requirement.color} rounded-2xl flex items-center justify-center mb-4 sm:mb-6`}>
                  <requirement.icon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
                  {requirement.title}
                </h3>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed">
                  {requirement.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-12 sm:py-16 md:py-20">
        <div className="container-ksl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Comment ça marche ?
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Un processus simple et rapide pour rejoindre notre réseau
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
            {process.map((step, index) => (
                              <div key={index} className="relative">
                  <div className="bg-white dark:bg-dark-bg-secondary rounded-2xl p-4 sm:p-6 md:p-8 shadow-lg text-center border border-gray-200 dark:border-gray-700">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-ksl-red to-ksl-red-dark rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                      <span className="text-white font-bold text-lg sm:text-xl">{step.step}</span>
                    </div>
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-ksl-red to-ksl-red-dark rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6">
                      <step.icon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
                      {step.title}
                    </h3>
                    <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
                      {step.description}
                    </p>
                  </div>
                {index < process.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <ArrowRight className="w-8 h-8 text-ksl-red" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-gradient-to-br from-ksl-red to-ksl-red-dark text-white py-12 sm:py-16 md:py-20">
        <div className="container-ksl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
              Ils nous font confiance
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-ksl-gray-light max-w-2xl mx-auto">
              Découvrez les témoignages de nos points relais partenaires
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 sm:p-6 md:p-8 border border-white/20"
              >
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-300 fill-current" />
                  ))}
                </div>
                <p className="text-sm sm:text-base md:text-lg mb-4 sm:mb-6 italic">
                  "{testimonial.text}"
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-full flex items-center justify-center mr-3 sm:mr-4">
                    <Users className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <div>
                    <div className="font-semibold text-sm sm:text-base">{testimonial.name}</div>
                    <div className="text-ksl-gray-light text-xs sm:text-sm">
                      {testimonial.business} • {testimonial.location}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Candidature Section */}
      <section id="candidature" className="py-12 sm:py-16 md:py-20">
        <div className="container-ksl px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Candidature en ligne
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Remplissez ce formulaire pour rejoindre notre réseau de points relais
              </p>
            </div>

            {success ? (
              <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-green-800 mb-2">
                  Candidature envoyée !
                </h3>
                <p className="text-green-700 mb-6">
                  Merci pour votre candidature. Notre équipe vous contactera dans les 48h pour la suite du processus.
                </p>
                <button
                  onClick={() => {
                    setSuccess(false);
                    setError(null);
                    setFormData({
                      first_name: '',
                      last_name: '',
                      username: '',
                      phone: '',
                      email: '',
                      address: '',
                      business_type: '',
                      business_name: '',
                      opening_hours: '',
                      ville: 'Abidjan',
                      vilage: '',
                      pays: 'Côte d\'Ivoire',
                      address_relay: '',
                      latitude: '',
                      longitude: '',
                      typeColis: ['standard', 'fragile']
                    });
                  }}
                  className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
                >
                  Nouvelle candidature
                </button>
              </div>
            ) : error ? (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-red-600 text-2xl">⚠️</span>
                </div>
                <h3 className="text-2xl font-bold text-red-800 mb-2">
                  Erreur lors de l'envoi
                </h3>
                <p className="text-red-700 mb-6">
                  {error}
                </p>
                <button
                  onClick={() => setError(null)}
                  className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
                >
                  Réessayer
                </button>
              </div>
            ) : (
              <div className="bg-white dark:bg-dark-bg-secondary rounded-2xl shadow-lg p-4 sm:p-6 md:p-8 border border-gray-200 dark:border-gray-700">
                <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
                  {/* Section 1: Informations du gérant */}
                  <div>
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-4 sm:mb-6 border-b border-gray-200 dark:border-gray-700 pb-2">
                      Informations du gérant
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                      {/* Prénom */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Prénom <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            type="text"
                            name="first_name"
                            value={formData.first_name}
                            onChange={handleChange}
                            placeholder="Votre prénom"
                            className="w-full pl-10 pr-4 py-2 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-dark-bg-secondary text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-ksl-red"
                            required
                          />
                        </div>
                      </div>

                      {/* Nom */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Nom <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            type="text"
                            name="last_name"
                            value={formData.last_name}
                            onChange={handleChange}
                            placeholder="Votre nom"
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-dark-bg-secondary text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-ksl-red"
                            required
                          />
                        </div>
                      </div>

                      {/* Nom d'utilisateur */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Nom d'utilisateur <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            placeholder="Votre nom d'utilisateur"
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-dark-bg-secondary text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-ksl-red"
                            required
                          />
                        </div>
                      </div>

                      {/* Téléphone */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Téléphone <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="+225 XX XX XX XX XX"
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-dark-bg-secondary text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-ksl-red"
                            required
                          />
                        </div>
                      </div>

                      {/* Email */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Email <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="email@exemple.com"
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-dark-bg-secondary text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-ksl-red"
                            required
                          />
                        </div>
                      </div>

                      {/* Type de commerce */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Type de commerce <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <select
                            name="business_type"
                            value={formData.business_type}
                            onChange={handleChange}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-dark-bg-secondary text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-ksl-red"
                            required
                          >
                            <option value="">Sélectionner le type</option>
                            <option value="boutique">Boutique</option>
                            <option value="pharmacy">Pharmacie</option>
                            <option value="grocery">Épicerie</option>
                            <option value="gas_station">Station essence</option>
                            <option value="cyber_cafe">Cyber café</option>
                            <option value="bookstore">Librairie</option>
                            <option value="mtn">MTN</option>
                            <option value="orange">Orange</option>
                            <option value="moov">Moov</option>
                            <option value="other">Autre</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Adresse du gérant - Pleine largeur */}
                    <div className="mt-4 sm:mt-6">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Adresse du gérant <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          name="address"
                          value={formData.address}
                          onChange={handleChange}
                          placeholder="Adresse personnelle du gérant"
                          className="w-full pl-10 pr-4 py-2 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-dark-bg-secondary text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-ksl-red"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Section 2: Informations du point relais */}
                  <div>
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-4 sm:mb-6 border-b border-gray-200 dark:border-gray-700 pb-2">
                      Informations du point relais
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                      {/* Nom du commerce */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Nom du commerce <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <Store className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            type="text"
                            name="business_name"
                            value={formData.business_name}
                            onChange={handleChange}
                            placeholder="Nom de votre commerce"
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-dark-bg-secondary text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-ksl-red"
                            required
                          />
                        </div>
                      </div>

                      {/* Horaires d'ouverture */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Horaires d'ouverture <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            type="text"
                            name="opening_hours"
                            value={formData.opening_hours}
                            onChange={handleChange}
                            placeholder="Ex: 7h-19h, 7j/7"
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-dark-bg-secondary text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-ksl-red"
                            required
                          />
                        </div>
                      </div>

                      {/* Pays */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Pays <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <select
                            name="pays"
                            value={formData.pays}
                            onChange={handleCountryChange}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-dark-bg-secondary text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-ksl-red"
                            required
                          >
                            <option value="Côte d'Ivoire">Côte d'Ivoire</option>
                            <option value="Bénin">Bénin</option>
                            <option value="Burkina Faso">Burkina Faso</option>
                            <option value="Cap-Vert">Cap-Vert</option>
                            <option value="Gambie">Gambie</option>
                            <option value="Ghana">Ghana</option>
                            <option value="Guinée">Guinée</option>
                            <option value="Guinée-Bissau">Guinée-Bissau</option>
                            <option value="Libéria">Libéria</option>
                            <option value="Mali">Mali</option>
                            <option value="Mauritanie">Mauritanie</option>
                            <option value="Niger">Niger</option>
                            <option value="Nigeria">Nigeria</option>
                            <option value="Sénégal">Sénégal</option>
                            <option value="Sierra Leone">Sierra Leone</option>
                            <option value="Togo">Togo</option>
                          </select>
                        </div>
                      </div>

                      {/* Ville */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Ville <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <select
                            name="ville"
                            value={formData.ville}
                            onChange={handleChange}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-dark-bg-secondary text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-ksl-red"
                            required
                          >
                            {citiesByCountry[formData.pays]?.map((city) => (
                              <option key={city} value={city}>
                                {city}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                    </div>

                    {/* Village/Quartier - Pleine largeur */}
                    <div className="mt-4 sm:mt-6">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Village/Quartier <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          name="vilage"
                          value={formData.vilage}
                          onChange={handleChange}
                          placeholder="Ex: Cocody, Yopougon, etc."
                          className="w-full pl-10 pr-4 py-2 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-dark-bg-secondary text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-ksl-red"
                          required
                        />
                      </div>
                    </div>



                    {/* Adresse du point relais */}
                    <div className="mt-4 sm:mt-6">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Adresse du point relais <span className="text-red-500">*</span>
                      </label>
                      <LocationSearch
                        value={formData.address_relay}
                        onChange={(value) => setFormData({...formData, address_relay: value})}
                        onLocationSelect={handleLocationSelect}
                        placeholder="Rechercher une adresse pour le point relais"
                      />
                      {formData.address_relay && (
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                          {formData.address_relay}
                        </p>
                      )}
                      {formData.latitude && formData.longitude && (
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                          Latitude: {formData.latitude}, Longitude: {formData.longitude}
                        </p>
                      )}
                    </div>
                  </div>

                                     {/* Section 3: Types de colis */}
                   <div>
                     <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-4 sm:mb-6 border-b border-gray-200 dark:border-gray-700 pb-2">
                       Types de colis acceptés
                     </h3>
                     <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mb-4 sm:mb-6">
                       Sélectionnez les types de colis que votre point relais peut gérer
                     </p>
                     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                       {[
                         { value: 'standard', label: 'Standard', variant: 'default', emoji: '📦' },
                         { value: 'fragile', label: 'Fragile', variant: 'warning', emoji: '🔍' },
                         { value: 'cold', label: 'Froid', variant: 'info', emoji: '❄️' },
                         { value: 'secure', label: 'Sécurisé', variant: 'error', emoji: '🔒' },
                         { value: 'large', label: 'Gros volume', variant: 'success', emoji: '📏' }
                       ].map((type) => (
                         <label 
                           key={type.value} 
                           className={`relative flex items-center p-3 sm:p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md ${
                             formData.typeColis.includes(type.value)
                               ? 'border-ksl-red bg-ksl-red/5 dark:bg-ksl-red/10'
                               : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                           }`}
                         >
                           <input
                             type="checkbox"
                             name="typeColis"
                             value={type.value}
                             checked={formData.typeColis.includes(type.value)}
                             onChange={() => {
                               setFormData(prev => ({
                                 ...prev,
                                 typeColis: prev.typeColis.includes(type.value)
                                   ? prev.typeColis.filter(tc => tc !== type.value)
                                   : [...prev.typeColis, type.value]
                               }));
                             }}
                             className="sr-only"
                           />
                           <div className="flex items-center space-x-2 sm:space-x-3 w-full">
                             <span className="text-xl sm:text-2xl">{type.emoji}</span>
                             <div className="flex-1">
                               <div className="font-medium text-gray-900 dark:text-white text-sm sm:text-base">
                                 {type.label}
                               </div>
                               <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                                 {type.value === 'standard' && 'Colis standard'}
                                 {type.value === 'fragile' && 'Colis fragile'}
                                 {type.value === 'cold' && 'Colis réfrigéré'}
                                 {type.value === 'secure' && 'Colis sécurisé'}
                                 {type.value === 'large' && 'Colis volumineux'}
                               </div>
                             </div>
                             {formData.typeColis.includes(type.value) && (
                               <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-ksl-red" />
                             )}
                           </div>
                         </label>
                       ))}
                     </div>
                     {formData.typeColis.length === 0 && (
                       <p className="text-sm text-red-500 mt-2">
                         Veuillez sélectionner au moins un type de colis
                       </p>
                     )}
                   </div>

                  {/* Submit Button */}
                  <div className="text-center">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="px-4 sm:px-6 md:px-8 py-3 sm:py-4 bg-ksl-red text-white rounded-xl hover:bg-ksl-red-dark transition-all duration-300 font-medium text-sm sm:text-base md:text-lg flex items-center justify-center space-x-2 mx-auto disabled:opacity-50"
                    >
                      {isLoading ? (
                        <>
                          <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span className="text-sm sm:text-base">Envoi en cours...</span>
                        </>
                      ) : (
                        <>
                          <span className="text-sm sm:text-base">Envoyer ma candidature</span>
                          <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                        </>
                      )}
                    </button>
                  </div>
        </form>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-br from-gray-900 to-ksl-black text-white py-12 sm:py-16 md:py-20">
        <div className="container-ksl text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6">
            Prêt à rejoindre notre réseau ?
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-300 mb-6 sm:mb-8 max-w-2xl mx-auto">
            Rejoignez plus de 500 points relais qui font déjà confiance à KSL pour développer leur activité
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <button
              onClick={() => document.getElementById('candidature').scrollIntoView({ behavior: 'smooth' })}
              className="px-4 sm:px-6 md:px-8 py-3 sm:py-4 bg-ksl-red text-white rounded-xl hover:bg-ksl-red-dark transition-all duration-300 font-medium text-sm sm:text-base md:text-lg flex items-center justify-center space-x-2"
            >
              <span>Postuler maintenant</span>
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <Link
              to="/contact"
              className="px-4 sm:px-6 md:px-8 py-3 sm:py-4 bg-white text-ksl-red rounded-xl hover:bg-gray-100 transition-all duration-300 font-medium text-sm sm:text-base md:text-lg"
            >
              Nous contacter
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
} 