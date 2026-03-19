import { useRef, useState, useEffect } from 'react';
import { useBrainStore } from '../../store/useBrainStore';

export default function SearchBar() {
  const { searchQuery, setSearchQuery, searchResults, setSelectedChapter, setViewMode } =
    useBrainStore();
  const [isFocused, setIsFocused] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setIsFocused(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const showDropdown = isFocused && searchResults.length > 0;
  const displayResults = searchResults.slice(0, 10);

  return (
    <div ref={wrapperRef} className="relative">
      <div className="flex items-center gap-2 rounded-lg px-3 py-1.5"
        style={{
          background: 'rgba(255,255,255,0.06)',
          border: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        {/* Search icon */}
        <svg
          className="w-4 h-4 shrink-0"
          style={{ color: 'var(--color-text-muted)' }}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
        </svg>

        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          placeholder="Search flashcards..."
          className="bg-transparent outline-none text-sm w-48"
          style={{ color: 'var(--color-text-primary)' }}
        />

        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="shrink-0 hover:opacity-80"
            style={{ color: 'var(--color-text-muted)' }}
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {showDropdown && (
        <div
          className="absolute right-0 top-full mt-2 w-80 max-h-96 overflow-y-auto rounded-xl z-50"
          style={{
            background: 'var(--glass-bg)',
            backdropFilter: 'blur(var(--glass-blur))',
            WebkitBackdropFilter: 'blur(var(--glass-blur))',
            border: '1px solid var(--glass-border)',
            boxShadow: 'var(--glass-shadow)',
          }}
        >
          <div className="p-2">
            <div className="px-3 py-1.5 text-xs font-medium" style={{ color: 'var(--color-text-muted)' }}>
              {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} found
            </div>
            {displayResults.map((card) => (
              <button
                key={card.id}
                onClick={() => {
                  setSelectedChapter(card.chapter);
                  setViewMode('explore');
                  setIsFocused(false);
                  setSearchQuery('');
                }}
                className="w-full text-left px-3 py-2 rounded-lg transition-colors"
                style={{ color: 'var(--color-text-primary)' }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.06)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background = 'transparent';
                }}
              >
                <div className="text-sm font-medium truncate">{card.term}</div>
                <div className="text-xs mt-0.5 truncate" style={{ color: 'var(--color-text-secondary)' }}>
                  Ch. {card.chapter} &middot; {card.topic}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
