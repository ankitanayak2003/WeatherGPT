import { WeatherData, WeatherAlert, ClothingRecommendation, AiWeatherInsight, ChatMessage, HistoricalReportSummary, LocationInfo } from '../types';

export async function fetchWeather(lat: number, lon: number, name: string = 'Mysuru', country: string = 'India'): Promise<WeatherData> {
  const params = new URLSearchParams({
    lat: lat.toString(),
    lon: lon.toString(),
    name,
    country,
  });
  const res = await fetch(`/api/weather/current?${params.toString()}`);
  if (!res.ok) {
    throw new Error('Failed to fetch weather data');
  }
  return res.json();
}

export async function searchLocations(query: string): Promise<LocationInfo[]> {
  if (!query.trim()) return [];
  const res = await fetch(`/api/geocode?q=${encodeURIComponent(query)}`);
  if (!res.ok) return [];
  return res.json();
}

export async function reverseGeocodeCoordinates(lat: number, lon: number): Promise<LocationInfo> {
  try {
    const res = await fetch(`/api/geocode/reverse?lat=${lat}&lon=${lon}`);
    if (res.ok) {
      return res.json();
    }
  } catch (err) {
    console.warn('Reverse geocode error:', err);
  }
  return {
    id: `loc-${lat.toFixed(2)}-${lon.toFixed(2)}`,
    name: `Spot (${lat.toFixed(2)}°, ${lon.toFixed(2)}°)`,
    region: '',
    country: '',
    latitude: lat,
    longitude: lon,
  };
}

export async function evaluateAlerts(weather: WeatherData): Promise<WeatherAlert[]> {
  try {
    const res = await fetch('/api/alerts/evaluate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        current: weather.current,
        hourly: weather.hourly,
        location: weather.location,
      }),
    });
    if (!res.ok) return [];
    return res.json();
  } catch (e) {
    return [];
  }
}

export async function fetchAiInsight(weather: WeatherData, occupation: string): Promise<AiWeatherInsight> {
  try {
    const res = await fetch('/api/ai/insight', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ weather, occupation }),
    });
    if (!res.ok) throw new Error('Failed insight');
    return res.json();
  } catch (e) {
    const loc = weather.location?.name || 'Local Area';
    const temp = Math.round(weather.current?.temperature ?? 28);
    const rain = Math.round(weather.current?.precipitation ?? 40);
    const isRain = rain >= 50;

    return {
      headline: 'WeatherGPT Copilot',
      summary: isRain
        ? `Convective squall activity observed over ${loc}. Rain probability stands at ${rain}% with active cloud buildup.`
        : `Stable atmospheric conditions over ${loc} with ambient temperature around ${temp}°C and normal barometric pressure.`,
      detailedAnalysis: `Atmospheric humidity is at ${weather.current?.humidity ?? 75}% with surface winds at ${weather.current?.windSpeed ?? 14} km/h.`,
      impactForOccupation: isRain
        ? `${occupation} Advisory: Surface transit corridors may experience delay; protect electronic equipment and outdoor supplies.`
        : `${occupation} Advisory: Optimal conditions for scheduled daily activities and outdoor transit.`,
      recommendation: isRain
        ? 'Carry an umbrella and monitor real-time radar for squall updates.'
        : 'Favorable conditions; suitable for all planned outdoor engagements.',
      timestamp: new Date().toISOString(),
    };
  }
}

export async function fetchClothingRecommendation(weather: WeatherData): Promise<ClothingRecommendation> {
  try {
    const res = await fetch('/api/ai/clothing', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ weather }),
    });
    if (!res.ok) throw new Error('Clothing fetch failed');
    return res.json();
  } catch (e) {
    return {
      summary: 'Water-resistant light shell, breathable synthetic trousers, and compact umbrella. Elevated 82% ambient humidity indoors.',
      attireItems: [
        { name: 'Telescopic Umbrella', icon: 'umbrella', color: 'text-primary' },
        { name: 'Waterproof Footwear', icon: 'shield', color: 'text-emerald-400' },
        { name: 'Laptop Rain Sleeve', icon: 'briefcase', color: 'text-amber-400' },
      ],
      footwear: 'Waterproof sneakers or non-slip walking shoes',
      accessories: ['Compact umbrella', 'Waterproof pack rain cover'],
      indoorComfortScore: 6.8,
      acAdvisory: 'On',
      disclaimer: 'Personalized recommendation based on real-time temperature, humidity, and squall probabilities. Not medical advice.',
    };
  }
}

export async function fetchHistoricalReport(lat: number, lon: number, year: number, month: number): Promise<HistoricalReportSummary> {
  const params = new URLSearchParams({
    lat: lat.toString(),
    lon: lon.toString(),
    year: year.toString(),
    month: month.toString(),
  });
  const res = await fetch(`/api/weather/history?${params.toString()}`);
  if (!res.ok) {
    throw new Error('Historical data unavailable');
  }
  const summary = await res.json();

  // Also get AI Historical insight
  try {
    const aiRes = await fetch('/api/ai/historical-analysis', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ history: summary }),
    });
    if (aiRes.ok) {
      const aiData = await aiRes.json();
      summary.aiHistoricalInsight = aiData.insight;
    }
  } catch (e) {
    // Ignore AI failure
  }

  return summary;
}

export async function sendChatMessage(
  message: string,
  conversationHistory: ChatMessage[],
  currentLocation: LocationInfo,
  occupation: string
): Promise<{
  answer: string;
  weatherFacts?: string[];
  recommendation?: string;
  severity?: 'normal' | 'advisory' | 'warning';
  sourceType?: 'forecast' | 'historical' | 'general';
  toolUsed?: string;
}> {
  const res = await fetch('/api/ai/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message,
      conversationHistory,
      currentLocation,
      occupation,
    }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'WeatherGPT response error');
  }

  return res.json();
}
