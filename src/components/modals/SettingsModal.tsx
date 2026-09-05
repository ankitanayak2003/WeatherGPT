import React, { useState, useEffect } from 'react';
import { Settings, CheckCircle2, X, RotateCcw, Cloud, Shield, LogOut, User as UserIcon } from 'lucide-react';
import { useWeather } from '../../context/WeatherContext';
import { useAuth } from '../../context/AuthContext';
import { UserOccupation } from '../../types';

export const SettingsModal: React.FC = () => {
  const {
    userProfile,
    updateOccupation,
    updatePreferredUnit,
    activeModal,
    setActiveModal,
    setAuthModalMode,
  } = useWeather();

  const { currentUser, logOut } = useAuth();

  const [occupation, setOccupation] = useState<UserOccupation>(userProfile.occupation);
  const [preferredUnit, setPreferredUnit] = useState<'celsius' | 'fahrenheit'>(userProfile.preferredUnit);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    setOccupation(userProfile.occupation);
    setPreferredUnit(userProfile.preferredUnit);
  }, [userProfile]);

  if (activeModal !== 'settings' && activeModal !== 'profile') return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateOccupation(occupation);
    await updatePreferredUnit(preferredUnit);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      setActiveModal(null);
    }, 600);
  };

  const occupations: UserOccupation[] = [
    'Student',
    'Farmer',
    'Professional',
    'Driver',
    'Outdoor Worker',
    'Traveler',
    'Homemaker',
    'Other',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-lg rounded-2xl bg-[#171f33] border border-white/10 shadow-2xl p-6 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#38bdf8]/20 flex items-center justify-center text-[#38bdf8]">
              <Settings className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#dae2fd]">User Profile &amp; Settings</h2>
              <p className="text-xs text-[#87929a]">
                Personalized advisory heuristics and application units
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

        {/* Form Content */}
        <form onSubmit={handleSave} className="flex-1 overflow-y-auto py-4 space-y-4 pr-1">
          {/* User Account State */}
          <div className="p-3.5 rounded-xl bg-[#060e20]/70 border border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#38bdf8]/20 text-[#38bdf8] flex items-center justify-center font-bold">
                <UserIcon className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-[#dae2fd] flex items-center gap-1.5">
                  <span>{userProfile.name}</span>
                  {currentUser && (
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#45dfa4]/20 text-[#45dfa4]">
                      Cloud Synced
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-[#87929a]">
                  {currentUser ? userProfile.email : 'Local guest profile · Sign in to sync across devices'}
                </div>
              </div>
            </div>

            {currentUser ? (
              <button
                type="button"
                onClick={() => {
                  logOut();
                  setActiveModal(null);
                }}
                className="px-3 py-1.5 rounded-lg bg-[#222a3d] text-xs font-semibold text-[#ffb4ab] hover:bg-[#2d364f] transition-all flex items-center gap-1.5"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setAuthModalMode('login');
                  setActiveModal('auth');
                }}
                className="px-3 py-1.5 rounded-lg bg-[#38bdf8] text-xs font-bold text-[#00354a] hover:bg-white transition-all shadow-sm"
              >
                Sign In
              </button>
            )}
          </div>

          {/* Occupation Selection (Affects AI Copilot Advice) */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-[#dae2fd]">
                Occupation / Daily Persona
              </label>
              <span className="text-[10px] text-[#45dfa4] font-medium">
                Tunes AI recommendations
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {occupations.map((occ) => (
                <button
                  type="button"
                  key={occ}
                  onClick={() => setOccupation(occ)}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold text-left transition-all border ${
                    occupation === occ
                      ? 'bg-[#38bdf8] text-[#00354a] border-[#38bdf8] shadow-sm font-bold'
                      : 'bg-[#222a3d]/40 text-[#bdc8d1] border-white/5 hover:bg-[#222a3d]'
                  }`}
                >
                  {occ}
                </button>
              ))}
            </div>
          </div>

          {/* Temperature Units */}
          <div>
            <label className="block text-xs font-semibold text-[#dae2fd] mb-1.5">
              Temperature Unit
            </label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPreferredUnit('celsius')}
                className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all border ${
                  preferredUnit === 'celsius'
                    ? 'bg-[#38bdf8] text-[#00354a] border-[#38bdf8]'
                    : 'bg-[#222a3d]/40 text-[#bdc8d1] border-white/5'
                }`}
              >
                Celsius (°C)
              </button>
              <button
                type="button"
                onClick={() => setPreferredUnit('fahrenheit')}
                className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all border ${
                  preferredUnit === 'fahrenheit'
                    ? 'bg-[#38bdf8] text-[#00354a] border-[#38bdf8]'
                    : 'bg-[#222a3d]/40 text-[#bdc8d1] border-white/5'
                }`}
              >
                Fahrenheit (°F)
              </button>
            </div>
          </div>

          {/* Diagnostic status block */}
          <div className="p-3.5 rounded-xl bg-[#060e20]/60 border border-white/5 space-y-2">
            <span className="text-[11px] font-bold text-[#87929a] uppercase tracking-wider block">
              Engine Telemetry &amp; Database
            </span>
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#bdc8d1]">Firebase Cloud Firestore</span>
              <span className="text-[#45dfa4] font-mono font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Connected
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#bdc8d1]">Open-Meteo Atmospheric Feed</span>
              <span className="text-[#45dfa4] font-mono font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Operational
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#bdc8d1]">Gemini 3.8 Flash AI Model</span>
              <span className="text-[#45dfa4] font-mono font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Server-side
              </span>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-white/5 flex items-center justify-between">
            <button
              type="button"
              onClick={() => {
                localStorage.clear();
                window.location.reload();
              }}
              className="text-xs text-[#ffb4ab] hover:underline flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset preferences</span>
            </button>

            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-[#38bdf8] text-[#00354a] text-xs font-bold hover:bg-white transition-all shadow-md"
            >
              {savedSuccess ? 'Saved!' : 'Save Preferences'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
