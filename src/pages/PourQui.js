import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  User, 
  Building, 
  ShoppingCart, 
  MapPin, 
  Truck, 
  ArrowRight, 
  CheckCircle, 
  Star,
  Users,
  Package,
  Clock,
  Shield,
  Zap,
  Globe,
  BarChart3,
  CreditCard,
  Smartphone,
  TrendingUp,
  Target,
  Award,
  Heart,
  DollarSign
} from 'lucide-react';

export default function PourQui() {
  const [activeCategory, setActiveCategory] = useState('particuliers');

  const categories = [
    {
      id: 'particuliers',
      title: 'Particuliers',
      icon: User,
      color: 'from-blue-500 to-blue-600',
      description: 'Envoyez et recevez vos colis en toute simplicité'
    },
    {
      id: 'entreprises',
      title: 'Entreprises',
      icon: Building,
      color: 'from-purple-500 to-purple-600',
      description: 'Optimisez votre logistique B2B'
    },
    {
      id: 'ecommerçants',
      title: 'E-commerçants',
      icon: ShoppingCart,
      color: 'from-green-500 to-green-600',
      description: 'Boostez vos ventes en ligne'
    },
    {
      id: 'points-relais',
      title: 'Points Relais',
      icon: MapPin,
      color: 'from-orange-500 to-orange-600',
      description: 'Gérez votre point de retrait'
    },
    {
      id: 'transporteurs',
      title: 'Transporteurs',
      icon: Truck,
      color: 'from-red-500 to-red-600',
      description: 'Intégrez notre réseau logistique'
    }
  ];

  const contentByCategory = {
    particuliers: {
      title: 'Solutions pour Particuliers',
      subtitle: 'Envoyez et recevez vos colis en toute simplicité avec nos services adaptés',
      hero: {
        title: 'Logistique simplifiée pour tous',
        description: 'Que vous envoyiez un cadeau à un proche ou que vous receviez vos achats en ligne, Katian vous accompagne à chaque étape.',
        image: '/katian-logo.png'
      },
      needs: [
        {
          icon: Package,
          title: 'Envoi Simple',
          description: 'Créez vos étiquettes en quelques clics et déposez vos colis dans nos points relais'
        },
        {
          icon: Truck,
          title: 'Suivi en Temps Réel',
          description: 'Suivez vos envois étape par étape avec des notifications personnalisées'
        },
        {
          icon: MapPin,
          title: 'Points Relais Proches',
          description: 'Plus de 500 points relais répartis sur tout le territoire pour votre commodité'
        },
        {
          icon: CreditCard,
          title: 'Paiement Sécurisé',
          description: 'Paiement en ligne sécurisé ou à la livraison selon vos préférences'
        }
      ],
      benefits: [
        'Tarifs transparents sans surprise',
        'Horaires flexibles 7j/7',
        'Service client réactif',
        'Assurance incluse automatiquement'
      ],
      testimonials: [
        {
          name: 'Marie D.',
          role: 'Particulière',
          content: 'J\'envoie régulièrement des colis à ma famille. Avec Katian, c\'est simple, rapide et pas cher !',
          rating: 5
        },
        {
          name: 'Thomas L.',
          role: 'Étudiant',
          content: 'Les points relais sont partout et les horaires sont parfaits pour mes études.',
          rating: 5
        }
      ]
    },
    entreprises: {
      title: 'Solutions pour Entreprises',
      subtitle: 'Optimisez votre logistique B2B avec nos solutions professionnelles',
      hero: {
        title: 'Logistique B2B optimisée',
        description: 'Gérez vos flux logistiques, optimisez vos coûts et améliorez votre service client avec nos solutions dédiées aux entreprises.',
        image: '/katian-logo.png'
      },
      needs: [
        {
          icon: Building,
          title: 'Gestion Centralisée',
          description: 'Pilotez toutes vos expéditions depuis une interface unique et intuitive'
        },
        {
          icon: BarChart3,
          title: 'Analytics Avancés',
          description: 'Analysez vos performances logistiques et optimisez vos processus'
        },
        {
          icon: Shield,
          title: 'Sécurité Renforcée',
          description: 'Protocoles de sécurité stricts pour vos marchandises sensibles'
        },
        {
          icon: Globe,
          title: 'Couverture Nationale',
          description: 'Réseau de distribution couvrant tout le territoire national'
        }
      ],
      benefits: [
        'Réduction de 30% des coûts logistiques',
        'Amélioration de la satisfaction client',
        'Traçabilité complète des marchandises',
        'Interfaces d\'intégration API'
      ],
      testimonials: [
        {
          name: 'Sophie M.',
          role: 'Directrice Logistique',
          content: 'Katian nous a permis d\'optimiser nos coûts de 25% tout en améliorant notre service client.',
          rating: 5
        },
        {
          name: 'Marc R.',
          role: 'Responsable Supply Chain',
          content: 'L\'intégration API est parfaite et le support technique est excellent.',
          rating: 5
        }
      ]
    },
    'ecommerçants': {
      title: 'Solutions pour E-commerçants',
      subtitle: 'Boostez vos ventes avec nos solutions e-commerce intégrées',
      hero: {
        title: 'E-commerce optimisé',
        description: 'Intégrez facilement nos solutions à votre boutique en ligne et offrez une expérience de livraison exceptionnelle à vos clients.',
        image: '/katian-logo.png'
      },
      needs: [
        {
          icon: ShoppingCart,
          title: 'Intégration E-commerce',
          description: 'Connectez votre boutique en ligne à notre plateforme en quelques clics'
        },
        {
          icon: Users,
          title: 'Expérience Client',
          description: 'Offrez à vos clients un suivi en temps réel et des options de livraison flexibles'
        },
        {
          icon: CreditCard,
          title: 'Paiement à la  Livraison (PAL)',
          description: 'Augmentez vos ventes avec le paiement à la livraison sécurisé'
        },
        {
          icon: TrendingUp,
          title: 'Conversion Optimisée',
          description: 'Réduisez l\'abandon de panier avec des options de livraison transparentes'
        }
      ],
      benefits: [
        'Augmentation de 40% du taux de conversion',
        'Réduction de 60% des abandons de panier',
        'Amélioration de la satisfaction client',
        'Support dédié e-commerce 24/7'
      ],
      testimonials: [
        {
          name: 'Julie K.',
          role: 'Fondatrice Boutique en ligne',
          content: 'Depuis que j\'utilise Katian, mes ventes ont augmenté de 35% et mes clients sont ravis !',
          rating: 5
        },
        {
          name: 'David P.',
          role: 'E-commerçant',
          content: 'L\'intégration est simple et le service client est au top. Je recommande !',
          rating: 5
        }
      ]
    },
    'points-relais': {
      title: 'Solutions pour Points Relais',
      subtitle: 'Rejoignez notre réseau et développez votre activité',
      hero: {
        title: 'Devenez Point Relais',
        description: 'Transformez votre commerce en point relais et générez des revenus supplémentaires tout en rendant service à votre communauté.',
        image: '/katian-logo.png'
      },
      needs: [
        {
          icon: MapPin,
          title: 'Kit Point Relais',
          description: 'Recevez tout le matériel nécessaire pour gérer les colis efficacement'
        },
        {
          icon: Smartphone,
          title: 'Application Mobile',
          description: 'Gérez vos dépôts et retraits depuis votre smartphone'
        },
        {
          icon: BarChart3,
          title: 'Dashboard Relais',
          description: 'Suivez vos performances et vos revenus en temps réel'
        },
        {
          icon: Users,
          title: 'Formation Complète',
          description: 'Bénéficiez d\'une formation complète et d\'un accompagnement personnalisé'
        }
      ],
      benefits: [
        'Revenus supplémentaires garantis',
        'Augmentation du trafic dans votre commerce',
        'Support technique dédié',
        'Formation et accompagnement inclus'
      ],
      testimonials: [
        {
          name: 'Fatou S.',
          role: 'Commerçante',
          content: 'Être point relais Katian m\'a permis d\'augmenter mes revenus de 20% !',
          rating: 5
        },
        {
          name: 'Moussa D.',
          role: 'Gérant Tabac',
          content: 'L\'application est simple et le support est excellent. Je recommande !',
          rating: 5
        }
      ]
    },
    transporteurs: {
      title: 'Solutions pour Transporteurs',
      subtitle: 'Intégrez notre réseau et développez votre activité',
      hero: {
        title: 'Partenaire Transporteur',
        description: 'Rejoignez notre réseau de transporteurs partenaires et bénéficiez d\'un volume d\'affaires garanti avec notre plateforme.',
        image: '/katian-logo.png'
      },
      needs: [
        {
          icon: Truck,
          title: 'Intégration API',
          description: 'Connectez votre système à notre plateforme via des APIs robustes'
        },
        {
          icon: Globe,
          title: 'Couverture Étendue',
          description: 'Développez votre activité sur de nouveaux territoires'
        },
        {
          icon: BarChart3,
          title: 'Analytics Performance',
          description: 'Analysez vos performances et optimisez vos tournées'
        },
        {
          icon: Shield,
          title: 'Sécurité & Assurance',
          description: 'Bénéficiez de nos protocoles de sécurité et d\'assurance'
        }
      ],
      benefits: [
        'Volume d\'affaires garanti',
        'Paiements rapides et sécurisés',
        'Support technique dédié',
        'Développement de nouveaux marchés'
      ],
      testimonials: [
        {
          name: 'Amadou B.',
          role: 'Directeur Transport',
          content: 'Katian nous a permis de doubler notre activité en 6 mois !',
          rating: 5
        },
        {
          name: 'Aissatou F.',
          role: 'Responsable Logistique',
          content: 'L\'intégration a été simple et le volume d\'affaires est au rendez-vous.',
          rating: 5
        }
      ]
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star 
        key={i} 
        className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
      />
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-dark-bg dark:to-dark-bg-secondary">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-ksl-red via-ksl-red-dark to-ksl-black text-white py-20">
        <div className="container-ksl text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Pour qui ?
          </h1>
          <p className="text-xl md:text-2xl text-ksl-gray-light mb-8 max-w-3xl mx-auto">
            Découvrez nos solutions adaptées à chaque type d'utilisateur
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

      {/* Content Section */}
      <section className="py-20">
        <div className="container-ksl">
          {/* Hero Content */}
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {contentByCategory[activeCategory].title}
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              {contentByCategory[activeCategory].subtitle}
            </p>
          </div>

          {/* Hero Card */}
          <div className="bg-white dark:bg-dark-bg-secondary rounded-3xl p-8 md:p-12 mb-16 shadow-lg">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-6">
                  {contentByCategory[activeCategory].hero.title}
                </h3>
                <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed mb-8">
                  {contentByCategory[activeCategory].hero.description}
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    to="/contact"
                    className="px-6 py-3 bg-ksl-red text-white rounded-xl hover:bg-ksl-red-dark transition-all duration-300 font-medium flex items-center justify-center space-x-2"
                  >
                    <span>Nous contacter</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    to="/solutions"
                    className="px-6 py-3 border border-ksl-red text-ksl-red rounded-xl hover:bg-ksl-red hover:text-white transition-all duration-300 font-medium"
                  >
                    Découvrir nos solutions
                  </Link>
                </div>
              </div>
              <div className="flex justify-center">
                <img 
                  src={contentByCategory[activeCategory].hero.image} 
                  alt="Katian" 
                  className="w-64 h-64 object-contain"
                />
              </div>
            </div>
          </div>

          {/* Needs Grid */}
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {contentByCategory[activeCategory].needs.map((need, index) => (
              <div 
                key={index}
                className="bg-white dark:bg-dark-bg-secondary rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-200 dark:border-gray-700"
              >
                <div className={`w-16 h-16 bg-gradient-to-br ${categories.find(c => c.id === activeCategory).color} rounded-2xl flex items-center justify-center mb-6`}>
                  <need.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  {need.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {need.description}
                </p>
              </div>
            ))}
          </div>

          {/* Benefits Section */}
          <div className="bg-gradient-to-br from-ksl-red to-ksl-red-dark rounded-3xl p-8 md:p-12 text-white mb-16">
            <div className="text-center mb-8">
              <h3 className="text-2xl md:text-3xl font-bold mb-4">
                Avantages pour {categories.find(c => c.id === activeCategory).title}
              </h3>
              <p className="text-ksl-gray-light text-lg">
                Découvrez pourquoi nos solutions sont parfaites pour vous
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {contentByCategory[activeCategory].benefits.map((benefit, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <CheckCircle className="w-6 h-6 text-white mt-1 flex-shrink-0" />
                  <span className="text-lg">{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Testimonials */}
          <div className="grid md:grid-cols-2 gap-8">
            {contentByCategory[activeCategory].testimonials.map((testimonial, index) => (
              <div 
                key={index}
                className="bg-white dark:bg-dark-bg-secondary rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-center mb-4">
                  <div className="flex mr-4">
                    {renderStars(testimonial.rating)}
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-6 italic">
                  "{testimonial.content}"
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-ksl-red to-ksl-red-dark rounded-full flex items-center justify-center mr-4">
                    <span className="text-white font-bold text-lg">
                      {testimonial.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {testimonial.role}
                    </div>
                  </div>
                </div>
          </div>
        ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-br from-gray-900 to-ksl-black text-white py-20">
        <div className="container-ksl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Prêt à rejoindre katian logistique ?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Que vous soyez particulier, entreprise ou e-commerçant, nous avons la solution qu'il vous faut
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/contact"
              className="px-8 py-4 bg-ksl-red text-white rounded-xl hover:bg-ksl-red-dark transition-all duration-300 font-medium text-lg flex items-center justify-center space-x-2"
            >
              <span>Nous contacter</span>
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