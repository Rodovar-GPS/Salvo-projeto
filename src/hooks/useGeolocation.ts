// ==============================================================================
// 📍 USE GEOLOCATION HOOK — GEOLOCALIZAÇÃO COM FALLBACK SOTEROPOLITANO
// ==============================================================================

import { useState, useEffect } from 'react';
import { UserLocationState } from '../types';

export function useGeolocation() {
  // Ponto padrão: Farol da Barra (-13.0039, -38.5326)
  const [location, setLocation] = useState<UserLocationState>({
    lat: -13.0039,
    lng: -38.5326,
    accuracy: 15,
    neighborhood: 'Barra',
    isRealGps: false,
    speed: 0,
    heading: 0,
    timestamp: Date.now(),
  });

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Geolocalização não suportada no navegador.');
      setIsLoading(false);
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy,
          neighborhood: 'Salvador',
          isRealGps: true,
          speed: position.coords.speed,
          heading: position.coords.heading,
          timestamp: position.timestamp,
        });
        setIsLoading(false);
      },
      (err) => {
        // Fallback soteropolitano
        setError(err.message);
        setIsLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 5000,
      }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  return { location, isLoading, error };
}
