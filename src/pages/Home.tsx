import React, { useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { useWeather } from '../context/WeatherContext';
import { DynamicWeatherBackdrop } from '../components/weather/DynamicWeatherBackdrop';
import { SevereAlertBanner } from '../components/weather/SevereAlertBanner';
import { HeroWeatherCard } from '../components/weather/HeroWeatherCard';
import { HourlySplineWave } from '../components/weather/HourlySplineWave';
import { WeatherCopilotCard } from '../components/weather/WeatherCopilotCard';
import { RecommendedAttireCard } from '../components/weather/RecommendedAttireCard';
import { SkySpaceCard } from '../components/weather/SkySpaceCard';
import { TrackedCitiesList } from '../components/weather/TrackedCitiesList';

export const Home: React.FC = () => {
  const { currentLocation, userProfile, refreshWeather, isLoading } = useWeather();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshWeather();
    setTimeout(() => setIsRefreshing(false), 800);
  };

  // Determine appropriate greeting based on time of day
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening';

  return (
    <div className="relative w-full overflow-hidden px-4 py-4 lg:px-8 lg:py-6">
      {/* Dynamic Weather Atmospheric Background ONLY for Home page */}
      <DynamicWeatherBackdrop />

      {/* Top Greeting & Telemetry Live Bar */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 mb-5">
        <div className="flex flex-col">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="inline-flex h-2 w-2 rounded-full bg-[#45dfa4] animate-ping" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#45dfa4]">
              Telemetry Live
            </span>
            <span className="text-[#87929a] text-[11px]">
              • Updated 2 mins ago · {currentLocation.name} Station <span className="hidden sm:inline">({currentLocation.latitude.toFixed(2)}° N, {currentLocation.longitude.toFixed(2)}° E)</span>
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-bold text-[#dae2fd] tracking-tight">
            {greeting},{' '}
            <span className="text-[#38bdf8] font-bold">{userProfile.name}</span>
          </h1>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-[#222a3d]/70 text-[#bdc8d1] backdrop-blur-md border border-white/5 truncate max-w-[220px] sm:max-w-none">
            Academic Campus Node · {currentLocation.name}
          </span>
          <button
            onClick={handleRefresh}
            disabled={isRefreshing || isLoading}
            className="flex items-center justify-center w-8 h-8 rounded-full bg-[#222a3d]/80 text-[#38bdf8] hover:bg-[#38bdf8] hover:text-[#00354a] transition-all border border-white/5 shadow-sm disabled:opacity-50"
            title="Sync live sensor data"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Severe Weather Critical Alert Banner */}
      <SevereAlertBanner />

      {/* Main 12-Column Responsive Bento Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Primary Core: 8 Cols (Hero, Spline Wave, Copilot & Attire Bento) */}
        <div className="lg:col-span-8 flex flex-col gap-5">
          <HeroWeatherCard />

          <HourlySplineWave />

          {/* AI Weather Copilot & Attire Recommendations Bento Row */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
            <div className="md:col-span-7">
              <WeatherCopilotCard />
            </div>
            <div className="md:col-span-5">
              <RecommendedAttireCard />
            </div>
          </div>
        </div>

        {/* Secondary Hub: 4 Cols (SkySpace Astronomy & Tracked Satellite Cities) */}
        <div className="lg:col-span-4 flex flex-col gap-5">
          <SkySpaceCard />

          <TrackedCitiesList />
        </div>
      </div>
    </div>
  );
};
