import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CloudIcon, SunIcon, CloudRainIcon, CloudSnowIcon, CloudLightningIcon } from 'lucide-react';

type WeatherData = {
  current_condition: Array<{
    temp_C: string;
    weatherDesc: Array<{
      value: string;
    }>;
    weatherIconUrl: Array<{
      value: string;
    }>;
  }>;
  weather?: Array<{
    date: string;
    hourly: Array<{
      time: string;
      tempC: string;
      weatherDesc: Array<{
        value: string;
      }>;
    }>;
  }>;
};

type Props = {
  location: string;
  date: string; // Format: YYYY-MM-DD
};

export const WeatherDisplay = ({ location, date }: Props) => {
  const { t } = useTranslation();
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setLoading(true);
        const response = await fetch(`https://wttr.in/${encodeURIComponent(location)}?format=j1`);

        if (!response.ok) {
          throw new Error('Failed to fetch weather data');
        }

        const data = await response.json();
        setWeather(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        console.error('Error fetching weather:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [location]);

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        {t('weather.loading')}
      </div>
    );
  }

  if (error || !weather) {
    return null; // Don't show anything if there's an error
  }

  let temperature = '';
  let description = '';

  if (weather.weather) {
    // Find the forecast for the specified date
    const targetDate = new Date(date);
    const forecastDay = weather.weather.find((day) => {
      const forecastDate = new Date(day.date);
      return forecastDate.toDateString() === targetDate.toDateString();
    });

    if (forecastDay) {
      // Use the noon forecast (usually index 4 or 5 in the hourly array)
      const noonForecast = forecastDay.hourly[4] || forecastDay.hourly[0];
      temperature = noonForecast.tempC;
      description = noonForecast.weatherDesc[0].value;
    } else {
      // If we can't find the forecast for the specified date, use current conditions
      temperature = weather.current_condition[0].temp_C;
      description = weather.current_condition[0].weatherDesc[0].value;
    }
  } else {
    // Use current conditions
    temperature = weather.current_condition[0].temp_C;
    description = weather.current_condition[0].weatherDesc[0].value;
  }

  // Determine which icon to use based on the weather description
  const getWeatherIcon = () => {
    const desc = description.toLowerCase();
    const iconSize = 20;
    const iconStyle = { strokeWidth: 2 };

    if (desc.includes('rain') || desc.includes('drizzle')) {
      return <CloudRainIcon size={iconSize} style={{ ...iconStyle, color: '#4B87C5' }} />; // Синий для дождя
    } else if (desc.includes('snow')) {
      return <CloudSnowIcon size={iconSize} style={{ ...iconStyle, color: '#88B9E3' }} />; // Светло-синий для снега
    } else if (desc.includes('thunder') || desc.includes('lightning')) {
      return <CloudLightningIcon size={iconSize} style={{ ...iconStyle, color: '#FFB700' }} />; // Желтый для грозы
    } else if (desc.includes('cloud') || desc.includes('overcast')) {
      return <CloudIcon size={iconSize} style={{ ...iconStyle, color: '#8E9196' }} />; // Серый для облаков
    } else {
      return <SunIcon size={iconSize} style={{ ...iconStyle, color: '#FFB700' }} />; // Желтый для солнца
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        fontSize: '1rem',
        color: 'var(--text-secondary)',
      }}
    >
      {getWeatherIcon()}
      <span>{temperature}°C</span>
      {/* {isForecast && (
        <span style={{ fontSize: 'var(--font-size-secondary)' }}>{t('weather.forecast')}</span>
      )} */}
    </div>
  );
};
