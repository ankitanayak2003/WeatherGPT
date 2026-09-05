import React from 'react';
import { useWeather } from '../../context/WeatherContext';

export const DynamicWeatherBackdrop: React.FC = () => {
  const { weather } = useWeather();
  const condition = weather?.current?.condition || 'storm';

  return (
    <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
      {/* Background storm image with atmospheric blend */}
      <img
        src={
          condition === 'sunny'
            ? 'https://images.unsplash.com/photo-1601297183305-6df142704ea2?w=1600&auto=format&fit=crop&q=80'
            : 'https://images.unsplash.com/photo-1534088568595-a066f410bcda?w=1600&auto=format&fit=crop&q=80'
        }
        alt="Weather condition backdrop"
        referrerPolicy="no-referrer"
        className="w-full h-full object-cover mix-blend-screen opacity-25 scale-105 transition-transform duration-1000"
      />

      {/* Atmospheric radial cyan and emerald ambient glows */}
      <div className="absolute -top-32 -left-32 w-[36rem] h-[36rem] rounded-full bg-[#38bdf8]/10 blur-[130px]" />
      <div className="absolute top-1/3 -right-24 w-[30rem] h-[30rem] rounded-full bg-[#00bd85]/10 blur-[120px]" />
      <div className="absolute bottom-10 left-1/4 w-[38rem] h-[22rem] rounded-full bg-[#7bd0ff]/5 blur-[100px]" />

      {/* Subtle simulated ambient rain particles if condition is rain or storm */}
      {(condition === 'storm' || condition === 'rain') && (
        <div className="absolute inset-0 opacity-20 pointer-events-none overflow-hidden">
          <div className="w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-400/20 via-transparent to-transparent animate-pulse" />
        </div>
      )}
    </div>
  );
};
