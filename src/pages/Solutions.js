import React, { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { 
  ShoppingCart, 
  Building, 
  MapPin, 
  Truck, 
  Search, 
  ArrowRight, 
  CheckCircle, 
  Star,
  Users,
  Package,
  Clock,
  Shield,
  Zap,
  Globe,
  BarChart3
} from 'lucide-react';

export default function Solutions() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('ecommerce');

  // Lire le paramètre d'URL pour définir la section active
  useEffect(() => {
    const sectionFromUrl = searchParams.get('section');
    if (sectionFromUrl && ['ecommerce', 'b2b', 'points-relais', 'express', 'tracking'].includes(sectionFromUrl)) {
      setActiveSection(sectionFromUrl);
    }
  }, [searchParams]);

  // Fonction pour changer de section et mettre à jour l'URL
  const handleSectionChange = (sectionId) => {
    setActiveSection(sectionId);
    navigate(`/solutions?section=${sectionId}`);
  };

  const sections = [
    {
      id: 'ecommerce',
      title: 'E-commerce',
      icon: ShoppingCart,
      description: 'Solutions complètes pour boutiques en ligne',
      color: 'from-blue-500 to-blue-600'
    },
    {
      id: 'b2b',
      title: 'Logistique B2B',
      icon: Building,
      description: 'Gestion logistique entreprise',
      color: 'from-purple-500 to-purple-600'
    },
    {
      id: 'points-relais',
      title: 'Points Relais',
      icon: MapPin,
      description: 'Réseau de points de retrait',
      color: 'from-green-500 to-green-600'
    },
    {
      id: 'express',
      title: 'Livraison Express',
      icon: Truck,
      description: 'Livraison rapide et sécurisée',
      color: 'from-orange-500 to-orange-600'
    },
    {
      id: 'tracking',
      title: 'Tracking Avancé',
      icon: Search,
      description: 'Suivi en temps réel',
      color: 'from-red-500 to-red-600'
    }
  ];

  const sectionContent = {
    ecommerce: {
      title: 'Solutions E-commerce',
      subtitle: 'Optimisez votre logistique e-commerce avec nos solutions complètes',
      features: [
        {
          icon: Package,
          title: 'Gestion Multi-transporteurs',
          description: 'Intégration avec tous les transporteurs majeurs pour optimiser vos coûts'
        },
        {
          icon: ShoppingCart,
          title: 'Intégration E-commerce',
          description: 'Connectez facilement votre boutique en ligne à notre plateforme'
        },
        {
          icon: Users,
          title: 'Expérience Client',
          description: 'Notifications en temps réel et suivi personnalisé pour vos clients'
        },
        {
          icon: BarChart3,
          title: 'Analytics Avancés',
          description: 'Tableaux de bord détaillés pour optimiser vos performances logistiques'
        }
      ],
      benefits: [
        'Réduction de 30% des coûts logistiques',
        'Amélioration de 40% de la satisfaction client',
        'Automatisation complète des processus',
        'Support 24/7 dédié e-commerce'
      ]
    },
    b2b: {
      title: 'Logistique B2B',
      subtitle: 'Solutions logistiques adaptées aux besoins des entreprises',
      features: [
        {
          icon: Building,
          title: 'Gestion d\'Entrepôt',
          description: 'Optimisation du stockage et de la préparation des commandes'
        },
        {
          icon: Truck,
          title: 'Transport Spécialisé',
          description: 'Solutions de transport adaptées aux marchandises B2B'
        },
        {
          icon: Shield,
          title: 'Sécurité Renforcée',
          description: 'Protocoles de sécurité stricts pour vos marchandises sensibles'
        },
        {
          icon: Globe,
          title: 'Couverture Nationale',
          description: 'Réseau de distribution couvrant tout le territoire'
        }
      ],
      benefits: [
        'Gestion centralisée des flux logistiques',
        'Réduction des délais de livraison',
        'Traçabilité complète des marchandises',
        'Interfaces d\'intégration API'
      ]
    },
    'points-relais': {
      title: 'Réseau Points Relais',
      subtitle: 'Un réseau dense de points de retrait pour vos clients',
      features: [
        {
          icon: MapPin,
          title: 'Réseau Dense',
          description: 'Plus de 500 points relais répartis sur tout le territoire'
        },
        {
          icon: Clock,
          title: 'Horaires Étendus',
          description: 'Points relais ouverts 7j/7 avec horaires flexibles'
        },
        {
          icon: Users,
          title: 'Service Personnalisé',
          description: 'Accueil chaleureux et conseils personnalisés'
        },
        {
          icon: CheckCircle,
          title: 'Qualité Certifiée',
          description: 'Tous nos points relais sont certifiés et contrôlés'
        }
      ],
      benefits: [
        'Flexibilité pour vos clients',
        'Réduction des coûts de livraison',
        'Taux de retrait de 95%',
        'Gestion automatisée des stocks'
      ]
    },
    express: {
      title: 'Livraison Express',
      subtitle: 'Livraison rapide et sécurisée pour vos envois urgents',
      features: [
        {
          icon: Zap,
          title: 'Livraison Rapide',
          description: 'Livraison en 24h sur tout le territoire national'
        },
        {
          icon: Shield,
          title: 'Sécurité Garantie',
          description: 'Assurance complète et suivi sécurisé de vos envois'
        },
        {
          icon: Clock,
          title: 'Délais Garantis',
          description: 'Engagement de délai avec compensation en cas de retard'
        },
        {
          icon: Truck,
          title: 'Flotte Dédiée',
          description: 'Véhicules dédiés pour une livraison optimale'
        }
      ],
      benefits: [
        'Livraison en 24h garantie',
        'Assurance complète incluse',
        'Suivi GPS en temps réel',
        'Service client premium'
      ]
    },
    tracking: {
      title: 'Tracking Avancé',
      subtitle: 'Suivi en temps réel et traçabilité complète',
      features: [
        {
          icon: Search,
          title: 'Suivi Temps Réel',
          description: 'Localisation GPS précise de vos colis en temps réel'
        },
        {
          icon: Globe,
          title: 'Multi-plateforme',
          description: 'Accès au suivi depuis web, mobile et API'
        },
        {
          icon: Users,
          title: 'Notifications Intelligentes',
          description: 'Alertes personnalisées selon les événements'
        },
        {
          icon: BarChart3,
          title: 'Analytics Détaillés',
          description: 'Statistiques et rapports détaillés sur vos livraisons'
        }
      ],
      benefits: [
        'Visibilité totale sur vos envois',
        'Réduction des appels de suivi',
        'Amélioration de la satisfaction client',
        'Optimisation des processus'
      ]
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-dark-bg dark:to-dark-bg-secondary">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-ksl-red via-ksl-red-dark to-ksl-black text-white py-12 sm:py-16 md:py-20">
        <div className="container-ksl text-center px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold mb-4 sm:mb-6">
            Nos Solutions
          </h1>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-ksl-gray-light mb-6 sm:mb-8 max-w-3xl mx-auto px-4">
            Découvrez nos solutions logistiques innovantes adaptées à tous vos besoins
          </p>
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3 md:gap-4">
            {sections.map((section) => (
                              <button
                  key={section.id}
                  onClick={() => handleSectionChange(section.id)}
                  className={`px-3 sm:px-4 md:px-6 py-2 sm:py-3 rounded-full font-medium transition-all duration-300 flex items-center space-x-2 text-sm sm:text-base ${
                    activeSection === section.id
                      ? 'bg-white text-ksl-red shadow-lg'
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  <section.icon className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>{section.title}</span>
                </button>
            ))}
          </div>
        </div>
      </section>

      {/* Section Content */}
      <section className="py-12 sm:py-16 md:py-20">
        <div className="container-ksl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {sectionContent[activeSection].title}
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              {sectionContent[activeSection].subtitle}
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8 mb-12 sm:mb-16">
            {sectionContent[activeSection].features.map((feature, index) => (
              <div 
                key={index}
                className="bg-white dark:bg-dark-bg-secondary rounded-2xl p-4 sm:p-6 md:p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-200 dark:border-gray-700"
              >
                <div className={`w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br ${sections.find(s => s.id === activeSection).color} rounded-2xl flex items-center justify-center mb-4 sm:mb-6`}>
                  <feature.icon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
                  {feature.title}
                </h3>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>

          {/* Benefits Section */}
          <div className="bg-gradient-to-br from-ksl-red to-ksl-red-dark rounded-3xl p-4 sm:p-6 md:p-8 lg:p-12 text-white">
            <div className="text-center mb-6 sm:mb-8">
              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-4">
                Avantages de cette solution
              </h3>
              <p className="text-sm sm:text-base md:text-lg text-ksl-gray-light">
                Découvrez pourquoi cette solution est parfaite pour vos besoins
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {sectionContent[activeSection].benefits.map((benefit, index) => (
                <div key={index} className="flex items-start space-x-3 sm:space-x-4">
                  <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-white mt-1 flex-shrink-0" />
                  <span className="text-sm sm:text-base md:text-lg">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-br from-gray-900 to-ksl-black text-white py-12 sm:py-16 md:py-20">
        <div className="container-ksl text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6">
            Prêt à optimiser votre logistique ?
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-300 mb-6 sm:mb-8 max-w-2xl mx-auto">
            Rejoignez des milliers d'entreprises qui font confiance à Katian pour leur logistique
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <Link
              to="/contact"
              className="px-4 sm:px-6 md:px-8 py-3 sm:py-4 bg-ksl-red text-white rounded-xl hover:bg-ksl-red-dark transition-all duration-300 font-medium text-sm sm:text-base md:text-lg flex items-center justify-center space-x-2"
            >
              <span>Nous contacter</span>
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </Link>
            <Link
              to="/tarifs"
              className="px-4 sm:px-6 md:px-8 py-3 sm:py-4 bg-white text-ksl-red rounded-xl hover:bg-gray-100 transition-all duration-300 font-medium text-sm sm:text-base md:text-lg"
            >
              Voir nos tarifs
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
} 