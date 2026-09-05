import React from 'react';
import { Bookmark, CloudLightning, Sun, CloudRain, ArrowUpRight, MessageSquareCode } from 'lucide-react';
import { useWeather } from '../../context/WeatherContext';
import { LocationInfo } from '../../types';

export const TrackedCitiesList: React.FC = () => {
  const { selectLocation, setActiveModal, setActiveTab } = useWeather();

  const cities = [
    {
      name: 'Bengaluru',
      region: 'Karnataka, IN',
      temp: 24,
      condition: 'Thunderstorm',
      high: 26,
      low: 19,
      subDetail: 'Wind 14km/h',
      dotColor: 'bg-[#45dfa4]',
      icon: <CloudLightning className="w-4 h-4 text-[#38bdf8]" />,
      loc: { name: 'Bengaluru', region: 'Karnataka', country: 'India', latitude: 12.9716, longitude: 77.5946 },
    },
    {
      name: 'Bhubaneswar',
      region: 'Odisha, IN',
      temp: 31,
      condition: 'Clear & Sunny',
      high: 34,
      low: 23,
      subDetail: 'AQI: 84 Mod',
      dotColor: 'bg-[#f9bd22]',
      icon: <Sun className="w-4 h-4 text-[#f9bd22]" />,
      loc: { name: 'Bhubaneswar', region: 'Odisha', country: 'India', latitude: 20.2961, longitude: 85.8245 },
    },
    {
      name: 'Mumbai',
      region: 'Maharashtra, IN',
      temp: 29,
      condition: 'Coastal Drizzle',
      high: 30,
      low: 26,
      subDetail: 'Humidity 89%',
      dotColor: 'bg-[#38bdf8]',
      icon: <CloudRain className="w-4 h-4 text-[#7bd0ff]" />,
      loc: { name: 'Mumbai', region: 'Maharashtra', country: 'India', latitude: 19.0760, longitude: 72.8777 },
    },
  ];

  return (
    <div className="flex flex-col gap-3">
      {/* Header */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <Bookmark className="w-4 h-4 text-[#38bdf8]" />
          <span className="text-base font-bold text-[#dae2fd]">
            Tracked Cities
          </span>
        </div>
        <button
          onClick={() => setActiveModal('saved')}
          className="text-xs font-semibold text-[#38bdf8] hover:underline"
        >
          Manage ({cities.length})
        </button>
      </div>

      {/* City Cards */}
      {cities.map((city) => (
        <button
          key={city.name}
          onClick={() => selectLocation(city.loc as LocationInfo)}
          className="group relative overflow-hidden rounded-2xl bg-[#171f33]/70 hover:bg-[#222a3d]/90 backdrop-blur-xl p-4 transition-all duration-300 shadow-md border border-white/5 text-left w-full hover:border-[#38bdf8]/30"
        >
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] text-[#87929a] uppercase font-bold tracking-wider">
                  {city.region}
                </span>
                <span className={`w-1.5 h-1.5 rounded-full ${city.dotColor}`} />
              </div>
              <span className="text-base font-bold text-[#dae2fd] mt-0.5 group-hover:text-[#38bdf8] transition-colors">
                {city.name}
              </span>
              <div className="flex items-center gap-1.5 text-[#bdc8d1] mt-1 text-xs">
                {city.icon}
                <span>{city.condition}</span>
              </div>
            </div>

            <div className="flex flex-col items-end">
              <span className="text-3xl font-extralight text-[#dae2fd] leading-none font-display">
                {city.temp}°
              </span>
              <span className="text-[11px] text-[#87929a] mt-1">
                H: {city.high}° L: {city.low}°
              </span>
              <span className="text-[11px] text-[#45dfa4] font-mono mt-0.5">
                {city.subDetail}
              </span>
            </div>
          </div>
        </button>
      ))}

      {/* Quick AI Terminal Trigger Pill */}
      <button
        onClick={() => setActiveTab('chat')}
        className="flex items-center justify-between p-3.5 rounded-xl bg-gradient-to-r from-[#38bdf8]/20 via-[#171f33] to-[#222a3d] text-[#dae2fd] hover:from-[#38bdf8]/30 transition-all shadow-md group border border-[#38bdf8]/25 text-left"
      >
        <div className="flex items-center gap-2.5">
          <MessageSquareCode className="w-5 h-5 text-[#38bdf8] group-hover:rotate-12 transition-transform" />
          <span className="text-xs font-semibold text-[#dae2fd]">
            Ask WeatherGPT about weekend travel
          </span>
        </div>
        <ArrowUpRight className="w-4 h-4 text-[#38bdf8] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
      </button>
    </div>
  );
};
