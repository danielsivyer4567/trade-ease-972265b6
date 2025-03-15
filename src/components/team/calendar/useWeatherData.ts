
import { useState } from 'react';
import { RainData } from './WeatherDisplay';

export const useWeatherData = () => {
  const [weatherDates, setWeatherDates] = useState<RainData[]>([
    {
      date: '2024-03-18',
      rainfall: 0,
      temperature: 25,
      rainChance: 5,
      hasLightning: false,
      condition: 'sunny',
      amount: 0
    }, 
    {
      date: '2024-03-19',
      rainfall: 5,
      temperature: 22,
      rainChance: 40,
      hasLightning: false,
      condition: 'rainy',
      amount: 5
    }, 
    {
      date: '2024-03-20',
      rainfall: 12,
      temperature: 19,
      rainChance: 80,
      hasLightning: true,
      condition: 'storm',
      amount: 12
    }, 
    {
      date: '2024-03-21',
      rainfall: 8,
      temperature: 21,
      rainChance: 60,
      hasLightning: false,
      condition: 'rainy',
      amount: 8
    }
  ]);

  return {
    weatherDates,
    setWeatherDates
  };
};
