import { memo, useState, useEffect } from 'react';
import { WeatherDisplay } from './WeatherDisplay/WeatherDisplay';
import { LocationSettings } from './LocationSettings/LocationSettings';

type WeatherProps = Readonly<{
  date: string;
}>;

export const Weather = memo(({ date }: WeatherProps) => {
  const [location, setLocation] = useState<string>('');

  // Check if the date is in the past
  const isPastDate = new Date(date) < new Date(new Date().setHours(0, 0, 0, 0));

  // Load saved location from localStorage on component mount
  useEffect(() => {
    const savedLocation = localStorage.getItem('weatherLocation');
    if (savedLocation) {
      setLocation(savedLocation);
    }
  }, []);

  // Handle location changes from LocationSettings
  const handleLocationChange = (newLocation: string) => {
    setLocation(newLocation);
  };

  // Don't show weather for past dates
  if (isPastDate) {
    return null;
  }
  console.log('Weather');
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
      {location && <WeatherDisplay location={location} date={date} />}
      <LocationSettings onLocationChange={handleLocationChange} />
    </div>
  );
});

Weather.displayName = 'Weather';
