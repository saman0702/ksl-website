import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  HelpCircle,
  MessageCircle,
  Phone,
  Mail,
  Clock,
  Search,
  FileText,
  Video,
  BookOpen,
  Users,
  Settings,
  Truck,
  Package,
  CreditCard,
  Shield,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  AlertCircle,
  Info,
  MapPin,
  Calendar,
  Star,
  Download,
  ExternalLink,
  Send,
  Headphones,
  Zap,
  Globe,
  Smartphone
} from 'lucide-react';

export default function Support() {
  const [activeFAQ, setActiveFAQ] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  // FAQ Data
  const faqData = [
    {
      category: "Expédition",
      questions: [
        {
          question: "Comment créer une expédition ?",
          answer: "Connectez-vous à votre compte, cliquez sur 'Nouvelle expédition', remplissez les informations du destinataire et sélectionnez vos options de livraison."
        },
        {
          question: "Quels sont les délais de livraison ?",
          answer: "Les délais varient selon la destination : 24-48h pour Abidjan, 2-3 jours pour les autres villes de Côte d'Ivoire, 3-5 jours pour l'Afrique de l'Ouest."
        },
        {
          question: "Comment suivre mon colis ?",
          answer: "Utilisez le numéro de suivi reçu par email ou SMS, ou connectez-vous à votre espace client pour voir le statut en temps réel."
        }
      ]
    },
    {
      category: "Paiement",
      questions: [
        {
          question: "Quels moyens de paiement acceptez-vous ?",
          answer: "Nous acceptons les paiements par carte bancaire, MTN Money, Orange Money, Moov Money et paiement à la livraison."
        },
        {
          question: "Les paiements sont-ils sécurisés ?",
          answer: "Oui, tous nos paiements sont sécurisés par des protocoles SSL et nos partenaires de paiement sont certifiés."
        },
        {
          question: "Puis-je payer à la livraison ?",
          answer: "Oui, le paiement à la livraison est disponible pour la plupart de nos services, avec des frais supplémentaires."
        }
      ]
    },
    {
      category: "Points Relais",
      questions: [
        {
          question: "Comment devenir point relais ?",
          answer: "Rendez-vous sur notre page 'Devenir Point Relais', remplissez le formulaire et notre équipe vous contactera sous 48h."
        },
        {
          question: "Quels sont les avantages d'être point relais ?",
          answer: "Revenus complémentaires, horaires flexibles, formation gratuite, support technique et commission attractive."
        },
        {
          question: "Comment gérer les colis reçus ?",
          answer: "Notre application mobile vous permet de scanner, notifier et gérer facilement tous les colis reçus."
        }
      ]
    }
  ];

  // Ressources d'aide
  const helpResources = [
    {
      icon: FileText,
      title: "Guide d'utilisation",
      description: "Tutoriels détaillés pour utiliser nos services",
      link: "#",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: Video,
      title: "Vidéos tutorielles",
      description: "Apprenez en regardant nos vidéos explicatives",
      link: "#",
      color: "from-purple-500 to-purple-600"
    },
    {
      icon: BookOpen,
      title: "Documentation API",
      description: "Intégrez nos services dans votre application",
      link: "#",
      color: "from-green-500 to-green-600"
    },
    {
      icon: Download,
      title: "Applications mobiles",
      description: "Téléchargez nos apps iOS et Android",
      link: "#",
      color: "from-orange-500 to-orange-600"
    }
  ];

  // Canaux de support
  const supportChannels = [
    {
      icon: Phone,
      title: "Téléphone",
      description: "Support technique 24/7",
      contact: "+225 27 22 49 89 00",
      availability: "Lun-Ven: 8h-18h",
      color: "from-green-500 to-green-600"
    },
    {
      icon: Mail,
      title: "Email",
      description: "Réponse sous 24h",
      contact: "support@katianlogistique.com",
      availability: "Tous les jours",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: MessageCircle,
      title: "Chat en ligne",
      description: "Support instantané",
      contact: "Disponible sur le site",
      availability: "Lun-Sam: 8h-20h",
      color: "from-purple-500 to-purple-600"
    },
    {
      icon: Users,
      title: "Réseaux sociaux",
      description: "Suivez-nous pour les actualités",
      contact: "@katianlogistique",
      availability: "Tous les jours",
      color: "from-pink-500 to-pink-600"
    }
  ];

  // Statistiques de support
  const supportStats = [
    { number: "24/7", label: "Support disponible", icon: Clock },
    { number: "< 2h", label: "Temps de réponse", icon: Zap },
    { number: "98%", label: "Satisfaction client", icon: Star },
    { number: "15+", label: "Langues supportées", icon: Globe }
  ];

  const handleFAQToggle = (index) => {
    setActiveFAQ(activeFAQ === index ? null : index);
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    // Logique d'envoi du formulaire
    console.log('Formulaire envoyé:', contactForm);
    alert('Votre message a été envoyé ! Nous vous répondrons dans les plus brefs délais.');
    setContactForm({ name: '', email: '', subject: '', message: '' });
  };

  const filteredFAQ = faqData.flatMap(category => 
    category.questions.filter(q => 
      q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.answer.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-dark-bg dark:to-dark-bg-secondary">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-ksl-red via-ksl-red-dark to-ksl-black text-white py-12 sm:py-16 md:py-20">
        <div className="container-ksl text-center px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold mb-4 sm:mb-6">
            Support & Aide
          </h1>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-ksl-gray-light mb-6 sm:mb-8 max-w-3xl mx-auto px-4">
            Nous sommes là pour vous aider. Trouvez rapidement des réponses ou contactez notre équipe
          </p>
          
          {/* Barre de recherche */}
          <div className="max-w-2xl mx-auto px-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
              <input
                type="text"
                placeholder="Rechercher dans l'aide..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-4 bg-white text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/20 text-sm sm:text-base"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Statistiques */}
      <section className="py-12 sm:py-16">
        <div className="container-ksl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
            {supportStats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-ksl-red to-ksl-red-dark rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <stat.icon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                  {stat.number}
                </div>
                <div className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Canaux de support */}
      <section className="bg-white dark:bg-dark-bg-secondary py-12 sm:py-16 md:py-20">
        <div className="container-ksl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Comment nous contacter ?
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Choisissez le canal qui vous convient le mieux
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
            {supportChannels.map((channel, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-dark-bg dark:to-dark-bg-tertiary rounded-2xl p-4 sm:p-6 md:p-8 border border-gray-200 dark:border-gray-700 text-center"
              >
                <div className={`w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br ${channel.color} rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6`}>
                  <channel.icon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {channel.title}
                </h3>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mb-3 sm:mb-4">
                  {channel.description}
                </p>
                <div className="text-ksl-red font-medium mb-2 text-sm sm:text-base">
                  {channel.contact}
                </div>
                <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                  {channel.availability}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-12 sm:py-16 md:py-20">
        <div className="container-ksl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Questions Fréquentes
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Trouvez rapidement des réponses à vos questions
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            {faqData.map((category, categoryIndex) => (
              <div key={categoryIndex} className="mb-8 sm:mb-12">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">
                  {category.category}
                </h3>
                <div className="space-y-3 sm:space-y-4">
                  {category.questions.map((item, questionIndex) => {
                    const globalIndex = categoryIndex * category.questions.length + questionIndex;
                    return (
                      <div
                        key={questionIndex}
                        className="bg-white dark:bg-dark-bg-secondary rounded-2xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700"
                      >
                        <button
                          onClick={() => handleFAQToggle(globalIndex)}
                          className="w-full px-4 sm:px-6 py-3 sm:py-4 text-left flex items-center justify-between hover:bg-gray-50 dark:hover:bg-dark-bg-tertiary transition-colors duration-200"
                        >
                          <span className="font-medium text-gray-900 dark:text-white text-sm sm:text-base">
                            {item.question}
                          </span>
                          {activeFAQ === globalIndex ? (
                            <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5 text-ksl-red" />
                          ) : (
                            <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                          )}
                        </button>
                        {activeFAQ === globalIndex && (
                          <div className="px-4 sm:px-6 pb-3 sm:pb-4">
                            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed">
                              {item.answer}
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ressources d'aide */}
      <section className="bg-white dark:bg-dark-bg-secondary py-12 sm:py-16 md:py-20">
        <div className="container-ksl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Ressources d'aide
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Guides, tutoriels et documentation pour vous accompagner
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
            {helpResources.map((resource, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-dark-bg dark:to-dark-bg-tertiary rounded-2xl p-4 sm:p-6 md:p-8 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2"
              >
                <div className={`w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br ${resource.color} rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6`}>
                  <resource.icon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
                  {resource.title}
                </h3>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mb-4 sm:mb-6">
                  {resource.description}
                </p>
                <a
                  href={resource.link}
                  className="inline-flex items-center text-ksl-red hover:text-ksl-red-dark transition-colors duration-200 text-sm sm:text-base"
                >
                  <span>Accéder</span>
                  <ArrowRight className="w-4 h-4 ml-2" />
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Formulaire de contact */}
      <section className="py-12 sm:py-16 md:py-20">
        <div className="container-ksl px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white dark:bg-dark-bg-secondary rounded-2xl shadow-lg p-4 sm:p-6 md:p-8 lg:p-12 border border-gray-200 dark:border-gray-700">
              <div className="text-center mb-6 sm:mb-8">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
                  Contactez notre équipe
                </h2>
                <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300">
                  Notre équipe est là pour vous aider
                </p>
              </div>

              <form onSubmit={handleContactSubmit} className="space-y-4 sm:space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Nom complet *
                    </label>
                    <input
                      type="text"
                      required
                      value={contactForm.name}
                      onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-dark-bg-tertiary text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-ksl-red text-sm sm:text-base"
                      placeholder="Votre nom"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={contactForm.email}
                      onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-dark-bg-tertiary text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-ksl-red text-sm sm:text-base"
                      placeholder="votre@email.com"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Sujet *
                  </label>
                  <select
                    required
                    value={contactForm.subject}
                    onChange={(e) => setContactForm({...contactForm, subject: e.target.value})}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-dark-bg-tertiary text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-ksl-red text-sm sm:text-base"
                  >
                    <option value="">Sélectionner un sujet</option>
                    <option value="expedition">Question sur l'expédition</option>
                    <option value="paiement">Problème de paiement</option>
                    <option value="suivi">Suivi de colis</option>
                    <option value="point-relais">Point relais</option>
                    <option value="technique">Support technique</option>
                    <option value="autre">Autre</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Message *
                  </label>
                  <textarea
                    required
                    rows={6}
                    value={contactForm.message}
                    onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-dark-bg-tertiary text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-ksl-red resize-none text-sm sm:text-base"
                    placeholder="Décrivez votre problème ou question..."
                  />
                </div>

                <div className="text-center">
                  <button
                    type="submit"
                    className="px-4 sm:px-6 md:px-8 py-3 sm:py-4 bg-ksl-red text-white rounded-xl hover:bg-ksl-red-dark transition-all duration-300 font-medium text-sm sm:text-base md:text-lg flex items-center justify-center space-x-2 mx-auto"
                  >
                    <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span>Envoyer le message</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 