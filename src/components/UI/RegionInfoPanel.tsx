import { useBrainStore } from '../../store/useBrainStore';
import { getRegionById } from '../../data/brainRegions';

export default function RegionInfoPanel() {
  const {
    selectedRegionId,
    selectRegion,
    viewMode,
    activeLesions,
    addLesion,
    removeLesion,
    updateLesionSeverity,
    setSelectedChapter,
    chapters,
  } = useBrainStore();

  if (!selectedRegionId) return null;

  const region = getRegionById(selectedRegionId);
  if (!region) return null;

  const lesion = activeLesions.find((l) => l.regionId === selectedRegionId);
  const isLesioned = !!lesion;

  return (
    <div
      className="fixed right-3 top-[68px] bottom-3 z-40 flex flex-col glass-panel overflow-hidden animate-slide-up"
      style={{ width: 320 }}
    >
      {/* Header */}
      <div className="shrink-0 px-4 pt-4 pb-3 flex items-start justify-between gap-3"
        style={{ borderBottom: '1px solid var(--glass-border)' }}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div
            className="w-3 h-3 rounded-full shrink-0"
            style={{ background: region.color, boxShadow: `0 0 8px ${region.color}60` }}
          />
          <h2 className="text-base font-semibold leading-tight" style={{ color: 'var(--color-text-primary)' }}>
            {region.name}
          </h2>
        </div>
        <button
          onClick={() => selectRegion(null)}
          className="shrink-0 w-7 h-7 rounded-lg flex items-center justify-center transition-colors"
          style={{ color: 'var(--color-text-muted)' }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.08)';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.background = 'transparent';
          }}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-4">
        {/* Functions */}
        <section>
          <h3 className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--color-text-muted)' }}>
            Functions
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {region.functions.map((fn) => (
              <span
                key={fn}
                className="px-2 py-1 rounded-md text-xs font-medium"
                style={{
                  background: `${region.color}18`,
                  color: region.color,
                  border: `1px solid ${region.color}30`,
                }}
              >
                {fn}
              </span>
            ))}
          </div>
        </section>

        {/* Clinical Notes */}
        <section>
          <h3 className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--color-text-muted)' }}>
            Clinical Notes
          </h3>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
            {region.clinicalNotes}
          </p>
        </section>

        {/* Associated Chapters */}
        <section>
          <h3 className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--color-text-muted)' }}>
            Chapters
          </h3>
          <div className="flex flex-col gap-1">
            {region.chapters.map((chNum) => {
              const ch = chapters.find((c) => c.chapter === chNum);
              if (!ch) return null;
              return (
                <button
                  key={chNum}
                  onClick={() => setSelectedChapter(chNum)}
                  className="flex items-center gap-2 px-2.5 py-2 rounded-lg text-left transition-colors"
                  style={{ color: 'var(--color-text-secondary)' }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.05)';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.background = 'transparent';
                  }}
                >
                  <span className="text-sm">{ch.icon}</span>
                  <span className="text-sm">
                    <span className="font-semibold" style={{ color: ch.color }}>Ch. {chNum}</span>
                    {' '}&mdash; {ch.topic}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Brodmann areas */}
        {region.brodmannAreas && region.brodmannAreas.length > 0 && (
          <section>
            <h3 className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--color-text-muted)' }}>
              Brodmann Areas
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {region.brodmannAreas.map((ba) => (
                <span
                  key={ba}
                  className="px-2 py-0.5 rounded text-xs font-mono"
                  style={{ background: 'rgba(255,255,255,0.06)', color: 'var(--color-text-secondary)' }}
                >
                  BA {ba}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Lesion controls (only in lesion mode) */}
        {viewMode === 'lesion' && (
          <section
            className="rounded-xl p-3"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)' }}
          >
            <h3 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--color-text-muted)' }}>
              Lesion Simulation
            </h3>

            {isLesioned ? (
              <div className="flex flex-col gap-3">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-medium" style={{ color: 'var(--color-text-secondary)' }}>
                      Severity
                    </span>
                    <span className="text-xs font-mono font-semibold" style={{ color: 'var(--color-danger)' }}>
                      {lesion.severity}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={100}
                    value={lesion.severity}
                    onChange={(e) => updateLesionSeverity(selectedRegionId, parseInt(e.target.value))}
                    className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, var(--color-danger) ${lesion.severity}%, rgba(255,255,255,0.1) ${lesion.severity}%)`,
                    }}
                  />
                </div>
                <button
                  onClick={() => removeLesion(selectedRegionId)}
                  className="w-full py-2 rounded-lg text-sm font-medium transition-colors"
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
                  Remove Lesion
                </button>
              </div>
            ) : (
              <button
                onClick={() => addLesion(selectedRegionId)}
                className="w-full py-2 rounded-lg text-sm font-medium transition-colors"
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
                + Add Lesion
              </button>
            )}
          </section>
        )}
      </div>
    </div>
  );
}
