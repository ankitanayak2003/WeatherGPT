import React from 'react';
import { Orbit, Sunrise, Sunset, Moon, MoonStar } from 'lucide-react';
import { useWeather } from '../../context/WeatherContext';

export const SkySpaceCard: React.FC = () => {
  const { weather } = useWeather();
  const astronomy = weather?.astronomy;

  const sunrise = astronomy?.sunrise || '6:05 AM';
  const sunset = astronomy?.sunset || '6:32 PM';
  const moonrise = astronomy?.moonrise || '7:42 PM';
  const moonset = astronomy?.moonset || '6:12 AM';
  const phaseName = astronomy?.moonPhaseName || 'Waxing Gibbous';
  const phasePercent = astronomy?.moonPhasePercent || 72;
  const stargazingQuality = astronomy?.stargazingQuality || 'Low';

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-[#222a3d]/80 via-[#171f33]/70 to-[#060e20]/90 backdrop-blur-xl p-5 shadow-xl border border-white/10">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Orbit className="w-5 h-5 text-[#38bdf8]" />
          <h3 className="text-base font-bold text-[#dae2fd]">
            SkySpace &amp; Lunar
          </h3>
        </div>
        <span className="text-xs font-semibold px-2 py-0.5 rounded bg-[#2d3449]/80 text-[#7bd0ff] border border-white/5">
          Phase {phasePercent}%
        </span>
      </div>

      <div className="flex items-center gap-4 my-2">
        {/* Glowing Moon Phase Graphic */}
        <div className="relative flex-shrink-0 w-20 h-20 rounded-full bg-[#060e20] flex items-center justify-center shadow-[0_0_24px_rgba(123,208,255,0.25)] border border-white/10">
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#2d3449] via-[#c4e7ff]/40 to-[#7bd0ff] relative overflow-hidden">
            {/* Waxing Gibbous shadow mask */}
            <div className="absolute inset-0 bg-[#060e20]/85 rounded-full w-14 h-16 -left-3" />
            <div className="absolute inset-0 bg-transparent rounded-full shadow-[inset_-6px_-3px_8px_rgba(255,255,255,0.4)]" />
          </div>
        </div>

        <div className="flex flex-col">
          <span className="text-base font-bold text-[#dae2fd]">
            {phaseName}
          </span>
          <span className="text-xs text-[#bdc8d1]">
            {phasePercent}% Visible Surface
          </span>
          <span className="text-xs text-[#45dfa4] font-mono mt-1 font-semibold">
            Stargazing: {stargazingQuality} (Storm Overcast)
          </span>
        </div>
      </div>

      {/* Ephemeris 2x2 Grid */}
      <div className="grid grid-cols-2 gap-2 mt-4 pt-1">
        {/* Sunrise */}
        <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-[#222a3d]/50 border border-white/5">
          <Sunrise className="w-4 h-4 text-[#f9bd22]" />
          <div className="flex flex-col">
            <span className="text-[10px] text-[#87929a] uppercase font-bold tracking-wider">Sunrise</span>
            <span className="text-xs font-bold text-[#dae2fd]">{sunrise}</span>
          </div>
        </div>

        {/* Sunset */}
        <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-[#222a3d]/50 border border-white/5">
          <Sunset className="w-4 h-4 text-[#ffc42f]" />
          <div className="flex flex-col">
            <span className="text-[10px] text-[#87929a] uppercase font-bold tracking-wider">Sunset</span>
            <span className="text-xs font-bold text-[#dae2fd]">{sunset}</span>
          </div>
        </div>

        {/* Moonrise */}
        <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-[#222a3d]/50 border border-white/5">
          <Moon className="w-4 h-4 text-[#38bdf8]" />
          <div className="flex flex-col">
            <span className="text-[10px] text-[#87929a] uppercase font-bold tracking-wider">Moonrise</span>
            <span className="text-xs font-bold text-[#dae2fd]">{moonrise}</span>
          </div>
        </div>

        {/* Moonset */}
        <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-[#222a3d]/50 border border-white/5">
          <MoonStar className="w-4 h-4 text-[#bdc8d1]" />
          <div className="flex flex-col">
            <span className="text-[10px] text-[#87929a] uppercase font-bold tracking-wider">Moonset</span>
            <span className="text-xs font-bold text-[#dae2fd]">{moonset}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
