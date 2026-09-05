import React from 'react';
import { Sun, Bot, BarChart3, Radar, Menu } from 'lucide-react';
import { useWeather } from '../../context/WeatherContext';

export const BottomNavBar: React.FC = () => {
  const { activeTab, setActiveTab, toggleSidebar, isSidebarOpen, alerts, dismissedAlertIds } = useWeather();

  const unreadAlertsCount = alerts.filter((a) => !dismissedAlertIds.includes(a.id)).length;

  return (
    <nav
      aria-label="Mobile navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-[#111827]/95 backdrop-blur-2xl border-t border-white/10 z-40 px-2 flex items-center justify-around shadow-[0_-4px_20px_rgba(0,0,0,0.4)]"
    >
      {/* Home */}
      <button
        onClick={() => setActiveTab('home')}
        className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
          activeTab === 'home'
            ? 'text-[#38bdf8] font-bold scale-105'
            : 'text-[#87929a] hover:text-[#dae2fd]'
        }`}
      >
        <Sun className={`w-5 h-5 ${activeTab === 'home' ? 'text-[#38bdf8]' : ''}`} />
        <span className="text-[10px] mt-0.5 tracking-tight">Home</span>
      </button>

      {/* AI Chat */}
      <button
        onClick={() => setActiveTab('chat')}
        className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
          activeTab === 'chat'
            ? 'text-[#38bdf8] font-bold scale-105'
            : 'text-[#87929a] hover:text-[#dae2fd]'
        }`}
      >
        <Bot className={`w-5 h-5 ${activeTab === 'chat' ? 'text-[#38bdf8]' : ''}`} />
        <span className="text-[10px] mt-0.5 tracking-tight">AI Chat</span>
      </button>

      {/* Reports */}
      <button
        onClick={() => setActiveTab('reports')}
        className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
          activeTab === 'reports'
            ? 'text-[#38bdf8] font-bold scale-105'
            : 'text-[#87929a] hover:text-[#dae2fd]'
        }`}
      >
        <BarChart3 className={`w-5 h-5 ${activeTab === 'reports' ? 'text-[#38bdf8]' : ''}`} />
        <span className="text-[10px] mt-0.5 tracking-tight">Reports</span>
      </button>

      {/* Radar Map */}
      <button
        onClick={() => setActiveTab('map')}
        className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
          activeTab === 'map'
            ? 'text-[#38bdf8] font-bold scale-105'
            : 'text-[#87929a] hover:text-[#dae2fd]'
        }`}
      >
        <Radar className={`w-5 h-5 ${activeTab === 'map' ? 'text-[#38bdf8]' : ''}`} />
        <span className="text-[10px] mt-0.5 tracking-tight">Radar</span>
      </button>

      {/* Side Menu Drawer Toggle Button */}
      <button
        onClick={toggleSidebar}
        className={`relative flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
          isSidebarOpen
            ? 'text-[#38bdf8] font-bold scale-105'
            : 'text-[#87929a] hover:text-[#dae2fd]'
        }`}
        aria-label="Toggle full side menu"
      >
        <Menu className="w-5 h-5" />
        {unreadAlertsCount > 0 && (
          <span className="absolute top-1 right-2.5 w-2 h-2 rounded-full bg-[#ffb4ab] ring-2 ring-[#111827]" />
        )}
        <span className="text-[10px] mt-0.5 tracking-tight">Menu</span>
      </button>
    </nav>
  );
};
