import React from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Target,
  Eye,
  Heart,
  Award,
  Star,
  TrendingUp,
  Globe,
  Truck,
  Package,
  MapPin,
  Phone,
  Mail,
  ArrowRight,
  CheckCircle,
  Shield,
  Zap,
  Leaf,
  Handshake,
  Clock,
  Calendar,
  Award as Trophy,
  Users as Team,
  Building,
  Lightbulb,
  Rocket,
  Compass
} from 'lucide-react';

export default function APropos() {
  // Données de l'équipe
  const teamMembers = [
    {
      name: "Yao Joseph Mensah",
      role: "Fondateur & CEO",
      avatar: "👨‍💼",
      description: "Expert en logistique avec 10+ ans d'expérience",
      expertise: ["Stratégie", "Leadership", "Innovation"]
    },
    {
      name: "Sarah Koné",
      role: "Directrice Technique",
      avatar: "👩‍💻",
      description: "Spécialiste en développement et solutions digitales",
      expertise: ["Tech", "Architecture", "Innovation"]
    },
    {
      name: "Ahmed Ouattara",
      role: "Directeur Commercial",
      avatar: "👨‍💼",
      description: "Expert en développement commercial et partenariats",
      expertise: ["Ventes", "Partenariats", "Stratégie"]
    },
    {
      name: "Fatou Diallo",
      role: "Responsable Client",
      avatar: "👩‍💼",
      description: "Passionnée par l'expérience client et la satisfaction",
      expertise: ["Service Client", "Relation", "Qualité"]
    }
  ];

  // Valeurs de l'entreprise
  const values = [
    {
      icon: Heart,
      title: "Passion",
      description: "Nous sommes passionnés par l'excellence et l'innovation",
      color: "from-red-500 to-red-600"
    },
    {
      icon: Shield,
      title: "Confiance",
      description: "La confiance de nos clients est notre plus grande récompense",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: Zap,
      title: "Innovation",
      description: "Nous repoussons les limites de la logistique moderne",
      color: "from-purple-500 to-purple-600"
    },
    {
      icon: Leaf,
      title: "Durabilité",
      description: "Nous nous engageons pour un avenir plus vert",
      color: "from-green-500 to-green-600"
    }
  ];

  // Statistiques
  const stats = [
    { number: "2023", label: "Année de création", icon: Calendar },
    { number: "10K+", label: "Livraisons effectuées", icon: Package },
    { number: "500+", label: "Clients satisfaits", icon: Users },
    { number: "15+", label: "Villes couvertes", icon: MapPin }
  ];

  // Histoire de l'entreprise
  const timeline = [
    {
      year: "2023",
      title: "Création de KSL",
      description: "Lancement de la plateforme logistique innovante",
      icon: Rocket
    },
    {
      year: "2023",
      title: "Premier partenariat",
      description: "Collaboration avec MTN pour les paiements mobiles",
      icon: Handshake
    },
    {
      year: "2024",
      title: "Expansion",
      description: "Développement du réseau de points relais",
      icon: TrendingUp
    },
    {
      year: "2024",
      title: "Innovation",
      description: "Intégration de solutions électriques avec Eva",
      icon: Zap
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-dark-bg dark:to-dark-bg-secondary">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-ksl-red via-ksl-red-dark to-ksl-black text-white py-20">
        <div className="container-ksl text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            À propos de KSL
          </h1>
          <p className="text-xl md:text-2xl text-ksl-gray-light mb-8 max-w-3xl mx-auto">
            Katian Service Logistique - Votre partenaire de confiance pour une logistique innovante et durable
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => document.getElementById('histoire').scrollIntoView({ behavior: 'smooth' })}
              className="px-8 py-4 bg-white text-ksl-red rounded-xl hover:bg-gray-100 transition-all duration-300 font-medium text-lg flex items-center justify-center space-x-2"
            >
              <span>Découvrir notre histoire</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            <Link
              to="/contact"
              className="px-8 py-4 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-all duration-300 font-medium text-lg"
            >
              Nous contacter
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

      {/* Mission & Vision */}
      <section className="bg-white dark:bg-dark-bg-secondary py-20">
        <div className="container-ksl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="w-16 h-16 bg-gradient-to-br from-ksl-red to-ksl-red-dark rounded-2xl flex items-center justify-center mb-6">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                Notre Mission
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                Rendre la logistique accessible, simple et durable pour tous en Côte d'Ivoire. 
                Nous connectons les entreprises, les particuliers et les transporteurs pour 
                créer un écosystème logistique innovant et efficace.
              </p>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-500" />
                  <span className="text-gray-700 dark:text-gray-300">Livraison rapide et sécurisée</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-500" />
                  <span className="text-gray-700 dark:text-gray-300">Solutions technologiques innovantes</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-500" />
                  <span className="text-gray-700 dark:text-gray-300">Impact environnemental positif</span>
                </div>
              </div>
            </div>
            
            <div>
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6">
                <Eye className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                Notre Vision
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                Devenir le leader de la logistique intelligente en Afrique de l'Ouest, 
                en créant un réseau de solutions durables qui connecte les communautés 
                et favorise le développement économique de la région.
              </p>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-6 h-6 text-blue-500" />
                  <span className="text-gray-700 dark:text-gray-300">Expansion régionale</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-6 h-6 text-blue-500" />
                  <span className="text-gray-700 dark:text-gray-300">Innovation continue</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-6 h-6 text-blue-500" />
                  <span className="text-gray-700 dark:text-gray-300">Impact social positif</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Histoire */}
      <section id="histoire" className="py-20">
        <div className="container-ksl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Notre Histoire
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Un parcours d'innovation et de croissance depuis notre création
            </p>
          </div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 transform -translate-x-px h-full w-0.5 bg-gradient-to-b from-ksl-red to-ksl-red-dark"></div>
            
            <div className="space-y-12">
              {timeline.map((item, index) => (
                <div key={index} className={`flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                  <div className="w-1/2 px-8">
                    <div className={`bg-white dark:bg-dark-bg-secondary rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 ${index % 2 === 0 ? 'text-right' : 'text-left'}`}>
                      <div className="text-2xl font-bold text-ksl-red mb-2">{item.year}</div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{item.title}</h3>
                      <p className="text-gray-600 dark:text-gray-300">{item.description}</p>
                    </div>
                  </div>
                  
                  <div className="w-16 h-16 bg-gradient-to-br from-ksl-red to-ksl-red-dark rounded-full flex items-center justify-center z-10 relative">
                    <item.icon className="w-8 h-8 text-white" />
                  </div>
                  
                  <div className="w-1/2 px-8"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Valeurs */}
      <section className="bg-white dark:bg-dark-bg-secondary py-20">
        <div className="container-ksl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Nos Valeurs
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Les principes qui guident nos actions au quotidien
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-dark-bg dark:to-dark-bg-tertiary rounded-2xl p-8 border border-gray-200 dark:border-gray-700 text-center"
              >
                <div className={`w-16 h-16 bg-gradient-to-br ${value.color} rounded-2xl flex items-center justify-center mx-auto mb-6`}>
                  <value.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  {value.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Équipe */}
      <section className="py-20">
        <div className="container-ksl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Notre Équipe
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Des experts passionnés qui font de KSL une réalité
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <div
                key={index}
                className="bg-white dark:bg-dark-bg-secondary rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-200 dark:border-gray-700"
              >
                <div className="p-8 text-center">
                  <div className="text-6xl mb-4">{member.avatar}</div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {member.name}
                  </h3>
                  <div className="text-ksl-red font-medium mb-4">{member.role}</div>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    {member.description}
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {member.expertise.map((skill, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-ksl-red/10 text-ksl-red rounded-full text-sm"
                      >
                        {skill}
                      </span>
                    ))}
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
            Rejoignez l'aventure KSL
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Découvrez nos services et faites partie de notre écosystème logistique innovant
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/solutions"
              className="px-8 py-4 bg-ksl-red text-white rounded-xl hover:bg-ksl-red-dark transition-all duration-300 font-medium text-lg flex items-center justify-center space-x-2"
            >
              <span>Découvrir nos solutions</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/contact"
              className="px-8 py-4 bg-white text-ksl-red rounded-xl hover:bg-gray-100 transition-all duration-300 font-medium text-lg"
            >
              Nous contacter
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
} 