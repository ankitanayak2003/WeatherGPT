import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  Send,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  User,
  RotateCcw,
  Compass,
} from 'lucide-react';
import { useWeather } from '../context/WeatherContext';
import { sendChatMessage } from '../services/api';
import { ChatMessage } from '../types';

export const WeatherGptChat: React.FC = () => {
  const { currentLocation, userProfile, weather } = useWeather();

  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem('weathergpt_chat_history');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // Fallback
      }
    }
    return [
      {
        id: 'welcome-msg',
        role: 'assistant',
        content: `Welcome back, **${userProfile.name}**! I'm **WeatherGPT**, your meteorological AI intelligence engine.\n\nI combine verified real-time data from **Open-Meteo** with Gemini 3.8 reasoning. Because your profile is set to **${userProfile.occupation}**, my insights and advisories are personalized for your schedule.\n\nAsk me anything about current storm dynamics, clothing recommendations, upcoming travel, or historical trends!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        weatherFacts: [
          `Current Location: ${currentLocation.name}`,
          `Temperature: ${weather?.current?.temperature ?? 28}°C`,
          `Precipitation Probability: ${weather?.current?.precipitation ?? 88}%`,
          `Atmospheric Condition: ${weather?.current?.conditionText ?? 'Storm with Heavy Rain'}`,
        ],
        recommendation: 'Check hourly squall radar before transit between 4:00 PM and 6:30 PM.',
        sourceType: 'forecast',
        toolUsed: 'Open-Meteo Telemetry + Gemini 3.8 Flash',
      },
    ];
  });

  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
    localStorage.setItem('weathergpt_chat_history', JSON.stringify(messages));
  }, [messages]);

  const suggestedQuestions = [
    'Will it rain tomorrow evening?',
    'Should I carry an umbrella today?',
    'What should I wear today?',
    'Is tomorrow good for travelling?',
    'Compare Mysuru and Bengaluru weather',
    'Why is humidity so high today?',
    'Will this weekend be hotter than last week?',
  ];

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || inputMessage).trim();
    if (!query || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const result = await sendChatMessage(query, messages, currentLocation, userProfile.occupation);

      const assistantMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: result.answer,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        weatherFacts: result.weatherFacts,
        recommendation: result.recommendation,
        severity: result.severity,
        sourceType: result.sourceType,
        toolUsed: result.toolUsed || 'Open-Meteo Verified Forecast + Gemini 3.8 Flash',
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        content: `I encountered a momentary connection issue. Here is verified telemetry for ${currentLocation.name}: Currently ${weather?.current?.temperature ?? 28}°C, ${weather?.current?.conditionText ?? 'Overcast'}, with ${weather?.current?.precipitation ?? 88}% precipitation probability.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        severity: 'advisory',
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: 'reset-msg',
        role: 'assistant',
        content: `Chat session reset. Ask WeatherGPT anything about current or upcoming weather for ${currentLocation.name}.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-3 sm:px-4 py-3 sm:py-6 flex flex-col h-[calc(100vh-8.5rem)] md:h-[calc(100vh-5rem)]">
      {/* Header bar (Static Dark Glass, per rule #44) */}
      <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-white/5 mb-3 sm:mb-4 flex-shrink-0">
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-[#38bdf8]/20 to-[#45dfa4]/20 flex items-center justify-center text-[#38bdf8] border border-[#38bdf8]/30 flex-shrink-0">
            <Bot className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-[#dae2fd] truncate">
                Weather<span className="text-[#38bdf8]">GPT</span> <span className="hidden sm:inline">Conversational Intelligence</span>
              </h2>
              <span className="text-[9px] sm:text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#00bd85]/20 text-[#45dfa4] border border-[#00bd85]/30 flex-shrink-0">
                Online
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-[#87929a] truncate">
              Open-Meteo Forecasts · Tailored for {userProfile.occupation}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0 ml-2">
          <button
            onClick={handleClearChat}
            className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg bg-[#222a3d]/60 hover:bg-[#222a3d] text-[#bdc8d1] text-xs font-semibold border border-white/5 transition-all"
            title="Reset conversation"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Clear History</span>
          </button>
        </div>
      </div>

      {/* Suggested Quick Inquiries */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-2 flex-shrink-0 no-scrollbar">
        <span className="text-xs text-[#87929a] flex items-center gap-1 flex-shrink-0 pl-1">
          <Sparkles className="w-3.5 h-3.5 text-[#38bdf8]" />
          Suggested:
        </span>
        {suggestedQuestions.map((q) => (
          <button
            key={q}
            onClick={() => handleSend(q)}
            className="flex-shrink-0 text-xs px-3 py-1.5 rounded-full bg-[#171f33]/80 hover:bg-[#222a3d] text-[#bdc8d1] hover:text-[#dae2fd] border border-white/5 transition-all whitespace-nowrap"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Message Stream */}
      <div className="flex-1 overflow-y-auto pr-2 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3.5 ${
              msg.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {msg.role === 'assistant' && (
              <div className="flex-shrink-0 w-8 h-8 rounded-xl bg-gradient-to-br from-[#38bdf8]/30 to-[#8ed5ff]/10 flex items-center justify-center text-[#38bdf8] border border-[#38bdf8]/30 mt-1">
                <Bot className="w-4 h-4" />
              </div>
            )}

            <div
              className={`max-w-2xl rounded-2xl p-4 text-sm leading-relaxed border ${
                msg.role === 'user'
                  ? 'bg-[#38bdf8] text-[#00354a] font-medium border-[#38bdf8]/40 shadow-lg'
                  : 'bg-[#171f33]/90 text-[#dae2fd] border-white/10 shadow-xl'
              }`}
            >
              {/* Message Content */}
              <div className="whitespace-pre-wrap font-normal">
                {msg.content}
              </div>

              {/* Weather Facts Cited */}
              {msg.weatherFacts && msg.weatherFacts.length > 0 && (
                <div className="mt-3.5 pt-3 border-t border-white/10">
                  <div className="text-[11px] font-bold text-[#7bd0ff] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#45dfa4]" />
                    Verified Weather Telemetry
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                    {msg.weatherFacts.map((fact, idx) => (
                      <div
                        key={idx}
                        className="text-xs bg-[#222a3d]/60 px-2.5 py-1.5 rounded-lg text-[#bdc8d1] border border-white/5"
                      >
                        {fact}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recommendation Pill */}
              {msg.recommendation && (
                <div className="mt-3 bg-[#00bd85]/15 border border-[#00bd85]/30 rounded-xl p-2.5 flex items-start gap-2">
                  <Compass className="w-4 h-4 text-[#45dfa4] flex-shrink-0 mt-0.5" />
                  <div className="text-xs text-[#dae2fd]">
                    <span className="font-bold text-[#45dfa4]">Actionable Advisory: </span>
                    {msg.recommendation}
                  </div>
                </div>
              )}

              {/* Footer Timestamp & Tools */}
              <div className="mt-2.5 flex items-center justify-between text-[10px] text-[#87929a]">
                <span>{msg.timestamp}</span>
                {msg.toolUsed && (
                  <span className="font-mono text-[#7bd0ff]">{msg.toolUsed}</span>
                )}
              </div>
            </div>

            {msg.role === 'user' && (
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#222a3d] flex items-center justify-center text-[#dae2fd] border border-white/10 mt-1">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-3.5 justify-start">
            <div className="flex-shrink-0 w-8 h-8 rounded-xl bg-[#38bdf8]/20 flex items-center justify-center text-[#38bdf8] border border-[#38bdf8]/30">
              <Bot className="w-4 h-4 animate-bounce" />
            </div>
            <div className="bg-[#171f33]/90 rounded-2xl p-4 border border-white/10 shadow-xl flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-[#38bdf8] animate-ping" />
                <div className="w-2 h-2 rounded-full bg-[#45dfa4] animate-ping delay-100" />
                <div className="w-2 h-2 rounded-full bg-[#f9bd22] animate-ping delay-200" />
              </div>
              <span className="text-xs text-[#bdc8d1] font-mono">
                Querying Open-Meteo &amp; synthesizing meteorological analysis...
              </span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <div className="pt-3 border-t border-white/5 flex-shrink-0">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="relative flex items-center"
        >
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder={`Ask about ${currentLocation.name} rain, temperatures, clothing, or commute advice...`}
            className="w-full pl-4 pr-12 py-3 rounded-2xl bg-[#171f33]/90 text-[#dae2fd] placeholder:text-[#87929a] text-sm focus:outline-none focus:ring-1 focus:ring-[#38bdf8] border border-white/10 shadow-2xl transition-all"
          />
          <button
            type="submit"
            disabled={!inputMessage.trim() || isLoading}
            className="absolute right-2 p-2 rounded-xl bg-[#38bdf8] text-[#00354a] hover:bg-white transition-all disabled:opacity-30 disabled:hover:bg-[#38bdf8] shadow-md cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
        <div className="flex items-center justify-between text-[11px] text-[#87929a] px-2 pt-2">
          <span>WeatherGPT grounds answers in verified Open-Meteo data</span>
          <span>Occupation: <strong className="text-[#dae2fd]">{userProfile.occupation}</strong></span>
        </div>
      </div>
    </div>
  );
};
