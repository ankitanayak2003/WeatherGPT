import React from 'react';
import {
  MapPin,
  ChevronDown,
  AlertTriangle,
  LogIn,
  LogOut,
  UserCheck,
  Menu,
} from 'lucide-react';
import { useWeather } from '../../context/WeatherContext';
import { useAuth } from '../../context/AuthContext';

export const Topbar: React.FC = () => {
  const {
    currentLocation,
    userProfile,
    alerts,
    dismissedAlertIds,
    setActiveModal,
    setAuthModalMode,
    toggleSidebar,
  } = useWeather();

  const { currentUser, logOut } = useAuth();

  const activeAlert = alerts.find((a) => !dismissedAlertIds.includes(a.id));

  return (
    <header className="fixed top-0 left-0 md:left-20 right-0 h-16 bg-[#131b2e]/90 backdrop-blur-2xl z-40 px-3 sm:px-6 flex items-center justify-between border-b border-white/5 shadow-[0_1px_8px_rgba(0,0,0,0.25)]">
      {/* Left side: Hamburger Toggle (Mobile) + Brand + Location Dropdown */}
      <div className="flex items-center gap-2 sm:gap-4 min-w-0">
        {/* Mobile Hamburger Menu Toggle Button */}
        <button
          onClick={toggleSidebar}
          className="md:hidden flex items-center justify-center w-9 h-9 rounded-xl bg-[#171f33]/90 hover:bg-[#222a3d] text-[#dae2fd] border border-white/10 shadow-sm transition-all flex-shrink-0"
          aria-label="Toggle navigation menu"
        >
          <Menu className="w-5 h-5 text-[#38bdf8]" />
        </button>

        {/* Brand */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <span className="text-base sm:text-lg font-bold text-[#dae2fd] tracking-tight">
            Weather<span className="text-[#38bdf8]">GPT</span>
          </span>
          <span className="hidden sm:inline-flex text-[10px] font-semibold px-1.5 py-0.5 rounded bg-[#2d3449] text-[#7bd0ff] uppercase tracking-wider">
            v2.4
          </span>
        </div>

        <div className="hidden sm:block h-4 w-[1px] bg-[#2d3449] flex-shrink-0" />

        {/* Location Dropdown Button */}
        <button
          onClick={() => setActiveModal('saved')}
          className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-full bg-[#171f33]/90 hover:bg-[#222a3d] text-[#dae2fd] transition-all border border-white/5 shadow-sm group min-w-0 max-w-[140px] sm:max-w-[220px]"
          title="Change location"
        >
          <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#38bdf8] flex-shrink-0 group-hover:scale-110 transition-transform" />
          <span className="text-xs font-semibold tracking-wide truncate">
            {currentLocation.name}{currentLocation.region ? `, ${currentLocation.region}` : ''}
          </span>
          <ChevronDown className="w-3 h-3 text-[#bdc8d1] flex-shrink-0 group-hover:translate-y-0.5 transition-transform" />
        </button>
      </div>

      {/* Right side: Alert Pill + Profile / Auth */}
      <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
        {/* Animated Alert Banner Pill */}
        {activeAlert && (
          <button
            onClick={() => setActiveModal('alerts')}
            className="flex items-center gap-1.5 px-2 sm:px-3 py-1 rounded-full bg-[#e1a800]/15 border border-[#e1a800]/30 text-[#f9bd22] animate-pulse hover:bg-[#e1a800]/25 transition-colors cursor-pointer"
            title={activeAlert.title}
          >
            <AlertTriangle className="w-3.5 h-3.5 text-[#f9bd22] flex-shrink-0" />
            <span className="text-[11px] font-semibold tracking-wide hidden md:inline truncate max-w-[160px]">
              {activeAlert.title.includes('Rain') ? 'Rainstorm Expected · 4:00 PM' : activeAlert.title}
            </span>
          </button>
        )}

        {/* User Account / Auth Actions */}
        {currentUser ? (
          <div className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => setActiveModal('settings')}
              className="flex items-center gap-2 pl-2 py-1 rounded-full hover:bg-white/5 transition-colors group text-left"
            >
              <div className="hidden sm:flex flex-col text-right">
                <span className="text-xs font-semibold text-[#dae2fd] leading-tight flex items-center gap-1 justify-end">
                  <span className="truncate max-w-[110px]">{userProfile.name}</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#45dfa4] flex-shrink-0" title="Firebase Connected" />
                </span>
                <span className="text-[10px] text-[#bdc8d1] font-medium truncate max-w-[110px]">
                  {userProfile.occupation}
                </span>
              </div>
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#38bdf8] to-[#45dfa4] text-[#00354a] font-bold flex items-center justify-center text-xs border border-white/20 group-hover:ring-2 group-hover:ring-[#38bdf8] transition-all">
                {userProfile.name ? userProfile.name.charAt(0).toUpperCase() : 'U'}
              </div>
            </button>

            <button
              onClick={logOut}
              className="p-1.5 sm:p-2 rounded-xl text-[#87929a] hover:text-[#ffb4ab] hover:bg-[#222a3d] transition-colors"
              title="Log Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={() => {
                setAuthModalMode('login');
                setActiveModal('auth');
              }}
              className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-full bg-[#171f33] hover:bg-[#222a3d] text-xs font-semibold text-[#dae2fd] border border-white/10 transition-all shadow-sm"
            >
              <LogIn className="w-3.5 h-3.5 text-[#38bdf8]" />
              <span>Log In</span>
            </button>

            <button
              onClick={() => {
                setAuthModalMode('signup');
                setActiveModal('auth');
              }}
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-[#38bdf8] to-[#45dfa4] hover:opacity-90 text-xs font-bold text-[#00354a] transition-all shadow-md"
            >
              <UserCheck className="w-3.5 h-3.5 text-[#00354a]" />
              <span>Sign Up</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
