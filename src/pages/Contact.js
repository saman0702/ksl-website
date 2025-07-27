import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  MessageCircle,
  Send,
  CheckCircle,
  AlertCircle,
  Building,
  Users,
  Globe,
  Smartphone,
  ArrowRight,
  ExternalLink,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  Headphones,
  Zap,
  Shield,
  Heart
} from 'lucide-react';

export default function Contact() {
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  // Informations de contact
  const contactInfo = [
    {
      icon: MapPin,
      title: "Adresse",
      details: "Abidjan, Côte d'Ivoire",
      description: "Siège social et centre opérationnel",
      color: "from-red-500 to-red-600"
    },
    {
      icon: Phone,
      title: "Téléphone",
      details: "+225 27 22 49 89 00",
      description: "Support client et commercial",
      color: "from-green-500 to-green-600"
    },
    {
      icon: Mail,
      title: "Email",
      details: "contact@katianlogistique.com",
      description: "Réponse sous 24h",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: Clock,
      title: "Horaires",
      details: "Lun-Ven: 8h-18h",
      description: "Support technique disponible",
      color: "from-purple-500 to-purple-600"
    }
  ];

  // Départements
  const departments = [
    {
      icon: Users,
      title: "Service Client",
      description: "Questions générales et support",
      email: "client@katianlogistique.com",
      phone: "+225 27 22 49 89 01"
    },
    {
      icon: Building,
      title: "Commercial",
      description: "Partenariats et ventes",
      email: "commercial@katianlogistique.com",
      phone: "+225 27 22 49 89 02"
    },
    {
      icon: Headphones,
      title: "Support Technique",
      description: "Assistance technique et API",
      email: "tech@katianlogistique.com",
      phone: "+225 27 22 49 89 03"
    },
    {
      icon: Shield,
      title: "Sécurité",
      description: "Sécurité et conformité",
      email: "security@katianlogistique.com",
      phone: "+225 27 22 49 89 04"
    }
  ];

  // Réseaux sociaux
  const socialMedia = [
    {
      name: "Facebook",
      icon: Facebook,
      url: "https://facebook.com/katianlogistique",
      color: "from-blue-600 to-blue-700"
    },
    {
      name: "Twitter",
      icon: Twitter,
      url: "https://twitter.com/katianlogistique",
      color: "from-sky-500 to-sky-600"
    },
    {
      name: "Instagram",
      icon: Instagram,
      url: "https://instagram.com/katianlogistique",
      color: "from-pink-500 to-pink-600"
    },
    {
      name: "LinkedIn",
      icon: Linkedin,
      url: "https://linkedin.com/company/katianlogistique",
      color: "from-blue-700 to-blue-800"
    },
    {
      name: "YouTube",
      icon: Youtube,
      url: "https://youtube.com/@katianlogistique",
      color: "from-red-600 to-red-700"
    }
  ];

  // Statistiques
  const stats = [
    { number: "24/7", label: "Support disponible", icon: Clock },
    { number: "< 2h", label: "Temps de réponse", icon: Zap },
    { number: "98%", label: "Satisfaction client", icon: Heart },
    { number: "15+", label: "Langues supportées", icon: Globe }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      // Simulation d'envoi
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('Formulaire envoyé:', contactForm);
      setSubmitStatus('success');
      setContactForm({
        name: '',
        email: '',
        phone: '',
        company: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-dark-bg dark:to-dark-bg-secondary">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-ksl-red via-ksl-red-dark to-ksl-black text-white py-20">
        <div className="container-ksl text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Contactez-nous
          </h1>
          <p className="text-xl md:text-2xl text-ksl-gray-light mb-8 max-w-3xl mx-auto">
            Notre équipe est là pour vous accompagner. N'hésitez pas à nous contacter pour toute question
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => document.getElementById('formulaire').scrollIntoView({ behavior: 'smooth' })}
              className="px-8 py-4 bg-white text-ksl-red rounded-xl hover:bg-gray-100 transition-all duration-300 font-medium text-lg flex items-center justify-center space-x-2"
            >
              <span>Nous écrire</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            <a
              href="tel:+2252722498900"
              className="px-8 py-4 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-all duration-300 font-medium text-lg flex items-center justify-center space-x-2"
            >
              <Phone className="w-5 h-5" />
              <span>Appeler maintenant</span>
            </a>
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

      {/* Informations de contact */}
      <section className="bg-white dark:bg-dark-bg-secondary py-20">
        <div className="container-ksl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Nos Coordonnées
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Plusieurs façons de nous joindre
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {contactInfo.map((info, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-dark-bg dark:to-dark-bg-tertiary rounded-2xl p-8 border border-gray-200 dark:border-gray-700 text-center"
              >
                <div className={`w-16 h-16 bg-gradient-to-br ${info.color} rounded-2xl flex items-center justify-center mx-auto mb-6`}>
                  <info.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {info.title}
                </h3>
                <div className="text-ksl-red font-medium mb-2">
                  {info.details}
                </div>
                <p className="text-gray-600 dark:text-gray-300">
                  {info.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Départements */}
      <section className="py-20">
        <div className="container-ksl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Nos Départements
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Contactez directement le département concerné
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {departments.map((dept, index) => (
              <div
                key={index}
                className="bg-white dark:bg-dark-bg-secondary rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-200 dark:border-gray-700"
              >
                <div className="p-8 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-ksl-red to-ksl-red-dark rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <dept.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {dept.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    {dept.description}
                  </p>
                  <div className="space-y-3">
                    <a
                      href={`mailto:${dept.email}`}
                      className="block text-ksl-red hover:text-ksl-red-dark transition-colors duration-200"
                    >
                      {dept.email}
                    </a>
                    <a
                      href={`tel:${dept.phone}`}
                      className="block text-gray-600 dark:text-gray-400 hover:text-ksl-red transition-colors duration-200"
                    >
                      {dept.phone}
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Formulaire de contact */}
      <section id="formulaire" className="bg-white dark:bg-dark-bg-secondary py-20">
        <div className="container-ksl">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Envoyez-nous un message
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300">
                Notre équipe vous répondra dans les plus brefs délais
              </p>
            </div>

            <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-dark-bg dark:to-dark-bg-tertiary rounded-2xl shadow-lg p-8 md:p-12">
              {submitStatus === 'success' && (
                <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-xl flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5" />
                  <span>Votre message a été envoyé avec succès ! Nous vous répondrons dans les plus brefs délais.</span>
                </div>
              )}

              {submitStatus === 'error' && (
                <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-xl flex items-center space-x-2">
                  <AlertCircle className="w-5 h-5" />
                  <span>Une erreur s'est produite. Veuillez réessayer ou nous contacter directement.</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Nom complet *
                    </label>
                    <input
                      type="text"
                      required
                      value={contactForm.name}
                      onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-dark-bg-secondary text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-ksl-red"
                      placeholder="Votre nom complet"
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
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-dark-bg-secondary text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-ksl-red"
                      placeholder="votre@email.com"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Téléphone
                    </label>
                    <input
                      type="tel"
                      value={contactForm.phone}
                      onChange={(e) => setContactForm({...contactForm, phone: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-dark-bg-secondary text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-ksl-red"
                      placeholder="+225 XX XX XX XX XX"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Entreprise
                    </label>
                    <input
                      type="text"
                      value={contactForm.company}
                      onChange={(e) => setContactForm({...contactForm, company: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-dark-bg-secondary text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-ksl-red"
                      placeholder="Nom de votre entreprise"
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
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-dark-bg-secondary text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-ksl-red"
                  >
                    <option value="">Sélectionner un sujet</option>
                    <option value="demande-info">Demande d'information</option>
                    <option value="devis">Demande de devis</option>
                    <option value="partenariat">Partenariat</option>
                    <option value="support">Support technique</option>
                    <option value="reclamation">Réclamation</option>
                    <option value="suggestion">Suggestion</option>
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
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-dark-bg-secondary text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-ksl-red resize-none"
                    placeholder="Décrivez votre demande ou question..."
                  />
                </div>

                <div className="text-center">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-8 py-4 bg-ksl-red text-white rounded-xl hover:bg-ksl-red-dark transition-all duration-300 font-medium text-lg flex items-center justify-center space-x-2 mx-auto disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Envoi en cours...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        <span>Envoyer le message</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Réseaux sociaux */}
      <section className="py-20">
        <div className="container-ksl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Suivez-nous
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Restez connecté avec KSL sur les réseaux sociaux
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 max-w-4xl mx-auto">
            {socialMedia.map((social, index) => (
              <a
                key={index}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group"
              >
                <div className={`w-16 h-16 bg-gradient-to-br ${social.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <social.icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-center">
                  <div className="font-medium text-gray-900 dark:text-white group-hover:text-ksl-red transition-colors duration-200">
                    {social.name}
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
} 