import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  WeatherData,
  WeatherAlert,
  ClothingRecommendation,
  AiWeatherInsight,
  UserProfile,
  LocationInfo,
  UserOccupation,
} from '../types';
import { fetchWeather, evaluateAlerts, fetchAiInsight, fetchClothingRecommendation } from '../services/api';
import { useAuth } from './AuthContext';
import { db, handleFirestoreError, OperationType } from '../services/firebase';
import {
  collection,
  doc,
  onSnapshot,
  setDoc,
  deleteDoc,
} from 'firebase/firestore';

interface WeatherContextType {
  currentLocation: LocationInfo;
  weather: WeatherData | null;
  isLoading: boolean;
  error: string | null;
  activeTab: 'home' | 'chat' | 'reports' | 'map';
  setActiveTab: (tab: 'home' | 'chat' | 'reports' | 'map') => void;
  savedLocations: LocationInfo[];
  alerts: WeatherAlert[];
  dismissedAlertIds: string[];
  userProfile: UserProfile;
  aiInsight: AiWeatherInsight | null;
  clothing: ClothingRecommendation | null;
  activeModal: 'alerts' | 'saved' | 'settings' | 'profile' | 'auth' | null;
  setActiveModal: (modal: 'alerts' | 'saved' | 'settings' | 'profile' | 'auth' | null) => void;
  authModalMode: 'login' | 'signup';
  setAuthModalMode: (mode: 'login' | 'signup') => void;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  refreshWeather: () => Promise<void>;
  selectLocation: (loc: LocationInfo) => void;
  updateOccupation: (occ: UserOccupation) => void;
  updatePreferredUnit: (unit: 'celsius' | 'fahrenheit') => void;
  addSavedLocation: (loc: LocationInfo) => void;
  removeSavedLocation: (nameOrId: string) => void;
  dismissAlert: (id: string) => void;
  formatTemp: (celsius: number) => string;
}

const DEFAULT_LOCATION: LocationInfo = {
  id: 'mysuru-default',
  name: 'Mysuru',
  region: 'Karnataka',
  country: 'India',
  latitude: 12.2958,
  longitude: 76.6394,
  isDefault: true,
};

const DEFAULT_SAVED: LocationInfo[] = [
  { id: 'bengaluru', name: 'Bengaluru', region: 'Karnataka', country: 'India', latitude: 12.9716, longitude: 77.5946 },
  { id: 'bhubaneswar', name: 'Bhubaneswar', region: 'Odisha', country: 'India', latitude: 20.2961, longitude: 85.8245 },
  { id: 'mumbai', name: 'Mumbai', region: 'Maharashtra', country: 'India', latitude: 19.0760, longitude: 72.8777 },
];

const DEFAULT_PROFILE: UserProfile = {
  uid: 'usr_guest',
  name: 'Guest Meteorologist',
  email: '',
  occupation: 'Student',
  preferredUnit: 'celsius',
  defaultLocation: DEFAULT_LOCATION,
};

const WeatherContext = createContext<WeatherContextType | undefined>(undefined);

export const WeatherProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser, userProfile: authProfile, updateOccupation: authUpdateOcc, updatePreferredUnit: authUpdateUnit } = useAuth();

  const [currentLocation, setCurrentLocation] = useState<LocationInfo>(() => {
    const saved = localStorage.getItem('weathergpt_location');
    return saved ? JSON.parse(saved) : DEFAULT_LOCATION;
  });

  const [savedLocations, setSavedLocations] = useState<LocationInfo[]>(() => {
    const saved = localStorage.getItem('weathergpt_saved_locations');
    return saved ? JSON.parse(saved) : DEFAULT_SAVED;
  });

  const effectiveProfile: UserProfile = authProfile || {
    ...DEFAULT_PROFILE,
    name: 'Ankita',
    email: 'ankitaprasannanayak@gmail.com',
  };

  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTabRaw] = useState<'home' | 'chat' | 'reports' | 'map'>('home');
  const [activeModal, setActiveModalRaw] = useState<'alerts' | 'saved' | 'settings' | 'profile' | 'auth' | null>(null);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup'>('login');
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen((prev) => !prev);
  }, []);

  const setActiveTab = useCallback((tab: 'home' | 'chat' | 'reports' | 'map') => {
    setActiveTabRaw(tab);
    setIsSidebarOpen(false); // Auto close sidebar on mobile when tab changes
  }, []);

  const setActiveModal = useCallback((modal: 'alerts' | 'saved' | 'settings' | 'profile' | 'auth' | null) => {
    setActiveModalRaw(modal);
    if (modal) setIsSidebarOpen(false); // Auto close sidebar when modal opens
  }, []);

  const [alerts, setAlerts] = useState<WeatherAlert[]>([]);
  const [dismissedAlertIds, setDismissedAlertIds] = useState<string[]>([]);
  const [aiInsight, setAiInsight] = useState<AiWeatherInsight | null>(null);
  const [clothing, setClothing] = useState<ClothingRecommendation | null>(null);

  // Synchronize saved locations from Firestore for logged-in user
  useEffect(() => {
    if (!currentUser) return;

    const path = `users/${currentUser.uid}/savedLocations`;
    const colRef = collection(db, 'users', currentUser.uid, 'savedLocations');

    const unsubscribe = onSnapshot(
      colRef,
      (snapshot) => {
        if (!snapshot.empty) {
          const list: LocationInfo[] = snapshot.docs.map((d) => ({
            ...(d.data() as LocationInfo),
            id: d.id,
          }));
          setSavedLocations(list);
          localStorage.setItem('weathergpt_saved_locations', JSON.stringify(list));
        }
      },
      (err) => {
        handleFirestoreError(err, OperationType.GET, path);
      }
    );

    return () => unsubscribe();
  }, [currentUser]);

  const loadWeatherData = useCallback(async (loc: LocationInfo) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchWeather(loc.latitude, loc.longitude, loc.name, loc.country);
      setWeather(data);

      // Concurrently fetch alerts, AI insights & attire advice personalized to current occupation
      const [evaluatedAlerts, insight, cloth] = await Promise.all([
        evaluateAlerts(data),
        fetchAiInsight(data, effectiveProfile.occupation),
        fetchClothingRecommendation(data),
      ]);

      setAlerts(evaluatedAlerts);
      setAiInsight(insight);
      setClothing(cloth);
    } catch (err: any) {
      console.warn('Notice fetching weather:', err);
      setError('Weather data is temporarily unavailable. Displaying cached atmospheric baseline.');
    } finally {
      setIsLoading(false);
    }
  }, [effectiveProfile.occupation]);

  useEffect(() => {
    loadWeatherData(currentLocation);
  }, [currentLocation, loadWeatherData]);

  const selectLocation = (loc: LocationInfo) => {
    setCurrentLocation(loc);
    localStorage.setItem('weathergpt_location', JSON.stringify(loc));
  };

  const refreshWeather = async () => {
    await loadWeatherData(currentLocation);
  };

  const updateOccupation = async (occupation: UserOccupation) => {
    if (currentUser) {
      await authUpdateOcc(occupation);
    }
    if (weather) {
      fetchAiInsight(weather, occupation).then(setAiInsight);
    }
  };

  const updatePreferredUnit = async (preferredUnit: 'celsius' | 'fahrenheit') => {
    if (currentUser) {
      await authUpdateUnit(preferredUnit);
    }
  };

  const addSavedLocation = async (loc: LocationInfo) => {
    if (savedLocations.some((l) => l.name.toLowerCase() === loc.name.toLowerCase())) return;
    const cleanRawId = loc.id || loc.name.toLowerCase().replace(/[^a-z0-9_-]/g, '_');
    const locId = (cleanRawId.replace(/^_+|_+$/g, '') || `loc_${Date.now()}`).slice(0, 100);
    const enriched = { ...loc, id: locId };
    const updated = [...savedLocations, enriched];
    setSavedLocations(updated);
    localStorage.setItem('weathergpt_saved_locations', JSON.stringify(updated));

    if (currentUser) {
      const path = `users/${currentUser.uid}/savedLocations/${locId}`;
      try {
        await setDoc(doc(db, 'users', currentUser.uid, 'savedLocations', locId), {
          id: locId,
          userId: currentUser.uid,
          name: (loc.name || 'Location').slice(0, 100),
          region: (loc.region || '').slice(0, 100),
          country: (loc.country || 'Global').slice(0, 100),
          latitude: Number(loc.latitude) || 0,
          longitude: Number(loc.longitude) || 0,
          createdAt: new Date().toISOString(),
        });
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, path);
      }
    }
  };

  const removeSavedLocation = async (nameOrId: string) => {
    const updated = savedLocations.filter(
      (l) => l.name.toLowerCase() !== nameOrId.toLowerCase() && l.id !== nameOrId
    );
    setSavedLocations(updated);
    localStorage.setItem('weathergpt_saved_locations', JSON.stringify(updated));

    if (currentUser) {
      const target = savedLocations.find(
        (l) => l.name.toLowerCase() === nameOrId.toLowerCase() || l.id === nameOrId
      );
      if (target?.id) {
        const path = `users/${currentUser.uid}/savedLocations/${target.id}`;
        try {
          await deleteDoc(doc(db, 'users', currentUser.uid, 'savedLocations', target.id));
        } catch (err) {
          handleFirestoreError(err, OperationType.DELETE, path);
        }
      }
    }
  };

  const dismissAlert = (id: string) => {
    setDismissedAlertIds((prev) => [...prev, id]);
  };

  const formatTemp = (celsius: number): string => {
    if (effectiveProfile.preferredUnit === 'fahrenheit') {
      const f = Math.round((celsius * 9) / 5 + 32);
      return `${f}°F`;
    }
    return `${celsius}°C`;
  };

  return (
    <WeatherContext.Provider
      value={{
        currentLocation,
        weather,
        isLoading,
        error,
        activeTab,
        setActiveTab,
        savedLocations,
        alerts,
        dismissedAlertIds,
        userProfile: effectiveProfile,
        aiInsight,
        clothing,
        activeModal,
        setActiveModal,
        authModalMode,
        setAuthModalMode,
        isSidebarOpen,
        setIsSidebarOpen,
        toggleSidebar,
        refreshWeather,
        selectLocation,
        updateOccupation,
        updatePreferredUnit,
        addSavedLocation,
        removeSavedLocation,
        dismissAlert,
        formatTemp,
      }}
    >
      {children}
    </WeatherContext.Provider>
  );
};

export const useWeather = () => {
  const context = useContext(WeatherContext);
  if (!context) {
    throw new Error('useWeather must be used within a WeatherProvider');
  }
  return context;
};
