import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  MapPin,
  Play,
  Pause,
  CloudRain,
  Thermometer,
  Wind,
  Cloud,
  Navigation,
  ChevronRight,
  Maximize2,
  Minimize2,
  Loader2,
  Plus,
  Compass,
  Search,
  Check,
  Eye,
  Globe,
  X,
  Droplets,
  Flame,
  CloudLightning,
  Sun,
  Umbrella,
} from 'lucide-react';
import L from 'leaflet';
import { useWeather } from '../context/WeatherContext';
import { ALL_MAP_CITIES, MapCityStation } from '../data/majorCities';
import { fetchWeather, reverseGeocodeCoordinates } from '../services/api';
import { LocationInfo, WeatherData } from '../types';

export const LiveWeatherMap: React.FC = () => {
  const { currentLocation, selectLocation, savedLocations, addSavedLocation, formatTemp } = useWeather();

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const clickedMarkerRef = useRef<L.Marker | null>(null);

  const [activeLayer, setActiveLayer] = useState<'rain' | 'temp' | 'wind' | 'clouds'>('rain');
  const [selectedTimelineIndex, setSelectedTimelineIndex] = useState<number>(3); // 1 PM default
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  // Filter or search cities drawer
  const [cityFilter, setCityFilter] = useState<'all' | 'karnataka' | 'india' | 'global' | 'saved'>('all');
  const [citySearchQuery, setCitySearchQuery] = useState('');
  const [showCityDrawer, setShowCityDrawer] = useState<boolean>(false);

  // Selected city/location detail modal or card
  const [selectedInfo, setSelectedInfo] = useState<{
    name: string;
    region?: string;
    country?: string;
    lat: number;
    lon: number;
    temp: number;
    feelsLike: number;
    condition: string;
    humidity: number;
    wind: number;
    rainProb: number;
    isCustomClick?: boolean;
    weatherData?: WeatherData;
  } | null>(null);

  const [isLoadingSpotWeather, setIsLoadingSpotWeather] = useState<boolean>(false);
  const [isSaved, setIsSaved] = useState<boolean>(false);

  const timelineHours = [
    { label: 'NOW (10 AM)', hour: 10, rainIntensity: 'Low' },
    { label: '11 AM', hour: 11, rainIntensity: 'Low' },
    { label: '12 PM', hour: 12, rainIntensity: 'Moderate' },
    { label: '1 PM', hour: 13, rainIntensity: 'High', isCurrent: true },
    { label: '2 PM', hour: 14, rainIntensity: 'Severe' },
    { label: '3 PM', hour: 15, rainIntensity: 'Severe' },
    { label: '4 PM', hour: 16, rainIntensity: 'Extreme' },
    { label: '5 PM', hour: 17, rainIntensity: 'High' },
    { label: '6 PM', hour: 18, rainIntensity: 'Moderate' },
  ];

  // Merge predefined major cities with user's saved locations
  const allDisplayCities: MapCityStation[] = React.useMemo(() => {
    const list: MapCityStation[] = [...ALL_MAP_CITIES];

    // Append any saved location that isn't already included
    savedLocations.forEach((saved) => {
      const exists = list.some(
        (c) =>
          c.name.toLowerCase() === saved.name.toLowerCase() ||
          (Math.abs(c.lat - saved.latitude) < 0.1 && Math.abs(c.lon - saved.longitude) < 0.1)
      );
      if (!exists) {
        list.push({
          id: `saved-${saved.name.toLowerCase().replace(/\s+/g, '-')}`,
          name: saved.name,
          region: saved.region || '',
          country: saved.country || 'India',
          lat: saved.latitude,
          lon: saved.longitude,
          temp: 27,
          feelsLike: 29,
          condition: 'Saved Location',
          conditionType: 'partly-cloudy',
          humidity: 75,
          wind: 15,
          rainProb: 30,
          isPopular: false,
        });
      }
    });

    return list;
  }, [savedLocations]);

  // Filtered cities according to tab & search query
  const filteredCities = React.useMemo(() => {
    return allDisplayCities.filter((city) => {
      // Scope filter
      if (cityFilter === 'karnataka' && city.region !== 'Karnataka') return false;
      if (cityFilter === 'india' && city.country !== 'India') return false;
      if (cityFilter === 'global' && city.country === 'India') return false;
      if (cityFilter === 'saved') {
        const isUserSaved = savedLocations.some(
          (s) => s.name.toLowerCase() === city.name.toLowerCase()
        );
        if (!isUserSaved) return false;
      }

      // Search query
      if (citySearchQuery.trim()) {
        const q = citySearchQuery.toLowerCase();
        return (
          city.name.toLowerCase().includes(q) ||
          city.region.toLowerCase().includes(q) ||
          city.country.toLowerCase().includes(q)
        );
      }

      return true;
    });
  }, [allDisplayCities, cityFilter, citySearchQuery, savedLocations]);

  // Click on map handler to get instant weather for ANY tapped point
  const handleMapClick = useCallback(
    async (lat: number, lon: number) => {
      if (!mapInstanceRef.current) return;

      // Update or create clicked spot pin
      if (clickedMarkerRef.current) {
        clickedMarkerRef.current.setLatLng([lat, lon]);
      } else {
        const pinIcon = L.divIcon({
          className: 'custom-spot-marker',
          html: `
            <div class="relative flex items-center justify-center">
              <div class="w-8 h-8 rounded-full bg-[#38bdf8] flex items-center justify-center text-[#00354a] shadow-[0_0_20px_#38bdf8] ring-4 ring-[#38bdf8]/40 animate-bounce">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div class="absolute -bottom-1 w-2.5 h-1 bg-black/40 rounded-full blur-[1px]"></div>
            </div>
          `,
          iconSize: [32, 36],
          iconAnchor: [16, 36],
        });

        clickedMarkerRef.current = L.marker([lat, lon], { icon: pinIcon }).addTo(
          mapInstanceRef.current
        );
      }

      setIsLoadingSpotWeather(true);
      // Temporary placeholder while fetching
      setSelectedInfo({
        name: `Selected Coordinates (${lat.toFixed(2)}°, ${lon.toFixed(2)}°)`,
        lat,
        lon,
        temp: 0,
        feelsLike: 0,
        condition: 'Fetching Live Atmospheric Data...',
        humidity: 0,
        wind: 0,
        rainProb: 0,
        isCustomClick: true,
      });

      try {
        // 1. Reverse geocode coordinates to friendly place name
        const geoInfo = await reverseGeocodeCoordinates(lat, lon);

        // 2. Fetch real-time weather from Open-Meteo
        const weatherData = await fetchWeather(
          lat,
          lon,
          geoInfo.name,
          geoInfo.country || 'Custom Spot'
        );

        setSelectedInfo({
          name: geoInfo.name,
          region: geoInfo.region,
          country: geoInfo.country,
          lat,
          lon,
          temp: weatherData.current.temperature,
          feelsLike: weatherData.current.feelsLike,
          condition: weatherData.current.conditionText,
          humidity: weatherData.current.humidity,
          wind: weatherData.current.windSpeed,
          rainProb: weatherData.current.precipitation,
          isCustomClick: true,
          weatherData,
        });
      } catch (err) {
        console.warn('Notice: Failed to get point weather:', err);
      } finally {
        setIsLoadingSpotWeather(false);
      }
    },
    []
  );

  // Check if current selectedInfo is in savedLocations
  useEffect(() => {
    if (!selectedInfo) {
      setIsSaved(false);
      return;
    }
    const exists = savedLocations.some(
      (s) =>
        s.name.toLowerCase() === selectedInfo.name.toLowerCase() ||
        (Math.abs(s.latitude - selectedInfo.lat) < 0.05 &&
          Math.abs(s.longitude - selectedInfo.lon) < 0.05)
    );
    setIsSaved(exists);
  }, [selectedInfo, savedLocations]);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // If an instance exists or container was already initialized, clean up first
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }
    if ((mapContainerRef.current as any)._leaflet_id) {
      (mapContainerRef.current as any)._leaflet_id = null;
    }

    // Create map without any third-party watermark or attribution control
    const map = L.map(mapContainerRef.current, {
      center: [currentLocation.latitude, currentLocation.longitude],
      zoom: 7,
      zoomControl: false,
      attributionControl: false,
    });

    // Dark theme OpenStreetMap tiles (CartoDB Dark Matter)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      subdomains: 'abcd',
      maxZoom: 19,
    }).addTo(map);

    // Add zoom control top right
    L.control.zoom({ position: 'topright' }).addTo(map);

    // Create layer group for city markers
    const markerGroup = L.layerGroup().addTo(map);
    markersLayerRef.current = markerGroup;

    // Click anywhere on map listener
    map.on('click', (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;
      handleMapClick(lat, lng);
    });

    mapInstanceRef.current = map;

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [currentLocation, handleMapClick]);

  // Update Markers when allDisplayCities or currentLocation changes
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current) return;

    markersLayerRef.current.clearLayers();

    allDisplayCities.forEach((station) => {
      const isCurrentCity =
        station.name.toLowerCase() === currentLocation.name.toLowerCase() ||
        (Math.abs(station.lat - currentLocation.latitude) < 0.08 &&
          Math.abs(station.lon - currentLocation.longitude) < 0.08);

      const isSelectedSpot =
        selectedInfo &&
        selectedInfo.name.toLowerCase() === station.name.toLowerCase();

      // Custom HTML Marker Pill
      const customIcon = L.divIcon({
        className: 'custom-weather-city-marker',
        html: `
          <div class="cursor-pointer group select-none">
            <div class="relative flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all duration-200 ${
              isCurrentCity
                ? 'bg-[#38bdf8] text-[#00354a] ring-4 ring-[#38bdf8]/40 shadow-[0_0_20px_rgba(56,189,248,0.7)] font-bold scale-105'
                : isSelectedSpot
                ? 'bg-[#45dfa4] text-[#003822] ring-4 ring-[#45dfa4]/40 shadow-[0_0_18px_rgba(69,223,164,0.6)] font-bold scale-105'
                : 'bg-[#171f33]/90 text-[#dae2fd] border border-white/20 shadow-xl hover:border-[#38bdf8] hover:bg-[#222a3d]'
            } text-xs font-semibold backdrop-blur-md group-hover:scale-110">
              <span class="truncate max-w-[85px]">${station.name}</span>
              <span class="${
                isCurrentCity ? 'text-[#00354a]' : isSelectedSpot ? 'text-[#003822]' : 'text-[#38bdf8]'
              } font-bold font-mono">${station.temp}°</span>
              <span class="text-[12px]">${
                station.conditionType === 'storm'
                  ? '⚡'
                  : station.conditionType === 'rain'
                  ? '🌧️'
                  : station.conditionType === 'cloudy'
                  ? '☁️'
                  : '☀️'
              }</span>
            </div>
          </div>
        `,
        iconSize: [115, 32],
        iconAnchor: [57, 16],
      });

      const marker = L.marker([station.lat, station.lon], { icon: customIcon });
      marker.on('click', (e) => {
        L.DomEvent.stopPropagation(e);
        setSelectedInfo({
          name: station.name,
          region: station.region,
          country: station.country,
          lat: station.lat,
          lon: station.lon,
          temp: station.temp,
          feelsLike: station.feelsLike,
          condition: station.condition,
          humidity: station.humidity,
          wind: station.wind,
          rainProb: station.rainProb,
          isCustomClick: false,
        });

        // Center map smoothly on tapped city
        mapInstanceRef.current?.panTo([station.lat, station.lon], { animate: true });
      });

      markersLayerRef.current?.addLayer(marker);
    });
  }, [allDisplayCities, currentLocation, selectedInfo]);

  // Fit all cities in view
  const handleFitAllCities = () => {
    if (!mapInstanceRef.current || allDisplayCities.length === 0) return;
    const bounds = L.latLngBounds(allDisplayCities.map((c) => [c.lat, c.lon]));
    mapInstanceRef.current.fitBounds(bounds, { padding: [50, 50], maxZoom: 9 });
  };

  // Recenter to active city
  const handleRecenter = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([currentLocation.latitude, currentLocation.longitude], 8, {
        animate: true,
      });
    }
  };

  // Fly to a specific city from list drawer
  const handleFlyToCity = (city: MapCityStation) => {
    if (!mapInstanceRef.current) return;
    mapInstanceRef.current.flyTo([city.lat, city.lon], 9, { duration: 1.2 });
    setSelectedInfo({
      name: city.name,
      region: city.region,
      country: city.country,
      lat: city.lat,
      lon: city.lon,
      temp: city.temp,
      feelsLike: city.feelsLike,
      condition: city.condition,
      humidity: city.humidity,
      wind: city.wind,
      rainProb: city.rainProb,
      isCustomClick: false,
    });
  };

  // Save current selected city to bookmarks
  const handleToggleSave = () => {
    if (!selectedInfo) return;
    addSavedLocation({
      name: selectedInfo.name,
      region: selectedInfo.region || '',
      country: selectedInfo.country || 'India',
      latitude: selectedInfo.lat,
      longitude: selectedInfo.lon,
    });
    setIsSaved(true);
  };

  // Set as primary active focus city for entire app
  const handleSetAsActiveFocus = () => {
    if (!selectedInfo) return;
    selectLocation({
      name: selectedInfo.name,
      region: selectedInfo.region || '',
      country: selectedInfo.country || 'India',
      latitude: selectedInfo.lat,
      longitude: selectedInfo.lon,
    } as LocationInfo);
  };

  // Timeline playback animation
  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        setSelectedTimelineIndex((prev) => (prev + 1) % timelineHours.length);
      }, 1500);
    }
    return () => clearInterval(interval);
  }, [isPlaying, timelineHours.length]);

  return (
    <div className="relative w-full h-[calc(100vh-4rem)] overflow-hidden bg-[#060e20]">
      {/* Interactive Map Canvas */}
      <div ref={mapContainerRef} className="w-full h-full z-10 cursor-crosshair" />

      {/* Map Interactive Hint Badge */}
      <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20 pointer-events-none w-[92%] sm:w-auto text-center">
        <div className="px-3 sm:px-4 py-1 rounded-full bg-[#171f33]/90 backdrop-blur-md border border-white/10 shadow-xl inline-flex items-center justify-center gap-2 text-[11px] sm:text-xs font-medium text-[#dae2fd]">
          <span className="w-2 h-2 rounded-full bg-[#38bdf8] animate-ping flex-shrink-0" />
          <span className="truncate">Click map or select city for live telemetry</span>
        </div>
      </div>

      {/* Top Left: Layer Selector & All Cities Explorer Button */}
      <div className="absolute top-12 sm:top-4 left-2 sm:left-4 z-20 flex flex-col gap-2 max-w-[calc(100vw-1rem)] sm:max-w-none">
        {/* Layer Selector Bar */}
        <div className="bg-[#171f33]/95 backdrop-blur-xl rounded-2xl p-1 sm:p-1.5 border border-white/10 shadow-2xl flex items-center gap-1 overflow-x-auto max-w-[calc(100vw-2rem)] no-scrollbar">
          <button
            onClick={() => setActiveLayer('rain')}
            className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeLayer === 'rain'
                ? 'bg-[#38bdf8] text-[#00354a] shadow-[0_0_12px_rgba(56,189,248,0.4)]'
                : 'text-[#bdc8d1] hover:bg-[#222a3d] hover:text-[#dae2fd]'
            }`}
          >
            <CloudRain className="w-3.5 h-3.5 flex-shrink-0" />
            <span>Rain<span className="hidden sm:inline"> Radar</span></span>
          </button>
          <button
            onClick={() => setActiveLayer('temp')}
            className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeLayer === 'temp'
                ? 'bg-[#38bdf8] text-[#00354a] shadow-[0_0_12px_rgba(56,189,248,0.4)]'
                : 'text-[#bdc8d1] hover:bg-[#222a3d] hover:text-[#dae2fd]'
            }`}
          >
            <Thermometer className="w-3.5 h-3.5 flex-shrink-0" />
            <span>Temp<span className="hidden sm:inline">erature</span></span>
          </button>
          <button
            onClick={() => setActiveLayer('wind')}
            className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeLayer === 'wind'
                ? 'bg-[#38bdf8] text-[#00354a] shadow-[0_0_12px_rgba(56,189,248,0.4)]'
                : 'text-[#bdc8d1] hover:bg-[#222a3d] hover:text-[#dae2fd]'
            }`}
          >
            <Wind className="w-3.5 h-3.5 flex-shrink-0" />
            <span>Wind</span>
          </button>
          <button
            onClick={() => setActiveLayer('clouds')}
            className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeLayer === 'clouds'
                ? 'bg-[#38bdf8] text-[#00354a] shadow-[0_0_12px_rgba(56,189,248,0.4)]'
                : 'text-[#bdc8d1] hover:bg-[#222a3d] hover:text-[#dae2fd]'
            }`}
          >
            <Cloud className="w-3.5 h-3.5 flex-shrink-0" />
            <span>Clouds</span>
          </button>
        </div>

        {/* View All Cities Action Pill */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setShowCityDrawer(!showCityDrawer)}
            className={`px-3 py-1.5 sm:py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 sm:gap-2 border shadow-xl ${
              showCityDrawer
                ? 'bg-[#38bdf8] text-[#00354a] border-[#38bdf8]'
                : 'bg-[#171f33]/90 text-[#dae2fd] border-white/10 hover:bg-[#222a3d]'
            }`}
          >
            <Globe className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#38bdf8]" />
            <span>Cities</span>
            <span className="px-1.5 py-0.2 rounded-full bg-white/15 text-[10px] font-mono">
              {filteredCities.length}
            </span>
          </button>

          <button
            onClick={handleFitAllCities}
            className="px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl bg-[#171f33]/90 hover:bg-[#222a3d] text-[#dae2fd] border border-white/10 text-xs font-semibold shadow-xl flex items-center gap-1.5 transition-all"
            title="Zoom out to fit all cities"
          >
            <Maximize2 className="w-3.5 h-3.5 text-[#38bdf8]" />
            <span>Fit All</span>
          </button>
        </div>

        {/* Doppler Reflectivity Legend (Hidden on very small screens to avoid obstruction) */}
        <div className="hidden sm:block bg-[#171f33]/85 backdrop-blur-xl rounded-xl p-3 border border-white/10 shadow-xl max-w-xs text-xs">
          <div className="flex items-center justify-between text-[#dae2fd] font-semibold mb-1.5">
            <span className="flex items-center gap-1.5">
              <CloudRain className="w-3.5 h-3.5 text-[#38bdf8]" />
              <span>Doppler Radar Echo (dBZ)</span>
            </span>
            <span className="text-[10px] text-[#45dfa4] font-mono font-bold">REAL-TIME</span>
          </div>
          <div className="h-2 rounded-full w-full bg-gradient-to-r from-sky-400 via-emerald-400 to-amber-400" />
          <div className="flex justify-between text-[10px] text-[#87929a] font-mono mt-1">
            <span>Light (20)</span>
            <span>Moderate (40)</span>
            <span>Squall (65+)</span>
          </div>
        </div>
      </div>

      {/* Top Right: Quick Navigation Tools */}
      <div className="absolute top-20 right-4 z-20 flex flex-col gap-2">
        <button
          onClick={handleRecenter}
          className="flex items-center justify-center w-10 h-10 rounded-xl bg-[#171f33]/90 hover:bg-[#222a3d] text-[#38bdf8] border border-white/10 shadow-xl transition-all hover:scale-105"
          title="Recenter to active city"
        >
          <Navigation className="w-4 h-4" />
        </button>
        <button
          onClick={handleFitAllCities}
          className="flex items-center justify-center w-10 h-10 rounded-xl bg-[#171f33]/90 hover:bg-[#222a3d] text-[#dae2fd] border border-white/10 shadow-xl transition-all hover:scale-105"
          title="View all cities on map"
        >
          <Compass className="w-4 h-4" />
        </button>
      </div>

      {/* Floating Cities Explorer Drawer */}
      {showCityDrawer && (
        <div className="absolute top-24 sm:top-28 left-2 sm:left-4 right-2 sm:right-auto z-30 sm:w-84 max-h-[65vh] bg-[#171f33]/95 backdrop-blur-2xl rounded-2xl p-4 border border-white/15 shadow-2xl flex flex-col animate-in fade-in slide-in-from-left duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-[#38bdf8]" />
              <h3 className="text-sm font-bold text-[#dae2fd]">All Cities on Live Map</h3>
            </div>
            <button
              onClick={() => setShowCityDrawer(false)}
              className="p-1 rounded-lg text-[#87929a] hover:text-[#dae2fd] hover:bg-[#222a3d]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Search box inside drawer */}
          <div className="relative mt-3">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#87929a]" />
            <input
              type="text"
              value={citySearchQuery}
              onChange={(e) => setCitySearchQuery(e.target.value)}
              placeholder="Filter cities..."
              className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-[#0b1326] text-xs text-[#dae2fd] placeholder:text-[#87929a] border border-white/10 focus:outline-none focus:border-[#38bdf8]"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 mt-2.5 overflow-x-auto pb-1 text-[11px] no-scrollbar">
            {(
              [
                { id: 'all', label: 'All' },
                { id: 'karnataka', label: 'Karnataka' },
                { id: 'india', label: 'India' },
                { id: 'global', label: 'Global' },
                { id: 'saved', label: 'Saved' },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                onClick={() => setCityFilter(tab.id)}
                className={`px-2.5 py-1 rounded-lg whitespace-nowrap font-semibold transition-all flex-shrink-0 ${
                  cityFilter === tab.id
                    ? 'bg-[#38bdf8] text-[#00354a]'
                    : 'bg-[#222a3d]/50 text-[#87929a] hover:text-[#dae2fd]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* City list with instant jump */}
          <div className="flex-1 overflow-y-auto mt-2 space-y-1.5 pr-1 divide-y divide-white/5 max-h-[40vh] sm:max-h-[45vh]">
            {filteredCities.map((city) => {
              const isCurrent =
                city.name.toLowerCase() === currentLocation.name.toLowerCase();

              return (
                <button
                  key={city.id}
                  onClick={() => handleFlyToCity(city)}
                  className={`w-full p-2 rounded-xl flex items-center justify-between text-left transition-colors group ${
                    isCurrent
                      ? 'bg-[#38bdf8]/15 border border-[#38bdf8]/30'
                      : 'hover:bg-[#222a3d]'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-[#222a3d] flex items-center justify-center text-xs">
                      {city.conditionType === 'storm'
                        ? '⚡'
                        : city.conditionType === 'rain'
                        ? '🌧️'
                        : city.conditionType === 'cloudy'
                        ? '☁️'
                        : '☀️'}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-[#dae2fd] flex items-center gap-1.5">
                        <span>{city.name}</span>
                        {isCurrent && (
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#38bdf8] text-[#00354a] font-semibold">
                            ACTIVE
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-[#87929a]">
                        {city.region ? `${city.region}, ` : ''}
                        {city.country}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-xs font-bold text-[#38bdf8] font-mono">
                      {formatTemp(city.temp)}
                    </div>
                    <div className="text-[10px] text-[#45dfa4]">
                      {city.rainProb}% rain
                    </div>
                  </div>
                </button>
              );
            })}

            {filteredCities.length === 0 && (
              <div className="py-6 text-center text-xs text-[#87929a]">
                No cities found matching "{citySearchQuery}"
              </div>
            )}
          </div>
        </div>
      )}

      {/* Selected City / Custom Clicked Point Detailed Weather Modal */}
      {selectedInfo && (
        <div className="absolute bottom-20 left-2 right-2 top-auto sm:bottom-auto sm:top-4 sm:right-16 sm:left-auto z-30 sm:w-88 bg-[#171f33]/95 backdrop-blur-2xl rounded-2xl p-4 sm:p-5 border border-white/15 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-[#38bdf8]/20 flex items-center justify-center text-[#38bdf8] flex-shrink-0">
                <MapPin className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] text-[#87929a] uppercase font-bold tracking-wider block truncate">
                  {selectedInfo.isCustomClick ? 'POINT SELECTED ON MAP' : 'METEOROLOGICAL STATION'}
                </span>
                <h3 className="text-base font-bold text-[#dae2fd] leading-tight truncate">
                  {selectedInfo.name}
                </h3>
                <div className="text-[11px] text-[#87929a] truncate">
                  {[selectedInfo.region, selectedInfo.country].filter(Boolean).join(', ') ||
                    `${selectedInfo.lat.toFixed(2)}°, ${selectedInfo.lon.toFixed(2)}°`}
                </div>
              </div>
            </div>
            <button
              onClick={() => setSelectedInfo(null)}
              className="p-1.5 rounded-lg text-[#87929a] hover:text-[#dae2fd] hover:bg-[#222a3d] transition-colors flex-shrink-0 ml-2"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {isLoadingSpotWeather ? (
            <div className="py-6 flex flex-col items-center justify-center gap-2">
              <Loader2 className="w-6 h-6 text-[#38bdf8] animate-spin" />
              <p className="text-xs text-[#87929a]">Fetching live telemetry for this location...</p>
            </div>
          ) : (
            <>
              {/* Temperature & Live Conditions */}
              <div className="flex items-baseline justify-between my-3">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl sm:text-4xl font-extralight text-[#dae2fd] font-mono">
                    {formatTemp(selectedInfo.temp)}
                  </span>
                  <span className="text-xs text-[#7bd0ff] bg-[#222a3d] px-2 py-0.5 rounded-lg border border-white/5">
                    Feels like {formatTemp(selectedInfo.feelsLike)}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-[#38bdf8] block">
                    {selectedInfo.condition}
                  </span>
                  <span className="text-[10px] text-[#87929a] font-mono">
                    {selectedInfo.lat.toFixed(2)}°, {selectedInfo.lon.toFixed(2)}°
                  </span>
                </div>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-3 gap-2 py-2.5 border-t border-b border-white/5 text-center text-xs">
                <div className="p-1.5 sm:p-2 rounded-xl bg-[#0b1326]/60 border border-white/5">
                  <div className="flex items-center justify-center gap-1 text-[10px] text-[#87929a] mb-0.5">
                    <Droplets className="w-3 h-3 text-[#38bdf8]" />
                    <span>Humidity</span>
                  </div>
                  <div className="font-bold text-[#dae2fd] font-mono">{selectedInfo.humidity}%</div>
                </div>
                <div className="p-1.5 sm:p-2 rounded-xl bg-[#0b1326]/60 border border-white/5">
                  <div className="flex items-center justify-center gap-1 text-[10px] text-[#87929a] mb-0.5">
                    <Wind className="w-3 h-3 text-[#38bdf8]" />
                    <span>Wind</span>
                  </div>
                  <div className="font-bold text-[#dae2fd] font-mono">{selectedInfo.wind} km/h</div>
                </div>
                <div className="p-1.5 sm:p-2 rounded-xl bg-[#0b1326]/60 border border-white/5">
                  <div className="flex items-center justify-center gap-1 text-[10px] text-[#87929a] mb-0.5">
                    <CloudRain className="w-3 h-3 text-[#45dfa4]" />
                    <span>Precip</span>
                  </div>
                  <div className="font-bold text-[#45dfa4] font-mono">{selectedInfo.rainProb}%</div>
                </div>
              </div>

              {/* Primary Action Buttons */}
              <div className="flex items-center gap-2 mt-3 sm:mt-4">
                <button
                  onClick={handleSetAsActiveFocus}
                  className="flex-1 py-2 sm:py-2.5 rounded-xl bg-[#38bdf8] hover:bg-white text-[#00354a] text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-lg active:scale-95"
                >
                  <span>Set As Active City</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={handleToggleSave}
                  className={`px-3 py-2 sm:py-2.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    isSaved
                      ? 'bg-[#45dfa4]/20 text-[#45dfa4] border-[#45dfa4]/30'
                      : 'bg-[#222a3d] hover:bg-[#2d364f] text-[#dae2fd] border-white/10'
                  }`}
                  title={isSaved ? 'Already saved' : 'Save location'}
                >
                  {isSaved ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  <span>{isSaved ? 'Saved' : 'Save'}</span>
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {/* Bottom Timeline Radar Loop Bar */}
      <div className="absolute bottom-20 md:bottom-6 left-1/2 -translate-x-1/2 z-20 w-[94%] max-w-4xl bg-[#171f33]/90 backdrop-blur-2xl rounded-2xl p-2.5 sm:p-3.5 border border-white/10 shadow-2xl flex flex-col gap-2">
        <div className="flex items-center justify-between text-xs text-[#bdc8d1] px-1">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="flex items-center justify-center w-7 h-7 rounded-lg bg-[#38bdf8] text-[#00354a] hover:bg-white transition-all shadow-sm flex-shrink-0"
              title={isPlaying ? 'Pause radar timeline' : 'Play radar loop'}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            </button>
            <span className="font-semibold text-[#dae2fd] text-xs sm:text-sm">Radar Projection</span>
          </div>
          <span className="text-[10px] sm:text-[11px] font-mono text-[#38bdf8] truncate ml-2">
            {timelineHours[selectedTimelineIndex].label} · Intensity:{' '}
            {timelineHours[selectedTimelineIndex].rainIntensity}
          </span>
        </div>

        {/* Timeline Slider Buttons */}
        <div className="flex items-center gap-1 sm:grid sm:grid-cols-9 overflow-x-auto pb-1 sm:pb-0 no-scrollbar">
          {timelineHours.map((slot, idx) => (
            <button
              key={slot.label}
              onClick={() => setSelectedTimelineIndex(idx)}
              className={`py-1 sm:py-1.5 px-2.5 sm:px-0 rounded-xl text-center text-xs transition-all flex-shrink-0 sm:flex-shrink ${
                selectedTimelineIndex === idx
                  ? 'bg-[#38bdf8] text-[#00354a] font-bold shadow-[0_0_12px_rgba(56,189,248,0.4)]'
                  : 'bg-[#222a3d]/50 hover:bg-[#222a3d] text-[#bdc8d1]'
              }`}
            >
              <div className="leading-tight text-[10px] sm:text-[11px] font-medium whitespace-nowrap">{slot.label}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
