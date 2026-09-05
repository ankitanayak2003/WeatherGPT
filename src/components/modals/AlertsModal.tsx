import React from 'react';
import { Bell, AlertTriangle, ShieldCheck, X, Check, CloudLightning } from 'lucide-react';
import { useWeather } from '../../context/WeatherContext';

export const AlertsModal: React.FC = () => {
  const { alerts, dismissedAlertIds, dismissAlert, activeModal, setActiveModal } = useWeather();

  if (activeModal !== 'alerts') return null;

  const activeAlerts = alerts.filter(a => !dismissedAlertIds.includes(a.id));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
      <div className="w-full max-w-xl rounded-2xl bg-[#171f33] border border-white/10 shadow-2xl p-6 overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#ffb4ab]/20 flex items-center justify-center text-[#ffb4ab]">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#dae2fd]">Atmospheric Alerts &amp; Advisories</h2>
              <p className="text-xs text-[#87929a]">
                Official Meteorological Warnings &amp; WeatherGPT Decision Intelligence
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveModal(null)}
            className="p-1.5 rounded-lg text-[#87929a] hover:text-[#dae2fd] hover:bg-[#222a3d] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto py-4 space-y-3 pr-1">
          {activeAlerts.length > 0 ? (
            activeAlerts.map((alert) => (
              <div
                key={alert.id}
                className="p-4 rounded-xl bg-[#222a3d]/60 border border-[#ffb4ab]/20 flex flex-col gap-2.5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#93000a] text-[#ffdad6]">
                      {alert.severity.toUpperCase()}
                    </span>
                    <span className="text-xs font-semibold text-[#dae2fd]">{alert.title}</span>
                  </div>
                  <span className="text-[10px] font-mono text-[#87929a] bg-[#131b2e] px-2 py-0.5 rounded">
                    {alert.source}
                  </span>
                </div>

                <p className="text-xs text-[#bdc8d1] leading-relaxed">
                  {alert.message}
                </p>

                <div className="p-2.5 rounded-lg bg-[#060e20]/60 border border-white/5 flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#45dfa4] flex-shrink-0 mt-0.5" />
                  <div className="text-xs text-[#dae2fd]">
                    <span className="font-semibold text-[#45dfa4]">Guidance: </span>
                    {alert.recommendation}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-white/5 text-[11px] text-[#87929a]">
                  <span>Effective: {alert.startTime} – {alert.endTime}</span>
                  <button
                    onClick={() => dismissAlert(alert.id)}
                    className="flex items-center gap-1 text-xs font-semibold text-[#38bdf8] hover:underline"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Acknowledge</span>
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center flex flex-col items-center justify-center gap-2">
              <div className="w-12 h-12 rounded-full bg-[#00bd85]/20 text-[#45dfa4] flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-[#dae2fd]">You're all clear 🌤️</h3>
              <p className="text-xs text-[#87929a]">
                No active severe squall or extreme weather alerts for your current location.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-white/5 flex justify-end">
          <button
            onClick={() => setActiveModal(null)}
            className="px-4 py-2 rounded-xl bg-[#38bdf8] text-[#00354a] text-xs font-bold hover:bg-white transition-all shadow-md"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
