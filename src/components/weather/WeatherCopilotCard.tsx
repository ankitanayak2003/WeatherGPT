import React from 'react';
import { Cpu, ArrowRight, GraduationCap, Briefcase, Shovel, Car, Compass } from 'lucide-react';
import { useWeather } from '../../context/WeatherContext';

export const WeatherCopilotCard: React.FC = () => {
  const { aiInsight, userProfile, setActiveTab } = useWeather();

  const occupation = userProfile.occupation;

  const renderOccupationIcon = () => {
    switch (occupation) {
      case 'Student':
        return <GraduationCap className="w-4 h-4 text-[#f9bd22]" />;
      case 'Farmer':
        return <Shovel className="w-4 h-4 text-[#45dfa4]" />;
      case 'Driver':
        return <Car className="w-4 h-4 text-[#38bdf8]" />;
      case 'Traveler':
        return <Compass className="w-4 h-4 text-[#f9bd22]" />;
      default:
        return <Briefcase className="w-4 h-4 text-[#f9bd22]" />;
    }
  };

  return (
    <div className="flex flex-col justify-between rounded-2xl bg-gradient-to-br from-[#222a3d]/80 via-[#171f33]/70 to-[#060e20]/80 backdrop-blur-xl p-5 shadow-xl border border-white/10 h-full">
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#38bdf8]/20 flex items-center justify-center text-[#38bdf8] border border-[#38bdf8]/30">
              <Cpu className="w-4 h-4" />
            </div>
            <span className="text-base font-bold text-[#dae2fd]">
              {aiInsight?.headline || 'WeatherGPT Copilot'}
            </span>
          </div>
          <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-[#00bd85]/20 text-[#45dfa4] border border-[#00bd85]/30">
            Precision AI
          </span>
        </div>

        <p className="text-sm text-[#dae2fd] leading-relaxed mt-2 font-normal">
          {aiInsight?.summary || (
            <>
              Convective cell approaching from <strong className="text-[#38bdf8]">Mandya sector</strong>. Rain probability reaches <strong className="text-[#38bdf8]">88% by 4 PM</strong>. {occupation} advisory: Campus transit corridor around Bogadi Road delayed by ~15m due to preliminary surface puddling.
            </>
          )}
        </p>
      </div>

      <div className="flex items-center justify-between pt-3 mt-4 border-t border-white/5 bg-[#222a3d]/30 rounded-xl px-3.5 py-2.5">
        <div className="flex items-center gap-2">
          {renderOccupationIcon()}
          <span className="text-xs text-[#bdc8d1]">
            {aiInsight?.impactForOccupation || (
              occupation === 'Student'
                ? 'Class Schedule: Recommended indoor return by 3:45 PM'
                : 'Advisory: Check weather radar before embarking on transit.'
            )}
          </span>
        </div>
        <button
          onClick={() => setActiveTab('chat')}
          className="text-xs font-semibold text-[#38bdf8] hover:text-white flex items-center gap-1 transition-colors flex-shrink-0 ml-2"
        >
          <span>Ask AI</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
