import React from 'react';
import { CloudLightning, Radar, X } from 'lucide-react';
import { useWeather } from '../../context/WeatherContext';

export const SevereAlertBanner: React.FC = () => {
  const { alerts, dismissedAlertIds, dismissAlert, setActiveTab } = useWeather();

  const activeAlert = alerts.find(a => !dismissedAlertIds.includes(a.id));

  if (!activeAlert) return null;

  return (
    <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-[#93000a]/80 via-[#222a3d]/90 to-[#171f33]/90 backdrop-blur-xl p-4 mb-6 shadow-xl border border-[#ffb4ab]/20 transition-all duration-300">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-[#ffb4ab]/20 flex items-center justify-center text-[#ffb4ab] border border-[#ffb4ab]/30">
            <CloudLightning className="w-5 h-5 animate-pulse" />
          </div>
          <div className="flex flex-col max-w-3xl">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#ffb4ab]">
                {activeAlert.title.toUpperCase()}
              </span>
              <span className="text-[11px] text-[#bdc8d1]">• {activeAlert.source}</span>
            </div>
            <p className="text-sm text-[#dae2fd] mt-0.5 leading-snug">
              {activeAlert.message}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end md:self-center flex-shrink-0">
          <button
            onClick={() => setActiveTab('map')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#ffb4ab] text-[#690005] text-xs font-bold hover:bg-white transition-all shadow-md"
          >
            <Radar className="w-3.5 h-3.5" />
            <span>View Radar</span>
          </button>
          <button
            onClick={() => dismissAlert(activeAlert.id)}
            className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#2d3449]/60 hover:bg-[#2d3449] text-[#bdc8d1] hover:text-[#dae2fd] transition-colors border border-white/5"
            title="Dismiss Alert"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
