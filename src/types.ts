export type UserOccupation = 
  | 'Student'
  | 'Farmer'
  | 'Professional'
  | 'Driver'
  | 'Outdoor Worker'
  | 'Traveler'
  | 'Homemaker'
  | 'Other';

export type OccupationType = UserOccupation;
export type TemperatureUnit = 'celsius' | 'fahrenheit';

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  occupation: UserOccupation;
  preferredUnit: 'celsius' | 'fahrenheit';
  defaultLocation: LocationInfo;
}

export interface LocationInfo {
  id?: string;
  name: string;
  region?: string;
  country: string;
  latitude: number;
  longitude: number;
  timezone?: string;
  isDefault?: boolean;
}

export type WeatherConditionType = 
  | 'sunny'
  | 'partly-cloudy'
  | 'cloudy'
  | 'fog'
  | 'drizzle'
  | 'rain'
  | 'storm'
  | 'snow';

export interface CurrentWeather {
  temperature: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  windDirection: number;
  windDirectionCardinal: string;
  pressure: number;
  visibility: number;
  uvIndex: number;
  precipitation: number;
  condition: WeatherConditionType;
  conditionText: string;
  weatherCode: number;
  isDay: boolean;
  timestamp: string;
}

export interface HourlyForecastItem {
  time: string; // e.g. "1 PM"
  fullTime: string;
  temperature: number;
  precipitationProbability: number;
  precipitation: number;
  windSpeed: number;
  condition: WeatherConditionType;
  conditionText: string;
  weatherCode: number;
  isCurrent?: boolean;
}

export interface DailyForecastItem {
  date: string;
  dayName: string; // "Today", "Fri", "Sat", etc.
  highTemp: number;
  lowTemp: number;
  precipitationProbability: number;
  precipitationSum: number;
  condition: WeatherConditionType;
  conditionText: string;
  weatherCode: number;
  sunrise: string;
  sunset: string;
}

export interface AstronomyData {
  sunrise: string;
  sunset: string;
  moonrise: string;
  moonset: string;
  moonPhaseName: string;
  moonPhasePercent: number; // e.g. 72
  moonIllumination: number;
  daylightDurationHours: number;
  stargazingQuality: 'High' | 'Moderate' | 'Low' | 'Poor';
  stargazingNote: string;
}

export interface WeatherData {
  location: LocationInfo;
  current: CurrentWeather;
  hourly: HourlyForecastItem[];
  daily: DailyForecastItem[];
  astronomy: AstronomyData;
  source: 'Open-Meteo' | 'Cached' | 'Fallback';
  updatedAt: string;
}

export interface WeatherAlert {
  id: string;
  type: 'Heavy Rain' | 'Storm' | 'Extreme Heat' | 'Strong Wind' | 'High UV' | 'Poor Visibility';
  severity: 'advisory' | 'watch' | 'warning' | 'severe';
  source: 'Official Alert' | 'WeatherGPT Advisory';
  location: string;
  startTime: string;
  endTime: string;
  title: string;
  message: string;
  recommendation: string;
  dismissed?: boolean;
}

export interface ClothingRecommendation {
  summary: string;
  attireItems: Array<{
    name: string;
    icon: string;
    color: string;
  }>;
  footwear: string;
  accessories: string[];
  indoorComfortScore: number;
  acAdvisory: 'On' | 'Off' | 'Moderate';
  disclaimer: string;
}

export interface AiWeatherInsight {
  headline: string;
  summary: string;
  detailedAnalysis: string;
  impactForOccupation: string;
  recommendation: string;
  timestamp: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  weatherFacts?: string[];
  recommendation?: string;
  severity?: 'normal' | 'advisory' | 'warning';
  sourceType?: 'forecast' | 'historical' | 'general';
  toolUsed?: string;
}

export interface HistoricalMetricData {
  date: string;
  avgTemp: number;
  maxTemp: number;
  minTemp: number;
  rainfall: number;
  humidity: number;
  windSpeed: number;
}

export interface HistoricalReportSummary {
  location: LocationInfo;
  period: string;
  avgTemperature: number;
  maxTemperature: number;
  minTemperature: number;
  totalRainfall: number;
  avgHumidity: number;
  avgWindSpeed: number;
  metrics: HistoricalMetricData[];
  aiHistoricalInsight?: string;
}
