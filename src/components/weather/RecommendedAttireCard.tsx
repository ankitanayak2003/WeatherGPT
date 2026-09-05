import React from 'react';
import { Shirt, Umbrella, Shield, Briefcase } from 'lucide-react';
import { useWeather } from '../../context/WeatherContext';

export const RecommendedAttireCard: React.FC = () => {
  const { clothing, weather } = useWeather();

  const humidity = weather?.current?.humidity ?? 82;

  return (
    <div className="flex flex-col justify-between rounded-2xl bg-[#171f33]/60 backdrop-blur-xl p-5 shadow-xl border border-white/5 h-full">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <div className="w-7 h-7 rounded-lg bg-[#00bd85]/20 flex items-center justify-center text-[#45dfa4] border border-[#00bd85]/30">
            <Shirt className="w-4 h-4" />
          </div>
          <span className="text-base font-bold text-[#dae2fd]">
            Recommended Attire
          </span>
        </div>

        <p className="text-xs text-[#bdc8d1] mb-3 leading-relaxed">
          {clothing?.summary || `Water-resistant light shell, breathable synthetic trousers, and compact umbrella. Elevated ${humidity}% ambient humidity indoors.`}
        </p>

        <div className="flex flex-wrap gap-2">
          <span className="text-xs px-2.5 py-1.5 rounded-lg bg-[#222a3d]/80 text-[#dae2fd] flex items-center gap-1.5 border border-white/5">
            <Umbrella className="w-3.5 h-3.5 text-[#38bdf8]" />
            Telescopic Umbrella
          </span>
          <span className="text-xs px-2.5 py-1.5 rounded-lg bg-[#222a3d]/80 text-[#dae2fd] flex items-center gap-1.5 border border-white/5">
            <Shield className="w-3.5 h-3.5 text-[#45dfa4]" />
            Waterproof Footwear
          </span>
          <span className="text-xs px-2.5 py-1.5 rounded-lg bg-[#222a3d]/80 text-[#dae2fd] flex items-center gap-1.5 border border-white/5">
            <Briefcase className="w-3.5 h-3.5 text-[#f9bd22]" />
            Laptop Rain Sleeve
          </span>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between text-xs text-[#bdc8d1] pt-3 border-t border-white/5">
        <span>
          Indoor Comfort Index: <strong className="text-[#dae2fd] font-bold">6.8 / 10</strong>
        </span>
        <span className="text-[#45dfa4] font-semibold">
          AC Advisory: On
        </span>
      </div>
    </div>
  );
};
