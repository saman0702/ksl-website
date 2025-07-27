import React from 'react';
import { Link } from 'react-router-dom';
import {
  Truck,
  Bike,
  Building,
  Globe,
  Star,
  Award,
  Users,
  Package,
  ArrowRight,
  CheckCircle,
  MapPin,
  Phone,
  Mail,
  ExternalLink,
  Shield,
  Zap,
  Heart,
  Target,
  TrendingUp,
  Handshake
} from 'lucide-react';

export default function Partenaires() {
  // Données des partenaires
  const transportPartners = [
    {
      name: "MTN Côte d'Ivoire",
      logo: "📱",
      description: "Leader des télécommunications en Côte d'Ivoire",
      services: ["Paiement mobile", "Services financiers", "Connectivité"],
      rating: 5,
      location: "Abidjan, Côte d'Ivoire",
      website: "https://mtn.ci",
      isCurrent: true
    },
    {
      name: "Eva",
      logo: "🚗",
      description: "Plateforme de transport et livraison innovante",
      services: ["Transport urbain", "Livraison express", "Logistique"],
      rating: 5,
      location: "Abidjan, Côte d'Ivoire",
      website: "https://eva.ci",
      isCurrent: true
    }
  ];



  const benefits = [
    {
      icon: Handshake,
      title: "Partenariats Stratégiques",
      description: "Collaborations durables avec des leaders du secteur",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: Shield,
      title: "Qualité Garantie",
      description: "Partenaires sélectionnés selon des critères stricts",
      color: "from-green-500 to-green-600"
    },
    {
      icon: Zap,
      title: "Innovation Continue",
      description: "Technologies et solutions de pointe",
      color: "from-purple-500 to-purple-600"
    },
    {
      icon: Globe,
      title: "Couverture Régionale",
      description: "Réseau étendu en Afrique de l'Ouest",
      color: "from-orange-500 to-orange-600"
    }
  ];

  const stats = [
    { number: "2", label: "Partenaires Actifs", icon: Handshake },
    { number: "1", label: "Pays Couvert", icon: MapPin },
    { number: "10K+", label: "Livraisons/Mois", icon: Package },
    { number: "98%", label: "Satisfaction Client", icon: Star }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-dark-bg dark:to-dark-bg-secondary">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-ksl-red via-ksl-red-dark to-ksl-black text-white py-20">
        <div className="container-ksl text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Nos Partenaires
          </h1>
          <p className="text-xl md:text-2xl text-ksl-gray-light mb-8 max-w-3xl mx-auto">
            Découvrez notre réseau de partenaires stratégiques qui nous permettent de vous offrir des services logistiques d'excellence
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => document.getElementById('partenaires').scrollIntoView({ behavior: 'smooth' })}
              className="px-8 py-4 bg-white text-ksl-red rounded-xl hover:bg-gray-100 transition-all duration-300 font-medium text-lg flex items-center justify-center space-x-2"
            >
              <span>Découvrir nos partenaires</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            <Link
              to="/contact"
              className="px-8 py-4 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-all duration-300 font-medium text-lg"
            >
              Devenir partenaire
            </Link>
          </div>
        </div>
      </section>

      {/* Statistiques */}
      <section className="py-16">
        <div className="container-ksl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-ksl-red to-ksl-red-dark rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 dark:text-gray-300">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Avantages des partenariats */}
      <section className="bg-white dark:bg-dark-bg-secondary py-20">
        <div className="container-ksl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Pourquoi nos partenariats ?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Des collaborations stratégiques pour un service d'excellence
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-dark-bg dark:to-dark-bg-tertiary rounded-2xl p-8 border border-gray-200 dark:border-gray-700"
              >
                <div className={`w-16 h-16 bg-gradient-to-br ${benefit.color} rounded-2xl flex items-center justify-center mb-6`}>
                  <benefit.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  {benefit.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partenaires Transport */}
      <section id="partenaires" className="py-20">
        <div className="container-ksl">
          <div className="text-center mb-16">
            <div className="w-16 h-16 bg-gradient-to-br from-ksl-red to-ksl-red-dark rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Truck className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Nos Partenaires
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Des partenaires de confiance pour des services d'excellence
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {transportPartners.map((partner, index) => (
              <div
                key={index}
                className="bg-white dark:bg-dark-bg-secondary rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 relative border border-gray-200 dark:border-gray-700"
              >
                {partner.isCurrent && (
                  <div className="absolute -top-3 -right-3 bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-1 rounded-full text-sm font-medium shadow-lg">
                    Partenaire Actuel
                  </div>
                )}
                <div className="p-8">
                  <div className="flex items-center justify-between mb-6">
                    <div className="text-4xl">{partner.logo}</div>
                    <div className="flex items-center">
                      {[...Array(partner.rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                      ))}
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                    {partner.name}
                  </h3>
                  
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    {partner.description}
                  </p>
                  
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-4">
                    <MapPin className="w-4 h-4 mr-2" />
                    {partner.location}
                  </div>
                  
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Services :</h4>
                    <div className="flex flex-wrap gap-2">
                      {partner.services.map((service, i) => (
                        <span
                          key={i}
                          className="px-3 py-1 bg-ksl-red/10 text-ksl-red rounded-full text-sm"
                        >
                          {service}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <a
                    href={partner.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-ksl-red hover:text-ksl-red-dark transition-colors duration-200"
                  >
                    <span>Visiter le site</span>
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </a>
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
            Devenez notre partenaire
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Rejoignez notre réseau de partenaires et développez votre activité avec KSL
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
              to="/devenir-relais"
              className="px-8 py-4 bg-white text-ksl-red rounded-xl hover:bg-gray-100 transition-all duration-300 font-medium text-lg"
            >
              Devenir point relais
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
} 