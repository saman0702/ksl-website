import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';

export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await authAPI.login(formData.email, formData.password);
      console.log('✅ Connexion réussie:', response);
      
      // Rediriger vers la plateforme LMS ou dashboard
      window.location.href = 'https://ksl.dolcevitaci.com';
    } catch (error) {
      console.error('❌ Erreur de connexion:', error);
      setError(error.response?.data?.message || 'Erreur de connexion. Vérifiez vos identifiants.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="py-16 container-ksl flex flex-col items-center justify-center min-h-[60vh]">
      <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center">Se connecter</h1>
              <form onSubmit={handleSubmit} className="bg-white dark:bg-dark-bg-secondary rounded-xl shadow-ksl p-8 flex flex-col gap-4 max-w-md w-full border border-gray-200 dark:border-gray-700">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}
        <input
          className="input-ksl"
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          className="input-ksl"
          type="password"
          name="password"
          placeholder="Mot de passe"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <button 
          type="submit" 
          className="btn-ksl mt-2"
          disabled={isLoading}
        >
          {isLoading ? 'Connexion...' : 'Connexion'}
        </button>
        <div className="text-right text-sm mt-2">
          <a href="#" className="text-ksl-red hover:underline">Mot de passe oublié ?</a>
        </div>
      </form>
    </section>
  );
} 