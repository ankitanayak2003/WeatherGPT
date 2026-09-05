import React, { useState } from 'react';
import { Bookmark, MapPin, Search, Plus, Trash2, Check, X, Loader2 } from 'lucide-react';
import { useWeather } from '../../context/WeatherContext';
import { searchLocations } from '../../services/api';
import { LocationInfo } from '../../types';

export const SavedLocationsModal: React.FC = () => {
  const {
    savedLocations,
    currentLocation,
    selectLocation,
    addSavedLocation,
    removeSavedLocation,
    activeModal,
    setActiveModal,
  } = useWeather();

  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState<LocationInfo[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  if (activeModal !== 'saved') return null;

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setIsSearching(true);
    try {
      const res = await searchLocations(query);
      setSearchResults(res);
    } catch (err) {
      console.warn('Location search error:', err);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelect = (loc: LocationInfo) => {
    selectLocation(loc);
    setActiveModal(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
      <div className="w-full max-w-lg rounded-2xl bg-[#171f33] border border-white/10 shadow-2xl p-6 overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#38bdf8]/20 flex items-center justify-center text-[#38bdf8]">
              <Bookmark className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#dae2fd]">Saved Locations</h2>
              <p className="text-xs text-[#87929a]">
                Manage quick-switch regional weather observation nodes
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveModal(null)}
            className="p-1.5 rounded-lg text-[#87929a] hover:text-[#dae2fd] hover:bg-[#222a3d] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search to Add */}
        <form onSubmit={handleSearch} className="relative mt-4 mb-3">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#87929a]" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search new city to add..."
            className="w-full pl-10 pr-20 py-2.5 rounded-xl bg-[#222a3d]/60 text-xs text-[#dae2fd] placeholder:text-[#87929a] focus:outline-none focus:ring-1 focus:ring-[#38bdf8] border border-white/5"
          />
          <button
            type="submit"
            disabled={!query.trim() || isSearching}
            className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3 py-1 rounded-lg bg-[#38bdf8] text-[#00354a] text-xs font-bold hover:bg-white transition-all disabled:opacity-40 flex items-center gap-1"
          >
            {isSearching ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Search'}
          </button>
        </form>

        {/* Search Results Preview */}
        {searchResults.length > 0 && (
          <div className="mb-4 p-2 bg-[#222a3d]/70 rounded-xl border border-white/10 max-h-40 overflow-y-auto space-y-1">
            <div className="text-[10px] font-bold text-[#87929a] uppercase tracking-wider px-2 py-1">
              Search Results
            </div>
            {searchResults.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between px-2.5 py-1.5 rounded-lg hover:bg-[#171f33] text-xs"
              >
                <div>
                  <span className="font-semibold text-[#dae2fd]">{item.name}</span>
                  <span className="text-[#87929a] text-[11px] ml-1.5">
                    {[item.region, item.country].filter(Boolean).join(', ')}
                  </span>
                </div>
                <button
                  onClick={() => {
                    addSavedLocation(item);
                    setSearchResults([]);
                    setQuery('');
                  }}
                  className="p-1 rounded bg-[#38bdf8]/20 text-[#38bdf8] hover:bg-[#38bdf8] hover:text-[#00354a] transition-colors"
                  title="Add to saved list"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Saved Locations List */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-1">
          {savedLocations.map((loc) => {
            const isSelected = loc.name.toLowerCase() === currentLocation.name.toLowerCase();
            return (
              <div
                key={loc.name}
                className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                  isSelected
                    ? 'bg-[#38bdf8]/15 border-[#38bdf8]/40 shadow-sm'
                    : 'bg-[#222a3d]/40 border-white/5 hover:bg-[#222a3d]/80'
                }`}
              >
                <div
                  onClick={() => handleSelect(loc)}
                  className="flex items-center gap-2.5 cursor-pointer flex-1"
                >
                  <MapPin
                    className={`w-4 h-4 ${isSelected ? 'text-[#38bdf8]' : 'text-[#87929a]'}`}
                  />
                  <div>
                    <div className="text-xs font-bold text-[#dae2fd] flex items-center gap-1.5">
                      {loc.name}
                      {isSelected && (
                        <span className="text-[10px] font-semibold text-[#38bdf8] bg-[#38bdf8]/20 px-1.5 py-0.2 rounded">
                          Active
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-[#87929a]">
                      {[loc.region, loc.country].filter(Boolean).join(', ')}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleSelect(loc)}
                    className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-[#222a3d] text-[#dae2fd] hover:bg-[#38bdf8] hover:text-[#00354a] transition-all"
                  >
                    Select
                  </button>
                  {savedLocations.length > 1 && (
                    <button
                      onClick={() => removeSavedLocation(loc.name)}
                      className="p-1.5 rounded-lg text-[#87929a] hover:text-[#ffb4ab] hover:bg-[#ffb4ab]/10 transition-colors"
                      title="Remove from saved"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-white/5 flex justify-end">
          <button
            onClick={() => setActiveModal(null)}
            className="px-4 py-2 rounded-xl bg-[#222a3d] hover:bg-white/10 text-xs font-semibold text-[#dae2fd] transition-all"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
