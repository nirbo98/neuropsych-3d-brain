import { useBrainStore } from '../../store/useBrainStore';

function getBarColor(score: number): string {
  if (score > 70) return 'var(--color-success)';
  if (score >= 40) return 'var(--color-warning)';
  return 'var(--color-danger)';
}

export default function CognitiveDashboard() {
  const { viewMode, domains, clearAllLesions, activeLesions } = useBrainStore();

  if (viewMode !== 'lesion') return null;

  return (
    <div
      className="fixed bottom-3 left-[296px] right-3 z-40 glass-panel animate-slide-up"
      style={{ height: 120 }}
    >
      <div className="h-full flex items-center px-4 gap-3">
        {/* Domain cards */}
        <div className="flex-1 flex items-center gap-2 overflow-x-auto py-2">
          {domains.map((domain) => {
            const barColor = getBarColor(domain.currentScore);
            const changed = domain.currentScore < domain.baselineScore;
            return (
              <div
                key={domain.id}
                className="shrink-0 flex flex-col gap-1.5 px-3 py-2 rounded-xl"
                style={{
                  minWidth: 110,
                  background: changed ? 'rgba(255,255,255,0.04)' : 'transparent',
                  border: changed ? '1px solid rgba(255,255,255,0.06)' : '1px solid transparent',
                }}
              >
                <div className="flex items-center gap-1.5">
                  <span className="text-sm">{domain.icon}</span>
                  <span
                    className="text-xs font-medium truncate"
                    style={{ color: 'var(--color-text-secondary)' }}
                  >
                    {domain.name}
                  </span>
                </div>

                {/* Score bar */}
                <div className="flex items-center gap-2">
                  <div
                    className="flex-1 h-2 rounded-full overflow-hidden"
                    style={{ background: 'rgba(255,255,255,0.08)' }}
                  >
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${domain.currentScore}%`,
                        background: barColor,
                        transition: 'width 0.5s ease, background 0.5s ease',
                        boxShadow: `0 0 6px ${barColor}40`,
                      }}
                    />
                  </div>
                  <span
                    className="text-xs font-mono font-semibold shrink-0 w-7 text-right"
                    style={{ color: barColor }}
                  >
                    {domain.currentScore}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Clear all button */}
        {activeLesions.length > 0 && (
          <button
            onClick={clearAllLesions}
            className="shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors"
            style={{
              background: 'rgba(239,68,68,0.12)',
              color: 'var(--color-danger)',
              border: '1px solid rgba(239,68,68,0.25)',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = 'rgba(239,68,68,0.2)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = 'rgba(239,68,68,0.12)';
            }}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Clear All
          </button>
        )}
      </div>
    </div>
  );
}
