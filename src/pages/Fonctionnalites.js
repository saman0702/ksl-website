import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Printer, 
  ArrowLeftRight, 
  BarChart3, 
  CreditCard, 
  TrendingUp, 
  Smartphone,
  Package,
  Truck,
  MapPin,
  Users,
  Shield,
  Clock,
  Bell,
  Settings,
  Database,
  Globe,
  Zap,
  CheckCircle,
  Star,
  ArrowRight
} from 'lucide-react';

export default function Fonctionnalites() {
  const [activeCategory, setActiveCategory] = useState('expedition');

  const categories = [
    {
      id: 'expedition',
      title: 'Expédition',
      icon: Package,
      color: 'from-blue-500 to-blue-600',
      description: 'Gestion complète des expéditions'
    },
    {
      id: 'tracking',
      title: 'Suivi & Traçabilité',
      icon: Truck,
      color: 'from-green-500 to-green-600',
      description: 'Suivi en temps réel'
    },
    {
      id: 'relais',
      title: 'Points Relais',
      icon: MapPin,
      color: 'from-purple-500 to-purple-600',
      description: 'Gestion réseau relais'
    },
    {
      id: 'paiement',
      title: 'Paiement',
      icon: CreditCard,
      color: 'from-orange-500 to-orange-600',
      description: 'Solutions de paiement'
    },
    {
      id: 'analytics',
      title: 'Analytics',
      icon: BarChart3,
      color: 'from-red-500 to-red-600',
      description: 'Données et statistiques'
    },
    {
      id: 'integration',
      title: 'Intégrations',
      icon: ArrowLeftRight,
      color: 'from-indigo-500 to-indigo-600',
      description: 'Connecteurs et APIs'
    }
  ];

  const featuresByCategory = {
    expedition: {
      title: 'Gestion des Expéditions',
      subtitle: 'Créez et gérez vos expéditions en toute simplicité',
      features: [
        {
          icon: Printer,
          title: 'Impression d\'Étiquettes',
          description: 'Génération automatique d\'étiquettes d\'expédition pour tous les transporteurs',
          benefits: ['Format standardisé', 'Codes-barres intégrés', 'Impression en lot']
        },
        {
          icon: Package,
          title: 'Gestion Multi-transporteurs',
          description: 'Comparez et choisissez le meilleur transporteur selon vos besoins',
          benefits: ['Comparaison tarifs', 'Délais optimisés', 'Couverture étendue']
        },
        {
          icon: Settings,
          title: 'Configuration Flexible',
          description: 'Personnalisez vos paramètres d\'expédition selon vos spécificités',
          benefits: ['Règles personnalisées', 'Templates modifiables', 'Profils sauvegardés']
        },
        {
          icon: Database,
          title: 'Base de Données Produits',
          description: 'Gérez votre catalogue produits avec dimensions et poids automatiques',
          benefits: ['Import en masse', 'Calcul automatique', 'Synchronisation']
        }
      ]
    },
    tracking: {
      title: 'Suivi & Traçabilité',
      subtitle: 'Suivez vos colis en temps réel avec précision',
      features: [
        {
          icon: Truck,
          title: 'Suivi GPS Temps Réel',
          description: 'Localisation précise de vos colis avec mise à jour automatique',
          benefits: ['Précision GPS', 'Mise à jour automatique', 'Historique complet']
        },
        {
          icon: Bell,
          title: 'Notifications Intelligentes',
          description: 'Alertes personnalisées selon les événements de livraison',
          benefits: ['SMS/Email', 'Personnalisation', 'Multi-langues']
        },
        {
          icon: Clock,
          title: 'Délais Garantis',
          description: 'Engagement de délai avec compensation en cas de retard',
          benefits: ['Garantie de délai', 'Compensation automatique', 'Suivi qualité']
        },
        {
          icon: Shield,
          title: 'Sécurité Renforcée',
          description: 'Protocoles de sécurité stricts pour vos marchandises',
          benefits: ['Assurance incluse', 'Signature électronique', 'Preuves de livraison']
        }
      ]
    },
    relais: {
      title: 'Gestion Points Relais',
      subtitle: 'Optimisez votre réseau de points de retrait',
      features: [
        {
          icon: MapPin,
          title: 'Cartographie Interactive',
          description: 'Visualisez et gérez votre réseau de points relais sur une carte',
          benefits: ['Carte interactive', 'Filtres avancés', 'Statistiques géographiques']
        },
        {
          icon: Users,
          title: 'Gestion Relais',
          description: 'Interface dédiée pour les gestionnaires de points relais',
          benefits: ['Dashboard relais', 'Gestion stocks', 'Rapports automatiques']
        },
        {
          icon: Package,
          title: 'Gestion des Stocks',
          description: 'Suivi en temps réel des colis dans chaque point relais',
          benefits: ['Inventaire temps réel', 'Alertes stock', 'Optimisation espace']
        },
        {
          icon: Clock,
          title: 'Horaires Dynamiques',
          description: 'Gestion flexible des horaires d\'ouverture des points relais',
          benefits: ['Horaires variables', 'Fermetures exceptionnelles', 'Notifications clients']
        }
      ]
    },
    paiement: {
      title: 'Solutions de Paiement',
      subtitle: 'Sécurisez vos transactions et améliorez votre trésorerie',
      features: [
        {
          icon: CreditCard,
          title: 'Cash on Delivery (COD)',
          description: 'Paiement sécurisé à la livraison pour rassurer vos clients',
          benefits: ['Sécurité maximale', 'Confiance client', 'Réduction impayés']
        },
        {
          icon: Shield,
          title: 'Paiement Sécurisé',
          description: 'Protocoles de sécurité bancaire pour toutes vos transactions',
          benefits: ['Cryptage SSL', 'Conformité PCI', 'Protection fraude']
        },
        {
          icon: ArrowLeftRight,
          title: 'Multi-moyens de Paiement',
          description: 'Acceptez tous les moyens de paiement préférés de vos clients',
          benefits: ['Cartes bancaires', 'Mobile money', 'Virements']
        },
        {
          icon: TrendingUp,
          title: 'Gestion Trésorerie',
          description: 'Suivi et optimisation de votre trésorerie en temps réel',
          benefits: ['Rapports financiers', 'Prévisions cash-flow', 'Réconciliation automatique']
        }
      ]
    },
    analytics: {
      title: 'Analytics & Statistiques',
      subtitle: 'Prenez des décisions éclairées avec vos données',
      features: [
        {
          icon: BarChart3,
          title: 'Tableaux de Bord',
          description: 'Vue d\'ensemble complète de vos performances logistiques',
          benefits: ['KPIs en temps réel', 'Graphiques interactifs', 'Export données']
        },
        {
          icon: TrendingUp,
          title: 'Analytics Avancés',
          description: 'Analyses prédictives et recommandations d\'optimisation',
          benefits: ['Prédictions', 'Recommandations IA', 'Tendances marché']
        },
        {
          icon: Users,
          title: 'Comportement Client',
          description: 'Analyse des préférences et habitudes de vos clients',
          benefits: ['Segmentation client', 'Personnalisation', 'Fidélisation']
        },
        {
          icon: Globe,
          title: 'Rapports Géographiques',
          description: 'Analyses territoriales pour optimiser votre couverture',
          benefits: ['Cartes de chaleur', 'Zones de performance', 'Expansion territoriale']
        }
      ]
    },
    integration: {
      title: 'Intégrations & APIs',
      subtitle: 'Connectez-vous facilement à tous vos outils',
      features: [
        {
          icon: ArrowLeftRight,
          title: 'APIs RESTful',
          description: 'Intégration facile avec vos systèmes existants',
          benefits: ['Documentation complète', 'SDKs disponibles', 'Support technique']
        },
        {
          icon: Package, // Changed from ShoppingCart to Package for consistency with other categories
          title: 'E-commerce',
          description: 'Connecteurs pour toutes les plateformes e-commerce',
          benefits: ['Shopify', 'WooCommerce', 'PrestaShop', 'Magento']
        },
        {
          icon: Database,
          title: 'ERP & CRM',
          description: 'Intégration avec vos systèmes de gestion',
          benefits: ['SAP', 'Oracle', 'Salesforce', 'HubSpot']
        },
        {
          icon: Zap,
          title: 'Webhooks',
          description: 'Notifications en temps réel pour vos événements',
          benefits: ['Temps réel', 'Personnalisation', 'Fiabilité']
        }
      ]
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-dark-bg dark:to-dark-bg-secondary">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-ksl-red via-ksl-red-dark to-ksl-black text-white py-20">
        <div className="container-ksl text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Nos Fonctionnalités
          </h1>
          <p className="text-xl md:text-2xl text-ksl-gray-light mb-8 max-w-3xl mx-auto">
            Découvrez toutes les fonctionnalités avancées de notre plateforme logistique
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-6 py-3 rounded-full font-medium transition-all duration-300 flex items-center space-x-2 ${
                  activeCategory === category.id
                    ? 'bg-white text-ksl-red shadow-lg'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                <category.icon className="w-5 h-5" />
                <span>{category.title}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Features Content */}
      <section className="py-20">
        <div className="container-ksl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {featuresByCategory[activeCategory].title}
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              {featuresByCategory[activeCategory].subtitle}
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid lg:grid-cols-2 gap-8 mb-16">
            {featuresByCategory[activeCategory].features.map((feature, index) => (
              <div 
                key={index}
                className="bg-white dark:bg-dark-bg-secondary rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-200 dark:border-gray-700"
              >
                <div className={`w-16 h-16 bg-gradient-to-br ${categories.find(c => c.id === activeCategory).color} rounded-2xl flex items-center justify-center mb-6`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                  {feature.description}
                </p>
                <div className="space-y-2">
                  {feature.benefits.map((benefit, benefitIndex) => (
                    <div key={benefitIndex} className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-ksl-red flex-shrink-0" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Stats Section */}
          <div className="bg-gradient-to-br from-ksl-red to-ksl-red-dark rounded-3xl p-8 md:p-12 text-white">
            <div className="text-center mb-8">
              <h3 className="text-2xl md:text-3xl font-bold mb-4">
                Chiffres Clés
              </h3>
              <p className="text-ksl-gray-light text-lg">
                Notre plateforme en quelques chiffres
              </p>
            </div>
            <div className="grid md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold mb-2">99.9%</div>
                <div className="text-ksl-gray-light">Disponibilité</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold mb-2">500+</div>
                <div className="text-ksl-gray-light">Points Relais</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold mb-2">24/7</div>
                <div className="text-ksl-gray-light">Support Client</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold mb-2">50+</div>
                <div className="text-ksl-gray-light">Intégrations</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-br from-gray-900 to-ksl-black text-white py-20">
        <div className="container-ksl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Prêt à découvrir toutes nos fonctionnalités ?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Testez gratuitement notre plateforme et découvrez comment elle peut transformer votre logistique
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/contact"
              className="px-8 py-4 bg-ksl-red text-white rounded-xl hover:bg-ksl-red-dark transition-all duration-300 font-medium text-lg flex items-center justify-center space-x-2"
            >
              <span>Demander une démo</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/register"
              className="px-8 py-4 bg-white text-ksl-red rounded-xl hover:bg-gray-100 transition-all duration-300 font-medium text-lg"
            >
              Essai gratuit
            </Link>
          </div>
        </div>
    </section>
    </div>
  );
} 