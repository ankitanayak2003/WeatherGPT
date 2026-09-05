import React from 'react';
import {
  Droplets,
  Wind,
  Eye,
  Sun,
  Gauge,
  CloudRain,
  CloudLightning,
  Cloud,
  Snowflake,
} from 'lucide-react';
import { useWeather } from '../../context/WeatherContext';

export const HeroWeatherCard: React.FC = () => {
  const { weather, formatTemp } = useWeather();

  const current = weather?.current;
  const temp = current?.temperature ?? 28;
  const feelsLike = current?.feelsLike ?? 30;
  const condition = current?.condition ?? 'storm';
  const conditionText = current?.conditionText ?? 'Storm with Heavy Rain';
  const humidity = current?.humidity ?? 82;
  const windSpeed = current?.windSpeed ?? 19;
  const windDir = current?.windDirectionCardinal ?? 'NE';
  const visibility = current?.visibility ?? 7.5;
  const uvIndex = current?.uvIndex ?? 3;
  const pressure = current?.pressure ?? 1009;
  const precipitation = current?.precipitation ?? 88;

  const renderWeatherIcon = () => {
    switch (condition) {
      case 'storm':
        return <CloudLightning className="w-6 h-6 text-[#38bdf8] animate-pulse" />;
      case 'rain':
      case 'drizzle':
        return <CloudRain className="w-6 h-6 text-[#38bdf8]" />;
      case 'sunny':
        return <Sun className="w-6 h-6 text-[#ffc42f]" />;
      case 'snow':
        return <Snowflake className="w-6 h-6 text-[#8ed5ff]" />;
      default:
        return <Cloud className="w-6 h-6 text-[#8ed5ff]" />;
    }
  };

  return (
    <div className="relative overflow-hidden rounded-2xl p-6 lg:p-7 shadow-2xl bg-gradient-to-br from-[#111c30]/90 to-[#0b1326]/90 border border-white/10 group">
      {/* Subtle ambient lighting orb */}
      <div className="absolute -right-16 -top-16 w-64 h-64 bg-[#38bdf8]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Weather Information Display */}
      <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex flex-col">
          {/* Precipitation probability pill */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0b1326]/75 text-[#7bd0ff] text-xs font-semibold w-fit mb-3 border border-white/10 backdrop-blur-md">
            <Droplets className="w-3.5 h-3.5 text-[#38bdf8]" />
            <span>Precipitation: {precipitation}% Expected</span>
          </div>

          {/* Large Degree Readout */}
          <div className="flex items-baseline gap-2">
            <span className="text-6xl sm:text-7xl font-extralight text-[#dae2fd] tracking-tight font-display drop-shadow-md">
              {temp}°
            </span>
            <span className="text-2xl font-normal text-[#bdc8d1]">C</span>
            <span className="ml-3 text-xs font-medium text-[#7bd0ff] bg-[#0b1326]/75 px-2.5 py-1 rounded-full border border-white/10 backdrop-blur-md">
              Feels like {formatTemp(feelsLike)}
            </span>
          </div>

          {/* Condition Title */}
          <div className="flex items-center gap-2.5 mt-2">
            {renderWeatherIcon()}
            <h2 className="text-xl font-bold text-[#dae2fd] tracking-tight drop-shadow-sm">
              {conditionText}
            </h2>
          </div>

          <p className="text-xs text-[#cbd5e1] max-w-md mt-2 leading-relaxed drop-shadow-sm">
            High atmospheric instability with active electrical discharges and dense moisture saturation. Take precautions if venturing outdoors.
          </p>
        </div>

        {/* 3D Radar Orb Component */}
        <div className="relative flex-shrink-0 w-28 h-28 sm:w-36 sm:h-36 self-center sm:self-auto rounded-2xl overflow-hidden shadow-2xl bg-[#060e20]/90 flex items-center justify-center p-2 border border-white/15 group">
          {/* Animated radar rings and swirling cyan radar pulse */}
          <div className="relative w-full h-full rounded-xl overflow-hidden flex items-center justify-center bg-gradient-to-tr from-[#0b1326] via-[#171f33] to-[#00354a]">
            {/* Swirling radar circles */}
            <div className="absolute inset-2 rounded-full border border-[#38bdf8]/30 animate-ping opacity-25" />
            <div className="absolute inset-4 rounded-full border border-[#38bdf8]/40" />
            <div className="absolute inset-8 rounded-full border border-[#45dfa4]/40" />
            {/* Center sweeping radar beam */}
            <div className="absolute w-16 h-16 rounded-full bg-gradient-to-tr from-transparent via-[#38bdf8]/30 to-[#38bdf8]/70 blur-xs animate-spin" />
            <div className="absolute w-2 h-2 rounded-full bg-white shadow-[0_0_12px_#38bdf8]" />
          </div>
          <div className="absolute bottom-2.5 left-2.5 right-2.5 px-2 py-0.5 rounded bg-[#060e20]/90 backdrop-blur text-center border border-white/10">
            <span className="text-[10px] font-mono font-bold tracking-widest text-[#7bd0ff]">
              RADAR LIVE
            </span>
          </div>
        </div>
      </div>

      {/* Micro Telemetry Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mt-6 pt-4 bg-[#060e20]/75 backdrop-blur-md rounded-xl p-3 border border-white/10 shadow-inner">
        {/* Humidity */}
        <div className="flex flex-col items-center justify-center p-2.5 rounded-lg bg-[#111c30]/70 border border-white/5">
          <Droplets className="w-4 h-4 text-[#38bdf8] mb-1" />
          <span className="text-[10px] uppercase font-bold tracking-wider text-[#bdc8d1]">Humidity</span>
          <span className="text-base font-bold text-[#dae2fd] mt-0.5">{humidity}%</span>
        </div>

        {/* Wind */}
        <div className="flex flex-col items-center justify-center p-2.5 rounded-lg bg-[#111c30]/70 border border-white/5">
          <Wind className="w-4 h-4 text-[#45dfa4] mb-1" />
          <span className="text-[10px] uppercase font-bold tracking-wider text-[#bdc8d1]">Wind</span>
          <span className="text-base font-bold text-[#dae2fd] mt-0.5">
            {windSpeed} <span className="text-[10px] font-normal text-[#bdc8d1]">km/h {windDir}</span>
          </span>
        </div>

        {/* Visibility */}
        <div className="flex flex-col items-center justify-center p-2.5 rounded-lg bg-[#111c30]/70 border border-white/5">
          <Eye className="w-4 h-4 text-[#8ed5ff] mb-1" />
          <span className="text-[10px] uppercase font-bold tracking-wider text-[#bdc8d1]">Visibility</span>
          <span className="text-base font-bold text-[#dae2fd] mt-0.5">
            {visibility} <span className="text-[10px] font-normal text-[#bdc8d1]">km</span>
          </span>
        </div>

        {/* UV Index */}
        <div className="flex flex-col items-center justify-center p-2.5 rounded-lg bg-[#111c30]/70 border border-white/5">
          <Sun className="w-4 h-4 text-[#f9bd22] mb-1" />
          <span className="text-[10px] uppercase font-bold tracking-wider text-[#bdc8d1]">UV Index</span>
          <span className="text-base font-bold text-[#dae2fd] mt-0.5">
            {uvIndex} <span className="text-[10px] font-semibold text-[#f9bd22]">Mod</span>
          </span>
        </div>

        {/* Pressure */}
        <div className="col-span-2 sm:col-span-1 flex flex-col items-center justify-center p-2.5 rounded-lg bg-[#111c30]/70 border border-white/5">
          <Gauge className="w-4 h-4 text-[#bdc8d1] mb-1" />
          <span className="text-[10px] uppercase font-bold tracking-wider text-[#bdc8d1]">Pressure</span>
          <span className="text-base font-bold text-[#dae2fd] mt-0.5">
            {pressure} <span className="text-[10px] font-normal text-[#bdc8d1]">hPa</span>
          </span>
        </div>
      </div>
    </div>
  );
};
