import { useBrainStore } from '../../store/useBrainStore';
import type { ViewMode } from '../../types/brain.types';
import SearchBar from './SearchBar';

const modes: { key: ViewMode; label: string; icon: string }[] = [
  { key: 'explore', label: 'Explore', icon: 'M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z' },
  { key: 'lesion', label: 'Lesion', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
  { key: 'quiz', label: 'Quiz', icon: 'M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
  { key: 'flashcards', label: 'Flashcards', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' },
];

export default function TopBar() {
  const { viewMode, setViewMode } = useBrainStore();

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-5"
      style={{
        height: 56,
        background: 'var(--glass-bg)',
        backdropFilter: 'blur(var(--glass-blur))',
        WebkitBackdropFilter: 'blur(var(--glass-blur))',
        borderBottom: '1px solid var(--glass-border)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
      }}
    >
      {/* Title */}
      <div className="flex items-center gap-2.5 shrink-0">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center text-lg"
          style={{ background: 'var(--color-accent)', color: '#fff' }}
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </div>
        <span className="text-base font-semibold tracking-tight" style={{ color: 'var(--color-text-primary)' }}>
          NeuroExplorer 3D
        </span>
      </div>

      {/* Mode Buttons */}
      <nav className="flex items-center gap-1 rounded-xl p-1" style={{ background: 'rgba(255,255,255,0.04)' }}>
        {modes.map((mode) => {
          const isActive = viewMode === mode.key;
          return (
            <button
              key={mode.key}
              onClick={() => setViewMode(mode.key)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all duration-200"
              style={{
                background: isActive ? 'var(--color-accent)' : 'transparent',
                color: isActive ? '#fff' : 'var(--color-text-secondary)',
              }}
              onMouseEnter={(e) => {
                if (!isActive) (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.06)';
              }}
              onMouseLeave={(e) => {
                if (!isActive) (e.currentTarget as HTMLElement).style.background = 'transparent';
              }}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d={mode.icon} />
              </svg>
              {mode.label}
            </button>
          );
        })}
      </nav>

      {/* Search */}
      <SearchBar />
    </header>
  );
}
