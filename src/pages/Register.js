import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { userAPI, authAPI } from '../services/api';
import { 
  User, 
  Mail, 
  Phone, 
  Building, 
  MapPin, 
  ArrowRight,
  CheckCircle
} from 'lucide-react';

export default function Register() {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    username: '',
    email: '',
    phone: '',
    role: '',
    statut: 'inactif', // Sera mis à jour selon le rôle
    business_type: '',
    business_type_other: '',
    address: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [currentStep, setCurrentStep] = useState(1);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Si le rôle change, mettre à jour le statut automatiquement
    if (name === 'role') {
      let newStatut = 'inactif';
      if (value === 'relay_point') {
        newStatut = 'inactif';
      } else if (value === 'entreprise' || value === 'client') {
        newStatut = 'actif';
      }
      
      setFormData({
        ...formData,
        [name]: value,
        statut: newStatut
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const validateStep1 = () => {
    if (!formData.first_name || !formData.last_name || !formData.email || !formData.phone) {
      setError('Veuillez remplir tous les champs obligatoires.');
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (formData.role === 'relay_point' || formData.role === 'entreprise') {
      if (!formData.business_type) {
        setError('Veuillez sélectionner le type d\'entreprise.');
        return false;
      }
      if (formData.business_type === 'other' && !formData.business_type_other.trim()) {
        setError('Veuillez préciser le type d\'entreprise.');
        return false;
      }
    }
    return true;
  };

  const nextStep = () => {
    setError('');
    if (validateStep1()) {
      setCurrentStep(2);
    }
  };

  const prevStep = () => {
    setCurrentStep(1);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    if (!validateStep2()) {
      setIsLoading(false);
      return;
    }

    try {
      const userData = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        username: formData.username || formData.email, // Utilise l'email comme username si non fourni
        email: formData.email,
        phone: formData.phone,
        role: formData.role,
        statut:formData.statut,
        business_type: formData.business_type,
        address: formData.address
      };

      // const response = await userAPI.createUser(userData);
      const response = await authAPI.register(userData);
      // const response = await fetch('https://backend.katianlogistique.com/api/auth/register/', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(userData)
      // });

      console.log('✅ Inscription réussie:', response);
      
      // Gestion des messages et redirections selon le rôle
      if (formData.role === 'client') {
        setSuccess('Compte créé avec succès ! Redirection vers votre espace client...');
        
        // Rediriger vers l'espace business après 2 secondes
        setTimeout(() => {
          window.location.href = 'https://business.katianlogistique.com';
        }, 2000);
      } else if (formData.role === 'entreprise' || formData.role === 'relay_point') {
        setSuccess('Compte créé avec succès ! Notre équipe vous contactera dans les 48h pour finaliser votre inscription.');
        
        // Rediriger vers la page d'accueil après 3 secondes
        setTimeout(() => {
          navigate('/');
        }, 3000);
      } else {
        setSuccess('Compte créé avec succès ! Redirection vers votre espace...');
        
        // Rediriger vers la page d'accueil après 2 secondes
        setTimeout(() => {
          navigate('/');
        }, 2000);
      }
    } catch (error) {
      console.error('❌ Erreur d\'inscription:', error);
      setError(error.response?.data?.message || 'Erreur lors de la création du compte.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-dark-bg dark:to-dark-bg-secondary py-8 sm:py-12">
      <div className="container-ksl px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
              Créer votre compte
            </h1>
            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300">
              Rejoignez Katian et commencez à optimiser votre logistique
            </p>
          </div>

          {/* Progress Steps */}
          <div className="flex justify-center mb-6 sm:mb-8">
            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className={`flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 ${
                currentStep >= 1 ? 'bg-ksl-red border-ksl-red text-white' : 'border-gray-300 text-gray-500'
              }`}>
                {currentStep > 1 ? <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" /> : <span className="text-sm sm:text-base">1</span>}
              </div>
              <div className={`w-12 sm:w-16 h-1 ${currentStep > 1 ? 'bg-ksl-red' : 'bg-gray-300'}`}></div>
              <div className={`flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 ${
                currentStep >= 2 ? 'bg-ksl-red border-ksl-red text-white' : 'border-gray-300 text-gray-500'
              }`}>
                {currentStep > 2 ? <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" /> : <span className="text-sm sm:text-base">2</span>}
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="bg-white dark:bg-dark-bg-secondary rounded-2xl shadow-lg p-4 sm:p-6 md:p-8 border border-gray-200 dark:border-gray-700">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-6">
                {error}
              </div>
            )}
            {success && (
              <div className="bg-green-50 border border-green-200 text-green-800 px-3 sm:px-4 py-2 sm:py-3 rounded-lg mb-4 sm:mb-6">
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* Step 1: Informations personnelles */}
              {currentStep === 1 && (
                <div className="space-y-4 sm:space-y-6">
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-4 sm:mb-6">
                    Informations personnelles
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    {/* Prénom */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Prénom <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
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
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
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

                    {/* Username */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Nom d'utilisateur
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          name="username"
                          value={formData.username}
                          onChange={handleChange}
                          placeholder="nom_utilisateur"
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-dark-bg-secondary text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-ksl-red"
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

                    {/* Rôle */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Type de compte <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <select
                          name="role"
                          value={formData.role}
                          onChange={handleChange}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-dark-bg-secondary text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-ksl-red"
                          required
                        >
                          <option value="client">Particulier</option>
                          <option value="entreprise">Entreprise</option>
                          <option value="relay_point">Point Relais</option>
                        </select>
                      </div>
                    </div>
                  </div>



                  {/* Next Button */}
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={nextStep}
                      className="px-4 sm:px-6 py-2 sm:py-3 bg-ksl-red text-white rounded-lg hover:bg-ksl-red-dark transition-colors duration-200 font-medium flex items-center space-x-2 text-sm sm:text-base"
                    >
                      <span>Suivant</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2: Informations supplémentaires */}
              {currentStep === 2 && (
                <div className="space-y-4 sm:space-y-6">
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-4 sm:mb-6">
                    Informations supplémentaires
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    {/* Type d'entreprise - SEULEMENT pour les points relais et entreprises */}
                    {(formData.role === 'relay_point' || formData.role === 'entreprise') && (
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Type d'entreprise <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <select
                            name="business_type"
                            value={formData.business_type}
                            onChange={handleChange}
                            className="w-full pl-10 pr-4 py-2 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-dark-bg-secondary text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-ksl-red"
                            required
                          >
                            <option value="">Sélectionner le type d'entreprise</option>
                            <option value="boutique">Boutique</option>
                            <option value="pharmacy">Pharmacie</option>
                            <option value="grocery">Épicerie</option>
                            <option value="gas_station">Station essence</option>
                            <option value="cyber_cafe">Cyber café</option>
                            <option value="bookstore">Librairie</option>
                            {/* <option value="mtn">MTN</option> */}
                            {/* <option value="orange">Orange</option> */}
                            {/* <option value="moov">Moov</option> */}
                            <option value="other">Autre</option>
                          </select>
                        </div>
                      </div>
                    )}

                    {(formData.role === 'relay_point' || formData.role === 'entreprise') && formData.business_type === 'other' && (
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Précisez votre type d'entreprise <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            type="text"
                            name="business_type_other"
                            value={formData.business_type_other}
                            onChange={handleChange}
                            placeholder="Ex: Atelier de réparation, Coopérative, etc."
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-dark-bg-secondary text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-ksl-red"
                            required
                          />
                        </div>
                      </div>
                    )}

                    {/* Adresse */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Adresse
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          name="address"
                          value={formData.address}
                          onChange={handleChange}
                          placeholder="Adresse complète"
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-dark-bg-secondary text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-ksl-red"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row justify-between space-y-3 sm:space-y-0">
                    <button
                      type="button"
                      onClick={prevStep}
                      className="px-4 sm:px-6 py-2 sm:py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-bg-tertiary transition-colors duration-200 font-medium text-sm sm:text-base"
                    >
                      Retour
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="px-4 sm:px-6 py-2 sm:py-3 bg-ksl-red text-white rounded-lg hover:bg-ksl-red-dark transition-colors duration-200 font-medium flex items-center space-x-2 disabled:opacity-50 text-sm sm:text-base"
                    >
                      {isLoading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Création...</span>
                        </>
                      ) : (
                        <>
                          <span>Créer mon compte</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>

          {/* Login Link */}
          <div className="text-center mt-6 sm:mt-8">
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
              Vous avez déjà un compte ?{' '}
              <a 
                  href="https://business.katianlogistique.com" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-bg-tertiary transition-colors duration-200 text-center whitespace-nowrap"
                  
                >
                  Se connecter
                </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 