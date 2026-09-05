import React from 'react';
import {
  Sun,
  Bot,
  BarChart3,
  Radar,
  Bell,
  Bookmark,
  Settings,
  Wind,
  X,
  User,
  ChevronRight,
} from 'lucide-react';
import { useWeather } from '../../context/WeatherContext';

export const Sidebar: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    alerts,
    dismissedAlertIds,
    userProfile,
    setActiveModal,
    isSidebarOpen,
    setIsSidebarOpen,
  } = useWeather();

  const unreadAlertsCount = alerts.filter((a) => !dismissedAlertIds.includes(a.id)).length;

  const handleNavClick = (tab: 'home' | 'chat' | 'reports' | 'map') => {
    setActiveTab(tab);
    setIsSidebarOpen(false);
  };

  const handleModalClick = (modal: 'alerts' | 'saved' | 'settings' | 'profile') => {
    setActiveModal(modal);
    setIsSidebarOpen(false);
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      <div
        onClick={() => setIsSidebarOpen(false)}
        className={`fixed inset-0 bg-black/70 backdrop-blur-sm z-50 md:hidden transition-opacity duration-300 ${
          isSidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        aria-hidden="true"
      />

      {/* Main Sidebar: Drawer on Mobile (< md), Fixed Icon Rail on Desktop (md:) */}
      <aside
        className={`fixed left-0 top-0 h-full bg-[#131b2e] z-50 flex flex-col justify-between border-r border-white/10 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)] transition-transform duration-300 ease-in-out
          w-72 p-5 ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } md:translate-x-0 md:w-20 md:py-4 md:px-0 md:items-center md:bg-[#131b2e]/80 md:backdrop-blur-2xl md:border-white/5
        `}
      >
        {/* Top Section */}
        <div className="flex flex-col w-full md:items-center">
          {/* Mobile Header with App Name and Close Button */}
          <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4 md:hidden">
            <div className="flex items-center gap-2.5">
              <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-[#38bdf8]/30 to-[#8ed5ff]/10 text-[#38bdf8] border border-[#38bdf8]/30">
                <Wind className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <span className="text-base font-bold text-[#dae2fd] tracking-tight">
                  Weather<span className="text-[#38bdf8]">GPT</span>
                </span>
                <span className="ml-2 text-[9px] font-semibold px-1.5 py-0.5 rounded bg-[#2d3449] text-[#7bd0ff] uppercase tracking-wider">
                  v2.4
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="p-2 rounded-xl text-[#87929a] hover:text-[#dae2fd] hover:bg-white/5 transition-colors"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Desktop Top Brand Emblem */}
          <div className="hidden md:flex flex-col items-center gap-6 w-full mb-6">
            <button
              onClick={() => handleNavClick('home')}
              className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-[#38bdf8]/30 to-[#8ed5ff]/10 text-[#38bdf8] hover:scale-105 transition-all shadow-[0_0_20px_rgba(56,189,248,0.25)] border border-[#38bdf8]/20 group"
              title="WeatherGPT Home"
            >
              <Wind className="w-6 h-6 animate-pulse" />
            </button>
          </div>

          {/* Mobile User Profile Summary Banner */}
          <div
            onClick={() => handleModalClick('profile')}
            className="flex md:hidden items-center gap-3 p-3 rounded-xl bg-[#171f33] border border-white/5 mb-5 cursor-pointer hover:bg-[#222a3d] transition-colors group"
          >
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80"
              alt={userProfile.name}
              referrerPolicy="no-referrer"
              className="w-10 h-10 rounded-full object-cover border border-white/20"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-bold text-[#dae2fd] truncate">{userProfile.name}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#45dfa4] flex-shrink-0" title="Active" />
              </div>
              <span className="text-xs text-[#87929a] block truncate">{userProfile.occupation}</span>
            </div>
            <ChevronRight className="w-4 h-4 text-[#87929a] group-hover:translate-x-0.5 transition-transform" />
          </div>

          {/* Navigation Section Title on Mobile */}
          <span className="text-[10px] uppercase font-bold tracking-wider text-[#87929a] mb-2 px-1 md:hidden">
            Navigation
          </span>

          {/* Primary Navigation Items */}
          <nav className="flex flex-col gap-1.5 md:gap-2 w-full md:px-2">
            {/* Home */}
            <button
              onClick={() => handleNavClick('home')}
              className={`relative flex items-center md:justify-center w-full md:w-12 h-11 md:h-12 px-3 md:px-0 rounded-xl transition-all group ${
                activeTab === 'home'
                  ? 'bg-[#38bdf8] text-[#00354a] font-bold shadow-[0_0_20px_rgba(56,189,248,0.4)]'
                  : 'text-[#bdc8d1] hover:bg-[#222a3d] hover:text-[#dae2fd]'
              }`}
              title="Home / Today"
            >
              <Sun className="w-5 h-5 flex-shrink-0" />
              <span className="ml-3 text-sm md:hidden font-medium">Home &amp; Dashboard</span>
              <span className="hidden md:block absolute left-20 bg-[#2d3449] text-[#dae2fd] text-xs font-semibold px-2.5 py-1 rounded-md shadow-xl whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-50 border border-white/10">
                Home
              </span>
            </button>

            {/* AI Chat */}
            <button
              onClick={() => handleNavClick('chat')}
              className={`relative flex items-center md:justify-center w-full md:w-12 h-11 md:h-12 px-3 md:px-0 rounded-xl transition-all group ${
                activeTab === 'chat'
                  ? 'bg-[#38bdf8] text-[#00354a] font-bold shadow-[0_0_20px_rgba(56,189,248,0.4)]'
                  : 'text-[#bdc8d1] hover:bg-[#222a3d] hover:text-[#dae2fd]'
              }`}
              title="WeatherGPT AI Chat"
            >
              <Bot className="w-5 h-5 flex-shrink-0" />
              <span className="ml-3 text-sm md:hidden font-medium">WeatherGPT AI</span>
              <span className="hidden md:block absolute left-20 bg-[#2d3449] text-[#dae2fd] text-xs font-semibold px-2.5 py-1 rounded-md shadow-xl whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-50 border border-white/10">
                WeatherGPT AI
              </span>
            </button>

            {/* Reports & Analytics */}
            <button
              onClick={() => handleNavClick('reports')}
              className={`relative flex items-center md:justify-center w-full md:w-12 h-11 md:h-12 px-3 md:px-0 rounded-xl transition-all group ${
                activeTab === 'reports'
                  ? 'bg-[#38bdf8] text-[#00354a] font-bold shadow-[0_0_20px_rgba(56,189,248,0.4)]'
                  : 'text-[#bdc8d1] hover:bg-[#222a3d] hover:text-[#dae2fd]'
              }`}
              title="Reports & Analytics"
            >
              <BarChart3 className="w-5 h-5 flex-shrink-0" />
              <span className="ml-3 text-sm md:hidden font-medium">Reports &amp; Analytics</span>
              <span className="hidden md:block absolute left-20 bg-[#2d3449] text-[#dae2fd] text-xs font-semibold px-2.5 py-1 rounded-md shadow-xl whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-50 border border-white/10">
                Analytics &amp; Reports
              </span>
            </button>

            {/* Live Radar Map */}
            <button
              onClick={() => handleNavClick('map')}
              className={`relative flex items-center md:justify-center w-full md:w-12 h-11 md:h-12 px-3 md:px-0 rounded-xl transition-all group ${
                activeTab === 'map'
                  ? 'bg-[#38bdf8] text-[#00354a] font-bold shadow-[0_0_20px_rgba(56,189,248,0.4)]'
                  : 'text-[#bdc8d1] hover:bg-[#222a3d] hover:text-[#dae2fd]'
              }`}
              title="Live Weather Map"
            >
              <Radar className="w-5 h-5 flex-shrink-0" />
              <span className="ml-3 text-sm md:hidden font-medium">Live Radar Map</span>
              <span className="hidden md:block absolute left-20 bg-[#2d3449] text-[#dae2fd] text-xs font-semibold px-2.5 py-1 rounded-md shadow-xl whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-50 border border-white/10">
                Live Weather Radar
              </span>
            </button>
          </nav>
        </div>

        {/* Bottom Utility Tools & Settings */}
        <div className="flex flex-col w-full md:items-center mt-6 pt-4 border-t border-white/10 md:border-t-0 md:pt-0">
          <span className="text-[10px] uppercase font-bold tracking-wider text-[#87929a] mb-2 px-1 md:hidden">
            Tools &amp; Settings
          </span>

          <div className="flex flex-col gap-1.5 md:gap-2 w-full md:px-2">
            {/* Alerts Button */}
            <button
              onClick={() => handleModalClick('alerts')}
              className="relative flex items-center md:justify-center w-full md:w-12 h-11 md:h-12 px-3 md:px-0 rounded-xl text-[#bdc8d1] hover:bg-[#222a3d] hover:text-[#dae2fd] transition-all group"
              title="Active Alerts"
            >
              <Bell className="w-5 h-5 flex-shrink-0" />
              {unreadAlertsCount > 0 && (
                <span className="absolute top-2.5 right-2.5 md:top-2.5 md:right-2.5 w-2.5 h-2.5 rounded-full bg-[#ffb4ab] ring-2 ring-[#131b2e] animate-pulse" />
              )}
              <span className="ml-3 text-sm md:hidden font-medium flex-1 text-left">
                Active Alerts
              </span>
              {unreadAlertsCount > 0 && (
                <span className="md:hidden px-2 py-0.5 rounded-full bg-[#ffb4ab]/20 text-[#ffb4ab] text-xs font-semibold">
                  {unreadAlertsCount}
                </span>
              )}
              <span className="hidden md:block absolute left-20 bg-[#2d3449] text-[#dae2fd] text-xs font-semibold px-2.5 py-1 rounded-md shadow-xl whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-50 border border-white/10">
                Alerts ({unreadAlertsCount})
              </span>
            </button>

            {/* Saved Locations */}
            <button
              onClick={() => handleModalClick('saved')}
              className="relative flex items-center md:justify-center w-full md:w-12 h-11 md:h-12 px-3 md:px-0 rounded-xl text-[#bdc8d1] hover:bg-[#222a3d] hover:text-[#dae2fd] transition-all group"
              title="Saved Locations"
            >
              <Bookmark className="w-5 h-5 flex-shrink-0" />
              <span className="ml-3 text-sm md:hidden font-medium">Saved Locations</span>
              <span className="hidden md:block absolute left-20 bg-[#2d3449] text-[#dae2fd] text-xs font-semibold px-2.5 py-1 rounded-md shadow-xl whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-50 border border-white/10">
                Saved Locations
              </span>
            </button>

            {/* Settings */}
            <button
              onClick={() => handleModalClick('settings')}
              className="relative flex items-center md:justify-center w-full md:w-12 h-11 md:h-12 px-3 md:px-0 rounded-xl text-[#bdc8d1] hover:bg-[#222a3d] hover:text-[#dae2fd] transition-all group"
              title="Preferences & Settings"
            >
              <Settings className="w-5 h-5 flex-shrink-0" />
              <span className="ml-3 text-sm md:hidden font-medium">Preferences</span>
              <span className="hidden md:block absolute left-20 bg-[#2d3449] text-[#dae2fd] text-xs font-semibold px-2.5 py-1 rounded-md shadow-xl whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-50 border border-white/10">
                Settings
              </span>
            </button>

            <div className="hidden md:block my-1 w-8 h-[1px] bg-[#2d3449]" />

            {/* Desktop User Avatar */}
            <button
              onClick={() => handleModalClick('profile')}
              className="hidden md:flex relative items-center justify-center p-0.5 rounded-full hover:ring-2 hover:ring-[#38bdf8] transition-all group"
              title={`Signed in as ${userProfile.name}`}
            >
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80"
                alt={userProfile.name}
                referrerPolicy="no-referrer"
                className="w-8 h-8 rounded-full object-cover border border-white/20"
              />
              <span className="absolute left-20 bg-[#2d3449] text-[#dae2fd] text-xs font-semibold px-2.5 py-1 rounded-md shadow-xl whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-50 border border-white/10">
                {userProfile.name} ({userProfile.occupation})
              </span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
