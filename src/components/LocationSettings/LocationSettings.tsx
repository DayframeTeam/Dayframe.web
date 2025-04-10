import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '../ui/Button/Button';
import { MapPinIcon, Loader2Icon } from 'lucide-react';

type Props = {
  onLocationChange: (location: string) => void;
};

export const LocationSettings = ({ onLocationChange }: Props) => {
  const { t } = useTranslation();
  const [location, setLocation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load saved location from localStorage on component mount
  useEffect(() => {
    const savedLocation = localStorage.getItem('weatherLocation');
    if (savedLocation) {
      setLocation(savedLocation);
      onLocationChange(savedLocation);
    }
  }, [onLocationChange]);

  const handleGeolocationError = async (error: GeolocationPositionError) => {
    console.log('Geolocation error details:', {
      code: error.code,
      message: error.message,
      PERMISSION_DENIED: error.PERMISSION_DENIED,
      POSITION_UNAVAILABLE: error.POSITION_UNAVAILABLE,
      TIMEOUT: error.TIMEOUT,
    });

    // Пробуем определить местоположение через IP
    try {
      console.log('Trying to detect location via IP...');
      const response = await fetch('https://api.ipify.org?format=json');
      const { ip } = await response.json();

      // Используем полученный IP для определения города
      const locationResponse = await fetch(`https://ipwho.is/${ip}`);
      const data = await locationResponse.json();

      if (data.city) {
        console.log('Location detected via IP:', data.city);
        setLocation(data.city);
        localStorage.setItem('weatherLocation', data.city);
        onLocationChange(data.city);
        return;
      }
    } catch (ipError) {
      console.error('Error detecting location via IP:', ipError);
    }

    // Если и определение по IP не сработало, показываем ошибку
    switch (error.code) {
      case error.PERMISSION_DENIED:
        setError('weather.errors.permissionDenied');
        break;
      case error.POSITION_UNAVAILABLE:
        setError('weather.errors.positionUnavailable');
        break;
      case error.TIMEOUT:
        setError('weather.errors.timeout');
        break;
      default:
        setError('weather.errors.unknown');
    }
  };

  const detectLocation = async () => {
    if (!navigator.geolocation) {
      console.log('Geolocation API not supported');
      setError('weather.errors.notSupported');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log('Requesting geolocation...');
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            console.log('Got position:', {
              latitude: pos.coords.latitude,
              longitude: pos.coords.longitude,
              accuracy: pos.coords.accuracy,
            });
            resolve(pos);
          },
          (error) => {
            console.log('Geolocation error in callback:', error);
            handleGeolocationError(error);
            reject(error);
          },
          {
            enableHighAccuracy: false,
            timeout: 15000,
            maximumAge: 30000,
          }
        );
      });

      const { latitude, longitude } = position.coords;
      console.log('Fetching city data for coordinates:', { latitude, longitude });

      try {
        const url = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`;
        console.log('Fetching from URL:', url);

        const response = await fetch(url);
        console.log('Got response:', {
          ok: response.ok,
          status: response.status,
          statusText: response.statusText,
        });

        if (!response.ok) {
          throw new Error(
            `Failed to fetch location data: ${response.status} ${response.statusText}`
          );
        }

        const data = await response.json();
        console.log('Location data:', data);

        const detectedLocation =
          data.address.city ||
          data.address.town ||
          data.address.village ||
          data.address.district ||
          data.address.suburb ||
          data.address.municipality;

        console.log('Detected location:', detectedLocation);

        if (detectedLocation) {
          setLocation(detectedLocation);
          localStorage.setItem('weatherLocation', detectedLocation);
          onLocationChange(detectedLocation);
        } else {
          console.log('No city found in address data:', data.address);
          setError('weather.errors.noCity');
        }
      } catch (error) {
        console.error('Error fetching city name:', error);
        setError('weather.errors.fetchError');
      }
    } catch (error) {
      console.error('Geolocation error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!location) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
          alignItems: 'flex-start',
        }}
      >
        <Button size="small" variant="secondary" onClick={detectLocation} disabled={isLoading}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {isLoading ? (
              <Loader2Icon size={16} className="animate-spin" />
            ) : (
              <MapPinIcon size={16} />
            )}
            {t('weather.detectLocation')}
          </span>
        </Button>
        {error && (
          <span
            style={{
              fontSize: 'var(--font-size-tertiary)',
              color: 'var(--error-color)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            {t(error)}
          </span>
        )}
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
      <span style={{ fontSize: 'var(--font-size-tertiary)', color: 'var(--text-muted)' }}>{t('weather.location', { location })}</span>
      <Button size="small" variant="secondary" onClick={detectLocation} disabled={isLoading}>
        {isLoading ? <Loader2Icon size={16} className="animate-spin" /> : <MapPinIcon size={16} />}
      </Button>
    </div>
  );
};
