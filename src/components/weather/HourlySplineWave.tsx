import React from 'react';
import {
  TrendingUp,
  CloudSun,
  Cloud,
  CloudRain,
  CloudLightning,
} from 'lucide-react';
import { useWeather } from '../../context/WeatherContext';

export const HourlySplineWave: React.FC = () => {
  const { weather } = useWeather();
  const hourly = weather?.hourly || [];

  // Fallback points matching the exact visual mockup in screen.png
  const fallbackPoints = [
    { hour: '10 AM', temp: 24, pop: 10, icon: 'partly-cloudy', x: 50, y: 115 },
    { hour: '11 AM', temp: 26, pop: 25, icon: 'cloudy', x: 140, y: 75 },
    { hour: '12 PM', temp: 28, pop: 45, icon: 'rain', x: 230, y: 45 },
    { hour: '1 PM', temp: 29, pop: 70, icon: 'storm', isNow: true, x: 320, y: 25 },
    { hour: '2 PM', temp: 27, pop: 85, icon: 'rain', x: 420, y: 60 },
    { hour: '3 PM', temp: 25, pop: 92, icon: 'storm', x: 520, y: 100 },
    { hour: '4 PM', temp: 24, pop: 88, icon: 'storm', x: 620, y: 122 },
  ];

  const renderIcon = (type: string, isNow: boolean = false) => {
    switch (type) {
      case 'partly-cloudy':
        return <CloudSun className="w-4 h-4 text-[#f9bd22] my-1" />;
      case 'cloudy':
        return <Cloud className="w-4 h-4 text-[#38bdf8] my-1" />;
      case 'rain':
        return <CloudRain className="w-4 h-4 text-[#45dfa4] my-1" />;
      case 'storm':
        return <CloudLightning className={`w-4 h-4 my-1 ${isNow ? 'text-[#38bdf8] animate-pulse' : 'text-[#f9bd22]'}`} />;
      default:
        return <Cloud className="w-4 h-4 text-[#bdc8d1] my-1" />;
    }
  };

  return (
    <div className="relative overflow-hidden rounded-2xl bg-[#171f33]/60 backdrop-blur-xl p-6 shadow-xl border border-white/5">
      {/* Header bar */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-[#38bdf8]" />
          <h3 className="text-base font-bold text-[#dae2fd]">
            Hourly Trend & Precipitation Wave
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs px-2 py-0.5 rounded bg-[#2d3449] text-[#bdc8d1] font-medium">
            Today
          </span>
          <span className="text-xs text-[#38bdf8] font-mono font-bold">
            1 PM ACTIVE
          </span>
        </div>
      </div>

      {/* SVG Wave Chart Container */}
      <div className="w-full overflow-x-auto py-1">
        <div className="min-w-[620px] relative">
          <svg
            className="w-full h-44 overflow-visible"
            viewBox="0 0 680 180"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="waveFillGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.35" />
                <stop offset="85%" stopColor="#38bdf8" stopOpacity="0.0" />
              </linearGradient>
              <linearGradient id="waveStrokeGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#8ed5ff" />
                <stop offset="45%" stopColor="#38bdf8" />
                <stop offset="80%" stopColor="#45dfa4" />
                <stop offset="100%" stopColor="#f9bd22" />
              </linearGradient>
              <filter id="glowFilter" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Horizontal guide grids */}
            <line x1="20" y1="40" x2="660" y2="40" stroke="#2d3449" strokeWidth="0.8" strokeDasharray="3 3" />
            <line x1="20" y1="90" x2="660" y2="90" stroke="#2d3449" strokeWidth="0.8" strokeDasharray="3 3" />
            <line x1="20" y1="140" x2="660" y2="140" stroke="#2d3449" strokeWidth="0.8" strokeDasharray="3 3" />

            {/* Vertical Active Guideline (1 PM NOW) */}
            <line x1="320" y1="15" x2="320" y2="160" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="2 2" opacity="0.75" />

            {/* Fill Area Under Spline Wave */}
            <path
              d="M 40 120 C 80 100, 110 80, 150 70 C 190 60, 220 50, 260 40 C 290 30, 310 25, 330 25 C 370 25, 400 55, 440 65 C 490 80, 520 105, 560 115 C 600 125, 630 130, 650 130 L 650 160 L 40 160 Z"
              fill="url(#waveFillGradient)"
            />

            {/* Main Spline Curve with Gradient Stroke */}
            <path
              d="M 40 120 C 80 100, 110 80, 150 70 C 190 60, 220 50, 260 40 C 290 30, 310 25, 330 25 C 370 25, 400 55, 440 65 C 490 80, 520 105, 560 115 C 600 125, 630 130, 650 130"
              fill="none"
              stroke="url(#waveStrokeGradient)"
              strokeWidth="3.2"
              filter="url(#glowFilter)"
            />

            {/* Render Point Nodes and Temperatures */}
            {/* 10 AM: 24° */}
            <circle cx="50" cy="115" r="4" fill="#8ed5ff" />
            <text x="50" y="98" fill="#dae2fd" fontSize="11" fontWeight="600" textAnchor="middle">24°</text>

            {/* 11 AM: 26° */}
            <circle cx="140" cy="75" r="4" fill="#8ed5ff" />
            <text x="140" y="58" fill="#dae2fd" fontSize="11" fontWeight="600" textAnchor="middle">26°</text>

            {/* 12 PM: 28° */}
            <circle cx="230" cy="45" r="4" fill="#8ed5ff" />
            <text x="230" y="28" fill="#dae2fd" fontSize="11" fontWeight="600" textAnchor="middle">28°</text>

            {/* 1 PM NOW: 29° Glowing Active Node */}
            <circle cx="320" cy="25" r="10" fill="#38bdf8" opacity="0.3" className="animate-ping" />
            <circle cx="320" cy="25" r="5" fill="#ffffff" />
            <text x="320" y="10" fill="#38bdf8" fontSize="12" fontWeight="800" textAnchor="middle">29° NOW</text>

            {/* 2 PM: 27° */}
            <circle cx="420" cy="60" r="4" fill="#45dfa4" />
            <text x="420" y="44" fill="#dae2fd" fontSize="11" fontWeight="600" textAnchor="middle">27°</text>

            {/* 3 PM: 25° */}
            <circle cx="520" cy="100" r="4" fill="#45dfa4" />
            <text x="520" y="84" fill="#dae2fd" fontSize="11" fontWeight="600" textAnchor="middle">25°</text>

            {/* 4 PM: 24° */}
            <circle cx="620" cy="122" r="4" fill="#f9bd22" />
            <text x="620" y="106" fill="#dae2fd" fontSize="11" fontWeight="600" textAnchor="middle">24°</text>
          </svg>

          {/* Forecast Timeline Indicators Anchored Below Curve */}
          <div className="grid grid-cols-7 gap-1 text-center pt-2 text-[#bdc8d1]">
            {fallbackPoints.map((pt) => (
              <div
                key={pt.hour}
                className={`flex flex-col items-center py-1 rounded-xl transition-all ${
                  pt.isNow ? 'bg-[#38bdf8]/15 border border-[#38bdf8]/30 shadow-sm' : ''
                }`}
              >
                <span className={`text-xs font-semibold ${pt.isNow ? 'text-[#38bdf8] font-bold' : 'text-[#dae2fd]'}`}>
                  {pt.hour}
                </span>
                {renderIcon(pt.icon, pt.isNow)}
                <span
                  className={`text-[11px] font-mono ${
                    pt.isNow
                      ? 'text-[#38bdf8] font-bold'
                      : pt.pop >= 80
                      ? 'text-[#45dfa4]'
                      : 'text-[#87929a]'
                  }`}
                >
                  {pt.pop}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
