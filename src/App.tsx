import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { WeatherProvider, useWeather } from './context/WeatherContext';
import { Sidebar } from './components/layout/Sidebar';
import { Topbar } from './components/layout/Topbar';
import { BottomNavBar } from './components/layout/BottomNavBar';
import { Home } from './pages/Home';
import { WeatherGptChat } from './pages/WeatherGptChat';
import { Reports } from './pages/Reports';
import { LiveWeatherMap } from './pages/LiveWeatherMap';
import { AlertsModal } from './components/modals/AlertsModal';
import { SavedLocationsModal } from './components/modals/SavedLocationsModal';
import { SettingsModal } from './components/modals/SettingsModal';
import { AuthModal } from './components/auth/AuthModal';
import { LoginIntroAnimation } from './components/auth/LoginIntroAnimation';

const AppContent: React.FC = () => {
  const { activeTab, activeModal, setActiveModal, authModalMode } = useWeather();
  const { isLoginAnimating, loginAnimationData, finishLoginAnimation } = useAuth();

  return (
    <div className="min-h-screen bg-[#0b1326] text-[#dae2fd] font-sans flex flex-col selection:bg-[#38bdf8] selection:text-[#00354a] overflow-x-hidden">
      {/* Entertaining Post-Login Persona Calibration Animation */}
      {isLoginAnimating && loginAnimationData && (
        <LoginIntroAnimation
          name={loginAnimationData.name}
          occupation={loginAnimationData.occupation}
          onFinish={finishLoginAnimation}
        />
      )}

      {/* Global Navigation Sidebar (Slide Drawer on Mobile, Rail on Desktop) */}
      <Sidebar />

      {/* Global Fixed Topbar */}
      <Topbar />

      {/* Primary Dynamic Content Area: ml-0 on Mobile, md:ml-20 on Desktop */}
      <main className="ml-0 md:ml-20 pt-16 min-h-screen flex-1 relative flex flex-col pb-20 md:pb-6 overflow-x-hidden">
        {activeTab === 'home' && <Home />}
        {activeTab === 'chat' && <WeatherGptChat />}
        {activeTab === 'reports' && <Reports />}
        {activeTab === 'map' && <LiveWeatherMap />}
      </main>

      {/* Mobile Bottom Thumb Navigation Bar */}
      <BottomNavBar />

      {/* Modals */}
      <AlertsModal />
      <SavedLocationsModal />
      <SettingsModal />
      <AuthModal
        isOpen={activeModal === 'auth'}
        onClose={() => setActiveModal(null)}
        initialMode={authModalMode}
      />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <WeatherProvider>
        <AppContent />
      </WeatherProvider>
    </AuthProvider>
  );
}
