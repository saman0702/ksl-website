import React, { useState, useEffect, useRef } from 'react';
import { cn } from '../../utils/cn';
import { Search, MapPin, Loader2, Check } from 'lucide-react';

const LocationSearch = ({ 
  value = '', 
  onChange, 
  onLocationSelect, 
  placeholder = "Rechercher un lieu...", 
  className = "",
  disabled = false,
  country = "CI" // Code pays pour la Côte d'Ivoire
}) => {
  const [query, setQuery] = useState(value);
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [error, setError] = useState(null);
  
  const inputRef = useRef(null);
  const suggestionRefs = useRef([]);
  const timeoutRef = useRef(null);

  // Fonction pour chercher des lieux via l'API Nominatim
  const searchPlaces = async (searchQuery) => {
    if (!searchQuery || searchQuery.length < 3) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Utiliser Nominatim avec focus sur la Côte d'Ivoire
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?` +
        `format=json&` +
        `q=${encodeURIComponent(searchQuery)}&` +
        `countrycodes=${country}&` +
        `limit=8&` +
        `addressdetails=1&` +
        `extratags=1&` +
        `namedetails=1`,
        {
          headers: {
            'User-Agent': 'KSL-Logistic-App/1.0'
          }
        }
      );

      if (!response.ok) {
        throw new Error('Erreur lors de la recherche');
      }

      const data = await response.json();
      
      // Transformer les résultats pour notre format
      const formattedSuggestions = data.map((place, index) => ({
        id: place.place_id || index,
        name: place.display_name,
        address: place.display_name,
        latitude: parseFloat(place.lat),
        longitude: parseFloat(place.lon),
        type: place.type || 'lieu',
        importance: place.importance || 0,
        city: place.address?.city || place.address?.town || place.address?.village || '',
        district: place.address?.suburb || place.address?.quarter || '',
        country: place.address?.country || 'Côte d\'Ivoire'
      })).sort((a, b) => b.importance - a.importance); // Trier par importance

      setSuggestions(formattedSuggestions);
      setShowSuggestions(true);
      setSelectedIndex(-1);

    } catch (err) {
      console.error('Erreur recherche lieu:', err);
      setError('Impossible de rechercher les lieux');
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Gérer les changements de saisie avec debounce
  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      searchPlaces(query);
    }, 300); // Attendre 300ms après l'arrêt de frappe

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [query]);

  // Mettre à jour le query quand value change
  useEffect(() => {
    setQuery(value);
  }, [value]);

  // Gérer la sélection d'un lieu
  const handleLocationSelect = (location) => {
    setQuery(location.address);
    setShowSuggestions(false);
    setSelectedIndex(-1);
    
    // Appeler les callbacks
    if (onChange) {
      onChange(location.address);
    }
    
    if (onLocationSelect) {
      onLocationSelect({
        address: location.address,
        latitude: location.latitude,
        longitude: location.longitude,
        city: location.city,
        name: location.name,
        type: location.type
      });
    }
  };

  // Gérer les touches du clavier
  const handleKeyDown = (e) => {
    if (!showSuggestions || suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev > 0 ? prev - 1 : suggestions.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && suggestions[selectedIndex]) {
          handleLocationSelect(suggestions[selectedIndex]);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedIndex(-1);
        break;
    }
  };

  // Gérer les changements dans l'input
  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setQuery(newValue);
    
    if (onChange) {
      onChange(newValue);
    }
    
    if (newValue.length === 0) {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  // Fermer les suggestions quand on clique ailleurs
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (inputRef.current && !inputRef.current.contains(event.target)) {
        setShowSuggestions(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={cn("relative w-full", className)} ref={inputRef}>
      {/* Input de recherche */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
          ) : (
            <Search className="h-4 w-4 text-gray-400" />
          )}
        </div>
        
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (suggestions.length > 0) {
              setShowSuggestions(true);
            }
          }}
          placeholder={placeholder}
          disabled={disabled}
          className={cn(
            "w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg",
            "focus:ring-2 focus:ring-ksl-red/20 focus:border-ksl-red",
            "dark:bg-dark-bg-secondary dark:border-gray-600 dark:text-white",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            "placeholder:text-gray-500 dark:placeholder:text-gray-400"
          )}
        />
      </div>

      {/* Message d'erreur */}
      {error && (
        <div className="mt-1 text-sm text-red-600 dark:text-red-400">
          {error}
        </div>
      )}

      {/* Liste des suggestions */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white dark:bg-dark-bg-secondary border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-64 overflow-y-auto">
          {suggestions.map((suggestion, index) => (
            <div
              key={suggestion.id}
              ref={el => suggestionRefs.current[index] = el}
              className={cn(
                "px-4 py-3 cursor-pointer border-b border-gray-200 dark:border-gray-700 last:border-b-0",
                "hover:bg-gray-50 dark:hover:bg-gray-700",
                selectedIndex === index && "bg-ksl-red/10 dark:bg-ksl-red/20"
              )}
              onClick={() => handleLocationSelect(suggestion)}
            >
              <div className="flex items-start space-x-3">
                <MapPin className="w-4 h-4 text-ksl-red flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {suggestion.name.split(',')[0]} {/* Premier élément (nom principal) */}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {suggestion.address}
                  </p>
                  {suggestion.city && (
                    <p className="text-xs text-ksl-red font-medium">
                      📍 {suggestion.city}
                    </p>
                  )}
                </div>
                {selectedIndex === index && (
                  <Check className="w-4 h-4 text-ksl-red flex-shrink-0" />
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Message quand aucun résultat */}
      {showSuggestions && !isLoading && query.length >= 3 && suggestions.length === 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white dark:bg-dark-bg-secondary border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg p-4">
          <div className="text-center text-gray-500 dark:text-gray-400">
            <MapPin className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Aucun lieu trouvé pour "{query}"</p>
            <p className="text-xs mt-1">Essayez avec un nom de ville ou quartier</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationSearch; 